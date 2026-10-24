// Route, stop and place data for the Ore Cart network (Golden, CO).
// Stop x/y are percentages on the matching map image, snapped to the cart icons drawn on it;
// lat/lon are WGS84 from OpenStreetMap, a few estimated from the official route maps.

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
      { name: "Guggenheim", x: 34.71, y: 56.08, lat: 39.750893, lon: -105.222819 },
      { name: "11th & Maple", x: 27.98, y: 46.93, lat: 39.753879, lon: -105.22638 },
      { name: "11th & Miners Alley", x: 35.53, y: 41.05, lat: 39.7545, lon: -105.2222 },
      { name: "Parfet Park / RTD Hub", x: 35.96, y: 36.75, lat: 39.757484, lon: -105.22231 },
      { name: "10th & Cheyenne", x: 29.45, y: 38.66, lat: 39.756365, lon: -105.225483 },
      { name: "Community Center", x: 14.91, y: 43.68, lat: 39.755643, lon: -105.230143 },
      { name: "Canyon Gate Apartments", x: 11.5, y: 43.78, lat: 39.755281, lon: -105.23164 },
      { name: "8th & SH 58", x: 18.83, y: 40.85, lat: 39.7592, lon: -105.2249 },
      { name: "Ford & 5th", x: 30.23, y: 21.21, lat: 39.762812, lon: -105.225005 },
      { name: "Ford & 1st", x: 23.97, y: 10.35, lat: 39.766043, lon: -105.228052 },
      { name: "Ruby Drive Commercial", x: 12.81, y: 9.67, lat: 39.7675, lon: -105.2335 },
      { name: "Iowa & Washington", x: 16.13, y: 11.44, lat: 39.765809, lon: -105.231438 },
      { name: "Washington & 3rd", x: 22.4, y: 18.92, lat: 39.76297, lon: -105.2292 },
      { name: "Golden Visitors Center", x: 34.4, y: 37.91, lat: 39.756953, lon: -105.223302 },
      { name: "13th & Miners Alley", x: 38.88, y: 46.04, lat: 39.7527, lon: -105.2224 },
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
      { name: "RTD Jeffco W Line Station", x: 85.72, y: 91.69, lat: 39.726508, lon: -105.201371 },
      { name: "Splash at Fossil Trace", x: 61.91, y: 73.39, lat: 39.735383, lon: -105.20856 },
      { name: "Jefferson County Human Services", x: 65.26, y: 80.47, lat: 39.732084, lon: -105.210019 },
      { name: "Kafadar Commons", x: 36.13, y: 39.57, lat: 39.751262, lon: -105.221515 },
      { name: "11th & Miners Alley", x: 35.11, y: 29.84, lat: 39.7545, lon: -105.2222 },
      { name: "1600 Jackson St", x: 47.87, y: 37.9, lat: 39.752015, lon: -105.216931 },
      { name: "CTLM Lot", x: 43.45, y: 42.32, lat: 39.750614, lon: -105.219382 },
      { name: "Lewis Court", x: 56.55, y: 47.95, lat: 39.747118, lon: -105.212778 },
      { name: "Summit View Apts / 14th & Johnson", x: 79.21, y: 68.62, lat: 39.7393, lon: -105.2001 },
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
      { name: "Survey Field", x: 30.46, y: 78.62, lat: 39.7428, lon: -105.2238 },
      { name: "Mines Park Community Center", x: 32.63, y: 83.05, lat: 39.741321, lon: -105.223642 },
      { name: "The Quarry", x: 35.92, y: 84.35, lat: 39.74, lon: -105.2245 },
      { name: "Lookout Apartments", x: 41.19, y: 68.29, lat: 39.7447, lon: -105.2212 },
      { name: "Kafadar", x: 35.86, y: 53.91, lat: 39.751262, lon: -105.221515 },
      { name: "K Lot", x: 22.95, y: 47.43, lat: 39.7545, lon: -105.2292 },
      { name: "Guggenheim", x: 34.09, y: 54.89, lat: 39.750893, lon: -105.222819 },
      { name: "Mines Student Recreation Center", x: 34.0, y: 62.39, lat: 39.749063, lon: -105.22275 },
      { name: "Pinal Rd & 19th St", x: 28.32, y: 73.47, lat: 39.744196, lon: -105.22594 },
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

// Affine georeference for each map image: percent = a*lon + b*lat + c (least-squares fit on stop positions).
export const MAP_FIT = {
  gold: { x: [2356.426319, 128.166030, 242888.846261], y: [-146.264621, -2872.986933, 98868.381025] },
  tungsten: { x: [1823.117270, -320.688245, 204616.764234], y: [241.804267, -1997.794150, 104896.429555] },
  silver: { x: [1840.139394, -156.038268, 199861.501506], y: [-371.591936, -2688.447937, 67823.480194] },
  overview: { x: [2079.829423, -179.159671, 226001.407210], y: [115.772448, -2141.763950, 97359.102921] },
};

