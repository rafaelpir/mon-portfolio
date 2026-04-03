import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function About() {
  const { t, i18n } = useTranslation(['about', 'common']);
  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className={`min-h-screen font-stamp transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-beige' : 'bg-white text-black'
    }`}>
      <Helmet>
        <html lang={currentLang} />
        <title>{t('about:meta.title')}</title>
        <meta name="description" content={t('about:meta.description')} />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
            <img
              src="/images/logos/RP.webp"
              alt="RP"
              width={128}
              height={128}
              className={`w-full h-full object-contain ${isDarkMode ? 'invert' : ''}`}
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-beige' : 'text-gray-700 hover:text-black'
              }`}
            >
              {t('about:header.back')}
            </Link>

            <LanguageSwitcher isDarkMode={isDarkMode} />

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? 'bg-beige/10 hover:bg-beige/20 text-beige'
                  : 'bg-black/10 hover:bg-black/20 text-black'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16 relative overflow-hidden">
        {/* Vidéo de fond */}
        <video
          autoPlay
          loop
          muted
          playsInline
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isDarkMode ? 0.15 : 0.1,
            filter: isDarkMode ? 'none' : 'invert(1)',
            transform: 'scale(1.1)'
          }}
        >
          <source src="/videos/fond.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay animé */}
        <div className="absolute inset-0" style={{
          background: isDarkMode
            ? 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-[12vw] md:text-[8vw] font-light leading-none tracking-tight mb-8">
            {t('about:hero.title')}
          </h1>

          <p className={`text-lg md:text-2xl font-light leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('about:hero.tagline')}
          </p>
        </div>
      </section>

      {/* Mon Parcours */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              {t('about:journey.title')}
            </h2>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed">
              {t('about:journey.paragraphs', { returnObjects: true }).map((paragraph, index) => (
                <p key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              {t('about:interests.title')}
            </h2>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed">
              {t('about:interests.paragraphs', { returnObjects: true }).map((paragraph, index) => (
                <p key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compétences & Outils */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-light mb-16 text-center">
            {t('about:skills.title')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Design Graphique */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                {t('about:skills.categories.design.title')}
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about:skills.categories.design.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* Audiovisuel */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                {t('about:skills.categories.audiovisual.title')}
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about:skills.categories.audiovisual.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* Développement Web */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                {t('about:skills.categories.web.title')}
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about:skills.categories.web.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* Soft Skills */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                {t('about:skills.categories.soft.title')}
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about:skills.categories.soft.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Autres compétences */}
          <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                {t('about:skills.categories.office.title')}
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about:skills.categories.office.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                {t('about:skills.categories.communication.title')}
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('about:skills.categories.communication.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Passions & Intérêts */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-light mb-12">
            {t('about:inspirations.title')}
          </h2>

          <div className="space-y-8 text-base md:text-lg font-light leading-relaxed">
            <div>
              <h3 className="text-2xl mb-4">
                {t('about:inspirations.design.title')}
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {t('about:inspirations.design.content')}
              </p>
            </div>

            <div>
              <h3 className="text-2xl mb-4">
                {t('about:inspirations.learning.title')}
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {t('about:inspirations.learning.content')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-light mb-8">
            {t('about:cta.title')}
          </h2>
          <p className={`text-lg md:text-xl font-light mb-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('about:cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:contact@rafaelpiral.fr"
              className={`px-8 py-4 border-2 text-sm tracking-widest transition-all ${
                isDarkMode
                  ? 'border-beige text-beige hover:bg-beige hover:text-black'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {t('about:cta.email')}
            </a>

            <Link
              to="/"
              className={`px-8 py-4 border-2 text-sm tracking-widest transition-all ${
                isDarkMode
                  ? 'border-gray-600 text-gray-400 hover:border-beige hover:text-beige'
                  : 'border-gray-400 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              {t('about:cta.projects')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} px-4 md:px-8 py-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} Rafael Piral. {t('about:footer.rights')}
          </p>

          <div className="flex gap-6">
            <a
              href="https://github.com/rafaelpir"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-beige' : 'text-gray-600 hover:text-black'
              }`}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/rafaelpiral"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-beige' : 'text-gray-600 hover:text-black'
              }`}
            >
              LinkedIn
            </a>
            <a
              href="https://dribbble.com/RafaelPiral"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-beige' : 'text-gray-600 hover:text-black'
              }`}
            >
              Dribbble
            </a>
            <a
              href="https://www.behance.net/rafaelpiral1"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-beige' : 'text-gray-600 hover:text-black'
              }`}
            >
              Behance
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
