// Route, stop and place data for the Ore Cart network (Golden, CO).
// Stop x/y are percentages on the matching map image (derived from lat/lon via MAP_FIT);
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
      { name: "Guggenheim", x: 33.53, y: 53.25, lat: 39.750893, lon: -105.222819 },
      { name: "11th & Maple", x: 25.82, y: 46.92, lat: 39.753879, lon: -105.22638 },
      { name: "11th & Miners Alley", x: 36.71, y: 42.55, lat: 39.7545, lon: -105.2222 },
      { name: "Parfet Park / RTD Hub", x: 37.75, y: 34.07, lat: 39.757484, lon: -105.22231 },
      { name: "10th & Cheyenne", x: 29.2, y: 39.25, lat: 39.756365, lon: -105.225483 },
      { name: "Community Center", x: 17.04, y: 44.2, lat: 39.755643, lon: -105.230143 },
      { name: "Canyon Gate Apartments", x: 13.08, y: 46.17, lat: 39.755281, lon: -105.23164 },
      { name: "8th & SH 58", x: 31.94, y: 30.77, lat: 39.7592, lon: -105.2249 },
      { name: "Ford & 5th", x: 33.27, y: 20.5, lat: 39.762812, lon: -105.225005 },
      { name: "Ford & 1st", x: 26.97, y: 13.14, lat: 39.766043, lon: -105.228052 },
      { name: "Ruby Drive Commercial", x: 13.78, y: 12.35, lat: 39.7675, lon: -105.2335 },
      { name: "Iowa & Washington", x: 18.27, y: 15.91, lat: 39.765809, lon: -105.231438 },
      { name: "Washington & 3rd", x: 22.69, y: 22.65, lat: 39.76297, lon: -105.2292 },
      { name: "Golden Visitors Center", x: 35.0, y: 36.21, lat: 39.756953, lon: -105.223302 },
      { name: "13th & Miners Alley", x: 35.4, y: 47.82, lat: 39.7527, lon: -105.2224 },
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
      { name: "RTD Jeffco W Line Station", x: 82.49, y: 92.94, lat: 39.726508, lon: -105.201371 },
      { name: "Splash at Fossil Trace", x: 66.64, y: 73.54, lat: 39.735383, lon: -105.20856 },
      { name: "Jefferson County Human Services", x: 65.36, y: 79.84, lat: 39.732084, lon: -105.210019 },
      { name: "Kafadar Commons", x: 38.12, y: 38.81, lat: 39.751262, lon: -105.221515 },
      { name: "11th & Miners Alley", x: 35.7, y: 32.16, lat: 39.7545, lon: -105.2222 },
      { name: "1600 Jackson St", x: 45.79, y: 38.31, lat: 39.752015, lon: -105.216931 },
      { name: "CTLM Lot", x: 42.07, y: 40.58, lat: 39.750614, lon: -105.219382 },
      { name: "Lewis Court", x: 54.86, y: 49.06, lat: 39.747118, lon: -105.212778 },
      { name: "Summit View Apts / 14th & Johnson", x: 79.84, y: 67.55, lat: 39.7393, lon: -105.2001 },
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
      { name: "Survey Field", x: 33.64, y: 77.24, lat: 39.7428, lon: -105.2238 },
      { name: "Mines Park Community Center", x: 34.1, y: 81.08, lat: 39.741321, lon: -105.223642 },
      { name: "The Quarry", x: 32.76, y: 85.06, lat: 39.74, lon: -105.2245 },
      { name: "Lookout Apartments", x: 37.96, y: 70.76, lat: 39.7447, lon: -105.2212 },
      { name: "Kafadar", x: 36.57, y: 53.53, lat: 39.751262, lon: -105.221515 },
      { name: "K Lot", x: 22.66, y: 49.2, lat: 39.7545, lon: -105.2292 },
      { name: "Guggenheim", x: 34.33, y: 55.23, lat: 39.750893, lon: -105.222819 },
      { name: "Mines Student Recreation Center", x: 34.68, y: 60.05, lat: 39.749063, lon: -105.22275 },
      { name: "Pinal Rd & 19th St", x: 29.7, y: 74.72, lat: 39.744196, lon: -105.22594 },
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
  gold: { x: [2539.387060, 443.963170, 249587.066754], y: [-620.250478, -2861.716925, 48544.551714] },
  tungsten: { x: [1736.253518, -379.692537, 197822.602546], y: [220.827075, -2006.987671, 103054.862658] },
  silver: { x: [1755.990153, -127.560851, 189875.218223], y: [-554.200713, -2652.489497, 47179.496326] },
  overview: { x: [1711.041926, -561.370536, 202388.459510], y: [-57.005904, -2363.544225, 87993.061833] },
};

export function geoToMap(fitKey, lat, lon) {
  const f = MAP_FIT[fitKey];
  return { x: f.x[0] * lon + f.x[1] * lat + f.x[2], y: f.y[0] * lon + f.y[1] * lat + f.y[2] };
}

// Stop positions on the combined all-routes map (percentages), derived from MAP_FIT.overview.
export const OVERVIEW_STOPS = {
  gold: [
    { x: 32.82, y: 38.39 },
    { x: 25.06, y: 31.54 },
    { x: 31.86, y: 29.83 },
    { x: 30.0, y: 22.78 },
    { x: 25.19, y: 25.61 },
    { x: 17.63, y: 27.58 },
    { x: 15.27, y: 28.52 },
    { x: 24.6, y: 18.87 },
    { x: 22.39, y: 10.34 },
    { x: 15.37, y: 2.88 },
    { x: 5.23, y: 1 },
    { x: 9.7, y: 3.63 },
    { x: 15.13, y: 10.21 },
    { x: 28.6, y: 24.09 },
    { x: 32.53, y: 34.1 },
  ],
  tungsten: [
    { x: 83.21, y: 94.8 },
    { x: 65.93, y: 74.24 },
    { x: 65.28, y: 82.12 },
    { x: 34.85, y: 37.44 },
    { x: 31.86, y: 29.83 },
    { x: 42.27, y: 35.4 },
    { x: 38.86, y: 38.85 },
    { x: 52.12, y: 46.74 },
    { x: 78.21, y: 64.5 },
  ],
  silver: [
    { x: 35.69, y: 57.57 },
    { x: 36.79, y: 61.06 },
    { x: 36.06, y: 64.23 },
    { x: 39.07, y: 52.94 },
    { x: 34.85, y: 37.44 },
    { x: 19.88, y: 30.23 },
    { x: 32.82, y: 38.39 },
    { x: 33.97, y: 42.71 },
    { x: 31.24, y: 54.4 },
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
