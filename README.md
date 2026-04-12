# What's for Lunch?

A "lunch roulette" web app that helps indecisive people pick a nearby restaurant. Set your location, break time, and travel mode, then spin the wheel and let fate decide.

**Live site:** https://whats-for-lunch-mu.vercel.app/

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file with your Foursquare API key:

```
VITE_FOURSQUARE_API_KEY=<your-key>
```

The API key is kept server-side in both dev and production — the client never sends auth headers. In dev, a Vite plugin middleware proxies requests; in production, a Vercel serverless function does the same.

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 4
- Foursquare Places API
- OpenStreetMap Nominatim (geocoding)
- Google Maps (directions links using coordinates)
- Deployed on Vercel
