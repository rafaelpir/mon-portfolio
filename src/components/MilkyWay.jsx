import { useMemo } from 'react';

// Voie lactée légère : semis d'étoiles + bande diagonale plus dense, en
// CSS/SVG pur (pas de WebGL, contrairement à SideRays) pour rester bon
// marché en perf. S'ajoute au-dessus/à côté de GridSparkles et SideRays
// sans les remplacer — juste une couche de plus dans le fond du hero.
//
// Taille en loi de puissance (Math.random() ** 2.4) plutôt qu'uniforme :
// un vrai ciel a une grosse majorité de points minuscules et une poignée
// d'étoiles nettement plus grosses/brillantes — une distribution uniforme
// donne un semis de confettis tous à peu près pareils, pas des étoiles.
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() ** 2.4; // 0..1, tassé vers 0
    stars.push({
      x: Math.random() * 800,
      y: Math.random() * 800,
      r: 0.15 + size * 1.1,
      o: 0.15 + size * 0.55,
      glow: size > 0.55, // seules les plus grosses ont un halo
    });
  }
  return stars;
}

// Pendant clair de la voie lactée : pas un ciel nocturne recoloré (des
// étoiles n'ont aucun sens en plein jour), mais un motif thématiquement
// équivalent — poussière dorée qui scintille dans un rayon de lumière.
// Beaucoup plus éparse que les étoiles (le plein jour est lumineux, pas
// dense), avec une poignée de motes qui "scintillent" (petit éclat en
// croix) plutôt qu'un simple halo flou.
function generateDust(count) {
  const dust = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() ** 2.2;
    dust.push({
      x: Math.random() * 800,
      y: Math.random() * 800,
      r: 0.6 + size * 2.6,
      o: 0.35 + size * 0.5,
      sparkle: size > 0.6,
    });
  }
  return dust;
}

export default function MilkyWay({ className = '', opacity = 0.45, isDarkMode = true }) {
  const stars = useMemo(() => generateStars(170), []);
  const dust = useMemo(() => generateDust(90), []);

  if (!isDarkMode) {
    // Halo radial chaud (source de lumière hors-cadre, coin haut-droit) au
    // lieu de la bande diagonale bleu-violet nocturne. Alphas nettement plus
    // marqués que la version nocturne : sur fond blanc, il faut beaucoup
    // plus de contraste pour qu'un halo doux reste seulement perceptible.
    const glow = 'radial-gradient(ellipse 65% 55% at 82% 8%, rgba(255,190,90,0.30) 0%, rgba(255,190,90,0.14) 40%, transparent 72%)';

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
      <defs>
        <filter id='sparkle' x='-300%' y='-300%' width='700%' height='700%'>
          <feGaussianBlur stdDeviation='0.5' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      ${dust.map(d => {
        const dot = `<circle cx='${d.x.toFixed(1)}' cy='${d.y.toFixed(1)}' r='${d.r.toFixed(2)}' fill='rgba(160,110,30,${d.o.toFixed(2)})'${d.sparkle ? " filter='url(#sparkle)'" : ''} />`;
        if (!d.sparkle) return dot;
        // Petit éclat en croix sur les plus grosses particules, comme un
        // reflet de lumière — pas juste un point plus gros.
        const armLen = d.r * 3.6;
        const cross = `<path d='M${d.x.toFixed(1)} ${(d.y - armLen).toFixed(1)} L${d.x.toFixed(1)} ${(d.y + armLen).toFixed(1)} M${(d.x - armLen).toFixed(1)} ${d.y.toFixed(1)} L${(d.x + armLen).toFixed(1)} ${d.y.toFixed(1)}' stroke='rgba(180,130,40,${(d.o * 0.7).toFixed(2)})' stroke-width='0.6' />`;
        return cross + dot;
      }).join('')}
    </svg>`;
    const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

    return (
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        style={{ opacity: Math.min(1, opacity * 1.8) }}
      >
        <div className="absolute inset-0" style={{ background: glow }} />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: dataUri, backgroundSize: '800px 800px', backgroundRepeat: 'repeat' }}
        />
      </div>
    );
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
    <defs>
      <filter id='glow' x='-300%' y='-300%' width='700%' height='700%'>
        <feGaussianBlur stdDeviation='0.6' result='blur' />
        <feMerge>
          <feMergeNode in='blur' />
          <feMergeNode in='SourceGraphic' />
        </feMerge>
      </filter>
    </defs>
    ${stars.map(s => `<circle cx='${s.x.toFixed(1)}' cy='${s.y.toFixed(1)}' r='${s.r.toFixed(2)}' fill='rgba(255,255,255,${s.o.toFixed(2)})'${s.glow ? " filter='url(#glow)'" : ''} />`).join('')}
  </svg>`;
  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Bande galactique : dégradé diagonal très doux, à peine perceptible */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(-35deg, transparent 20%, rgba(180,190,255,0.03) 44%, rgba(225,215,255,0.06) 50%, rgba(180,190,255,0.03) 56%, transparent 80%)',
        }}
      />
      {/* Étoiles */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dataUri,
          backgroundSize: '800px 800px',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
