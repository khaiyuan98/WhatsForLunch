function formatDistance(meters) {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default function RestaurantCard({ place, userLocation, isWinner, isOnWheel, onToggle }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.lat},${place.lng}`;

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
          <div className="flex items-center gap-3 min-w-0">
            {place.categoryIcon && (
              <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isWinner ? 'bg-orange-400 dark:bg-orange-500/30' : 'bg-orange-300 dark:bg-orange-500/20'
              }`}>
                <img src={place.categoryIcon} alt="" className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className={`text-base font-bold leading-tight truncate ${
                isWinner ? 'text-orange-600 dark:text-orange-400' : 'text-stone-800 dark:text-neutral-200'
              }`}>
                {place.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {place.category && (
                  <span className="text-sm text-stone-600 dark:text-neutral-300">{place.category}</span>
                )}
                {place.category && formatDistance(place.distance) && (
                  <span className="text-stone-500 dark:text-neutral-400">·</span>
                )}
                {formatDistance(place.distance) && (
                  <span className="text-sm text-stone-600 dark:text-neutral-300">{formatDistance(place.distance)}</span>
                )}
              </div>
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

        {place.address && (
          <p className="text-sm text-stone-500 dark:text-neutral-400 mt-2 leading-relaxed">{place.address}</p>
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
