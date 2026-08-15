import React, { useEffect, useRef } from 'react';

const SPACING = 18;
const MAX_R = 3.5;
const MOUSE_RADIUS = 140;
const MOUSE_STRENGTH = 0.65;

// Palette HSL : bleu électrique → violet → rose → ambre → teal
const PALETTE = [
  [210, 90, 62],
  [260, 78, 65],
  [310, 72, 62],
  [35,  95, 62],
  [175, 80, 52],
];

function getColor(nx, ny, t, lum) {
  const raw = Math.sin(nx * 2.8 + ny * 2.0 + t * 0.55) * 0.5 + 0.5;
  const idx  = raw * (PALETTE.length - 1);
  const i    = Math.floor(idx) % PALETTE.length;
  const j    = (i + 1) % PALETTE.length;
  const f    = idx - Math.floor(idx);

  const [h1, s1, l1] = PALETTE[i];
  const [h2, s2, l2] = PALETTE[j];

  const h = h1 + (h2 - h1) * f;
  const s = s1 + (s2 - s1) * f;
  const l = (l1 + (l2 - l1) * f) * (0.25 + lum * 0.75);

  return `hsl(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%)`;
}

function luminance(nx, ny, t) {
  const v =
    Math.sin(nx * 5.0 * Math.PI + t * 1.3) * 0.26 +
    Math.sin(ny * 4.0 * Math.PI - t * 0.95) * 0.26 +
    Math.sin((nx + ny) * 6.5 * Math.PI + t * 1.6) * 0.24 +
    Math.sin((nx - ny) * 3.0 * Math.PI + t * 0.75) * 0.24;
  return (v + 1) / 2;
}

export default function LuminanceDots({ isDarkMode, className = '' }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

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

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height)
        ? { x, y }
        : { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove);

    const mr2 = MOUSE_RADIUS * MOUSE_RADIUS;

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);

      if (!width || !height) { rafRef.current = requestAnimationFrame(draw); return; }

      const cols = Math.ceil(width  / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const { x: mx, y: my } = mouseRef.current;

      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const px = col * SPACING - SPACING / 2;
          const py = row * SPACING - SPACING / 2;

          const nx = px / width;
          const ny = py / height;

          const base  = luminance(nx, ny, t);
          const dx    = px - mx;
          const dy    = py - my;
          const mouse = Math.exp(-(dx * dx + dy * dy) / (2 * mr2)) * MOUSE_STRENGTH;
          const lum   = Math.min(1, base + mouse);

          if (lum < 0.07) continue;

          const r = lum * MAX_R;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = getColor(nx, ny, t, lum);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
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
