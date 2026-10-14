import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import { museumLinkFor } from '../data/museeExhibits';
import { museumAvailable } from '../utils/museumAccess';
import ProjectHeader from '../components/ProjectHeader';
import ProjectSectionDivider from '../components/ProjectSectionDivider';
import ProjectFooterNav from '../components/ProjectFooterNav';
import ImageLightbox from '../components/ImageLightbox';
import usePerformanceTier from '../hooks/usePerformanceTier';
import { loadYouTubeApi } from '../utils/youtubeApi';

function SubProjectGallery({ subProject, isDarkMode, figure }) {
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
    <div className="sub-figure">
      {/* Image · hauteur fixe (voir .sub-figure-frame) */}
      <div className="sub-figure-frame relative mx-auto overflow-hidden">
        {/* `display` : version allégée pour l'affichage en page (les originaux,
            jusqu'à ~9600 px de large, font saccader le scroll sur mobile au
            décodage) ; l'original reste utilisé par la lightbox. */}
        <img
          src={gallery[currentIndex].display || gallery[currentIndex].src}
          loading="lazy"
          decoding="async"
          alt={gallery[currentIndex].description || `${subProject.title}, image ${currentIndex + 1}`}
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
          alt={gallery[currentIndex].description || `${subProject.title}, image ${currentIndex + 1}`}
          onClose={() => setExpanded(false)}
          onPrev={gallery.length > 1 ? handlePrev : undefined}
          onNext={gallery.length > 1 ? handleNext : undefined}
          counter={gallery.length > 1 ? `${currentIndex + 1} / ${gallery.length}` : undefined}
        />
      )}

      {/* Boutons + compteur · hauteur fixe, jamais déplacés */}
      {gallery.length > 1 && (
        <div className="sub-figure-controls flex items-center justify-between mt-3" style={{ height: '36px' }}>
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
      <div className="sub-figure-caption">
        {figure && <span>fig. {figure}</span>}
        {gallery[currentIndex].description && <p>{gallery[currentIndex].description}</p>}
      </div>
    </div>
  );
}

