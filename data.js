// Route, stop and place data for the Ore Cart network (Golden, CO).
// Stop x/y are percentages on the matching map image, on the cart icons drawn on it;
// lat/lon (WGS84) are derived from those icon positions through the map georeference.

export const ROUTES = {
  gold: {
    name: "Gold Route",
    shortName: "Gold",
    color: "#b88924",
    pale: "#f5e7bb",
    map: "assets/gold-map.png",
    schedule: "assets/gold-schedule.png",
    frequency: "15–30 min",
    service: "Downtown loop",
    aspect: "1600 / 2133",
    location: { x: 25, y: 49 },
    closestStop: 1,
    walkToClosest: 5,
    departures: ["10:45 AM", "11:00 AM", "11:15 AM"],
    stops: [
      { name: "Guggenheim", x: 68.38, y: 84.85, lat: 39.751032, lon: -105.223184 },
      { name: "11th & Maple", x: 54.56, y: 71.88, lat: 39.754029, lon: -105.226301 },
      { name: "11th & Miners Alley", x: 70.07, y: 63.55, lat: 39.755955, lon: -105.222804 },
      { name: "Parfet Park / RTD Hub", x: 70.95, y: 57.45, lat: 39.757364, lon: -105.222605 },
      { name: "10th & Cheyenne", x: 57.58, y: 60.16, lat: 39.756738, lon: -105.22562 },
      { name: "Community Center", x: 27.72, y: 67.28, lat: 39.755094, lon: -105.232354 },
      { name: "Canyon Gate Apartments", x: 20.72, y: 67.42, lat: 39.755061, lon: -105.233933 },
      { name: "8th & SH 58", x: 35.78, y: 63.26, lat: 39.756021, lon: -105.230538 },
      { name: "Ford & 5th", x: 59.18, y: 35.43, lat: 39.762454, lon: -105.225259 },
      { name: "Ford & 1st", x: 46.33, y: 20.04, lat: 39.766011, lon: -105.228158 },
      { name: "Ruby Drive Commercial", x: 23.41, y: 19.08, lat: 39.766234, lon: -105.233326 },
      { name: "Iowa & Washington", x: 30.23, y: 21.59, lat: 39.765654, lon: -105.231789 },
      { name: "Washington & 3rd", x: 43.11, y: 32.19, lat: 39.763204, lon: -105.228885 },
      { name: "Golden Visitors Center", x: 67.75, y: 59.1, lat: 39.756984, lon: -105.223327 },
      { name: "13th & Miners Alley", x: 76.95, y: 70.62, lat: 39.754321, lon: -105.221252 },
    ],
  },
  tungsten: {
    name: "Tungsten Route",
    shortName: "Tungsten",
    color: "#ef633e",
    pale: "#fbe0d8",
    map: "assets/tungsten-map.png",
    schedule: "assets/tungsten-schedule.png",
    frequency: "30 min",
    service: "Mines & south Golden",
    aspect: "1600 / 2160",
    location: { x: 40, y: 40 },
    closestStop: 3,
    walkToClosest: 7,
    departures: ["10:47 AM", "11:17 AM", "11:47 AM"],
    stops: [
      { name: "RTD Jeffco W Line Station", x: 82.5, y: 86.69, lat: 39.726778, lon: -105.198804 },
      { name: "Splash at Fossil Trace", x: 52.26, y: 64.35, lat: 39.735402, lon: -105.21005 },
      { name: "Jefferson County Human Services", x: 56.51, y: 72.99, lat: 39.732066, lon: -105.208468 },
      { name: "Kafadar Commons", x: 19.52, y: 23.06, lat: 39.751341, lon: -105.222226 },
      { name: "11th & Miners Alley", x: 18.22, y: 11.18, lat: 39.755926, lon: -105.222708 },
      { name: "1600 Jackson St", x: 34.43, y: 21.02, lat: 39.752128, lon: -105.216681 },
      { name: "CTLM Lot", x: 28.81, y: 26.42, lat: 39.750045, lon: -105.218769 },
      { name: "Lewis Court", x: 45.45, y: 33.29, lat: 39.747392, lon: -105.212582 },
      { name: "Summit View Apts / 14th & Johnson", x: 74.23, y: 58.52, lat: 39.73765, lon: -105.201879 },
    ],
  },
  silver: {
    name: "Silver Route",
    shortName: "Silver",
    color: "#27766f",
    pale: "#d7ebe6",
    map: "assets/silver-map.png",
    schedule: "assets/silver-schedule.png",
    frequency: "15–30 min",
    service: "Mines campus loop",
    aspect: "1600 / 2160",
    location: { x: 37, y: 57 },
    closestStop: 4,
    walkToClosest: 3,
    departures: ["10:50 AM", "11:05 AM", "11:20 AM"],
    stops: [
      { name: "Survey Field", x: 44.6, y: 73.42, lat: 39.742876, lon: -105.224875 },
      { name: "Mines Park Community Center", x: 49.73, y: 80.8, lat: 39.741359, lon: -105.22386 },
      { name: "The Quarry", x: 57.5, y: 82.97, lat: 39.740913, lon: -105.222321 },
      { name: "Lookout Apartments", x: 69.96, y: 56.2, lat: 39.746415, lon: -105.219855 },
      { name: "Kafadar", x: 57.36, y: 32.24, lat: 39.75134, lon: -105.222349 },
      { name: "K Lot", x: 26.86, y: 21.44, lat: 39.75356, lon: -105.228388 },
      { name: "Guggenheim", x: 53.18, y: 33.87, lat: 39.751005, lon: -105.223177 },
      { name: "Mines Student Recreation Center", x: 52.97, y: 46.37, lat: 39.748436, lon: -105.223219 },
      { name: "Pinal Rd & 19th St", x: 39.55, y: 64.84, lat: 39.74464, lon: -105.225876 },
    ],
  },
};

