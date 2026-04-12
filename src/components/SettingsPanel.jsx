export default function SettingsPanel({ breakTime, setBreakTime, travelMode, setTravelMode, wheelSize, setWheelSize, onSearch, disabled }) {
  const breakOptions = [
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
  ];

  const wheelOptions = [
    { value: 5, label: '5' },
    { value: 8, label: '8' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
  ];

  function ToggleGroup({ options, value, onChange }) {
    return (
      <div className="flex gap-1.5 bg-stone-100 dark:bg-neutral-800 p-1 rounded-xl">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              value === opt.value
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200'
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
      <div className="bg-stone-50 dark:bg-neutral-900 rounded-2xl p-6 border border-stone-300 dark:border-neutral-800 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-neutral-400 mb-2">
            How long is your break?
          </label>
          <ToggleGroup options={breakOptions} value={breakTime} onChange={setBreakTime} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-neutral-400 mb-2">
            How are you getting there?
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
          <label className="block text-sm font-semibold text-stone-600 dark:text-neutral-400 mb-2">
            Places on the wheel
          </label>
          <ToggleGroup options={wheelOptions} value={wheelSize} onChange={setWheelSize} />
        </div>

        <button
          onClick={onSearch}
          disabled={disabled}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all cursor-pointer"
        >
          Find My Lunch!
        </button>
      </div>
    </div>
  );
}
