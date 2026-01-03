import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ShuffleText from '../ShuffleText';
import { timelineEvents } from '../data/timeline';

export default function Timeline({ isDarkMode, textEffectsEnabled, scrollY }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={containerRef}
      className="py-16 md:py-32 pb-32 md:pb-48 px-4 md:px-16"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-xs md:text-sm tracking-widest mb-12 md:mb-20 text-center ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          <ShuffleText enabled={textEffectsEnabled}>MON PARCOURS</ShuffleText>
        </h2>

        <div className="relative">
          {/* Timeline vertical line - Fil d'Ariane */}
          <div
            className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 md:-ml-px ${
              isDarkMode ? 'bg-beige/40' : 'bg-black/40'
            }`}
            style={{
              boxShadow: isDarkMode
                ? '0 0 20px rgba(232, 220, 196, 0.3)'
                : '0 0 20px rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* Timeline events */}
          <div className="space-y-12 md:space-y-20">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={`relative flex items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:gap-8`}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 z-10 ${
                      isDarkMode
                        ? 'bg-black border-beige'
                        : 'bg-white border-black'
                    }`}
                    style={{
                      transform: 'translateX(-50%)',
                      top: '24px'
                    }}
                  />

                  {/* Icon badge */}
                  <div
                    className={`absolute left-0 md:left-1/2 w-12 h-12 rounded-full flex items-center justify-center text-2xl z-20 ${
                      isDarkMode
                        ? 'bg-beige/10 border-2 border-beige/30'
                        : 'bg-black/10 border-2 border-black/30'
                    }`}
                    style={{
                      transform: 'translate(-50%, -4px)'
                    }}
                  >
                    {event.icon}
                  </div>

                  {/* Spacer for mobile */}
                  <div className="w-16 md:hidden" />

                  {/* Content card */}
                  <div className={`flex-1 ${isLeft ? 'md:pr-12' : 'md:pl-12'} w-full`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className={`p-6 md:p-8 rounded-lg transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-beige/5 hover:bg-beige/10 border border-beige/10'
                          : 'bg-black/5 hover:bg-black/10 border border-black/10'
                      }`}
                    >
                      {/* Year */}
                      <div className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-4 ${
                        isDarkMode
                          ? 'bg-beige/20 text-beige'
                          : 'bg-black/20 text-black'
                      }`}>
                        {event.year}
                      </div>

                      {/* Category badge */}
                      <div className={`inline-block ml-2 px-2 py-1 rounded text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {event.category}
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl md:text-2xl font-light mb-3 ${
                        isDarkMode ? 'text-beige' : 'text-black'
                      }`}>
                        <ShuffleText enabled={textEffectsEnabled}>{event.title}</ShuffleText>
                      </h3>

                      {/* Description */}
                      <p className={`text-sm md:text-base leading-relaxed ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ShuffleText enabled={textEffectsEnabled}>{event.description}</ShuffleText>
                      </p>
                    </motion.div>
                  </div>

                  {/* Empty spacer for desktop alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
