# What's for Lunch?

A "lunch roulette" web app that helps indecisive people pick a nearby restaurant. Users set their location, break time, and travel mode, then the app finds nearby food places and spins a wheel to pick one.

## Tech Stack

- **React 18** (functional components, hooks only)
- **Vite 6** (dev server + build)
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin, no config file — uses `@import "tailwindcss"` in `src/index.css`)
- No router, no state management library — single-page app with local `useState`

## External APIs (no API keys required)

- **OpenStreetMap Nominatim** — address search and reverse geocoding (`src/services/geocoding.js`)
- **Overpass API** — searches for restaurants, fast food, and cafes near a location (`src/services/overpass.js`)
- **Browser Geolocation API** — optional "Use My Location" (`src/services/location.js`)
- **Google Maps** — directions links only (no API calls)

## Commands

```bash
npm run dev      # Start Vite dev server (HMR)
npm run build    # Production build to dist/
npm run preview  # Serve the production build locally
```

## Project Structure

```
src/
  App.jsx                  # Main app — manages step flow (setup → loading → results)
  main.jsx                 # React root mount
  index.css                # Tailwind import + body gradient
  components/
    Header.jsx             # Title and tagline
    LocationPicker.jsx     # GPS detection + address autocomplete (debounced)
    SettingsPanel.jsx       # Break time (30/45/60 min) + travel mode (walking/driving)
    SpinWheel.jsx          # Canvas-based spin wheel with eased animation
    ResultsGrid.jsx        # Sorts places (winner first), renders cards in 2-col grid
    RestaurantCard.jsx     # Place card with distance, cuisine, directions link
    LoadingSpinner.jsx     # Simple CSS spinner
  services/
    location.js            # Wraps navigator.geolocation
    geocoding.js           # Nominatim forward/reverse geocoding
    overpass.js            # Overpass QL query + result normalization + pickRandom
  utils/
    distance.js            # Haversine distance, formatting, search radius lookup
```

## Key Design Decisions

- Search radius is computed from break time and travel mode via a lookup table in `utils/distance.js`, not user-configurable directly
- The wheel picks from 10 randomly selected places out of all results
- No persistent state — refreshing starts over
- All external API calls are free/keyless (Nominatim, Overpass) — respect their usage policies (no aggressive polling)
- No tests or linting configured
