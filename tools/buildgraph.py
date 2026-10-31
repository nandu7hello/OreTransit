"""Build a compact routing graph for Golden from the OSM ways.
Output graph.json:
  { "nodes": [lat_e6, lon_e6, ...] (flat, quantised),
    "names": [...],
    "edges": [a, b, len_m, nameIdx, flags, ...] (flat; flags: 1=walk, 2=drive, 4=drive only a->b (oneway)) }
"""
import json, math

roads = json.load(open("roads.json"))["elements"]
paths = json.load(open("paths.json"))["elements"]

WALK_OK = {"footway","path","pedestrian","steps","cycleway","track","bridleway","corridor","residential","living_street",
           "unclassified","tertiary","secondary","primary","service","tertiary_link","secondary_link","primary_link"}
DRIVE_OK = {"motorway","trunk","primary","secondary","tertiary","residential","unclassified","living_street","service",
            "motorway_link","trunk_link","primary_link","secondary_link","tertiary_link"}
NO_WALK = {"motorway","trunk","motorway_link","trunk_link"}

nodes = {}      # osm node id -> index
coords = []     # [lat, lon]
names = {}; name_list = []
edges = {}      # (a,b) -> [len, nameIdx, flags]

def name_idx(n):
    if n not in names:
        names[n] = len(name_list); name_list.append(n)
    return names[n]

def dist(a, b):
    R = 6371000; la1, lo1 = math.radians(a[0]), math.radians(a[1]); la2, lo2 = math.radians(b[0]), math.radians(b[1])
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))

BBOX = (39.722, -105.247, 39.773, -105.192)  # lat_min, lon_min, lat_max, lon_max (map coverage + margin)
def inbox(g): return BBOX[0] <= g["lat"] <= BBOX[2] and BBOX[1] <= g["lon"] <= BBOX[3]

def add_way(w, walk, drive):
    tags = w.get("tags", {})
    hw = tags.get("highway")
    if tags.get("access") in ("private", "no") and hw != "footway":
        return
    if hw in NO_WALK: walk = False
    if hw == "steps": pass
    if tags.get("foot") == "no": walk = False
    if tags.get("sidewalk") == "no" and hw in ("primary", "secondary"): walk = False
    if not walk and not drive: return
    oneway = tags.get("oneway") in ("yes", "1", "true") or tags.get("junction") == "roundabout"
    nm = tags.get("name") or ("" if hw not in ("footway","path","steps","cycleway") else {"footway":"footpath","path":"path","steps":"stairs","cycleway":"bike path"}[hw])
    ni = name_idx(nm)
    ids = w["nodes"]; geom = w["geometry"]
    for (ia, ga), (ib, gb) in zip(zip(ids, geom), zip(ids[1:], geom[1:])):
        for i, g in ((ia, ga), (ib, gb)):
            if i not in nodes:
                nodes[i] = len(coords); coords.append([g["lat"], g["lon"]])
        a, b = nodes[ia], nodes[ib]
        if a == b: continue
        if not (inbox(ga) or inbox(gb)): continue
        d = dist((ga["lat"], ga["lon"]), (gb["lat"], gb["lon"]))
        flags = (1 if walk else 0) | (2 if drive else 0) | (4 if (drive and oneway) else 0)
        key = (min(a, b), max(a, b))
        if a > b and (flags & 4): flags = (flags & ~4) | 8   # oneway runs from key[1] to key[0]
        if key in edges: edges[key][2] |= flags
        else: edges[key] = [round(d, 1), ni, flags]

for w in roads:
    hw = w.get("tags", {}).get("highway")
    if hw == "track": continue
    add_way(w, hw in WALK_OK, hw in DRIVE_OK)
for w in paths:
    hw = w.get("tags", {}).get("highway")
    add_way(w, True, False)

used = {}
for (a, b) in edges:
    for n in (a, b):
        if n not in used: used[n] = len(used)
flat_nodes = []
for n, _ in sorted(used.items(), key=lambda kv: kv[1]):
    la, lo = coords[n]; flat_nodes += [round(la * 1e6), round(lo * 1e6)]
flat_edges = []
for (a, b), (d, ni, fl) in edges.items():
    flat_edges += [used[a], used[b], d, ni, fl]
coords = [coords[n] for n, _ in sorted(used.items(), key=lambda kv: kv[1])]
out = {"nodes": flat_nodes, "names": name_list, "edges": flat_edges}
json.dump(out, open("C:/Users/gbpnk/Code/oretransit/graph.json", "w"), separators=(",", ":"))
import os
print(f"nodes {len(coords)} edges {len(edges)} names {len(name_list)} -> {os.path.getsize('C:/Users/gbpnk/Code/oretransit/graph.json')/1024:.0f} KB")
