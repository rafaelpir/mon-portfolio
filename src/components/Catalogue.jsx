import { useEffect, useRef, useState } from 'react';
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
  { number: '01', id: 'about', fr: 'À propos', en: 'About' },
  { number: '02', id: 'projects', fr: 'Projets', en: 'Projects' },
  { number: '03', id: 'exposition', fr: 'Le musée', en: 'The museum', to: '/musee', note: '3D' },
  { number: '04', id: 'skills', fr: 'Compétences', en: 'Skills' },
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
// Si l'on vient de l'ouverture (le livre feuilleté), les deux mots du nom,
// posés de part et d'autre du livre, glissent et grandissent jusqu'à leur
// place sur la couverture : c'est le même nom qui passe d'une page à l'autre.
// Sinon, les lettres montent simplement en fondu.
export function Cover({ lang = 'fr', isDarkMode, onGo, children }) {
  const french = lang === 'fr';
  const wordsRef = useRef([]);
  // vrai si la page de garde est encore là quand la couverture apparaît
  const [fromOpening] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('is-opening'));
  useEffect(() => {
    if (!fromOpening) return undefined;
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (root.classList.contains('is-opening')) return;
      observer.disconnect();
      const from = window.__openingWords || [];
      wordsRef.current.forEach((word, index) => {
        const start = from[index];
        if (!word || !start) return;
        const end = word.getBoundingClientRect();
        const scale = start.height / end.height;
        word.animate(
          [
            { transform: `translate(${start.left - end.left}px, ${start.top - end.top}px) scale(${scale})` },
            { transform: 'none' },
          ],
          { duration: 1100, delay: index * 70, easing: 'cubic-bezier(0.7, 0, 0.15, 1)', fill: 'backwards' }
        );
      });
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [fromOpening]);
  return (
    <div className={`cover ${isDarkMode ? 'text-beige' : 'text-black'}`}>
      <p className="catalogue-running cover-fade" style={{ '--d': '0.1s' }}>
        <span>{french ? 'Portfolio' : 'Portfolio'}</span>
        <span>2024-2026</span>
      </p>

      <div className="cover-body">
        <h1 aria-label="Rafael Piral">
          {['Rafael', 'Piral'].map((word, line) => (
            <span key={word} className="cover-line" aria-hidden="true">
              <span ref={(element) => (wordsRef.current[line] = element)} className={`cover-word ${fromOpening ? 'is-travelling' : ''}`}>
                {[...word].map((letter, index) => (
                  <span key={index} className="cover-letter" style={{ '--d': `${0.15 + line * 0.2 + index * 0.05}s` }}>
                    {letter}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <div className="cover-foot">
          <div className="cover-text cover-fade" style={{ '--d': '0.85s' }}>
            {children}
          </div>
          <div className="cover-links cover-fade" style={{ '--d': '1s' }}>
            <button type="button" onClick={() => onGo('projects')}>
              {french ? 'Voir les projets' : 'See the projects'} ↓
            </button>
            <Link to="/musee">{french ? 'Visiter le musée' : 'Visit the museum'} →</Link>
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
        <p>Rafael Piral</p>
        <p>{french ? 'Paris, 2026' : 'Paris, 2026'}</p>
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
          <Link to="/about">{french ? 'En savoir plus' : 'Learn more'} →</Link>
        </div>
      </div>
    </div>
  );
}

// Chapitre « Savoir-faire » : une liste typographique par domaine, comme un
// index d'ouvrage, à la place d'un défilé de logos.
const SKILL_KEYS = { 'DESIGN GRAPHIQUE': 'graphicDesign', 'DÉVELOPPEMENT WEB': 'webDev', AUDIOVISUEL: 'audiovisual', BUREAUTIQUE: 'office' };
// Ce qu'un client peut commander, chacun avec un projet du site en exemple.
// `type` : valeur reprise dans le formulaire de contact.
export const SERVICES = [
  {
    type: 'poster',
    fr: { title: 'Affiche', text: "Affiche de film, de concert, d'événement ou de sport, du concept au fichier prêt à imprimer.", example: 'Gummo' },
    en: { title: 'Poster', text: 'Film, concert, event or sports posters, from the idea to the print-ready file.', example: 'Gummo' },
    slug: 'affiche-gummo',
  },
  {
    type: 'identity',
    fr: { title: 'Identité visuelle', text: 'Logo, couleurs, typographies et supports pour une marque, une association ou un projet.', example: 'À Cœur Ouvert' },
    en: { title: 'Visual identity', text: 'Logo, colours, typefaces and materials for a brand, a non-profit or a project.', example: 'À Cœur Ouvert' },
    slug: 'identite-visuelle-a-coeur-ouvert',
  },
  {
    type: 'interface',
    fr: { title: 'Site & application', text: "Maquettes Figma d'un site ou d'une appli, pensées d'abord pour le téléphone.", example: 'Agence immobilière' },
    en: { title: 'Website & app', text: 'Figma designs for a website or an app, built mobile first.', example: 'Real estate agency' },
    slug: 'branding-agence-immobiliere',
  },
  {
    type: 'video',
    fr: { title: 'Vidéo & motion', text: 'Montage, animation de texte et petits films pour les réseaux sociaux.', example: 'Coffret Alicia Keys' },
    en: { title: 'Video & motion', text: 'Editing, animated type and short films for social media.', example: 'Alicia Keys box set' },
    slug: 'coffret-alicia-keys',
  },
];

export function ServicesIndex({ lang = 'fr', onRequest }) {
  return (
    <ol className="services-index">
      {SERVICES.map((service, index) => {
        const copy = service[lang] || service.fr;
        return (
          <li key={service.type} data-m-reveal>
            <span className="services-index-number">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="services-index-title">{copy.title}</h3>
            <div className="services-index-body">
              <p>{copy.text}</p>
              <p className="services-index-links">
                <Link to={`/work/${service.slug}`}>
                  {lang === 'en' ? `Example: ${copy.example}` : `Exemple : ${copy.example}`} →
                </Link>
                <button type="button" onClick={() => onRequest?.(service.type)}>
                  {lang === 'en' ? 'Ask for a quote' : 'Demander un devis'}
                </button>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function SkillsIndex({ categories, t }) {
  return (
    <dl className="skills-index">
      {categories.map((group, index) => (
        <div key={group.category} data-m-reveal>
          <dt>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {(() => {
              const label = t && SKILL_KEYS[group.category] ? t(`projects:skillCategories.${SKILL_KEYS[group.category]}`) : group.category;
              return label.charAt(0) + label.slice(1).toLowerCase();
            })()}
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
