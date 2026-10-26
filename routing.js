// Street routing for OreTransit: walking directions and shuttle paths over the
// OpenStreetMap network of Golden (graph.json, built from OSM data).

import { ROUTES, ROUTE_KEYS } from "./data.js";

const WALK = 1, DRIVE = 2, ONEWAY_AB = 4, ONEWAY_BA = 8;
const WALK_SPEED = 80; // metres per minute (about 3 mph)

let graph = null; // { lat: Float64Array, lon: Float64Array, adj: Array<Array<[to, len, nameIdx, flags, dirForward]>>, names }
let loading = null;

export function loadGraph() {
  if (graph) return Promise.resolve(graph);
  if (loading) return loading;
  loading = fetch("graph.json")
    .then((r) => r.json())
    .then((g) => {
      const n = g.nodes.length / 2;
      const lat = new Float64Array(n), lon = new Float64Array(n);
      for (let i = 0; i < n; i++) { lat[i] = g.nodes[2 * i] / 1e6; lon[i] = g.nodes[2 * i + 1] / 1e6; }
      const adj = Array.from({ length: n }, () => []);
      for (let i = 0; i < g.edges.length; i += 5) {
        const a = g.edges[i], b = g.edges[i + 1], len = g.edges[i + 2], ni = g.edges[i + 3], fl = g.edges[i + 4];
        adj[a].push([b, len, ni, fl, true]);
        adj[b].push([a, len, ni, fl, false]);
      }
      graph = { lat, lon, adj, names: g.names, n };
      return graph;
    });
  return loading;
}

export function graphReady() { return !!graph; }

