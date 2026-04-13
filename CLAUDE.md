# What's for Lunch?

A "lunch roulette" web app that helps indecisive people pick a nearby restaurant. Users set their location, break time, and travel mode, then the app finds nearby food places and spins a wheel to pick one.

## Tech Stack

- **React 18** (functional components, hooks only)
- **Vite 6** (dev server + build)
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin, no config file — uses `@import "tailwindcss"` in `src/index.css`)
- No router, no state management library — single-page app with local `useState`

## External APIs

- **Foursquare Places API** — restaurant search by location (`src/services/overpass.js`). Requires API key in `.env` as `VITE_FOURSQUARE_API_KEY`. Uses the new `places-api.foursquare.com` endpoint with Bearer auth. Free tier fields: name, categories (with icons), distance, location, tel, website. Premium fields (rating, photos, price, hours) require paid credits.
- **OpenStreetMap Nominatim** — address search and reverse geocoding (`src/services/geocoding.js`). Free, no key required.
- **Browser Geolocation API** — optional "Use My Location" (`src/services/location.js`)
- **Google Maps** — directions links only (no API calls). Links use exact lat/lng coordinates for both origin and destination.

## Environment Variables

**Local development** (`.env`, gitignored):
```
VITE_FOURSQUARE_API_KEY=<your-foursquare-service-key>
```

**Vercel production** (set in Vercel dashboard > Settings > Environment Variables):
```
FOURSQUARE_API_KEY=<your-foursquare-service-key>
```

## Commands

```bash
npm run dev      # Start Vite dev server (HMR)
npm run build    # Production build to dist/
npm run preview  # Serve the production build locally
```

## Project Structure

```
api/
  foursquare.js            # Vercel serverless function — proxies Foursquare API with server-side auth
src/
  App.jsx                  # Main app — manages step flow (setup → loading → results), localStorage persistence
  main.jsx                 # React root mount
  index.css                # Tailwind import + body gradient + animations
  components/
    Header.jsx             # Title and random tagline (stable per mount)
    ThemeToggle.jsx        # Dark/light mode toggle (fixed position, persisted in localStorage)
    LocationPicker.jsx     # GPS detection + address autocomplete (debounced, z-indexed dropdown)
    SettingsPanel.jsx      # Break time (30/60/120 min), travel mode, search radius slider, wheel size
    SpinWheel.jsx          # Canvas-based spin wheel with gradient segments, eased animation, empty state handling, theme-aware
    ResultsGrid.jsx        # Sticky toolbar with filter, category chips (All/None + per-category, persisted), sort (distance/A-Z), select all/clear all, responsive grid
    RestaurantCard.jsx     # Place card with category icon, distance, directions link, add/remove toggle
    LoadingSpinner.jsx     # Animated spinner with rotating flavor text messages
  services/
    location.js            # Wraps navigator.geolocation
    geocoding.js           # Nominatim forward/reverse geocoding
    overpass.js            # Foursquare Places API search + result normalization + pickRandom
  utils/
    distance.js            # Haversine distance, formatting, search radius lookup
vercel.json                # Vercel route rewrites
```

## Key Design Decisions

- Search radius has smart defaults computed from break time and travel mode (`utils/distance.js`), but the user can override it via a slider
- Break time options: 30 / 60 / 120 minutes; defaults: 60 min break, walking mode, 10 places on wheel
- All user settings (break time, travel mode, wheel size, search radius, excluded categories) persist in localStorage
- Category filter chips let users include/exclude food types (A-Z sorted); All/None chips for bulk toggle; excluded categories also affect initial wheel selection
- The wheel picks from randomly selected places out of all results (up to 50 fetched); users can add/remove/select all/clear all (scoped to visible filtered results)
- Wheel requires at least 2 places to spin; shows helpful messages for 0 or 1 items
- Foursquare API calls go to `/api/foursquare` in both environments. In dev, a Vite plugin middleware (`vite.config.js`) proxies with the API key server-side using `loadEnv()`. In production on Vercel, a serverless function (`api/foursquare.js`) does the same. The client never sends auth headers — the API key stays server-side in both environments.
- Category icons from Foursquare are used as restaurant images (actual photos are a premium feature)
- Directions links use exact lat/lng coordinates for both origin and destination, ensuring precise navigation
- Location object carries `{ lat, lng, locality }` — locality (city, state) comes from Nominatim
- Warm color palette: cream/amber tones in light mode, neutral dark in dark mode
- Responsive design: single-column cards on mobile, 2-column on `sm:` breakpoint; compact sticky toolbar
- App version is injected from `package.json` at build time via Vite `define` and shown in footer
- No tests or linting configured
