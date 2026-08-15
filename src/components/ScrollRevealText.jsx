import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

// Révèle un bloc de texte ligne par ligne au fil du scroll (masque + slide up).
export default function ScrollRevealText({ as: Tag = 'p', className = '', children }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    let split;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = SplitText.create(textEl, {
        type: 'words,lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit: (instance) => {
          return gsap.from(instance.lines, {
            yPercent: 120,
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              scrub: true,
              // "top center"/"bottom center" ne marche que pour un conteneur plus
              // haut que la moitié de l'écran ; ici chaque paragraphe est court,
              // donc son bas atteint le centre avant son haut (end < start).
              // "top bottom" → "center center" reste toujours dans le bon ordre.
              start: 'top bottom',
              end: 'center center',
            },
          });
        },
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Tag ref={textRef} className={className}>
        {children}
      </Tag>
    </div>
  );
}
