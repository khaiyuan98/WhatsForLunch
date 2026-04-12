const FSQ_BASE = '/api/foursquare/places/search';
const API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function searchNearbyFood(lat, lng, radiusMeters) {
  const params = new URLSearchParams({
    ll: `${lat},${lng}`,
    radius: String(Math.min(radiusMeters, 100000)),
    query: 'food',
    limit: '50',
    sort: 'DISTANCE',
    fields: 'name,categories,distance,latitude,longitude,location,tel,website',
  });

  const headers = { Accept: 'application/json' };
  if (import.meta.env.DEV) {
    headers.Authorization = `Bearer ${API_KEY}`;
    headers['X-Places-Api-Version'] = '2025-06-17';
  }

  const response = await fetch(`${FSQ_BASE}?${params}`, { headers });

  if (!response.ok) throw new Error('Failed to search for nearby food places');

  const data = await response.json();

  return (data.results || [])
    .map((place) => {
      if (!place.latitude || !place.longitude || !place.name) return null;

      return {
        id: `${place.latitude}-${place.longitude}-${place.name}`,
        name: place.name,
        lat: place.latitude,
        lng: place.longitude,
        category: place.categories?.[0]?.short_name || place.categories?.[0]?.name || null,
        categoryIcon: place.categories?.[0]?.icon
          ? `${place.categories[0].icon.prefix}120${place.categories[0].icon.suffix}`
          : null,
        address: place.location?.formatted_address || null,
        phone: place.tel || null,
        website: place.website || null,
        distance: place.distance ?? null,
      };
    })
    .filter(Boolean);
}

export function pickRandom(places, count = 10) {
  const shuffled = [...places].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
