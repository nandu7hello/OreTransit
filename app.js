import { html, render, useState, useRef, useEffect } from "./vendor/preact-standalone.module.js";
import {
  ROUTES,
  ROUTE_KEYS,
  ROUTE_MAP_VIEW,
  OVERVIEW_STOPS,
  PLACES,
  HOME_ROUTE_CARDS,
  geoToMap,
  transferStop,
} from "./data.js";
import {
  SCHEDULE,
  SERVICE_HOURS,
  tripTimes,
  nextDepartures,
  nextTrip,
  lastDeparture,
  fromMinutes,
  nowInGolden,
} from "./schedule.js";

const LOGO = "assets/ore-cart-logo.png";
const OVERVIEW_MAP = "assets/all-routes-map.png";

// Where "You" is assumed to be while location is off: Kafadar Commons (campus centre).
const FALLBACK_POS = { lat: 39.751262, lon: -105.221515 };

// Stop indices where a rider changes between two routes.
const TRANSFERS = {
  "gold-tungsten": { gold: 2, tungsten: 4 }, // 11th & Miners Alley
  "gold-silver": { gold: 0, silver: 6 }, // Guggenheim
  "silver-tungsten": { silver: 4, tungsten: 3 }, // Kafadar
};

/* ---------- Icons ---------- */

const ICONS = {
  arrow: html`<path d="M5 12h14m-5-5 5 5-5 5" />`,
  back: html`<path d="m15 18-6-6 6-6" />`,
  calendar: html`<rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 10h18" />`,
  clock: html`<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />`,
  home: html`<path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" />`,
  info: html`<circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" />`,
  map: html`<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15m6-12v15" />`,
  pin: html`<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" />`,
  routes: html`<circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h0a4 4 0 0 0-4 4v0h8" />`,
  star: html`<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />`,
  walk: html`<circle cx="12" cy="4" r="2" /><path d="m10 22 2-7 2 2v5M7 13l2-6 4-1 3 4 3 1M9 8l1 6-3 3" />`,
  x: html`<path d="m6 6 12 12M18 6 6 18" />`,
  gps: html`<circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" /><circle cx="12" cy="12" r="8" />`,
};

function Icon({ name, size = 20 }) {
  return html`<svg
    width=${size}
    height=${size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${ICONS[name]}
  </svg>`;
}

/* ---------- Geography helpers ---------- */

function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Street walking: straight-line distance × 1.3 detour factor at 80 m/min (about 3 mph).
function walkMinutes(a, b) {
  return Math.max(1, Math.ceil((distanceMeters(a, b) * 1.3) / 80));
}

function closestStopOnRoute(routeKey, pos) {
  const route = ROUTES[routeKey];
  let best = { index: 0, minutes: Infinity };
  route.stops.forEach((stop, index) => {
    const minutes = walkMinutes(pos, stop);
    if (minutes < best.minutes) best = { index, minutes };
  });
  return best;
}

function inMap(p) {
  return p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100;
}

function minutesLabel(target, now) {
  const d = target - now;
  if (d <= 0) return "now";
  if (d === 1) return "1 min";
  if (d < 60) return `${d} min`;
  return fromMinutes(target);
}

/* ---------- Hooks ---------- */

