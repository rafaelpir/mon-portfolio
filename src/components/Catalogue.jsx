import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { PLATE_COVERS } from '../data/displayImages';

// Le site est pensé comme le catalogue de l'exposition (le musée en 3D,
// /musee, étant l'exposition elle-même). Ces éléments lui donnent sa mise en
// page d'ouvrage : chapitres numérotés, sommaire, folio.

// Chapitres de l'accueil, dans l'ordre de lecture. `id` : ancre de la section ;
// `page` : sa page dans le catalogue ; `to` : lien vers une autre page du site.
export const CHAPTERS = [
  { number: '01', id: 'about', page: '04', fr: 'Avant-propos', en: 'Foreword' },
  { number: '02', id: 'projects', page: '08', fr: 'Œuvres', en: 'Works' },
  { number: '03', id: 'exposition', page: '22', fr: "Visiter l'exposition", en: 'Visit the exhibition', to: '/musee', note: '3D' },
  { number: '04', id: 'skills', page: '24', fr: 'Savoir-faire', en: 'Skills' },
  { number: '05', id: 'parcours', page: '28', fr: 'Parcours', en: 'Background' },
  { number: '06', id: 'contact', page: '34', fr: 'Contact', en: 'Contact' },
];
export const chapter = (id) => CHAPTERS.find((item) => item.id === id);

// Ouverture de chapitre : filet, numéro, titre, page. Hérite de la couleur du
// texte de sa section (claire ou sombre).
export function ChapterHeading({ id, lang = 'fr', className = '', as: Title = 'h2' }) {
  const item = chapter(id);
  if (!item) return null;
  return (
    <div className={`catalogue-chapter ${className}`} data-m-reveal>
      <span className="catalogue-chapter-number">{item.number}</span>
      <Title className="catalogue-chapter-title">{item[lang] || item.fr}</Title>
      <span className="catalogue-chapter-page">p. {item.page}</span>
    </div>
  );
}

// Planches de la couverture : quatre affiches qui se succèdent, chacune avec
// sa légende. `image` : fichier dans public/images/musee/hd/.
const COVER_PLATES = [
  { image: 'homme-qui-dort', slug: 'un-homme-qui-dort' },
  { image: 'monaco', slug: 'grand-prix-monaco' },
  { image: 'gummo', slug: 'affiche-gummo' },
  { image: 'kaka', slug: 'affiche-kaka' },
].map((plate) => {
  const project = projects.find((item) => item.slug === plate.slug);
  return { ...plate, title: project?.shortTitle || project?.title || '', year: project?.year || '' };
});

