import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import ProjectHeader from '../components/ProjectHeader';
import ProjectSectionDivider from '../components/ProjectSectionDivider';
import ProjectFooterNav from '../components/ProjectFooterNav';
import ImageLightbox from '../components/ImageLightbox';

function SubProjectGallery({ subProject, isDarkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const gallery = subProject.gallery || [];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));

  if (gallery.length === 0) return null;

  return (
    <div className="mt-8">
      {/* Image · hauteur fixe */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ maxWidth: '460px', height: '420px' }}
      >
        <img
          src={gallery[currentIndex].src}
          alt={gallery[currentIndex].description || `${subProject.title} — Image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          style={{ cursor: isMobile ? 'default' : 'zoom-in' }}
          draggable={false}
          role={isMobile ? undefined : 'button'}
          tabIndex={isMobile ? undefined : 0}
          onClick={isMobile ? undefined : () => setExpanded(true)}
          onKeyDown={isMobile ? undefined : (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(true); }
          }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
          onTouchEnd={() => {
            const diff = touchStartX.current - touchEndX.current;
            if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
            touchStartX.current = 0;
            touchEndX.current = 0;
          }}
        />
      </div>

      {expanded && (
        <ImageLightbox
          src={gallery[currentIndex].src}
          alt={gallery[currentIndex].description || `${subProject.title} — Image ${currentIndex + 1}`}
          onClose={() => setExpanded(false)}
          onPrev={gallery.length > 1 ? handlePrev : undefined}
          onNext={gallery.length > 1 ? handleNext : undefined}
          counter={gallery.length > 1 ? `${currentIndex + 1} / ${gallery.length}` : undefined}
        />
      )}

      {/* Boutons + compteur · hauteur fixe, jamais déplacés */}
      {gallery.length > 1 && (
        <div className="flex items-center justify-between mt-3" style={{ height: '36px', maxWidth: '460px', margin: '12px auto 0' }}>
          <button
            onClick={handlePrev}
            className={`hidden md:flex items-center justify-center p-2 rounded-full border transition-colors ${
              isDarkMode
                ? 'border-beige/20 hover:border-beige hover:bg-beige/10'
                : 'border-black/20 hover:border-black hover:bg-black/10'
            }`}
            aria-label="Image précédente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs opacity-40 tracking-widest uppercase">Fig. {String(currentIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>
          <button
            onClick={handleNext}
            className={`hidden md:flex items-center justify-center p-2 rounded-full border transition-colors ${
              isDarkMode
                ? 'border-beige/20 hover:border-beige hover:bg-beige/10'
                : 'border-black/20 hover:border-black hover:bg-black/10'
            }`}
            aria-label="Image suivante"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Description · hauteur fixe pour éviter tout déplacement */}
      <div style={{ height: '4rem', overflow: 'hidden', marginTop: '8px', maxWidth: '460px', margin: '8px auto 0' }}>
        {gallery[currentIndex].description && (
          <p className="text-center text-sm opacity-60">
            {gallery[currentIndex].description}
          </p>
        )}
      </div>
    </div>
  );
}

// Liste de badges texte séparés par "/" — cf. ProjectDetail.jsx
function CreditsList({ items, isDarkMode }) {
  return (
    <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-beige/80' : 'text-black/80'}`}>
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && <span className="opacity-30 mx-2">/</span>}
        </span>
      ))}
    </p>
  );
}

