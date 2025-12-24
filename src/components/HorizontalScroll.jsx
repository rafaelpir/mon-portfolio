import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll({ children, isDarkMode }) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!container || !scrollContainer) return;

    // Calculer la largeur totale du contenu horizontal
    const sections = scrollContainer.querySelectorAll('.horizontal-section');
    let totalWidth = 0;
    sections.forEach(section => {
      totalWidth += section.offsetWidth;
    });

    // Définir la hauteur du conteneur pour permettre le scroll
    gsap.set(container, {
      height: totalWidth,
    });

    // Animation du scroll horizontal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: scrollContainer,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Animer le translateX pour créer le scroll horizontal
    tl.to(scrollContainer, {
      x: () => -(totalWidth - window.innerWidth),
      ease: 'none',
    });

    // Ajouter des effets parallax avec rotation sur chaque section
    sections.forEach((section, index) => {
      const parallaxElements = section.querySelectorAll('[data-parallax]');

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const rotation = parseFloat(el.getAttribute('data-rotation')) || 0;

        gsap.to(el, {
          x: () => (section.offsetWidth * speed) * (index % 2 === 0 ? 1 : -1),
          rotation: rotation * (index % 2 === 0 ? 1 : -1),
          scrollTrigger: {
            trigger: section,
            start: 'left right',
            end: 'right left',
            scrub: 1,
            containerAnimation: tl,
          }
        });
      });
    });

    // Nettoyer lors du démontage
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="horizontal-scroll-wrapper">
      <div
        ref={scrollContainerRef}
        className="horizontal-scroll-container fixed top-0 left-0 h-screen flex"
      >
        {children}
      </div>
    </div>
  );
}
