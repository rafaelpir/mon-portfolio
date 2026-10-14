import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageFlip } from 'page-flip/dist/js/page-flip.module.js';
import { projects } from '../data/projects';
import { MUSEE_EXHIBITS } from '../data/museeExhibits';

// Ouverture du site : on feuillette le catalogue. Au centre, un vrai livre :
// les pages se courbent, se plient et retombent avec leurs ombres (moteur de
// feuilletage StPageFlip, licence MIT), de plus en plus vite, comme sous le
// pouce. Les pages ne montrent pas les œuvres : ce sont des pages de
// catalogue, avec numéro de planche, titre et année. Le nom est posé de part
// et d'autre. À la fin, la page de garde se lève et découvre la couverture.
// Pendant ce temps, <html> porte la classe `is-opening` : la couverture du
// site attend (voir index.css) et la page ne défile pas.
const VISIBLE = projects.filter((project) => !project.hidden);
// Le livre ne contient que les affiches (celles exposées au musée), chacune
// en pleine page avec une petite légende. Le numéro est celui de la planche
// dans le catalogue (le rang du projet sur le site).
const PLATES = MUSEE_EXHIBITS.map((exhibit) => {
  const index = VISIBLE.findIndex((project) => project.slug === exhibit.slug);
  const project = VISIBLE[index];
  return {
    number: String(index + 1).padStart(2, '0'),
    title: project?.shortTitle || project?.title || '',
    year: project?.year || '',
    image: `/images/musee/${exhibit.image}.webp`,
    wide: false,
  };
});

export default function CatalogueLoader({ onComplete, lang = 'fr' }) {
  const [phase, setPhase] = useState('ready'); // ready → riffle → leaving
  const [shown, setShown] = useState(0); // page de droite visible (index dans le livre)
  const [node, setNode] = useState(null);
  const bookRef = useRef(null);
  const done = useRef(onComplete);
  done.current = onComplete;
  const french = lang === 'fr';

  useEffect(() => {
    const element = document.createElement('div');
    document.documentElement.appendChild(element);
    document.documentElement.classList.add('is-opening');
    setNode(element);
    return () => {
      element.remove();
      document.documentElement.classList.remove('is-opening');
    };
  }, []);

  useEffect(() => {
    if (!node || !bookRef.current) return undefined;
    const book = bookRef.current;
    const pages = book.querySelectorAll('.opening-leaf');
    // aussi grand que possible, sans déborder sur le nom posé de part et d'autre
    const height = Math.round(Math.min(window.innerHeight * 0.58, 560, (window.innerWidth * 0.5) / ((2 * 848) / 1200)));
    const width = Math.round((height * 848) / 1200);
    const flip = new PageFlip(book, {
      width,
      height,
      size: 'fixed',
      showCover: true,
      usePortrait: false,
      drawShadow: true,
      maxShadowOpacity: 0.55,
      flippingTime: 820,
      useMouseEvents: false,
      mobileScrollSupport: false,
      autoSize: false,
    });
    flip.loadFromHTML(pages);
    const settings = flip.getSettings();
    const timers = [];
    let turns = 0;
    const last = pages.length - 3; // on s'arrête sur la double page de fin (« Bonne visite »)
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.push(
        setTimeout(() => {
          // Le nom quitte la page de garde pour rejoindre la couverture : on
          // note où se trouvent ses deux mots, la couverture part de là
          // (voir Cover dans Catalogue.jsx)
          window.__openingWords = [...document.querySelectorAll('.opening-word')].map((word) => word.getBoundingClientRect());
          setPhase('leaving');
          document.documentElement.classList.remove('is-opening');
        }, 450),
        setTimeout(() => done.current?.(), 1350)
      );
    };
    const next = () => {
      if (flip.getCurrentPageIndex() >= last) {
        finish();
        return;
      }
      turns += 1;
      // chaque page part plus vite que la précédente
      settings.flippingTime = Math.max(230, 820 * 0.8 ** turns);
      flip.flipNext('bottom');
    };
    flip.on('flip', (event) => {
      setShown(event.data);
      timers.push(setTimeout(next, turns < 3 ? 120 : 10));
    });

    Promise.race([document.fonts?.ready || Promise.resolve(), new Promise((resolve) => setTimeout(resolve, 600))]).then(() => {
      setPhase('riffle');
      timers.push(setTimeout(next, 450));
      timers.push(setTimeout(finish, 5200)); // secours
    });
    return () => {
      timers.forEach(clearTimeout);
      try {
        flip.destroy();
      } catch {
        /* déjà démonté */
      }
    };
  }, [node]);

  if (!node) return null;
  const plate = shown >= 1 && shown <= PLATES.length ? PLATES[shown - 1] : null;

  const leaf = (key, content, className = '') => (
    <div key={key} className={`opening-leaf ${className}`} data-density={className.includes('is-hard') ? 'hard' : 'soft'}>
      {/* le moteur de feuilletage impose son propre affichage à la feuille :
          la mise en page de la page est portée par ce bloc intérieur */}
      <div className="opening-leaf-inner">{content}</div>
    </div>
  );

  return createPortal(
    <div className={`opening is-${phase}`} role="status" aria-label={french ? 'Ouverture du site' : 'Opening'}>
      <div className="opening-sheet">
        <p className="catalogue-running">
          <span>Portfolio</span>
          <span>2024-2026</span>
        </p>

        <div className="opening-stage">
          <p className="opening-word is-left" aria-hidden="true">Rafael</p>
          <div className="opening-spread" aria-hidden="true">
            <div ref={bookRef} className="opening-flipbook">
              {leaf(
                'couverture',
                <>
                  <span className="opening-page-head">
                    <span>Portfolio</span>
                    <span>2026</span>
                  </span>
                  <span className="opening-page-cover-title">
                    {french ? 'Affiches' : 'Posters'}
                    <br />
                    2024-2026
                  </span>
                  <span className="opening-page-foot">Rafael Piral</span>
                </>,
                'is-hard is-cover'
              )}
              {PLATES.map((item) =>
                leaf(
                  item.number,
                  <>
                    {item.image && <img className={`opening-leaf-image ${item.wide ? 'is-wide' : ''}`} src={item.image} alt="" draggable={false} />}
                    <span className="opening-leaf-label">
                      <span>{item.number}</span>
                      <span>
                        {item.title}, {item.year}
                      </span>
                    </span>
                  </>
                )
              )}
              {leaf(
                'fin',
                <>
                  <span className="opening-page-head">
                    <span>Fin</span>
                    <span>2026</span>
                  </span>
                  <span className="opening-page-end">{french ? 'Bonne visite' : 'Enjoy the visit'}</span>
                  <span className="opening-page-foot">Rafael Piral</span>
                </>
              )}
              {leaf('dos', null, 'is-hard is-cover')}
            </div>
          </div>
          <p className="opening-word is-right" aria-hidden="true">Piral</p>
        </div>

        <div className="opening-caption" aria-hidden="true">
          <span>{plate ? `${french ? 'Affiche' : 'Poster'} ${String(shown).padStart(2, '0')} / ${String(PLATES.length).padStart(2, '0')}` : french ? 'Couverture' : 'Cover'}</span>
          <span>{plate ? `${plate.title}, ${plate.year}` : french ? 'Affiches 2024-2026' : 'Posters 2024-2026'}</span>
          <span>{french ? 'Créations 2024-2026' : 'Works 2024-2026'}</span>
        </div>
      </div>
    </div>,
    node
  );
}
