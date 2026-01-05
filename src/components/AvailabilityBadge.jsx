import React, { useState } from 'react';
import ShuffleText from '../ShuffleText';

export default function AvailabilityBadge({ availableDate, alternance, status, isDarkMode, textEffectsEnabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <button
      onClick={() => setIsModalOpen(true)}
      className={`inline-flex flex-row items-center gap-3 md:gap-8 px-4 md:px-12 py-3 md:py-6 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl backdrop-blur-lg shadow-xl md:shadow-2xl border-2 md:border-4 cursor-pointer ${
      isDarkMode
        ? 'bg-gradient-to-r from-orange-500/30 via-red-500/20 to-orange-500/30 border-orange-400/50 shadow-orange-500/20'
        : 'bg-gradient-to-r from-orange-500/40 via-red-500/30 to-orange-500/40 border-orange-600/60 shadow-orange-600/30'
    }`} style={{ animation: 'pulse 2s ease-in-out infinite' }}>
      {/* Pulsing dot avec glow effect */}
      <div className="relative flex items-center justify-center shrink-0">
        <span className={`absolute w-6 h-6 md:w-10 md:h-10 rounded-full animate-ping ${
          isDarkMode ? 'bg-orange-300' : 'bg-orange-500'
        }`} style={{ opacity: 0.6 }}></span>
        <span className={`absolute w-4 h-4 md:w-6 md:h-6 rounded-full blur-lg ${
          isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
        }`}></span>
        <span className={`relative w-3 h-3 md:w-4 md:h-4 rounded-full ${
          isDarkMode ? 'bg-orange-300' : 'bg-orange-500'
        }`} style={{ boxShadow: '0 0 20px currentColor' }}></span>
      </div>

      {/* Badge text - responsive */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 min-w-0">
        <span className={`text-xs sm:text-sm md:text-xl font-bold tracking-wide uppercase ${
          isDarkMode ? 'text-orange-200' : 'text-orange-700'
        }`}>
          <ShuffleText enabled={textEffectsEnabled}>{status}</ShuffleText>
        </span>

        <span className={`hidden md:block text-2xl ${
          isDarkMode ? 'text-orange-300/40' : 'text-orange-600/40'
        }`}>•</span>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
          <span className={`text-sm sm:text-base md:text-2xl font-black ${
            isDarkMode ? 'text-beige' : 'text-black'
          }`}>
            <ShuffleText enabled={textEffectsEnabled}>{availableDate}</ShuffleText>
          </span>

          {alternance && (
            <>
              <span className={`hidden sm:inline text-xs md:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                &
              </span>
              <span className={`text-xs sm:text-sm md:text-2xl font-black ${
                isDarkMode ? 'text-beige' : 'text-black'
              }`}>
                <ShuffleText enabled={textEffectsEnabled}>{alternance}</ShuffleText>
              </span>
            </>
          )}
        </div>
      </div>
    </button>

    {/* Modal Popup */}
    {isModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className={`relative max-w-2xl w-full border transition-all duration-500 ${
            isDarkMode
              ? 'bg-black border-beige/20'
              : 'bg-white border-black/20'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className={`absolute top-4 right-4 text-xs tracking-widest transition-opacity hover:opacity-50 ${
              isDarkMode ? 'text-beige' : 'text-black'
            }`}
            aria-label="Fermer"
          >
            <ShuffleText enabled={textEffectsEnabled}>FERMER ✕</ShuffleText>
          </button>

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className={`text-3xl md:text-4xl font-light mb-2 ${
                isDarkMode ? 'text-beige' : 'text-black'
              }`}>
                <ShuffleText enabled={textEffectsEnabled}>DISPONIBILITÉS</ShuffleText>
              </h2>
              <p className={`text-xs tracking-widest ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                EN RECHERCHE D'OPPORTUNITÉS
              </p>
            </div>

            {/* Stage Section */}
            <div className={`mb-8 pb-8 border-b ${
              isDarkMode ? 'border-beige/10' : 'border-black/10'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <h3 className={`text-xl md:text-2xl font-light mb-1 ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}>
                    <ShuffleText enabled={textEffectsEnabled}>STAGE</ShuffleText>
                  </h3>
                  <p className={`text-xs tracking-widest mb-3 ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-600'
                  }`}>
                    AVRIL 2026
                  </p>
                  <p className={`text-sm md:text-base leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    Étudiant en 2e année de BUT Métiers du Multimédia et de l'Internet. Je suis à la recherche d'un stage d'au moins 8 semaines à partir d'avril 2026 dans le domaine de la création numérique et de l'audiovisuel.
                  </p>
                </div>
              </div>
            </div>

            {/* Alternance Section */}
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <h3 className={`text-xl md:text-2xl font-light mb-1 ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}>
                    <ShuffleText enabled={textEffectsEnabled}>ALTERNANCE</ShuffleText>
                  </h3>
                  <p className={`text-xs tracking-widest mb-3 ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-600'
                  }`}>
                    SEPTEMBRE 2026
                  </p>
                  <p className={`text-sm md:text-base leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    Étudiant en 2e année de BUT Métiers du Multimédia et de l'Internet. Je suis à la recherche d'une alternance à partir de septembre 2026 dans le domaine de la création numérique et de l'audiovisuel.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className={`pt-6 border-t ${
              isDarkMode ? 'border-beige/10' : 'border-black/10'
            }`}>
              <p className={`text-xs tracking-widest mb-3 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                INTÉRESSÉ ?
              </p>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`inline-block px-6 py-3 text-xs tracking-widest border transition-all duration-300 cursor-pointer ${
                  isDarkMode
                    ? 'border-beige hover:bg-beige hover:text-black text-beige'
                    : 'border-black hover:bg-black hover:text-white text-black'
                }`}
              >
                <ShuffleText enabled={textEffectsEnabled}>CONTACTEZ-MOI</ShuffleText>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
