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
  const [breakTime, setBreakTime] = useState(30);
  const [travelMode, setTravelMode] = useState('walking');
  const [wheelSize, setWheelSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [winnerId, setWinnerId] = useState(null);
  const [step, setStep] = useState('setup');

  async function handleSearch() {
    if (!location) return;

    setError('');
    setLoading(true);
    setStep('loading');
    setWinnerId(null);

    try {
      const radius = getSearchRadius(breakTime, travelMode);
      const fetched = await searchNearbyFood(location.lat, location.lng, radius);

      if (fetched.length === 0) {
        setError('No food places found nearby. Try increasing your break time or switching to driving.');
        setStep('setup');
        return;
      }

      setAllPlaces(fetched);
      const preSelected = pickRandom(fetched, wheelSize);
      setSelectedIds(new Set(preSelected.map((p) => p.id)));
      setStep('results');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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

  function handleStartOver() {
    setAllPlaces([]);
    setSelectedIds(new Set());
    setWinnerId(null);
    setStep('setup');
    setError('');
  }

  return (
    <div className="min-h-screen px-4 pb-12 bg-stone-200 dark:bg-[#0f0f0f] text-stone-800 dark:text-neutral-100 transition-colors">
      <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
      <Header />

      <main className="max-w-4xl mx-auto space-y-8">
        {step === 'setup' && (
          <>
            <LocationPicker onLocationSet={setLocation} />

            <SettingsPanel
              breakTime={breakTime}
              setBreakTime={setBreakTime}
              travelMode={travelMode}
              setTravelMode={setTravelMode}
              wheelSize={wheelSize}
              setWheelSize={setWheelSize}
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
            <SpinWheel items={wheelPlaces} onResult={handleWheelResult} />

            <ResultsGrid
              places={allPlaces}
              userLocation={location}
              winnerId={winnerId}
              selectedIds={selectedIds}
              onToggle={handleTogglePlace}
              onStartOver={handleStartOver}
            />
          </>
        )}
      </main>
    </div>
  );
}
