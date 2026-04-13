import { useState, useEffect } from 'react';

const MESSAGES = [
  'Searching for food nearby...',
  'Consulting the lunch gods...',
  'Sniffing out the good stuff...',
  'Asking around the neighborhood...',
  'Warming up the wheel...',
  'So many choices, so little time...',
];

export default function LoadingSpinner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-in-up">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-stone-200 dark:border-neutral-800 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
      </div>
      <p className="text-stone-500 dark:text-neutral-400 text-lg font-medium transition-all">
        {MESSAGES[index]}
      </p>
    </div>
  );
}