export function geoToMap(fitKey, lat, lon) {
  const f = MAP_FIT[fitKey];
  return { x: f.x[0] * lon + f.x[1] * lat + f.x[2], y: f.y[0] * lon + f.y[1] * lat + f.y[2] };
}

// Stop positions on the combined all-routes map (percentages), on the drawn cart icons.
export const OVERVIEW_STOPS = {
  gold: [
    { x: 33.26, y: 39.97 },
    { x: 26.65, y: 33.44 },
    { x: 37.67, y: 32.7 },
    { x: 33.13, y: 25.69 },
    { x: 27.96, y: 27.49 },
    { x: 17.29, y: 29.03 },
    { x: 13.36, y: 31.16 },
    { x: 26.94, y: 20.5 },
    { x: 28.65, y: 13.64 },
    { x: 22.38, y: 7.06 },
    { x: 7.19, y: 1.34 },
    { x: 11.16, y: 6.58 },
    { x: 20.8, y: 13.27 },
    { x: 34.37, y: 29.19 },
    { x: 35.4, y: 39.23 },
  ],
  tungsten: [
    { x: 86.98, y: 93.15 },
    { x: 62.26, y: 74.26 },
    { x: 65.7, y: 81.58 },
    { x: 35.4, y: 39.23 },
    { x: 34.37, y: 29.19 },
    { x: 46.97, y: 37.47 },
    { x: 42.98, y: 43.58 },
    { x: 56.61, y: 47.56 },
    { x: 80.23, y: 69.37 },
  ],
  silver: [
    { x: 34.02, y: 57.41 },
    { x: 35.4, y: 62.15 },
    { x: 31.4, y: 62 },
    { x: 38.69, y: 53.3 },
    { x: 35.4, y: 39.23 },
    { x: 17.29, y: 29.03 },
    { x: 33.26, y: 39.97 },
    { x: 33.47, y: 45.59 },
    { x: 31.13, y: 55.41 },
  ],
};

const SCATTER = [
  { x: -2.2, y: -1.5 }, { x: -0.6, y: -2.3 }, { x: 1.4, y: -1.9 }, { x: 2.5, y: -0.5 },
  { x: 2.1, y: 1.3 }, { x: 0.5, y: 2.2 }, { x: -1.4, y: 2 }, { x: -2.5, y: 0.5 },
  { x: -3.1, y: -0.8 }, { x: 3.2, y: 0.7 }, { x: -0.8, y: 3 }, { x: 0.8, y: -3 },
];

function cluster(route, nearStop, origin, items) {
  return items.map(([name, category, description], i) => ({
    name,
    category,
    description,
    route,
    nearStop,
    x: origin.x + SCATTER[i % SCATTER.length].x,
    y: origin.y + SCATTER[i % SCATTER.length].y,
  }));
}