// Vidéo YouTube en fond fixe de toute la page, muette et non interactive
// (`pointer-events: none` + hors tabulation : ni clic, ni pause, ni focus).
// Rendue via portail attaché à <html>, comme ProjectHeader : `body` a
// `transform: translateZ(0)` en desktop, ce qui casse `position: fixed`.
// Le portail (z-index négatif) passe sous <body> : il porte donc lui-même la
// couleur de fond de la page, dont le conteneur devient transparent.
// Elle reste invisible tant que la lecture n'a pas réellement démarré et que
// l'interface YouTube n'a pas disparu, puis apparaît en fondu : on ne voit
// ainsi jamais les boutons ni l'écran d'attente de YouTube (y compris si la
// lecture automatique est refusée). Boucle gérée à la main : le paramètre
// `playlist` (requis par `loop`) ajoute des boutons précédent/suivant.
// Recadrage "cover" en CSS pur : le conteneur prend la hauteur du viewport en
// 16:9 avec au minimum sa largeur, l'iframe remplit cette largeur en 16:9.
// Le léger zoom rogne le titre/logo YouTube sur les bords.
// YouTube affiche son bouton pause au centre pendant ~4 s à chaque démarrage
// de lecture (y compris après un `seekTo`) : on attend qu'il ait disparu.
const REVEAL_DELAY = 4500;
function BackgroundVideo({ video, isDarkMode }) {
  const { youtubeId, start = 0, opacity = 0.15 } = video;
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [portalNode] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.documentElement.appendChild(portalNode);
    return () => portalNode.remove();
  }, [portalNode]);

  useEffect(() => {
    let cancelled = false;
    let player;
    let revealTimer;
    const mount = document.createElement('div');
    hostRef.current.appendChild(mount);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        videoId: youtubeId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          start,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.BUFFERING) return;
            clearTimeout(revealTimer);
            if (e.data === YT.PlayerState.PLAYING) {
              revealTimer = setTimeout(() => setVisible(true), REVEAL_DELAY);
            } else {
              setVisible(false);
              if (e.data === YT.PlayerState.ENDED) {
                e.target.seekTo(start, true);
                e.target.playVideo();
              }
            }
          },
        },
      });
      const iframe = player.getIframe();
      iframe.title = "Vidéo d'arrière-plan";
      iframe.tabIndex = -1;
      iframe.className = 'absolute top-1/2 left-0 w-full border-0 pointer-events-none';
      iframe.style.height = 'auto';
      iframe.style.aspectRatio = '16 / 9';
      iframe.style.transform = 'translateY(-50%) scale(1.2)';
    });

    return () => {
      cancelled = true;
      clearTimeout(revealTimer);
      if (typeof player?.destroy === 'function') player.destroy();
      mount.remove();
    };
  }, [youtubeId, start]);

  return createPortal(
    <div
      className={`fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none select-none ${isDarkMode ? 'bg-black' : 'bg-beige'}`}
      // 100lvh (repli : h-screen) : hauteur stable sur mobile, sinon la vidéo
      // est redimensionnée à chaque apparition/disparition de la barre d'URL.
      style={{ zIndex: -1, height: '100lvh' }}
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 ${visible ? 'bg-video-reveal' : ''}`}
        // `visibility` et non `opacity: 0` : sur mobile, index.css force à 1
        // l'opacité de tout élément dont le style inline contient "opacity: 0".
        style={{ opacity, visibility: visible ? 'visible' : 'hidden' }}
      >
        <div
          ref={hostRef}
          className="absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{ aspectRatio: '16 / 9', minWidth: '100%' }}
        />
      </div>
    </div>,
    portalNode
  );
}

// Titre dont chaque lettre démarre dorée puis se retourne, l'une après
// l'autre, pour reprendre la couleur du texte (animation `gold-flip` dans
// index.css). Les mots restent insécables ; le titre complet est exposé aux
// lecteurs d'écran via `aria-label` (h1).
function GoldFlipTitle({ text }) {
  let letterIndex = 0;
  return text.split(' ').map((word, w) => (
    <span key={w} aria-hidden="true">
      {w > 0 && ' '}
      <span className="inline-block whitespace-nowrap">
        {[...word].map((char, i) => (
          <span key={i} className="gold-flip-letter" style={{ '--i': letterIndex++ }}>
            {char}
          </span>
        ))}
      </span>
    </span>
  ));
}

// Playlist YouTube d'ambiance, jouée en boucle à faible volume par un lecteur
// invisible. Les navigateurs bloquent le son en lecture automatique tant que
// le visiteur n'a pas interagi avec la page : si le démarrage est refusé, la
// lecture est relancée au premier clic/touche. `toggle` coupe ou remet le son.
function useBackgroundMusic(music) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const wantedRef = useRef(true);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const ids = music?.youtubeIds;
  const volume = music?.volume ?? 12;

  useEffect(() => {
    if (!ids?.length || !hostRef.current) return;
    let cancelled = false;
    const mount = document.createElement('div');
    hostRef.current.appendChild(mount);

    const play = () => {
      const player = playerRef.current;
      if (typeof player?.playVideo === 'function') player.playVideo();
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(mount, {
        width: 200,
        height: 200,
        playerVars: { controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            e.target.setLoop(true);
            e.target.loadPlaylist(ids);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.BUFFERING) return;
            playingRef.current = e.data === YT.PlayerState.PLAYING;
            setPlaying(playingRef.current);
          },
        },
      });
    });

    const onGesture = (e) => {
      if (e.target instanceof Element && e.target.closest('[data-music-toggle]')) return;
      if (wantedRef.current && !playingRef.current) play();
    };
    window.addEventListener('pointerdown', onGesture);
    window.addEventListener('keydown', onGesture);

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      if (typeof playerRef.current?.destroy === 'function') playerRef.current.destroy();
      playerRef.current = null;
      mount.remove();
    };
  }, [ids, volume]);

  const toggle = () => {
    const player = playerRef.current;
    if (typeof player?.playVideo !== 'function') return;
    wantedRef.current = !playingRef.current;
    if (playingRef.current) player.pauseVideo();
    else player.playVideo();
  };

  return { hostRef, playing, toggle };
}

// Liste de badges texte séparés par "/", cf. ProjectDetail.jsx
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
  const { t, i18n } = useTranslation(['projects']);
  const isFrench = i18n.language?.startsWith('fr');
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

  // Pas de vidéo de fond si l'utilisateur a demandé un mouvement réduit
  const tier = usePerformanceTier();
  const showBackgroundVideo = project.backgroundVideo?.youtubeId && tier !== 'none';
  const goldFlipTitle = project.titleAnimation === 'gold-flip' && tier !== 'none';

  const hasMusic = project.backgroundMusic?.youtubeIds?.length > 0;
  const music = useBackgroundMusic(project.backgroundMusic);

  const siteUrl = 'https://www.rafaelpiral.fr';
  const pageUrl = `${siteUrl}/work/${project.slug}`;
  const ogImage = project.thumbnail?.endsWith('.svg')
    ? `${siteUrl}/og-image.png`
    : `${siteUrl}${project.thumbnail}`;
  // Troncature à la limite d'un mot (pas au milieu) pour un extrait propre
  // dans les résultats de recherche, avec repli sur catégorie/année si la
  // description manque, pour ne jamais laisser la meta vide.
  const truncateAtWord = (text, max) => {
    if (!text) return '';
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
  };
  const metaDesc = truncateAtWord(project.description, 155)
    || `${project.title}, ${project.category}, ${project.year}. Un projet de Rafael Piral.`;
  const imageAlt = `${project.title}, ${project.category}, Rafael Piral`;
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
      <div className={`min-h-screen font-stamp ${isDarkMode ? 'text-beige' : 'text-black'} ${
        showBackgroundVideo ? '' : isDarkMode ? 'bg-black' : 'bg-beige'
      }`}>

        {showBackgroundVideo && <BackgroundVideo video={project.backgroundVideo} isDarkMode={isDarkMode} />}

        <ProjectHeader isDarkMode={isDarkMode} index={currentVisibleIndex} total={visibleProjects.length} folio={project.shortTitle || project.title} />

        {/* Masthead du projet combiné */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative isolate pt-24 md:pt-36 px-4 md:px-16"
        >
          {hasMusic && (
            <div
              ref={music.hostRef}
              className="absolute top-0 left-0 w-px h-px overflow-hidden opacity-0 pointer-events-none"
              aria-hidden="true"
            />
          )}
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={`flex flex-wrap items-baseline justify-between gap-2 mb-6 md:mb-10 pb-3 border-b text-xs md:text-sm tracking-[0.3em] uppercase ${isDarkMode ? 'border-beige/25' : 'border-black/25'}`}
            >
              <span>{isFrench ? 'Planche' : 'Plate'} {String(currentVisibleIndex + 1).padStart(2, '0')} · {project.category}</span>
              <span>{project.year}</span>
            </motion.div>

            {/* Grand écran : double page, texte à gauche, visuel officiel à droite */}
            <div className={`double-hero ${project.heroImage ? 'has-figure' : ''}`}>
            <div className="double-hero-text">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="double-hero-title uppercase leading-[0.95] mb-10 md:mb-16"
              aria-label={goldFlipTitle ? project.title : undefined}
              style={{
                fontFamily: '"PP Neue Montreal", sans-serif',
                fontWeight: 600,
              }}
            >
              {goldFlipTitle
                ? <GoldFlipTitle text={project.title} />
                : project.title}
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className={`double-hero-notes grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 md:pb-16 border-b ${
                isDarkMode ? 'border-beige/15' : 'border-black/15'
              }`}
            >
              <p className="double-hero-lead md:col-span-2 text-xl md:text-3xl font-light leading-snug opacity-80 text-pretty">
                {project.description}
              </p>

              <ul className="double-hero-cartel flex flex-col gap-4 text-sm md:text-right md:items-end">
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
                {museumLinkFor(project.slug) && museumAvailable() && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-widest uppercase">Exposition</span>
                    <Link to={museumLinkFor(project.slug)} className="underline underline-offset-2 transition-opacity hover:opacity-60">
                      Voir l'affiche au musée →
                    </Link>
                  </li>
                )}
                {hasMusic && (
                  <li className="flex flex-col gap-1 md:items-end">
                    <span className="opacity-40 text-xs tracking-widest uppercase">Ambiance sonore</span>
                    <button
                      type="button"
                      data-music-toggle
                      onClick={music.toggle}
                      aria-pressed={music.playing}
                      className="underline underline-offset-2 transition-opacity hover:opacity-60"
                    >
                      {music.playing ? '♪ Couper le son' : '♪ Activer le son'}
                    </button>
                  </li>
                )}
              </ul>
            </motion.div>
            </div>
            {project.heroImage && (
              <motion.figure
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="double-hero-figure"
              >
                <img src={project.heroImage} alt={`${project.title}, visuel officiel`} decoding="async" draggable={false} />
                <figcaption>
                  <span>fig. 0</span>
                  <span>{isFrench ? 'Visuel officiel du coffret' : 'Official box set artwork'}</span>
                </figcaption>
              </motion.figure>
            )}
            </div>
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
                  <div className={`sub-spread ${idx % 2 === 1 ? 'is-reversed' : ''}`}>
                    <div className="sub-text">
                      <p className="sub-count">
                        {String(idx + 1).padStart(2, '0')} / {String(subProjects.length).padStart(2, '0')}
                      </p>
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
                    </div>
                    <SubProjectGallery subProject={sub} isDarkMode={isDarkMode} figure={idx + 1} />
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
