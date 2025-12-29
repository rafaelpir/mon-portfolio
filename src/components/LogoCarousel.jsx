import React from 'react';
import { motion } from 'motion/react';
import ShuffleText from '../ShuffleText';

const LogoCarousel = ({ skills, isDarkMode, textEffectsEnabled, columnCount = 3 }) => {
  // Split skills into columns
  const columns = Array.from({ length: columnCount }, (_, i) => {
    return skills.filter((_, index) => index % columnCount === i);
  });

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-4 md:gap-8">
        {columns.map((columnSkills, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-4 md:gap-6"
          >
            <motion.div
              className="flex flex-col gap-4 md:gap-6"
              animate={{
                y: [0, -100 * columnSkills.length],
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 15 + columnIndex * 2,
                  ease: "linear",
                },
              }}
            >
              {/* Render skills twice for seamless loop */}
              {[...columnSkills, ...columnSkills].map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center py-6 md:py-8 px-4 md:px-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-black/30 border-gray-700 hover:border-gray-500'
                      : 'bg-white/30 border-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg md:text-2xl font-light">
                    {textEffectsEnabled ? (
                      <ShuffleText enabled={textEffectsEnabled}>
                        {skill}
                      </ShuffleText>
                    ) : (
                      skill
                    )}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Gradients for fade effect on top and bottom */}
      <div className={`pointer-events-none absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b ${
        isDarkMode ? 'from-beige-light' : 'from-black'
      }`}></div>
      <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t ${
        isDarkMode ? 'from-beige-light' : 'from-black'
      }`}></div>
    </div>
  );
};

export default LogoCarousel;
