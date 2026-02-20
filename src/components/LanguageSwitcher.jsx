import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ isDarkMode, className = '' }) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const toggleLanguage = () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider rounded-full transition-all duration-300 ${
        isDarkMode
          ? 'bg-beige/10 hover:bg-beige/20 text-beige border border-beige/20'
          : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
      } ${className}`}
      aria-label={currentLang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className={currentLang === 'fr' ? 'font-bold' : 'opacity-50'}>FR</span>
      <span className="opacity-30">/</span>
      <span className={currentLang === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
    </button>
  );
}
