const TAGLINES = [
  "Can't decide? Let the wheel decide for you.",
  "Because 'I don't know' isn't a restaurant.",
  "Stop arguing. Start spinning.",
  "Your lunch break is ticking...",
  "Decision fatigue ends here.",
  "The only app that settles the eternal debate.",
  "Where indecision meets destiny.",
];

import { useState } from 'react';

export default function Header() {
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);

  return (
    <header className="text-center pt-12 sm:pt-10 pb-4 sm:pb-6 px-10 sm:px-0">
      <h1 className="text-4xl sm:text-5xl font-black text-orange-500 tracking-tight">
        What's for Lunch?
      </h1>
      <p className="text-stone-600 dark:text-neutral-500 text-base mt-2">
        {tagline}
      </p>
    </header>
  );
}
