import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/dist/lenis-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './data/projects';
import { ShaderProvider } from './context/ShaderContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import GoogleAnalytics from './components/GoogleAnalytics';
import { EMBEDDED_COPY } from './utils/museumAccess';
import AdminGuard from './components/AdminGuard';
import CatalogueLoader from './components/CatalogueLoader';
import PageTurn, { pageLabel, TURN_IN } from './components/PageTurn';
// Code splitting - Chargement différé des pages
const Home = lazy(() => import('./pages/Home'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const CV = lazy(() => import('./pages/CV'));
const LettreMotivationGraphiste = lazy(() => import('./pages/LettreMotivationGraphiste'));
const LettrePanameArtCafe = lazy(() => import('./pages/LettrePanameArtCafe'));
const LettreCarjackFilms = lazy(() => import('./pages/LettreCarjackFilms'));
const LettreRegiePlateau = lazy(() => import('./pages/LettreRegiePlateau'));
const LettrePreparateurCommande = lazy(() => import('./pages/LettrePreparateurCommande'));
const LettreAssistantTechniqueAV = lazy(() => import('./pages/LettreAssistantTechniqueAV'));
const LettreClubFoot = lazy(() => import('./pages/LettreClubFoot'));
const LettreAssistantSonPlateau = lazy(() => import('./pages/LettreAssistantSonPlateau'));
const Lettre27eRegion = lazy(() => import('./pages/Lettre27eRegion'));
const LettreChargeComDigitale = lazy(() => import('./pages/LettreChargeComDigitale'));
const LettreAlternanceCM = lazy(() => import('./pages/LettreAlternanceCM'));
const LettrePUC = lazy(() => import('./pages/LettrePUC'));
const EmailCandidature = lazy(() => import('./pages/EmailCandidature'));
const PortfolioPDF = lazy(() => import('./pages/PortfolioPDF'));
const CoverLetterEN = lazy(() => import('./pages/CoverLetterEN'));
const CVEN = lazy(() => import('./pages/CVEN'));
const CVInterim = lazy(() => import('./pages/CVInterim'));
const About = lazy(() => import('./pages/About'));
const Generatif = lazy(() => import('./pages/Generatif'));
const Musee = lazy(() => import('./pages/Musee'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminProjects = lazy(() => import('./pages/AdminProjects'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const AdminTimeline = lazy(() => import('./pages/AdminTimeline'));

// Routes accessibles uniquement en local (localhost)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
function LocalOnly({ children }) {
  return isLocalhost ? children : <Navigate to="/" replace />;
}

// Redirige les anciennes URLs /project/:id vers /work/:slug
function RedirectProjectToSlug() {
  const { id } = useParams();
  const project = projects.find(p => p.id.toString() === id);
  if (!project?.slug) return <Navigate to="/" replace />;
  return <Navigate to={`/work/${project.slug}`} replace />;
}

function AppContent() {
  const location = useLocation();
  const lenis = useLenis();
  const prevPathRef = useRef(location.pathname);

  // Tourne-page entre deux pages (voir PageTurn.jsx). Pas à la sortie du
  // musée, qui a son propre passage par la porte ; pas dans la copie du site
  // affichée dans le musée ; pas si l'on a demandé moins d'animations.
  const [turn, setTurn] = useState({ phase: null, label: null });
  const turnPathRef = useRef(location.pathname);
  const turnsRef = useRef(!EMBEDDED_COPY && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const from = turnPathRef.current;
    if (from === location.pathname) return undefined;
    turnPathRef.current = location.pathname;
    if (!turnsRef.current || from === '/musee') return undefined;
    setTurn({ phase: 'in', label: pageLabel(location.pathname + location.hash, (document.documentElement.lang || 'fr').startsWith('fr')) });
    // secours : si la sortie de l'ancienne page ne se signale pas, la feuille repart quand même
    const rescue = setTimeout(() => setTurn((current) => (current.phase === 'in' ? { ...current, phase: 'out' } : current)), TURN_IN + 1500);
    return () => clearTimeout(rescue);
  }, [location.pathname]);
  useEffect(() => {
    if (turn.phase !== 'out') return undefined;
    const done = setTimeout(() => setTurn({ phase: null, label: null }), 700);
    return () => clearTimeout(done);
  }, [turn.phase]);

  // Remise à zéro du scroll entre deux pages, déclenchée par la FIN de
  // l'animation de sortie (onExitComplete), pas par le changement de route
  // lui-même : avec <AnimatePresence mode="wait">, l'ancienne page reste
  // montée et visible pendant tout son fondu de sortie. La déclencher sur
  // le changement de route la faisait retomber en haut de page ANCIENNE
  // (le contenu qu'on venait de scroller redescendait brutalement à zéro)
  // avant même de commencer à s'estomper, un "saut" bien visible d'un
  // projet à l'autre. En attendant la fin du fondu, l'ancienne page a déjà
  // disparu quand le scroll se réinitialise : plus rien à voir sauter.
  const handleExitComplete = () => {
    // la nouvelle page est montée sous la feuille : celle-ci peut repartir
    setTimeout(() => setTurn((current) => (current.phase === 'in' ? { ...current, phase: 'out' } : current)), location.pathname === '/' ? 620 : 220);
    const prevPath = prevPathRef.current;
    const pathname = location.pathname;
    prevPathRef.current = pathname;

    if (pathname === '/' && (prevPath.startsWith('/work/') || prevPath.startsWith('/project/'))) {
      // L'accueil finit de se mettre en page par étapes (polices, textes
      // découpés en lignes) : on recale plusieurs fois, sous la feuille du
      // tourne-page, pour arriver pile sur la liste des œuvres.
      [100, 320, 560].forEach((delay) => {
        setTimeout(() => {
          const projectsSection = document.getElementById('projects');
          if (!projectsSection) return;
          // Le défilement fluide (Lenis) garde en mémoire la hauteur de
          // l'ancienne page : sans cette mise à jour, il s'arrête trop tôt.
          lenis?.resize?.();
          const top = projectsSection.getBoundingClientRect().top + window.scrollY;
          if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
          if (Math.abs(window.scrollY - top) > 4) window.scrollTo({ top, behavior: 'instant' });
        }, delay);
      });
      return;
    }

    if (pathname === '/') return;

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  };

  // Ouverture du site (page de garde du catalogue) : sur ordinateur, à
  // l'arrivée sur l'accueil. Pas sur mobile (préserve le premier affichage),
  // ni dans la copie de l'accueil affichée par le musée.
  // Une seule fois : à la première arrivée sur le site (retenu dans le
  // navigateur), puis plus jamais, même en rechargeant la page.
  const [showPreloader, setShowPreloader] = useState(() => {
    if (window.innerWidth <= 768 || EMBEDDED_COPY) return false;
    try {
      return !localStorage.getItem('rp-opening-seen');
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (!showPreloader) return;
    try {
      localStorage.setItem('rp-opening-seen', '1');
    } catch {
      /* navigation privée : l'ouverture reviendra à la prochaine visite */
    }
  }, [showPreloader]);
  const isHomePage = location.pathname === '/';

  // La page de garde bloque le défilement : les ScrollTrigger doivent être
  // recalculés une fois qu'elle a disparu (et au montage, les
  // sections lazy de l'accueil pouvant finir de monter après coup).
  useEffect(() => {
    if (!showPreloader) ScrollTrigger.refresh();
  }, [showPreloader]);

  return (
    <>
      {/* Pas de mesures depuis la copie du site affichée dans le musée */}
      {!EMBEDDED_COPY && <GoogleAnalytics />}
      {!EMBEDDED_COPY && <SpeedInsights />}
      {showPreloader && isHomePage && <CatalogueLoader onComplete={() => setShowPreloader(false)} lang={(document.documentElement.lang || 'fr').startsWith('fr') ? 'fr' : 'en'} />}
      <PageTurn phase={turn.phase} label={turn.label} />
      {/* Avec le tourne-page, l'ancienne page reste en place le temps que la
          feuille la recouvre (TURN_IN), puis la nouvelle apparaît dessous ;
          sans lui, un simple fondu. */}
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        <motion.div
          key={location.pathname}
          initial={turnsRef.current ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={turnsRef.current ? { opacity: 0.999, transition: { duration: TURN_IN / 1000 } } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <Suspense fallback={null}>
            <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Navigate to="/#projects" replace />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/project/:id" element={<RedirectProjectToSlug />} />
          <Route path="/admin/projects" element={<LocalOnly><AdminGuard><AdminProjects /></AdminGuard></LocalOnly>} />
          <Route path="/admin/profile" element={<LocalOnly><AdminGuard><AdminProfile /></AdminGuard></LocalOnly>} />
          <Route path="/admin/timeline" element={<LocalOnly><AdminGuard><AdminTimeline /></AdminGuard></LocalOnly>} />
          <Route path="/cv" element={<LocalOnly><CV /></LocalOnly>} />
          <Route path="/portfolio-pdf" element={<LocalOnly><PortfolioPDF /></LocalOnly>} />
          <Route path="/lettre-motivation-graphiste" element={<LocalOnly><LettreMotivationGraphiste /></LocalOnly>} />
          <Route path="/lettre-paname-art-cafe" element={<LocalOnly><LettrePanameArtCafe /></LocalOnly>} />
          <Route path="/lettre-carjack-films" element={<LocalOnly><LettreCarjackFilms /></LocalOnly>} />
          <Route path="/lettre-regie-plateau" element={<LocalOnly><LettreRegiePlateau /></LocalOnly>} />
          <Route path="/lettre-preparateur-commande" element={<LocalOnly><LettrePreparateurCommande /></LocalOnly>} />
          <Route path="/lettre-assistant-technique-av" element={<LocalOnly><LettreAssistantTechniqueAV /></LocalOnly>} />
          <Route path="/lettre-club-foot" element={<LocalOnly><LettreClubFoot /></LocalOnly>} />
          <Route path="/lettre-assistant-son-plateau" element={<LocalOnly><LettreAssistantSonPlateau /></LocalOnly>} />
          <Route path="/lettre-27e-region" element={<LocalOnly><Lettre27eRegion /></LocalOnly>} />
          <Route path="/lettre-charge-com-digitale" element={<LocalOnly><LettreChargeComDigitale /></LocalOnly>} />
          <Route path="/lettre-alternance-cm" element={<LocalOnly><LettreAlternanceCM /></LocalOnly>} />
          <Route path="/lettre-puc" element={<LocalOnly><LettrePUC /></LocalOnly>} />
          <Route path="/email-candidature" element={<LocalOnly><EmailCandidature /></LocalOnly>} />
          <Route path="/cover-letter" element={<LocalOnly><CoverLetterEN /></LocalOnly>} />
          <Route path="/cv-en" element={<LocalOnly><CVEN /></LocalOnly>} />
          <Route path="/cv-interim" element={<LocalOnly><CVInterim /></LocalOnly>} />
          <Route path="/about" element={<About />} />
          <Route path="/generatif" element={<Generatif />} />
          <Route path="/musee" element={<Musee />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ShaderProvider>
      <Router>
        <AppContent />
      </Router>
    </ShaderProvider>
  );
}
