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
  fromMinutes,
  nowInGolden,
} from "./schedule.js";
import { loadGraph, graphReady, walkTo, rideCoords, shuttlePath, fmtDistance, walkField, fieldDistanceTo, walkMinutesFor } from "./routing.js";

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

  const onFix = (p) => setLoc({ status: "on", pos: { lat: p.coords.latitude, lon: p.coords.longitude }, accuracy: p.coords.accuracy, at: Date.now() });
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

  // One fresh fix right now (used as a polling fallback while navigating: some phones only
  // deliver watchPosition updates on large movements).
  const refresh = () => {
    if (!("geolocation" in navigator) || !secure) return;
    navigator.geolocation.getCurrentPosition(onFix, () => {}, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
  };

  return { ...loc, retry: start, refresh };
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

function usePanZoom(view, setView, { min = 1, max = 2.5, box = null } = {}) {
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastTap = useRef(0);
  const viewRef = useRef(view);
  viewRef.current = view;
  const clampZoom = (z) => Math.min(max, Math.max(min, z));

  // Zoom so that the map point under (ax, ay) (container pixels) stays put.
  const zoomAt = (newZoom, ax, ay) => {
    setView((v) => {
      const z = clampZoom(newZoom);
      const k = z / v.zoom;
      return { zoom: z, x: ax - (ax - v.x) * k, y: ay - (ay - v.y) * k };
    });
  };
  const local = (clientX, clientY) => {
    const r = box?.current?.getBoundingClientRect();
    return r ? { x: clientX - r.left, y: clientY - r.top } : { x: clientX, y: clientY };
  };
  const center = () => {
    const el = box?.current;
    return el ? { x: el.clientWidth / 2, y: el.clientHeight / 2 } : { x: 0, y: 0 };
  };

  const onPointerDown = (e) => {
    if (e.target.closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 1) {
      // double-tap / double-click zooms in on that point
      const t = Date.now();
      if (t - lastTap.current < 320) { const l = local(e.clientX, e.clientY); zoomAt(viewRef.current.zoom * 1.8, l.x, l.y); lastTap.current = 0; gesture.current = null; return; }
      lastTap.current = t;
      gesture.current = { kind: "pan", startX: e.clientX, startY: e.clientY, panX: viewRef.current.x, panY: viewRef.current.y };
    } else if (pts.length === 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = { kind: "pinch", startDist: dist, startZoom: viewRef.current.zoom };
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
      const mid = local((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      const z = clampZoom((g.startZoom * dist) / g.startDist);
      if (g.lastMid) {
        // keep the pinch midpoint anchored while fingers move
        setView((v) => { const k = z / v.zoom; return { zoom: z, x: mid.x - (mid.x - v.x) * k + (mid.x - g.lastMid.x), y: mid.y - (mid.y - v.y) * k + (mid.y - g.lastMid.y) }; });
      } else zoomAt(z, mid.x, mid.y);
      g.lastMid = mid;
    }
  };
  const end = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) gesture.current = null;
    else if (pointers.current.size === 1) { const [pt] = pointers.current.values(); gesture.current = { kind: "pan", startX: pt.x, startY: pt.y, panX: viewRef.current.x, panY: viewRef.current.y }; }
  };
  const onWheel = (e) => {
    e.preventDefault();
    const l = local(e.clientX, e.clientY);
    zoomAt(viewRef.current.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), l.x, l.y);
  };

  // Stop iOS Safari from zooming the whole page when pinching on the map.
  useEffect(() => {
    const el = box?.current; if (!el) return;
    const block = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); };
    const blockGesture = (e) => e.preventDefault();
    el.addEventListener("touchmove", block, { passive: false });
    el.addEventListener("touchstart", block, { passive: false });
    el.addEventListener("gesturestart", blockGesture);
    el.addEventListener("gesturechange", blockGesture);
    return () => { el.removeEventListener("touchmove", block); el.removeEventListener("touchstart", block); el.removeEventListener("gesturestart", blockGesture); el.removeEventListener("gesturechange", blockGesture); };
  }, [box?.current]);

  const zoomBy = (delta) => { const c = center(); zoomAt(viewRef.current.zoom * (delta > 0 ? 1.35 : 1 / 1.35), c.x, c.y); };
  return { handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onWheel }, zoomBy };
}

const transformStyle = (v) => ({ transform: `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.zoom})`, "--inv": (1 / v.zoom).toFixed(3) });

