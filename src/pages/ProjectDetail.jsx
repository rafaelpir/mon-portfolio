import { Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { projects } from '../data/projects';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectHeader from '../components/ProjectHeader';
import ProjectSectionDivider from '../components/ProjectSectionDivider';
import ProjectFooterNav from '../components/ProjectFooterNav';
import ImageLightbox from '../components/ImageLightbox';
import ProjectDoubleDetail from './ProjectDoubleDetail';

// Thème "à l'effigie" d'un club, pour les quelques projets qui en portent
// un (`project.clubTheme`) — classes Tailwind écrites en toutes lettres :
// le JIT scanne le texte source, une classe reconstruite dynamiquement
// (ex. via `.replace()`) ne serait jamais générée.
const CLUB_THEMES = {
  inter: {
    bg: 'bg-[#040707]',
    text: 'text-[#f2f2f2]',
    accent: 'text-[#08018C]',
    accentBg: 'bg-[#08018C]',
    border: 'border-[#A39261]/20',
    // Liseré du haut, traits/séparateurs de section : en or bronze. Le
    // titre reste blanc (club.text), pas d'accent bleu dessus.
    topBarBg: 'bg-[#A39261]',
    goldText: 'text-[#A39261]',
    // Bandes noir et bleu — l'or reste réservé aux traits et au liseré.
    stripeA: '#08018C',
    stripeB: '#040707',
  },
  milan: {
    bg: 'bg-[#0a0a0a]',
    text: 'text-[#f2f2f2]',
    accent: 'text-[#e2202a]',
    accentBg: 'bg-[#e2202a]',
    border: 'border-[#e2202a]/20',
    // Vraies couleurs du maillot rossonero (rouge/noir) pour les bandes.
    stripeA: '#FB090B',
    stripeB: '#000000',
  },
};

const slideVariants = {
  enter: (dir) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: -dir * 60, opacity: 0 }),
};

