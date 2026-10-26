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
    aspect: "1596 / 1464",
    location: { x: 25, y: 49 },
    closestStop: 1,
    walkToClosest: 5,
    departures: ["10:45 AM", "11:00 AM", "11:15 AM"],
    stops: [
      { name: "Guggenheim", x: 34.71, y: 56.08, lat: 39.751032, lon: -105.223184 },
      { name: "11th & Maple", x: 27.98, y: 46.93, lat: 39.754029, lon: -105.226301 },
      { name: "11th & Miners Alley", x: 35.53, y: 41.05, lat: 39.755955, lon: -105.222804 },
      { name: "Parfet Park / RTD Hub", x: 35.96, y: 36.75, lat: 39.757364, lon: -105.222605 },
      { name: "10th & Cheyenne", x: 29.45, y: 38.66, lat: 39.756738, lon: -105.22562 },
      { name: "Community Center", x: 14.91, y: 43.68, lat: 39.755094, lon: -105.232354 },
      { name: "Canyon Gate Apartments", x: 11.5, y: 43.78, lat: 39.755061, lon: -105.233933 },
      { name: "8th & SH 58", x: 18.83, y: 40.85, lat: 39.756021, lon: -105.230538 },
      { name: "Ford & 5th", x: 30.23, y: 21.21, lat: 39.762454, lon: -105.225259 },
      { name: "Ford & 1st", x: 23.97, y: 10.35, lat: 39.766011, lon: -105.228158 },
      { name: "Ruby Drive Commercial", x: 12.81, y: 9.67, lat: 39.766234, lon: -105.233326 },
      { name: "Iowa & Washington", x: 16.13, y: 11.44, lat: 39.765654, lon: -105.231789 },
      { name: "Washington & 3rd", x: 22.4, y: 18.92, lat: 39.763204, lon: -105.228885 },
      { name: "Golden Visitors Center", x: 34.4, y: 37.91, lat: 39.756984, lon: -105.223327 },
      { name: "13th & Miners Alley", x: 38.88, y: 46.04, lat: 39.754321, lon: -105.221252 },
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
    aspect: "1222 / 1582",
    location: { x: 40, y: 40 },
    closestStop: 3,
    walkToClosest: 7,
    departures: ["10:47 AM", "11:17 AM", "11:47 AM"],
    stops: [
      { name: "RTD Jeffco W Line Station", x: 85.72, y: 91.69, lat: 39.726778, lon: -105.198804 },
      { name: "Splash at Fossil Trace", x: 61.91, y: 73.39, lat: 39.735402, lon: -105.21005 },
      { name: "Jefferson County Human Services", x: 65.26, y: 80.47, lat: 39.732066, lon: -105.208468 },
      { name: "Kafadar Commons", x: 36.13, y: 39.57, lat: 39.751341, lon: -105.222226 },
      { name: "11th & Miners Alley", x: 35.11, y: 29.84, lat: 39.755926, lon: -105.222708 },
      { name: "1600 Jackson St", x: 47.87, y: 37.9, lat: 39.752128, lon: -105.216681 },
      { name: "CTLM Lot", x: 43.45, y: 42.32, lat: 39.750045, lon: -105.218769 },
      { name: "Lewis Court", x: 56.55, y: 47.95, lat: 39.747392, lon: -105.212582 },
      { name: "Summit View Apts / 14th & Johnson", x: 79.21, y: 68.62, lat: 39.73765, lon: -105.201879 },
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
    aspect: "1612 / 1534",
    location: { x: 37, y: 57 },
    closestStop: 4,
    walkToClosest: 3,
    departures: ["10:50 AM", "11:05 AM", "11:20 AM"],
    stops: [
      { name: "Survey Field", x: 30.46, y: 78.62, lat: 39.742876, lon: -105.224875 },
      { name: "Mines Park Community Center", x: 32.63, y: 83.05, lat: 39.741359, lon: -105.22386 },
      { name: "The Quarry", x: 35.92, y: 84.35, lat: 39.740913, lon: -105.222321 },
      { name: "Lookout Apartments", x: 41.19, y: 68.29, lat: 39.746415, lon: -105.219855 },
      { name: "Kafadar", x: 35.86, y: 53.91, lat: 39.75134, lon: -105.222349 },
      { name: "K Lot", x: 22.95, y: 47.43, lat: 39.75356, lon: -105.228388 },
      { name: "Guggenheim", x: 34.09, y: 54.89, lat: 39.751005, lon: -105.223177 },
      { name: "Mines Student Recreation Center", x: 34.0, y: 62.39, lat: 39.748436, lon: -105.223219 },
      { name: "Pinal Rd & 19th St", x: 28.32, y: 73.47, lat: 39.74464, lon: -105.225876 },
    ],
  },
};

