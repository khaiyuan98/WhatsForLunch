import { formatDistance, haversineDistance } from '../utils/distance';

const AMENITY_LABELS = {
  restaurant: 'Restaurant',
  fast_food: 'Fast Food',
  cafe: 'Cafe',
};

const AMENITY_COLORS = {
  restaurant: 'bg-blue-100 text-blue-700',
  fast_food: 'bg-red-100 text-red-700',
  cafe: 'bg-amber-100 text-amber-700',
};

export default function RestaurantCard({ place, userLocation, isWinner }) {
  const distance = haversineDistance(userLocation.lat, userLocation.lng, place.lat, place.lng);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all ${
        isWinner
          ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-300'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {isWinner && (
        <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          THE WHEEL HAS SPOKEN
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-800 leading-tight">{place.name}</h3>

      <div className="flex flex-wrap gap-2 mt-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${AMENITY_COLORS[place.amenity] || 'bg-gray-100 text-gray-600'}`}>
          {AMENITY_LABELS[place.amenity] || place.amenity}
        </span>
        {place.cuisine && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
            {place.cuisine.split(';')[0]}
          </span>
        )}
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {formatDistance(distance)}
        </span>
      </div>

      {place.address && (
        <p className="text-sm text-gray-500 mt-2">{place.address}</p>
      )}

      {place.openingHours && (
        <p className="text-xs text-gray-400 mt-1">Hours: {place.openingHours}</p>
      )}

      <div className="flex gap-2 mt-4">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Get Directions
        </a>
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}
