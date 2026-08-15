import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DualWaveAnimation } from '../utils/dualWaveAnimation';
import { preloadImages } from '../utils/preloadImages';
import './ProjectsDualWave.css';

// Mise en place du demo Codrops "Dual Wave Text Animation"
// (~/Downloads/codrops-tutorial-text-animation-main) : deux colonnes de
// titres oscillent au scroll, le texte au centre du viewport pilote une
// miniature qui suit le scroll. Animation (dualWaveAnimation.js), preload
// (preloadImages.js) et style (ProjectsDualWave.css) sont une copie fidèle
// du demo, non modifiés — seule la source des données change : colonne
// gauche = titre du projet (relié à sa miniature via data-image), colonne
// droite = catégorie, alignées par index comme dans le demo original
// (codename produit / vraie marque).
//
// Init calquée sur src/main.js du demo : attendre preloadImages() avant
// d'appeler animation.init() (comme main.js), avec une classe "loading" le
// temps du chargement (comme body.loading dans le demo — voir css/base.css
// pour l'overlay). Seule différence volontaire : pas de ScrollSmoother.
// main.js appelle `ScrollSmoother.create({smooth:1.5, normalizeScroll:true})`
// qui prend le scroll de TOUTE la page en charge (wrapper #smooth-wrapper/
// #smooth-content). Le site utilise déjà Lenis pour le scroll fluide de
// toute la Home (ReactLenis + LenisScrollTriggerBridge, voir Home.jsx) :
// activer ScrollSmoother en plus ferait competer deux systèmes de scroll
// fluide sur le même document et casserait le scroll du reste du site.
// ScrollTrigger (utilisé par DualWaveAnimation) reste inchangé et reçoit
// déjà ses mises à jour de scroll via ce pont Lenis existant.

export default function ProjectsDualWave({ projects }) {
  const wrapperRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!wrapperRef.current || projects.length === 0) return undefined;
    let cancelled = false;
    const animation = new DualWaveAnimation(wrapperRef.current);

    preloadImages('.dual-wave-wrapper').then(() => {
      if (cancelled) return;
      setIsLoading(false);
      animation.init();
    });

    return () => {
      cancelled = true;
      animation.destroy();
    };
  }, [projects]);

  return (
    <div className="dual-wave">
      <div
        ref={wrapperRef}
        className={`dual-wave-wrapper${isLoading ? ' loading' : ''}`}
        data-wave-number="12"
        data-wave-speed="1"
      >
        <div className="wave-column wave-column-left">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/work/${project.slug}`}
              className="animated-text"
              data-image={project.thumbnail}
            >
              {project.shortTitle || project.title}
              {project.isNew && (
                <span className="dual-wave-badge">
                  <span className="dual-wave-badge-dot" />
                  Nouveau
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="image-thumbnail-wrapper">
          <img src={projects[0]?.thumbnail} alt="" className="image-thumbnail" decoding="async" />
        </div>

        <div className="wave-column wave-column-right">
          {projects.map(project => (
            <Link key={project.id} to={`/work/${project.slug}`} className="animated-text">
              {project.category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
