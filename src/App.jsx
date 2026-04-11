import { useState } from 'react';
import Header from './components/Header';
import LocationPicker from './components/LocationPicker';
import SettingsPanel from './components/SettingsPanel';
import SpinWheel from './components/SpinWheel';
import ResultsGrid from './components/ResultsGrid';
import LoadingSpinner from './components/LoadingSpinner';
import { searchNearbyFood, pickRandom } from './services/overpass';
import { getSearchRadius } from './utils/distance';

const RESULT_COUNT = 10;

export default function App() {
  const [location, setLocation] = useState(null);
  const [breakTime, setBreakTime] = useState(30);
  const [travelMode, setTravelMode] = useState('walking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [places, setPlaces] = useState([]);
  const [winnerId, setWinnerId] = useState(null);
  const [step, setStep] = useState('setup'); // setup | loading | results

  async function handleSearch() {
    if (!location) return;

    setError('');
    setLoading(true);
    setStep('loading');
    setWinnerId(null);

    try {
      const radius = getSearchRadius(breakTime, travelMode);
      const allPlaces = await searchNearbyFood(location.lat, location.lng, radius);

      if (allPlaces.length === 0) {
        setError('No food places found nearby. Try increasing your break time or switching to driving.');
        setStep('setup');
        return;
      }

      const selected = pickRandom(allPlaces, RESULT_COUNT);
      setPlaces(selected);
      setStep('results');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('setup');
    } finally {
      setLoading(false);
    }
  }

  function handleWheelResult(winner) {
    setWinnerId(winner.id);
  }

  function handleStartOver() {
    setPlaces([]);
    setWinnerId(null);
    setStep('setup');
    setError('');
  }

  return (
    <div className="min-h-screen px-4 pb-12">
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
              onSearch={handleSearch}
              disabled={!location}
            />

            {error && (
              <p className="text-center text-red-500 font-medium">{error}</p>
            )}
          </>
        )}

        {step === 'loading' && <LoadingSpinner />}

        {step === 'results' && (
          <>
            <SpinWheel items={places} onResult={handleWheelResult} />

            <ResultsGrid
              places={places}
              userLocation={location}
              winnerId={winnerId}
            />

            <div className="text-center pt-4">
              <button
                onClick={handleStartOver}
                className="text-orange-500 hover:text-orange-600 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Start Over
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