export const ROUTE_KEYS = Object.keys(ROUTES);

// Initial zoom/offset for each route's own map.
export const ROUTE_MAP_VIEW = {
  gold: { zoom: 1.65, x: -0.07, y: -0.04 },
  tungsten: { zoom: 1.42, x: -0.12, y: -0.2 },
  silver: { zoom: 1.62, x: -0.08, y: -0.08 },
};

// Georeference for each map image (percent = a*lon + c, b*lat + d), fitted by aligning the
// OpenStreetMap road network to the streets drawn on the image (87-88% of roads within 2 px).
export const MAP_FIT = {
  gold: { x: [2159.252724, 0.000000, 227238.156055], y: [0.000000, -3052.896248, 121411.857194] },
  tungsten: { x: [2117.198337, 0.000000, 222812.452699], y: [0.000000, -2121.897123, 84387.825909] },
  silver: { x: [2137.779156, 0.000000, 224978.003722], y: [0.000000, -2919.386441, 116103.433703] },
  overview: { x: [2196.836467, 0.000000, 231191.566906], y: [0.000000, -2197.619440, 87397.569372] },
};

export function geoToMap(fitKey, lat, lon) {
  const f = MAP_FIT[fitKey];
  return { x: f.x[0] * lon + f.x[1] * lat + f.x[2], y: f.y[0] * lon + f.y[1] * lat + f.y[2] };
}

// Stop positions on the combined all-routes map (percentages), on the drawn cart icons.
export const OVERVIEW_STOPS = {
  gold: [
    { x: 33.44, y: 39.93 },
    { x: 26.59, y: 33.34 },
    { x: 34.27, y: 29.11 },
    { x: 34.71, y: 26.01 },
    { x: 28.09, y: 27.39 },
    { x: 13.29, y: 31.0 },
    { x: 9.83, y: 31.07 },
    { x: 17.28, y: 28.96 },
    { x: 28.88, y: 14.83 },
    { x: 22.51, y: 7.01 },
    { x: 11.16, y: 6.52 },
    { x: 14.54, y: 7.8 },
    { x: 20.91, y: 13.18 },
    { x: 33.13, y: 26.85 },
    { x: 37.68, y: 32.7 },
  ],
  tungsten: [
    { x: 87.0, y: 93.23 },
    { x: 62.29, y: 74.28 },
    { x: 65.77, y: 81.61 },
    { x: 35.54, y: 39.25 },
    { x: 34.48, y: 29.17 },
    { x: 47.73, y: 37.52 },
    { x: 43.14, y: 42.1 },
    { x: 56.73, y: 47.93 },
    { x: 80.24, y: 69.34 },
  ],
  silver: [
    { x: 29.72, y: 57.85 },
    { x: 31.95, y: 61.19 },
    { x: 35.34, y: 62.17 },
    { x: 40.75, y: 50.08 },
    { x: 35.27, y: 39.25 },
    { x: 22.01, y: 34.37 },
    { x: 33.45, y: 39.99 },
    { x: 33.36, y: 45.63 },
    { x: 27.53, y: 53.98 },
  ],
};

