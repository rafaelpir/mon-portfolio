import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant Google Analytics 4
 * Tracks page views et permet le suivi des performances du site
 */
const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Si pas d'ID configuré, ne rien faire
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      console.log('Google Analytics: ID de mesure non configuré');
      return;
    }

    // Charger le script Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialiser gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      anonymize_ip: true, // RGPD compliant
    });

    console.log('Google Analytics initialisé:', GA_MEASUREMENT_ID);

    return () => {
      // Cleanup si nécessaire
      const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`);
      scripts.forEach(s => s.remove());
    };
  }, [GA_MEASUREMENT_ID]);

  // Track les changements de page
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
      console.log('GA Page view:', location.pathname);
    }
  }, [location, GA_MEASUREMENT_ID]);

  return null; // Ce composant ne rend rien visuellement
};

export default GoogleAnalytics;
