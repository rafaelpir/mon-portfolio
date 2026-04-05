import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import Preloader from './components/Preloader';
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
const CoverLetterEN = lazy(() => import('./pages/CoverLetterEN'));
const CVEN = lazy(() => import('./pages/CVEN'));
const About = lazy(() => import('./pages/About'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Routes accessibles uniquement en local (localhost)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
function LocalOnly({ children }) {
  return isLocalhost ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(() => {
    // Ne montrer le preloader que s'il n'a pas déjà été affiché dans cette session
    return !sessionStorage.getItem('preloaderShown');
  });
  const isHomePage = location.pathname === '/';

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderShown', 'true');
    setShowPreloader(false);
  };

  return (
    <>
      {showPreloader && isHomePage && (
        <Preloader onComplete={handlePreloaderComplete} minDuration={1500} />
      )}
      <ScrollToTop />
      <GoogleAnalytics />
      <SpeedInsights />
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/cv" element={<LocalOnly><CV /></LocalOnly>} />
          <Route path="/lettre-motivation-graphiste" element={<LocalOnly><LettreMotivationGraphiste /></LocalOnly>} />
          <Route path="/lettre-paname-art-cafe" element={<LocalOnly><LettrePanameArtCafe /></LocalOnly>} />
          <Route path="/lettre-carjack-films" element={<LocalOnly><LettreCarjackFilms /></LocalOnly>} />
          <Route path="/lettre-regie-plateau" element={<LocalOnly><LettreRegiePlateau /></LocalOnly>} />
          <Route path="/lettre-preparateur-commande" element={<LocalOnly><LettrePreparateurCommande /></LocalOnly>} />
          <Route path="/lettre-assistant-technique-av" element={<LocalOnly><LettreAssistantTechniqueAV /></LocalOnly>} />
          <Route path="/cover-letter" element={<LocalOnly><CoverLetterEN /></LocalOnly>} />
          <Route path="/cv-en" element={<LocalOnly><CVEN /></LocalOnly>} />
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
