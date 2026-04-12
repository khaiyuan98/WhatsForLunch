const FSQ_DEV_BASE = '/api/foursquare/places/search';
const FSQ_PROD_BASE = 'https://places-api.foursquare.com/places/search';
const FSQ_BASE = import.meta.env.DEV ? FSQ_DEV_BASE : FSQ_PROD_BASE;
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

  const response = await fetch(`${FSQ_BASE}?${params}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json',
      'X-Places-Api-Version': '2025-06-17',
    },
  });

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
