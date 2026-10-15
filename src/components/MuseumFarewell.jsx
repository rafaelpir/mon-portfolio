import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';

// Mot d'au revoir à la sortie du musée (arrivée sur l'accueil avec
// state.fromMuseum), qui propose d'écrire. Attaché à <html> : le transform du
// body casserait position: fixed.
export default function MuseumFarewell({ lang = 'fr', onContact }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState(null);

  useEffect(() => {
    const element = document.createElement('div');
    document.documentElement.appendChild(element);
    setNode(element);
    return () => element.remove();
  }, []);

  useEffect(() => {
    if (!location.state?.fromMuseum) return undefined;
    // l'état est consommé : un rechargement ne remontre pas le message
    window.history.replaceState({ ...window.history.state, usr: null }, '');
    const show = setTimeout(() => setVisible(true), 1400);
    const hide = setTimeout(() => setVisible(false), 12000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [location.state]);

  if (!node) return null;
  return createPortal(
    <div className={`museum-farewell ${visible ? 'is-visible' : ''}`} role="status" aria-hidden={!visible}>
      <p className="museum-farewell-title">{lang === 'en' ? 'Thanks for visiting.' : 'Merci de votre visite.'}</p>
      <p className="museum-farewell-text">
        {lang === 'en' ? 'A poster, an identity or a site in mind?' : 'Une affiche, une identité ou un site en tête ?'}
      </p>
      <div className="museum-farewell-actions">
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => {
            setVisible(false);
            onContact?.();
          }}
        >
          {lang === 'en' ? 'Get in touch' : 'Écrivez-moi'} →
        </button>
        <button type="button" tabIndex={visible ? 0 : -1} onClick={() => setVisible(false)} aria-label={lang === 'en' ? 'Close' : 'Fermer'}>
          ✕
        </button>
      </div>
    </div>,
    node
  );
}
