# What's for Lunch?

A "lunch roulette" web app that helps indecisive people pick a nearby restaurant. Set your location, break time, and travel mode, then spin the wheel and let fate decide.

**Live site:** https://whats-for-lunch-mu.vercel.app/

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file with your Google Places API key:

```
GOOGLE_PLACES_API_KEY=<your-key>
```

You'll need a Google Cloud project with the **Places API (New)** enabled and a billing account (1,000 free requests/month are included).

The API key is kept server-side in both dev and production — the client never sends auth headers. In dev, a Vite plugin middleware proxies requests; in production, a Vercel serverless function does the same.

## Features

- Spin wheel picks a random restaurant from nearby places
- **Pre-search cuisine filter** — 16 cuisine groups (American, Asian, European, Latin American, etc.) to narrow results before searching
- Adjustable search radius, break time (30/60/120 min), travel mode, rank preference (closest vs most popular), and number of contenders
- **Post-search filters** — category chips and price level chips ($, $$, $$$, $$$$) to refine results
- Sort results by distance, rating, price, or alphabetically
- Filter results by name or category
- Cards show star ratings, price level, price range, open/closed status, and website links
- Google Maps directions using Place IDs for precise navigation
- Add/remove individual places, or select all/clear all (scoped to visible filters)
- All settings and filters remembered between visits (localStorage)
- Dark/light mode with system preference detection
- Responsive design (mobile-first)
- Playful flavor text throughout
- Version number in footer

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 4
- Google Places API (New) — Enterprise SKU
- OpenStreetMap Nominatim (geocoding)
- Google Maps (directions links using Place IDs)
- Deployed on Vercel
