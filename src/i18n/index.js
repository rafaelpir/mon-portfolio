import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traductions françaises
import commonFR from './locales/fr/common.json';
import homeFR from './locales/fr/home.json';
import aboutFR from './locales/fr/about.json';
import projectsFR from './locales/fr/projects.json';
import seoFR from './locales/fr/seo.json';
import cvFR from './locales/fr/cv.json';

// Traductions anglaises
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import aboutEN from './locales/en/about.json';
import projectsEN from './locales/en/projects.json';
import seoEN from './locales/en/seo.json';
import cvEN from './locales/en/cv.json';

const resources = {
  fr: {
    common: commonFR,
    home: homeFR,
    about: aboutFR,
    projects: projectsFR,
    seo: seoFR,
    cv: cvFR
  },
  en: {
    common: commonEN,
    home: homeEN,
    about: aboutEN,
    projects: projectsEN,
    seo: seoEN,
    cv: cvEN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'home', 'about', 'projects', 'seo', 'cv'],

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: true
    }
  });

export default i18n;
