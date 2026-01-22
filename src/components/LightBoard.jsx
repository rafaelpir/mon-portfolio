import React, { useState, useEffect, useMemo, useRef } from 'react';

// Font bitmap 5x7 - chaque valeur représente une ligne, bit 4 = gauche, bit 0 = droite
const FONT = {
  'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'B': [0b01111, 0b10001, 0b10001, 0b01111, 0b10001, 0b10001, 0b01111],
  'C': [0b01110, 0b10001, 0b00001, 0b00001, 0b00001, 0b10001, 0b01110],
  'D': [0b00111, 0b01001, 0b10001, 0b10001, 0b10001, 0b01001, 0b00111],
  'E': [0b11111, 0b00001, 0b00001, 0b01111, 0b00001, 0b00001, 0b11111],
  'F': [0b11111, 0b00001, 0b00001, 0b01111, 0b00001, 0b00001, 0b00001],
  'G': [0b01110, 0b10001, 0b00001, 0b11101, 0b10001, 0b10001, 0b01110],
  'H': [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'I': [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  'J': [0b11100, 0b01000, 0b01000, 0b01000, 0b01000, 0b01001, 0b00110],
  'K': [0b10001, 0b01001, 0b00101, 0b00011, 0b00101, 0b01001, 0b10001],
  'L': [0b00001, 0b00001, 0b00001, 0b00001, 0b00001, 0b00001, 0b11111],
  'M': [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  'N': [0b10001, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b10001],
  'O': [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'P': [0b01111, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b00001],
  'Q': [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b01001, 0b10110],
  'R': [0b01111, 0b10001, 0b10001, 0b01111, 0b00101, 0b01001, 0b10001],
  'S': [0b01110, 0b10001, 0b00001, 0b01110, 0b10000, 0b10001, 0b01110],
  'T': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'V': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  'W': [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  'X': [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  'Y': [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  'Z': [0b11111, 0b10000, 0b01000, 0b00100, 0b00010, 0b00001, 0b11111],
  '0': [0b01110, 0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b01110],
  '1': [0b00100, 0b00110, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b10000, 0b01000, 0b00100, 0b00010, 0b11111],
  '3': [0b01110, 0b10001, 0b10000, 0b01100, 0b10000, 0b10001, 0b01110],
  '4': [0b01000, 0b01100, 0b01010, 0b01001, 0b11111, 0b01000, 0b01000],
  '5': [0b11111, 0b00001, 0b01111, 0b10000, 0b10000, 0b10001, 0b01110],
  '6': [0b01100, 0b00010, 0b00001, 0b01111, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b10000, 0b01000, 0b00100, 0b00010, 0b00010, 0b00010],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b11110, 0b10000, 0b01000, 0b00110],
  ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  '-': [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
  '.': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00100],
  '!': [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
  ':': [0b00000, 0b00100, 0b00000, 0b00000, 0b00000, 0b00100, 0b00000],
  "'": [0b00100, 0b00100, 0b00010, 0b00000, 0b00000, 0b00000, 0b00000],
};

const CHAR_WIDTH = 5;
const CHAR_HEIGHT = 7;
const CHAR_SPACING = 1;

export default function LightBoard({
  text = "HELLO",
  rows = 7,
  gap = 1,
  lightSize = 3,
  font = "default",
  updateInterval = 100,
  colors = {
    background: "transparent",
    textDim: "rgba(255,255,255,0.1)",
    textBright: "#E8DCC4",
  },
  className = "",
}) {
  const [offset, setOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Observer la largeur du container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);
    setContainerWidth(container.offsetWidth);

    return () => resizeObserver.disconnect();
  }, []);

  // Convertir le texte en pattern (mémorisé)
  const { pattern, cols } = useMemo(() => {
    const upperText = text.toUpperCase();
    const totalWidth = upperText.length * (CHAR_WIDTH + CHAR_SPACING);
    const grid = Array(CHAR_HEIGHT).fill(null).map(() => Array(totalWidth).fill(0));

    let x = 0;
    for (const char of upperText) {
      const charData = FONT[char] || FONT[' '];
      for (let row = 0; row < CHAR_HEIGHT; row++) {
        const rowData = charData[row] || 0;
        for (let col = 0; col < CHAR_WIDTH; col++) {
          // Bit 0 = colonne 0 (gauche), Bit 4 = colonne 4 (droite)
          if (rowData & (1 << col)) {
            grid[row][x + col] = 1;
          }
        }
      }
      x += CHAR_WIDTH + CHAR_SPACING;
    }
    return { pattern: grid, cols: totalWidth };
  }, [text]);

  // Animation avec requestAnimationFrame pour fluidité
  useEffect(() => {
    let animationId;
    let lastTime = 0;

    const animate = (time) => {
      if (time - lastTime >= updateInterval) {
        setOffset(prev => (prev + 1) % cols);
        lastTime = time;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [cols, updateInterval]);

  // Rendu avec Canvas pour performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth === 0) return;

    const ctx = canvas.getContext('2d');
    const cellSize = lightSize + gap;
    const visibleCols = Math.ceil(containerWidth / cellSize);

    canvas.width = containerWidth;
    canvas.height = CHAR_HEIGHT * cellSize;

    // Background
    if (colors.background !== "transparent") {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (let row = 0; row < CHAR_HEIGHT; row++) {
      for (let col = 0; col < visibleCols; col++) {
        const patternCol = (col + offset) % cols;
        const isOn = pattern[row][patternCol];

        ctx.beginPath();
        ctx.arc(
          col * cellSize + lightSize / 2,
          row * cellSize + lightSize / 2,
          lightSize / 2,
          0,
          Math.PI * 2
        );

        if (isOn) {
          ctx.fillStyle = colors.textBright;
          ctx.shadowColor = colors.textBright;
          ctx.shadowBlur = lightSize * 2;
        } else {
          ctx.fillStyle = colors.textDim;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [pattern, cols, offset, lightSize, gap, colors, containerWidth]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
