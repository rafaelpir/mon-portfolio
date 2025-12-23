import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TheaterCurtain({ onComplete }) {
  const [startOpening, setStartOpening] = useState(false);

  useEffect(() => {
    // Attendre 1 seconde avant d'ouvrir les rideaux
    const timer = setTimeout(() => {
      setStartOpening(true);
    }, 1000);

    // Appeler onComplete après l'animation complète
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const curtainVariants = {
    closed: { scaleX: 1 },
    open: {
      scaleX: 0,
      transition: {
        duration: 1.5,
        ease: [0.43, 0.13, 0.23, 0.96] // Courbe d'animation élégante
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Nom au centre (avant ouverture) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: startOpening ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute z-30 text-beige text-6xl md:text-8xl font-stamp tracking-wider"
      >
        RAFAEL PIRAL
      </motion.div>

      {/* Rideau gauche */}
      <motion.div
        variants={curtainVariants}
        initial="closed"
        animate={startOpening ? "open" : "closed"}
        className="absolute top-0 left-0 w-1/2 h-full origin-right z-20"
        style={{
          background: 'linear-gradient(90deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%)',
          boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.5)'
        }}
      >
        {/* Texture de velours */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.3) 2px,
            rgba(0,0,0,0.3) 4px
          )`
        }} />

        {/* Plis du rideau */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-black/30"
            style={{ left: `${(i + 1) * 12.5}%` }}
          />
        ))}
      </motion.div>

      {/* Rideau droit */}
      <motion.div
        variants={curtainVariants}
        initial="closed"
        animate={startOpening ? "open" : "closed"}
        className="absolute top-0 right-0 w-1/2 h-full origin-left z-20"
        style={{
          background: 'linear-gradient(90deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%)',
          boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.5)'
        }}
      >
        {/* Texture de velours */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.3) 2px,
            rgba(0,0,0,0.3) 4px
          )`
        }} />

        {/* Plis du rideau */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-black/30"
            style={{ left: `${(i + 1) * 12.5}%` }}
          />
        ))}
      </motion.div>

      {/* Barre de suspension dorée en haut */}
      <div className="absolute top-0 left-0 right-0 h-8 z-30 bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-600 shadow-lg" />
    </div>
  );
}
