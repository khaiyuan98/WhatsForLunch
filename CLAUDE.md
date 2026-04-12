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
  App.jsx                  # Main app — manages step flow (setup → loading → results)
  main.jsx                 # React root mount
  index.css                # Tailwind import + body gradient
  components/
    Header.jsx             # Title and tagline
    LocationPicker.jsx     # GPS detection + address autocomplete (debounced)
    SettingsPanel.jsx      # Break time (30/45/60 min) + travel mode (walking/driving)
    SpinWheel.jsx          # Canvas-based spin wheel with eased animation
    ResultsGrid.jsx        # Sorts places (winner first), renders cards in 2-col grid
    RestaurantCard.jsx     # Place card with category icon, distance, directions link
    LoadingSpinner.jsx     # Simple CSS spinner
  services/
    location.js            # Wraps navigator.geolocation
    geocoding.js           # Nominatim forward/reverse geocoding (returns locality for fallback)
    overpass.js            # Foursquare Places API search + result normalization + pickRandom
  utils/
    distance.js            # Haversine distance, formatting, search radius lookup
vercel.json                # Vercel route rewrites
```

## Key Design Decisions

- Search radius is computed from break time and travel mode via a lookup table in `utils/distance.js`, not user-configurable directly
- The wheel picks from 10 randomly selected places out of all results (up to 50 fetched)
- No persistent state — refreshing starts over
- Foursquare API calls go to `/api/foursquare` in both environments. In dev, a Vite plugin middleware (`vite.config.js`) proxies with the API key server-side using `loadEnv()`. In production on Vercel, a serverless function (`api/foursquare.js`) does the same. The client never sends auth headers — the API key stays server-side in both environments.
- Category icons from Foursquare are used as restaurant images (actual photos are a premium feature)
- Directions links use exact lat/lng coordinates for both origin and destination, ensuring precise navigation
- Location object carries `{ lat, lng, locality }` — locality (city, state) comes from Nominatim
- No tests or linting configured
