# OreTransit

Mobile app for the Ore Cart shuttle in Golden, Colorado: three routes (Gold, Tungsten, Silver),
every stop, recommended places nearby, trip planning with transfers, and weekday timetables.

Built as an installable Progressive Web App (PWA). There is no build step and no dependencies to
install: it is plain HTML, CSS and JavaScript, with Preact vendored in `vendor/`.

## Run it locally

```bash
python -m http.server 8765
```

Then open http://localhost:8765 in a browser. On a phone on the same Wi-Fi, use your computer's
LAN address instead of localhost (service workers need HTTPS or localhost, so offline mode only
activates once the app is hosted on HTTPS).

## Put it on a phone

1. Host the folder on any static HTTPS host (GitHub Pages, Netlify, Cloudflare Pages, Vercel).
2. Open the URL on the phone.
3. iPhone: Share → **Add to Home Screen**. Android: the browser offers **Install app**, or use
   menu → Add to Home screen.

The app then launches full screen with its own icon and works offline (maps and data are cached
by `sw.js`).

## Ship to the app stores (optional)

Wrap the same folder with [Capacitor](https://capacitorjs.com/) to produce iOS and Android
projects. Requires Node.js, Xcode (iOS) and Android Studio (Android).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell, PWA metadata, service worker registration |
| `app.js` | All screens: Home, Explore every stop, Explore route, Trip detail, Journey, Schedule sheet |
| `data.js` | Routes, stops (with lat/lon), map georeference, recommended places |
| `schedule.js` | Official weekday/weekend timetables and next-trip helpers |
| `styles.css` | Styles (ported from the Figma Make mockup) |
| `sw.js` | Offline cache |
| `manifest.webmanifest` | Install metadata and icons |
| `assets/` | Route maps and logo |
| `vendor/preact-standalone.module.js` | Preact + htm, no build step needed |

## Live location and real times

- **GPS**: the app watches the phone's location (browser Geolocation API) and places "You" on each
  map. Every map image is georeferenced with an affine fit (`MAP_FIT` in `data.js`, about 4 % RMS
  against the stop positions). Walking times are straight-line distance × 1.3 at 80 m/min. When
  location is off or blocked, the app assumes Kafadar Commons and says so.
- **Timetables**: `schedule.js` holds the official time-point schedules for all three routes
  (weekday and weekend), transcribed from https://orecart.mines.edu/ and hash-verified against the
  live pages. Stops with "no set time" are interpolated and shown with a `~`. Trip planning,
  transfers and the "next shuttle" badges all use these times in the America/Denver time zone.
- Geolocation only works on HTTPS (or localhost), so host the app before testing GPS on a phone.

## Known limitations

- The Ore Cart is not live-tracked, so times are scheduled, not real-time arrivals.
- Stop coordinates come from OpenStreetMap; a few (Survey Field, The Quarry, Lookout Apartments,
  Ruby Drive, the two Miners Alley stops) are placed from the official route maps and may be off
  by half a block. Edit `lat`/`lon` in `data.js` and re-run the fit if you have better data.
- Update `schedule.js` when Mines publishes a new timetable.
