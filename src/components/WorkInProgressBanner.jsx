import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkInProgressBanner({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la bannière
    const dismissed = localStorage.getItem('wipBannerDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('wipBannerDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`fixed top-0 left-0 right-0 z-[100] ${
            isDarkMode ? 'bg-beige text-black' : 'bg-black text-beige'
          } border-b ${
            isDarkMode ? 'border-black/10' : 'border-beige/10'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {/* Icône et message */}
            <div className="flex items-center gap-3 flex-1">
              {/* Icône en construction animée */}
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="flex-shrink-0"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>

              {/* Texte */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm font-medium tracking-wide">
                  Portfolio en cours de développement
                </span>
                <span className="text-xs opacity-70 hidden sm:inline">
                  — Certaines fonctionnalités sont encore en amélioration
                </span>
              </div>
            </div>

            {/* Bouton de fermeture */}
            <button
              onClick={handleDismiss}
              className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
                isDarkMode
                  ? 'hover:bg-black/10'
                  : 'hover:bg-beige/10'
              }`}
              aria-label="Fermer la notification"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
