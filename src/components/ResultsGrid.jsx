import RestaurantCard from './RestaurantCard';

export default function ResultsGrid({ places, userLocation, winnerId }) {
  const sorted = [...places].sort((a, b) => {
    if (a.id === winnerId) return -1;
    if (b.id === winnerId) return 1;
    return 0;
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
        Your Lunch Options
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((place) => (
          <RestaurantCard
            key={place.id}
            place={place}
            userLocation={userLocation}
            isWinner={place.id === winnerId}
          />
        ))}
      </div>
    </div>
  );
}
