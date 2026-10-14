import React, { useState } from 'react';
import { timelineEvents } from '../data/timeline';
import GridSparkles from './GridSparkles';

// Parcours, en index typographique (dans l'esprit des sections Projets et
// Compétences) : une ligne par étape, de la plus récente à la plus ancienne.
// À gauche les dates, au centre l'intitulé et son lieu, à droite la nature de
// l'étape. Le détail s'ouvre au clic (une étape à la fois). Deux temps séparent le parcours :
// « Création » (le design et la communication) puis « Tech » (les études
// scientifiques d'avant), qui racontent le titre de la section.
const isCreative = (event) => ['Alternance', 'Stage'].includes(event.kind || event.category) || /MMI/.test(event.title);

function Row({ event, open, onToggle, isDarkMode, current, lang }) {
  const ink = isDarkMode ? 'text-beige' : 'text-black';
  return (
    <li className={`parcours-row ${open ? 'is-open' : ''}`} data-m-reveal>
      <button type="button" className={`parcours-line ${ink}`} onClick={onToggle} aria-expanded={open}>
        <span className="parcours-date">{event.year.replace(/\s*-\s*$/, ' →')}</span>
        <span className="parcours-title">
          {event.title}
          {current && <span className="parcours-now">{lang === 'fr' ? 'En cours' : 'Current'}</span>}
        </span>
        <span className="parcours-kind">{event.category}</span>
        <span className="parcours-toggle" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <div className="parcours-detail" hidden={!open}>
        <p>{event.description}</p>
      </div>
    </li>
  );
}

export default function Timeline({ isDarkMode, lang = 'fr' }) {
  // textes anglais des étapes (champ `en` de timeline.js)
  const events = timelineEvents.map((event) => (lang === 'fr' || !event.en ? event : { ...event, ...event.en, kind: event.category }));
  // la première ligne (l'étape en cours) est ouverte d'office
  const [openId, setOpenId] = useState(timelineEvents[0]?.id);
  const groups = [
    { label: lang === 'fr' ? 'Création' : 'Creative', hint: lang === 'fr' ? 'Design, communication, audiovisuel' : 'Design, communication, audiovisual', items: events.filter(isCreative) },
    { label: 'Tech', hint: lang === 'fr' ? 'Informatique, sciences' : 'Computer science, sciences', items: events.filter((event) => !isCreative(event)) },
  ];

  return (
    <section className={`relative w-full overflow-hidden font-stamp ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <GridSparkles isDarkMode={isDarkMode} className="z-0" opacity={0.5} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 pt-10 md:pt-14 pb-20 md:pb-28">
        <h2
          className={`text-3xl md:text-6xl max-w-4xl ${isDarkMode ? 'text-beige' : 'text-black'}`}
          style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
          data-m-reveal
        >
          {lang === 'fr' ? 'De la tech à la' : 'From tech to'}{' '}
          <span style={{ fontStyle: 'italic' }}>{lang === 'fr' ? 'création numérique' : 'digital design'}</span>
        </h2>

        {groups.map((group) => (
          <div key={group.label} className="parcours-group">
            <p className="parcours-group-label" data-m-reveal>
              <span>{group.label}</span>
              <span>{group.hint}</span>
            </p>
            <ol className="parcours-list">
              {group.items.map((event) => (
                <Row
                  key={event.id}
                  event={event}
                  lang={lang}
                  isDarkMode={isDarkMode}
                  current={event.id === timelineEvents[0]?.id}
                  open={openId === event.id}
                  onToggle={() => setOpenId((id) => (id === event.id ? null : event.id))}
                />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
