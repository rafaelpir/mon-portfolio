import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Œuvre du musée ouverte en grand. Elle se décroche du mur : l'image part de
// la place exacte de l'affiche à l'écran (rectOf, projection de la salle 3D)
// et vient au centre ; à la fermeture, elle y retourne. ← → passent d'une
// œuvre à l'autre (la caméra suit derrière), Échap ou un clic referme.
const EASE_OPEN = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_CLOSE = 'cubic-bezier(0.55, 0, 0.45, 1)';

// Transformation qui amène le rectangle `to` (position finale) sur `from`
const flyFrom = (from, to) =>
  `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;

export default function MuseeLightbox({ exhibits, index, onIndex, onClose, rectOf, T }) {
  const exhibit = exhibits[index];
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const mediaRef = useRef(null);
  const captionRef = useRef(null);
  const closeRef = useRef(null);
  const closing = useRef(false);
  const direction = useRef(0); // sens du dernier passage d'œuvre (pour l'entrée)
  const [hdReady, setHdReady] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ouverture : décrochage depuis le mur
  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    closeRef.current?.focus({ preventScroll: true });
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 1 : 420, easing: 'ease', fill: 'both' });
    const from = rectOf?.(index);
    const to = media.getBoundingClientRect();
    if (!reduced && from && to.width) {
      media.animate([{ transform: flyFrom(from, to) }, { transform: 'none' }], { duration: 720, easing: EASE_OPEN, fill: 'both' });
    } else if (!reduced) {
      media.animate([{ transform: 'scale(0.94)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: EASE_OPEN, fill: 'both' });
    }
    captionRef.current?.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: reduced ? 1 : 500, delay: reduced ? 0 : 320, easing: EASE_OPEN, fill: 'both' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Passage à une autre œuvre : glissement dans le sens de la navigation
  const first = useRef(true);
  useLayoutEffect(() => {
    setHdReady(false);
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    const shift = direction.current * 60;
    mediaRef.current?.animate([{ opacity: 0, transform: `translateX(${shift}px)` }, { opacity: 1, transform: 'none' }], { duration: 480, easing: EASE_OPEN, fill: 'both' });
    captionRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 80, easing: 'ease', fill: 'both' });
  }, [index, reduced]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const root = rootRef.current;
    const media = mediaRef.current;
    if (reduced || !root || !media) {
      onClose();
      return;
    }
    const to = media.getBoundingClientRect();
    const from = rectOf?.(index);
    captionRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease', fill: 'both' });
    const flight = from && to.width
      ? media.animate([{ transform: 'none' }, { transform: flyFrom(from, to) }], { duration: 520, easing: EASE_CLOSE, fill: 'both' })
      : media.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(0.94)', opacity: 0 }], { duration: 300, easing: EASE_CLOSE, fill: 'both' });
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: from ? 520 : 300, easing: 'ease-in', fill: 'both' });
    root.querySelectorAll('.musee-lightbox-nav, .musee-lightbox-close').forEach((button) => button.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'both' }));
    flight.onfinish = onClose;
  };

  const go = (delta) => {
    direction.current = delta;
    onIndex((index + delta + exhibits.length) % exhibits.length);
  };

  // Clavier : Échap referme, ← → changent d'œuvre
  const keys = useRef({});
  keys.current = { close, go };
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') keys.current.close();
      else if (event.key === 'ArrowRight') keys.current.go(1);
      else if (event.key === 'ArrowLeft') keys.current.go(-1);
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  const stop = (event) => event.stopPropagation();
  const label = `${exhibit.video ? T('Vidéo', 'Video') : T('Affiche', 'Poster')} : ${exhibit.title}`;

  return (
    <div ref={rootRef} className="musee-lightbox" role="dialog" aria-modal="true" aria-label={label} onClick={close}>
      <div ref={backdropRef} className="musee-lightbox-backdrop" aria-hidden="true" />
      <figure className="musee-lightbox-figure">
        <div ref={mediaRef} className="musee-lightbox-media">
          {exhibit.video ? (
            <video key={exhibit.image} src={exhibit.video} poster={exhibit.src} autoPlay loop muted playsInline aria-label={label} style={{ '--ratio': exhibit.videoRatio || 0.8 }} />
          ) : (
            <>
              {/* image légère, déjà chargée par la salle, puis la version HD par-dessus */}
              <img key={`${exhibit.image}-sd`} src={exhibit.src} alt={label} draggable={false} />
              <img
                key={`${exhibit.image}-hd`}
                src={exhibit.srcHd}
                alt=""
                aria-hidden="true"
                draggable={false}
                className={`musee-lightbox-hd ${hdReady ? 'is-ready' : ''}`}
                onLoad={() => setHdReady(true)}
              />
            </>
          )}
        </div>
        <figcaption ref={captionRef} className="musee-lightbox-caption" onClick={stop}>
          <span className="musee-lightbox-number">
            {String(index + 1).padStart(2, '0')} / {String(exhibits.length).padStart(2, '0')}
          </span>
          <span className="musee-lightbox-title">{exhibit.title}</span>
          <span className="musee-lightbox-meta">
            {exhibit.note || exhibit.category} · {exhibit.year}
          </span>
          <Link to={`/work/${exhibit.slug}`} className="musee-lightbox-link">
            {T('Voir le projet', 'See the project')} →
          </Link>
        </figcaption>
      </figure>

      <button type="button" className="musee-lightbox-nav is-prev" onClick={(event) => { stop(event); go(-1); }} aria-label={T('Œuvre précédente', 'Previous work')}>
        ←
      </button>
      <button type="button" className="musee-lightbox-nav is-next" onClick={(event) => { stop(event); go(1); }} aria-label={T('Œuvre suivante', 'Next work')}>
        →
      </button>
      <button ref={closeRef} type="button" className="musee-lightbox-close" onClick={(event) => { stop(event); close(); }} aria-label={T('Fermer', 'Close')}>
        ✕
      </button>
    </div>
  );
}