function tripPath(a, b) {
  const mid = Math.min(a.y, b.y) + Math.abs(a.y - b.y) * 0.42;
  return `M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
}

// Project a lat/lon polyline onto an artwork map as SVG "points" (percent units).
function geoPoints(fitKey, coords) {
  return coords.map(([lat, lon]) => { const p = geoToMap(fitKey, lat, lon); return `${p.x.toFixed(2)},${p.y.toFixed(2)}`; }).join(" ");
}

// Street legs for a selected trip: [{coords, color, dashed}]
function tripLegs(trip, pos, finish = null) {
  if (trip.length < 1 || !graphReady()) return [];
  const legs = [];
  const a = trip[0];
  const ra = ROUTES[a.route];
  const walk = pos ? walkTo(pos, ra.stops[a.index]) : null;
  if (walk && walk.length > 15) legs.push({ coords: walk.coords, color: "#102343", dashed: true, kind: "walk", walk });
  if (trip.length === 2) {
    const b = trip[1];
    if (a.route === b.route) {
      legs.push({ coords: rideCoords(a.route, a.index, b.index), color: ra.color, kind: "ride" });
    } else {
      const t = TRANSFERS[[a.route, b.route].sort().join("-")];
      legs.push({ coords: rideCoords(a.route, a.index, t[a.route]), color: ra.color, kind: "ride" });
      legs.push({ coords: rideCoords(b.route, t[b.route], b.index), color: ROUTES[b.route].color, kind: "ride" });
    }
  }
  if (finish) {
    const last = ROUTES[trip[trip.length - 1].route].stops[trip[trip.length - 1].index];
    const w2 = walkTo(last, finish);
    if (w2 && w2.length > 15) legs.push({ coords: w2.coords, color: "#102343", dashed: true, kind: "finish", walk: w2 });
  }
  return legs;
}

// Closest stop (any route) to a point, by walking distance when the street graph is loaded.
function closestStopTo(point) {
  let best = null;
  const field = graphReady() ? walkField(point) : null;
  for (const key of ROUTE_KEYS) {
    ROUTES[key].stops.forEach((st, i) => {
      const d = field ? fieldDistanceTo(field, st) : distanceMeters(point, st) * 1.3;
      if (d !== null && (!best || d < best.meters)) best = { route: key, index: i, meters: d, minutes: walkMinutesFor(d) };
    });
  }
  return best;
}

function ArtworkLegs({ fitKey, legs }) {
  if (!legs.length) return null;
  return html`<svg class="map-trip-path street" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    ${legs.map((l, i) => html`<polyline key=${i} points=${geoPoints(fitKey, l.coords)} stroke=${l.color} stroke-dasharray=${l.dashed ? "1.2 0.9" : "none"} />`)}
  </svg>`;
}

/* ---------- Real street map (Leaflet + OpenStreetMap tiles) ---------- */

function StreetMap({ legs, markers, pos, live, height = 320, follow = false }) {
  const box = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const youRef = useRef(null);

  useEffect(() => {
    if (!window.L || !box.current) return;
    const L = window.L;
    const map = L.map(box.current, { zoomControl: true, attributionControl: true, tap: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    map.setView([39.7508, -105.2214], 15);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // keep Leaflet's internal size in sync when the container height changes (e.g. entering navigation)
  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    const id = setTimeout(() => { map.invalidateSize(); if (follow && pos) map.setView([pos.lat, pos.lon], 17); }, 60);
    return () => clearTimeout(id);
  }, [height, follow]);

  // draw legs + markers
  useEffect(() => {
    const L = window.L, map = mapRef.current; if (!L || !map) return;
    const g = layerRef.current; g.clearLayers();
    const bounds = [];
    for (const l of legs) {
      if (l.coords.length < 2) continue;
      L.polyline(l.coords, { color: "#ffffff", weight: 9, opacity: 0.9 }).addTo(g);
      L.polyline(l.coords, { color: l.color, weight: 5, opacity: 0.95, dashArray: l.dashed ? "2 10" : null, lineCap: "round" }).addTo(g);
      l.coords.forEach((c) => bounds.push(c));
    }
    for (const m of markers) {
      const icon = L.divIcon({ className: "lf-stop", html: `<span style="background:${m.color}">${m.label}</span>`, iconSize: [26, 26], iconAnchor: [13, 13] });
      L.marker([m.lat, m.lon], { icon, title: m.name }).bindTooltip(m.name, { direction: "top", offset: [0, -12] }).addTo(g);
      bounds.push([m.lat, m.lon]);
    }
    if (pos) bounds.push([pos.lat, pos.lon]);
    if (bounds.length > 1 && !follow) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 17 });
    else if (bounds.length === 1) map.setView(bounds[0], 16);
  }, [JSON.stringify(legs.map((l) => l.coords.length + l.color)), JSON.stringify(markers.map((m) => m.lat + "," + m.lon))]);

  // live "you" marker
  useEffect(() => {
    const L = window.L, map = mapRef.current; if (!L || !map || !pos) return;
    if (!youRef.current) {
      youRef.current = L.marker([pos.lat, pos.lon], { icon: L.divIcon({ className: `lf-you ${live ? "live" : ""}`, html: "<i></i>", iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 1000 }).addTo(map);
    } else {
      youRef.current.setLatLng([pos.lat, pos.lon]);
      youRef.current.setIcon(L.divIcon({ className: `lf-you ${live ? "live" : ""}`, html: "<i></i>", iconSize: [18, 18], iconAnchor: [9, 9] }));
    }
    if (follow) map.setView([pos.lat, pos.lon], Math.max(map.getZoom(), 17), { animate: true });
  }, [pos?.lat, pos?.lon, live, follow]);

  return html`<div class="street-map" ref=${box} style=${{ height: `${height}px` }} aria-label="Street map with directions"></div>`;
}

function WalkSteps({ walk }) {
  if (!walk) return null;
  return html`<ol class="walk-steps">
    ${walk.steps.map((s, i) => html`<li key=${i}><span>${s.text}</span>${s.distance ? html`<small>${fmtDistance(s.distance)}</small>` : ""}</li>`)}
  </ol>`;
}

/* ---------- "You" marker ---------- */

function YouMarker({ fitKey, pos, live, className, label }) {
  if (!pos || !live) return null;
  const p = geoToMap(fitKey, pos.lat, pos.lon);
  if (!inMap(p)) return null;
  return html`<span class=${`${className} ${live ? "live" : "assumed"}`} style=${{ left: `${p.x}%`, top: `${p.y}%` }}>
    <span class=${className === "home-location" ? "home-location-ring" : ""}>${className === "home-location" ? html`<i></i>` : ""}</span>
    <b>${label}</b>
  </span>`;
}

/* ---------- Home hero map (all routes) ---------- */

function HomeMap({ selectedStops, onSelectStop, pos, live, legs = [] }) {
  const box = useRef(null);
  const [view, setView] = useState({ zoom: 1.18, x: -24, y: -12 });
  const { handlers, zoomBy } = usePanZoom(view, setView, { max: 4, box });
  const reset = () => {
    const w = box.current?.clientWidth ?? 490;
    setView({ zoom: 1.18, x: w * -0.05, y: w * -0.025 });
  };

  return html`<div class="home-interactive-map" ref=${box} ...${handlers}>
    <div class="home-overview-canvas" style=${transformStyle(view)}>
      <img src=${OVERVIEW_MAP} alt="Map of the Gold, Silver, and Tungsten Ore Cart routes" draggable="false" />
      <${YouMarker} fitKey="overview" pos=${pos} live=${live} className="home-location" label=${live ? "YOU" : "CAMPUS (location off)"} />
      ${legs.length
        ? html`<${ArtworkLegs} fitKey="overview" legs=${legs} />`
        : selectedStops.length === 2 &&
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
  const { handlers, zoomBy } = usePanZoom(view, setView, { max: 5, box });
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

/* ---------- Directions (Google Maps style, app palette) ---------- */

function stopsBetween(routeKey, from, to) {
  const n = ROUTES[routeKey].stops.length;
  return ((to - from) % n + n) % n;
}

// Distance from a point to a polyline, and the remaining length from the nearest point to the end.
function alongPolyline(pos, coords) {
  let best = { d: Infinity, i: 0, t: 0 };
  for (let i = 0; i < coords.length - 1; i++) {
    const [aLat, aLon] = coords[i], [bLat, bLon] = coords[i + 1];
    const cos = Math.cos((pos.lat * Math.PI) / 180);
    const ax = (aLon - pos.lon) * 111000 * cos, ay = (aLat - pos.lat) * 111000;
    const bx = (bLon - pos.lon) * 111000 * cos, by = (bLat - pos.lat) * 111000;
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
    const px = ax + t * dx, py = ay + t * dy;
    const d = Math.hypot(px, py);
    if (d < best.d) best = { d, i, t };
  }
  let remain = 0;
  for (let i = best.i; i < coords.length - 1; i++) {
    const seg = distanceMeters({ lat: coords[i][0], lon: coords[i][1] }, { lat: coords[i + 1][0], lon: coords[i + 1][1] });
    remain += i === best.i ? seg * (1 - best.t) : seg;
  }
  return { ...best, remain };
}

function DirectionsScreen({ trip, pos: userPos, live: userLive, now, day, onBack, routingReady, geo, origin = null, finish = null }) {
  // origin: {lat,lon,name} when the trip starts at a chosen stop instead of the phone's position
  const pos = origin ?? userPos;
  const live = origin ? false : userLive;
  const [nav, setNav] = useState(false);      // Start pressed: live navigation
  const [detail, setDetail] = useState(false); // Simple / Details
  const [, tick] = useState(0);
  const legCache = useRef({ key: null, legs: [] });

  // Live navigation: poll for a fresh fix every 4 s, keep the screen awake, re-render for the age readout.
  useEffect(() => {
    if (!nav) return;
    geo?.refresh?.();
    const poll = setInterval(() => { geo?.refresh?.(); tick((n) => n + 1); }, 4000);
    let lock = null;
    navigator.wakeLock?.request?.("screen").then((l) => { lock = l; }).catch(() => {});
    const onVis = () => { if (document.visibilityState === "visible") { geo?.refresh?.(); navigator.wakeLock?.request?.("screen").then((l) => { lock = l; }).catch(() => {}); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(poll); document.removeEventListener("visibilitychange", onVis); lock?.release?.().catch(() => {}); };
  }, [nav]);
  const walkOnly = trip.length === 1;
  const a = trip[0], b = walkOnly ? trip[0] : trip[1];
  const ra = ROUTES[a.route], rb = ROUTES[b.route];
  const sa = ra.stops[a.index], sb = rb.stops[b.index];
  const transfer = !walkOnly && a.route !== b.route;
  const tIdx = transfer ? TRANSFERS[[a.route, b.route].sort().join("-")] : null;
  // Recompute the street route only when the position moved more than ~8 m (cheap on phones).
  let legs = [];
  if (routingReady) {
    const c = legCache.current;
    const tripKey = trip.map((t) => t.route + t.index).join("|");
    const moved = !c.pos || distanceMeters(c.pos, pos) > 8 || c.key !== tripKey;
    if (moved) { legCache.current = { key: tripKey, pos: { ...pos }, legs: tripLegs(trip, pos, finish) }; }
    legs = legCache.current.legs;
  }
  const walkRoute = legs.find((l) => l.kind === "walk")?.walk ?? null;
  const walk = walkRoute ? walkRoute.minutes : Math.max(0, walkMinutes(pos, sa) - (distanceMeters(pos, sa) < 15 ? walkMinutes(pos, sa) : 0));
  const finishRoute = legs.find((l) => l.kind === "finish")?.walk ?? null;
  const finishWalk = finish ? (finishRoute ? finishRoute.minutes : walkMinutes(sb, finish)) : 0;
  const fixAge = geo?.at ? Math.round((Date.now() - geo.at) / 1000) : null;

  let leg1 = null, leg2 = null;
  if (walkOnly) {
    // no shuttle: the arrival is simply the end of the walk
  } else if (transfer) {
    leg1 = nextTrip(a.route, a.index, tIdx[a.route], day, now.minutes + walk);
    leg2 = leg1 ? nextTrip(b.route, tIdx[b.route], b.index, day, leg1.arrive.minutes + 1) : null;
  } else {
    leg1 = nextTrip(a.route, a.index, b.index, day, now.minutes + walk);
  }
  const arriveStop = walkOnly ? { minutes: now.minutes + walk } : transfer ? leg2?.arrive : leg1?.arrive;
  const arrive = arriveStop ? { minutes: arriveStop.minutes + finishWalk } : null;
  const leaveAt = leg1 ? leg1.depart.minutes - walk : now.minutes;
  const total = arrive ? arrive.minutes - leaveAt : null;
  const T = (t) => (t ? fromMinutes(t.minutes) : "—");
  const walkDirect = walkMinutes(pos, sa) + walkMinutes(sa, sb);
  const viaStop = transfer ? ra.stops[tIdx[a.route]] : null;

  const markers = walkOnly
    ? [{ lat: sb.lat, lon: sb.lon, color: rb.color, label: "", name: sb.name }]
    : [
        ...(origin ? [{ lat: origin.lat, lon: origin.lon, color: "#102343", label: "", name: origin.name }] : []),
        { lat: sa.lat, lon: sa.lon, color: ra.color, label: "", name: sa.name },
        ...(transfer ? [{ lat: viaStop.lat, lon: viaStop.lon, color: "#102343", label: "", name: viaStop.name }] : []),
        { lat: sb.lat, lon: sb.lon, color: rb.color, label: "", name: sb.name },
      ];
  const chip = (r) => html`<span class="dir-chip" style=${{ background: r.color }}>${r.shortName}</span>`;

  // ---- live navigation state ----
  let banner = null;
  if (nav) {
    const distToStop = distanceMeters(pos, sa);
    if (walkOnly && distToStop <= 30) banner = { title: "You have arrived", sub: sb.name };
    else if (walkOnly && walkRoute && walkRoute.steps.length) {
      const steps = walkRoute.steps.filter((st) => st.coords.length > 1);
      let cur = steps[0], curRemain = cur ? alongPolyline(pos, cur.coords).remain : 0, bestD = Infinity;
      for (const st of steps) { const r = alongPolyline(pos, st.coords); if (r.d < bestD) { bestD = r.d; cur = st; curRemain = r.remain; } }
      banner = { title: cur ? cur.text : `Walk to ${sb.name}`, sub: `${fmtDistance(curRemain)} · then ${fmtDistance(Math.max(0, walkRoute.length - curRemain))} more · arrive ${T(arrive)}` };
    } else if (walkOnly) banner = { title: `Walk to ${sb.name}`, sub: `About ${walk} min` };
    else if (!leg1) banner = { title: "No more shuttles today", sub: "Service has ended on this route." };
    else if (now.minutes >= leg1.depart.minutes && distToStop > 60 && now.minutes < (arrive?.minutes ?? Infinity)) {
      banner = { title: `Ride the ${ra.name}`, sub: transfer ? `Exit at ${viaStop.name} · ${T(leg1.arrive)}` : `Exit at ${sb.name} · ${T(leg1.arrive)}` };
    } else if (distToStop <= 40) {
      banner = { title: `Board the ${ra.name}`, sub: `At ${sa.name} · leaves ${minutesLabel(leg1.depart.minutes, now.minutes)} (${T(leg1.depart)})` };
    } else if (walkRoute && walkRoute.steps.length) {
      const steps = walkRoute.steps.filter((s) => s.coords.length > 1);
      let cur = steps[0], curRemain = cur ? alongPolyline(pos, cur.coords).remain : 0, bestD = Infinity;
      for (const s of steps) { const r = alongPolyline(pos, s.coords); if (r.d < bestD) { bestD = r.d; cur = s; curRemain = r.remain; } }
      banner = { title: cur ? cur.text : `Walk to ${sa.name}`, sub: `${fmtDistance(curRemain)} · then ${fmtDistance(Math.max(0, walkRoute.length - curRemain))} more · shuttle ${T(leg1.depart)}` };
    } else banner = { title: `Walk to ${sa.name}`, sub: `About ${walk} min · shuttle ${T(leg1.depart)}` };
  }

  return html`<main class=${`phone-app dir-screen ${nav ? "nav" : ""}`}>
    ${nav
      ? html`<header class="dir-nav-banner">
          <div>
            <strong>${banner.title}</strong><span>${banner.sub}</span>
            <small>${live ? `GPS ±${Math.round(geo?.accuracy ?? 0)} m · updated ${fixAge === null ? "—" : fixAge < 2 ? "just now" : fixAge + "s ago"}` : "Location off · tap the chip on the Home screen to turn it on"}</small>
          </div>
          <button type="button" class="dir-exit" onClick=${() => setNav(false)} aria-label="Exit navigation"><${Icon} name="x" size=${18} /></button>
        </header>`
      : html`<header class="dir-header">
          <button type="button" class="icon-button" onClick=${onBack} aria-label="Back"><${Icon} name="back" /></button>
          <div class="dir-endpoints">
            <span><i class="dir-dot from"></i>${origin ? origin.name : userLive ? "Your location" : "Campus (location off)"}</span>
            <span><i class="dir-dot to"></i>${finish ? finish.name : sb.name}</span>
          </div>
        </header>`}
    <section class="dir-map">
      ${window.L
        ? html`<${StreetMap} legs=${legs} markers=${markers} pos=${pos} live=${live} height=${Math.round(Math.min(nav ? 520 : 420, window.innerHeight * (nav ? 0.55 : 0.4)))} follow=${nav} />`
        : html`<${RouteMap} routeKey=${a.route} selectedStops=${transfer ? [a.index] : [a.index, b.index]} compact=${true} pos=${pos} live=${live} />`}
    </section>
    <section class="dir-summary">
      <div>
        <strong>${total !== null ? `${total} min` : "No more trips today"}</strong>
        <span>${leg1 || walkOnly ? `${fromMinutes(leaveAt)} – ${T(arrive)}` : `Service ${day === "weekday" ? SERVICE_HOURS.weekday : SERVICE_HOURS.weekend}`}</span>
      </div>
      <div class="dir-toggle" role="tablist" aria-label="Level of detail">
        <button type="button" role="tab" aria-selected=${!detail} class=${detail ? "" : "active"} onClick=${() => setDetail(false)}>Simple</button>
        <button type="button" role="tab" aria-selected=${detail} class=${detail ? "active" : ""} onClick=${() => setDetail(true)}>Details</button>
      </div>
    </section>
    ${detail &&
    html`<section class="dir-facts">
      <div><small>${walkOnly ? "Walk" : "Walk to stop"}</small><strong>${walk} min</strong><span>${walkRoute ? fmtDistance(walkRoute.length) : "straight line"}</span></div>
      <div><small>Difficulty</small><strong>${walkRoute?.difficulty?.level ?? "—"}</strong><span>${walkRoute ? `${walkRoute.difficulty.note}${walkRoute.ascent ? ` · ↑${walkRoute.ascent} m ↓${walkRoute.descent} m` : ""}` : ""}</span></div>
      ${!walkOnly && html`<div><small>Wait</small><strong>${leg1 ? Math.max(0, leg1.depart.minutes - now.minutes - walk) : "—"} min</strong><span>at ${sa.name}</span></div>
      <div><small>Ride</small><strong>${leg1 ? (transfer && leg2 ? leg1.ride + leg2.ride : leg1.ride) : "—"} min</strong><span>${transfer ? "two routes" : ra.name}</span></div>
      <div><small>Walking instead</small><strong>${walkDirect} min</strong><span>${total !== null && walkDirect < total ? "faster on foot" : "shuttle is faster"}</span></div>`}
    </section>`}
    <ol class="dir-steps">
      ${walk > 0 && html`<li class="walk">
        <time>${fromMinutes(leaveAt)}</time>
        <span class="dir-node"><${Icon} name="walk" size=${16} /></span>
        <div>
          <p>Walk · ${walk} min${walkRoute ? ` · ${fmtDistance(walkRoute.length)}` : ""} <${DifficultyChip} d=${walkRoute?.difficulty} /></p>
          ${walkRoute && (detail ? html`<${WalkSteps} walk=${walkRoute} />` : html`<details><summary>Details</summary><${WalkSteps} walk=${walkRoute} /></details>`)}
        </div>
      </li>`}
      ${!walkOnly && html`<li>
        <time>${T(leg1?.depart)}</time>
        <span class="dir-node stop" style=${{ borderColor: ra.color }}></span>
        <div>
          <p><b>${sa.name}</b></p>
          <p class="dir-ride">${chip(ra)} Ride ${stopsBetween(a.route, a.index, transfer ? tIdx[a.route] : b.index)} stops · ${leg1 ? `${leg1.ride} min` : "—"}</p>
          ${detail && leg1 && html`<p class="dir-note">Scheduled ${T(leg1.depart)}${leg1.depart.estimated ? " (estimated time point)" : ""} · every ${ra.frequency}</p>`}
        </div>
      </li>`}
      ${transfer &&
      html`<li>
        <time>${T(leg1?.arrive)}</time>
        <span class="dir-node stop" style=${{ borderColor: ra.color }}></span>
        <div>
          <p><b>${viaStop.name}</b></p>
          <p class="dir-ride muted">Transfer · wait ${leg1 && leg2 ? leg2.depart.minutes - leg1.arrive.minutes : "—"} min</p>
          ${detail && html`<p class="dir-note">Get off the ${ra.shortName} Route and wait at the same stop for the ${rb.shortName} Route.</p>`}
        </div>
      </li>
      <li>
        <time>${T(leg2?.depart)}</time>
        <span class="dir-node stop" style=${{ borderColor: rb.color }}></span>
        <div>
          <p><b>${rb.stops[tIdx[b.route]].name}</b></p>
          <p class="dir-ride">${chip(rb)} Ride ${stopsBetween(b.route, tIdx[b.route], b.index)} stops · ${leg2 ? `${leg2.ride} min` : "—"}</p>
          ${detail && leg2 && html`<p class="dir-note">Scheduled ${T(leg2.depart)}${leg2.depart.estimated ? " (estimated time point)" : ""} · every ${rb.frequency}</p>`}
        </div>
      </li>`}
      <li class=${finish ? "" : "end"}>
        <time>${T(arriveStop)}</time>
        <span class="dir-node stop end" style=${{ borderColor: rb.color }}></span>
        <div><p><b>${sb.name}</b></p>${detail && !finish && html`<p class="dir-note">Times are from the published Ore Cart timetable, not live tracking.</p>`}</div>
      </li>
      ${finish && html`<li class="walk">
          <time>${T(arriveStop)}</time>
          <span class="dir-node"><${Icon} name="walk" size=${16} /></span>
          <div>
            <p>Walk · ${finishWalk} min${finishRoute ? ` · ${fmtDistance(finishRoute.length)}` : ""} <${DifficultyChip} d=${finishRoute?.difficulty} /></p>
            ${finishRoute && (detail ? html`<${WalkSteps} walk=${finishRoute} />` : html`<details><summary>Details</summary><${WalkSteps} walk=${finishRoute} /></details>`)}
          </div>
        </li>
        <li class="end">
          <time>${T(arrive)}</time>
          <span class="dir-node stop end"></span>
          <div><p><b>${finish.name}</b></p></div>
        </li>`}
    </ol>
    ${!nav && html`<button type="button" class="dir-start" onClick=${() => setNav(true)}><${Icon} name="gps" size=${18} /> Start</button>`}
  </main>`;
}

/* ---------- Destination planner (Home: pick a stop, get the fastest way there) ---------- */

// Every way to reach `dest` from `pos`: walk all the way, or walk to any stop on any route and ride
// (with a transfer when needed). Options are sorted by arrival time.
function planToStop(dest, pos, now, day) {
  if (!graphReady()) return null;
  const field = walkField(pos);
  const rd = ROUTES[dest.route];
  const sd = rd.stops[dest.index];
  const options = [];
  const dWalk = fieldDistanceTo(field, sd);
  if (dWalk !== null) {
    const m = walkMinutesFor(dWalk);
    options.push({ kind: "walk", minutes: m, length: dWalk, arrive: now.minutes + m });
  }
  for (const key of ROUTE_KEYS) {
    ROUTES[key].stops.forEach((s, i) => {
      if (key === dest.route && i === dest.index) return;
      const d = fieldDistanceTo(field, s);
      if (d === null) return;
      const wm = walkMinutesFor(d);
      let leg1 = null, leg2 = null, arrive;
      if (key === dest.route) {
        leg1 = nextTrip(key, i, dest.index, day, now.minutes + wm);
        if (!leg1) return;
        arrive = leg1.arrive.minutes;
      } else {
        const t = TRANSFERS[[key, dest.route].sort().join("-")];
        if (!t) return;
        leg1 = nextTrip(key, i, t[key], day, now.minutes + wm);
        if (!leg1) return;
        leg2 = nextTrip(dest.route, t[dest.route], dest.index, day, leg1.arrive.minutes + 1);
        if (!leg2) return;
        arrive = leg2.arrive.minutes;
      }
      options.push({ kind: "ride", board: { route: key, index: i }, walkMinutes: wm, walkLength: d, leg1, leg2, arrive });
    });
  }
  options.sort((x, y) => x.arrive - y.arrive || (x.kind === "walk" ? -1 : 1));
  return { options, best: options[0] ?? null, walk: options.find((o) => o.kind === "walk") ?? null, ride: options.find((o) => o.kind === "ride") ?? null };
}

function DifficultyChip({ d }) {
  if (!d) return null;
  return html`<span class="diff-chip" style=${{ "--c": d.color }} title=${d.note}>${d.level}</span>`;
}

function HomePlanner({ dest, setDest, pos: userPos, live, now, day, routingReady, onGo, mode, setMode, start, setStart }) {
  const sd = dest ? ROUTES[dest.route].stops[dest.index] : null;
  const two = mode === "two";
  const origin = two && start ? { ...ROUTES[start.route].stops[start.index] } : null;
  const pos = origin ?? userPos;
  const planRef = useRef({ key: null, plan: null });
  let plan = null;
  if (dest && routingReady && (!two || start)) {
    const key = `${dest.route}${dest.index}|${pos.lat.toFixed(4)},${pos.lon.toFixed(4)}|${now.minutes}|${day}|${two}`;
    if (planRef.current.key !== key) {
      const p = planToStop(dest, pos, now, day);
      if (p) {
        // Refine the top candidates with the real street route (adds climb time and difficulty),
        // re-check the shuttle connection with the refined walk, then re-rank.
        if (p.walk) { p.walk.route = walkTo(pos, sd); if (p.walk.route) { p.walk.minutes = p.walk.route.minutes; p.walk.arrive = now.minutes + p.walk.minutes; } }
        const rides = p.options.filter((o) => o.kind === "ride").slice(0, 3);
        for (const o of rides) {
          const bs = ROUTES[o.board.route].stops[o.board.index];
          o.route = walkTo(pos, bs);
          if (!o.route) continue;
          o.walkMinutes = o.route.minutes; o.walkLength = o.route.length;
          if (o.board.route === dest.route) {
            o.leg1 = nextTrip(o.board.route, o.board.index, dest.index, day, now.minutes + o.walkMinutes); o.leg2 = null;
            o.arrive = o.leg1 ? o.leg1.arrive.minutes : Infinity;
          } else {
            const t = TRANSFERS[[o.board.route, dest.route].sort().join("-")];
            o.leg1 = nextTrip(o.board.route, o.board.index, t[o.board.route], day, now.minutes + o.walkMinutes);
            o.leg2 = o.leg1 ? nextTrip(dest.route, t[dest.route], dest.index, day, o.leg1.arrive.minutes + 1) : null;
            o.arrive = o.leg2 ? o.leg2.arrive.minutes : Infinity;
          }
        }
        p.options = p.options.filter((o) => o.arrive !== Infinity).sort((x, y) => x.arrive - y.arrive || (x.kind === "walk" ? -1 : 1));
        p.best = p.options[0] ?? null;
        p.walk = p.options.find((o) => o.kind === "walk") ?? null;
        p.ride = p.options.find((o) => o.kind === "ride" && o.route) ?? null;
      }
      planRef.current = { key, plan: p };
    }
    plan = planRef.current.plan;
  }

  const stopPicker = (value, onPick, placeholder, label) => html`<select class="plan-select" value=${value ? `${value.route}:${value.index}` : ""} onChange=${(e) => { const [r, i] = e.target.value.split(":"); onPick(r ? { route: r, index: Number(i) } : null); }} aria-label=${label}>
    <option value="">${placeholder}</option>
    ${ROUTE_KEYS.map((key) => html`<optgroup key=${key} label=${ROUTES[key].name}>${ROUTES[key].stops.map((s, i) => html`<option key=${i} value=${`${key}:${i}`}>${s.name}</option>`)}</optgroup>`)}
  </select>`;
  const picker = stopPicker(dest, setDest, "Choose a stop…", "Choose a destination stop");
  const modeToggle = html`<div class="dir-toggle plan-mode" role="tablist" aria-label="Plan from">
    <button type="button" role="tab" aria-selected=${!two} class=${two ? "" : "active"} onClick=${() => setMode("me")}>From my location</button>
    <button type="button" role="tab" aria-selected=${two} class=${two ? "active" : ""} onClick=${() => setMode("two")}>Pick two stops</button>
  </div>`;

  if (!dest || (two && !start)) {
    return html`<div class="home-plan">
      <div class="home-plan-head"><strong>Where to?</strong></div>
      ${modeToggle}
      ${two
        ? html`<p class="home-plan-hint">${!start ? "Tap your starting stop on the map, or pick it:" : "Now tap the destination, or pick it:"}</p>
          <div class="plan-two">
            <label><i class="dir-dot from"></i>${stopPicker(start, setStart, "Start stop…", "Choose a starting stop")}</label>
            <label><i class="dir-dot to"></i>${picker}</label>
          </div>`
        : html`<p class="home-plan-hint">Tap a stop on the map, or pick one:</p>${picker}`}
    </div>`;
  }

  const T = (m) => fromMinutes(m);
  const rideCard = (o, label) => {
    const rb = ROUTES[o.board.route], sb = rb.stops[o.board.index];
    const via = o.leg2 ? ROUTES[dest.route].stops[TRANSFERS[[o.board.route, dest.route].sort().join("-")][dest.route]] : null;
    const w = o.route;
    return html`<div class="plan-option">
      <div class="plan-option-head"><span>${label}</span><strong>Arrive ${T(o.arrive)}</strong><small>${o.arrive - now.minutes} min</small></div>
      <ul class="plan-steps">
        <li><i class="dir-dot from"></i><span>Walk ${w ? w.minutes : o.walkMinutes} min to <b>${sb.name}</b> (${fmtDistance(w ? w.length : o.walkLength)})</span><${DifficultyChip} d=${w?.difficulty} /></li>
        <li><span class="dir-chip" style=${{ background: rb.color }}>${rb.shortName}</span><span>${T(o.leg1.depart.minutes)} · ride ${o.leg1.ride} min${via ? ` to ${via.name}` : ""}</span></li>
        ${o.leg2 && html`<li><span class="dir-chip" style=${{ background: ROUTES[dest.route].color }}>${ROUTES[dest.route].shortName}</span><span>${T(o.leg2.depart.minutes)} · ride ${o.leg2.ride} min</span></li>`}
        <li><i class="dir-dot to"></i><span><b>${sd.name}</b> ${T(o.arrive)}</span></li>
      </ul>
      <button type="button" class="plan-go" onClick=${() => onGo([o.board, dest], origin)}>Directions <${Icon} name="arrow" size=${16} /></button>
    </div>`;
  };
  const walkCard = (o, label) => html`<div class="plan-option">
    <div class="plan-option-head"><span>${label}</span><strong>Arrive ${T(o.arrive)}</strong><small>${o.route ? o.route.minutes : o.minutes} min</small></div>
    <ul class="plan-steps">
      <li><i class="dir-dot from"></i><span>Walk ${origin ? `from ${origin.name} ` : "the whole way "}(${fmtDistance(o.route ? o.route.length : o.length)})</span><${DifficultyChip} d=${o.route?.difficulty} /></li>
      ${o.route?.difficulty && html`<li class="plan-note"><span>${o.route.difficulty.note}${o.route.ascent ? ` · ↑ ${o.route.ascent} m ↓ ${o.route.descent} m` : ""}</span></li>`}
    </ul>
    <button type="button" class="plan-go secondary" onClick=${() => onGo([dest], origin)}>Walk <${Icon} name="walk" size=${16} /></button>
  </div>`;

  return html`<div class="home-plan">
    <div class="home-plan-head">
      <div><small>${two ? "Trip" : "Where to?"}</small>${two ? html`<div class="plan-two"><label><i class="dir-dot from"></i>${stopPicker(start, setStart, "Start stop…", "Choose a starting stop")}</label><label><i class="dir-dot to"></i>${picker}</label></div>` : picker}</div>
      <button type="button" onClick=${() => { setDest(null); setStart(null); }}>Clear</button>
    </div>
    ${modeToggle}
    ${!routingReady
      ? html`<p class="home-plan-hint">Loading street data…</p>`
      : !plan || !plan.best
        ? html`<p class="home-plan-hint">No way to get there right now${serviceStatus(now).startsWith("Service") ? ` · ${serviceStatus(now)}` : ""}.</p>`
        : html`${plan.best.kind === "ride" ? rideCard(plan.best, "Fastest") : walkCard(plan.best, "Fastest")}
          ${plan.best.kind === "ride" && plan.walk && walkCard(plan.walk, "Or walk")}
          ${plan.best.kind === "walk" && plan.ride && rideCard(plan.ride, "Or take the Ore Cart")}`}
    ${!live && !two && html`<p class="home-plan-hint">Planned from campus · turn on location for your real start, or pick two stops.</p>`}
  </div>`;
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
  const [dest, setDest] = useState(null); // Home: destination stop {route,index}
  const [planMode, setPlanMode] = useState("me"); // "me" = from your location, "two" = pick two stops
  const [homeStart, setHomeStart] = useState(null); // Home two-stop mode: start {route,index}
  const [dirOrigin, setDirOrigin] = useState(null); // directions: named start instead of GPS
  const [dirFinish, setDirFinish] = useState(null); // directions: final place after the last stop

  const geo = useGeolocation();
  const now = useClock();
  const [routingReady, setRoutingReady] = useState(graphReady());
  useEffect(() => {
    loadGraph().then(() => setRoutingReady(true)).catch(() => setRoutingReady(false));
  }, []);
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

  const overviewBox = useRef(null);
  const overviewPan = usePanZoom(overview, setOverview, { max: 6, box: overviewBox });

  const toggleStop = (i) => {
    setJourney(false);
    setSelectedStops((s) => (s.length >= 2 ? [i] : s[0] === i ? [] : [...s, i]));
  };
  const pickMapStop = (sel) => {
    setFocusStop(sel);
    if (planMode === "two" && !homeStart) { setHomeStart(sel); return; }
    if (planMode === "two" && homeStart && homeStart.route === sel.route && homeStart.index === sel.index) { setHomeStart(null); return; }
    setDest((d) => (d && d.route === sel.route && d.index === sel.index ? null : sel));
  };

  // Open directions to a stop (optionally ending at a place), choosing the fastest boarding stop
  // from `from` (the phone's position by default, or a chosen start stop).
  const openDirectionsTo = (destSel, { from = null, finish = null } = {}) => {
    const origin = from ? { ...ROUTES[from.route].stops[from.index] } : null;
    const fromPos = origin ?? pos;
    let trip = [destSel];
    if (routingReady) {
      const plan = planToStop(destSel, fromPos, now, day);
      if (plan?.best?.kind === "ride") trip = [plan.best.board, destSel];
    } else if (from) trip = [from, destSel];
    setDirOrigin(origin);
    setDirFinish(finish);
    setMapTrip(trip);
    setMapTripDetail(true);
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

  /* ----- Directions (journey from the route explorer, or a map trip) ----- */
  if (journey && startStop && endStop) {
    return html`<${DirectionsScreen}
      trip=${[{ route: routeKey, index: selectedStops[0] }, { route: routeKey, index: selectedStops[1] }]}
      pos=${pos} live=${live} now=${now} day=${day} routingReady=${routingReady} geo=${geo}
      onBack=${() => setJourney(false)}
    />`;
  }
  if (mapTripDetail && mapTrip.length >= 1) {
    return html`<${DirectionsScreen} trip=${mapTrip} pos=${pos} live=${live} now=${now} day=${day} routingReady=${routingReady} geo=${geo} origin=${dirOrigin} finish=${dirFinish} onBack=${() => { setMapTripDetail(false); setDirOrigin(null); setDirFinish(null); }} />`;
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
      <div class="route-overview full-screen-map interactive-overview-map" ref=${overviewBox} ...${overviewPan.handlers}>
        <div class="overview-map-canvas" style=${transformStyle(overview)}>
          <img src=${OVERVIEW_MAP} alt="Combined map showing the Gold, Silver, and Tungsten Ore Cart routes" />
          <${YouMarker} fitKey="overview" pos=${pos} live=${live} className="overview-user-location" label=${live ? "You" : "Campus"} />
          ${routingReady && mapTrip.length
            ? html`<${ArtworkLegs} fitKey="overview" legs=${tripLegs(mapTrip, mapTrip.length === 2 ? ROUTES[mapTrip[0].route].stops[mapTrip[0].index] : pos, dirFinish)} />`
            : mapTrip.length === 2 &&
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
            (place, i) => place.offMap ? null : html`<button
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
        const near = closestStopTo(place);
        const nearStop = near ? ROUTES[near.route].stops[near.index] : null;
        return html`<section class="recommended-spot-detail">
          <span><${Icon} name="star" size=${18} /></span>
          <div>
            <small>${place.category}</small>
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            ${nearStop && html`<strong><${Icon} name="pin" size=${13} /> Closest stop: ${nearStop.name} (${ROUTES[near.route].shortName}) · ${near.minutes} min walk</strong>`}
            ${nearStop && html`<div class="spot-actions">
              <button type="button" class="spot-go" onClick=${() => openDirectionsTo({ route: near.route, index: near.index }, { finish: place })}>Directions from ${live ? "me" : "campus"} <${Icon} name="arrow" size=${14} /></button>
              <button type="button" class="spot-go secondary" onClick=${() => { setDirFinish(place); setMapTrip(mapTrip.length ? [mapTrip[0], { route: near.route, index: near.index }] : [{ route: near.route, index: near.index }]); if (!mapTrip.length) setFocusStop({ route: near.route, index: near.index }); setFocusPlace(null); }}>${mapTrip.length ? "Go here from start" : "Set as destination"}</button>
            </div>`}
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
          <div class="spot-actions">
            <button type="button" class="spot-go" onClick=${() => openDirectionsTo({ route: focusStop.route, index: focusStop.index })}>Directions from ${live ? "me" : "campus"} <${Icon} name="arrow" size=${14} /></button>
            <button
              type="button"
              class="spot-go secondary"
              onClick=${() => {
                const sel = { route: focusStop.route, index: focusStop.index };
                setMapTrip((t) => (t.length === 0 ? [sel] : t[0].route === sel.route && t[0].index === sel.index ? t : [t[0], sel]));
                setFocusStop(null);
              }}
            >
              ${mapTrip.length === 0 ? "Start here" : "Go here"}
            </button>
          </div>
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
          <button type="button" class="plan-map-route" onClick=${() => { setDirOrigin({ ...ROUTES[mapTrip[0].route].stops[mapTrip[0].index] }); setDirFinish(null); setMapTripDetail(true); }}>Use this trip <${Icon} name="arrow" size=${17} /></button>
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
      <${HomeMap} selectedStops=${[...(planMode === "two" && homeStart ? [homeStart] : []), ...(dest ? [dest] : [])]} onSelectStop=${pickMapStop} pos=${pos} live=${live}
        legs=${routingReady && dest ? tripLegs([dest], planMode === "two" && homeStart ? ROUTES[homeStart.route].stops[homeStart.index] : pos) : []} />
      <div class="home-brand">
        <span><img src=${LOGO} alt="" /></span>
        <div><strong>OreTransit</strong><small>GOLDEN, CO</small></div>
      </div>
      <${LocationNote} geo=${geo} className="home-map-note" />
    </section>
    <section class="home-route-list">
      <${HomePlanner} dest=${dest} setDest=${setDest} pos=${pos} live=${live} now=${now} day=${day} routingReady=${routingReady}
        mode=${planMode} setMode=${(m) => { setPlanMode(m); if (m === "me") setHomeStart(null); }} start=${homeStart} setStart=${setHomeStart}
        onGo=${(trip, origin) => { setDirOrigin(origin); setDirFinish(null); setMapTrip(trip); setMapTripDetail(true); }} />
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
                setRouteKey(key);
                setRouteFocus(key);
                setDest({ route: key, index: c.index });
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