export default function ProjectDoubleDetail({ project }) {
  const { t } = useTranslation(['projects']);
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const isLocalhost = window.location.hostname === 'localhost';
  const visibleProjects = projects.filter(p => !p.hidden || isLocalhost);
  const currentVisibleIndex = visibleProjects.findIndex(p => p.id === project.id);
  const previousProject = visibleProjects[currentVisibleIndex - 1];
  const nextProject = visibleProjects[currentVisibleIndex + 1];
  const getTitle = (proj) => t(`projects:items.${proj.id}.title`, proj.title);

  const subProjects = project.subProjects || [];

  const siteUrl = 'https://www.rafaelpiral.fr';
  const pageUrl = `${siteUrl}/work/${project.slug}`;
  const ogImage = project.thumbnail?.endsWith('.svg')
    ? `${siteUrl}/og-image.png`
    : `${siteUrl}${project.thumbnail}`;
  // Troncature à la limite d'un mot (pas au milieu) pour un extrait propre
  // dans les résultats de recherche — avec repli sur catégorie/année si la
  // description manque, pour ne jamais laisser la meta vide.
  const truncateAtWord = (text, max) => {
    if (!text) return '';
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
  };
  const metaDesc = truncateAtWord(project.description, 155)
    || `${project.title} — ${project.category}, ${project.year}. Un projet de Rafael Piral.`;
  const imageAlt = `${project.title} — ${project.category}, Rafael Piral`;
  const keywords = [...(project.tags || []), ...(project.competences || [])].join(', ');

  const detailsIndex = subProjects.length + 1;

  return (
    <>
    <Helmet>
      <title>{`${project.title} · Rafael Piral`}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={`${project.title} · Rafael Piral`} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="article:published_time" content={project.year} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={`${project.title} · Rafael Piral`} />
      <meta property="twitter:description" content={metaDesc} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content={imageAlt} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "description": metaDesc,
        "image": ogImage,
        "url": pageUrl,
        "dateCreated": project.year,
        "datePublished": project.year,
        "inLanguage": "fr-FR",
        "author": { "@type": "Person", "name": "Rafael Piral", "url": siteUrl },
        "creator": { "@type": "Person", "name": "Rafael Piral", "url": siteUrl },
        "genre": project.category,
        ...(keywords && { "keywords": keywords })
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${siteUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Projets", "item": `${siteUrl}/#projects` },
          { "@type": "ListItem", "position": 3, "name": project.title, "item": pageUrl }
        ]
      })}</script>
    </Helmet>
    <ReactLenis root options={{ lerp: 0.05, duration: 1.2, smoothWheel: true }}>
      <div className={`min-h-screen font-stamp ${isDarkMode ? 'bg-black text-beige' : 'bg-beige text-black'}`}>

        <ProjectHeader isDarkMode={isDarkMode} index={currentVisibleIndex} total={visibleProjects.length} />

        {/* Masthead du projet combiné */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-24 md:pt-36 px-4 md:px-16"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-baseline justify-between gap-2 mb-6 md:mb-10 text-xs md:text-sm tracking-[0.3em] uppercase opacity-50"
            >
              <span>N° {String(currentVisibleIndex + 1).padStart(3, '0')} · {project.category}</span>
              <span>{project.year}</span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="uppercase leading-[0.95] mb-10 md:mb-16"
              style={{
                fontFamily: '"PP Neue Montreal", sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(2.25rem, 6.5vw, 6rem)',
              }}
            >
              {project.title}
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 md:pb-16 border-b ${
                isDarkMode ? 'border-beige/15' : 'border-black/15'
              }`}
            >
              <p className="md:col-span-2 text-xl md:text-3xl font-light leading-snug opacity-80 text-pretty">
                {project.description}
              </p>

              <ul className="flex flex-col gap-4 text-sm md:text-right md:items-end">
                {subProjects[0]?.period && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">Période</span>
                    <span>{subProjects[0].period}</span>
                  </li>
                )}
                {subProjects[0]?.duration && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">Durée</span>
                    <span>{subProjects[0].duration}</span>
                  </li>
                )}
                {project.type && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">Contexte</span>
                    <span>{project.type}</span>
                  </li>
                )}
                {project.collaborators && project.collaborators.length > 0 && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">Réalisé avec</span>
                    <span className="flex flex-col gap-1">
                      {project.collaborators.map((c, i) => (
                        <a
                          key={i}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 transition-opacity hover:opacity-60"
                        >
                          {c.name}
                        </a>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>
        </motion.header>

        {/* Contenu principal */}
        <div className="pb-20 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 md:px-16 pt-16 md:pt-24">

            {subProjects.map((sub, idx) => (
              <div key={sub.key || idx} className="mb-20 md:mb-28">
                <ProjectSectionDivider index={idx + 1} label={sub.title} isDarkMode={isDarkMode} />

                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.2 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className={idx % 2 === 1 ? 'order-2 lg:order-1' : ''}>
                      {idx % 2 === 0 ? (
                        <>
                          <h2
                            className="text-3xl md:text-4xl mb-4 leading-tight"
                            style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
                          >
                            {sub.title}
                          </h2>
                          <p className="text-base opacity-70 leading-relaxed mb-8">{sub.description}</p>
                          {sub.tags && (
                            <div className="flex flex-col gap-2">
                              <span className="opacity-40 text-xs tracking-widest uppercase">Outils</span>
                              <CreditsList items={sub.tags} isDarkMode={isDarkMode} />
                            </div>
                          )}
                        </>
                      ) : (
                        <SubProjectGallery subProject={sub} isDarkMode={isDarkMode} />
                      )}
                    </div>
                    <div className={idx % 2 === 1 ? 'order-1 lg:order-2' : ''}>
                      {idx % 2 === 0 ? (
                        <SubProjectGallery subProject={sub} isDarkMode={isDarkMode} />
                      ) : (
                        <>
                          <h2
                            className="text-3xl md:text-4xl mb-4 leading-tight"
                            style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
                          >
                            {sub.title}
                          </h2>
                          <p className="text-base opacity-70 leading-relaxed mb-8">{sub.description}</p>
                          {sub.tags && (
                            <div className="flex flex-col gap-2">
                              <span className="opacity-40 text-xs tracking-widest uppercase">Outils</span>
                              <CreditsList items={sub.tags} isDarkMode={isDarkMode} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Compétences globales */}
            {project.competences && project.competences.length > 0 && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="mb-4"
              >
                <ProjectSectionDivider index={detailsIndex} label="Compétences mobilisées" isDarkMode={isDarkMode} />
                <CreditsList items={project.competences} isDarkMode={isDarkMode} />
              </motion.div>
            )}
          </div>

          {/* Navigation vers autres projets */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-16 md:mt-24"
          >
            <ProjectFooterNav
              previousProject={previousProject}
              nextProject={nextProject}
              getTitle={getTitle}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        </div>
      </div>
    </ReactLenis>

    </>
  );
}
