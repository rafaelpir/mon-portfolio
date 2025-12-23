import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalLoader = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [lines, setLines] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Configuration des textes à afficher
  const textSequence = [
    { text: "//PORTFOLIO", delay: 300, indent: 0 },
    { text: "[RAFAEL PIRAL]", delay: 100, indent: 0 },
    { text: "[#CREATIVE DEVELOPER]:", delay: 100, indent: 40 },
  ];

  // Effet de clignotement du curseur
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Effet de typing pour chaque ligne
  useEffect(() => {
    if (currentLineIndex >= textSequence.length) return;

    const currentLine = textSequence[currentLineIndex];
    let charIndex = 0;

    const initialDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < currentLine.text.length) {
          setCurrentText((prev) => prev + currentLine.text[charIndex]);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          // Ligne complète, l'ajouter aux lignes finales
          setLines((prev) => [...prev, { text: currentLine.text, indent: currentLine.indent }]);
          setCurrentText('');

          // Passer à la ligne suivante
          if (currentLineIndex === textSequence.length - 1) {
            // Dernière ligne, démarrer le chargement
            setTimeout(() => setIsLoading(true), 400);
          } else {
            setCurrentLineIndex((prev) => prev + 1);
          }
        }
      }, 50); // Vitesse de typing (50ms par caractère)

      return () => clearInterval(typingInterval);
    }, currentLine.delay);

    return () => clearTimeout(initialDelay);
  }, [currentLineIndex]);

  // Logique du pourcentage de chargement
  useEffect(() => {
    if (!isLoading) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5; // Plus rapide
      if (progress > 100) progress = 100;

      setLoadingProgress(progress);

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          setLines(prev => [...prev, { text: "}", indent: 40 }]);
          if (onComplete) setTimeout(onComplete, 600);
        }, 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  return (
    <div style={styles.container}>
      {/* Scanline effect pour l'effet terminal rétro */}
      <div style={styles.scanline} />

      {/* Vignette effect */}
      <div style={styles.vignette} />

      <motion.div
        style={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {/* Lignes complétées */}
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ ...styles.line, paddingLeft: `${line.indent}px` }}
            >
              {line.text}
            </motion.div>
          ))}

          {/* Ligne en cours de typing */}
          {currentText && currentLineIndex < textSequence.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                ...styles.line,
                paddingLeft: `${textSequence[currentLineIndex].indent}px`
              }}
            >
              {currentText}
              {showCursor && <span style={styles.cursor}>_</span>}
            </motion.div>
          )}

          {/* Ligne de chargement */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ paddingLeft: '40px', marginTop: '20px' }}
            >
              <div style={styles.line}>
                LOADING... {loadingProgress}%
              </div>

              {/* Barre de progression visuelle */}
              <div style={styles.progressBarContainer}>
                <motion.div
                  style={styles.progressBar}
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>

              {!isComplete && showCursor && (
                <span style={{ ...styles.cursor, marginTop: '10px' }}>_</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#000000',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Satoshi, "Courier New", monospace',
    color: '#FFFFFF',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
    animation: 'scanline 8s linear infinite',
    opacity: 0.3,
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
    pointerEvents: 'none',
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    padding: '20px',
    position: 'relative',
    zIndex: 1,
  },
  line: {
    marginBottom: '8px',
    whiteSpace: 'pre-wrap',
  },
  cursor: {
    display: 'inline-block',
    marginLeft: '5px',
    backgroundColor: '#FFFFFF',
    width: '10px',
    height: '1.2em',
    verticalAlign: 'text-bottom',
  },
  progressBarContainer: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: '10px',
    marginBottom: '10px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    transition: 'width 0.2s ease-out',
  }
};

export default TerminalLoader;
