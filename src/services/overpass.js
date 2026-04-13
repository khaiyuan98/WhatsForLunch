import { haversineDistance } from '../utils/distance';

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.formattedAddress',
  'places.shortFormattedAddress',
  'places.primaryType',
  'places.types',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.priceRange',
  'places.currentOpeningHours',
  'places.websiteUri',
  'places.googleMapsUri',
].join(',');

export async function searchNearbyFood(lat, lng, radiusMeters, includedTypes, rankPreference = 'DISTANCE') {
  const response = await fetch('/api/google-places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: includedTypes || ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery'],
      maxResultCount: 20,
      rankPreference,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: Math.min(radiusMeters, 50000),
        },
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to search for nearby food places');

  const data = await response.json();

  return (data.places || [])
    .map((place) => {
      if (!place.location || !place.displayName?.text) return null;

      const placeLat = place.location.latitude;
      const placeLng = place.location.longitude;
      const distance = haversineDistance(lat, lng, placeLat, placeLng) * 1000;

      const category = formatCategory(place.primaryType);

      return {
        id: place.id,
        name: place.displayName.text,
        lat: placeLat,
        lng: placeLng,
        category,
        categoryIcon: null,
        address: place.shortFormattedAddress || place.formattedAddress || null,
        rating: place.rating || null,
        ratingCount: place.userRatingCount || null,
        priceLevel: place.priceLevel || null,
        priceRange: formatPriceRange(place.priceRange) || null,
        openNow: place.currentOpeningHours?.openNow ?? null,
        hours: place.currentOpeningHours?.weekdayDescriptions || null,
        website: place.websiteUri || null,
        distance,
      };
    })
    .filter(Boolean);
}

function formatMoney(price) {
  if (!price) return null;
  const units = Number(price.units || 0);
  const nanos = Number(price.nanos || 0);
  const amount = units + nanos / 1e9;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode || 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${Math.round(amount)}`;
  }
}

function formatPriceRange(priceRange) {
  if (!priceRange) return null;
  const low = formatMoney(priceRange.startPrice);
  const high = formatMoney(priceRange.endPrice);
  if (low && high) return `${low}–${high}`;
  if (low) return `${low}+`;
  if (high) return `up to ${high}`;
  return null;
}

function formatCategory(primaryType) {
  if (!primaryType) return null;
  return primaryType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pickRandom(places, count = 10) {
  const shuffled = [...places].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
