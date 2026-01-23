import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import CV from './pages/CV';
import About from './pages/About';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import Preloader from './components/Preloader';

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/cv" element={<CV />} />
      <Route path="/about" element={<About />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <Router>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} minDuration={6000} />
      )}
      <ScrollToTop />
      <GoogleAnalytics />
      <AppRoutes />
    </Router>
  );
}