export const ROUTE_KEYS = Object.keys(ROUTES);

// Initial zoom/offset for each route's own map.
export const ROUTE_MAP_VIEW = {
  gold: { zoom: 1.25, x: -0.12, y: -0.12 },
  tungsten: { zoom: 1.2, x: -0.1, y: -0.1 },
  silver: { zoom: 1.25, x: -0.12, y: -0.12 },
};

// Georeference for each map image (percent = a*lon + c, b*lat + d). The maps are rendered by the
// project itself from OpenStreetMap data (scratchpad: prepmap.py + RenderMap.ps1), so these are exact.
export const MAP_FIT = {
  gold: { x: [4433.803316, 0.000000, 466607.284739], y: [0.000000, -4326.391804, 172063.388239] },
  tungsten: { x: [2689.099175, 0.000000, 282972.516180], y: [0.000000, -2590.472243, 102997.803279] },
  silver: { x: [5050.217892, 0.000000, 531453.150297], y: [0.000000, -4865.469761, 193441.181336] },
  overview: { x: [2061.855670, 0.000000, 216995.876289], y: [0.000000, -2127.736638, 84621.149946] },
};

export function geoToMap(fitKey, lat, lon) {
  const f = MAP_FIT[fitKey];
  return { x: f.x[0] * lon + f.x[1] * lat + f.x[2], y: f.y[0] * lon + f.y[1] * lat + f.y[2] };
}

// Stop positions on the combined all-routes map (percentages), on the drawn cart icons.
export const OVERVIEW_STOPS = {
  gold: [
    { x: 40.86, y: 41.42 },
    { x: 34.43, y: 35.05 },
    { x: 41.64, y: 30.95 },
    { x: 42.05, y: 27.95 },
    { x: 35.84, y: 29.28 },
    { x: 21.95, y: 32.78 },
    { x: 18.69, y: 32.85 },
    { x: 25.69, y: 30.81 },
    { x: 36.58, y: 17.12 },
    { x: 30.6, y: 9.55 },
    { x: 19.95, y: 9.08 },
    { x: 23.12, y: 10.31 },
    { x: 29.1, y: 15.52 },
    { x: 40.56, y: 28.76 },
    { x: 44.84, y: 34.42 },
  ],
  tungsten: [
    { x: 91.13, y: 93.03 },
    { x: 67.94, y: 74.68 },
    { x: 71.2, y: 81.78 },
    { x: 42.83, y: 40.77 },
    { x: 41.84, y: 31.01 },
    { x: 54.27, y: 39.09 },
    { x: 49.96, y: 43.52 },
    { x: 62.72, y: 49.17 },
    { x: 84.79, y: 69.9 },
  ],
  silver: [
    { x: 37.37, y: 58.78 },
    { x: 39.46, y: 62.0 },
    { x: 42.64, y: 62.95 },
    { x: 47.72, y: 51.25 },
    { x: 42.58, y: 40.77 },
    { x: 30.13, y: 36.04 },
    { x: 40.87, y: 41.48 },
    { x: 40.79, y: 46.95 },
    { x: 35.31, y: 55.02 },
  ],
};

