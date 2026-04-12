import { useState, useRef } from 'react';
import { getCurrentPosition } from '../services/location';
import { searchAddress, reverseGeocode } from '../services/geocoding';

export default function LocationPicker({ onLocationSet }) {
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  async function handleDetectLocation() {
    setError('');
    setDetecting(true);
    try {
      const coords = await getCurrentPosition();
      setSuggestions([]);

      try {
        const { label, locality } = await reverseGeocode(coords.lat, coords.lng);
        setAddressQuery(label.split(',').slice(0, 3).join(',').trim());
        onLocationSet({ ...coords, locality });
      } catch {
        setAddressQuery(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        onLocationSet(coords);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDetecting(false);
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setAddressQuery(value);
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length >= 3) {
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await searchAddress(value);
          setSuggestions(results);
        } catch {
          setSuggestions([]);
        }
      }, 400);
    } else {
      setSuggestions([]);
    }
  }

  function handleSelectSuggestion(suggestion) {
    setAddressQuery(suggestion.displayName.split(',').slice(0, 3).join(',').trim());
    setSuggestions([]);
    onLocationSet({ lat: suggestion.lat, lng: suggestion.lng, locality: suggestion.locality });
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="bg-stone-50 dark:bg-neutral-900 rounded-2xl p-6 border border-stone-300 dark:border-neutral-800 shadow-sm">
        <button
          onClick={handleDetectLocation}
          disabled={detecting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.307 11.307 0 00.757.433c.12.062.218.107.281.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          {detecting ? 'Detecting...' : 'Use My Location'}
        </button>

        <div className="relative mt-4">
          <div className="flex items-center gap-3 text-stone-500 dark:text-neutral-600 text-xs font-medium uppercase tracking-wider">
            <div className="flex-1 h-px bg-stone-200 dark:bg-neutral-800" />
            <span>or type an address</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-neutral-800" />
          </div>

          <input
            type="text"
            value={addressQuery}
            onChange={handleInputChange}
            placeholder="e.g. 123 Main St, New York"
            className="mt-3 w-full bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl py-3.5 px-4 text-stone-800 dark:text-neutral-200 placeholder-stone-500 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 dark:hover:bg-neutral-700 text-sm text-stone-700 dark:text-neutral-300 border-b border-stone-100 dark:border-neutral-700/50 last:border-b-0 cursor-pointer transition-colors"
                  >
                    {s.displayName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 dark:text-red-400 mt-3">{error}</p>
        )}
      </div>
    </div>
  );
}
