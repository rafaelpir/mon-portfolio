import React, { useState, useEffect } from 'react';

const TerminalLoader = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Configuration des textes à afficher
  const textSequence = [
    { text: "//PORTFOLIO", delay: 500, indent: 0 },
    { text: "[RAFAEL PIRAL]", delay: 800, indent: 0 },
    { text: "[#]CREATIVE DEVELOPER]:", delay: 1200, indent: 40 },
  ];

  useEffect(() => {
    let timeouts = [];

    // 1. Séquence d'apparition des textes
    textSequence.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, line]);

        // Si c'est la dernière ligne de texte, on déclenche le chargement
        if (index === textSequence.length - 1) {
          startLoading();
        }
      }, line.delay);
      timeouts.push(timeout);
    });

    // Effet de clignotement du curseur
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(cursorInterval);
    };
  }, []);

  // 2. Logique du pourcentage de chargement
  const startLoading = () => {
    setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress > 100) progress = 100;

        setLoadingProgress(progress);

        if (progress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLines(prev => [...prev, { text: "}", indent: 40 }]);
            if (onComplete) setTimeout(onComplete, 800);
          }, 500);
        }
      }, 100);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {lines.map((line, index) => (
          <div key={index} style={{ ...styles.line, paddingLeft: `${line.indent}px` }}>
            {line.text}
          </div>
        ))}

        {lines.length >= textSequence.length && (
           <div style={{ ...styles.line, paddingLeft: '40px' }}>
             LOADING........... {loadingProgress}%
             {loadingProgress < 100 && showCursor && <span style={styles.cursor}>_</span>}
           </div>
        )}

        {lines.length > textSequence.length && showCursor && (
           <div style={{...styles.line, paddingLeft: '40px'}}>
             <span style={styles.cursor}>_</span>
           </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#050505',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'StampRSPKOne, "Courier New", monospace',
    color: '#ff7b00',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    padding: '20px',
  },
  line: {
    marginBottom: '8px',
    whiteSpace: 'pre-wrap',
    textShadow: '0 0 5px rgba(255, 123, 0, 0.5)',
  },
  cursor: {
    display: 'inline-block',
    marginLeft: '5px',
    backgroundColor: '#ff7b00',
    width: '10px',
    height: '1.2em',
    verticalAlign: 'text-bottom',
  }
};

export default TerminalLoader;