// Recommended places at their real coordinates (OpenStreetMap / Nominatim), positioned on the
// overview map through MAP_FIT.overview. offMap: the place lies outside the drawn map area.
export const PLACES = [
  { name: "Mines Geology Museum", category: "Landmarks & Science", description: "Lunar rocks and mineral collections.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7518482, lon: -105.224827, x: 37.47, y: 39.69 },
  { name: "Guggenheim Hall", category: "Landmarks & Science", description: "Historic administrative building.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7508896, lon: -105.2228149, x: 41.62, y: 41.73 },
  { name: "Arthur Lakes Library", category: "Landmarks & Science", description: "Main university library.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7514296, lon: -105.2233302, x: 40.56, y: 40.58 },
  { name: "Period Table", category: "Food & Dining", description: "Campus dining hall.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7479, lon: -105.22215, x: 42.99, y: 48.09 },
  { name: "Earthlinks Coffee Shop", category: "Coffee", description: "Campus coffee shop.", route: "silver", nearStop: "Mines Campus Core", lat: 39.74985, lon: -105.2242, x: 38.76, y: 43.94 },
  { name: "Student Recreation Center", category: "Recreation", description: "Student fitness and recreation facility.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7490558, lon: -105.2227508, x: 41.75, y: 45.63 },
  { name: "Volk Gymnasium", category: "Recreation", description: "Historic athletics gymnasium.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7519513, lon: -105.2238169, x: 39.55, y: 39.47 },
  { name: "Clear Creek Trail", category: "Trails", description: "Walking and biking path along Clear Creek.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7645562, lon: -105.2127184, x: 62.44, y: 12.65 },
  { name: "Marv Kay Stadium", category: "Landmarks & Recreation", description: "Mines football stadium.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7526252, lon: -105.2270611, x: 32.86, y: 38.03 },
  { name: "Campbell Field", category: "Landmarks & Recreation", description: "Mines baseball field.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7531207, lon: -105.2274505, x: 32.06, y: 36.98 },
  { name: "Chimney Gulch Trailhead", category: "Trails", description: "Trailhead leading up Lookout Mountain.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7407965, lon: -105.2376435, x: 11.04, y: 63.2 },
  { name: "Windy Saddle Park", category: "Trails & Parks", description: "Mountain park and trail network.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7410919, lon: -105.2409802, x: 4.16, y: 62.57 },
  { name: "Mines Park Apartments", category: "Housing", description: "Student housing complex.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.741317, lon: -105.2236198, x: 39.96, y: 62.09 },
  { name: "Lookout Apartments", category: "Housing", description: "Student housing complex.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.7447, lon: -105.2212, x: 44.95, y: 54.9 },
  { name: "Lookout Mountain Trail", category: "Trails", description: "Mountain hiking trail.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.7408, lon: -105.23764, x: 11.05, y: 63.19 },
  { name: "Beaver Brook Trail", category: "Trails", description: "Hiking trail system.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.74109, lon: -105.24098, x: 4.16, y: 62.58 },
  { name: "South Table Mountain", category: "Trails & Nature", description: "Mesa access from 19th Street.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.7518002, lon: -105.196059, x: 96.79, y: 39.79 },
  { name: "Jeffco Government Center W-Line Station", category: "Transit", description: "RTD light rail station.", route: "tungsten", nearStop: "RTD Jeffco Government Center", lat: 39.72651, lon: -105.20137, x: 85.84, y: 93.6 },
  { name: "Jefferson County Courthouse", category: "Government & Services", description: "County courthouse.", route: "tungsten", nearStop: "RTD Jeffco Government Center", lat: 39.7285431, lon: -105.2015403, x: 85.48, y: 89.27 },
  { name: "Jeffco Human Services Building", category: "Government & Services", description: "County services facility.", route: "tungsten", nearStop: "RTD Jeffco Government Center", lat: 39.7320857, lon: -105.210309, x: 67.4, y: 81.74 },
  { name: "The Splash at Fossil Trace Aquatic Park", category: "Recreation", description: "Outdoor water park.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.73538, lon: -105.20856, x: 71.01, y: 74.73 },
  { name: "Fossil Trace Golf Club", category: "Recreation", description: "Public golf course.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.7413323, lon: -105.2105287, x: 66.95, y: 62.06 },
  { name: "Golden High School", category: "Education", description: "Local high school.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.744175, lon: -105.211646, x: 64.65, y: 56.01 },
  { name: "Lewis Court Apartments", category: "Housing", description: "Residential complex.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.7471138, lon: -105.2123886, x: 63.12, y: 49.76 },
  { name: "Summit View Apartments", category: "Housing", description: "Residential complex.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.73928, lon: -105.20013, x: 88.39, y: 66.43 },
  { name: "South Table Mountain Trailhead", category: "Trails", description: "Access trail to South Table Mountain mesa.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.7435, lon: -105.2065, x: 75.26, y: 57.45 },
  { name: "The Buffalo Rose", category: "Dining & Entertainment", description: "Historic restaurant and concert venue.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7552, lon: -105.2219, x: 43.51, y: 32.55 },
  { name: "Woody's Pizza", category: "Dining", description: "Local pizzeria.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7544175, lon: -105.2201798, x: 47.05, y: 34.22 },
  { name: "Old Capitol Grill & Smokehouse", category: "Dining", description: "Historic downtown restaurant.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.75525, lon: -105.2214, x: 44.54, y: 32.45 },
  { name: "Sherpa House Restaurant & Cultural Center", category: "Dining & Culture", description: "Himalayan restaurant and garden.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.753, lon: -105.2192, x: 49.07, y: 37.24 },
  { name: "Golden City Brewery", category: "Dining & Drinks", description: "Local craft microbrewery.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7546742, lon: -105.2236842, x: 39.83, y: 33.67 },
  { name: "YoColorado", category: "Shopping", description: "Apparel and outdoor apparel shop.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.75515, lon: -105.222, x: 43.3, y: 32.66 },
  { name: "Coors Brewery Visitor Center", category: "Landmarks & Culture", description: "Coors brewery tour facility.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7546, lon: -105.2171, x: 53.4, y: 33.83 },
  { name: "Golden History Museum", category: "Landmarks & Culture", description: "Local history museum.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7560629, lon: -105.2247685, x: 37.59, y: 30.72 },
  { name: "Golden History Park", category: "Landmarks & Culture", description: "Outdoor historic homestead park.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7558, lon: -105.2255, x: 36.08, y: 31.28 },
  { name: "Foothills Art Center", category: "Landmarks & Culture", description: "Community visual arts gallery.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7525432, lon: -105.2191988, x: 49.07, y: 38.21 },
  { name: "Parfet Park", category: "Parks", description: "Downtown public park.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7574887, lon: -105.22243, x: 42.41, y: 27.68 },
  { name: "Clear Creek Whitewater Park", category: "Recreation", description: "Kayaking, tubing, and river park.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7562, lon: -105.226, x: 35.05, y: 30.43 },
  { name: "Humble House Cafe", category: "Coffee & Dining", description: "Coffee shop.", route: "gold", nearStop: "Downtown Golden", lat: 39.7550847, lon: -105.221299, x: 44.74, y: 32.8 },
  { name: "Cafe 13", category: "Coffee & Dining", description: "Cafe and bakery.", route: "gold", nearStop: "Downtown Golden", lat: 39.7540426, lon: -105.2213182, x: 44.7, y: 35.02 },
  { name: "Golden Visitor Center", category: "Tourist Services", description: "City visitor information center.", route: "gold", nearStop: "Downtown Golden", lat: 39.7569541, lon: -105.2232906, x: 40.64, y: 28.82 },
  { name: "Golden Community Center", category: "Recreation", description: "Public recreation center with pool and climbing wall.", route: "gold", nearStop: "Golden Community Center & 8th St Corridor", lat: 39.755642, lon: -105.2300829, x: 26.63, y: 31.61 },
  { name: "Lions Park", category: "Parks", description: "Riverside park along Clear Creek.", route: "gold", nearStop: "Golden Community Center & 8th St Corridor", lat: 39.7549101, lon: -105.2293095, x: 28.23, y: 33.17 },
  { name: "Bob's Atomic Burgers", category: "Dining", description: "Local burger restaurant.", route: "gold", nearStop: "Golden Community Center & 8th St Corridor", lat: 39.7553926, lon: -105.2184096, x: 50.7, y: 32.14 },
  { name: "Iowa Neighborhood Commercial Center", category: "Shopping", description: "Commercial center at Iowa Street and Highway 93.", route: "gold", nearStop: "North Golden", lat: 39.7661782, lon: -105.2300101, x: 26.78, y: 9.2 },
  { name: "Safeway", category: "Shopping", description: "Grocery store near Iowa Neighborhood Center.", route: "gold", nearStop: "North Golden", lat: 39.7521141, lon: -105.2155418, x: 56.61, y: 39.12 },
  { name: "Walgreens", category: "Shopping & Pharmacy", description: "Pharmacy near Iowa Neighborhood Center.", route: "gold", nearStop: "North Golden", lat: 39.7384051, lon: -105.195924, x: 97.06, y: 68.29 },
  { name: "Woody's Down Under / Local Pizzerias", category: "Dining", description: "Restaurants along Ford Street and Highway 93.", route: "gold", nearStop: "North Golden", lat: 39.7544175, lon: -105.2201798, x: 47.05, y: 34.22 },
  { name: "Tony Grampsas Memorial Sports Park", category: "Parks & Recreation", description: "Sports complex and park.", route: "gold", nearStop: "North Golden", lat: 39.7843, lon: -105.1876, x: 114.23, y: -29.36, offMap: true },
  { name: "North Table Mountain Trailhead", category: "Trails", description: "Access trailhead to North Table Mountain.", route: "gold", nearStop: "North Golden", lat: 39.7838683, lon: -105.2122773, x: 63.35, y: -28.44, offMap: true },
  { name: "North Table Loop Trail", category: "Trails", description: "Hiking and mountain biking loop trail.", route: "gold", nearStop: "North Golden", lat: 39.7819495, lon: -105.2300584, x: 26.68, y: -24.36, offMap: true },
];

export const HOME_ROUTE_CARDS = [
  { key: "tungsten", subtitle: "Campus ↔ south Golden", description: "See the complete southern loop" },
  { key: "gold", subtitle: "Campus ↔ north Golden", description: "Explore the northern route" },
  { key: "silver", subtitle: "Campus ↔ Mines Park", description: "Follow the campus connection" },
];

export const EXTRA_DEPARTURES = ["11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM"];

// Shift a "h:mm AM" style time by a number of minutes.
export function addMinutes(time, minutes) {
  const [clock, period] = time.split(" ");
  const [h, m] = clock.split(":").map(Number);
  const total = ((h % 12) * 60 + m + minutes) % 1440;
  const hour = Math.floor(total / 60);
  return `${hour % 12 || 12}:${String(total % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : period}`;
}

// Interchange stop used when a trip crosses between two routes.
export function transferStop(routeA, routeB) {
  const pair = [routeA, routeB].sort().join("-");
  if (pair === "gold-tungsten") return "11th & Miners Alley";
  if (pair === "gold-silver") return "Guggenheim";
  return "Kafadar Commons";
}

export function closestRouteKey() {
  return ROUTE_KEYS.reduce(
    (best, key) => (ROUTES[key].walkToClosest < ROUTES[best].walkToClosest ? key : best),
    "gold",
  );
}
