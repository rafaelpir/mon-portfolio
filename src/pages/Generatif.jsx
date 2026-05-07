import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function seededRng(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

// ─── Color helpers ────────────────────────────────────────────────────────────
const PALETTES = {
  thermal: ['#050014', '#0a0060', '#2200ff', '#9900cc', '#ff3300', '#ff1100', '#ffdd00'],
  piral:   ['#080200', '#1a0600', '#4a1000', '#cc3300', '#ff6b00', '#ffb55a', '#E8DCC4'],
  mono:    ['#050505', '#141414', '#323232', '#606060', '#909090', '#c0c0c0', '#eeeeee'],
  neon:    ['#000308', '#001525', '#003060', '#0055cc', '#00aaff', '#00eeff', '#ccffff'],
};

function hexToRgb(hex) {
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}

function paletteAt(colors, t) {
  const n = colors.length - 1;
  const clamped = Math.max(0, Math.min(1, t));
  const i = Math.min(Math.floor(clamped * n), n - 1);
  const f = clamped * n - i;
  const a = hexToRgb(colors[i]);
  const b = hexToRgb(colors[Math.min(i+1, n)]);
  return `rgb(${Math.round(a.r+(b.r-a.r)*f)},${Math.round(a.g+(b.g-a.g)*f)},${Math.round(a.b+(b.b-a.b)*f)})`;
}

// ─── Shape drawing ────────────────────────────────────────────────────────────
function shapePath(ctx, type, size) {
  ctx.beginPath();
  switch (type) {
    case 'Triangle':
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.5, -size * 0.866);
      ctx.lineTo(-size * 0.5,  size * 0.866);
      break;
    case 'Circle':
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      break;
    case 'Diamond':
      ctx.moveTo(0, -size); ctx.lineTo(size * 0.65, 0);
      ctx.lineTo(0,  size); ctx.lineTo(-size * 0.65, 0);
      break;
    case 'Square':
      ctx.rect(-size * 0.75, -size * 0.75, size * 1.5, size * 1.5);
      break;
    case 'Star':
      for (let i = 0; i < 5; i++) {
        const oa = (i * 72 - 90) * Math.PI / 180;
        const ia = ((i * 72 + 36) - 90) * Math.PI / 180;
        if (i === 0) ctx.moveTo(Math.cos(oa)*size, Math.sin(oa)*size);
        else         ctx.lineTo(Math.cos(oa)*size, Math.sin(oa)*size);
        ctx.lineTo(Math.cos(ia)*size*0.38, Math.sin(ia)*size*0.38);
      }
      break;
    default:
      ctx.arc(0, 0, size, 0, Math.PI * 2);
  }
  ctx.closePath();
}

