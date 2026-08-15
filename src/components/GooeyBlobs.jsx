import { useRef, useEffect } from 'react';

const BLOBS = [
  { ax: 0.38, ay: 0.42, r: 140, phaseX: 0.0, phaseY: 1.1, speedX: 0.32, speedY: 0.25 },
  { ax: 0.60, ay: 0.52, r: 170, phaseX: 2.1, phaseY: 0.6, speedX: 0.22, speedY: 0.36 },
  { ax: 0.50, ay: 0.30, r: 110, phaseX: 4.2, phaseY: 3.0, speedX: 0.40, speedY: 0.28 },
  { ax: 0.28, ay: 0.62, r: 125, phaseX: 1.5, phaseY: 2.7, speedX: 0.27, speedY: 0.33 },
  { ax: 0.74, ay: 0.38, r:  95, phaseX: 3.3, phaseY: 1.8, speedX: 0.46, speedY: 0.21 },
  { ax: 0.55, ay: 0.70, r: 105, phaseX: 5.1, phaseY: 0.4, speedX: 0.35, speedY: 0.44 },
];

export default function GooeyBlobs({ opacity = 0.18, blur = 22, threshold = 20, className = '' }) {
  const svgRef     = useRef(null);
  const circlesRef = useRef([]);
  const rafRef     = useRef(null);

  useEffect(() => {
    let t = 0;

    const animate = () => {
      t += 0.007;
      const svg = svgRef.current;
      if (!svg) { rafRef.current = requestAnimationFrame(animate); return; }

      const W = svg.clientWidth;
      const H = svg.clientHeight;

      BLOBS.forEach((b, i) => {
        const el = circlesRef.current[i];
        if (!el) return;
        const cx = (b.ax + Math.sin(t * b.speedX + b.phaseX) * 0.20) * W;
        const cy = (b.ay + Math.cos(t * b.speedY + b.phaseY) * 0.18) * H;
        el.setAttribute('cx', cx.toFixed(1));
        el.setAttribute('cy', cy.toFixed(1));
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const matrix = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${threshold} -${Math.round(threshold * 0.4)}`;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ filter: 'url(#goo-filter)' }}
      >
        <defs>
          <filter id="goo-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values={matrix} result="goo" />
            <feComposite in="goo" in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>

        {BLOBS.map((b, i) => (
          <circle
            key={i}
            ref={el => { circlesRef.current[i] = el; }}
            r={b.r}
            fill="white"
            fillOpacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
}
