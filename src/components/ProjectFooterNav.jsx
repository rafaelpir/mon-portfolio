import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Bloc "projet précédent / suivant" en pleine largeur, typo XL — pensé
// comme la double page de fin d'un magazine plutôt que deux cartes.
export default function ProjectFooterNav({ previousProject, nextProject, getTitle, isDarkMode }) {
  const { t } = useTranslation(['projects']);
  if (!previousProject && !nextProject) return null;

  const linkClass = `group relative flex flex-col justify-between gap-8 p-8 md:p-16 min-h-[220px] md:min-h-[320px] overflow-hidden transition-colors ${
    isDarkMode ? 'hover:bg-beige/5' : 'hover:bg-black/5'
  }`;

  return (
    <nav
      aria-label={t('projects:details.otherProjects')}
      className={`grid grid-cols-1 md:grid-cols-2 border-t divide-y md:divide-y-0 md:divide-x ${
        isDarkMode ? 'border-beige/20 divide-beige/20' : 'border-black/20 divide-black/20'
      }`}
    >
      {previousProject ? (
        <Link to={`/work/${previousProject.slug}`} className={linkClass}>
          <span className="text-xs tracking-[0.3em] uppercase opacity-40">
            ← {t('projects:details.previous')}
          </span>
          <span
            className="text-3xl md:text-6xl leading-[0.95] font-light transition-transform duration-500 group-hover:-translate-x-2"
            style={{ fontFamily: '"PP Neue Montreal", sans-serif' }}
          >
            {getTitle(previousProject)}
          </span>
        </Link>
      ) : <div />}

      {nextProject ? (
        <Link to={`/work/${nextProject.slug}`} className={`${linkClass} md:text-right md:items-end`}>
          <span className="text-xs tracking-[0.3em] uppercase opacity-40">
            {t('projects:details.next')} →
          </span>
          <span
            className="text-3xl md:text-6xl leading-[0.95] font-light transition-transform duration-500 group-hover:translate-x-2"
            style={{ fontFamily: '"PP Neue Montreal", sans-serif' }}
          >
            {getTitle(nextProject)}
          </span>
        </Link>
      ) : <div />}
    </nav>
  );
}