// Recommended places at their real coordinates (OpenStreetMap / Nominatim), positioned on the
// overview map through MAP_FIT.overview. offMap: the place lies outside the drawn map area.
export const PLACES = [
  { name: "Mines Geology Museum", category: "Landmarks & Science", description: "Lunar rocks and mineral collections.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7518482, lon: -105.224827, x: 29.83, y: 38.13 },
  { name: "Guggenheim Hall", category: "Landmarks & Science", description: "Historic administrative building.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7508896, lon: -105.2228149, x: 34.25, y: 40.24 },
  { name: "Arthur Lakes Library", category: "Landmarks & Science", description: "Main university library.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7514296, lon: -105.2233302, x: 33.12, y: 39.05 },
  { name: "Period Table", category: "Food & Dining", description: "Campus dining hall.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7479, lon: -105.22215, x: 35.71, y: 46.81 },
  { name: "Earthlinks Coffee Shop", category: "Coffee", description: "Campus coffee shop.", route: "silver", nearStop: "Mines Campus Core", lat: 39.74985, lon: -105.2242, x: 31.21, y: 42.53 },
  { name: "Student Recreation Center", category: "Recreation", description: "Student fitness and recreation facility.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7490558, lon: -105.2227508, x: 34.39, y: 44.27 },
  { name: "Volk Gymnasium", category: "Recreation", description: "Historic athletics gymnasium.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7519513, lon: -105.2238169, x: 32.05, y: 37.91 },
  { name: "Clear Creek Trail", category: "Trails", description: "Walking and biking path along Clear Creek.", route: "silver", nearStop: "Mines Campus Core", lat: 39.7645562, lon: -105.2127184, x: 56.43, y: 10.21 },
  { name: "Marv Kay Stadium", category: "Landmarks & Recreation", description: "Mines football stadium.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7526252, lon: -105.2270611, x: 24.92, y: 36.43 },
  { name: "Campbell Field", category: "Landmarks & Recreation", description: "Mines baseball field.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7531207, lon: -105.2274505, x: 24.07, y: 35.34 },
  { name: "Chimney Gulch Trailhead", category: "Trails", description: "Trailhead leading up Lookout Mountain.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7407965, lon: -105.2376435, x: 1.67, y: 62.42 },
  { name: "Windy Saddle Park", category: "Trails & Parks", description: "Mountain park and trail network.", route: "silver", nearStop: "Clear Creek Athletics Complex / K-Lot", lat: 39.7410919, lon: -105.2409802, x: -5.66, y: 61.77, offMap: true },
  { name: "Mines Park Apartments", category: "Housing", description: "Student housing complex.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.741317, lon: -105.2236198, x: 32.48, y: 61.28 },
  { name: "Lookout Apartments", category: "Housing", description: "Student housing complex.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.7447, lon: -105.2212, x: 37.8, y: 53.84 },
  { name: "Lookout Mountain Trail", category: "Trails", description: "Mountain hiking trail.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.7408, lon: -105.23764, x: 1.68, y: 62.41 },
  { name: "Beaver Brook Trail", category: "Trails", description: "Hiking trail system.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.74109, lon: -105.24098, x: -5.66, y: 61.78, offMap: true },
  { name: "South Table Mountain", category: "Trails & Nature", description: "Mesa access from 19th Street.", route: "silver", nearStop: "Mines Park & Student Housing", lat: 39.7518002, lon: -105.196059, x: 93.03, y: 38.24 },
  { name: "Jeffco Government Center W-Line Station", category: "Transit", description: "RTD light rail station.", route: "tungsten", nearStop: "RTD Jeffco Government Center", lat: 39.72651, lon: -105.20137, x: 81.36, y: 93.82 },
  { name: "Jefferson County Courthouse", category: "Government & Services", description: "County courthouse.", route: "tungsten", nearStop: "RTD Jeffco Government Center", lat: 39.7285431, lon: -105.2015403, x: 80.99, y: 89.35 },
  { name: "Jeffco Human Services Building", category: "Government & Services", description: "County services facility.", route: "tungsten", nearStop: "RTD Jeffco Government Center", lat: 39.7320857, lon: -105.210309, x: 61.72, y: 81.57 },
  { name: "The Splash at Fossil Trace Aquatic Park", category: "Recreation", description: "Outdoor water park.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.73538, lon: -105.20856, x: 65.57, y: 74.33 },
  { name: "Fossil Trace Golf Club", category: "Recreation", description: "Public golf course.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.7413323, lon: -105.2105287, x: 61.24, y: 61.24 },
  { name: "Golden High School", category: "Education", description: "Local high school.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.744175, lon: -105.211646, x: 58.79, y: 55.0 },
  { name: "Lewis Court Apartments", category: "Housing", description: "Residential complex.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.7471138, lon: -105.2123886, x: 57.15, y: 48.54 },
  { name: "Summit View Apartments", category: "Housing", description: "Residential complex.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.73928, lon: -105.20013, x: 84.09, y: 65.76 },
  { name: "South Table Mountain Trailhead", category: "Trails", description: "Access trail to South Table Mountain mesa.", route: "tungsten", nearStop: "Splash Aquatic Park & South Table Mountain", lat: 39.7435, lon: -105.2065, x: 70.09, y: 56.48 },
  { name: "The Buffalo Rose", category: "Dining & Entertainment", description: "Historic restaurant and concert venue.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7552, lon: -105.2219, x: 36.26, y: 30.77 },
  { name: "Woody's Pizza", category: "Dining", description: "Local pizzeria.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7544175, lon: -105.2201798, x: 40.04, y: 32.49 },
  { name: "Old Capitol Grill & Smokehouse", category: "Dining", description: "Historic downtown restaurant.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.75525, lon: -105.2214, x: 37.36, y: 30.66 },
  { name: "Sherpa House Restaurant & Cultural Center", category: "Dining & Culture", description: "Himalayan restaurant and garden.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.753, lon: -105.2192, x: 42.19, y: 35.6 },
  { name: "Golden City Brewery", category: "Dining & Drinks", description: "Local craft microbrewery.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7546742, lon: -105.2236842, x: 32.34, y: 31.92 },
  { name: "YoColorado", category: "Shopping", description: "Apparel and outdoor apparel shop.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.75515, lon: -105.222, x: 36.04, y: 30.88 },
  { name: "Coors Brewery Visitor Center", category: "Landmarks & Culture", description: "Coors brewery tour facility.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7546, lon: -105.2171, x: 46.8, y: 32.09 },
  { name: "Golden History Museum", category: "Landmarks & Culture", description: "Local history museum.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7560629, lon: -105.2247685, x: 29.96, y: 28.87 },
  { name: "Golden History Park", category: "Landmarks & Culture", description: "Outdoor historic homestead park.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7558, lon: -105.2255, x: 28.35, y: 29.45 },
  { name: "Foothills Art Center", category: "Landmarks & Culture", description: "Community visual arts gallery.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7525432, lon: -105.2191988, x: 42.19, y: 36.61 },
  { name: "Parfet Park", category: "Parks", description: "Downtown public park.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7574887, lon: -105.22243, x: 35.1, y: 25.74 },
  { name: "Clear Creek Whitewater Park", category: "Recreation", description: "Kayaking, tubing, and river park.", route: "tungsten", nearStop: "Downtown Golden", lat: 39.7562, lon: -105.226, x: 27.25, y: 28.57 },
  { name: "Humble House Cafe", category: "Coffee & Dining", description: "Coffee shop.", route: "gold", nearStop: "Downtown Golden", lat: 39.7550847, lon: -105.221299, x: 37.58, y: 31.02 },
  { name: "Cafe 13", category: "Coffee & Dining", description: "Cafe and bakery.", route: "gold", nearStop: "Downtown Golden", lat: 39.7540426, lon: -105.2213182, x: 37.54, y: 33.31 },
  { name: "Golden Visitor Center", category: "Tourist Services", description: "City visitor information center.", route: "gold", nearStop: "Downtown Golden", lat: 39.7569541, lon: -105.2232906, x: 33.2, y: 26.91 },
  { name: "Golden Community Center", category: "Recreation", description: "Public recreation center with pool and climbing wall.", route: "gold", nearStop: "Golden Community Center & 8th St Corridor", lat: 39.755642, lon: -105.2300829, x: 18.28, y: 29.8 },
  { name: "Lions Park", category: "Parks", description: "Riverside park along Clear Creek.", route: "gold", nearStop: "Golden Community Center & 8th St Corridor", lat: 39.7549101, lon: -105.2293095, x: 19.98, y: 31.41 },
  { name: "Bob's Atomic Burgers", category: "Dining", description: "Local burger restaurant.", route: "gold", nearStop: "Golden Community Center & 8th St Corridor", lat: 39.7553926, lon: -105.2184096, x: 43.93, y: 30.35 },
  { name: "Iowa Neighborhood Commercial Center", category: "Shopping", description: "Commercial center at Iowa Street and Highway 93.", route: "gold", nearStop: "North Golden", lat: 39.7661782, lon: -105.2300101, x: 18.44, y: 6.64 },
  { name: "Safeway", category: "Shopping", description: "Grocery store near Iowa Neighborhood Center.", route: "gold", nearStop: "North Golden", lat: 39.7521141, lon: -105.2155418, x: 50.23, y: 37.55 },
  { name: "Walgreens", category: "Shopping & Pharmacy", description: "Pharmacy near Iowa Neighborhood Center.", route: "gold", nearStop: "North Golden", lat: 39.7384051, lon: -105.195924, x: 93.32, y: 67.68 },
  { name: "Woody's Down Under / Local Pizzerias", category: "Dining", description: "Restaurants along Ford Street and Highway 93.", route: "gold", nearStop: "North Golden", lat: 39.7544175, lon: -105.2201798, x: 40.04, y: 32.49 },
  { name: "Tony Grampsas Memorial Sports Park", category: "Parks & Recreation", description: "Sports complex and park.", route: "gold", nearStop: "North Golden", lat: 39.7843, lon: -105.1876, x: 111.61, y: -33.18, offMap: true },
  { name: "North Table Mountain Trailhead", category: "Trails", description: "Access trailhead to North Table Mountain.", route: "gold", nearStop: "North Golden", lat: 39.7838683, lon: -105.2122773, x: 57.4, y: -32.23, offMap: true },
  { name: "North Table Loop Trail", category: "Trails", description: "Hiking and mountain biking loop trail.", route: "gold", nearStop: "North Golden", lat: 39.7819495, lon: -105.2300584, x: 18.34, y: -28.02, offMap: true },
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
