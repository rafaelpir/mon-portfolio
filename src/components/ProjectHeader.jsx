import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

// Header minimal des pages projet, aligné sur celui de la home. Rendu via
// portail attaché à <html> — même contrainte que sur Home.jsx : `body` a
// `transform: translateZ(0)` en desktop (perf Lenis), ce qui casse
// `position: fixed` pour tout descendant normal de <body>.
export default function ProjectHeader({ isDarkMode, index, total }) {
  const { t } = useTranslation(['projects']);
  const [portalNode, setPortalNode] = useState(null);

  useEffect(() => {
    const node = document.createElement('div');
    document.documentElement.appendChild(node);
    setPortalNode(node);
    return () => document.documentElement.removeChild(node);
  }, []);

  if (!portalNode) return null;

  return createPortal(
    // backdrop-blur : le fond quasi transparent (5%) laissait le contenu qui
    // défile dessous se mélanger visuellement au logo/nav — sur mobile en
    // particulier, du texte pouvait se retrouver à se superposer lettre sur
    // lettre avec "RP" à certaines positions de scroll. Le flou garde
    // l'aspect minimal tout en assurant la lisibilité du header.
    <header className={`fixed top-0 left-0 right-0 z-[110] px-4 md:px-8 py-2 md:py-3 backdrop-blur-sm transition-colors duration-300 ${
      isDarkMode ? 'bg-black/5' : 'bg-beige/5'
    }`}>
      <div className="w-full flex items-center justify-between">
        <Logo isDarkMode={isDarkMode} />

        <div className="flex items-center gap-4 md:gap-8">
          <Link
            to="/#projects"
            className={`flex items-center gap-1.5 text-xs md:text-sm tracking-widest uppercase transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-beige' : 'text-gray-700 hover:text-black'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 25 25" fill="currentColor" aria-hidden="true">
              <path d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" />
            </svg>
            <span className="hidden sm:inline">{t('projects:details.back')}</span>
          </Link>
          {typeof index === 'number' && typeof total === 'number' && (
            <span className={`text-xs md:text-sm tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    </header>,
    portalNode
  );
}
