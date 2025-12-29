import React from 'react';
import ShuffleText from '../ShuffleText';

export default function AvailabilityBadge({ availableDate, alternance, status, isDarkMode, textEffectsEnabled }) {
  return (
    <div className={`inline-flex flex-row items-center gap-3 md:gap-8 px-4 md:px-12 py-3 md:py-6 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl backdrop-blur-lg shadow-xl md:shadow-2xl border-2 md:border-4 ${
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
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 min-w-0">
        <span className={`text-xs md:text-xl font-bold tracking-wide uppercase ${
          isDarkMode ? 'text-orange-200' : 'text-orange-700'
        }`}>
          <ShuffleText enabled={textEffectsEnabled}>{status}</ShuffleText>
        </span>

        <span className={`hidden md:block text-2xl ${
          isDarkMode ? 'text-orange-300/40' : 'text-orange-600/40'
        }`}>•</span>

        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 min-w-0">
          <span className={`text-sm md:text-2xl font-black ${
            isDarkMode ? 'text-beige' : 'text-black'
          }`}>
            <ShuffleText enabled={textEffectsEnabled}>{availableDate}</ShuffleText>
          </span>

          {alternance && (
            <>
              <span className={`hidden md:inline text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                &
              </span>
              <span className={`text-xs md:text-2xl font-black ${
                isDarkMode ? 'text-beige' : 'text-black'
              }`}>
                <ShuffleText enabled={textEffectsEnabled}>{alternance}</ShuffleText>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
