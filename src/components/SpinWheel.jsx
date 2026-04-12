import { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = [
  '#F97316', '#EF4444', '#8B5CF6', '#06B6D4', '#10B981',
  '#F59E0B', '#EC4899', '#6366F1', '#14B8A6', '#F43F5E',
];

export default function SpinWheel({ items, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const animationRef = useRef(null);

  const segmentAngle = (2 * Math.PI) / items.length;

  const drawWheel = useCallback((currentRotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const isDark = document.documentElement.classList.contains('dark');

    ctx.clearRect(0, 0, size, size);

    items.forEach((item, i) => {
      const startAngle = i * segmentAngle + currentRotation;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, Math.min(13, 150 / items.length))}px Inter, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;

      const label = item.name.length > 18 ? item.name.slice(0, 16) + '...' : item.name;
      ctx.fillText(label, radius - 18, 4);
      ctx.restore();
    });

    // Center
    ctx.beginPath();
    ctx.arc(center, center, 26, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#333' : '#e5e5e5';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#f97316';
    ctx.fill();

    // Pointer
    const pointerX = size - 2;
    const pointerY = center;
    ctx.beginPath();
    ctx.moveTo(pointerX, pointerY - 18);
    ctx.lineTo(pointerX - 30, pointerY);
    ctx.lineTo(pointerX, pointerY + 18);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#f97316' : '#1f2937';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#0f0f0f' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [items, segmentAngle]);

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const container = canvas.parentElement;
      const size = Math.min(container.clientWidth, 360);
      canvas.width = size;
      canvas.height = size;
      drawWheel(rotation);
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawWheel, rotation]);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);

    const totalRotation = (5 + Math.random() * 3) * 2 * Math.PI;
    const targetRotation = rotation + totalRotation;
    const startTime = performance.now();
    const duration = 4000;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = rotation + totalRotation * eased;

      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(targetRotation);
        const normalizedAngle = ((2 * Math.PI) - (targetRotation % (2 * Math.PI))) % (2 * Math.PI);
        const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % items.length;
        const winnerItem = items[winnerIndex];

        setWinner(winnerItem);
        setSpinning(false);
        onResult(winnerItem);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up">
      <div className="w-full max-w-[360px]">
        <canvas ref={canvasRef} className="w-full drop-shadow-lg dark:drop-shadow-xl" />
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-extrabold py-4 px-14 rounded-full text-xl transition-all cursor-pointer ${
          !spinning && !winner ? 'animate-pulse-glow' : ''
        }`}
      >
        {spinning ? 'Spinning...' : 'SPIN!'}
      </button>

      {winner && (
        <div className="text-center animate-fade-in-up">
          <p className="text-3xl font-extrabold text-orange-500">
            {winner.name}
          </p>
          <p className="text-neutral-400 dark:text-neutral-500 mt-1 font-medium">is what's for lunch!</p>
        </div>
      )}
    </div>
  );
}
