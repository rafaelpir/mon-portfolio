import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
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
