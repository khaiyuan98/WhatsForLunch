import CuisineFilter from './CuisineFilter';

export default function SettingsPanel({ breakTime, setBreakTime, travelMode, setTravelMode, wheelSize, setWheelSize, searchRadius, setSearchRadius, cuisineGroups, setCuisineGroups, onSearch, disabled }) {
  const breakOptions = [
    { value: 30, label: '30 min' },
    { value: 60, label: '60 min' },
    { value: 120, label: '120 min' },
  ];

  const wheelOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

  const maxRadius = travelMode === 'walking' ? 2000 : 15000;
  const step = travelMode === 'walking' ? 50 : 250;

  function formatRadius(meters) {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  }

  function ToggleGroup({ options, value, onChange }) {
    return (
      <div className="flex gap-1.5 bg-amber-100/60 dark:bg-neutral-800 p-1 rounded-xl">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              value === opt.value
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="bg-[#faf6f1] dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-neutral-800 shadow-sm space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-neutral-400 mb-2">
            How long do you have?
          </label>
          <ToggleGroup options={breakOptions} value={breakTime} onChange={setBreakTime} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-neutral-400 mb-2">
            Legs or wheels?
          </label>
          <ToggleGroup
            options={[
              { value: 'walking', label: 'Walking' },
              { value: 'driving', label: 'Driving' },
            ]}
            value={travelMode}
            onChange={setTravelMode}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-neutral-400 mb-2">
            How far will you go?
            <span className="ml-2 text-orange-500 font-bold">{formatRadius(searchRadius)}</span>
          </label>
          <input
            type="range"
            min={step}
            max={maxRadius}
            step={step}
            value={Math.round(searchRadius / step) * step || step}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-stone-500 dark:text-neutral-500 mt-1">
            <span>{formatRadius(step)}</span>
            <span>{formatRadius(maxRadius)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-neutral-400 mb-2">
            How many contenders?
          </label>
          <ToggleGroup options={wheelOptions} value={wheelSize} onChange={setWheelSize} />
        </div>

        <CuisineFilter enabledGroups={cuisineGroups} setEnabledGroups={setCuisineGroups} />

        <button
          onClick={onSearch}
          disabled={disabled || cuisineGroups.size === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all cursor-pointer"
        >
          Feed Me!
        </button>
      </div>
    </div>
  );
}
