import { useEffect, useMemo, useRef } from 'react';

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
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
          if (rowData & (1 << col)) {
            grid[row][x + col] = 1;
          }
        }
      }
      x += CHAR_WIDTH + CHAR_SPACING;
    }
    return { pattern: grid, cols: totalWidth };
  }, [text]);

  // Animation RAF directe  zéro re-render React
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let offset = 0;
    let lastTick = 0;
    let animId;
    const stopped = updateInterval <= 0;

    function draw(width) {
      const cellSize = lightSize + gap;
      const halfLight = lightSize / 2;
      const visibleCols = Math.ceil(width / cellSize);

      canvas.width = width;
      canvas.height = CHAR_HEIGHT * cellSize;

      if (colors.background !== "transparent") {
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, width, canvas.height);
      } else {
        ctx.clearRect(0, 0, width, canvas.height);
      }

      // fillRect au lieu de arc()  beaucoup moins coûteux
      for (let row = 0; row < CHAR_HEIGHT; row++) {
        for (let col = 0; col < visibleCols; col++) {
          const patternCol = (col + offset) % cols;
          ctx.fillStyle = pattern[row][patternCol] ? colors.textBright : colors.textDim;
          ctx.fillRect(
            col * cellSize,
            row * cellSize,
            lightSize,
            lightSize
          );
        }
      }
    }

    // Dessin initial
    let currentWidth = container.offsetWidth;
    if (currentWidth > 0) draw(currentWidth);

    // Observer la taille du container
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        currentWidth = entry.contentRect.width;
        if (currentWidth > 0) draw(currentWidth);
      }
    });
    resizeObserver.observe(container);

    // Boucle d'animation sans setState
    if (!stopped) {
      const loop = (timestamp) => {
        if (timestamp - lastTick >= updateInterval) {
          lastTick = timestamp;
          offset = (offset + 1) % cols;
          if (currentWidth > 0) draw(currentWidth);
        }
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }

    return () => {
      resizeObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [pattern, cols, lightSize, gap, colors, updateInterval]);

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
