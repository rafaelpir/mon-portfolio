import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

const MOBILE_NAV_ITEMS = [
  { id: 'about', num: '01', label: 'common:nav.about' },
  { id: 'projects', num: '02', label: 'common:nav.projects' },
  { id: 'skills', num: '03', label: 'common:nav.skills' },
  { id: 'contact', num: '04', label: 'common:nav.contact' },
];

// Header de la home, isolé dans son propre composant : tout son état est
// piloté par le scroll (section active, contraste) ou des clics (menus).
// Avant cette extraction, cet état vivait dans Home() lui-même — chaque
// mise à jour re-rendait donc TOUTE la page (hero WebGL, dual-wave projets,
// carrousel skills, timeline, formulaire...) pour un simple changement de
// couleur de texte dans le header. Le déplacer ici confine ces re-renders
// au header seul.
export default function HomeHeader({ isDarkMode, setIsDarkMode, scrollToSection }) {
  const { t, i18n } = useTranslation(['common']);
  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // "Fil d'Ariane" de la page d'accueil : suit la section actuellement
  // visible pour surligner l'item correspondant dans la nav (une seule page
  // scrollée en continu, pas de vraie hiérarchie de liens ici). rootMargin
  // resserré à une fine bande au centre de l'écran : la section dont la
  // limite traverse cette bande devient "active".
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const sectionIds = ['about', 'projects', 'skills', 'contact'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Contraste du header selon ce qu'il survole : la section skills inverse
  // volontairement son fond par rapport à isDarkMode (bg-beige-light en dark
  // mode, bg-black en light mode) pour la variété visuelle — sans ce suivi,
  // le texte du header devient illisible dessus (ex. beige sur beige).
  // rootMargin réduit l'intersection à la bande du haut de l'écran (là où
  // vit le header), pas au centre comme `activeSection` ci-dessus.
  const [headerOverInvertedSection, setHeaderOverInvertedSection] = useState(false);
  useEffect(() => {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setHeaderOverInvertedSection(entry.isIntersecting),
      { rootMargin: '0px 0px -90% 0px', threshold: 0 }
    );
    observer.observe(skillsSection);
    return () => observer.disconnect();
  }, []);
  const headerIsDark = headerOverInvertedSection ? !isDarkMode : isDarkMode;

  // Le header (position: fixed) est un descendant normal de <body>, qui a
  // `transform: translateZ(0)` sur desktop (perf Lenis, index.css) — un
  // ancêtre transformé redéfinit le containing block, donc `fixed` s'y
  // comporte comme `absolute` et le header défile avec la page au lieu de
  // rester épinglé. Même fix que PageTransitionOverlay/ScrollListIndex/
  // ProjectsBentoGrid : portail attaché à <html>, hors de <body>.
  const [headerPortalNode, setHeaderPortalNode] = useState(null);
  useEffect(() => {
    const node = document.createElement('div');
    document.documentElement.appendChild(node);
    setHeaderPortalNode(node);
    return () => document.documentElement.removeChild(node);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (isSettingsOpen) setIsSettingsOpen(false);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    const handleClickOutside = (e) => {
      if (isSettingsOpen && !e.target.closest('.settings-menu')) {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isSettingsOpen, isMobileMenuOpen]);

  // Empêche le scroll de la page derrière le menu plein écran mobile.
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isMobileMenuOpen]);

  if (!headerPortalNode) return null;

  return createPortal(
    <header className={`fixed top-0 left-0 right-0 z-[110] px-4 md:px-8 py-2 md:py-3 transition-colors duration-300 ${
      headerIsDark
        ? 'bg-black/5'
        : 'bg-beige/5'
    }`}>
      <div className="w-full flex items-center justify-between">
        {/* Logo */}
        <Logo isDarkMode={headerIsDark} />

        {/* Navigation — l'item de la section actuellement visible
            (activeSection, cf. IntersectionObserver plus haut) reste
            pleinement coloré et souligné, les autres restent en gris :
            un "fil d'Ariane" pour une page à scroll continu, montrant où
            on se trouve plutôt qu'une hiérarchie de liens. */}
        <nav className="hidden lg:flex gap-8 items-center">
          <button
            onClick={() => scrollToSection('about')}
            className={`text-sm tracking-widest transition-colors cursor-pointer border-b pb-0.5 ${
              activeSection === 'about'
                ? headerIsDark ? 'text-beige border-beige' : 'text-black border-black'
                : headerIsDark
                  ? 'text-gray-400 border-transparent hover:text-beige'
                  : 'text-gray-700 border-transparent hover:text-black'
            }`}
          >
            <span className="text-[8px] align-super opacity-40 mr-1">01</span>{t('common:nav.about')}
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className={`text-sm tracking-widest transition-colors cursor-pointer border-b pb-0.5 ${
              activeSection === 'projects'
                ? headerIsDark ? 'text-beige border-beige' : 'text-black border-black'
                : headerIsDark
                  ? 'text-gray-400 border-transparent hover:text-beige'
                  : 'text-gray-700 border-transparent hover:text-black'
            }`}
          >
            <span className="text-[8px] align-super opacity-40 mr-1">02</span>{t('common:nav.projects')}
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className={`text-sm tracking-widest transition-colors cursor-pointer border-b pb-0.5 ${
              activeSection === 'skills'
                ? headerIsDark ? 'text-beige border-beige' : 'text-black border-black'
                : headerIsDark
                  ? 'text-gray-400 border-transparent hover:text-beige'
                  : 'text-gray-700 border-transparent hover:text-black'
            }`}
          >
            <span className="text-[8px] align-super opacity-40 mr-1">03</span>{t('common:nav.skills')}
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`text-sm tracking-widest transition-colors cursor-pointer border-b pb-0.5 ${
              activeSection === 'contact'
                ? headerIsDark ? 'text-beige border-beige' : 'text-black border-black'
                : headerIsDark
                  ? 'text-gray-400 border-transparent hover:text-beige'
                  : 'text-gray-700 border-transparent hover:text-black'
            }`}
          >
            <span className="text-[8px] align-super opacity-40 mr-1">04</span>{t('common:nav.contact')}
          </button>

          {/* Menu paramètres */}
          <div className="ml-4 relative settings-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className={`p-2 rounded-full transition-all duration-300 ${
                headerIsDark
                  ? 'bg-beige/10 hover:bg-beige/20 text-beige'
                  : 'bg-black/10 hover:bg-black/20 text-black'
              }`}
              aria-label={t('common:nav.settings')}
              aria-expanded={isSettingsOpen}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>

            {isSettingsOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50 ${
                isDarkMode ? 'bg-beige border border-black/20' : 'bg-gray-900 border border-beige/20'
              }`}>
                {/* Thème */}
                <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {t('common:theme.title')}
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between ${
                    isDarkMode ? 'hover:bg-black/5 text-black' : 'hover:bg-beige/10 text-beige'
                  }`}
                >
                  <span>{isDarkMode ? t('common:theme.dark') : t('common:theme.light')}</span>
                  {isDarkMode ? '🌙' : '☀️'}
                </button>

                {/* Langue */}
                <div className={`px-4 py-2 mt-2 text-xs font-semibold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {t('common:language.title')}
                </div>
                <button
                  onClick={() => i18n.changeLanguage(currentLang === 'fr' ? 'en' : 'fr')}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between ${
                    isDarkMode ? 'hover:bg-black/5 text-black' : 'hover:bg-beige/10 text-beige'
                  }`}
                >
                  <span>
                    <span className={currentLang === 'fr' ? 'font-bold' : 'opacity-50'}>FR</span>
                    <span className="opacity-30"> / </span>
                    <span className={currentLang === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Menu burger mobile et toggle thème */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              headerIsDark
                ? 'bg-beige/10 hover:bg-beige/20 text-beige'
                : 'bg-black/10 hover:bg-black/20 text-black'
            }`}
            aria-label={isDarkMode ? t('common:theme.light') : t('common:theme.dark')}
            aria-pressed={isDarkMode}
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`text-2xl transition-colors duration-300 ${headerIsDark ? 'text-beige' : 'text-black'}`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {/* Menu mobile — plein écran, refonte : grande typographie éditoriale
          (même logique 01/02/03/04 que la nav desktop, mais à l'échelle du
          titre du hero), entrée en cascade plutôt qu'un dropdown instantané. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.9, 0.3, 1] }}
            className={`lg:hidden fixed inset-0 z-[109] flex flex-col ${
              isDarkMode ? 'bg-black text-beige' : 'bg-beige text-black'
            }`}
          >
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {MOBILE_NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.2, 0.9, 0.3, 1] }}
                  onClick={() => { scrollToSection(item.id); setIsMobileMenuOpen(false); }}
                  className="text-left py-2"
                >
                  <span className="text-xs align-super opacity-40 mr-2">{item.num}</span>
                  <span
                    className={`uppercase font-heading leading-none transition-colors ${
                      activeSection === item.id
                        ? (isDarkMode ? 'text-beige' : 'text-black')
                        : 'opacity-30'
                    }`}
                    style={{ fontSize: 'clamp(2.25rem, 11vw, 3.5rem)', fontWeight: 600 }}
                  >
                    {t(item.label)}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.32, duration: 0.35 }}
              className={`px-8 pb-8 pt-6 flex items-center justify-between border-t ${
                isDarkMode ? 'border-beige/10' : 'border-black/10'
              }`}
            >
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-2 text-xs tracking-widest uppercase transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-beige' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>{isDarkMode ? t('common:theme.dark') : t('common:theme.light')}</span>
                <span aria-hidden="true">{isDarkMode ? '🌙' : '☀️'}</span>
              </button>
              <LanguageSwitcher isDarkMode={isDarkMode} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>,
    headerPortalNode
  );
}
