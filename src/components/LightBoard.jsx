import React, { useState, useEffect, useMemo, useRef } from 'react';

// Font bitmap pour les caractères (5x7 pixels)
const FONT = {
  'A': [0x04,0x0A,0x11,0x11,0x1F,0x11,0x11],
  'B': [0x0F,0x11,0x11,0x0F,0x11,0x11,0x0F],
  'C': [0x0E,0x11,0x01,0x01,0x01,0x11,0x0E],
  'D': [0x07,0x09,0x11,0x11,0x11,0x09,0x07],
  'E': [0x1F,0x01,0x01,0x0F,0x01,0x01,0x1F],
  'F': [0x1F,0x01,0x01,0x0F,0x01,0x01,0x01],
  'G': [0x0E,0x11,0x01,0x1D,0x11,0x11,0x0E],
  'H': [0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  'I': [0x0E,0x04,0x04,0x04,0x04,0x04,0x0E],
  'J': [0x1C,0x08,0x08,0x08,0x08,0x09,0x06],
  'K': [0x11,0x09,0x05,0x03,0x05,0x09,0x11],
  'L': [0x01,0x01,0x01,0x01,0x01,0x01,0x1F],
  'M': [0x11,0x1B,0x15,0x15,0x11,0x11,0x11],
  'N': [0x11,0x11,0x13,0x15,0x19,0x11,0x11],
  'O': [0x0E,0x11,0x11,0x11,0x11,0x11,0x0E],
  'P': [0x0F,0x11,0x11,0x0F,0x01,0x01,0x01],
  'Q': [0x0E,0x11,0x11,0x11,0x15,0x09,0x16],
  'R': [0x0F,0x11,0x11,0x0F,0x05,0x09,0x11],
  'S': [0x0E,0x11,0x01,0x0E,0x10,0x11,0x0E],
  'T': [0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
  'U': [0x11,0x11,0x11,0x11,0x11,0x11,0x0E],
  'V': [0x11,0x11,0x11,0x11,0x11,0x0A,0x04],
  'W': [0x11,0x11,0x11,0x15,0x15,0x15,0x0A],
  'X': [0x11,0x11,0x0A,0x04,0x0A,0x11,0x11],
  'Y': [0x11,0x11,0x0A,0x04,0x04,0x04,0x04],
  'Z': [0x1F,0x10,0x08,0x04,0x02,0x01,0x1F],
  '0': [0x0E,0x11,0x19,0x15,0x13,0x11,0x0E],
  '1': [0x04,0x06,0x04,0x04,0x04,0x04,0x0E],
  '2': [0x0E,0x11,0x10,0x08,0x04,0x02,0x1F],
  '3': [0x0E,0x11,0x10,0x0C,0x10,0x11,0x0E],
  '4': [0x08,0x0C,0x0A,0x09,0x1F,0x08,0x08],
  '5': [0x1F,0x01,0x0F,0x10,0x10,0x11,0x0E],
  '6': [0x0C,0x02,0x01,0x0F,0x11,0x11,0x0E],
  '7': [0x1F,0x10,0x08,0x04,0x02,0x02,0x02],
  '8': [0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E],
  '9': [0x0E,0x11,0x11,0x1E,0x10,0x08,0x06],
  ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00],
  '-': [0x00,0x00,0x00,0x1F,0x00,0x00,0x00],
  '.': [0x00,0x00,0x00,0x00,0x00,0x00,0x04],
  '!': [0x04,0x04,0x04,0x04,0x04,0x00,0x04],
  ':': [0x00,0x04,0x00,0x00,0x00,0x04,0x00],
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
          if (rowData & (1 << col)) {
            grid[row][x + (CHAR_WIDTH - 1 - col)] = 1;
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