// ─── Poster renderer ──────────────────────────────────────────────────────────
function renderPoster(canvas, p, angle) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const palette = PALETTES[p.palette] || PALETTES.thermal;

  const dark = p.bgMode !== 'light';
  const bg   = dark ? '#000000' : '#f0eeea';
  const fg   = dark ? '#ffffff' : '#000000';
  const dim  = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const bx      = W * 0.045;
  const titlePx = Math.floor(W * 0.215);
  const metaPx  = Math.floor(W * 0.023);
  const lh      = metaPx * 1.65;

  // ─── Title (top) ────────────────────────────────────────────────────────────
  const titleY = titlePx * 1.02;
  ctx.fillStyle = fg;
  ctx.font = `900 ${titlePx}px "Arial Black", Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('PIRAL', bx, titleY);

  // ─── Top metadata row ───────────────────────────────────────────────────────
  ctx.font = `${metaPx}px "Courier New", monospace`;
  ctx.fillStyle = dim;
  const metaTopY = titleY + lh * 1.4;
  ctx.fillText(`SHAPE: ${p.shapeType.toUpperCase()}`, bx, metaTopY);
  ctx.fillText(`AMOUNT: ${p.formsAmount}`,            bx, metaTopY + lh);
  ctx.fillText(`SIZE: ${p.formSize}`,                 bx, metaTopY + lh * 2);
  ctx.textAlign = 'right';
  ctx.fillText('VERSION', W - bx, metaTopY);
  ctx.fillText('0.16',    W - bx, metaTopY + lh);
  ctx.textAlign = 'left';

  // ─── Shapes zone (middle) ───────────────────────────────────────────────────
  const shapesTop = metaTopY + lh * 4;
  const shapesH   = H * 0.30;
  const rand = seededRng(p.noiseSeed);

  const forms = Array.from({ length: p.formsAmount }, () => {
    const cx = p.formsAmount === 1 ? W * 0.50 : W * (0.15 + rand() * 0.7);
    const cy = p.formsAmount === 1 ? shapesTop + shapesH * 0.50 : shapesTop + rand() * shapesH;
    const sz = W * 0.38 * (p.formSize / 100) * (1 + (rand() - 0.5) * p.randomSize / 50);
    const da = rand() * p.randomAngle * 2 - p.randomAngle;
    return { cx, cy, sz, a: angle + da };
  });

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, shapesTop - shapesH * 0.1, W, shapesH * 1.2);
  ctx.clip();
  for (const f of forms) {
    ctx.save();
    ctx.translate(f.cx, f.cy);
    ctx.rotate((f.a * Math.PI) / 180);
    const layers = Math.max(20, p.gradLayers);
    const gamma  = p.multiplier / 9;
    for (let i = layers; i >= 0; i--) {
      const t    = i / layers;
      const size = f.sz * (p.endSize + (p.startSize - p.endSize) * t);
      ctx.fillStyle = paletteAt(palette, 1 - Math.pow(t, gamma));
      shapePath(ctx, p.shapeType, size);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();

  // ─── Middle metadata ─────────────────────────────────────────────────────────
  const midY  = shapesTop + shapesH * 1.15;
  const col2  = W * 0.50;

  ctx.font = `${metaPx}px "Courier New", monospace`;
  ctx.fillStyle = dim;

  ctx.fillText(`NOISE SEED: ${p.noiseSeed}`, bx, midY);
  ctx.fillText(`SPACING X: 0`,              col2, midY);
  ctx.fillText(`SPACING Y: 0`,              col2, midY + lh);

  // ─── Animation block + waveform ─────────────────────────────────────────────
  const animY = midY + lh * 3.5;
  ctx.fillText(`ANIMATION: ${p.animSpeed}`,     bx, animY);
  ctx.fillText(`GRAD LAYERS: ${p.gradLayers}`,  bx, animY + lh);
  ctx.fillText(`MULTIPLIER: ${p.multiplier}`,   bx, animY + lh * 2);

  // Waveform diagram
  const wfCx = col2 + W * 0.10;
  const wfCy = animY + lh;
  const wfW  = W * 0.30;
  const wfH  = lh * 2.2;
  // Horizontal axis
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(wfCx - wfW / 2, wfCy);
  ctx.lineTo(wfCx + wfW / 2, wfCy);
  ctx.stroke();
  // Dotted sine curve
  const wfColor = dark ? '#ff4444' : '#cc0000';
  ctx.fillStyle = wfColor;
  const wfPts = 18;
  for (let i = 0; i <= wfPts; i++) {
    const tx = i / wfPts;
    const x  = wfCx - wfW / 2 + tx * wfW;
    const y  = wfCy - Math.sin(tx * Math.PI) * wfH * 0.55;
    const r  = metaPx * 0.32;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // ─── Motion block + crosshair circle ────────────────────────────────────────
  const motY = animY + lh * 4.5;
  ctx.font = `${metaPx}px "Courier New", monospace`;
  ctx.fillStyle = dim;
  ctx.fillText(`MOTION SPEED: ${p.motionSpeed}`,          bx, motY);
  ctx.fillText(`AREA RADIUS: ${p.areaRadius}`,            bx, motY + lh);
  ctx.fillText(`CONSTRAINT: 0`,                           bx, motY + lh * 2);
  ctx.fillText(`BASE ANGLE: ${Math.round(angle % 360)}`,  bx, motY + lh * 3);

  // Crosshair + circle
  const crCx = col2 + W * 0.12;
  const crCy = motY + lh * 1.8;
  const crR  = lh * 1.6;
  const lineColor = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const circleColor = dark ? '#ff4444' : '#cc0000';
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(crCx - crR * 1.4, crCy); ctx.lineTo(crCx + crR * 1.4, crCy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(crCx, crCy - crR * 1.4); ctx.lineTo(crCx, crCy + crR * 1.4); ctx.stroke();
  ctx.strokeStyle = circleColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(crCx, crCy, crR, 0, Math.PI * 2); ctx.stroke();
  // Small dot on circle top
  ctx.fillStyle = circleColor;
  ctx.beginPath(); ctx.arc(crCx, crCy - crR, metaPx * 0.38, 0, Math.PI * 2); ctx.fill();

  // ─── Color dots (bottom) ────────────────────────────────────────────────────
  const dotY = H - lh * 5.5;
  [['#8b0000',':RED'], ['#006400',':GREEN'], ['#00008b',':BLUE']].forEach(([color, label], i) => {
    const dy = dotY + i * lh * 1.3;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(bx + metaPx * 0.5, dy - metaPx * 0.35, metaPx * 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = dim;
    ctx.font = `${metaPx}px "Courier New", monospace`;
    ctx.fillText(label, bx + metaPx * 1.8, dy);
  });

  // Brand bottom-right
  ctx.textAlign = 'right';
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  ctx.fillText(`→ ${new Date().getFullYear()}`, W - bx, H - lh * 1.4);
  ctx.fillText('RAFAELPIRAL',                  W - bx, H - lh * 0.2);
}

// ─── Default params ───────────────────────────────────────────────────────────
const DEFAULTS = {
  shapeType: 'Triangle', formsAmount: 1, formSize: 100, gradLayers: 154,
  animSpeed: 15, multiplier: 9, motionSpeed: 23, noiseSeed: 328,
  palette: 'thermal', randomAngle: 0, randomSize: 0, startSize: 1.0, endSize: 0.01,
  bgMode: 'dark', areaRadius: 0,
};

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step = 1, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[11px] text-gray-400 w-28 flex-shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-[3px] accent-orange-500 cursor-pointer" />
      <span className="text-[11px] text-gray-300 w-10 text-right tabular-nums">
        {Number.isInteger(value) ? value : value.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="border-t border-white/10 pt-3 mt-1">
      <p className="text-[10px] tracking-widest text-gray-500 mb-3">{title}</p>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Generatif() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const animRef      = useRef(null);
  const angleRef     = useRef(0);
  const lastTRef     = useRef(null);
  const paramsRef    = useRef(DEFAULTS);

  const [params, setParams] = useState(DEFAULTS);
  useEffect(() => { paramsRef.current = params; }, [params]);

  const set = key => val => setParams(p => ({ ...p, [key]: val }));

  // Responsive canvas
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;
    const resize = () => {
      const w = container.offsetWidth;
      canvas.width  = w;
      canvas.height = Math.round(w * 1.414);
      renderPoster(canvas, paramsRef.current, angleRef.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // RAF animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const loop = ts => {
      if (lastTRef.current === null) lastTRef.current = ts;
      const dt = Math.min((ts - lastTRef.current) / 1000, 0.1);
      lastTRef.current = ts;
      if (paramsRef.current.animSpeed > 0)
        angleRef.current += paramsRef.current.animSpeed * dt * 0.8;
      renderPoster(canvas, paramsRef.current, angleRef.current);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); lastTRef.current = null; };
  }, []);

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `piral-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }, []);

  const handleReset = () => { setParams(DEFAULTS); angleRef.current = 0; };

  const SHAPE_TYPES = ['Triangle', 'Circle', 'Diamond', 'Square', 'Star'];
  const PALETTE_LABELS = { thermal: 'Thermal', piral: 'Piral', mono: 'Mono', neon: 'Neon' };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row font-mono">

      {/* ── Poster ── */}
      <div className="flex-1 flex items-start justify-center p-4 md:p-10">
        <div className="w-full max-w-sm md:max-w-md">
          {/* Back link */}
          <Link to="/" className="inline-block text-[10px] tracking-widest text-gray-600 hover:text-gray-400 mb-4 transition-colors">
            ← RETOUR
          </Link>
          <div ref={containerRef} className="w-full">
            <canvas ref={canvasRef} className="w-full block" style={{ imageRendering: 'auto' }} />
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="w-full md:w-72 bg-[#1a1a1a] border-t md:border-t-0 md:border-l border-white/10 flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 tracking-widest">GÉNÉRATEUR (PIRAL)</span>
          <span className="text-[10px] text-gray-600">0.1</span>
        </div>

        <div className="px-4 py-3 space-y-1 flex-1">

          {/* Actions */}
          <div className="flex gap-2 mb-3">
            <button onClick={handleReset}
              className="flex-1 text-[11px] py-1.5 bg-white/8 hover:bg-white/15 text-gray-400 rounded transition-colors">
              Réinitialiser
            </button>
            <button onClick={handleExport}
              className="flex-1 text-[11px] py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors">
              Exporter PNG
            </button>
          </div>

          <Section title="FOND">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {[['dark','Sombre'], ['light','Clair']].map(([key, label]) => (
                <button key={key} onClick={() => set('bgMode')(key)}
                  className={`text-[10px] py-1 rounded transition-colors ${params.bgMode === key ? 'bg-orange-600 text-white' : 'bg-white/8 text-gray-400 hover:bg-white/15'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="COULEURS">
            <div className="grid grid-cols-4 gap-1">
              {Object.entries(PALETTE_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => set('palette')(key)}
                  className={`text-[10px] py-1 rounded transition-colors ${params.palette === key ? 'bg-orange-600 text-white' : 'bg-white/8 text-gray-400 hover:bg-white/15'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="FORME">
            <div className="grid grid-cols-3 gap-1">
              {SHAPE_TYPES.map(s => (
                <button key={s} onClick={() => set('shapeType')(s)}
                  className={`text-[10px] py-1 rounded transition-colors ${params.shapeType === s ? 'bg-orange-600 text-white' : 'bg-white/8 text-gray-400 hover:bg-white/15'}`}>
                  {s}
                </button>
              ))}
            </div>
          </Section>

          <Section title="FORMS">
            <Slider label="Quantité"       value={params.formsAmount}  min={1}   max={8}    onChange={set('formsAmount')} />
            <Slider label="Taille"         value={params.formSize}     min={20}  max={160}  onChange={set('formSize')} />
            <Slider label="Angle aléat."   value={params.randomAngle}  min={0}   max={180}  onChange={set('randomAngle')} />
            <Slider label="Taille aléat."  value={params.randomSize}   min={0}   max={100}  onChange={set('randomSize')} />
            <Slider label="Taille départ"  value={params.startSize}    min={0.1} max={2.0} step={0.05} onChange={set('startSize')} />
            <Slider label="Taille fin"     value={params.endSize}      min={0.0} max={0.5} step={0.01} onChange={set('endSize')} />
          </Section>

          <Section title="DÉGRADÉ">
            <Slider label="Couches"        value={params.gradLayers}   min={10}  max={300}  onChange={set('gradLayers')} />
            <Slider label="Multiplicateur" value={params.multiplier}   min={1}   max={20}   onChange={set('multiplier')} />
          </Section>

          <Section title="ANIMATION">
            <Slider label="Vitesse"        value={params.animSpeed}    min={0}   max={60}   onChange={set('animSpeed')} />
            <Slider label="Motion speed"   value={params.motionSpeed}  min={0}   max={60}   onChange={set('motionSpeed')} />
            <Slider label="Area radius"    value={params.areaRadius}   min={0}   max={200}  onChange={set('areaRadius')} />
          </Section>

          <Section title="NOISE SEED">
            <Slider label="Seed" value={params.noiseSeed} min={1} max={999} onChange={set('noiseSeed')} />
          </Section>

        </div>
      </div>
    </div>
  );
}
