import React from 'react';

export default function Statistics({ stats, isDarkMode }) {
  return (
    <section className="py-16 md:py-32 px-4 md:px-16">

      <div className="max-w-7xl mx-auto">
        <h2 className={`text-xs md:text-sm tracking-widest mb-12 md:mb-16 text-center ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          EN CHIFFRES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-card text-center p-8 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-beige/5 hover:bg-beige/10'
                  : 'bg-black/5 hover:bg-black/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span
                  className={`text-5xl md:text-7xl font-light ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}
                >
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className={`text-4xl md:text-6xl font-light ${
                    isDarkMode ? 'text-beige/60' : 'text-black/60'
                  }`}>
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className={`mt-4 text-sm md:text-base tracking-widest ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
