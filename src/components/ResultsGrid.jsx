import { useState } from 'react';
import RestaurantCard from './RestaurantCard';

export default function ResultsGrid({ places, userLocation, winnerId, selectedIds, onToggle, onStartOver }) {
  const [search, setSearch] = useState('');

  const filtered = places.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a.id === winnerId) return -1;
    if (b.id === winnerId) return 1;
    const aSelected = selectedIds.has(a.id);
    const bSelected = selectedIds.has(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="sticky top-0 z-20 bg-stone-200/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md pb-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter places..."
              className="w-full bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-stone-800 dark:text-neutral-200 placeholder-stone-400 dark:placeholder-neutral-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={onStartOver}
            className="shrink-0 flex items-center gap-1.5 bg-white dark:bg-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-700 border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 text-sm font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.379 2.341l-1.132 1.09A7 7 0 0015.312 11.424zm-10.624-2.85a5.5 5.5 0 019.379-2.34l1.132-1.09A7 7 0 004.688 8.574z" clipRule="evenodd" />
            </svg>
            Start Over
          </button>
        </div>
        <p className="text-xs text-stone-500 dark:text-neutral-500 mt-2">
          <span className="text-orange-500 font-semibold">{selectedIds.size}</span> on the wheel
          {search && <> — showing {sorted.length} of {places.length}</>}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {sorted.map((place, i) => (
          <div key={place.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.02}s` }}>
            <RestaurantCard
              place={place}
              userLocation={userLocation}
              isWinner={place.id === winnerId}
              isOnWheel={selectedIds.has(place.id)}
              onToggle={() => onToggle(place.id)}
            />
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-stone-400 dark:text-neutral-500 py-12">No places match "{search}"</p>
      )}
    </div>
  );
}
