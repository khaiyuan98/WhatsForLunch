import { useState, useEffect, useMemo } from 'react';
import RestaurantCard from './RestaurantCard';

export default function ResultsGrid({ places, userLocation, winnerId, selectedIds, onToggle, onSelectAll, onClearAll, onStartOver }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [excludedCategories, setExcludedCategories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('excludedCategories'));
      return saved ? new Set(saved) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('excludedCategories', JSON.stringify([...excludedCategories]));
  }, [excludedCategories]);

  const categories = useMemo(() => {
    const counts = {};
    places.forEach((p) => {
      const cat = p.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [places]);

  function toggleCategory(cat) {
    setExcludedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
        const idsToRemove = places
          .filter((p) => (p.category || 'Other') === cat)
          .map((p) => p.id);
        onClearAll(idsToRemove);
      }
      return next;
    });
  }

  const filtered = places.filter((p) => {
    const cat = p.category || 'Other';
    if (excludedCategories.has(cat)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q));
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.id === winnerId) return -1;
    if (b.id === winnerId) return 1;
    const aSelected = selectedIds.has(a.id);
    const bSelected = selectedIds.has(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (a.distance ?? Infinity) - (b.distance ?? Infinity);
  });

  const allCategoriesShown = excludedCategories.size === 0;
  const allCategoriesHidden = categories.length > 0 && categories.every(({ name }) => excludedCategories.has(name));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="sticky top-0 z-40 bg-[#f5ebe0]/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter..."
              className="w-full bg-white dark:bg-neutral-800 border border-amber-200 dark:border-neutral-700 rounded-xl py-2 pl-9 pr-3 text-sm text-stone-800 dark:text-neutral-200 placeholder-stone-400 dark:placeholder-neutral-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={onStartOver}
            className="shrink-0 flex items-center gap-1.5 bg-white dark:bg-neutral-800 hover:bg-orange-50 dark:hover:bg-neutral-700 border border-amber-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 text-sm font-medium py-2 px-3 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.322 4.516a.75.75 0 01.22.53v3.954a.75.75 0 01-.75.75h-3.954a.75.75 0 010-1.5h2.126A5.466 5.466 0 0010 4.5a5.5 5.5 0 100 11 5.466 5.466 0 003.964-1.75.75.75 0 111.104 1.016A6.966 6.966 0 0110 17a7 7 0 110-14 6.966 6.966 0 014.793 1.977V3.75a.75.75 0 01.53-.234z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Still Hungry?</span>
            <span className="sm:hidden">Redo</span>
          </button>
        </div>

        {categories.length > 1 && (
          <div className="relative mt-2">
          <div className="flex gap-1.5 pb-1 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible">
            <button
              onClick={() => setExcludedCategories(new Set())}
              className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full border-2 transition-all cursor-pointer ${
                allCategoriesShown
                  ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-500/25'
                  : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30 hover:bg-green-100 dark:hover:bg-green-500/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                const allNames = new Set(categories.map(({ name }) => name));
                setExcludedCategories(allNames);
                onClearAll(places.map((p) => p.id));
              }}
              className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full border-2 transition-all cursor-pointer ${
                allCategoriesHidden
                  ? 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-500/25'
                  : 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-300 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20'
              }`}
            >
              None
            </button>
            {categories.map(({ name, count }) => {
              const isExcluded = excludedCategories.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleCategory(name)}
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    isExcluded
                      ? 'bg-white dark:bg-neutral-800 text-stone-400 dark:text-neutral-600 border-stone-200 dark:border-neutral-800 line-through opacity-60'
                      : 'bg-white dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 border-amber-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-500'
                  }`}
                >
                  {name} <span className="text-stone-400 dark:text-neutral-500 font-normal">{count}</span>
                </button>
              );
            })}
          </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-y-1 mt-2">
          <div className="flex items-center gap-2">
            <p className="text-xs text-stone-500 dark:text-neutral-500">
              <span className="text-orange-500 font-semibold">{selectedIds.size}</span>
              <span className="hidden sm:inline"> contenders</span> on wheel
              {(search || excludedCategories.size > 0) && <> — {sorted.length}/{places.length}</>}
            </p>
            <button
              onClick={() => onSelectAll(sorted.map((p) => p.id))}
              disabled={sorted.every((p) => selectedIds.has(p.id))}
              className="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-30 disabled:cursor-default cursor-pointer transition-colors"
            >
              All
            </button>
            <span className="text-stone-300 dark:text-neutral-700">|</span>
            <button
              onClick={() => onClearAll(sorted.map((p) => p.id))}
              disabled={sorted.every((p) => !selectedIds.has(p.id))}
              className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-default cursor-pointer transition-colors"
            >
              None
            </button>
          </div>
          <div className="flex gap-1 bg-amber-100/60 dark:bg-neutral-800 p-0.5 rounded-lg">
            <button
              onClick={() => setSortBy('distance')}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                sortBy === 'distance'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200'
              }`}
            >
              Distance
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                sortBy === 'name'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200'
              }`}
            >
              A–Z
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
        <p className="text-center text-stone-400 dark:text-neutral-500 py-12">
          {excludedCategories.size > 0 ? "All categories filtered out — tap some chips to bring 'em back!" : `Nothing matches "${search}" — try something else!`}
        </p>
      )}
    </div>
  );
}