export function haversine(aLat, aLon, bLat, bLon) {
  const R = 6371000, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat), dLon = toRad(bLon - aLon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function usable(edge, mode, forward) {
  const fl = edge[3];
  if (mode === "walk") return (fl & WALK) !== 0;
  if (!(fl & DRIVE)) return false;
  if (fl & ONEWAY_AB) return forward;   // allowed only a->b
  if (fl & ONEWAY_BA) return !forward;  // allowed only b->a
  return true;
}

// Nearest graph node usable in the given mode (brute force; 32k nodes is fine).
export function nearestNode(lat, lon, mode = "walk") {
  const g = graph; let best = -1, bd = Infinity;
  const cosLat = Math.cos((lat * Math.PI) / 180);
  for (let i = 0; i < g.n; i++) {
    const dy = (g.lat[i] - lat) * 111000, dx = (g.lon[i] - lon) * 111000 * cosLat;
    const d = dx * dx + dy * dy;
    if (d < bd && g.adj[i].some((e) => usable(e, mode, e[4]))) { bd = d; best = i; }
  }
  return best;
}

// Binary min-heap on [dist, node]
class Heap {
  constructor() { this.a = []; }
  push(d, n) { const a = this.a; a.push([d, n]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a; const top = a[0]; const last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; }
  get size() { return this.a.length; }
}

// Dijkstra from node s to node t. Returns { nodes: [idx...], edges: [[nameIdx,len]...], length } or null.
export function shortestPath(s, t, mode = "walk") {
  const g = graph;
  const dist = new Float64Array(g.n).fill(Infinity);
  const prev = new Int32Array(g.n).fill(-1);
  const prevEdge = new Array(g.n);
  const heap = new Heap();
  dist[s] = 0; heap.push(0, s);
  while (heap.size) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;
    if (u === t) break;
    for (const e of g.adj[u]) {
      if (!usable(e, mode, e[4])) continue;
      // light penalty for stairs when walking so ramps are preferred when similar
      const w = e[1] * (mode === "walk" && g.names[e[2]] === "stairs" ? 1.3 : 1);
      const nd = d + w;
      if (nd < dist[e[0]]) { dist[e[0]] = nd; prev[e[0]] = u; prevEdge[e[0]] = e; heap.push(nd, e[0]); }
    }
  }
  if (dist[t] === Infinity) return null;
  const nodes = [], edges = [];
  for (let v = t; v !== -1; v = prev[v]) { nodes.push(v); if (prevEdge[v]) edges.push(prevEdge[v]); }
  nodes.reverse(); edges.reverse();
  let length = 0; for (const e of edges) length += e[1];
  return { nodes, edges, length };
}

export function pathCoords(path) {
  return path.nodes.map((i) => [graph.lat[i], graph.lon[i]]);
}

function bearing(aLat, aLon, bLat, bLon) {
  const toRad = (d) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(bLon - aLon)) * Math.cos(toRad(bLat));
  const x = Math.cos(toRad(aLat)) * Math.sin(toRad(bLat)) - Math.sin(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.cos(toRad(bLon - aLon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
const COMPASS = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
const compass = (b) => COMPASS[Math.round(b / 45) % 8];

export function fmtDistance(m) {
  const ft = m * 3.28084;
  if (ft < 1000) return `${Math.round(ft / 10) * 10} ft`;
  return `${(m / 1609.34).toFixed(1)} mi`;
}

// Turn-by-turn steps for a walking path: [{ text, distance, coords: [[lat,lon]...] }]
export function walkingSteps(path, destinationName) {
  const g = graph;
  if (!path || path.edges.length === 0) return [];
  // group consecutive edges by street name
  const legs = [];
  path.edges.forEach((e, i) => {
    const name = g.names[e[2]] || "";
    const a = path.nodes[i], b = path.nodes[i + 1];
    const last = legs[legs.length - 1];
    if (last && last.name === name) { last.len += e[1]; last.nodes.push(b); }
    else legs.push({ name, len: e[1], nodes: [a, b] });
  });
  // merge tiny unnamed connectors into neighbours
  const merged = [];
  for (const l of legs) {
    const last = merged[merged.length - 1];
    if (last && (l.len < 25 || (!l.name && last.name))) { last.len += l.len; last.nodes.push(...l.nodes.slice(1)); }
    else if (last && !last.name && l.name && last.len < 60) { l.len += last.len; l.nodes = [...last.nodes.slice(0, -1), ...l.nodes]; merged[merged.length - 1] = l; }
    else merged.push({ ...l });
  }
  const steps = [];
  let prevBearing = null;
  merged.forEach((l, i) => {
    const n0 = l.nodes[0], n1 = l.nodes[Math.min(1, l.nodes.length - 1)];
    const b = bearing(g.lat[n0], g.lon[n0], g.lat[n1], g.lon[n1]);
    const onto = l.name ? `${l.name === "footpath" || l.name === "path" || l.name === "stairs" || l.name === "bike path" ? "the " + l.name : l.name}` : "the road";
    let text;
    if (i === 0) text = `Head ${compass(b)} on ${onto}`;
    else {
      let turn = ((b - prevBearing + 540) % 360) - 180; // -180..180
      const dir = Math.abs(turn) < 25 ? "Continue onto" : Math.abs(turn) < 70 ? (turn > 0 ? "Bear right onto" : "Bear left onto") : Math.abs(turn) < 160 ? (turn > 0 ? "Turn right onto" : "Turn left onto") : "Make a U-turn onto";
      text = `${dir} ${onto}`;
    }
    const nEnd = l.nodes[l.nodes.length - 1], nPrev = l.nodes[Math.max(0, l.nodes.length - 2)];
    prevBearing = bearing(g.lat[nPrev], g.lon[nPrev], g.lat[nEnd], g.lon[nEnd]);
    steps.push({ text, distance: l.len, coords: l.nodes.map((n) => [g.lat[n], g.lon[n]]) });
  });
  steps.push({ text: `Arrive at ${destinationName}`, distance: 0, coords: [] });
  return steps;
}

// Walking route from a position to a stop.
export function walkTo(pos, stop) {
  if (!graph) return null;
  const s = nearestNode(pos.lat, pos.lon, "walk");
  const t = nearestNode(stop.lat, stop.lon, "walk");
  if (s < 0 || t < 0) return null;
  const path = s === t ? { nodes: [s], edges: [], length: 0 } : shortestPath(s, t, "walk");
  if (!path) return null;
  // include the off-network bits at both ends
  const head = haversine(pos.lat, pos.lon, graph.lat[s], graph.lon[s]);
  const tail = haversine(graph.lat[t], graph.lon[t], stop.lat, stop.lon);
  const coords = [[pos.lat, pos.lon], ...pathCoords(path), [stop.lat, stop.lon]];
  const length = head + path.length + tail;
  return { coords, length, minutes: Math.max(1, Math.ceil(length / WALK_SPEED)), steps: walkingSteps(path, stop.name) };
}

// Shuttle paths along streets, stop to stop around each loop. Cached per route.
const shuttleCache = {};
export function shuttlePath(routeKey) {
  if (!graph) return null;
  if (shuttleCache[routeKey]) return shuttleCache[routeKey];
  const stops = ROUTES[routeKey].stops;
  const nodes = stops.map((s) => nearestNode(s.lat, s.lon, "drive"));
  const segs = [];
  for (let i = 0; i < stops.length; i++) {
    const j = (i + 1) % stops.length;
    const p = shortestPath(nodes[i], nodes[j], "drive");
    segs.push(p ? [[stops[i].lat, stops[i].lon], ...pathCoords(p), [stops[j].lat, stops[j].lon]] : [[stops[i].lat, stops[i].lon], [stops[j].lat, stops[j].lon]]);
  }
  shuttleCache[routeKey] = segs; // segs[i] = street path from stop i to stop i+1 (wrapping)
  return segs;
}

// Street path ridden from stop `from` to stop `to` on a route (following the loop direction).
export function rideCoords(routeKey, from, to) {
  const segs = shuttlePath(routeKey);
  if (!segs) return [[ROUTES[routeKey].stops[from].lat, ROUTES[routeKey].stops[from].lon], [ROUTES[routeKey].stops[to].lat, ROUTES[routeKey].stops[to].lon]];
  const n = segs.length; const out = [];
  for (let i = from; i !== to; i = (i + 1) % n) out.push(...(out.length ? segs[i].slice(1) : segs[i]));
  return out.length ? out : [segs[from][0]];
}

export function allShuttlePaths() {
  return Object.fromEntries(ROUTE_KEYS.map((k) => [k, shuttlePath(k)]));
}
