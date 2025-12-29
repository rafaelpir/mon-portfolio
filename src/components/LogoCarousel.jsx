import React from 'react';
import { motion } from 'motion/react';
import ShuffleText from '../ShuffleText';

const LogoCarousel = ({ skills, isDarkMode, textEffectsEnabled, columnCount = 3 }) => {
  // Split skills into columns
  const columns = Array.from({ length: columnCount }, (_, i) => {
    return skills.filter((_, index) => index % columnCount === i);
  });

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="flex gap-3 md:gap-6 h-full">
        {columns.map((columnSkills, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-3 md:gap-5"
          >
            <motion.div
              className="flex flex-col gap-3 md:gap-5"
              animate={{
                y: [0, -100 * columnSkills.length],
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20 + columnIndex * 3,
                  ease: "linear",
                },
              }}
            >
              {/* Render skills twice for seamless loop */}
              {[...columnSkills, ...columnSkills].map((skill, idx) => (
                <motion.div
                  key={idx}
                  className={`group relative flex items-center justify-center py-5 md:py-7 px-4 md:px-6 rounded-xl backdrop-blur-sm transition-all duration-500 cursor-default ${
                    isDarkMode
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                      : 'bg-black/5 border border-black/10 hover:bg-black/10 hover:border-black/20'
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Subtle glow effect on hover */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-white/5 to-transparent'
                      : 'bg-gradient-to-br from-black/5 to-transparent'
                  }`}></div>

                  <span className="relative z-10 text-base md:text-xl font-medium tracking-wide">
                    {textEffectsEnabled ? (
                      <ShuffleText enabled={textEffectsEnabled}>
                        {skill}
                      </ShuffleText>
                    ) : (
                      skill
                    )}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Gradients for fade effect on top and bottom */}
      <div className={`pointer-events-none absolute top-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b ${
        isDarkMode ? 'from-beige-light via-beige-light/80 to-transparent' : 'from-black via-black/80 to-transparent'
      }`}></div>
      <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t ${
        isDarkMode ? 'from-beige-light via-beige-light/80 to-transparent' : 'from-black via-black/80 to-transparent'
      }`}></div>
    </div>
  );
};

export default LogoCarousel;
