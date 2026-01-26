import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    // Si on revient sur l'accueil depuis un projet, scroller vers la section projets
    if (pathname === '/' && prevPath.startsWith('/project/')) {
      // Petit délai pour laisser le temps à la page de se charger
      setTimeout(() => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          const lenis = window.lenis;
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

    // Support pour Lenis smooth scroll
    const lenis = window.lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback standard
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
