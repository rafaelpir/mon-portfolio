import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import GridSparkles from '../components/GridSparkles';
import ScrollRevealText from '../components/ScrollRevealText';

// Même logique que CATEGORY_STYLES dans Timeline.jsx : classes écrites en
// toutes lettres (pas de `${hue}-400` reconstruit) pour que le JIT Tailwind
// les détecte dans le texte source. Un accent par domaine de compétence,
// plutôt qu'un même liseré neutre partout — fait écho au code couleur déjà
// utilisé pour les catégories du Parcours.
const SKILL_CATEGORY_STYLES = {
  design: { border: 'border-l-orange-400/40', borderLight: 'border-l-orange-500/40' },
  audiovisual: { border: 'border-l-sky-400/40', borderLight: 'border-l-sky-500/40' },
  web: { border: 'border-l-emerald-400/40', borderLight: 'border-l-emerald-500/40' },
  soft: { border: 'border-l-purple-400/35', borderLight: 'border-l-purple-500/35' },
  office: { border: 'border-l-slate-400/40', borderLight: 'border-l-slate-500/40' },
  communication: { border: 'border-l-rose-400/40', borderLight: 'border-l-rose-500/40' },
};
const DEFAULT_SKILL_STYLE = SKILL_CATEGORY_STYLES.design;

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

  const journeyParagraphs = t('about:journey.paragraphs', { returnObjects: true });
  const interestsParagraphs = t('about:interests.paragraphs', { returnObjects: true });
  const skillCats = ['design', 'audiovisual', 'web', 'soft', 'office', 'communication'];

  return (
    <div className={`min-h-screen font-stamp transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-beige' : 'bg-white text-black'
    }`}>
      <Helmet>
        <html lang={currentLang} />
        <title>{t('about:meta.title')}</title>
        <meta name="description" content={t('about:meta.description')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.rafaelpiral.fr/about" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.rafaelpiral.fr/about" />
        <meta property="og:title" content={t('about:meta.title')} />
        <meta property="og:description" content={t('about:meta.description')} />
        <meta property="og:image" content="https://www.rafaelpiral.fr/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={currentLang === 'fr' ? 'fr_FR' : 'en_US'} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.rafaelpiral.fr/about" />
        <meta property="twitter:title" content={t('about:meta.title')} />
        <meta property="twitter:description" content={t('about:meta.description')} />
        <meta property="twitter:image" content="https://www.rafaelpiral.fr/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "url": "https://www.rafaelpiral.fr/about",
          "name": "À Propos - Rafael Piral",
          "mainEntity": {
            "@type": "Person",
            "name": "Rafael Piral",
            "alternateName": "Piral",
            "url": "https://www.rafaelpiral.fr",
            "image": "https://www.rafaelpiral.fr/og-image.jpg",
            "jobTitle": "Étudiant BUT MMI - Designer Graphique & Audiovisuel",
            "description": "Étudiant en 3e année de BUT Métiers du Multimédia et de l'Internet à l'IUT de Bobigny. Spécialisé en design graphique, UI/UX design et audiovisuel.",
            "knowsAbout": ["Design Graphique", "UI/UX Design", "Audiovisuel", "Figma", "Photoshop", "Illustrator", "Premiere Pro", "Motion Design", "Branding"],
            "sameAs": [
              "https://www.linkedin.com/in/rafaelpiral",
              "https://github.com/rafaelpir",
              "https://www.behance.net/rafaelpiral1"
            ],
            "alumniOf": {
              "@type": "EducationalOrganization",
              "name": "IUT de Bobigny",
              "department": "BUT Métiers du Multimédia et de l'Internet (MMI)"
            }
          }
        })}</script>
      </Helmet>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-2 md:py-3 transition-colors duration-300 ${
        isDarkMode ? 'bg-black/5' : 'bg-beige/5'
      }`}>
        <div className="w-full flex justify-between items-center">
          <Logo isDarkMode={isDarkMode} />

          <div className="flex items-center gap-4 md:gap-6">
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
      <section className="min-h-screen flex flex-col justify-center px-4 md:px-16 pt-32 pb-16 relative overflow-hidden">
        <GridSparkles isDarkMode={isDarkMode} className="z-0" />

        <div className="relative z-10">
          <h1
            className={`uppercase leading-none mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}
            style={{
              fontFamily: '"PP Neue Montreal", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 12vw, 11rem)',
            }}
          >
            {t('about:hero.title')}
          </h1>

          <p
            className={`max-w-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.75rem)', lineHeight: 1.4 }}
          >
            {t('about:hero.tagline')}
          </p>
        </div>
      </section>

      {/* Mon Parcours */}
      <section className="px-4 md:px-16 py-20 md:py-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <h2 className="text-[10px] md:text-sm tracking-widest mb-8 text-gray-500 uppercase">
              {t('about:journey.title')}
            </h2>
            <div className="space-y-6 text-lg md:text-2xl font-light" style={{ lineHeight: 1.5 }}>
              {journeyParagraphs.map((paragraph, index) => (
                <ScrollRevealText key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {paragraph}
                </ScrollRevealText>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[10px] md:text-sm tracking-widest mb-8 text-gray-500 uppercase">
              {t('about:interests.title')}
            </h2>
            <div className="space-y-6 text-lg md:text-2xl font-light" style={{ lineHeight: 1.5 }}>
              {interestsParagraphs.map((paragraph, index) => (
                <ScrollRevealText key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {paragraph}
                </ScrollRevealText>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compétences & Outils */}
      <section className="px-4 md:px-16 py-20 md:py-32">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-[10px] md:text-sm tracking-widest mb-12 md:mb-16 text-gray-500 text-center uppercase">
            {t('about:skills.title')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {skillCats.map((cat) => {
              const style = SKILL_CATEGORY_STYLES[cat] || DEFAULT_SKILL_STYLE;
              const items = t(`about:skills.categories.${cat}.items`, { returnObjects: true });
              return (
                <div
                  key={cat}
                  className={`group p-6 md:p-8 border border-l-[3px] transition-all duration-300 hover:-translate-y-0.5 ${
                    isDarkMode
                      ? `border-beige/10 ${style.border} hover:bg-beige/[0.03]`
                      : `border-black/10 ${style.borderLight} hover:bg-black/[0.03]`
                  }`}
                >
                  <h3
                    className={`text-lg mb-4 ${isDarkMode ? 'text-beige' : 'text-black'}`}
                    style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}
                  >
                    {t(`about:skills.categories.${cat}.title`)}
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-gray-500 leading-relaxed">
                    {items.map((item, index) => (
                      <span key={index}>
                        {item}
                        {index < items.length - 1 && <span className="opacity-40"> · </span>}
                      </span>
                    ))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Passions & Intérêts */}
      <section className="px-4 md:px-16 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[10px] md:text-sm tracking-widest mb-12 text-gray-500 uppercase">
            {t('about:inspirations.title')}
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className={`text-2xl md:text-3xl mb-4 ${isDarkMode ? 'text-beige' : 'text-black'}`}>
                {t('about:inspirations.design.title')}
              </h3>
              <p
                className={`font-light ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)', lineHeight: 1.5 }}
              >
                {t('about:inspirations.design.content')}
              </p>
            </div>

            <div>
              <h3 className={`text-2xl md:text-3xl mb-4 ${isDarkMode ? 'text-beige' : 'text-black'}`}>
                {t('about:inspirations.learning.title')}
              </h3>
              <p
                className={`font-light ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)', lineHeight: 1.5 }}
              >
                {t('about:inspirations.learning.content')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className={`uppercase leading-none mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}
            style={{
              fontFamily: '"PP Neue Montreal", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            }}
          >
            {t('about:cta.title')}
          </h2>
          <p className={`text-lg md:text-xl font-light mb-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('about:cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:rafa2002@hotmail.fr"
              className={`px-8 py-4 border-2 text-sm tracking-widest transition-all ${
                isDarkMode
                  ? 'border-beige text-beige hover:bg-beige hover:text-black'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {t('about:cta.email')}
            </a>

            <Link
              to="/#projects"
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
      <footer className={`border-t px-4 md:px-8 py-8 ${isDarkMode ? 'border-beige/10' : 'border-black/10'}`}>
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
