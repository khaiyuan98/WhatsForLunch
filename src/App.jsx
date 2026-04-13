import { useState, useEffect } from 'react';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import LocationPicker from './components/LocationPicker';
import SettingsPanel from './components/SettingsPanel';
import SpinWheel from './components/SpinWheel';
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
            <SpinWheel items={wheelPlaces} onResult={handleWheelResult} dark={dark} />

            <ResultsGrid
              places={allPlaces}
              userLocation={location}
              winnerId={winnerId}
              selectedIds={selectedIds}
              onToggle={handleTogglePlace}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onStartOver={handleStartOver}
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
