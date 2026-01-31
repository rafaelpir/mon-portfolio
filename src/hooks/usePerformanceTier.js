import { useState, useEffect } from 'react';

function computeTier() {
  if (typeof window === 'undefined') return 'full';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'none';
  }

  let score = 2; // 2 = full, 1 = reduced, 0 = none

  const cores = navigator.hardwareConcurrency;
  if (cores !== undefined) {
    if (cores <= 2) score = Math.min(score, 0);
    else if (cores <= 4) score = Math.min(score, 1);
  }

  const memory = navigator.deviceMemory;
  if (memory !== undefined) {
    if (memory <= 1) score = Math.min(score, 0);
    else if (memory <= 2) score = Math.min(score, 1);
  }

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
