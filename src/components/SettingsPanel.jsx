export default function SettingsPanel({ breakTime, setBreakTime, travelMode, setTravelMode, onSearch, disabled }) {
  const breakOptions = [
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          How long is your break?
        </label>
        <div className="flex gap-2">
          {breakOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBreakTime(opt.value)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                breakTime === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          How are you getting there?
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setTravelMode('walking')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
              travelMode === 'walking'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Walking
          </button>
          <button
            onClick={() => setTravelMode('driving')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
              travelMode === 'driving'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Driving
          </button>
        </div>
      </div>

      <button
        onClick={onSearch}
        disabled={disabled}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer"
      >
        Find My Lunch!
      </button>
    </div>
  );
}
