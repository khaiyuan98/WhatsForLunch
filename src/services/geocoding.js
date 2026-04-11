const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export async function searchAddress(query) {
  if (!query || query.length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '5',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });

  if (!response.ok) throw new Error('Geocoding request failed');

  const data = await response.json();
  return data.map((item) => ({
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    locality: [item.address?.city || item.address?.town || item.address?.village, item.address?.state].filter(Boolean).join(', ') || null,
  }));
}

export async function reverseGeocode(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });

  if (!response.ok) throw new Error('Reverse geocoding failed');

  const data = await response.json();
  const label = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  const locality = [data.address?.city || data.address?.town || data.address?.village, data.address?.state].filter(Boolean).join(', ') || null;
  return { label, locality };
}
