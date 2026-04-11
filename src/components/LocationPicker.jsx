import { useState, useRef } from 'react';
import { getCurrentPosition } from '../services/location';
import { searchAddress, reverseGeocode } from '../services/geocoding';

export default function LocationPicker({ onLocationSet }) {
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [locationLabel, setLocationLabel] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  async function handleDetectLocation() {
    setError('');
    setDetecting(true);
    try {
      const coords = await getCurrentPosition();

      // Set location immediately — don't let reverse geocoding block it
      onLocationSet(coords);
      setAddressQuery('');
      setSuggestions([]);

      // Try to get a readable label, but fall back to coordinates
      try {
        const label = await reverseGeocode(coords.lat, coords.lng);
        setLocationLabel(label);
      } catch {
        setLocationLabel(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
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
    setLocationLabel('');
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
    setAddressQuery('');
    setSuggestions([]);
    setLocationLabel(suggestion.displayName);
    onLocationSet({ lat: suggestion.lat, lng: suggestion.lng });
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <button
        onClick={handleDetectLocation}
        disabled={detecting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
      >
        {detecting ? 'Detecting...' : 'Use My Location'}
      </button>

      <div className="relative">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          <span>or type an address</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <input
          type="text"
          value={addressQuery}
          onChange={handleInputChange}
          placeholder="e.g. 123 Main St, New York"
          className="mt-2 w-full border border-gray-300 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 cursor-pointer"
                >
                  {s.displayName}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {locationLabel && (
        <p className="text-center text-sm text-green-600 font-medium">
          Location set: {locationLabel.split(',').slice(0, 3).join(',')}
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
