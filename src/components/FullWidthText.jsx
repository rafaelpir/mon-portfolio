import { useRef, useLayoutEffect, useState } from 'react';

// Ajuste le letter-spacing (pas de déformation des lettres, contrairement
// à un scaleX) pour que le texte occupe exactement toute la largeur de
// son conteneur, quelle que soit sa longueur. La largeur naturelle est
// mesurée sur un clone invisible (jamais touché par React) pour éviter
// tout conflit entre mutation DOM directe et re-render React.
export default function FullWidthText({ text, tag: Tag = 'span', className = '', style = {}, charFontOverrides = {} }) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [letterSpacing, setLetterSpacing] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const measureEl = measureRef.current;
      if (!container || !measureEl) return;
      const containerWidth = container.offsetWidth;
      const naturalWidth = measureEl.scrollWidth;
      const charCount = text.length;
      if (charCount > 0 && containerWidth > 0) {
        setLetterSpacing((containerWidth - naturalWidth) / charCount);
      }
    };

    measure();
    // Les polices custom se chargent après le premier rendu : la mesure
    // initiale se fait sur la police de secours, il faut remesurer une
    // fois la vraie police prête pour avoir la bonne largeur.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [text]);

  return (
    <Tag ref={containerRef} className={`block overflow-hidden relative ${className}`} style={style}>
      <span className="inline-block whitespace-nowrap" style={{ letterSpacing: `${letterSpacing}px` }}>
        {text.split('').map((char, i) => {
          const override = charFontOverrides[i];
          if (!override) return char;
          const { fontFamily, scale = 1, fontWeight } =
            typeof override === 'string' ? { fontFamily: override } : override;
          return (
            <span key={i} style={{ fontFamily, fontWeight, fontSize: scale !== 1 ? `${scale}em` : undefined }}>
              {char}
            </span>
          );
        })}
      </span>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="absolute inline-block whitespace-nowrap invisible pointer-events-none"
        style={{ left: 0, top: 0, letterSpacing: '0px' }}
      >
        {text}
      </span>
    </Tag>
  );
}
