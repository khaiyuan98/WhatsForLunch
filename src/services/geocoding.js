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
  return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
