import { useState, useEffect } from 'react';

// Opera (desktop et mobile) saccade en tier 'full' : le scroll virtuel Lenis
// combiné aux shaders WebGL plein écran (SideRays) sature son compositeur,
// même sur des machines puissantes où Chrome/Firefox restent fluides.
function isOpera() {
  if (typeof navigator === 'undefined') return false;
  return /OPR\/|Opera|OPX\//.test(navigator.userAgent);
}

function computeTier() {
  if (typeof window === 'undefined') return 'full';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'none';
  }

  // 'none' est réservé à la préférence d'accessibilité ci-dessus : un
  // hardware faible dégrade au pire jusqu'à 'reduced', jamais 'none' — sinon
  // des animations légères (ex. carrousel de compétences) se figeaient sur
  // les mobiles bas/moyen de gamme (deviceMemory ou cores faibles) alors que
  // l'utilisateur n'a jamais demandé de mouvement réduit.
  let score = 2; // 2 = full, 1 = reduced

  const cores = navigator.hardwareConcurrency;
  if (cores !== undefined && cores <= 4) score = Math.min(score, 1);

  const memory = navigator.deviceMemory;
  if (memory !== undefined && memory <= 2) score = Math.min(score, 1);

  if (isOpera()) score = Math.min(score, 1);

  return ['none', 'reduced', 'full'][score];
}

export default function usePerformanceTier() {
  const [tier, setTier] = useState(computeTier);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setTier(computeTier());
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return tier;
}
