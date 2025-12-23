import { useState, useEffect } from 'react';

export default function GlitchText({ children, className = '' }) {
  const [redactedIndices, setRedactedIndices] = useState([]);
  const text = typeof children === 'string' ? children : children?.props?.children || '';

  // Fonction pour générer des blocs aléatoires
  const generateRandomBlocks = () => {
    const chars = text.split('');
    const indices = [];

    // Créer 3-6 blocs aléatoires
    const numBlocks = 3 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numBlocks; i++) {
      const startIndex = Math.floor(Math.random() * chars.length);
      const blockLength = 2 + Math.floor(Math.random() * 8); // Blocs de 2 à 10 caractères

      for (let j = startIndex; j < Math.min(startIndex + blockLength, chars.length); j++) {
        if (chars[j] !== ' ') { // Ne pas bloquer les espaces
          indices.push(j);
        }
      }
    }

    setRedactedIndices(indices);
  };

  // Générer les blocs au chargement et animer automatiquement
  useEffect(() => {
    generateRandomBlocks();

    // Régénérer les blocs toutes les 2 secondes
    const interval = setInterval(() => {
      generateRandomBlocks();
    }, 2000);

    return () => clearInterval(interval);
  }, [text]);

  const handleMouseEnter = () => {
    // Régénérer les blocs au survol
    generateRandomBlocks();
  };

  const chars = text.split('');

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          style={{
            position: 'relative',
            display: 'inline-block',
            transition: 'all 0.2s ease',
            color: redactedIndices.includes(index) ? '#000000' : 'inherit',
            zIndex: 1,
          }}
        >
          {char}
          {redactedIndices.includes(index) && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: '#FFFFFF',
                zIndex: -1,
                pointerEvents: 'none',
              }}
            />
          )}
        </span>
      ))}
    </span>
  );
}
