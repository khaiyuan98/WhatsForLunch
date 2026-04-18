import { useState, useRef, useMemo, useCallback } from 'react';

function DieFace({ value, rolling, dark }) {
  const cx = 60, cy = 62, r = 52;
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 10) * (2 * i - 1);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }).map(([x, y]) => `${x},${y}`).join(' ');

  const innerR = r * 0.52;
  const triPoints = [0, 1, 2].map((i) => {
    const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
    return [cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle)];
  }).map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div className={`select-none transition-all ${rolling ? 'scale-95' : 'scale-100'}`}
      style={{ width: 120, height: 120 }}>
      <svg viewBox="0 0 120 124" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="dieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="dieShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ea580c" floodOpacity="0.4" />
          </filter>
        </defs>
        <polygon points={points}
          fill="url(#dieGrad)"
          stroke="#fff3"
          strokeWidth="1.5"
          filter="url(#dieShadow)" />
        {/* Highlight sheen */}
        <polygon points={points}
          fill="url(#sheen)"
          stroke="none" />
        <defs>
          <radialGradient id="sheen" cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon points={points} fill="url(#sheen)" />
        <polygon points={triPoints} fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5" />
        <text
          x={cx} y={cy + 1}
          textAnchor="middle" dominantBaseline="central"
          fontSize={value >= 10 ? 26 : 30}
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
          fill="#ffffff"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
        >
          {value}
        </text>
      </svg>
    </div>
  );
}

export default function DiceRoll({ items, onResult, onRemoveWinner, dark }) {
  const [rolling, setRolling] = useState(false);
  const [faceValue, setFaceValue] = useState(1);
  const [winner, setWinner] = useState(null);
  const [rollKey, setRollKey] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const timerRef = useRef(null);

  // Stable mapping: face 1–20 → item (wraps if < 20 items)
  const faceMap = useMemo(() => {
    const map = {};
    for (let i = 1; i <= 20; i++) {
      map[i] = items[(i - 1) % items.length];
    }
    return map;
  }, [items]);

  function roll() {
    if (rolling || items.length < 2) return;
    setRolling(true);
    setWinner(null);
    setRollKey((k) => k + 1);

    const finalFace = Math.floor(Math.random() * 20) + 1;
    const winnerItem = faceMap[finalFace];

    const totalDuration = 2400;
    const start = performance.now();

    function tick() {
      const elapsed = performance.now() - start;
      const progress = elapsed / totalDuration;
      const interval = 50 + progress * 250;

      setFaceValue(Math.floor(Math.random() * 20) + 1);

      if (elapsed < totalDuration - interval) {
        timerRef.current = setTimeout(tick, interval);
      } else {
        setFaceValue(finalFace);
        setRolling(false);
        setWinner(winnerItem);
        onResult(winnerItem);
      }
    }

    timerRef.current = setTimeout(tick, 50);
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up w-full max-w-sm mx-auto">
      {/* Die */}
      <div className={`relative rounded-2xl border-2 p-8 sm:p-10 shadow-xl flex flex-col items-center gap-4 w-full ${
        dark ? 'bg-neutral-900 border-neutral-700' : 'bg-[#faf6f1] border-amber-300'
      }`}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md whitespace-nowrap">
          LUNCH D20
        </div>

        <div key={rollKey} className={rolling ? 'animate-dice-tumble' : ''}>
          <DieFace value={faceValue} rolling={rolling} dark={dark} />
        </div>

        {!rolling && winner && (
          <p className={`text-xs font-semibold ${dark ? 'text-neutral-500' : 'text-stone-400'}`}>
            Rolled a {faceValue}
          </p>
        )}
      </div>

      {/* Mapping table */}
      <div className={`w-full rounded-2xl border-2 overflow-hidden ${
        dark ? 'bg-neutral-900 border-neutral-700' : 'bg-[#faf6f1] border-amber-300'
      }`}>
        <button
          onClick={() => setTableOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors ${
            dark ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700' : 'bg-amber-100 text-stone-500 hover:bg-amber-200'
          }`}
        >
          Roll table
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className={`w-4 h-4 transition-transform ${tableOpen ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
        {tableOpen && (
          <div className="grid grid-cols-2 divide-x divide-y divide-amber-100 dark:divide-neutral-800">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((face) => {
              const place = faceMap[face];
              const isWinner = winner && place?.id === winner.id && face === faceValue;
              return (
                <div
                  key={face}
                  className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
                    isWinner ? 'bg-orange-500/10 dark:bg-orange-500/20' : ''
                  }`}
                >
                  <span className={`shrink-0 w-6 text-center text-xs font-bold ${
                    isWinner ? 'text-orange-500' : dark ? 'text-neutral-500' : 'text-stone-400'
                  }`}>
                    {face}
                  </span>
                  <span className={`text-xs truncate ${
                    isWinner ? 'text-orange-500 font-bold' : dark ? 'text-neutral-300' : 'text-stone-600'
                  }`}>
                    {place?.name ?? '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Button */}
      {items.length === 0 ? (
        <p className="text-stone-500 dark:text-neutral-400 font-medium text-center">
          No contenders! Add some places below.
        </p>
      ) : (
        <button
          onClick={roll}
          disabled={rolling || items.length < 2}
          className={`bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-extrabold py-4 px-14 rounded-full text-xl transition-all cursor-pointer shadow-lg hover:shadow-xl ${
            !rolling && !winner && items.length >= 2 ? 'animate-pulse-glow' : ''
          }`}
        >
          {rolling ? 'Rolling...' : items.length < 2 ? 'Need at least 2!' : 'ROLL!'}
        </button>
      )}

      {/* Winner */}
      {winner && (
        <div className="text-center animate-fade-in-up">
          <p className="text-3xl font-extrabold text-orange-500">{winner.name}</p>
          <p className="text-stone-500 dark:text-neutral-400 mt-1 font-medium">
            {faceValue === 20 ? '🎉 Natural 20! Critical lunch!' : 'The d20 has spoken. Go eat!'}
          </p>
          <button
            onClick={() => { onRemoveWinner(winner.id); setWinner(null); }}
            className="mt-3 inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 border border-red-200 dark:border-red-500/30 text-sm font-semibold py-2 px-4 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
            Not this one — roll again
          </button>
        </div>
      )}
    </div>
  );
}
