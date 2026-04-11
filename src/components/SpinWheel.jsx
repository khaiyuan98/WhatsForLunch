import { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = [
  '#FF6B35', '#F7C948', '#2EC4B6', '#E71D36', '#662E9B',
  '#43AA8B', '#F8961E', '#577590', '#F94144', '#90BE6D',
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
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    items.forEach((item, i) => {
      const startAngle = i * segmentAngle + currentRotation;
      const endAngle = startAngle + segmentAngle;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Segment border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, Math.min(14, 160 / items.length))}px sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;

      const label = item.name.length > 18 ? item.name.slice(0, 16) + '...' : item.name;
      ctx.fillText(label, radius - 16, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pointer (right side, pointing left)
    const pointerX = size - 4;
    const pointerY = center;
    ctx.beginPath();
    ctx.moveTo(pointerX, pointerY - 16);
    ctx.lineTo(pointerX - 28, pointerY);
    ctx.lineTo(pointerX, pointerY + 16);
    ctx.closePath();
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [items, segmentAngle]);

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  // Handle canvas resize
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

    // Random 5-8 full rotations + random landing
    const totalRotation = (5 + Math.random() * 3) * 2 * Math.PI;
    const targetRotation = rotation + totalRotation;
    const startTime = performance.now();
    const duration = 4000;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for realistic deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = rotation + totalRotation * eased;

      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(targetRotation);

        // Determine winner: the segment at the pointer (right side = angle 0)
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
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-[400px]">
        <canvas ref={canvasRef} className="w-full" />
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-10 rounded-full text-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 disabled:shadow-none cursor-pointer"
      >
        {spinning ? 'Spinning...' : 'SPIN!'}
      </button>

      {winner && (
        <div className="text-center animate-bounce">
          <p className="text-2xl font-extrabold text-orange-500">
            {winner.name}
          </p>
          <p className="text-gray-500">is what's for lunch!</p>
        </div>
      )}
    </div>
  );
}
