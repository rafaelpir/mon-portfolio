import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

// Map skill names to their logo images in /images/logos/
const logoMap = {
  // Design
  'Photoshop': '/images/logos/photoshop.webp',
  'Illustrator': '/images/logos/illustrator.webp',
  'Figma': '/images/logos/figma.webp',
  'InDesign': '/images/logos/indesign.webp',
  'Canva': '/images/logos/Canva.webp',
  'Lightroom': '/images/logos/Lightroom.webp',
  'Affinity': '/images/logos/Affinity.webp',
  // Développement
  'HTML/CSS': '/images/logos/html.webp',
  'CSS': '/images/logos/css.webp',
  'JavaScript': '/images/logos/js.webp',
  'React': '/images/logos/react.webp',
  'WordPress': '/images/logos/wordpress.webp',
  'PHP': '/images/logos/PHP.webp',
  // Vidéo / 3D
  'Premiere Pro': '/images/logos/Premiere_Pro.webp',
  'DaVinci Resolve': '/images/logos/DaVinci.webp',
  'Blender': '/images/logos/Blender.webp',
  // Bureautique
  'Excel': '/images/logos/Excel.svg',
  'Word': '/images/logos/Word.webp',
  'PowerPoint': '/images/logos/PowerPoint.webp',
};

const LogoCarousel = ({ skillCategories, isDarkMode, performanceTier = 'full' }) => {
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
          animate={performanceTier !== 'none' ? {
            x: contentWidth > 0 ? [0, -contentWidth] : 0,
          } : {}}
          transition={performanceTier !== 'none' ? {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          } : {}}
        >
          {/* Render logos multiple times for seamless loop */}
          {[...allLogos, ...allLogos, ...allLogos].map((logo, idx) => (
            <div
              key={`${logo.id}-${idx}`}
              className={`flex items-center justify-center py-5 md:py-7 px-6 md:px-8 rounded-xl cursor-default ${
                isDarkMode
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-black/5 border border-black/10'
              }`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                <img
                  src={logo.logoPath}
                  alt={logo.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
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
