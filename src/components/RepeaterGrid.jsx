import React, { useEffect, useRef } from 'react';

const COLS = 22;
const ROWS = 13;

export default function RepeaterGrid({ isDarkMode, className = '' }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, t = 0;

    const resize = () => {
      width  = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width  = width;
      canvas.height = height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      t += 0.022;

      ctx.fillStyle = isDarkMode ? '#080808' : '#f8f6f2';
      ctx.fillRect(0, 0, width, height);

      if (!width || !height) { rafRef.current = requestAnimationFrame(draw); return; }

      const cellW = width  / COLS;
      const cellH = height / ROWS;
      const maxR  = Math.min(cellW, cellH) * 0.40;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cx = (c + 0.5) * cellW;
          const cy = (r + 0.5) * cellH;

          // Deux vagues superposées — crée des motifs d'interférence
          const w1 = Math.sin(t       + c * 0.50 + r * 0.32) * 0.5 + 0.5;
          const w2 = Math.sin(t * 0.7 - c * 0.28 + r * 0.45 + 1.8) * 0.5 + 0.5;
          const v  = (w1 + w2) / 2; // 0 → 1

          const radius = maxR * (0.05 + 0.95 * v);
          const alpha  = 0.06 + 0.50 * v;

          // Teinte légère qui tourne dans le temps
          const hue = isDarkMode
            ? (210 + v * 80 + t * 8) % 360   // bleu → violet → rose
            : (15  + v * 30) % 360;            // ambre chaud (light mode)

          const sat = isDarkMode ? 55 : 75;
          const lit = isDarkMode ? 65 : 50;

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue.toFixed(0)},${sat}%,${lit}%,${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
