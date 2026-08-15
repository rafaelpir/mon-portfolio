import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './data/projects';
import { ShaderProvider } from './context/ShaderContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import Preloader from './components/Preloader';
import AdminGuard from './components/AdminGuard';
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
  const [showPreloader, setShowPreloader] = useState(() => {
    // Actif desktop, désactivé mobile (préserve le LCP sur mobile) — et
    // une seule fois par session d'onglet, pour ne pas le rejouer à un
    // rechargement de la Home.
    const isMobileDevice = window.innerWidth <= 768;
    const alreadyShown = sessionStorage.getItem('preloaderShown') === 'true';
    return !isMobileDevice && !alreadyShown;
  });
  const isHomePage = location.pathname === '/';

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderShown', 'true');
    setShowPreloader(false);
  };

  // Le Preloader fige <body> en position:fixed/height:100% pendant son
  // affichage (voir Preloader.jsx). Tous les ScrollTrigger créés par les
  // sections de la Home pendant cette fenêtre (ex: ScrollRevealText sur
  // About) calculent leurs positions de déclenchement sur cette mise en page
  // tronquée à un viewport — une fois <body> libéré, ces positions ne
  // correspondent plus à la vraie page et les effets se retrouvent déjà
  // "joués" ou ne se déclenchent jamais. Un effect (pas juste un callback
  // dans handlePreloaderComplete) garantit que le refresh tourne APRÈS que
  // le Preloader ait réellement démonté et rendu <body> à son état normal.
  useEffect(() => {
    if (!showPreloader) ScrollTrigger.refresh();
  }, [showPreloader]);

  return (
    <>
      {showPreloader && isHomePage && (
        <Preloader onComplete={handlePreloaderComplete} minDuration={1500} />
      )}
      <ScrollToTop />
      <GoogleAnalytics />
      <SpeedInsights />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
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