// Couverture du catalogue (ordinateur) : à gauche le titre et le texte de
// quatrième de couverture, à droite une planche qui change toutes les cinq
// secondes. Le nom se compose lettre à lettre à l'arrivée.
export function Cover({ lang = 'fr', isDarkMode, onGo, children }) {
  const [plate, setPlate] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => setPlate((index) => (index + 1) % COVER_PLATES.length), 5000);
    return () => clearInterval(timer);
  }, []);
  const french = lang === 'fr';
  const current = COVER_PLATES[plate];

  return (
    <div className={`cover ${isDarkMode ? 'text-beige' : 'text-black'}`}>
      <p className="catalogue-running cover-fade" style={{ '--d': '0.1s' }}>
        <span>{french ? "Catalogue d'exposition" : 'Exhibition catalogue'}</span>
        <span>N° 01 · 2026</span>
      </p>

      <div className="cover-grid">
        <div className="cover-title">
          <h1 aria-label="Rafael Piral">
            {['Rafael', 'Piral'].map((word, line) => (
              <span key={word} className="cover-line" aria-hidden="true">
                {[...word].map((letter, index) => (
                  <span key={index} className="cover-letter" style={{ '--d': `${0.15 + line * 0.2 + index * 0.05}s` }}>
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="cover-subtitle cover-fade" style={{ '--d': '0.75s' }}>
            {french ? 'Créations 2024-2026' : 'Works 2024-2026'}
          </p>
          <div className="cover-text cover-fade" style={{ '--d': '0.9s' }}>
            {children}
          </div>
          <div className="cover-links cover-fade" style={{ '--d': '1.05s' }}>
            <button type="button" onClick={() => onGo('projects')}>
              {french ? 'Feuilleter le catalogue' : 'Browse the catalogue'} ↓
            </button>
            <Link to="/musee">{french ? "Visiter l'exposition" : 'Visit the exhibition'} →</Link>
          </div>
        </div>

        <figure className="cover-plate cover-fade" style={{ '--d': '0.5s' }}>
          <Link to={`/work/${current.slug}`} className="cover-plate-frame" aria-label={`${current.title}, ${current.year}`}>
            {COVER_PLATES.map((item, index) => (
              <img key={item.image} src={`/images/musee/hd/${item.image}.webp`} alt="" className={index === plate ? 'is-shown' : ''} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
            ))}
          </Link>
          <figcaption>
            <span>
              fig. {plate + 1} · {current.title}, {current.year}
            </span>
            <span>
              {String(plate + 1).padStart(2, '0')} / {String(COVER_PLATES.length).padStart(2, '0')}
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

// Sommaire, en double page : à gauche le titre et la notice de l'ouvrage, à
// droite une ligne par chapitre, points de conduite jusqu'au numéro de page.
export function Sommaire({ lang = 'fr', onGo, isDarkMode }) {
  const french = lang === 'fr';
  return (
    <section className={`catalogue-sommaire ${isDarkMode ? 'text-beige' : 'text-black'}`} aria-label={french ? 'Sommaire' : 'Contents'}>
      <p className="catalogue-running" data-m-reveal>
        <span>{french ? 'Sommaire' : 'Contents'}</span>
        <span>p. 02</span>
      </p>
      <div className="catalogue-sommaire-spread">
        <div className="catalogue-sommaire-side" data-m-reveal>
          <p className="catalogue-sommaire-heading">{french ? 'Sommaire' : 'Contents'}</p>
          <dl>
            <div>
              <dt>{french ? 'Ouvrage' : 'Volume'}</dt>
              <dd>{french ? "Catalogue d'exposition n° 01" : 'Exhibition catalogue no. 01'}</dd>
            </div>
            <div>
              <dt>{french ? 'Contenu' : 'Contents'}</dt>
              <dd>{french ? `${projects.filter((item) => !item.hidden).length} planches, ${CHAPTERS.length} chapitres` : `${projects.filter((item) => !item.hidden).length} plates, ${CHAPTERS.length} chapters`}</dd>
            </div>
            <div>
              <dt>{french ? 'Édition' : 'Edition'}</dt>
              <dd>{french ? 'En ligne, Paris, 2026' : 'Online, Paris, 2026'}</dd>
            </div>
          </dl>
        </div>
        <ol>
          {CHAPTERS.map((item) => {
            const inner = (
              <>
                <span className="catalogue-sommaire-number">{item.number}</span>
                <span className="catalogue-sommaire-title">{item[lang] || item.fr}</span>
                <span className="catalogue-sommaire-dots" aria-hidden="true" />
                <span className="catalogue-sommaire-page">{item.note || `p. ${item.page}`}</span>
              </>
            );
            return (
              <li key={item.id} data-m-reveal>
                {item.to ? (
                  <Link to={item.to}>{inner}</Link>
                ) : (
                  <button type="button" onClick={() => onGo(item.id)}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// Avant-propos : mise en page de livre. Une note en marge à gauche ; à droite
// un premier paragraphe en grand avec sa lettrine, la suite sur deux colonnes,
// puis la signature et le renvoi à l'annexe.
export function Foreword({ lang = 'fr', paragraphs }) {
  const french = lang === 'fr';
  const [lead, ...rest] = paragraphs;
  return (
    <div className="foreword">
      <aside className="foreword-margin" data-m-reveal>
        <p>{french ? "Note de l'auteur" : "Author's note"}</p>
        <p>Paris, 2026</p>
      </aside>
      <div className="foreword-body">
        <p className="foreword-lead" data-m-reveal>
          {lead}
        </p>
        <div className="foreword-columns" data-m-reveal>
          {rest.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="foreword-end" data-m-reveal>
          <p className="foreword-signature">Rafael Piral</p>
          <Link to="/about">{french ? "Lire l'annexe : l'auteur" : 'Read the appendix: the author'} →</Link>
        </div>
      </div>
    </div>
  );
}

// Chapitre « Œuvres » sur grand écran : les planches du catalogue, en grille.
// Chaque planche porte son numéro, son image, son titre et sa légende.
export function Plates({ items, lang = 'fr' }) {
  const french = lang === 'fr';
  if (items.length === 0) return <p className="plates-empty">{french ? 'Aucune planche pour ce filtre.' : 'No plate matches this filter.'}</p>;
  return (
    <ol className="plates">
      {items.map((item) => {
        const cover = PLATE_COVERS[item.slug];
        const number = projects.filter((project) => !project.hidden).findIndex((project) => project.id === item.id) + 1;
        return (
          <li key={item.id}>
            <Link to={item.slug ? `/work/${item.slug}` : `/project/${item.id}`} className="plate-card">
              <span className="plate-card-top">
                <span>
                  {french ? 'Planche' : 'Plate'} {String(number).padStart(2, '0')}
                </span>
                <span>{item.year}</span>
              </span>
              <span className={`plate-card-image ${cover?.wide || cover?.ratio > 1.15 ? 'is-wide' : ''}`}>
                {cover && <img src={cover.src} alt="" loading="lazy" decoding="async" draggable={false} />}
              </span>
              <span className="plate-card-title">{item.shortTitle || item.title}</span>
              <span className="plate-card-caption">{item.category}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

// Chapitre « Savoir-faire » : une liste typographique par domaine, comme un
// index d'ouvrage, à la place d'un défilé de logos.
export function SkillsIndex({ categories }) {
  return (
    <dl className="skills-index">
      {categories.map((group, index) => (
        <div key={group.category} data-m-reveal>
          <dt>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {group.category.charAt(0) + group.category.slice(1).toLowerCase()}
          </dt>
          <dd>
            {group.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Folio : en bas de l'écran, la page et le chapitre en cours de lecture.
// Attaché à <html> : le transform du body casserait position: fixed.
export function Folio({ lang = 'fr', isDarkMode }) {
  const [current, setCurrent] = useState(null);
  const [node, setNode] = useState(null);

  useEffect(() => {
    const element = document.createElement('div');
    document.documentElement.appendChild(element);
    setNode(element);
    return () => element.remove();
  }, []);

  useEffect(() => {
    const sections = CHAPTERS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    const onScroll = () => window.scrollY < window.innerHeight * 0.5 && setCurrent(null);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const item = current && chapter(current);
  if (!node) return null;
  return createPortal(
    <p className={`catalogue-folio ${item ? 'is-visible' : ''} ${isDarkMode ? 'is-dark' : ''} ${current === 'skills' ? 'is-inverted' : ''}`} aria-hidden="true">
      {item && (
        <>
          <span>p. {item.page}</span>
          <span>{item[lang] || item.fr}</span>
        </>
      )}
    </p>,
    node
  );
}
