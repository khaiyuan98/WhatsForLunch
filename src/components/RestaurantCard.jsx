function formatDistance(meters) {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const PRICE_MAP = {
  PRICE_LEVEL_FREE: '$',
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
};

function RatingStars({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 ${
            i < full ? 'text-amber-400' : i === full && half ? 'text-amber-400/50' : 'text-stone-300 dark:text-neutral-600'
          }`}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium text-stone-500 dark:text-neutral-400">{rating}</span>
    </div>
  );
}

export default function RestaurantCard({ place, userLocation, isWinner, isOnWheel, onToggle }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.id}`;

  return (
    <div
      className={`rounded-xl border transition-all h-full ${
        isWinner
          ? 'border-orange-400/50 bg-orange-50 dark:bg-orange-500/10 ring-1 ring-orange-500/30 shadow-sm'
          : isOnWheel
            ? 'border-amber-200 dark:border-neutral-600 bg-[#faf6f1] dark:bg-neutral-800 shadow-sm hover:border-amber-300 dark:hover:border-neutral-500'
            : 'border-amber-300 dark:border-neutral-700 bg-[#e8ddd0] dark:bg-neutral-900'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`text-base font-bold leading-tight truncate ${
              isWinner ? 'text-orange-600 dark:text-orange-400' : 'text-stone-800 dark:text-neutral-200'
            }`}>
              {place.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {place.category && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isWinner
                    ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                    : 'bg-amber-100 dark:bg-neutral-700 text-stone-600 dark:text-neutral-300'
                }`}>
                  {place.category}
                </span>
              )}
              {formatDistance(place.distance) && (
                <span className="text-xs text-stone-500 dark:text-neutral-400">{formatDistance(place.distance)}</span>
              )}
              {(place.priceLevel && PRICE_MAP[place.priceLevel] || place.priceRange) && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  {PRICE_MAP[place.priceLevel]}{place.priceRange && (
                    <span className="font-normal text-stone-400 dark:text-neutral-500"> {place.priceRange}</span>
                  )}
                </span>
              )}
              {place.openNow != null && (
                <span className={`text-xs font-medium ${place.openNow ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {place.openNow ? 'Open' : 'Closed'}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onToggle}
            title={isOnWheel ? 'Remove from wheel' : 'Add to wheel'}
            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              isOnWheel
                ? 'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 hover:text-red-600 dark:hover:text-red-300'
                : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 hover:text-green-700 dark:hover:text-green-300'
            }`}
          >
            {isOnWheel ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            )}
          </button>
        </div>

        {isWinner && (
          <div className="mt-2">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
              WINNER
            </span>
          </div>
        )}

        {place.rating && (
          <div className="flex items-center gap-1.5 mt-2">
            <RatingStars rating={place.rating} />
            {place.ratingCount && (
              <span className="text-xs text-stone-400 dark:text-neutral-500">({place.ratingCount})</span>
            )}
          </div>
        )}

        {place.address && (
          <p className="text-xs text-stone-400 dark:text-neutral-500 mt-2 leading-relaxed">{place.address}</p>
        )}

        <div className="flex gap-2 mt-auto pt-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center text-sm font-semibold py-2.5 px-4 rounded-lg transition-all ${
              isWinner
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-amber-200 dark:bg-neutral-700 hover:bg-amber-300 dark:hover:bg-neutral-600 text-stone-700 dark:text-neutral-200'
            }`}
          >
            Directions
          </a>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-amber-200 dark:bg-neutral-700 hover:bg-amber-300 dark:hover:bg-neutral-600 text-stone-700 dark:text-neutral-200 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
