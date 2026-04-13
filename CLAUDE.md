# What's for Lunch?

A "lunch roulette" web app that helps indecisive people pick a nearby restaurant. Users set their location, break time, and travel mode, then the app finds nearby food places and spins a wheel to pick one.

## Tech Stack

- **React 18** (functional components, hooks only)
- **Vite 6** (dev server + build)
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin, no config file — uses `@import "tailwindcss"` in `src/index.css`)
- No router, no state management library — single-page app with local `useState`

## External APIs

- **Google Places API (New)** — Nearby Search for restaurants (`src/services/overpass.js`). Requires API key in `.env` as `GOOGLE_PLACES_API_KEY`. Uses the `places.googleapis.com/v1/places:searchNearby` POST endpoint. Searches for configurable cuisine types via `includedTypes`. Returns up to 20 results ranked by distance. Uses Enterprise SKU fields (rating, priceLevel, priceRange, currentOpeningHours, websiteUri). 1,000 free requests/month included.
- **OpenStreetMap Nominatim** — address search and reverse geocoding (`src/services/geocoding.js`). Free, no key required.
- **Browser Geolocation API** — optional "Use My Location" (`src/services/location.js`)
- **Google Maps** — directions links only (no API calls). Links use `destination_place_id` for precise navigation to business entrances.

## Environment Variables

**Local development** (`.env`, gitignored):
```
GOOGLE_PLACES_API_KEY=<your-google-places-api-key>
```

**Vercel production** (set in Vercel dashboard > Settings > Environment Variables):
```
GOOGLE_PLACES_API_KEY=<your-google-places-api-key>
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
  google-places.js         # Vercel serverless function — proxies Google Places API with server-side auth
src/
  App.jsx                  # Main app — manages step flow (setup → loading → results), localStorage persistence
  main.jsx                 # React root mount
  index.css                # Tailwind import + body gradient + animations
  data/
    cuisineGroups.js       # Cuisine group definitions (16 groups mapping to Google Places types)
  components/
    Header.jsx             # Title and random tagline (stable per mount)
    ThemeToggle.jsx        # Dark/light mode toggle (fixed position, persisted in localStorage)
    LocationPicker.jsx     # GPS detection + address autocomplete (debounced, z-indexed dropdown)
    SettingsPanel.jsx      # Break time (30/60/120 min), travel mode, search radius slider, wheel size, cuisine filter
    CuisineFilter.jsx      # Pre-search cuisine type picker (16 emoji-labeled groups with All/None toggle)
    SpinWheel.jsx          # Canvas-based spin wheel with gradient segments, eased animation, empty state handling, theme-aware
    ResultsGrid.jsx        # Sticky toolbar with filter, category chips, price filter chips, sort (distance/rating/price/A-Z), select all/clear all, responsive grid
    RestaurantCard.jsx     # Place card with category pill, star rating, price level + range, open/closed status, directions (via place ID), website link, add/remove toggle
    LoadingSpinner.jsx     # Animated spinner with rotating flavor text messages
  services/
    location.js            # Wraps navigator.geolocation
    geocoding.js           # Nominatim forward/reverse geocoding
    overpass.js            # Google Places Nearby Search + result normalization + pickRandom
  utils/
    distance.js            # Haversine distance, formatting, search radius lookup
vercel.json                # Vercel route rewrites
```

## Key Design Decisions

- Search radius has smart defaults computed from break time and travel mode (`utils/distance.js`), but the user can override it via a slider
- Break time options: 30 / 60 / 120 minutes; defaults: 60 min break, walking mode, 20 places on wheel
- All user settings (break time, travel mode, wheel size, search radius, cuisine groups, excluded categories, excluded prices) persist in localStorage
- **Pre-search cuisine filter**: 16 cuisine groups (American, Asian, European, Latin American, etc.) with emoji labels. Each maps to specific Google Places types. When all groups are selected, uses broad parent types for max coverage. When specific groups are selected, sends their exact types as `includedTypes` (capped at 50, the API limit).
- **Post-search category filter**: chips derived from Google's `primaryType` field (A-Z sorted); All/None chips for bulk toggle; excluded categories also affect initial wheel selection
- **Post-search price filter**: chips for each price level ($, $$, $$$, $$$$, ?) with All/None toggle; excluded prices persisted in localStorage
- Sort options: Distance, Rating, Price, A-Z
- Cards show: name, category pill, distance, price level ($ symbols), price range (actual dollar amounts), open/closed status, star rating with count, address, directions link, website link
- The wheel picks from randomly selected places out of all results (up to 20 fetched); users can add/remove/select all/clear all (scoped to visible filtered results)
- Wheel requires at least 2 places to spin; shows helpful messages for 0 or 1 items
- Google Places API calls go to `/api/google-places` in both environments. In dev, a Vite plugin middleware (`vite.config.js`) proxies with the API key server-side using `loadEnv()`. In production on Vercel, a serverless function (`api/google-places.js`) does the same. The client never sends auth headers — the API key stays server-side in both environments.
- Directions links use `destination_place_id` with the Google Place ID for precise navigation to business entrances
- Location object carries `{ lat, lng, locality }` — locality (city, state) comes from Nominatim
- Distance is computed client-side using Haversine formula (Google Nearby Search doesn't return distance)
- Warm color palette: cream/amber tones in light mode, neutral dark in dark mode
- Responsive design: single-column cards on mobile, 2-column on `sm:` breakpoint; compact sticky toolbar
- App version is injected from `package.json` at build time via Vite `define` and shown in footer
- No tests or linting configured
