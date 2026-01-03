import React from 'react';
import { motion } from 'motion/react';

// Map skill names to their logo images in /images/logos/
const logoMap = {
  'Photoshop': '/images/logos/photoshop.png',
  'Illustrator': '/images/logos/illustrator.png',
  'Figma': '/images/logos/figma.png',
  'InDesign': null, // Logo manquant
  'HTML/CSS': '/images/logos/html.png', // Utilisera html.png (CSS disponible aussi)
  'JavaScript': '/images/logos/js.png',
  'React': '/images/logos/react.png',
  'WordPress': '/images/logos/wordpress.png',
  'Premiere Pro': null, // Logo manquant
  'After Effects': null, // Logo manquant
  'Blender': null // Logo manquant
};

const LogoCarousel = ({ skillCategories, isDarkMode }) => {
  // Si pas de catégories, ne rien afficher
  if (!skillCategories || skillCategories.length === 0) return null;

  return (
    <div className="w-full space-y-8 md:space-y-12">
      {skillCategories.map((category, categoryIndex) => {
        // Convert skills to logos for this category
        const categoryLogos = category.skills
          .map((skill, index) => ({
            name: skill,
            id: `${categoryIndex}-${index}`,
            logoPath: logoMap[skill]
          }))
          .filter(logo => logo.logoPath !== null);

        // Ne rien afficher si pas de logos disponibles
        if (categoryLogos.length === 0) return null;

        return (
          <div key={category.category} className="space-y-4">
            {/* Category Title */}
            <h3 className={`text-xs md:text-sm tracking-widest font-light ${
              isDarkMode ? 'text-beige/60' : 'text-black/60'
            }`}>
              {category.category}
            </h3>

            {/* Logos Grid - Horizontal scrolling carousel */}
            <div className="relative h-32 md:h-40 overflow-hidden rounded-xl">
              <motion.div
                className="flex gap-3 md:gap-5 absolute"
                animate={{
                  x: [0, -1000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20 + categoryIndex * 5,
                    ease: "linear",
                  },
                }}
              >
                {/* Render logos multiple times for seamless loop */}
                {[...categoryLogos, ...categoryLogos, ...categoryLogos].map((logo, idx) => (
                  <motion.div
                    key={`${logo.id}-${idx}`}
                    className={`group relative flex items-center justify-center py-5 md:py-7 px-6 md:px-8 rounded-xl backdrop-blur-sm transition-all duration-500 cursor-default ${
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
                    <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <img
                        src={logo.logoPath}
                        alt={logo.name}
                        className="max-w-full max-h-full w-full h-full object-contain"
                        loading="lazy"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Gradients for fade effect on left and right */}
              <div className={`pointer-events-none absolute top-0 left-0 bottom-0 w-20 md:w-32 bg-gradient-to-r ${
                isDarkMode ? 'from-beige-light via-beige-light/80 to-transparent' : 'from-black via-black/80 to-transparent'
              }`}></div>
              <div className={`pointer-events-none absolute top-0 right-0 bottom-0 w-20 md:w-32 bg-gradient-to-l ${
                isDarkMode ? 'from-beige-light via-beige-light/80 to-transparent' : 'from-black via-black/80 to-transparent'
              }`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LogoCarousel;
