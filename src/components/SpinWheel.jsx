import { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = [
  '#EA580C', '#DC2626', '#7C3AED', '#0891B2', '#059669',
  '#D97706', '#DB2777', '#4F46E5', '#0D9488', '#E11D48',
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
    const outerRadius = center - 16;
    const isDark = document.documentElement.classList.contains('dark');

    ctx.clearRect(0, 0, size, size);

    // Outer ring / shadow
    ctx.beginPath();
    ctx.arc(center, center, outerRadius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
    ctx.fill();

    // Segments
    items.forEach((item, i) => {
      const startAngle = i * segmentAngle + currentRotation;
      const endAngle = startAngle + segmentAngle;
      const color = COLORS[i % COLORS.length];

      // Main segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, outerRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Inner gradient overlay for depth
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, outerRadius);
      gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, outerRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Segment borders
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, outerRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, Math.min(14, 160 / items.length))}px Inter, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const label = item.name.length > 18 ? item.name.slice(0, 16) + '…' : item.name;
      ctx.fillText(label, outerRadius - 20, 5);
      ctx.restore();
    });

    // Outer rim
    ctx.beginPath();
    ctx.arc(center, center, outerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Tick marks around the edge
    items.forEach((_, i) => {
      const angle = i * segmentAngle + currentRotation;
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(outerRadius - 8, 0);
      ctx.lineTo(outerRadius + 1, 0);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });

    // Center hub - outer ring
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    const hubGradient = ctx.createRadialGradient(center - 5, center - 5, 0, center, center, 32);
    hubGradient.addColorStop(0, isDark ? '#333' : '#ffffff');
    hubGradient.addColorStop(1, isDark ? '#1a1a1a' : '#e5e5e5');
    ctx.fillStyle = hubGradient;
    ctx.fill();
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hub - inner dot
    ctx.beginPath();
    ctx.arc(center, center, 10, 0, 2 * Math.PI);
    const dotGradient = ctx.createRadialGradient(center - 2, center - 2, 0, center, center, 10);
    dotGradient.addColorStop(0, '#fb923c');
    dotGradient.addColorStop(1, '#ea580c');
    ctx.fillStyle = dotGradient;
    ctx.fill();
    ctx.shadowColor = 'rgba(249, 115, 22, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pointer (triangle on right)
    const pointerX = size - 4;
    const pointerY = center;
    ctx.beginPath();
    ctx.moveTo(pointerX, pointerY - 20);
    ctx.lineTo(pointerX - 34, pointerY);
    ctx.lineTo(pointerX, pointerY + 20);
    ctx.closePath();

    const pointerGradient = ctx.createLinearGradient(pointerX - 34, pointerY, pointerX, pointerY);
    pointerGradient.addColorStop(0, isDark ? '#ea580c' : '#1f2937');
    pointerGradient.addColorStop(1, isDark ? '#f97316' : '#374151');
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    ctx.strokeStyle = isDark ? '#0f0f0f' : '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pointer highlight
    ctx.beginPath();
    ctx.moveTo(pointerX - 2, pointerY - 14);
    ctx.lineTo(pointerX - 26, pointerY);
    ctx.lineTo(pointerX - 2, pointerY + 14);
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)';
    ctx.fill();
  }, [items, segmentAngle]);

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const container = canvas.parentElement;
      const size = Math.min(container.clientWidth, 400);
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
    const duration = 4500;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smoother easing with quart out
      const eased = 1 - Math.pow(1 - progress, 4);
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
      <div className="w-full max-w-[400px]">
        <canvas ref={canvasRef} className="w-full drop-shadow-xl" />
      </div>

      {items.length === 0 ? (
        <p className="text-stone-500 dark:text-neutral-400 font-medium text-center">
          No contenders on the wheel! Add some places below.
        </p>
      ) : (
        <button
          onClick={spin}
          disabled={spinning || items.length < 2}
          className={`bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-extrabold py-4 px-14 rounded-full text-xl transition-all cursor-pointer shadow-lg hover:shadow-xl ${
            !spinning && !winner && items.length >= 2 ? 'animate-pulse-glow' : ''
          }`}
        >
          {spinning ? 'Here we go...' : items.length < 2 ? 'Need at least 2!' : 'SPIN!'}
        </button>
      )}

      {winner && (
        <div className="text-center animate-fade-in-up">
          <p className="text-3xl font-extrabold text-orange-500">
            {winner.name}
          </p>
          <p className="text-stone-500 dark:text-neutral-400 mt-1 font-medium">The wheel has spoken. Go eat!</p>
        </div>
      )}
    </div>
  );
}
