"""Prepare render data for new map images (overview + one per route) from real geography.
Writes render-<key>.json with everything in pixel coordinates, plus fits.json with the exact
lat/lon -> percent georeference for each image."""
import json, math, re, heapq

OUT = "C:/Users/gbpnk/Code/oretransit"
ROADS = json.load(open("roads.json"))["elements"]
FEAT = json.load(open("features.json"))["elements"]
G = json.load(open(OUT + "/graph.json"))
src = open(OUT + "/data.js", encoding="utf-8").read()

# ---- stops from data.js ----
ROUTES = {}
for key in ("gold", "tungsten", "silver"):
    block = re.search(key + r": \{.*?stops: \[(.*?)\n    \],", src, re.S).group(1)
    ROUTES[key] = [{"name": m.group(1), "lat": float(m.group(2)), "lon": float(m.group(3))}
                   for m in re.finditer(r'name: "([^"]+)", x: [\d.]+, y: [\d.]+, lat: ([\d.-]+), lon: ([\d.-]+)', block)]
COLORS = {"gold": "#b88924", "tungsten": "#ef633e", "silver": "#27766f"}
PLACES = [(m.group(1), float(m.group(2)), float(m.group(3))) for m in re.finditer(r'\{ name: "([^"]+)", category: "[^"]+", description: "[^"]+", route: "\w+", nearStop: "[^"]+", lat: ([\d.-]+), lon: ([\d.-]+)', src)]

# ---- driving graph + Dijkstra for shuttle paths ----
n = len(G["nodes"]) // 2
lat = [G["nodes"][2*i] / 1e6 for i in range(n)]; lon = [G["nodes"][2*i+1] / 1e6 for i in range(n)]
adj = [[] for _ in range(n)]
E = G["edges"]
for i in range(0, len(E), 5):
    a, b, L, ni, fl = E[i:i+5]
    if not (fl & 2): continue
    if not (fl & 8): adj[a].append((b, L))   # a->b allowed unless oneway b->a
    if not (fl & 4): adj[b].append((a, L))   # b->a allowed unless oneway a->b
def nearest(la, lo):
    best, bd = -1, 1e18
    cl = math.cos(math.radians(la))
    for i in range(n):
        if not adj[i]: continue
        d = ((lat[i]-la)*111000)**2 + ((lon[i]-lo)*111000*cl)**2
        if d < bd: bd, best = d, i
    return best
def dijkstra(s, t):
    dist = {s: 0}; prev = {}; pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == t: break
        if d > dist.get(u, 1e18): continue
        for v, L in adj[u]:
            nd = d + L
            if nd < dist.get(v, 1e18): dist[v] = nd; prev[v] = u; heapq.heappush(pq, (nd, v))
    if t not in dist: return None
    path = [t]
    while path[-1] != s: path.append(prev[path[-1]])
    return path[::-1]
ROUTE_PATHS = {}
for key, stops in ROUTES.items():
    nodes = [nearest(s["lat"], s["lon"]) for s in stops]
    coords = []
    for i in range(len(stops)):
        j = (i + 1) % len(stops)
        p = dijkstra(nodes[i], nodes[j])
        seg = [(stops[i]["lat"], stops[i]["lon"])] + ([(lat[k], lon[k]) for k in p] if p else []) + [(stops[j]["lat"], stops[j]["lon"])]
        coords += seg if not coords else seg[1:]
    ROUTE_PATHS[key] = coords
    print(key, "path points", len(coords))

# ---- projection helpers ----
def make_proj(lat0, lat1, lon0, lon1, width):
    """Equirectangular, north-up. Returns (proj, W, H, fit)."""
    clat = math.cos(math.radians((lat0 + lat1) / 2))
    kx = width / ((lon1 - lon0) * clat)
    H = int(round((lat1 - lat0) * kx))
    def proj(la, lo): return ((lo - lon0) * clat * kx, (lat1 - la) * kx)
    # percent fit: x% = a*lon + c ; y% = b*lat + d
    a = clat * kx / width * 100; c = -lon0 * a
    b = -kx / H * 100; d = lat1 * kx / H * 100
    return proj, width, H, {"x": [a, 0.0, c], "y": [0.0, b, d]}

ROAD_CLASS = {"motorway": 3, "trunk": 3, "primary": 3, "secondary": 2, "tertiary": 2, "residential": 1, "unclassified": 1, "living_street": 1,
              "service": 0, "motorway_link": 2, "trunk_link": 2, "primary_link": 2, "secondary_link": 2, "tertiary_link": 1}
SHORT = {"Street": "St", "Avenue": "Ave", "Road": "Rd", "Drive": "Dr", "Boulevard": "Blvd", "Parkway": "Pkwy", "Circle": "Cir", "Court": "Ct", "Lane": "Ln", "Place": "Pl", "Highway": "Hwy"}
def short(name):
    return " ".join(SHORT.get(w, w) for w in name.split())

