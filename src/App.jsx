import { useState, useEffect } from 'react';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import LocationPicker from './components/LocationPicker';
import SettingsPanel from './components/SettingsPanel';
import SpinWheel from './components/SpinWheel';
import SlotMachine from './components/SlotMachine';
import DiceRoll from './components/DiceRoll';
import ResultsGrid from './components/ResultsGrid';
import LoadingSpinner from './components/LoadingSpinner';
import { searchNearbyFood, pickRandom } from './services/overpass';
import { getSearchRadius } from './utils/distance';
import CUISINE_GROUPS, { ALL_FOOD_TYPES } from './data/cuisineGroups';

const APP_VERSION = __APP_VERSION__;

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const [location, setLocation] = useState(null);
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem('breakTime');
    return saved ? Number(saved) : 60;
  });
  const [travelMode, setTravelMode] = useState(() => {
    return localStorage.getItem('travelMode') || 'walking';
  });
  const [wheelSize, setWheelSize] = useState(() => {
    const saved = localStorage.getItem('wheelSize');
    return saved ? Number(saved) : 20;
  });
  const [searchRadius, setSearchRadius] = useState(() => {
    const saved = localStorage.getItem('searchRadius');
    return saved ? Number(saved) : null;
  });
  const [rankPreference, setRankPreference] = useState(() => {
    return localStorage.getItem('rankPreference') || 'DISTANCE';
  });
  const [cuisineGroups, setCuisineGroups] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cuisineGroups'));
      return saved ? new Set(saved) : new Set(CUISINE_GROUPS.map((g) => g.id));
    } catch {
      return new Set(CUISINE_GROUPS.map((g) => g.id));
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [winnerId, setWinnerId] = useState(null);
  const [pickerMode, setPickerMode] = useState(() => {
    return localStorage.getItem('pickerMode') || 'wheel';
  });
  const [step, setStep] = useState('setup');

  const effectiveRadius = searchRadius ?? getSearchRadius(breakTime, travelMode);

  useEffect(() => {
    localStorage.setItem('breakTime', String(breakTime));
  }, [breakTime]);

  useEffect(() => {
    localStorage.setItem('travelMode', travelMode);
  }, [travelMode]);

  useEffect(() => {
    localStorage.setItem('wheelSize', String(wheelSize));
  }, [wheelSize]);

  useEffect(() => {
    if (searchRadius !== null) {
      localStorage.setItem('searchRadius', String(searchRadius));
    } else {
      localStorage.removeItem('searchRadius');
    }
  }, [searchRadius]);

  useEffect(() => {
    localStorage.setItem('rankPreference', rankPreference);
  }, [rankPreference]);

  useEffect(() => {
    localStorage.setItem('pickerMode', pickerMode);
  }, [pickerMode]);

  useEffect(() => {
    localStorage.setItem('cuisineGroups', JSON.stringify([...cuisineGroups]));
  }, [cuisineGroups]);

  function handleBreakTimeChange(value) {
    setBreakTime(value);
    setSearchRadius(null);
  }

  function handleTravelModeChange(value) {
    setTravelMode(value);
    setSearchRadius(null);
  }

  async function handleSearch() {
    if (!location) return;

    setError('');
    setLoading(true);
    setStep('loading');
    setWinnerId(null);

    try {
      // Build includedTypes from selected cuisine groups
      let includedTypes;
      const allSelected = cuisineGroups.size === CUISINE_GROUPS.length;
      if (allSelected) {
        includedTypes = ALL_FOOD_TYPES;
      } else {
        includedTypes = CUISINE_GROUPS
          .filter((g) => cuisineGroups.has(g.id))
          .flatMap((g) => g.types);
        // Deduplicate and cap at 50 (API limit)
        includedTypes = [...new Set(includedTypes)].slice(0, 50);
      }

      const fetched = await searchNearbyFood(location.lat, location.lng, effectiveRadius, includedTypes, rankPreference);

      if (fetched.length === 0) {
        setError('No food nearby — are you in the middle of nowhere? Try a bigger radius or switch to driving.');
        setStep('setup');
        return;
      }

      setAllPlaces(fetched);
      let excluded;
      try {
        const saved = JSON.parse(localStorage.getItem('excludedCategories'));
        excluded = saved ? new Set(saved) : new Set();
      } catch {
        excluded = new Set();
      }
      const eligible = excluded.size > 0
        ? fetched.filter((p) => !excluded.has(p.category || 'Other'))
        : fetched;
      const preSelected = pickRandom(eligible.length > 0 ? eligible : fetched, wheelSize);
      setSelectedIds(new Set(preSelected.map((p) => p.id)));
      setStep('results');
    } catch (err) {
      setError(err.message || 'Oops, something broke. Give it another shot!');
      setStep('setup');
    } finally {
      setLoading(false);
    }
  }

  function handleTogglePlace(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 2) return prev;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const wheelPlaces = allPlaces.filter((p) => selectedIds.has(p.id));

  function handleWheelResult(winner) {
    setWinnerId(winner.id);
  }

  function handleSelectAll(ids) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  function handleClearAll(ids) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  function handleStartOver() {
    setAllPlaces([]);
    setSelectedIds(new Set());
    setWinnerId(null);
    setStep('setup');
    setError('');
  }

  return (
    <div className="min-h-screen px-4 pb-12 bg-[#f5ebe0] dark:bg-[#0f0f0f] text-stone-800 dark:text-neutral-100 transition-colors">
      <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
      <Header />

      <main className="max-w-4xl mx-auto space-y-8">
        {step === 'setup' && (
          <>
            <LocationPicker onLocationSet={setLocation} />

            <SettingsPanel
              breakTime={breakTime}
              setBreakTime={handleBreakTimeChange}
              travelMode={travelMode}
              setTravelMode={handleTravelModeChange}
              wheelSize={wheelSize}
              setWheelSize={setWheelSize}
              searchRadius={effectiveRadius}
              setSearchRadius={setSearchRadius}
              rankPreference={rankPreference}
              setRankPreference={setRankPreference}
              cuisineGroups={cuisineGroups}
              setCuisineGroups={setCuisineGroups}
              onSearch={handleSearch}
              disabled={!location}
            />

            {error && (
              <p className="text-center text-red-400 font-medium">{error}</p>
            )}
          </>
        )}

        {step === 'loading' && <LoadingSpinner />}

        {step === 'results' && (
          <>
            <div className="flex justify-center">
              <div className="flex gap-1 bg-amber-100/60 dark:bg-neutral-800 p-1 rounded-xl">
                <button
                  onClick={() => setPickerMode('wheel')}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    pickerMode === 'wheel'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd" />
                  </svg>
                  Wheel
                </button>
                <button
                  onClick={() => setPickerMode('slots')}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    pickerMode === 'slots'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M4.5 2A2.5 2.5 0 002 4.5v11A2.5 2.5 0 004.5 18h11a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0015.5 2h-11zM6 7a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h.01a1 1 0 100-2H7zm2-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 3a1 1 0 100 2h.01a1 1 0 100-2H10zm2-4a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1zm1 3a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
                  </svg>
                  Slots
                </button>
                <button
                  onClick={() => setPickerMode('dice')}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    pickerMode === 'dice'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10 1.5 2 6v8l8 4.5L18 14V6L10 1.5Zm0 1.8 6 3.37v6.75L10 16.8 4 13.42V6.67l6-3.37ZM10 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" clipRule="evenodd" />
                  </svg>
                  Dice
                </button>
              </div>
            </div>

            {pickerMode === 'wheel' && (
              <SpinWheel
                items={wheelPlaces}
                onResult={handleWheelResult}
                onRemoveWinner={(id) => {
                  setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
                  setWinnerId(null);
                }}
                dark={dark}
              />
            )}
            {pickerMode === 'slots' && (
              <SlotMachine
                items={wheelPlaces}
                onResult={handleWheelResult}
                onRemoveWinner={(id) => {
                  setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
                  setWinnerId(null);
                }}
                dark={dark}
              />
            )}
            {pickerMode === 'dice' && (
              <DiceRoll
                items={wheelPlaces}
                onResult={handleWheelResult}
                onRemoveWinner={(id) => {
                  setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
                  setWinnerId(null);
                }}
                dark={dark}
              />
            )}

            <ResultsGrid
              places={allPlaces}
              userLocation={location}
              winnerId={winnerId}
              selectedIds={selectedIds}
              onToggle={handleTogglePlace}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onStartOver={handleStartOver}
              pickerMode={pickerMode}
            />
          </>
        )}
      </main>

      <footer className="text-center py-6 mt-8">
        <p className="text-xs text-stone-400 dark:text-neutral-600">v{APP_VERSION}</p>
      </footer>
    </div>
  );
}
