import { useState, useRef, useEffect } from 'react';

const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 5;
const SPIN_CYCLES = 10;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildStrip(items, winnerItem) {
  const strip = [];
  for (let cycle = 0; cycle < SPIN_CYCLES; cycle++) {
    strip.push(...shuffleArray(items));
  }
  // Pad so winner lands in the center slot
  const others = items.filter((it) => it.id !== winnerItem.id);
  const before2 = others[Math.floor(Math.random() * others.length)];
  const before1 = others[Math.floor(Math.random() * others.length)];
  const after1  = others[Math.floor(Math.random() * others.length)];
  const after2  = others[Math.floor(Math.random() * others.length)];
  strip.push(before2, before1, winnerItem, after1, after2);
  return strip;
}

export default function SlotMachine({ items, onResult, onRemoveWinner, dark }) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [strip, setStrip] = useState([]);
  const reelRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (reelRef.current) {
      reelRef.current.style.transition = 'none';
      reelRef.current.style.transform = 'translateY(0px)';
    }
    setWinner(null);
    setStrip([]);
  }, [items.length]);

  function pull() {
    if (spinning || items.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const winnerItem = items[Math.floor(Math.random() * items.length)];
    const newStrip = buildStrip(items, winnerItem);
    setStrip(newStrip);

    requestAnimationFrame(() => {
      if (!reelRef.current) return;
      reelRef.current.style.transition = 'none';
      reelRef.current.style.transform = 'translateY(0px)';
      reelRef.current.offsetHeight;

      // Center slot is index 2 of VISIBLE_ITEMS; winner is 3rd from end
      const winnerIdx = newStrip.length - 3;
      const targetOffset = -(winnerIdx - 2) * ITEM_HEIGHT;
      const duration = 3200;

      reelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.12, 0.9, 0.2, 1)`;
      reelRef.current.style.transform = `translateY(${targetOffset}px)`;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setWinner(winnerItem);
        setSpinning(false);
        onResult(winnerItem);
      }, duration);
    });
  }

  const displayStrip = strip.length > 0 ? strip : items;

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up">
      {/* Machine frame */}
      <div className="relative rounded-2xl p-4 sm:p-6 shadow-xl w-full max-w-xs"
        style={{ background: 'linear-gradient(135deg, #fb923c 0%, #dc2626 100%)', boxShadow: '0 8px 32px rgba(234,88,12,0.35)' }}>
        {/* Sheen overlay */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 65%)' }} />

        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-white text-orange-500 shadow-md whitespace-nowrap">
          LUNCH SLOTS
        </div>

        {/* Reel window */}
        <div
          className={`relative overflow-hidden rounded-xl border-2 mx-auto mt-2 ${
            dark ? 'bg-neutral-900 border-white/20' : 'bg-white border-white/60'
          }`}
          style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
        >
          {/* Top fade */}
          <div className={`absolute inset-x-0 top-0 z-10 pointer-events-none ${
            dark ? 'bg-gradient-to-b from-neutral-900 to-transparent' : 'bg-gradient-to-b from-white to-transparent'
          }`} style={{ height: ITEM_HEIGHT * 1.5 }} />

          {/* Bottom fade */}
          <div className={`absolute inset-x-0 bottom-0 z-10 pointer-events-none ${
            dark ? 'bg-gradient-to-t from-neutral-900 to-transparent' : 'bg-gradient-to-t from-white to-transparent'
          }`} style={{ height: ITEM_HEIGHT * 1.5 }} />

          {/* Center highlight */}
          <div
            className="absolute inset-x-0 z-20 pointer-events-none border-y-2 border-orange-400/70"
            style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, background: 'rgba(251,146,60,0.08)' }}
          />

          {/* Strip */}
          <div ref={reelRef}>
            {displayStrip.map((item, i) => {
              const isCenterSlot = !spinning && winner && i === displayStrip.length - 3;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center px-4 text-center"
                  style={{ height: ITEM_HEIGHT }}
                >
                  <span className={`text-sm sm:text-base font-semibold leading-tight ${
                    isCenterSlot
                      ? 'text-orange-500 font-bold'
                      : dark ? 'text-neutral-200' : 'text-stone-700'
                  }`}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Button */}
      {items.length === 0 ? (
        <p className="text-stone-500 dark:text-neutral-400 font-medium text-center">
          No contenders! Add some places below.
        </p>
      ) : (
        <button
          onClick={pull}
          disabled={spinning || items.length < 2}
          className={`bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-extrabold py-4 px-14 rounded-full text-xl transition-all cursor-pointer shadow-lg hover:shadow-xl ${
            !spinning && !winner && items.length >= 2 ? 'animate-pulse-glow' : ''
          }`}
        >
          {spinning ? 'Come on...' : items.length < 2 ? 'Need at least 2!' : 'PULL!'}
        </button>
      )}

      {/* Winner */}
      {winner && (
        <div className="text-center animate-fade-in-up">
          <p className="text-3xl font-extrabold text-orange-500">{winner.name}</p>
          <p className="text-stone-500 dark:text-neutral-400 mt-1 font-medium">Jackpot! Go eat!</p>
          <button
            onClick={() => { onRemoveWinner(winner.id); setWinner(null); }}
            className="mt-3 inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 border border-red-200 dark:border-red-500/30 text-sm font-semibold py-2 px-4 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
            Not this one — pull again
          </button>
        </div>
      )}
    </div>
  );
}
