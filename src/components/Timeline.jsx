import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timelineEvents } from '../data/timeline';
import GridSparkles from './GridSparkles';

// Classes écrites en toutes lettres (pas de template `${hue}-400`) : le JIT
// Tailwind scanne le texte source à la recherche de classes littérales, une
// classe reconstruite dynamiquement ne serait jamais générée.
const CATEGORY_STYLES = {
  Avenir: {
    dot: 'bg-orange-400/55', dotLight: 'bg-orange-500/55',
    text: 'text-orange-300/60', textLight: 'text-orange-700/70',
    border: 'border-l-orange-400/40', borderLight: 'border-l-orange-500/40',
  },
  // Rose : même accent que "Communication" dans les cartes Compétences
  // (About.jsx) — cohérent puisque ce poste est justement en communication.
  Alternance: {
    dot: 'bg-rose-400/55', dotLight: 'bg-rose-500/55',
    text: 'text-rose-300/60', textLight: 'text-rose-700/70',
    border: 'border-l-rose-400/40', borderLight: 'border-l-rose-500/40',
  },
  Stage: {
    dot: 'bg-sky-400/55', dotLight: 'bg-sky-500/55',
    text: 'text-sky-300/60', textLight: 'text-sky-700/70',
    border: 'border-l-sky-400/40', borderLight: 'border-l-sky-500/40',
  },
  Formation: {
    dot: 'bg-purple-400/50', dotLight: 'bg-purple-500/50',
    text: 'text-purple-300/55', textLight: 'text-purple-700/65',
    border: 'border-l-purple-400/35', borderLight: 'border-l-purple-500/35',
  },
  Développement: {
    dot: 'bg-emerald-400/55', dotLight: 'bg-emerald-500/55',
    text: 'text-emerald-300/60', textLight: 'text-emerald-700/70',
    border: 'border-l-emerald-400/40', borderLight: 'border-l-emerald-500/40',
  },
  Création: {
    dot: 'bg-violet-400/55', dotLight: 'bg-violet-500/55',
    text: 'text-violet-300/60', textLight: 'text-violet-700/70',
    border: 'border-l-violet-400/40', borderLight: 'border-l-violet-500/40',
  },
};
const DEFAULT_CATEGORY_STYLE = CATEGORY_STYLES.Avenir;

export default function Timeline({ isDarkMode }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section
      className={`relative w-full overflow-hidden font-stamp md:px-10 ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`}
      ref={containerRef}
    >
      <GridSparkles isDarkMode={isDarkMode} className="z-0" opacity={0.5} />

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto py-16 md:py-20 px-4 md:px-8 lg:px-10">
        <h2 className={`text-[10px] md:text-sm tracking-widest uppercase mb-4 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          Mon Parcours
        </h2>
        <p
          className={`text-3xl md:text-6xl max-w-4xl ${
            isDarkMode ? 'text-beige' : 'text-black'
          }`}
          style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
        >
          De la tech à la{' '}
          <span style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontStyle: 'italic', fontWeight: 600 }}>
            création numérique
          </span>
        </p>
      </div>

      {/* Timeline */}
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto pb-20">
        {timelineEvents.map((event, index) => {
          const catStyle = CATEGORY_STYLES[event.category] || DEFAULT_CATEGORY_STYLE;
          return (
          <div
            key={event.id}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left side - Year indicator (sticky) */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Dot */}
              <div className={`h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-black' : 'bg-white'
              }`}>
                <div className={`h-4 w-4 rounded-full border-2 p-2 ${isDarkMode ? catStyle.dot : catStyle.dotLight} ${
                  isDarkMode ? 'border-beige/30' : 'border-black/30'
                }`} />
              </div>
              {/* Year - Desktop */}
              <h3 className={`hidden md:block text-xl md:pl-20 md:text-5xl font-bold ${
                isDarkMode ? 'text-beige/50' : 'text-black/50'
              }`}>
                {event.year}
              </h3>
            </div>

            {/* Right side - Content */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              {/* Year - Mobile */}
              <h3 className={`md:hidden block text-2xl mb-4 text-left font-bold ${
                isDarkMode ? 'text-beige/50' : 'text-black/50'
              }`}>
                {event.year}
              </h3>

              {/* Content Card — traitement éditorial (bordure fine, pas de
                  pastille arrondie) aligné sur le reste du site plutôt que
                  la carte "app" avec fond teinté et étiquette pivotée. Le
                  liseré gauche prend la couleur de la catégorie. */}
              <div
                className={`group relative overflow-hidden p-6 md:p-10 mb-8 border transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'border-beige/10 hover:bg-beige/[0.03] hover:border-beige/20'
                    : 'border-black/10 hover:bg-black/[0.03] hover:border-black/20'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 bottom-0 w-[3px] ${isDarkMode ? catStyle.dot : catStyle.dotLight}`}
                />

                {/* Numéro d'index décoratif, grand format éditorial */}
                <span
                  aria-hidden="true"
                  className={`absolute top-2 right-4 md:top-3 md:right-7 text-6xl md:text-8xl select-none pointer-events-none z-0 transition-colors duration-300 ${
                    isDarkMode ? 'text-beige/[0.05] group-hover:text-beige/[0.08]' : 'text-black/[0.05] group-hover:text-black/[0.08]'
                  }`}
                  style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Category label — étiquette plate, sans pastille */}
                <div
                  className={`relative z-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase mb-5 ${
                    isDarkMode ? catStyle.text : catStyle.textLight
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? catStyle.dot : catStyle.dotLight}`} />
                  {event.category}
                </div>

                {/* Title */}
                <h4
                  className={`relative z-10 text-xl md:text-2xl mb-3 leading-snug ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}
                  style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
                >
                  {event.title}
                </h4>

                {/* Description */}
                <p
                  className={`relative z-10 text-sm md:text-base leading-relaxed max-w-2xl ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {event.description}
                </p>
              </div>
            </div>
          </div>
          );
        })}

        {/* Animated vertical line */}
        <div
          style={{
            height: height + "px",
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}
          className={`absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] ${
            isDarkMode
              ? 'bg-gradient-to-b from-transparent via-beige/20 to-transparent'
              : 'bg-gradient-to-b from-transparent via-black/20 to-transparent'
          }`}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className={`absolute inset-x-0 top-0 w-[2px] rounded-full ${
              isDarkMode
                ? 'bg-gradient-to-t from-beige/80 via-beige to-transparent'
                : 'bg-gradient-to-t from-black/80 via-black to-transparent'
            }`}
          />
        </div>
      </div>
    </section>
  );
}
