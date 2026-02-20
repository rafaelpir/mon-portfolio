import { Link, useLocation } from 'react-router-dom';

const pages = [
  { path: '/cv', label: 'CV' },
  { path: '/lettre-motivation-graphiste', label: 'Lettre Motivation' },
  { path: '/lettre-carjack-films', label: 'Carjack Films' },
  { path: '/lettre-paname-art-cafe', label: 'Paname Art Café' },
  { path: '/lettre-regie-plateau', label: 'Régie Plateau' },
  { path: '/lettre-preparateur-commande', label: 'Préparateur Commande' },
  { path: '/cv-en', label: 'CV (EN)' },
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
