import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useDimensions } from "../../hooks/use-debounced-dimensions";

// Fonction utilitaire pour combiner les classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Générateur d'ID unique simple
function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

const PixelTrail = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
  autoAnimate = true,
  autoAnimateInterval = 100,
}) => {
  const containerRef = useRef(null);
  const dimensions = useDimensions(containerRef);
  const trailId = useRef(generateId());
  const pixelRefs = useRef({});

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  );
  const rows = useMemo(
    () => Math.max(0, Math.ceil(dimensions.height / pixelSize) - 1),
    [dimensions.height, pixelSize]
  );

  // Animation automatique
  useEffect(() => {
    if (!autoAnimate || columns === 0 || rows === 0) return;

    const interval = setInterval(() => {
      // Animer 2-4 pixels aléatoires à chaque intervalle
      const numPixels = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numPixels; i++) {
        const randomX = Math.floor(Math.random() * columns);
        const randomY = Math.floor(Math.random() * rows);
        const pixelElement = document.getElementById(
          `${trailId.current}-pixel-${randomX}-${randomY}`
        );
        if (pixelElement && pixelElement.__animatePixel) {
          pixelElement.__animatePixel();
        }
      }
    }, autoAnimateInterval);

    return () => clearInterval(interval);
  }, [autoAnimate, autoAnimateInterval, columns, rows]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / pixelSize);
      const y = Math.floor((e.clientY - rect.top) / pixelSize);

      const pixelElement = document.getElementById(
        `${trailId.current}-pixel-${x}-${y}`
      );
      if (pixelElement) {
        const animatePixel = pixelElement.__animatePixel;
        if (animatePixel) animatePixel();
      }
    },
    [pixelSize]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const PixelDot = React.memo(
  ({ id, size, fadeDuration, delay, className }) => {
    const controls = useAnimationControls();

    const animatePixel = useCallback(() => {
      controls.start({
        opacity: [1, 0],
        transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
      });
    }, [controls, fadeDuration, delay]);

    // Attach the animatePixel function to the DOM element
    const ref = useCallback(
      (node) => {
        if (node) {
          node.__animatePixel = animatePixel;
        }
      },
      [animatePixel]
    );

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("cursor-pointer-none rounded-full", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    );
  }
);

PixelDot.displayName = "PixelDot";

export { PixelTrail };