export const PLACES = [
  ...cluster("silver", "Mines Campus Core", { x: 31.8, y: 38.5 }, [
    ["Mines Geology Museum", "Landmarks & Science", "Lunar rocks and mineral collections."],
    ["Guggenheim Hall", "Landmarks & Science", "Historic administrative building."],
    ["Arthur Lakes Library", "Landmarks & Science", "Main university library."],
    ["Period Table", "Food & Dining", "Campus dining hall."],
    ["Earthlinks Coffee Shop", "Coffee", "Campus coffee shop."],
    ["Student Recreation Center", "Recreation", "Student fitness and recreation facility."],
    ["Volk Gymnasium", "Recreation", "Historic athletics gymnasium."],
    ["Clear Creek Trail", "Trails", "Walking and biking path along Clear Creek."],
  ]),
  ...cluster("silver", "Clear Creek Athletics Complex / K-Lot", { x: 22.2, y: 34.5 }, [
    ["Marv Kay Stadium", "Landmarks & Recreation", "Mines football stadium."],
    ["Campbell Field", "Landmarks & Recreation", "Mines baseball field."],
    ["Chimney Gulch Trailhead", "Trails", "Trailhead leading up Lookout Mountain."],
    ["Windy Saddle Park", "Trails & Parks", "Mountain park and trail network."],
  ]),
  ...cluster("silver", "Mines Park & Student Housing", { x: 35.4, y: 58.5 }, [
    ["Mines Park Apartments", "Housing", "Student housing complex."],
    ["Lookout Apartments", "Housing", "Student housing complex."],
    ["Lookout Mountain Trail", "Trails", "Mountain hiking trail."],
    ["Beaver Brook Trail", "Trails", "Hiking trail system."],
    ["South Table Mountain", "Trails & Nature", "Mesa access from 19th Street."],
  ]),
  ...cluster("tungsten", "RTD Jeffco Government Center", { x: 86.9, y: 92.5 }, [
    ["Jeffco Government Center W-Line Station", "Transit", "RTD light rail station."],
    ["Jefferson County Courthouse", "Government & Services", "County courthouse."],
  ]),
  ...cluster("tungsten", "RTD Jeffco Government Center", { x: 65.7, y: 81.5 }, [
    ["Jeffco Human Services Building", "Government & Services", "County services facility."],
  ]),
  ...cluster("tungsten", "Splash Aquatic Park & South Table Mountain", { x: 62.3, y: 74.3 }, [
    ["The Splash at Fossil Trace Aquatic Park", "Recreation", "Outdoor water park."],
    ["Fossil Trace Golf Club", "Recreation", "Public golf course."],
  ]),
  ...cluster("tungsten", "Splash Aquatic Park & South Table Mountain", { x: 61, y: 55 }, [
    ["Golden High School", "Education", "Local high school."],
  ]),
  ...cluster("tungsten", "Splash Aquatic Park & South Table Mountain", { x: 56.4, y: 48.5 }, [
    ["Lewis Court Apartments", "Housing", "Residential complex."],
  ]),
  ...cluster("tungsten", "Splash Aquatic Park & South Table Mountain", { x: 79.2, y: 68.7 }, [
    ["Summit View Apartments", "Housing", "Residential complex."],
  ]),
  ...cluster("tungsten", "Splash Aquatic Park & South Table Mountain", { x: 67, y: 61 }, [
    ["South Table Mountain Trailhead", "Trails", "Access trail to South Table Mountain mesa."],
  ]),
  ...cluster("tungsten", "Downtown Golden", { x: 34.5, y: 29.5 }, [
    ["The Buffalo Rose", "Dining & Entertainment", "Historic restaurant and concert venue."],
    ["Woody's Pizza", "Dining", "Local pizzeria."],
    ["Old Capitol Grill & Smokehouse", "Dining", "Historic downtown restaurant."],
    ["Sherpa House Restaurant & Cultural Center", "Dining & Culture", "Himalayan restaurant and garden."],
    ["Golden City Brewery", "Dining & Drinks", "Local craft microbrewery."],
    ["YoColorado", "Shopping", "Apparel and outdoor apparel shop."],
    ["Coors Brewery Visitor Center", "Landmarks & Culture", "Coors brewery tour facility."],
    ["Golden History Museum", "Landmarks & Culture", "Local history museum."],
    ["Golden History Park", "Landmarks & Culture", "Outdoor historic homestead park."],
    ["Foothills Art Center", "Landmarks & Culture", "Community visual arts gallery."],
    ["Parfet Park", "Parks", "Downtown public park."],
    ["Clear Creek Whitewater Park", "Recreation", "Kayaking, tubing, and river park."],
  ]),
  ...cluster("gold", "Downtown Golden", { x: 27, y: 31 }, [
    ["Humble House Cafe", "Coffee & Dining", "Coffee shop."],
    ["Cafe 13", "Coffee & Dining", "Cafe and bakery."],
    ["Golden Visitor Center", "Tourist Services", "City visitor information center."],
  ]),
  ...cluster("gold", "Golden Community Center & 8th St Corridor", { x: 15.5, y: 29.5 }, [
    ["Golden Community Center", "Recreation", "Public recreation center with pool and climbing wall."],
    ["Lions Park", "Parks", "Riverside park along Clear Creek."],
    ["Bob's Atomic Burgers", "Dining", "Local burger restaurant."],
  ]),
  ...cluster("gold", "North Golden", { x: 14.5, y: 10.5 }, [
    ["Iowa Neighborhood Commercial Center", "Shopping", "Commercial center at Iowa Street and Highway 93."],
    ["Safeway", "Shopping", "Grocery store near Iowa Neighborhood Center."],
    ["Walgreens", "Shopping & Pharmacy", "Pharmacy near Iowa Neighborhood Center."],
    ["Woody's Down Under / Local Pizzerias", "Dining", "Restaurants along Ford Street and Highway 93."],
    ["Tony Grampsas Memorial Sports Park", "Parks & Recreation", "Sports complex and park."],
    ["North Table Mountain Trailhead", "Trails", "Access trailhead to North Table Mountain."],
    ["North Table Loop Trail", "Trails", "Hiking and mountain biking loop trail."],
  ]),
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