// Location states: idle (not asked yet), asking, on, denied (user/OS blocked it),
// timeout (allowed but no fix yet), unavailable (no GPS API or insecure page).
function useGeolocation() {
  const [loc, setLoc] = useState({ status: "idle", pos: null, accuracy: null });
  const watchId = useRef(null);
  const secure = typeof window !== "undefined" && (window.isSecureContext || location.hostname === "localhost");

  const onFix = (p) => setLoc({ status: "on", pos: { lat: p.coords.latitude, lon: p.coords.longitude }, accuracy: p.coords.accuracy });
  const onError = (err) =>
    setLoc((l) => {
      if (err.code === 1) return { status: "denied", pos: null, accuracy: null };
      if (l.status === "on") return l; // keep the last good fix on a transient error
      return { status: err.code === 3 ? "timeout" : "unavailable", pos: null, accuracy: null };
    });

  // Must be called from a tap on iOS/Android so the permission prompt is shown.
  const start = () => {
    if (!("geolocation" in navigator) || !secure) {
      setLoc({ status: "unavailable", pos: null, accuracy: null });
      return;
    }
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    setLoc((l) => ({ ...l, status: "asking" }));
    // Quick coarse fix first (Wi-Fi/cell), then keep a precise watch running.
    navigator.geolocation.getCurrentPosition(onFix, onError, { enableHighAccuracy: false, maximumAge: 60000, timeout: 12000 });
    watchId.current = navigator.geolocation.watchPosition(onFix, onError, { enableHighAccuracy: true, maximumAge: 5000, timeout: 45000 });
  };

  useEffect(() => {
    // Start automatically only when permission was already granted; otherwise wait for a tap.
    if (!("geolocation" in navigator) || !secure) {
      setLoc({ status: "unavailable", pos: null, accuracy: null });
      return;
    }
    let cancelled = false;
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((res) => {
          if (cancelled) return;
          if (res.state === "granted") start();
          else if (res.state === "denied") setLoc({ status: "denied", pos: null, accuracy: null });
          res.onchange = () => {
            if (res.state === "granted") start();
            else if (res.state === "denied") setLoc({ status: "denied", pos: null, accuracy: null });
          };
        })
        .catch(() => start());
    } else {
      start(); // older Safari: no Permissions API, ask straight away
    }
    return () => {
      cancelled = true;
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return { ...loc, retry: start };
}

function useClock() {
  const [now, setNow] = useState(nowInGolden());
  useEffect(() => {
    const id = setInterval(() => setNow(nowInGolden()), 20000);
    const onVisible = () => document.visibilityState === "visible" && setNow(nowInGolden());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return now;
}

/* ---------- Pan / zoom (drag + pinch) ---------- */

function usePanZoom(view, setView, { min = 1, max = 2.5 } = {}) {
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const clampZoom = (z) => Math.min(max, Math.max(min, z));

  const onPointerDown = (e) => {
    if (e.target.closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 1) {
      gesture.current = { kind: "pan", startX: e.clientX, startY: e.clientY, panX: view.x, panY: view.y };
    } else if (pts.length === 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = { kind: "pinch", startDist: dist, startZoom: view.zoom };
    }
  };
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (g.kind === "pan") {
      setView((v) => ({ ...v, x: g.panX + e.clientX - g.startX, y: g.panY + e.clientY - g.startY }));
    } else {
      const pts = [...pointers.current.values()];
      if (pts.length < 2) return;
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      setView((v) => ({ ...v, zoom: clampZoom((g.startZoom * dist) / g.startDist) }));
    }
  };
  const end = (e) => {
    pointers.current.delete(e.pointerId);
    gesture.current = null;
  };
  const zoomBy = (delta) => setView((v) => ({ ...v, zoom: clampZoom(v.zoom + delta) }));
  return { handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end }, zoomBy };
}

const transformStyle = (v) => ({ transform: `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.zoom})` });

function tripPath(a, b) {
  const mid = Math.min(a.y, b.y) + Math.abs(a.y - b.y) * 0.42;
  return `M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
}

/* ---------- "You" marker ---------- */

function YouMarker({ fitKey, pos, live, className, label }) {
  if (!pos) return null;
  const p = geoToMap(fitKey, pos.lat, pos.lon);
  if (!inMap(p)) return null;
  return html`<span class=${`${className} ${live ? "live" : "assumed"}`} style=${{ left: `${p.x}%`, top: `${p.y}%` }}>
    <span class=${className === "home-location" ? "home-location-ring" : ""}>${className === "home-location" ? html`<i></i>` : ""}</span>
    <b>${label}</b>
  </span>`;
}

/* ---------- Home hero map (all routes) ---------- */

function HomeMap({ selectedStops, onSelectStop, pos, live }) {
  const box = useRef(null);
  const [view, setView] = useState({ zoom: 1.18, x: -24, y: -12 });
  const { handlers, zoomBy } = usePanZoom(view, setView, { max: 2.1 });
  const reset = () => {
    const w = box.current?.clientWidth ?? 490;
    setView({ zoom: 1.18, x: w * -0.05, y: w * -0.025 });
  };

  return html`<div class="home-interactive-map" ref=${box} ...${handlers}>
    <div class="home-overview-canvas" style=${transformStyle(view)}>
      <img src=${OVERVIEW_MAP} alt="Map of the Gold, Silver, and Tungsten Ore Cart routes" draggable="false" />
      <${YouMarker} fitKey="overview" pos=${pos} live=${live} className="home-location" label=${live ? "YOU" : "CAMPUS (location off)"} />
      ${selectedStops.length === 2 &&
      html`<svg class="map-trip-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d=${tripPath(OVERVIEW_STOPS[selectedStops[0].route][selectedStops[0].index], OVERVIEW_STOPS[selectedStops[1].route][selectedStops[1].index])} />
      </svg>`}
      ${ROUTE_KEYS.flatMap((key) =>
        OVERVIEW_STOPS[key].map((p, i) => {
          const route = ROUTES[key];
          const stop = route.stops[i];
          const sel = selectedStops.findIndex((s) => s.route === key && s.index === i);
          return html`<button
            key=${`${key}-${stop.name}`}
            type="button"
            class=${`home-stop-marker ${sel >= 0 ? "selected" : ""}`}
            style=${{ left: `${p.x}%`, top: `${p.y}%`, "--route": route.color }}
            onClick=${() => onSelectStop({ route: key, index: i })}
            aria-label=${`${sel === 0 ? "Starting at" : sel === 1 ? "Ending at" : "Select"} ${stop.name} on the ${route.name}`}
          >
            ${sel >= 0 && html`<b>${sel + 1}</b>`}
            <span>${stop.name}</span>
          </button>`;
        }),
      )}
    </div>
    <div class="home-map-controls">
      <button type="button" onClick=${() => zoomBy(0.2)} aria-label="Zoom in">+</button>
      <button type="button" onClick=${() => zoomBy(-0.2)} aria-label="Zoom out">−</button>
      <button type="button" onClick=${reset} aria-label="Reset map position"><${Icon} name="pin" size=${16} /></button>
    </div>
    <div class="home-drag-hint"><${Icon} name="map" size=${14} /> Drag to explore</div>
  </div>`;
}

/* ---------- Single-route map ---------- */

function RouteMap({ routeKey, selectedStops, onSelect, compact = false, pos, live }) {
  const route = ROUTES[routeKey];
  const box = useRef(null);
  const [view, setView] = useState({ zoom: ROUTE_MAP_VIEW[routeKey].zoom, x: 0, y: 0 });
  const { handlers, zoomBy } = usePanZoom(view, setView, { max: 2.6 });
  const reset = () => {
    const w = box.current?.clientWidth ?? 420;
    const v = ROUTE_MAP_VIEW[routeKey];
    setView({ zoom: v.zoom, x: w * v.x, y: w * v.y });
  };
  useEffect(reset, [routeKey]);

  return html`<div ref=${box} class=${`interactive-map ${compact ? "compact" : ""}`} ...${handlers}>
    <div class="map-canvas" style=${{ aspectRatio: route.aspect, ...transformStyle(view) }}>
      <img src=${route.map} alt=${`${route.name} official shuttle map`} draggable="false" />
      <${YouMarker} fitKey=${routeKey} pos=${pos} live=${live} className="user-location" label=${live ? "You" : "Campus"} />
      ${route.stops.map((stop, i) => {
        const sel = selectedStops.indexOf(i);
        return html`<button
          key=${stop.name}
          type="button"
          class=${`stop-marker ${sel >= 0 ? "selected" : ""}`}
          style=${{ left: `${stop.x}%`, top: `${stop.y}%`, "--route": route.color }}
          onClick=${() => onSelect?.(i)}
          aria-label=${`${sel === 0 ? "Starting stop" : sel === 1 ? "Destination" : "Select"} ${stop.name}`}
        >
          ${sel >= 0 ? sel + 1 : ""}<span>${stop.name}</span>
        </button>`;
      })}
    </div>
    <div class="map-controls">
      <button type="button" onClick=${() => zoomBy(0.2)} aria-label="Zoom in">+</button>
      <button type="button" onClick=${() => zoomBy(-0.2)} aria-label="Zoom out">−</button>
      <button type="button" onClick=${reset} aria-label="Reset map position"><${Icon} name="pin" size=${15} /></button>
    </div>
    <div class="drag-hint"><${Icon} name="map" size=${13} /> Drag to move</div>
  </div>`;
}

/* ---------- Shared pieces ---------- */

function ScreenHeader({ eyebrow, title, onBack, backLabel }) {
  return html`<header class="journey-header">
    <button type="button" class="icon-button" onClick=${onBack} aria-label=${backLabel}><${Icon} name="back" /></button>
    <div>
      <p class="today">${eyebrow}</p>
      <h1>${title}</h1>
    </div>
    <div class="corner-brand" aria-label="Ore Cart"><img src=${LOGO} alt="" /></div>
  </header>`;
}

function BottomNav({ active, onHome, onExplore, onSchedule }) {
  const item = (key, icon, label, handler) =>
    html`<button type="button" class=${active === key ? "active" : ""} onClick=${handler} aria-current=${active === key ? "page" : undefined}>
      <${Icon} name=${icon} /><span>${label}</span>
    </button>`;
  return html`<nav class="bottom-nav" aria-label="Main navigation">
    ${item("home", "home", "Home", onHome)} ${item("explore", "map", "Explore", onExplore)} ${item("schedule", "calendar", "Schedule", onSchedule)}
  </nav>`;
}

function LocationNote({ geo, className }) {
  const [help, setHelp] = useState(false);
  const label = {
    on: `GPS ±${Math.round(geo.accuracy ?? 0)} m`,
    asking: "Locating…",
    idle: "Use my location",
    denied: "Location blocked",
    timeout: "No GPS fix · retry",
    unavailable: "Location unavailable",
  }[geo.status];
  const onTap = () => {
    if (geo.status === "on" || geo.status === "asking") return;
    if (geo.status === "denied" || geo.status === "unavailable") setHelp(true);
    else geo.retry();
  };
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  return html`<button type="button" class=${`${className} compact ${geo.status === "on" ? "live" : ""}`} onClick=${onTap} aria-label=${label}>
      <${Icon} name=${geo.status === "on" ? "gps" : geo.status === "idle" ? "pin" : "info"} size=${14} /> ${label}
    </button>
    ${help &&
    html`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Turn on location">
      <div class="sheet help-sheet">
        <div class="sheet-handle"></div>
        <header>
          <span></span>
          <div><small>Location</small><h2>Turn on location</h2></div>
          <button type="button" class="icon-button" onClick=${() => setHelp(false)} aria-label="Close"><${Icon} name="x" /></button>
        </header>
        <div class="help-body">
          ${geo.status === "unavailable"
            ? html`<p>This page can't use GPS. Location only works on a secure https:// address or when installed from one, and not inside the claude.ai preview.</p>`
            : ios
              ? html`<p>Location was declined for this site, so the browser won't ask again. To allow it:</p>
                  <ol>
                    <li>In Safari, tap the <b>AA</b> (or <b>⋯</b>) button in the address bar, then <b>Website Settings</b>, and set <b>Location</b> to <b>Allow</b>.</li>
                    <li>If it's greyed out, open <b>Settings → Privacy & Security → Location Services</b>, make sure it is on, then set <b>Safari Websites</b> to <b>While Using the App</b>.</li>
                    <li>If you added OreTransit to your Home Screen, the same setting is under <b>Settings → Safari → Location</b>.</li>
                  </ol>`
              : html`<p>Location was declined for this site, so the browser won't ask again. To allow it:</p>
                  <ol>
                    <li>Tap the <b>lock</b> (or tune) icon next to the address, then <b>Permissions</b> → <b>Location</b> → <b>Allow</b>.</li>
                    <li>Make sure your phone's Location is switched on and Chrome is allowed to use it in <b>Settings → Apps → Chrome → Permissions</b>.</li>
                  </ol>`}
          <p>Then reload the page and tap <b>Use my location</b>.</p>
          <button type="button" class="end-trip-button" onClick=${() => { setHelp(false); geo.retry(); }}>Try again now</button>
        </div>
      </div>
    </div>`}`;
}

/* ---------- App ---------- */

function App() {
  const [routeKey, setRouteKey] = useState("gold");
  const [sheet, setSheet] = useState(null); // null | "map" | "schedule"
  const [sheetDay, setSheetDay] = useState(null); // null = today
  const [selectedStops, setSelectedStops] = useState([]);
  const [journey, setJourney] = useState(false);
  const [routeExplore, setRouteExplore] = useState(false);
  const [mapScreen, setMapScreen] = useState(false);
  const [focusStop, setFocusStop] = useState(null);
  const [focusPlace, setFocusPlace] = useState(null);
  const [overview, setOverview] = useState({ zoom: 1, x: 0, y: 0 });
  const [routeFocus, setRouteFocus] = useState("all");
  const [mapTrip, setMapTrip] = useState([]);
  const [mapTripDetail, setMapTripDetail] = useState(false);

  const geo = useGeolocation();
  const now = useClock();
  const live = geo.status === "on";
  const pos = live ? geo.pos : FALLBACK_POS;
  const day = now.day;

  const route = ROUTES[routeKey];
  const startStop = selectedStops[0] === undefined ? null : route.stops[selectedStops[0]];
  const endStop = selectedStops[1] === undefined ? null : route.stops[selectedStops[1]];

  // Closest stop on every route from the current position.
  const closestByRoute = Object.fromEntries(ROUTE_KEYS.map((k) => [k, closestStopOnRoute(k, pos)]));
  const closestKey = ROUTE_KEYS.reduce((best, k) => (closestByRoute[k].minutes < closestByRoute[best].minutes ? k : best), "gold");
  const closest = ROUTES[closestKey];

  const overviewPan = usePanZoom(overview, setOverview, { max: 2.5 });

  const toggleStop = (i) => {
    setJourney(false);
    setSelectedStops((s) => (s.length >= 2 ? [i] : s[0] === i ? [] : [...s, i]));
  };
  const pickMapStop = (sel) => {
    setFocusStop(sel);
    setMapTrip((t) => (t.length === 0 || t.length === 2 ? [sel] : t[0].route === sel.route && t[0].index === sel.index ? [] : [t[0], sel]));
  };
  const goHome = () => {
    setRouteExplore(false);
    setMapScreen(false);
    setJourney(false);
    setMapTripDetail(false);
  };
  const goExplore = () => {
    setRouteExplore(false);
    setJourney(false);
    setMapTripDetail(false);
    setMapScreen(true);
  };
  const goSchedule = () => {
    setSheetDay(null);
    setSheet("schedule");
  };

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  useEffect(() => {
    const onPop = () => {
      if (sheet) setSheet(null);
      else if (journey) setJourney(false);
      else if (mapTripDetail) setMapTripDetail(false);
      else if (routeExplore) setRouteExplore(false);
      else if (mapScreen) setMapScreen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [sheet, journey, mapTripDetail, routeExplore, mapScreen]);
  useEffect(() => {
    if (sheet || journey || mapTripDetail || routeExplore || mapScreen) history.pushState({ layer: true }, "");
  }, [sheet, journey, mapTripDetail, routeExplore, mapScreen]);

  // Plan a single-route trip with real schedule times.
  function planTrip(key, fromIndex, toIndex, afterMinutes = now.minutes) {
    const walk = walkMinutes(pos, ROUTES[key].stops[fromIndex]);
    const trip = nextTrip(key, fromIndex, toIndex, day, afterMinutes + walk);
    return { walk, trip };
  }

  /* ----- Journey (trip in progress) ----- */
  if (journey && startStop && endStop) {
    const { walk, trip } = planTrip(routeKey, selectedStops[0], selectedStops[1]);
    const walkDirect = walkMinutes(startStop, endStop) + walk;
    const wait = trip ? trip.depart.minutes - now.minutes : null;
    return html`<main class="phone-app journey-screen">
      <${ScreenHeader} eyebrow="Trip in progress" title="On the way." onBack=${() => setJourney(false)} backLabel="Return to trip planning" />
      <section class="arrival-banner">
        <div class="arrival-icon" style=${{ background: route.color }}>${route.shortName.charAt(0)}</div>
        <div>
          <span>${route.name}</span>
          <strong>${trip ? `Shuttle leaves in ${minutesLabel(trip.depart.minutes, now.minutes)}` : "No more departures today"}</strong>
        </div>
        <time>${trip ? fromMinutes(trip.depart.minutes) : "—"}</time>
      </section>
      <section class="journey-map">
        <${RouteMap} routeKey=${routeKey} selectedStops=${selectedStops} compact=${true} pos=${pos} live=${live} />
        <div class="journey-map-label"><span class=${`live-dot ${live ? "" : "off"}`}></span> ${live ? "Live location" : "Location off"}</div>
      </section>
      <section class="next-step-card">
        <div class="step-symbol"><${Icon} name="pin" size=${22} /></div>
        <div>
          <span>First step</span>
          <h2>Walk to ${startStop.name}</h2>
          <p>About a ${walk} minute walk from ${live ? "your location" : "campus"}${trip ? `. Scheduled departure ${fromMinutes(trip.depart.minutes)}${trip.depart.estimated ? " (estimated)" : ""}.` : "."}</p>
        </div>
        <strong>${walk} min</strong>
      </section>
      <section class="travel-compare">
        <div class="compare-heading">
          <span>Best way there</span>
          <p>${startStop.name} → ${endStop.name}</p>
        </div>
        <div class="compare-options">
          <div class=${trip && walk + wait + trip.ride <= walkDirect ? "recommended" : ""}>
            <span><${Icon} name="routes" size=${19} /> Ore Cart</span>
            <strong>${trip ? `${walk + wait + trip.ride} min` : "—"}</strong>
            <small>${trip ? `${walk} min walk · ${wait} min wait · ${trip.ride} min ride` : "Service has ended for today"}</small>
            ${trip && walk + wait + trip.ride <= walkDirect && html`<b>Fastest</b>`}
          </div>
          <div class=${!trip || walk + wait + trip.ride > walkDirect ? "recommended" : ""}>
            <span><${Icon} name="pin" size=${19} /> Walk</span>
            <strong>${walkDirect} min</strong>
            <small>About ${((distanceMeters(pos, startStop) + distanceMeters(startStop, endStop)) / 1609).toFixed(1)} miles</small>
            ${(!trip || walk + wait + trip.ride > walkDirect) && html`<b>Fastest</b>`}
          </div>
        </div>
      </section>
      <section class="journey-stops">
        <div><span class="timeline-dot active"></span><p><small>Board at ${trip ? fromMinutes(trip.depart.minutes) : ""}</small><strong>${startStop.name}</strong></p></div>
        <div><span class="timeline-dot"></span><p><small>Exit at ${trip ? fromMinutes(trip.arrive.minutes) : ""}</small><strong>${endStop.name}</strong></p></div>
      </section>
      <button type="button" class="end-trip-button" onClick=${() => setJourney(false)}>Back to route planner</button>
    </main>`;
  }

  /* ----- Map trip detail ----- */
  if (mapTripDetail && mapTrip.length === 2) {
    const [a, b] = mapTrip;
    const ra = ROUTES[a.route];
    const rb = ROUTES[b.route];
    const sa = ra.stops[a.index];
    const sb = rb.stops[b.index];
    const pa = OVERVIEW_STOPS[a.route][a.index];
    const pb = OVERVIEW_STOPS[b.route][b.index];
    const transfer = a.route !== b.route;
    const via = transferStop(a.route, b.route);
    const walk = walkMinutes(pos, sa);
    let leg1 = null;
    let leg2 = null;
    if (transfer) {
      const t = TRANSFERS[[a.route, b.route].sort().join("-")];
      leg1 = nextTrip(a.route, a.index, t[a.route], day, now.minutes + walk);
      leg2 = leg1 ? nextTrip(b.route, t[b.route], b.index, day, leg1.arrive.minutes + 1) : null;
    } else {
      leg1 = nextTrip(a.route, a.index, b.index, day, now.minutes + walk);
    }
    const arrival = transfer ? leg2?.arrive : leg1?.arrive;
    const total = arrival ? arrival.minutes - now.minutes : null;
    const fmt = (t) => (t ? `${fromMinutes(t.minutes)}${t.estimated ? "~" : ""}` : "—");

    return html`<main class="phone-app map-trip-detail-screen">
      <${ScreenHeader} eyebrow="Your map trip" title=${transfer ? "One simple transfer." : "A direct ride."} onBack=${() => setMapTripDetail(false)} backLabel="Return to map" />
      <section class="detail-route-banner">
        <div class="detail-route-badges">
          <span style=${{ background: ra.color }}>${ra.shortName.charAt(0)}</span>
          ${transfer && html`<${Icon} name="arrow" size=${15} /><span style=${{ background: rb.color }}>${rb.shortName.charAt(0)}</span>`}
        </div>
        <div><small>Door to door</small><strong>${total !== null ? `${total} min` : "No service"}</strong></div>
        <div><small>Next shuttle</small><strong>${fmt(leg1?.depart)}</strong></div>
      </section>
      <section class="trip-detail-map">
        <div class="trip-detail-map-canvas">
          <img src=${OVERVIEW_MAP} alt=${`Map from ${sa.name} to ${sb.name}`} />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d=${tripPath(pa, pb)} /></svg>
          <span class="detail-map-point start" style=${{ left: `${pa.x}%`, top: `${pa.y}%`, background: ra.color }}>1</span>
          <span class="detail-map-point end" style=${{ left: `${pb.x}%`, top: `${pb.y}%`, background: rb.color }}>2</span>
        </div>
      </section>
      <section class="trip-overview-card">
        <span>Trip overview</span>
        <h2>${sa.name} <${Icon} name="arrow" size=${16} /> ${sb.name}</h2>
        <p>${transfer ? `${ra.name} to ${rb.name}` : ra.name}${arrival ? ` · arrive ${fmt(arrival)}` : " · no more trips today"}</p>
      </section>
      <section class="trip-steps">
        <div class="trip-step">
          <span class="step-node walk"><${Icon} name="pin" size=${16} /></span>
          <div>
            <small>Walk · about ${walk} min</small>
            <h3>Walk to ${sa.name}</h3>
            <p>Your starting stop is marked as point 1 on the map.</p>
          </div>
        </div>
        <div class="trip-step">
          <span class="step-node" style=${{ background: ra.color }}>${ra.shortName.charAt(0)}</span>
          <div>
            <small>${leg1 ? `Board at ${fmt(leg1.depart)} · ${leg1.ride} min ride` : "No departure left today"}</small>
            <h3>Take the ${ra.name}</h3>
            <p>Board at ${sa.name}${transfer ? ` and ride toward ${via}.` : ` and remain on board until ${sb.name}.`}</p>
          </div>
        </div>
        ${transfer &&
        html`<div class="trip-step transfer">
            <span class="step-node transfer-node"><${Icon} name="routes" size=${16} /></span>
            <div>
              <small>${leg1 && leg2 ? `Arrive ${fmt(leg1.arrive)} · wait ${leg2.depart.minutes - leg1.arrive.minutes} min` : "Transfer"}</small>
              <h3>Change at ${via}</h3>
              <p>Exit the ${ra.shortName} Route and wait for the ${rb.shortName} Route at the same stop.</p>
            </div>
          </div>
          <div class="trip-step">
            <span class="step-node" style=${{ background: rb.color }}>${rb.shortName.charAt(0)}</span>
            <div>
              <small>${leg2 ? `Board at ${fmt(leg2.depart)} · ${leg2.ride} min ride` : "No connection left today"}</small>
              <h3>Board the ${rb.name}</h3>
              <p>Stay on until ${sb.name}. The driver announces each stop.</p>
            </div>
          </div>`}
        <div class="trip-step final">
          <span class="step-node final-node"><${Icon} name="pin" size=${16} /></span>
          <div>
            <small>${arrival ? `Arrive ${fmt(arrival)}` : "Arrive"}</small>
            <h3>Exit at ${sb.name}</h3>
            <p>Your destination is marked as point 2 on the map.</p>
          </div>
        </div>
      </section>
      <p class="schedule-note"><${Icon} name="info" size=${14} /> Times come from the published Ore Cart timetable, not live tracking. A ~ marks a stop without a posted time.</p>
      <button type="button" class="start-map-trip" onClick=${() => setMapTripDetail(false)}>Back to map <${Icon} name="map" size=${17} /></button>
    </main>`;
  }

  /* ----- Explore one route ----- */
  if (routeExplore) {
    const plan = startStop && endStop ? planTrip(routeKey, selectedStops[0], selectedStops[1]) : null;
    return html`<main class="phone-app route-explore-screen">
      <${ScreenHeader} eyebrow=${route.name} title="Explore this route." onBack=${() => setRouteExplore(false)} backLabel="Return home" />
      <div class="explore-route-intro">
        <${Icon} name="map" size=${17} />
        <p><strong>Build your trip on the map</strong><span>Tap one stop to start, then another for your destination.</span></p>
      </div>
      <section class="explore-route-map">
        <${RouteMap} routeKey=${routeKey} selectedStops=${selectedStops} onSelect=${toggleStop} pos=${pos} live=${live} />
      </section>
      <section class="explore-route-builder">
        <div class="explore-builder-head">
          <div>
            <small>Your route</small>
            <h2>${selectedStops.length === 0 ? "Choose a starting stop" : selectedStops.length === 1 ? "Choose your destination" : "Your trip is ready"}</h2>
          </div>
          ${selectedStops.length > 0 && html`<button type="button" onClick=${() => setSelectedStops([])}>Clear</button>`}
        </div>
        <div class=${`explore-builder-stop ${startStop ? "filled" : ""}`}>
          <span>1</span>
          <p><small>Starting stop</small><strong>${startStop?.name ?? "Tap a stop on the map"}</strong></p>
        </div>
        <div class=${`explore-builder-stop ${endStop ? "filled" : ""}`}>
          <span>2</span>
          <p><small>Destination</small><strong>${endStop?.name ?? (startStop ? "Pick another stop" : "Waiting for a start")}</strong></p>
        </div>
        ${plan &&
        html`<div class="explore-trip-stats">
            <span><small>Next shuttle</small><strong>${plan.trip ? fromMinutes(plan.trip.depart.minutes) : "None today"}</strong></span>
            <span><small>Ride time</small><strong>${plan.trip ? `${plan.trip.ride} min` : "—"}</strong></span>
            <span><small>Walk to stop</small><strong>${plan.walk} min</strong></span>
          </div>
          <button type="button" class="explore-start-trip" onClick=${() => setJourney(true)}>Start this route <${Icon} name="arrow" size=${18} /></button>`}
      </section>
      <${BottomNav} active="explore" onHome=${goHome} onExplore=${goExplore} onSchedule=${goSchedule} />
      ${sheet && renderSheet()}
    </main>`;
  }

  /* ----- Explore all stops (network map) ----- */
  if (mapScreen) {
    return html`<main class="phone-app route-map-screen">
      <${ScreenHeader} eyebrow="Ore Cart network" title="Explore every stop." onBack=${() => setMapScreen(false)} backLabel="Return home" />
      <div class="map-screen-intro">
        <p>Tap stops to plan a trip or discover recommended places nearby.</p>
        <span class="live-dot"></span> ${serviceStatus(now)}
      </div>
      <div class="map-route-focus" role="tablist" aria-label="Highlight a route">
        <button type="button" class=${routeFocus === "all" ? "active" : ""} onClick=${() => setRouteFocus("all")}>All routes</button>
        ${ROUTE_KEYS.map(
          (key) => html`<button key=${key} type="button" class=${routeFocus === key ? "active" : ""} style=${{ "--route": ROUTES[key].color }} onClick=${() => setRouteFocus(key)}>
            <span></span>${ROUTES[key].shortName}
          </button>`,
        )}
      </div>
      <div class="route-overview full-screen-map interactive-overview-map" ...${overviewPan.handlers}>
        <div class="overview-map-canvas" style=${transformStyle(overview)}>
          <img src=${OVERVIEW_MAP} alt="Combined map showing the Gold, Silver, and Tungsten Ore Cart routes" />
          <${YouMarker} fitKey="overview" pos=${pos} live=${live} className="overview-user-location" label=${live ? "You" : "Campus"} />
          ${mapTrip.length === 2 &&
          html`<svg class="map-trip-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d=${tripPath(OVERVIEW_STOPS[mapTrip[0].route][mapTrip[0].index], OVERVIEW_STOPS[mapTrip[1].route][mapTrip[1].index])} />
          </svg>`}
          ${ROUTE_KEYS.flatMap((key) =>
            OVERVIEW_STOPS[key].map((p, i) => {
              const r = ROUTES[key];
              const stop = r.stops[i];
              const focused = focusStop?.route === key && focusStop.index === i;
              const sel = mapTrip.findIndex((t) => t.route === key && t.index === i);
              return html`<button
                key=${`${key}-${stop.name}`}
                type="button"
                class=${`overview-stop-marker route-${key} ${focused || sel >= 0 ? "selected" : ""} ${routeFocus !== "all" && routeFocus !== key ? "dimmed" : ""}`}
                style=${{ left: `${p.x}%`, top: `${p.y}%`, "--route": r.color }}
                onClick=${() => {
                  setFocusStop({ route: key, index: i });
                  setFocusPlace(null);
                }}
                aria-label=${`View ${stop.name} on the ${r.name}`}
              >
                ${sel >= 0 && html`<b>${sel + 1}</b>`}
                <span>${stop.name}</span>
              </button>`;
            }),
          )}
          ${PLACES.map(
            (place, i) => html`<button
              key=${place.name}
              type="button"
              class=${`recommended-spot-marker ${focusPlace === i ? "selected" : ""} ${routeFocus !== "all" && routeFocus !== place.route ? "dimmed" : ""}`}
              style=${{ left: `${place.x}%`, top: `${place.y}%` }}
              onClick=${() => {
                setFocusPlace(i);
                setFocusStop(null);
              }}
              aria-label=${`Explore recommended place: ${place.name}`}
            >
              <${Icon} name="star" size=${10} /><span>${place.name}</span>
            </button>`,
          )}
        </div>
        <div class="map-controls">
          <button type="button" onClick=${() => overviewPan.zoomBy(0.2)} aria-label="Zoom in">+</button>
          <button type="button" onClick=${() => overviewPan.zoomBy(-0.2)} aria-label="Zoom out">−</button>
          <button type="button" onClick=${() => setOverview({ zoom: 1, x: 0, y: 0 })} aria-label="Reset map position"><${Icon} name="pin" size=${15} /></button>
        </div>
        <div class="drag-hint explore-drag-hint"><${Icon} name="map" size=${13} /> Drag to move</div>
        <div class="overview-caption"><${Icon} name="star" size=${14} /> Stops and recommended places</div>
      </div>

      ${focusPlace !== null &&
      (() => {
        const place = PLACES[focusPlace];
        return html`<section class="recommended-spot-detail">
          <span><${Icon} name="star" size=${18} /></span>
          <div>
            <small>${ROUTES[place.route].name} · ${place.category}</small>
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            <strong><${Icon} name="pin" size=${13} /> Stop / area: ${place.nearStop}</strong>
          </div>
          <button type="button" onClick=${() => setFocusPlace(null)} aria-label="Close recommendation"><${Icon} name="x" size=${16} /></button>
        </section>`;
      })()}
      ${focusStop &&
      (() => {
        const r = ROUTES[focusStop.route];
        const stop = r.stops[focusStop.index];
        const next = nextDepartures(focusStop.route, focusStop.index, day, now.minutes, 3);
        return html`<section class="map-stop-detail" style=${{ "--route": r.color, "--pale": r.pale }}>
          <span class="map-stop-route-mark"></span>
          <div>
            <small>${r.name} · ${walkMinutes(pos, stop)} min walk</small>
            <h2>${stop.name}</h2>
            <p>${next.length ? `Next: ${next.map((d) => fromMinutes(d.minutes) + (d.estimated ? "~" : "")).join(" · ")}` : "No more departures today"}</p>
          </div>
          <button
            type="button"
            onClick=${() => {
              const sel = { route: focusStop.route, index: focusStop.index };
              setMapTrip((t) => (t.length === 0 ? [sel] : t[0].route === sel.route && t[0].index === sel.index ? t : [t[0], sel]));
              setFocusStop(null);
            }}
          >
            ${mapTrip.length === 0 ? "Start here" : "Go here"} <${Icon} name="arrow" size=${15} />
          </button>
        </section>`;
      })()}
      ${mapTrip.length === 1 &&
      html`<div class="map-path-prompt">
        <span>1</span>
        <p><small>Starting at</small><strong>${ROUTES[mapTrip[0].route].stops[mapTrip[0].index].name}</strong></p>
        <${Icon} name="arrow" size=${16} />
        <p><small>Next</small><strong>Pick any other stop</strong></p>
      </div>`}
      ${mapTrip.length === 2 &&
      (() => {
        const ra = ROUTES[mapTrip[0].route];
        const rb = ROUTES[mapTrip[1].route];
        const sa = ra.stops[mapTrip[0].index];
        const sb = rb.stops[mapTrip[1].index];
        const transfer = mapTrip[0].route !== mapTrip[1].route;
        return html`<section class="map-path-summary">
          <div class="path-summary-heading">
            <div>
              <small>Your map route</small>
              <h2>${transfer ? "One easy transfer" : `Stay on the ${ra.shortName} Route`}</h2>
            </div>
            <button
              type="button"
              onClick=${() => {
                setMapTrip([]);
                setFocusStop(null);
              }}
            >
              Clear
            </button>
          </div>
          <div class="path-stop">
            <span style=${{ background: ra.color }}>1</span>
            <p><small>Start · ${ra.name}</small><strong>${sa.name}</strong></p>
          </div>
          ${transfer && html`<div class="transfer-note"><${Icon} name="routes" size=${15} /> Transfer from ${ra.shortName} to ${rb.shortName}</div>`}
          <div class="path-stop">
            <span style=${{ background: rb.color }}>2</span>
            <p><small>Destination · ${rb.name}</small><strong>${sb.name}</strong></p>
          </div>
          <button type="button" class="plan-map-route" onClick=${() => setMapTripDetail(true)}>Use this trip <${Icon} name="arrow" size=${17} /></button>
        </section>`;
      })()}
      <div class="closest-route map-screen-closest">
        <span class=${`location-pulse ${live ? "" : "off"}`}><span></span></span>
        <p><small>Closest stop to ${live ? "you" : "campus"}</small><strong>${closest.name} · ${closest.stops[closestByRoute[closestKey].index].name}</strong></p>
        <b>${closestByRoute[closestKey].minutes} min walk</b>
      </div>
      <${BottomNav} active="explore" onHome=${goHome} onExplore=${goExplore} onSchedule=${goSchedule} />
      ${sheet && renderSheet()}
    </main>`;
  }

  /* ----- Home ----- */
  return html`<main class="phone-app home-screen">
    <section class="home-map-hero">
      <${HomeMap} selectedStops=${mapTrip} onSelectStop=${pickMapStop} pos=${pos} live=${live} />
      <div class="home-brand">
        <span><img src=${LOGO} alt="" /></span>
        <div><strong>OreTransit</strong><small>GOLDEN, CO</small></div>
      </div>
      <${LocationNote} geo=${geo} className="home-map-note" />
    </section>
    <section class="home-route-list">
      ${mapTrip.length > 0 &&
      html`<div class="home-trip-selection">
        <div class="home-trip-selection-head">
          <strong>${mapTrip.length === 1 ? "Starting stop set" : "Your trip is ready"}</strong>
          <button
            type="button"
            onClick=${() => {
              setMapTrip([]);
              setFocusStop(null);
            }}
          >
            Clear
          </button>
        </div>
        ${mapTrip.map(
          (sel, i) => html`<div class="home-selected-stop" key=${`${sel.route}-${sel.index}`}>
            <span style=${{ background: ROUTES[sel.route].color }}>${i + 1}</span>
            <p><small>${i === 0 ? "Start" : "Destination"} · ${ROUTES[sel.route].name}</small><strong>${ROUTES[sel.route].stops[sel.index].name}</strong></p>
          </div>`,
        )}
        ${mapTrip.length === 1
          ? html`<div class="home-destination-list">
              <p>Choose an ending stop</p>
              <div>
                ${ROUTES[mapTrip[0].route].stops
                  .map((stop, index) => ({ stop, index }))
                  .filter(({ index }) => index !== mapTrip[0].index)
                  .map(({ stop, index }) => {
                    const t = nextTrip(mapTrip[0].route, mapTrip[0].index, index, day, now.minutes + walkMinutes(pos, ROUTES[mapTrip[0].route].stops[mapTrip[0].index]));
                    return html`<button
                      key=${stop.name}
                      type="button"
                      onClick=${() => {
                        const sel = { route: mapTrip[0].route, index };
                        setFocusStop(sel);
                        setMapTrip([mapTrip[0], sel]);
                      }}
                    >
                      <span>${index + 1}</span>
                      <strong>${stop.name}</strong>
                      <small>${t ? `${t.ride} min ride · ${fromMinutes(t.depart.minutes)}` : "no trip left today"}</small>
                      <${Icon} name="arrow" size=${14} />
                    </button>`;
                  })}
              </div>
              <small>Or tap any stop on the map, including stops on another route.</small>
            </div>`
          : html`<button type="button" class="home-view-trip" onClick=${() => setMapTripDetail(true)}>View trip details <${Icon} name="arrow" size=${17} /></button>`}
      </div>`}
      <div class="home-route-heading">
        <h1>Choose a route</h1>
        <span>${ROUTE_KEYS.length} routes</span>
      </div>
      <div class="route-choice-list">
        ${HOME_ROUTE_CARDS.map(({ key, subtitle, description }) => {
          const r = ROUTES[key];
          const c = closestByRoute[key];
          const next = nextDepartures(key, c.index, day, now.minutes + c.minutes, 2);
          return html`<article class=${`route-choice route-choice-${key}`} key=${key}>
            <div>
              <h2>${r.name}</h2>
              <p>${subtitle}</p>
              <small>${description}</small>
              <small class="route-next">
                ${next.length
                  ? html`From ${r.stops[c.index].name}: <b>${next.map((d) => fromMinutes(d.minutes) + (d.estimated ? "~" : "")).join(", ")}</b>`
                  : `No more departures today from ${r.stops[c.index].name}`}
              </small>
            </div>
            <button
              type="button"
              class="route-walk-time"
              aria-label=${`Set ${r.stops[c.index].name} as your starting stop, a ${c.minutes} minute walk away`}
              onClick=${() => {
                const sel = { route: key, index: c.index };
                setRouteKey(key);
                setRouteFocus(key);
                setFocusStop(sel);
                setMapTrip([sel]);
              }}
            >
              <${Icon} name="walk" size=${25} />
              <strong>${c.minutes} min</strong>
              <span>walk to<br />closest stop</span>
            </button>
            <button
              type="button"
              class="explore-route-button"
              onClick=${() => {
                setRouteKey(key);
                setSelectedStops([]);
                setJourney(false);
                setRouteExplore(true);
              }}
            >
              Explore route <${Icon} name="map" size=${17} />
            </button>
          </article>`;
        })}
      </div>
      <div class="arrival-unavailable">
        <strong><${Icon} name="clock" size=${18} /> ${serviceStatus(now)}</strong>
        <p>Times are from the published Ore Cart timetable (${SERVICE_HOURS.weekday} Mon–Fri, ${SERVICE_HOURS.weekend} Sat–Sun). The shuttle is not live-tracked, so arrive a few minutes early. No service on Mines campus closures.</p>
      </div>
      <p class="home-disclaimer">
        <${Icon} name="info" size=${16} />${" "}
        <span>Walking times use your phone's GPS and straight-line distance with a street detour allowance. Stop positions are matched to the published route maps.</span>
      </p>
    </section>
    <${BottomNav} active="home" onHome=${goHome} onExplore=${goExplore} onSchedule=${goSchedule} />
    ${sheet && renderSheet()}
  </main>`;

  /* ----- Bottom sheet: route map or timetable ----- */
  function renderSheet() {
    const close = () => setSheet(null);
    const showDay = sheetDay ?? day;
    const rows = (SCHEDULE[routeKey][showDay] ?? []).map(tripTimes);
    const nextRow = showDay === day ? rows.findIndex((t) => t.some((c) => c && c.minutes >= now.minutes)) : -1;
    return html`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-label=${sheet === "map" ? `${route.name} map` : `${route.name} timetable`}>
      <div class="sheet">
        <div class="sheet-handle"></div>
        <header>
          <button type="button" class="icon-button" onClick=${close} aria-label="Close"><${Icon} name="back" /></button>
          <div>
            <small>${route.name}</small>
            <h2>${sheet === "map" ? "Route map" : "Route timetable"}</h2>
          </div>
          <button type="button" class="icon-button" onClick=${close} aria-label="Close"><${Icon} name="x" /></button>
        </header>
        ${sheet === "schedule" &&
        html`<div class="sheet-route-tabs" role="tablist" aria-label="Choose a route">
            ${ROUTE_KEYS.map(
              (key) => html`<button key=${key} type="button" role="tab" aria-selected=${routeKey === key} class=${routeKey === key ? "active" : ""} style=${{ "--route": ROUTES[key].color }} onClick=${() => setRouteKey(key)}>
                <span></span>${ROUTES[key].shortName}
              </button>`,
            )}
          </div>
          <div class="sheet-day-tabs" role="tablist" aria-label="Choose a service day">
            <button type="button" role="tab" aria-selected=${showDay === "weekday"} class=${showDay === "weekday" ? "active" : ""} onClick=${() => setSheetDay("weekday")}>Mon–Fri · ${SERVICE_HOURS.weekday}</button>
            <button type="button" role="tab" aria-selected=${showDay === "weekend"} class=${showDay === "weekend" ? "active" : ""} onClick=${() => setSheetDay("weekend")}>Sat–Sun · ${SERVICE_HOURS.weekend}</button>
          </div>`}
        ${sheet === "map"
          ? html`<div class="sheet-map"><${RouteMap} routeKey=${routeKey} selectedStops=${selectedStops} onSelect=${toggleStop} pos=${pos} live=${live} /></div>`
          : html`<div class="mini-timetable">
              <div class="timetable-title">
                <span>${route.name}</span>
                <strong>${showDay === "weekday" ? "Monday–Friday" : "Saturday & Sunday"}${showDay === day ? " · today" : ""}</strong>
              </div>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Trip</th>
                      ${route.stops.map((s) => html`<th key=${s.name}>${s.name}</th>`)}
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map(
                      (t, i) => html`<tr key=${i} class=${i === nextRow ? "next-trip" : i < nextRow ? "past-trip" : ""}>
                        <th>${i === nextRow ? (t.find(Boolean).minutes < now.minutes ? "Now" : "Next") : i + 1}</th>
                        ${t.map((c, n) => html`<td key=${n} class=${c?.estimated ? "estimated" : ""}>${c ? fromMinutes(c.minutes) + (c.estimated ? "~" : "") : "—"}</td>`)}
                      </tr>`,
                    )}
                  </tbody>
                </table>
              </div>
              <p>Official time points from orecart.mines.edu. A ~ marks an estimated time at a stop with no posted time; — means the trip ends before that stop.</p>
            </div>`}
        <p class="zoom-note">${sheet === "map" ? "Drag the map and use the controls to explore." : "Swipe sideways to view every stop."}</p>
      </div>
    </div>`;
  }
}

function serviceStatus(now) {
  const first = { weekday: 7 * 60, weekend: 8 * 60 }[now.day];
  const last = { weekday: 18 * 60 + 30, weekend: 17 * 60 }[now.day];
  if (now.minutes < first) return `Service starts at ${fromMinutes(first)}`;
  if (now.minutes > last) return "Service has ended for today";
  return `Running until ${fromMinutes(last)}`;
}

render(html`<${App} />`, document.getElementById("root"));
