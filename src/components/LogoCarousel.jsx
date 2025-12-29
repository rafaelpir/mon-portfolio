import React from 'react';
import { motion } from 'motion/react';
import {
  PhotoshopLogo,
  IllustratorLogo,
  FigmaLogo,
  InDesignLogo,
  HTMLLogo,
  JavaScriptLogo,
  ReactLogo,
  WordPressLogo,
  PremiereLogo,
  AfterEffectsLogo,
  BlenderLogo
} from './logos';

// Map skill names to their logo components
const logoMap = {
  'Photoshop': PhotoshopLogo,
  'Illustrator': IllustratorLogo,
  'Figma': FigmaLogo,
  'InDesign': InDesignLogo,
  'HTML/CSS': HTMLLogo,
  'JavaScript': JavaScriptLogo,
  'React': ReactLogo,
  'WordPress': WordPressLogo,
  'Premiere Pro': PremiereLogo,
  'After Effects': AfterEffectsLogo,
  'Blender': BlenderLogo
};

const LogoCarousel = ({ skills, isDarkMode, columnCount = 3 }) => {
  // Convert skills array to logo objects
  const allLogos = skills.map((skill, index) => ({
    name: skill,
    id: index,
    Logo: logoMap[skill]
  }));

  // Split logos into columns
  const columns = Array.from({ length: columnCount }, (_, i) => {
    return allLogos.filter((_, index) => index % columnCount === i);
  });

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="flex gap-3 md:gap-6 h-full">
        {columns.map((columnLogos, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-3 md:gap-5"
          >
            <motion.div
              className="flex flex-col gap-3 md:gap-5"
              animate={{
                y: ["0%", "-50%"],
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
              {/* Render logos twice for seamless loop */}
              {[...columnLogos, ...columnLogos].map((logo, idx) => {
                const LogoComponent = logo.Logo;
                return (
                  <motion.div
                    key={`${logo.id}-${idx}`}
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

                    {/* Logo */}
                    <div className="relative z-10">
                      {LogoComponent && <LogoComponent className="w-12 h-12 md:w-16 md:h-16" />}
                    </div>
                  </motion.div>
                );
              })}
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
