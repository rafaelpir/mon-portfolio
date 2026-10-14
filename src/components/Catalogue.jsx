import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

// Le site est pensé comme le catalogue de l'exposition (le musée en 3D,
// /musee, étant l'exposition elle-même). Ces éléments lui donnent sa mise en
// page d'ouvrage : chapitres numérotés, sommaire, folio.

// Chapitres de l'accueil, dans l'ordre de lecture. `id` : ancre de la section ;
// `to` : lien vers une autre page du site. Pas de numéros de page inventés :
// on se repère au numéro de chapitre.
export const CHAPTERS = [
  { number: '01', id: 'about', fr: 'Avant-propos', en: 'Foreword' },
  { number: '02', id: 'projects', fr: 'Œuvres', en: 'Works' },
  { number: '03', id: 'exposition', fr: "Visiter l'exposition", en: 'Visit the exhibition', to: '/musee', note: '3D' },
  { number: '04', id: 'skills', fr: 'Savoir-faire', en: 'Skills' },
  { number: '05', id: 'parcours', fr: 'Parcours', en: 'Background' },
  { number: '06', id: 'contact', fr: 'Contact', en: 'Contact' },
];
export const chapter = (id) => CHAPTERS.find((item) => item.id === id);

// Ouverture de chapitre : filet, numéro, titre. Hérite de la couleur du
// texte de sa section (claire ou sombre).
export function ChapterHeading({ id, lang = 'fr', className = '', as: Title = 'h2' }) {
  const item = chapter(id);
  if (!item) return null;
  return (
    <div className={`catalogue-chapter ${className}`} data-m-reveal>
      <span className="catalogue-chapter-number">{item.number}</span>
      <Title className="catalogue-chapter-title">{item[lang] || item.fr}</Title>
    </div>
  );
}

// Couverture du catalogue (ordinateur) : le nom en très grand, composé lettre
// à lettre à l'arrivée, une ligne de présentation et deux entrées.
export function Cover({ lang = 'fr', isDarkMode, onGo, children }) {
  const french = lang === 'fr';
  return (
    <div className={`cover ${isDarkMode ? 'text-beige' : 'text-black'}`}>
      <p className="catalogue-running cover-fade" style={{ '--d': '0.1s' }}>
        <span>{french ? "Catalogue d'exposition" : 'Exhibition catalogue'}</span>
        <span>N° 01 · 2026</span>
      </p>

      <div className="cover-body">
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
        <div className="cover-foot">
          <div className="cover-text cover-fade" style={{ '--d': '0.85s' }}>
            {children}
          </div>
          <div className="cover-links cover-fade" style={{ '--d': '1s' }}>
            <button type="button" onClick={() => onGo('projects')}>
              {french ? 'Feuilleter le catalogue' : 'Browse the catalogue'} ↓
            </button>
            <Link to="/musee">{french ? "Visiter l'exposition" : 'Visit the exhibition'} →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sommaire, en double page : à gauche le titre et la notice de l'ouvrage, à
// droite une ligne par chapitre.
export function Sommaire({ lang = 'fr', onGo, isDarkMode }) {
  const french = lang === 'fr';
  return (
    <section className={`catalogue-sommaire ${isDarkMode ? 'text-beige' : 'text-black'}`} aria-label={french ? 'Sommaire' : 'Contents'}>
      <p className="catalogue-running" data-m-reveal>
        <span>{french ? 'Sommaire' : 'Contents'}</span>
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
                <span className="catalogue-sommaire-page">{item.to ? '→' : '↓'}</span>
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

// Folio : en bas de l'écran, le chapitre en cours de lecture.
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
          <span>{item.number}</span>
          <span>{item[lang] || item.fr}</span>
        </>
      )}
    </p>,
    node
  );
}
