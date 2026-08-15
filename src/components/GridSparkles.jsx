// Fond décoratif statique : grille fine avec un éclat lumineux à chaque intersection.
export default function GridSparkles({ isDarkMode = true, cell = 150, opacity = 0.7, className = '' }) {
  const lineColor = isDarkMode ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)';
  const dotColor = isDarkMode ? '#ffffff' : '#000000';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${cell}' height='${cell}'>
    <line x1='0' y1='0' x2='${cell}' y2='0' stroke='${lineColor}' stroke-width='1' stroke-dasharray='1 3' />
    <line x1='0' y1='0' x2='0' y2='${cell}' stroke='${lineColor}' stroke-width='1' stroke-dasharray='1 3' />
    <defs>
      <filter id='glow' x='-200%' y='-200%' width='500%' height='500%'>
        <feGaussianBlur stdDeviation='1.4' result='blur' />
        <feMerge>
          <feMergeNode in='blur' />
          <feMergeNode in='SourceGraphic' />
        </feMerge>
      </filter>
    </defs>
    <circle cx='0' cy='0' r='2.5' fill='${dotColor}' filter='url(#glow)' />
  </svg>`;

  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const vignette = 'radial-gradient(ellipse at center, black 0%, black 35%, transparent 75%)';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: dataUri,
        backgroundSize: `${cell}px ${cell}px`,
        backgroundPosition: 'center',
        opacity,
        WebkitMaskImage: vignette,
        maskImage: vignette,
      }}
    />
  );
}
