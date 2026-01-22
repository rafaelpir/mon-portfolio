import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

// Map skill names to their logo images in /images/logos/
const logoMap = {
  // Design
  'Photoshop': '/images/logos/photoshop.png',
  'Illustrator': '/images/logos/illustrator.png',
  'Figma': '/images/logos/figma.png',
  'InDesign': '/images/logos/indesign.png',
  'Canva': '/images/logos/Canva.png',
  'Lightroom': '/images/logos/Lightroom.png',
  'Affinity': '/images/logos/Affinity.png',
  // Développement
  'HTML/CSS': '/images/logos/html.png',
  'CSS': '/images/logos/css.png',
  'JavaScript': '/images/logos/js.png',
  'React': '/images/logos/react.png',
  'WordPress': '/images/logos/wordpress.png',
  'PHP': '/images/logos/PHP.png',
  // Vidéo / 3D
  'Premiere Pro': '/images/logos/Premiere_Pro.png',
  'DaVinci Resolve': '/images/logos/DaVinci.png',
  'Blender': '/images/logos/Blender.png',
  // Bureautique
  'Excel': '/images/logos/Excel.svg',
  'Word': '/images/logos/Word.png',
  'PowerPoint': '/images/logos/PowerPoint.png',
};

const LogoCarousel = ({ skillCategories, isDarkMode }) => {
  const containerRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Si pas de catégories, ne rien afficher
  if (!skillCategories || skillCategories.length === 0) return null;

  // Récupérer tous les logos de toutes les catégories
  const allLogos = skillCategories
    .flatMap((category, categoryIndex) =>
      category.skills.map((skill, index) => ({
        name: skill,
        id: `${categoryIndex}-${index}`,
        logoPath: logoMap[skill]
      }))
    )
    .filter(logo => logo.logoPath !== null);

  // Ne rien afficher si pas de logos disponibles
  if (allLogos.length === 0) return null;

  // Mesurer la largeur d'un groupe de logos pour un défilement fluide
  useEffect(() => {
    if (containerRef.current) {
      // La largeur totale divisée par 3 (car on triple les logos)
      const totalWidth = containerRef.current.scrollWidth / 3;
      setContentWidth(totalWidth);
    }
  }, [allLogos.length]);

  return (
    <div className="w-full">
      {/* Logos Grid - Horizontal scrolling carousel */}
      <div className="relative h-32 md:h-40 overflow-hidden rounded-xl">
        <motion.div
          ref={containerRef}
          className="flex gap-3 md:gap-5 absolute"
          animate={{
            x: contentWidth > 0 ? [0, -contentWidth] : 0,
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* Render logos multiple times for seamless loop */}
          {[...allLogos, ...allLogos, ...allLogos].map((logo, idx) => (
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
};

export default LogoCarousel;
