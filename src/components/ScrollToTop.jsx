import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/dist/lenis-react';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);
  // `window.lenis` n'est jamais défini par la lib — le hook `useLenis()` lit
  // le store interne (partagé par toute instance <ReactLenis root>, quel
  // que soit l'endroit de l'arbre où elle est montée) et suit l'instance
  // active. Indispensable ici : les pages /work/:slug gardent le même
  // composant (donc la même instance Lenis) d'un projet à l'autre — un
  // simple window.scrollTo(0,0) se fait aussitôt écraser par la boucle
  // d'animation de Lenis, qui ignore ce scroll natif et retombe sur sa
  // propre position cible.
  const lenis = useLenis();

  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    // Si on revient sur l'accueil depuis un projet, scroller vers la section projets
    if (pathname === '/' && (prevPath.startsWith('/work/') || prevPath.startsWith('/project/'))) {
      // Petit délai pour laisser le temps à la page de se charger
      setTimeout(() => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          if (lenis) {
            lenis.scrollTo(projectsSection, { immediate: true });
          } else {
            projectsSection.scrollIntoView({ behavior: 'instant' });
          }
        }
      }, 100);
      return;
    }

    // Ne pas scroll vers le haut quand on revient sur l'accueil depuis une autre page
    if (pathname === '/') return;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback standard (pas de Lenis actif, ex. mobile/tier réduit)
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}
