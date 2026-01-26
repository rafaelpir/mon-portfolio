import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timelineEvents } from '../data/timeline';

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
      className={`w-full font-stamp md:px-10 ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`}
      ref={containerRef}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto py-16 md:py-20 px-4 md:px-8 lg:px-10">
        <h2 className={`text-xs md:text-sm tracking-widest mb-4 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          MON PARCOURS
        </h2>
        <p className={`text-2xl md:text-4xl font-light max-w-4xl ${
          isDarkMode ? 'text-beige' : 'text-black'
        }`}>
          De la tech à la création numérique
        </p>
        <p className={`text-sm md:text-base max-w-xl mt-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
        </p>
      </div>

      {/* Timeline */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {timelineEvents.map((event) => (
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
                <div className={`h-4 w-4 rounded-full border p-2 ${
                  isDarkMode
                    ? 'bg-beige/10 border-beige/30'
                    : 'bg-black/10 border-black/30'
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

              {/* Content Card */}
              <div className={`p-6 md:p-8 rounded-lg mb-8 ${
                isDarkMode
                  ? 'bg-beige/5 border border-beige/10'
                  : 'bg-black/5 border border-black/10'
              }`}>
                {/* Category badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  event.category === 'Formation'
                    ? isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/20 text-blue-700'
                    : event.category === 'Création'
                    ? isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-500/20 text-orange-700'
                    : isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-500/20 text-green-700'
                }`}>
                  {event.category}
                </div>

                {/* Title */}
                <h4 className={`text-lg md:text-2xl font-light mb-3 ${
                  isDarkMode ? 'text-beige' : 'text-black'
                }`}>
                  {event.title}
                </h4>

                {/* Description */}
                <p className={`text-sm md:text-base leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Animated vertical line */}
        <div
          style={{
            height: height + "px",
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
                ? 'bg-gradient-to-t from-orange-500 via-beige to-transparent'
                : 'bg-gradient-to-t from-orange-500 via-black to-transparent'
            }`}
          />
        </div>
      </div>
    </section>
  );
}
