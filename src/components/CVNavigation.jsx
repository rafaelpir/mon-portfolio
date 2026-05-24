import { Link, useLocation } from 'react-router-dom';

const pages = [
  { path: '/cv', label: 'CV' },
  { path: '/lettre-motivation-graphiste', label: 'Lettre Motivation' },
  { path: '/lettre-charge-com-digitale', label: 'Chargé Com Digitale' },
  { path: '/lettre-carjack-films', label: 'Carjack Films' },
  { path: '/lettre-paname-art-cafe', label: 'Paname Art Café' },
  { path: '/lettre-regie-plateau', label: 'Régie Plateau' },
  { path: '/lettre-preparateur-commande', label: 'Préparateur Commande' },
  { path: '/lettre-club-foot', label: 'Club Foot' },
  { path: '/lettre-assistant-technique-av', label: 'Assistant Technique AV' },
  { path: '/lettre-assistant-son-plateau', label: 'Assistant Son Plateau' },
  { path: '/lettre-27e-region', label: '27e Région' },
  { path: '/lettre-puc', label: 'PUC' },
  { path: '/email-candidature', label: 'Email' },
  { path: '/cv-en', label: 'CV (EN)' },
  { path: '/cv-interim', label: 'CV Intérim' },
  { path: '/cover-letter', label: 'Cover Letter (EN)' },
];

export default function CVNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="no-print mx-auto mb-6 flex flex-wrap items-center justify-center gap-2" style={{ maxWidth: '21cm' }}>
      {pages.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            pathname === path
              ? 'bg-black text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
