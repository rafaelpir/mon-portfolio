import { useEffect } from 'react';

// Apparitions au défilement sur téléphone : chaque élément marqué
// `data-m-reveal` monte légèrement en fondu quand il entre à l'écran (une
// seule fois). Animation portée par le processeur graphique (opacité et
// translation), déclenchée par un observateur : aucun calcul pendant le
// défilement. La classe `m-reveal-on` sur <html> active les styles ; sans
// elle (script absent, mouvement réduit), tout reste visible.
export default function useMobileReveal(enabled, dependency) {
  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const root = document.documentElement;
    root.classList.add('m-reveal-on');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('m-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    document.querySelectorAll('[data-m-reveal]:not(.m-in)').forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove('m-reveal-on');
    };
  }, [enabled, dependency]);
}
