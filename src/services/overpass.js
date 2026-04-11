const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

export async function searchNearbyFood(lat, lng, radiusMeters) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      way["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      way["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
      way["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
    );
    out center body;
  `;

  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Failed to search for nearby food places');

  const data = await response.json();

  return data.elements
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      if (!elLat || !elLng) return null;

      const tags = el.tags || {};
      if (!tags.name) return null;

      return {
        id: el.id,
        name: tags.name,
        lat: elLat,
        lng: elLng,
        cuisine: tags.cuisine || null,
        amenity: tags.amenity,
        address: formatAddress(tags),
        openingHours: tags.opening_hours || null,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
      };
    })
    .filter(Boolean);
}

function formatAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : null;
}

export function pickRandom(places, count = 10) {
  const shuffled = [...places].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
