import React, { useState } from 'react';

export default function ShuffleText({ children, className = '', style = {}, enabled = false, fontFamily = 'Satoshi' }) {
  const fontWeights = ['300', '400', '500', '600', '700', '800'];
  const fontStyles = ['normal', 'italic'];

  const getRandomWeight = () => fontWeights[Math.floor(Math.random() * fontWeights.length)];
  const getRandomStyle = () => fontStyles[Math.floor(Math.random() * fontStyles.length)];

  // Initialiser avec des poids et styles aléatoires pour chaque lettre
  const text = String(children);
  const [letterStyles, setLetterStyles] = useState(
    text.split('').map(() => ({
      weight: getRandomWeight(),
      style: getRandomStyle()
    }))
  );

  const handleMouseEnter = () => {
    if (!enabled) return;
    // Shuffle les poids et styles au survol
    setLetterStyles(text.split('').map(() => ({
      weight: getRandomWeight(),
      style: getRandomStyle()
    })));
  };

  // Si les effets sont désactivés, retourner le texte simple
  if (!enabled) {
    return (
      <span className={className} style={{ ...style, fontFamily }}>
        {text}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ ...style, pointerEvents: 'auto' }}
      onMouseEnter={handleMouseEnter}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            fontFamily,
            fontWeight: letterStyles[index].weight,
            fontStyle: letterStyles[index].style,
            transition: 'font-weight 0.3s ease, font-style 0.3s ease',
            display: 'inline-block'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