function PartCarousel({ images, title, isDarkMode, imageMaxWidth, imageMaxHeight }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const changeImage = useCallback((newIndex, currentIndex) => {
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrent(newIndex);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full" style={{ maxWidth: imageMaxWidth || '384px' }}>
        <div className="relative group overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              alt={title}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full object-contain transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              style={{
                cursor: isMobile ? 'default' : 'zoom-in',
                ...(imageMaxHeight ? { maxHeight: imageMaxHeight } : {}),
              }}
              loading="lazy"
              role={isMobile ? undefined : 'button'}
              tabIndex={isMobile ? undefined : 0}
              onClick={isMobile ? undefined : () => setExpanded(true)}
              onKeyDown={isMobile ? undefined : (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(true); }
              }}
            />
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); changeImage((current - 1 + images.length) % images.length, current); }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity ${isDarkMode ? 'bg-black/70 text-beige' : 'bg-white/80 text-black'}`}
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); changeImage((current + 1) % images.length, current); }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity ${isDarkMode ? 'bg-black/70 text-beige' : 'bg-white/80 text-black'}`}
              >
                ›
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex justify-center gap-3 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => changeImage(i, current)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? (isDarkMode ? 'bg-beige' : 'bg-black') : 'bg-gray-400'}`}
              />
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <ImageLightbox
          src={images[current]}
          alt={title}
          onClose={() => setExpanded(false)}
          onPrev={images.length > 1 ? () => changeImage((current - 1 + images.length) % images.length, current) : undefined}
          onNext={images.length > 1 ? () => changeImage((current + 1) % images.length, current) : undefined}
          counter={images.length > 1 ? `${current + 1} / ${images.length}` : undefined}
        />
      )}
    </div>
  );
}

// Liste de badges texte séparés par "/", plus proche d'une ligne de crédits
// de magazine que des pastilles "app card".
function CreditsList({ items, isDarkMode }) {
  return (
    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-beige/80' : 'text-black/80'}`}>
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && <span className="opacity-30 mx-2">/</span>}
        </span>
      ))}
    </p>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t } = useTranslation(['projects', 'common']);
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [galleryDirection, setGalleryDirection] = useState(1);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Trouver le projet actuel par slug
  const currentIndex = projects.findIndex(p => p.slug === slug);
  const project = projects[currentIndex];

  const changeGalleryImage = useCallback((newIndex, dir) => {
    setGalleryDirection(dir);
    setCurrentImageIndex(newIndex);
  }, []);

  // Slug inconnu (projet supprimé, lien obsolète...) : retour à l'accueil
  // plutôt qu'un crash sur les accès à `project.*` qui suivent.
  if (!project) {
    return <Navigate to="/" replace />;
  }

  const handleNextImage = () => {
    if (project.gallery) {
      changeGalleryImage((currentImageIndex + 1) % project.gallery.length, 1);
    }
  };

  const handlePrevImage = () => {
    if (project.gallery) {
      changeGalleryImage(currentImageIndex === 0 ? project.gallery.length - 1 : currentImageIndex - 1, -1);
    }
  };

  // Projets précédent et suivant (en excluant les projets cachés)
  const isLocalhost = window.location.hostname === 'localhost';
  const visibleProjects = projects.filter(p => !p.hidden || isLocalhost);
  const currentVisibleIndex = visibleProjects.findIndex(p => p.slug === slug);
  const previousProject = visibleProjects[currentVisibleIndex - 1];
  const nextProject = visibleProjects[currentVisibleIndex + 1];
  const getTitle = (proj) => t(`projects:items.${proj.id}.title`, proj.title);

  // Get translated project data
  const getProjectData = (proj) => {
    const translatedProject = t(`projects:items.${proj.id}`, { returnObjects: true });
    return {
      ...proj,
      title: translatedProject?.title || proj.title,
      description: translatedProject?.description || proj.description,
      category: translatedProject?.category || proj.category,
      type: translatedProject?.type || proj.type,
      context: translatedProject?.context || proj.context,
      period: translatedProject?.period || proj.period,
      duration: translatedProject?.duration || proj.duration,
      competences: translatedProject?.competences || proj.competences,
      galleryDescriptions: translatedProject?.gallery || [],
      parts: translatedProject?.parts || proj.parts || [],
      livrables: translatedProject?.livrables || proj.livrables || []
    };
  };

  // Layout double : déléguer au composant dédié
  if (project?.layout === 'double') {
    return <ProjectDoubleDetail project={project} />;
  }

  const translatedProject = project ? getProjectData(project) : null;

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
  const metaDesc = truncateAtWord(translatedProject.description, 155)
    || `${translatedProject.title} — ${translatedProject.category}, ${project.year}. Un projet de Rafael Piral.`;
  const imageAlt = `${translatedProject.title} — ${translatedProject.category}, Rafael Piral`;
  const keywords = [...(project.tags || []), ...(translatedProject.competences || [])].join(', ');
  // Alt texte descriptif par image de galerie : reprend la légende propre à
  // l'image quand elle existe (meilleur pour la recherche d'images), avec
  // repli sur titre + numéro sinon.
  const getGalleryAlt = (index) =>
    translatedProject.galleryDescriptions?.[index] || project.gallery?.[index]?.description
      || `${translatedProject.title} — Image ${index + 1}`;

  // Numérotation séquentielle des sections — même logique que le "01/02/03"
  // de la nav de la home, calculée à l'avance pour matcher l'ordre de rendu.
  // La galerie/image de titre vit dans le masthead (pas de diviseur propre,
  // c'est la couverture, pas une "section") : elle n'entre pas dans le
  // compte pour ne pas laisser un trou (ex. "02" sans "01" visible).
  let sectionCounter = 0;
  const hasGallery = project.gallery && project.gallery.length > 0;
  const hasVideo = project.youtubeId || project.video;
  const hasFigma = !!project.figmaEmbed;
  const hasParts = translatedProject.parts && translatedProject.parts.length > 0;
  const videoIndex = hasVideo ? ++sectionCounter : null;
  const figmaIndex = hasFigma ? ++sectionCounter : null;
  const partsIndex = hasParts ? ++sectionCounter : null;
  const detailsIndex = ++sectionCounter;
  const club = CLUB_THEMES[project.clubTheme];

  return (
    <>
    <Helmet>
      <title>{`${translatedProject.title} · Rafael Piral`}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={`${translatedProject.title} · Rafael Piral`} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="article:published_time" content={project.year} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={`${translatedProject.title} · Rafael Piral`} />
      <meta property="twitter:description" content={metaDesc} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content={imageAlt} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": translatedProject.title,
        "description": metaDesc,
        "image": ogImage,
        "url": pageUrl,
        "dateCreated": project.year,
        "datePublished": project.year,
        "inLanguage": "fr-FR",
        "author": { "@type": "Person", "name": "Rafael Piral", "url": siteUrl },
        "creator": { "@type": "Person", "name": "Rafael Piral", "url": siteUrl },
        "genre": translatedProject.category,
        ...(keywords && { "keywords": keywords })
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${siteUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Projets", "item": `${siteUrl}/#projects` },
          { "@type": "ListItem", "position": 3, "name": translatedProject.title, "item": pageUrl }
        ]
      })}</script>
    </Helmet>
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <div className={`relative z-0 min-h-screen font-stamp ${
        club ? `${club.bg} ${club.text}` : (isDarkMode ? 'bg-black text-beige' : 'bg-beige text-black')
      }`}>
        {/* Liseré aux couleurs du club — "à l'effigie" dès le premier pixel,
            pinné au-dessus du header (lui-même en z-[110]). */}
        {club && <div className={`fixed top-0 left-0 right-0 h-1 z-[111] ${club.topBarBg || club.accentBg}`} />}
        {/* Bandes du maillot en filigrane derrière tout le contenu — les
            vraies couleurs du club (pas l'accent doré/rouge du logo), en
            z-index négatif pour rester sous le texte statique. */}
        {club && (
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              backgroundImage: club.stripeC
                ? `repeating-linear-gradient(90deg, ${club.stripeA} 0px, ${club.stripeA} 70px, ${club.stripeB} 70px, ${club.stripeB} 140px, ${club.stripeC} 140px, ${club.stripeC} 210px)`
                : `repeating-linear-gradient(90deg, ${club.stripeA} 0px, ${club.stripeA} 70px, ${club.stripeB} 70px, ${club.stripeB} 140px)`,
              opacity: 0.08,
            }}
          />
        )}
        <ProjectHeader isDarkMode={isDarkMode} index={currentVisibleIndex} total={visibleProjects.length} />

        {/* Masthead du projet — titre + image tiennent dans l'écran, sans
            scroll : hauteur bornée à la fenêtre (h-[100svh], stable même
            avec la barre d'adresse mobile qui va et vient), colonne flex où
            seule l'image (flex-1 min-h-0) absorbe l'espace restant. Le zoom
            (imageExpanded) ouvre une vraie lightbox par-dessus la page au
            lieu de gonfler l'image ici, donc cette contrainte reste fixe. */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col px-4 md:px-16 pt-20 md:pt-28 pb-4 md:pb-6 h-[100svh]"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={`shrink-0 flex flex-wrap items-baseline justify-between gap-2 mb-3 md:mb-5 text-xs md:text-sm tracking-[0.3em] uppercase ${club ? (club.goldText || club.accent) : 'opacity-50'}`}
            >
              <span>N° {String(currentVisibleIndex + 1).padStart(3, '0')} · {translatedProject.category}</span>
              <span>{project.year}</span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="shrink-0 uppercase leading-[0.95] mb-4 md:mb-6"
              style={{
                fontFamily: '"PP Neue Montreal", sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(1.75rem, 5vw, 5rem)',
              }}
            >
              {translatedProject.title}
            </motion.h1>

            {/* Image principale (masquée si carousel présent) */}
            {!hasGallery && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 min-h-0 flex items-center justify-center"
              >
                <img
                  src={project.thumbnail}
                  alt={imageAlt}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  style={{
                    cursor: isMobile ? 'default' : 'zoom-in',
                    maxWidth: project.thumbnailMaxWidth || '100%',
                  }}
                  loading="lazy"
                  role={isMobile ? undefined : 'button'}
                  tabIndex={isMobile ? undefined : 0}
                  onClick={isMobile ? undefined : () => setImageExpanded(true)}
                  onKeyDown={isMobile ? undefined : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setImageExpanded(true); }
                  }}
                />
              </motion.div>
            )}

            {/* Carousel d'images */}
            {hasGallery && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 min-h-0 flex flex-col items-center justify-center"
              >
                <div
                  className="relative w-full flex-1 min-h-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  style={{
                    maxWidth: '720px',
                    cursor: isMobile ? 'default' : 'zoom-in',
                  }}
                  role={isMobile ? undefined : 'button'}
                  tabIndex={isMobile ? undefined : 0}
                  aria-label={isMobile ? undefined : imageAlt}
                  onClick={isMobile ? undefined : () => setImageExpanded(true)}
                  onKeyDown={isMobile ? undefined : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setImageExpanded(true); }
                  }}
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
                  onTouchEnd={() => {
                    const diff = touchStartX.current - touchEndX.current;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) handleNextImage(); else handlePrevImage();
                    }
                    touchStartX.current = 0;
                    touchEndX.current = 0;
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <AnimatePresence initial={false} custom={galleryDirection} mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={project.gallery[currentImageIndex].src}
                        alt={getGalleryAlt(currentImageIndex)}
                        custom={galleryDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="select-none pointer-events-none w-full h-full object-contain"
                        draggable={false}
                      />
                    </AnimatePresence>
                  </div>

                  {project.gallery.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                        className={`hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 p-3 rounded-full border z-10 transition-colors ${
                          isDarkMode
                            ? 'border-beige/20 bg-black/50 hover:border-beige hover:bg-beige/10'
                            : 'border-black/20 bg-white/50 hover:border-black hover:bg-black/10'
                        }`}
                        aria-label="Image précédente"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                        className={`hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 p-3 rounded-full border z-10 transition-colors ${
                          isDarkMode
                            ? 'border-beige/20 bg-black/50 hover:border-beige hover:bg-beige/10'
                            : 'border-black/20 bg-white/50 hover:border-black hover:bg-black/10'
                        }`}
                        aria-label="Image suivante"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Légende façon "fig." de magazine — reste compacte pour ne
                    pas grignoter l'espace réservé à l'image. */}
                <div className="shrink-0 text-center mt-2 md:mt-3">
                  <span className="text-xs tracking-widest opacity-40 uppercase">
                    Fig. {String(currentImageIndex + 1).padStart(2, '0')} / {String(project.gallery.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Chapô : légende de l'image courante, description et infos clés —
            premier contenu qu'on découvre en scrollant, sous le titre/visuel. */}
        <div className="px-4 md:px-16">
          <div className="max-w-7xl mx-auto">
            {hasGallery && (translatedProject.galleryDescriptions[currentImageIndex] || project.gallery[currentImageIndex].description) && (
              <p className="text-center text-base opacity-70 max-w-3xl mx-auto pt-6 md:pt-10">
                {translatedProject.galleryDescriptions[currentImageIndex] || project.gallery[currentImageIndex].description}
              </p>
            )}
            {hasGallery && (
              <p className="text-center text-xs opacity-30 mt-2 md:hidden">
                {t('projects:details.swipeToNavigate')}
              </p>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-10 md:pt-14 pb-10 md:pb-16 border-b ${
                club ? club.border : (isDarkMode ? 'border-beige/15' : 'border-black/15')
              }`}
            >
              <p className="md:col-span-2 text-xl md:text-3xl font-light leading-snug opacity-80 text-pretty">
                {translatedProject.description}
              </p>

              <ul className="flex flex-col gap-4 text-sm md:text-right md:items-end">
                {project.role && (Array.isArray(project.role) ? project.role.length > 0 : true) && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">{t('projects:details.role')}</span>
                    <span>{Array.isArray(project.role) ? project.role.join(', ') : project.role}</span>
                  </li>
                )}
                {translatedProject.period && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">{t('projects:details.period')}</span>
                    <span>{translatedProject.period}</span>
                  </li>
                )}
                {translatedProject.duration && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">{t('projects:details.duration')}</span>
                    <span>{translatedProject.duration}</span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="pb-20 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 md:px-16 pt-14 md:pt-20">

            {/* Vidéo (si présente) */}
            {hasVideo && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mb-20 md:mb-28"
              >
                <ProjectSectionDivider index={videoIndex} label={t('projects:details.videoPresentation')} isDarkMode={isDarkMode} accentTextClass={club?.goldText || club?.accent} accentLineClass={club?.topBarBg || club?.accentBg} />
                <div className={`relative aspect-video overflow-hidden ${isDarkMode ? 'bg-beige/5' : 'bg-black/5'}`}>
                  {project.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${project.youtubeId}`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <video
                      src={project.video}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Prototype Figma interactif */}
            {hasFigma && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-20 md:mb-28"
              >
                <ProjectSectionDivider index={figmaIndex} label={t('projects:details.interactivePrototype')} isDarkMode={isDarkMode} accentTextClass={club?.goldText || club?.accent} accentLineClass={club?.topBarBg || club?.accentBg} />
                <div className={`relative overflow-hidden ${isDarkMode ? 'bg-beige/5' : 'bg-black/5'}`} style={{ height: '600px' }}>
                  <iframe
                    src={project.figmaEmbed}
                    title={`${translatedProject.title} - Prototype Figma`}
                    allowFullScreen
                    className="w-full border-0"
                    style={{
                      height: 'calc(100% + 50px)',
                      marginTop: '-50px'
                    }}
                  />
                </div>
                <p className="text-center mt-4 text-sm opacity-50">
                  {t('projects:details.prototypeHint')}
                </p>
              </motion.div>
            )}

            {/* Parties du projet */}
            {hasParts && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mb-20 md:mb-28"
              >
                <ProjectSectionDivider index={partsIndex} label={t('projects:details.projectDetails')} isDarkMode={isDarkMode} accentTextClass={club?.goldText || club?.accent} accentLineClass={club?.topBarBg || club?.accentBg} />

                <div className="space-y-20 md:space-y-28">
                  {translatedProject.parts.map((part, index) => {
                    const isImageRight = index % 2 === 0;
                    const textBlock = (
                      <div className="flex flex-col justify-center">
                        <span className="text-xs tracking-widest opacity-40 uppercase mb-2">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2
                          className="text-3xl md:text-5xl mb-6 leading-[1.05]"
                          style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
                        >
                          {part.title}
                          {part.subtitle && (
                            <span className="block text-xl md:text-2xl opacity-50 font-light mt-1">
                              {part.subtitle}
                            </span>
                          )}
                        </h2>
                        <div className="space-y-4">
                          {part.paragraphs.map((para, i) => (
                            <p key={i} className="text-base md:text-lg font-light leading-relaxed opacity-80">
                              {para}
                            </p>
                          ))}
                        </div>
                        {index === translatedProject.parts.length - 1 && translatedProject.livrables?.length > 0 && (
                          <div className="mt-10">
                            <p className="text-xs tracking-widest opacity-40 uppercase mb-4">Livrables</p>
                            <CreditsList items={translatedProject.livrables} isDarkMode={isDarkMode} />
                          </div>
                        )}
                      </div>
                    );
                    const isLastPart = index === translatedProject.parts.length - 1;
                    const hasPdf = isLastPart && project.pdfFile;
                    const partImages = part.images && part.images.length > 0 ? part.images : (part.image ? [part.image] : null);
                    const hasMedia = partImages || hasPdf;

                    const imageBlock = hasMedia ? (
                      hasPdf ? (
                        <div className="flex items-center justify-center">
                          <div className="relative overflow-hidden w-full" style={{ maxWidth: part.imageMaxWidth || '384px' }}>
                            <img
                              src={project.pdfFile.replace('.pdf', '-preview.webp')}
                              alt={part.title}
                              className="w-full object-contain"
                              loading="lazy"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black/80' : 'from-beige/90'} to-transparent flex items-end p-6`}>
                              <a
                                href={project.pdfFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm tracking-wider underline underline-offset-4 transition-opacity hover:opacity-70 ${isDarkMode ? 'text-beige' : 'text-black'}`}
                              >
                                Lire l'article entier ici
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <PartCarousel images={partImages} title={part.title} isDarkMode={isDarkMode} imageMaxWidth={part.imageMaxWidth} imageMaxHeight={part.imageMaxHeight} />
                      )
                    ) : null;

                    const isCarousel = part.images && part.images.length > 0;

                    return isCarousel ? (
                      <div key={index} className="flex flex-col gap-8">
                        {textBlock}
                        {imageBlock}
                      </div>
                    ) : (
                      <div key={index} className={`grid grid-cols-1 ${hasMedia ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
                        {hasMedia && !isImageRight ? imageBlock : textBlock}
                        {hasMedia && (isImageRight ? imageBlock : textBlock)}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Détails du projet — colophon */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <ProjectSectionDivider index={detailsIndex} label={t('projects:details.projectDetails')} isDarkMode={isDarkMode} accentTextClass={club?.goldText || club?.accent} accentLineClass={club?.topBarBg || club?.accentBg} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                {/* Informations */}
                <div>
                  <h3 className="text-xs tracking-widest opacity-40 uppercase mb-4">{t('projects:details.info')}</h3>
                  <ul className="space-y-3 text-sm">
                    {translatedProject.context && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.context')}</span>
                        <span>{translatedProject.context}</span>
                      </li>
                    )}
                    <li className="flex flex-col gap-1">
                      <span className="opacity-50 text-xs tracking-wider">{t('projects:details.type')}</span>
                      <span>{translatedProject.type || translatedProject.category}</span>
                    </li>
                    {project.team && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.format')}</span>
                        <span>
                          {t('projects:details.teamWith')}{' '}
                          <a
                            href={project.team.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline transition-colors ${
                              isDarkMode ? 'hover:text-beige/70' : 'hover:text-black/70'
                            }`}
                          >
                            {project.team.name}
                          </a>
                        </span>
                      </li>
                    )}
                    {project.collaborators?.length > 0 && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.teamWith')}</span>
                        <span className="flex flex-wrap gap-x-2 gap-y-1">
                          {project.collaborators.map((c, i) => (
                            <span key={c.url}>
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`underline transition-colors ${
                                  isDarkMode ? 'hover:text-beige/70' : 'hover:text-black/70'
                                }`}
                              >
                                {c.name}
                              </a>
                              {i < project.collaborators.length - 1 && <span className="opacity-40">,</span>}
                            </span>
                          ))}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Outils utilisés */}
                <div>
                  <h3 className="text-xs tracking-widest opacity-40 uppercase mb-4">{t('projects:details.tools')}</h3>
                  <CreditsList items={project.outils || project.tags || []} isDarkMode={isDarkMode} />
                </div>

                {/* Compétences */}
                {translatedProject.competences && translatedProject.competences.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-widest opacity-40 uppercase mb-4">{t('projects:details.skills')}</h3>
                    <CreditsList items={translatedProject.competences} isDarkMode={isDarkMode} />
                  </div>
                )}
              </div>

              {/* Lien externe */}
              {project.externalUrl && (
                <div className="mt-10">
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 text-sm tracking-widest transition-colors ${
                      isDarkMode
                        ? 'border-beige hover:bg-beige hover:text-black'
                        : 'border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>{t('common:buttons.viewSite')}</span>
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation vers autres projets */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
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

        {imageExpanded && (
          hasGallery ? (
            <ImageLightbox
              src={project.gallery[currentImageIndex].src}
              alt={getGalleryAlt(currentImageIndex)}
              onClose={() => setImageExpanded(false)}
              onPrev={project.gallery.length > 1 ? handlePrevImage : undefined}
              onNext={project.gallery.length > 1 ? handleNextImage : undefined}
              counter={project.gallery.length > 1 ? `${currentImageIndex + 1} / ${project.gallery.length}` : undefined}
            />
          ) : (
            <ImageLightbox
              src={project.thumbnail}
              alt={imageAlt}
              onClose={() => setImageExpanded(false)}
            />
          )
        )}
      </div>

    </ReactLenis>

    </>
  );
}
