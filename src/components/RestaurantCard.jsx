function formatDistance(meters) {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default function RestaurantCard({ place, userLocation, isWinner }) {
  const destination = place.address
    ? `${place.name}, ${place.address}`
    : `${place.name}, ${userLocation.locality || ''}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(destination)}`;

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

      <div className="flex items-start gap-3">
        {place.categoryIcon && (
          <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <img src={place.categoryIcon} alt="" className="w-8 h-8" />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800 leading-tight pt-1">{place.name}</h3>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {place.category && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {place.category}
          </span>
        )}
        {formatDistance(place.distance) && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {formatDistance(place.distance)}
          </span>
        )}
      </div>

      {place.address && (
        <p className="text-sm text-gray-500 mt-2">{place.address}</p>
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
