import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import CV from './pages/CV';
import TerminalLoader from './components/TerminalLoader';

export default function App() {
  // Toujours montrer le terminal loader au chargement initial
  const [showTerminalLoader, setShowTerminalLoader] = useState(true);

  const handleTerminalComplete = () => {
    setShowTerminalLoader(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showTerminalLoader ? (
        <motion.div
          key="terminal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <TerminalLoader onComplete={handleTerminalComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/cv" element={<CV />} />
            </Routes>
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
