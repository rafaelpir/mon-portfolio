import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AvailabilityBadge({ availableDate, alternance, status, isDarkMode, performanceTier = 'full' }) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <button
      onClick={() => setIsModalOpen(true)}
      className={`inline-flex flex-row items-center justify-center gap-3 md:gap-8 w-full px-4 md:px-12 py-3 md:py-6 rounded-lg md:rounded-xl transition-all duration-500 hover:shadow-2xl backdrop-blur-lg shadow-xl md:shadow-2xl border-2 md:border-4 cursor-pointer ${
      isDarkMode
        ? 'bg-gradient-to-r from-orange-500/30 via-red-500/20 to-orange-500/30 border-orange-400/50 shadow-orange-500/20'
        : 'bg-gradient-to-r from-orange-500/40 via-red-500/30 to-orange-500/40 border-orange-600/60 shadow-orange-600/30'
    }`}
      aria-label={t('availability.ariaLabel')}>
      {/* Pulsing dot */}
      <div className="relative flex items-center justify-center shrink-0">
        {performanceTier !== 'none' && (
          <span className={`absolute w-5 h-5 md:w-8 md:h-8 rounded-full ${
            performanceTier === 'full' ? 'animate-ping' : 'animate-pulse'
          } ${isDarkMode ? 'bg-orange-300' : 'bg-orange-500'}`} style={{ opacity: 0.4 }}></span>
        )}
        <span className={`relative w-3 h-3 md:w-4 md:h-4 rounded-full ${
          isDarkMode ? 'bg-orange-300' : 'bg-orange-500'
        }`}></span>
      </div>

      {/* Badge text - responsive */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 min-w-0">
        <span className={`text-xs sm:text-sm md:text-xl font-bold tracking-wide uppercase ${
          isDarkMode ? 'text-orange-200' : 'text-orange-700'
        }`}>
          {status}
        </span>

        <span className={`hidden md:block text-2xl ${
          isDarkMode ? 'text-orange-300/40' : 'text-orange-600/40'
        }`}>•</span>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
          {alternance && (
            <>
              <span className={`text-xs sm:text-sm md:text-2xl font-black ${
                isDarkMode ? 'text-beige' : 'text-black'
              }`}>
                {alternance}
              </span>
              {availableDate && (
                <span className={`hidden sm:inline text-xs md:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  &
                </span>
              )}
            </>
          )}
          {availableDate && (
            <span className={`text-sm sm:text-base md:text-2xl font-black ${
              isDarkMode ? 'text-beige' : 'text-black'
            }`}>
              {availableDate}
            </span>
          )}
        </div>
      </div>
    </button>

    {/* Modal Popup */}
    {isModalOpen && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className={`relative max-w-md w-full border transition-all duration-500 ${
            isDarkMode
              ? 'bg-black border-beige/20'
              : 'bg-white border-black/20'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className={`absolute top-3 right-3 z-10 text-xs tracking-widest transition-opacity hover:opacity-50 pointer-events-auto cursor-pointer ${
              isDarkMode ? 'text-beige' : 'text-black'
            }`}
            aria-label={t('buttons.close')}
          >
            {t('buttons.close')} ✕
          </button>

          {/* Content */}
          <div className="p-5 md:p-6">
            {/* Header */}
            <div className="mb-5">
              <h2 className={`text-2xl font-light mb-1 ${
                isDarkMode ? 'text-beige' : 'text-black'
              }`}>
                {t('availability.title')}
              </h2>
              <p className={`text-xs tracking-widest ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {t('availability.subtitle')}
              </p>
            </div>

            {/* Alternance Section */}
            <div className="mb-5">
              <div className="flex items-start gap-2">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                  isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <h3 className={`text-lg font-light mb-0.5 ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}>
                    {t('availability.apprenticeship.title')}
                  </h3>
                  <p className={`text-xs tracking-widest mb-2 ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-600'
                  }`}>
                    {t('availability.apprenticeship.date')}
                  </p>
                  <p className={`text-sm leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {t('availability.apprenticeship.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className={`pt-4 border-t ${
              isDarkMode ? 'border-beige/10' : 'border-black/10'
            }`}>
              <p className={`text-xs tracking-widest mb-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {t('contact.interested')}
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
                {t('buttons.contactMe')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