def build(key, lat0, lat1, lon0, lon1, width, emphasize=None, label_min_class=1):
    proj, W, H, fit = make_proj(lat0, lat1, lon0, lon1, width)
    inb = lambda la, lo: lat0 - 0.004 <= la <= lat1 + 0.004 and lon0 - 0.005 <= lo <= lon1 + 0.005
    roads = []; labels = {}
    for w in ROADS:
        hw = w["tags"].get("highway"); cls = ROAD_CLASS.get(hw)
        if cls is None: continue
        g = w["geometry"]
        if not any(inb(p["lat"], p["lon"]) for p in g): continue
        pts = [proj(p["lat"], p["lon"]) for p in g]
        roads.append({"c": cls, "p": [[round(x, 1), round(y, 1)] for x, y in pts]})
        name = w["tags"].get("name")
        if name and cls >= label_min_class and hw != "service":
            # label at the middle of the way, angle from the way's overall direction (inside the image only)
            inside = [(x, y) for x, y in pts if 0 < x < W and 0 < y < H]
            if len(inside) < 2: continue
            L = sum(math.hypot(x2-x1, y2-y1) for (x1, y1), (x2, y2) in zip(inside, inside[1:]))
            mid = inside[len(inside) // 2]
            (x1, y1), (x2, y2) = inside[max(0, len(inside)//2 - 1)], inside[min(len(inside)-1, len(inside)//2 + 1)]
            ang = math.degrees(math.atan2(y2-y1, x2-x1))
            if name not in labels or L > labels[name][0]: labels[name] = (L, mid[0], mid[1], ang, cls)
    label_list = []; placed = []
    font_w = 11  # approx px per character at the label size
    for name, (L, x, y, ang, cls) in sorted(labels.items(), key=lambda kv: (-kv[1][4], -kv[1][0])):
        if ang > 90: ang -= 180
        if ang < -90: ang += 180
        text = short(name)
        if L < 110 or len(text) * font_w > L + 40: continue
        # collision check with already placed labels (rough circles)
        r = len(text) * font_w / 2
        if any(math.hypot(x - px, y - py) < r + pr + 18 for px, py, pr in placed): continue
        placed.append((x, y, r))
        label_list.append({"t": text, "x": round(x, 1), "y": round(y, 1), "a": round(ang, 1)})
    LANDMARKS = [("COLORADO SCHOOL|OF MINES", 39.7497, -105.2232), ("Coors Brewery", 39.7568, -105.2150), ("MINES PARK", 39.7408, -105.2255),
                 ("South Table|Mountain", 39.7500, -105.1985), ("Golden High|School", 39.7447, -105.2095), ("Fossil Trace|Golf Club", 39.7395, -105.2130),
                 ("Clear Creek Athletics|Complex / K Lot", 39.7558, -105.2300), ("Lookout Mountain Rd", 39.7395, -105.2360), ("Jeffco Government|Center", 39.7278, -105.2040)]
    landmarks = []
    for text, la, lo in LANDMARKS:
        x, y = proj(la, lo)
        if 20 < x < W - 20 and 20 < y < H - 20: landmarks.append({"t": text, "x": round(x, 1), "y": round(y, 1)})
    water = []; parks = []; campus = []
    for w in FEAT:
        t = w.get("tags", {}); g = w.get("geometry", [])
        if not g or not any(inb(p["lat"], p["lon"]) for p in g): continue
        pts = [[round(v, 1) for v in proj(p["lat"], p["lon"])] for p in g]
        if t.get("waterway") in ("river", "stream", "canal"): water.append({"p": pts, "w": 6 if t.get("waterway") == "river" else 3})
        elif t.get("natural") == "water": water.append({"poly": pts})
        elif t.get("leisure") == "park" or t.get("landuse") in ("grass", "recreation_ground"): parks.append(pts)
        elif t.get("amenity") == "university": campus.append(pts)
    routes = {k: {"color": COLORS[k], "p": [[round(v, 1) for v in proj(la, lo)] for la, lo in ROUTE_PATHS[k]], "emph": (emphasize is None or k == emphasize)} for k in ROUTES}
    stops = {k: [{"name": s["name"], "x": round(proj(s["lat"], s["lon"])[0], 1), "y": round(proj(s["lat"], s["lon"])[1], 1)} for s in ROUTES[k]] for k in ROUTES}
    data = {"key": key, "W": W, "H": H, "roads": roads, "labels": label_list[:90], "water": water, "parks": parks, "campus": campus,
            "landmarks": landmarks, "routes": routes, "stops": stops, "title": {"overview": "Ore Cart Routes", "gold": "Gold Route", "tungsten": "Tungsten Route", "silver": "Silver Route"}[key]}
    json.dump(data, open(f"render-{key}.json", "w"))
    return fit, W, H

fits = {}
# overview: covers every stop and the drawn places, portrait like the current artwork (726x942)
fits["overview"] = build("overview", 39.7235, 39.7705, -105.2430, -105.1945, 1452)
def bbox(key, m=0.0035):
    las = [s["lat"] for s in ROUTES[key]] + [p[0] for p in ROUTE_PATHS[key]]
    los = [s["lon"] for s in ROUTES[key]] + [p[1] for p in ROUTE_PATHS[key]]
    la0, la1, lo0, lo1 = min(las) - m, max(las) + m, min(los) - m * 1.3, max(los) + m * 1.3
    # keep a sensible portrait/landscape ratio (not too thin)
    clat = math.cos(math.radians((la0 + la1) / 2))
    wdeg, hdeg = (lo1 - lo0) * clat, (la1 - la0)
    if hdeg / wdeg > 1.35: ex = (hdeg / 1.35 - wdeg) / 2 / clat; lo0 -= ex; lo1 += ex
    if wdeg / hdeg > 1.2: ey = (wdeg / 1.2 - hdeg) / 2; la0 -= ey; la1 += ey
    return la0, la1, lo0, lo1
for key in ROUTES:
    la0, la1, lo0, lo1 = bbox(key)
    fits[key] = build(key, la0, la1, lo0, lo1, 1600, emphasize=key)
json.dump({k: {"fit": v[0], "W": v[1], "H": v[2]} for k, v in fits.items()}, open("newmaps-fits.json", "w"), indent=1)
json.dump({"routes": ROUTES, "places": PLACES}, open("newmaps-geo.json", "w"))
for k, v in fits.items(): print(k, v[1], "x", v[2])
