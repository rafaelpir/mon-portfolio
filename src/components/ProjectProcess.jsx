import { useState } from 'react';

// Démarche d'un projet : les étapes (brief, recherches, croquis…), les
// versions écartées et un avant/après. Tout est facultatif et ne s'affiche
// que si le projet le renseigne (champ `process` dans src/data/projects.js) :
//
// process: {
//   steps: [
//     { title: { fr, en }, text: { fr, en }, images: [{ src, caption: { fr, en } }] },
//     { title: …, discarded: true, images: […] },  // versions écartées
//   ],
//   compare: { before: src, after: src, label: { fr, en } },
// }
const pick = (value, lang) => (value && typeof value === 'object' ? value[lang] || value.fr : value);

function Compare({ before, after, label, lang }) {
  const [split, setSplit] = useState(50);
  return (
    <figure className="process-compare">
      <div className="process-compare-frame">
        <img src={before} alt={lang === 'en' ? 'Before' : 'Avant'} loading="lazy" draggable={false} />
        <img
          src={after}
          alt={lang === 'en' ? 'After' : 'Après'}
          loading="lazy"
          draggable={false}
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
        />
        <span className="process-compare-handle" style={{ left: `${split}%` }} aria-hidden="true" />
        <span className="process-compare-tag is-before">{lang === 'en' ? 'Before' : 'Avant'}</span>
        <span className="process-compare-tag is-after">{lang === 'en' ? 'After' : 'Après'}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-label={lang === 'en' ? 'Move to compare before and after' : "Glisser pour comparer l'avant et l'après"}
        />
      </div>
      {label && <figcaption>{pick(label, lang)}</figcaption>}
    </figure>
  );
}

export default function ProjectProcess({ process, lang = 'fr' }) {
  const steps = process?.steps || [];
  const compare = process?.compare;
  if (!steps.length && !compare) return null;

  return (
    <div className="process">
      {steps.length > 0 && (
        <ol className="process-steps">
          {steps.map((step, index) => (
            <li key={index} className={step.discarded ? 'is-discarded' : ''}>
              <div className="process-step-text">
                <span className="process-step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{pick(step.title, lang)}</h3>
                {step.text && <p>{pick(step.text, lang)}</p>}
              </div>
              {step.images?.length > 0 && (
                <div className="process-step-images">
                  {step.images.map((image) => (
                    <figure key={image.src}>
                      <div className="process-step-image">
                        <img src={image.src} alt={pick(image.caption, lang) || pick(step.title, lang)} loading="lazy" />
                        {step.discarded && <span className="process-stamp">{lang === 'en' ? 'Set aside' : 'Écartée'}</span>}
                      </div>
                      {image.caption && <figcaption>{pick(image.caption, lang)}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
      {compare && <Compare {...compare} lang={lang} />}
    </div>
  );
}
