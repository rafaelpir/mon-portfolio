import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { horizontalLoop } from '../utils/horizontalLoop';
import './ProjectsOsmoSlider.css';

// Port du demo Osmo "Infinite slider" (https://osmo.supply/) : slider
// horizontal en boucle infinie, draggable, avec compteur animé et boutons
// prev/next. Adapté pour la liste de projets : cliquer la slide déjà active
// (centrée) ouvre la fiche projet ; cliquer une slide inactive la centre
// d'abord, comme dans le demo original.

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const FALLBACK_RATIO = 1.5;

export default function ProjectsOsmoSlider({ projects, isDarkMode = true }) {
  const navigate = useNavigate();
  const slideRefs = useRef([]);
  const stepRefs = useRef([]);
  const loopRef = useRef(null);
  const activeElRef = useRef(null);
  const activeIndexRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [ratios, setRatios] = useState({});

  // Précharge chaque image hors DOM pour connaître son ratio réel avant de
  // dimensionner les slides (height fixe, width = height * ratio via
  // `aspect-ratio`) : chaque image garde sa forme d'origine, sans recadrage.
  useEffect(() => {
    let cancelled = false;
    let remaining = projects.length;
    if (remaining === 0) { setIsLoading(false); return undefined; }
    const results = {};
    const onSettled = (i, ratio) => {
      results[i] = ratio;
      remaining -= 1;
      if (remaining <= 0 && !cancelled) {
        setRatios({ ...results });
        setIsLoading(false);
      }
    };
    projects.forEach((project, i) => {
      const img = new Image();
      img.onload = () => onSettled(i, img.naturalWidth / img.naturalHeight);
      img.onerror = () => onSettled(i, FALLBACK_RATIO);
      img.src = project.thumbnail;
    });
    return () => { cancelled = true; };
  }, [projects]);

  useEffect(() => {
    if (isLoading) return undefined;
    const slides = slideRefs.current.filter(Boolean);
    if (slides.length === 0) return undefined;

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: true,
      center: false,
      onChange: (element, index) => {
        activeElRef.current?.classList.remove('active');
        const nextIndex = (index + 1) % slides.length;
        const nextEl = slides[nextIndex];
        nextEl.classList.add('active');
        activeElRef.current = nextEl;
        activeIndexRef.current = nextIndex;
        gsap.to(stepRefs.current, { y: `${-100 * index}%`, ease: 'power3', duration: 0.45 });
      },
    });
    loopRef.current = loop;

    return () => loop.cleanup?.();
  }, [isLoading, projects]);

  const handleSlideClick = (i) => {
    if (activeIndexRef.current === i) {
      navigate(`/work/${projects[i].slug}`);
    } else {
      loopRef.current?.toIndex(i - 1, { ease: 'power3', duration: 0.725 });
    }
  };

  return (
    <div
      className="osmo-slider"
      style={{
        '--color-text': isDarkMode ? '#E5E5E5' : '#141414',
        '--color-bg': isDarkMode ? '#000000' : '#E5E5E5',
      }}
    >
      <section className="cloneable">
        <div className="overlay">
          <div className="overlay-inner">
            <div className="overlay-count-row">
              <div className="count-column">
                {projects.map((_, i) => (
                  <h2 key={i} ref={el => (stepRefs.current[i] = el)} className="count-heading">
                    {pad(i + 1)}
                  </h2>
                ))}
              </div>
              <div className="count-row-divider" />
              <div className="count-column">
                <h2 className="count-heading">{pad(projects.length)}</h2>
              </div>
            </div>

            <div className="overlay-nav-row">
              <button
                type="button"
                aria-label="Projet précédent"
                className="button"
                onClick={() => loopRef.current?.previous({ ease: 'power3', duration: 0.725 })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="button-arrow">
                  <path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" />
                </svg>
                <div className="button-overlay">
                  <div className="overlay-corner" />
                  <div className="overlay-corner top-right" />
                  <div className="overlay-corner bottom-left" />
                  <div className="overlay-corner bottom-right" />
                </div>
              </button>
              <button
                type="button"
                aria-label="Projet suivant"
                className="button"
                onClick={() => loopRef.current?.next({ ease: 'power3', duration: 0.725 })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="button-arrow next">
                  <path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" />
                </svg>
                <div className="button-overlay">
                  <div className="overlay-corner" />
                  <div className="overlay-corner top-right" />
                  <div className="overlay-corner bottom-left" />
                  <div className="overlay-corner bottom-right" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="slider-wrap">
            {!isLoading && (
              <div data-slider="list" className="slider-list">
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    ref={el => (slideRefs.current[i] = el)}
                    data-slider="slide"
                    className="slider-slide"
                    style={{ aspectRatio: ratios[i] || FALLBACK_RATIO }}
                    onClick={() => handleSlideClick(i)}
                  >
                    <div className="slide-inner">
                      <img src={project.thumbnail} loading="lazy" alt={project.title} />
                      <div className="slide-caption">
                        <div className="caption-dot" />
                        <p className="caption">{project.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
