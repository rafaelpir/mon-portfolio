import React, { useEffect, useRef } from 'react';

const GRAIN_SIZE = 180;

function makeGrain(gctx) {
  const img = gctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  const d   = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  gctx.putImageData(img, 0, 0);
}

export default function NoisyGradient({ isDarkMode, className = '' }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = grainCanvas.height = GRAIN_SIZE;
    const gctx = grainCanvas.getContext('2d');
    makeGrain(gctx);

    let width = 0, height = 0, t = 0, frame = 0;

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
      t += 0.004;
      frame++;

      if (!width || !height) { rafRef.current = requestAnimationFrame(draw); return; }

      // Fond
      ctx.fillStyle = isDarkMode ? '#0d0a08' : '#f9f5f1';
      ctx.fillRect(0, 0, width, height);

      // Centre du blob — dérive lentement
      const cx = width  * (0.50 + Math.sin(t * 0.38) * 0.07);
      const cy = height * (0.52 + Math.cos(t * 0.28) * 0.07);
      const R  = Math.min(width, height) * (isDarkMode ? 0.52 : 0.48);

      // Pulsation légère du rayon
      const pulse = 1 + Math.sin(t * 0.6) * 0.06;
      const r = R * pulse;

      const alpha = isDarkMode ? 0.90 : 0.82;

      // Blob 1 — Rose / Magenta (haut)
      {
        const ox = cx + Math.sin(t * 0.5 + 1.2) * r * 0.06;
        const oy = cy - r * 0.18 + Math.cos(t * 0.4) * r * 0.06;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r * 1.05);
        g.addColorStop(0,    `rgba(228, 52, 138, ${alpha})`);
        g.addColorStop(0.45, `rgba(228, 52, 138, ${(alpha * 0.4).toFixed(2)})`);
        g.addColorStop(1,    `rgba(228, 52, 138, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Blob 2 — Corail / Orange (centre)
      {
        const ox = cx + Math.cos(t * 0.45 + 0.8) * r * 0.08;
        const oy = cy + Math.sin(t * 0.35 + 2.0) * r * 0.05;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r * 0.95);
        g.addColorStop(0,    `rgba(242, 88, 50, ${alpha})`);
        g.addColorStop(0.45, `rgba(242, 88, 50, ${(alpha * 0.38).toFixed(2)})`);
        g.addColorStop(1,    `rgba(242, 88, 50, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Blob 3 — Jaune chaud / Pêche (bas)
      {
        const ox = cx + Math.sin(t * 0.32 + 3.5) * r * 0.07;
        const oy = cy + r * 0.22 + Math.cos(t * 0.42 + 1.0) * r * 0.06;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r * 1.0);
        g.addColorStop(0,    `rgba(255, 188, 88, ${alpha})`);
        g.addColorStop(0.45, `rgba(255, 188, 88, ${(alpha * 0.36).toFixed(2)})`);
        g.addColorStop(1,    `rgba(255, 188, 88, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Grain — rafraîchi toutes les 3 frames
      if (frame % 3 === 0) makeGrain(gctx);

      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = isDarkMode ? 0.20 : 0.28;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

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
