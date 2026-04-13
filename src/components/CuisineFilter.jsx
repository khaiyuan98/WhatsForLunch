import CUISINE_GROUPS from '../data/cuisineGroups';

const SORTED_GROUPS = [...CUISINE_GROUPS].sort((a, b) => a.label.localeCompare(b.label));

export default function CuisineFilter({ enabledGroups, setEnabledGroups }) {
  const allEnabled = enabledGroups.size === CUISINE_GROUPS.length;
  const noneEnabled = enabledGroups.size === 0;

  function toggleGroup(id) {
    setEnabledGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function enableAll() {
    setEnabledGroups(new Set(CUISINE_GROUPS.map((g) => g.id)));
  }

  function disableAll() {
    setEnabledGroups(new Set());
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-neutral-300">What are you in the mood for?</h3>
        <div className="flex gap-1.5">
          <button
            onClick={enableAll}
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border-2 transition-all cursor-pointer ${
              allEnabled
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30 hover:bg-green-100 dark:hover:bg-green-500/20'
            }`}
          >
            All
          </button>
          <button
            onClick={disableAll}
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border-2 transition-all cursor-pointer ${
              noneEnabled
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-300 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20'
            }`}
          >
            None
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SORTED_GROUPS.map((group) => {
          const isEnabled = enabledGroups.has(group.id);
          return (
            <button
              key={group.id}
              onClick={() => toggleGroup(group.id)}
              className={`text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                isEnabled
                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-500/30 hover:bg-orange-100 dark:hover:bg-orange-500/20'
                  : 'bg-white dark:bg-neutral-800 text-stone-400 dark:text-neutral-600 border-stone-200 dark:border-neutral-800 line-through opacity-60 hover:opacity-80'
              }`}
            >
              {group.emoji} {group.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
