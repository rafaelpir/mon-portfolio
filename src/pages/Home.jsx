import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollListIndex from '../components/ScrollListIndex';
import ProjectsDualWave from '../components/ProjectsDualWave';
import { useForm, ValidationError } from '@formspree/react';
import { ReactLenis, useLenis } from 'lenis/dist/lenis-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, experiencesPro, skillCategories } from '../data/projects';
import ProjectFilters from '../components/ProjectFilters';
import HomeHeader from '../components/HomeHeader';
import Timeline from '../components/Timeline';
import FullWidthText from '../components/FullWidthText';
import ScrollRevealText from '../components/ScrollRevealText';
import LogoCarousel from '../components/LogoCarousel';
import CVDownloadButton from '../components/CVDownloadButton';
import usePerformanceTier from '../hooks/usePerformanceTier';
import SideRays from '../components/SideRays';
import GridSparkles from '../components/GridSparkles';
import MilkyWay from '../components/MilkyWay';

// Lenis fait défiler la page via son propre système virtuel : sans ce pont,
// ScrollTrigger (GSAP) ne recalcule jamais sa position et les animations
// scrubbées (ex. ScrollRevealText) restent figées à leur état de départ.
function LenisScrollTriggerBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function Home() {
  const navigate = useNavigate();
  const tier = usePerformanceTier();
  const { t, i18n } = useTranslation(['home', 'common', 'seo']);

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Charger la préférence depuis localStorage
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [textEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('textEffects');
    return saved !== null ? JSON.parse(saved) : false;
  });
  // Détecter si on est sur mobile pour désactiver Lenis
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Formspree hook pour le formulaire de contact
  // Remplacez "xjknoepn" par votre vrai ID de formulaire Formspree
  const [formState, handleFormSubmit] = useForm("xjknoepn");

  // Fonction de navigation smooth sans changer l'URL
  const scrollToSection = (sectionId) => {
    // Cas particulier "projets" (desktop) : la section "dual wave" détermine
    // le mot en surbrillance par proximité du CENTRE du viewport (scroll
    // continu), pas par "premier élément". En scrollant juste le HAUT de la
    // section en vue (comportement par défaut), le centre du viewport tombe
    // au milieu de la liste (à cause du titre/des filtres au-dessus) et un
    // projet arbitraire se retrouve en surbrillance au lieu du premier. On
    // scrolle donc directement le premier mot au centre de l'écran.
    const firstWord = document.querySelector('.dual-wave-wrapper .wave-column-left .animated-text');
    if (sectionId === 'projects' && firstWord) {
      firstWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Sauvegarder la préférence de thème
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Sauvegarder les préférences d'effets de texte
  useEffect(() => {
    localStorage.setItem('textEffects', JSON.stringify(textEffectsEnabled));
  }, [textEffectsEnabled]);

  // Fusionner projets universitaires et expériences professionnelles
  const allProjects = [...experiencesPro, ...projects];

  // Catégories à afficher dans les filtres
  const categories = ['Tous', 'Affiches', 'Branding', 'UI/UX Design', 'Photographie', 'Audiovisuel', 'Développement web'];

  // Outils reconnus uniquement (exclut disciplines et techniques)
  const toolWhitelist = ['Photoshop', 'Illustrator', 'Figma', 'InDesign', 'Premiere Pro', 'After Effects', 'Motion Design'];
  const allTags = toolWhitelist.filter(tool =>
    allProjects.some(p => (p.tags || []).includes(tool))
  );

  const isLocalhost = window.location.hostname === 'localhost';

  // Filtrer les projets selon la catégorie et les tags (exclure les projets cachés)
  const filteredProjects = allProjects.filter(project => {
    if (project.hidden && !isLocalhost) return false;
    const categoryMatch = selectedCategory === 'Tous' || project.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => (project.tags || []).includes(tag));
    return categoryMatch && tagMatch;
  });



  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  // Meta tags (toujours rendus, pas affectés par Lenis)
  const helmet = (
    <Helmet>
      {/* Meta Tags Essentiels */}
      <html lang={currentLang} />
        <title>{t('seo:home.title')}</title>
        <meta name="description" content={t('seo:home.description')} />
        <meta name="keywords" content={t('seo:home.keywords')} />
        <meta name="author" content="Rafael Piral (Piral)" />
        <meta name="geo.region" content="FR-75" />
        <meta name="geo.placename" content="Le Pré Saint Gervais" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rafaelpiral.fr/" />
        <meta property="og:title" content={t('seo:home.ogTitle')} />
        <meta property="og:description" content={t('seo:home.ogDescription')} />
        <meta property="og:image" content="https://www.rafaelpiral.fr/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={currentLang === 'fr' ? 'fr_FR' : 'en_US'} />
        <meta property="og:site_name" content="Rafael Piral Portfolio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.rafaelpiral.fr/" />
        <meta property="twitter:title" content={t('seo:home.ogTitle')} />
        <meta property="twitter:description" content={t('seo:home.ogDescription')} />
        <meta name="twitter:image" content="https://www.rafaelpiral.fr/og-image.jpg" />
        <meta name="twitter:creator" content="@rafaelpiral" />
        <meta name="twitter:site" content="@rafaelpiral" />

        {/* Informations Additionnelles */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href="https://www.rafaelpiral.fr/" />

        {/* JSON-LD Structured Data - Person */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Rafael Piral",
            "alternateName": "Piral",
            "url": "https://www.rafaelpiral.fr",
            "image": "https://www.rafaelpiral.fr/og-image.jpg",
            "sameAs": [
              "https://www.linkedin.com/in/rafaelpiral",
              "https://github.com/rafaelpir",
              "https://www.rafaelpiral.fr"
            ],
            "jobTitle": "Étudiant BUT MMI - Designer Graphique & Audiovisuel",
            "worksFor": {
              "@type": "EducationalOrganization",
              "name": "IUT de Bobigny - BUT MMI",
              "description": "BUT Métiers du Multimédia et de l'Internet"
            },
            "description": "Piral Rafael - Étudiant MMI en 3e année de BUT Métiers du Multimédia et de l'Internet à l'IUT de Bobigny. Spécialisé en design graphique, UI/UX design et audiovisuel. Parcours Créations Numériques. Disponible pour stage avril 2026.",
            "knowsAbout": ["Design Graphique", "UI/UX Design", "Audiovisuel", "Figma", "Photoshop", "Illustrator", "Premiere Pro", "DaVinci Resolve", "Motion Design", "Branding"],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Le Pré Saint Gervais",
              "addressRegion": "Île-de-France",
              "addressCountry": "FR"
            },
            "email": "rafa2002@hotmail.fr",
            "alumniOf": {
              "@type": "EducationalOrganization",
              "name": "IUT de Bobigny",
              "department": "BUT Métiers du Multimédia et de l'Internet (MMI)"
            }
          })}
        </script>

        {/* JSON-LD Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Rafael Piral - Étudiant BUT MMI Portfolio",
            "alternateName": ["Piral Portfolio", "Portfolio étudiant MMI"],
            "url": "https://www.rafaelpiral.fr",
            "description": "Portfolio officiel de Piral Rafael - Étudiant MMI en BUT Métiers du Multimédia et de l'Internet. Design graphique, UI/UX et audiovisuel.",
            "author": {
              "@type": "Person",
              "name": "Rafael Piral",
              "alternateName": "Piral"
            },
            "inLanguage": "fr-FR",
            "copyrightYear": new Date().getFullYear(),
            "copyrightHolder": {
              "@type": "Person",
              "name": "Rafael Piral"
            }
          })}
        </script>

        {/* JSON-LD Structured Data - ProfilePage (renforce la home comme page-profil de référence) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": "https://www.rafaelpiral.fr/#profilepage",
            "url": "https://www.rafaelpiral.fr/",
            "name": t('seo:home.title'),
            "mainEntity": {
              "@type": "Person",
              "name": "Rafael Piral",
              "alternateName": "Piral"
            }
          })}
        </script>

        {/* JSON-LD Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://www.rafaelpiral.fr"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Projets",
                "item": "https://www.rafaelpiral.fr/#projects"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "À propos",
                "item": "https://www.rafaelpiral.fr/#about"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Contact",
                "item": "https://www.rafaelpiral.fr/#contact"
              }
            ]
          })}
        </script>
    </Helmet>
  );

  // Contenu principal (sera wrappé par Lenis sur desktop)
  const mainContent = (
    <div className={`font-stamp transition-colors duration-300 overflow-x-hidden ${
      isDarkMode
        ? 'bg-black text-beige'
        : 'bg-white text-black'
    }`}>
      <LenisScrollTriggerBridge />

      {/* Header avec navigation — extrait dans son propre composant
          (HomeHeader) : son état (section active, contraste au scroll,
          menus) est purement local au header, isolé ainsi des re-renders
          du reste de la page (hero WebGL, projets, skills, timeline...). */}
      <HomeHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section className="h-screen flex flex-col relative overflow-hidden">
        {/* Grille de points lumineux, en fond statique */}
        <GridSparkles isDarkMode={isDarkMode} className="z-0" />

        {/* Semis de points en fond (CSS/SVG, pas de WebGL) — colorimétrie
            adaptée par mode (étoiles blanches sur fond sombre, grain
            ambré/encre sur fond clair, voir MilkyWay.jsx) */}
        <MilkyWay className="z-0" isDarkMode={isDarkMode} />

        {/* SideRays background — coûteuse en GPU (WebGL), désactivée hors tier 'full' */}
        {tier === 'full' && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0">
              <SideRays
                speed={2.5}
                intensity={1.6}
                spread={2}
                origin="bottom-left"
                saturation={1.4}
                blend={0.65}
                falloff={1.6}
                autoColor={true}
                colorSpeed={6}
              />
            </div>
            <div className="absolute inset-0">
              <SideRays
                speed={2.5}
                intensity={1.6}
                spread={2}
                origin="bottom-right"
                saturation={1.4}
                blend={0.65}
                falloff={1.6}
                autoColor={true}
                colorSpeed={6}
              />
            </div>
          </div>
        )}

        {/* Sous-titre — centre, aligné à droite */}
        <div className={`flex-1 flex items-center relative z-10 px-4 md:px-16 pt-16 ${!isMobile ? 'animate-fade-in-up' : ''}`}>
          <div className="w-full flex justify-end">
            <div className="w-full sm:w-[45%] text-right">
              <p
                className={`select-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.35rem)', lineHeight: 1.4 }}
              >
                <span style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 300 }}>
                  Rafael Piral est un designer graphique basé à Paris, dont le travail navigue entre design graphique, UI/UX design et audiovisuel, porté par un goût pour les{' '}
                </span>
                <span style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontStyle: 'italic', fontWeight: 300 }}>
                  identités visuelles épurées et affirmées
                </span>
                <span style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 300 }}>
                  .
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Titre — en bas, pleine largeur */}
        <div className={`relative z-10 pt-8 md:pt-12 px-4 md:px-10 ${!isMobile ? 'animate-slide-down' : ''}`}>
          <h1 className={`uppercase select-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <FullWidthText
              text="Rafael Piral"
              style={{
                fontFamily: '"PP Neue Montreal", sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(3rem, 11vw, 14rem)',
                lineHeight: 1,
              }}
            />
          </h1>
        </div>

        {/* Métadonnées — toujours en bas, juste en dessous du titre */}
        <div className="relative z-10 flex items-center px-4 md:px-16 py-4 shrink-0">
          <div
            className="flex-1 flex justify-between uppercase tracking-widest"
            style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 300, fontSize: '0.75rem', color: '#888888' }}
          >
            <span>{t('home:hero.meta.year')}</span>
            <span>{t('home:hero.meta.location')}</span>
            <span>{t('home:hero.meta.role')}</span>
          </div>
        </div>

      </section>

      {/* Introduction / About — un fondu vertical léger et déclenché tôt
          (amount: 0.05) plutôt qu'un grand glissement horizontal (x:-100)
          qui ne se déclenchait qu'à 30% de section visible : après le hero
          plein écran et statique, ce "pop" tardif créait une coupure nette
          au lieu d'un enchaînement continu avec le reste du scroll. */}
      <motion.section
        id="about"
        className="flex items-center px-4 md:px-16 pt-24 md:pt-32 pb-16 md:pb-24"
        initial={tier === 'full' ? { opacity: 0, y: 32 } : {}}
        whileInView={tier === 'full' ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true, amount: 0.05 }}
        transition={tier === 'full' ? { duration: 0.8, ease: "easeOut" } : {}}
      >
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="sr-only">À propos de Rafael Piral</h2>
          <div className="w-full">
            <div>
            <div className="space-y-6 md:space-y-8 text-xl md:text-3xl font-light mb-8 md:mb-12 text-pretty" style={{ lineHeight: 1.6 }}>
  <ScrollRevealText>
    {t('home:about.intro1')}
  </ScrollRevealText>

  <ScrollRevealText className="text-gray-400">
    {t('home:about.intro2')}
  </ScrollRevealText>

  <ScrollRevealText className="text-gray-400">
    {t('home:about.intro3')}
  </ScrollRevealText>
</div>

            </div>
          </div>

          {/* Bouton vers la page À propos complète */}
          <div className="flex justify-center mt-12 md:mt-16">
            <Link
              to="/about"
              className={`px-8 py-4 border-2 text-sm tracking-widest transition-all ${
                isDarkMode
                  ? 'border-beige text-beige hover:bg-beige hover:text-black'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {t('common:buttons.learnMore')}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Projects Section - FlowingMenu */}
      <motion.section
        id="projects"
        className="relative pt-8 md:pt-12 pb-24 md:pb-48 px-4 md:px-16 overflow-hidden"
        initial={tier === 'full' ? { opacity: 0, y: 20 } : {}}
        whileInView={tier === 'full' ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true, amount: 0.2 }}
        transition={tier === 'full' ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] } : {}}
      >
        <div className="relative z-10">
          <h2 className="text-[10px] md:text-sm tracking-widest mb-6 md:mb-10 text-gray-500 text-center">
           {t('home:projects.title')}
          </h2>

          {/* Filtres avancés */}
          <div className="mb-4 md:mb-6">
            <ProjectFilters
              categories={categories}
              allTags={allTags}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              onCategoryChange={setSelectedCategory}
              onTagsChange={setSelectedTags}
              isDarkMode={isDarkMode}
              textEffectsEnabled={textEffectsEnabled}
              filteredCount={filteredProjects.length}
            />
          </div>

          {/* Liste texte sur mobile, colonnes "dual wave" scroll-driven sur
              desktop — montage conditionnel (pas juste masqué en CSS) pour
              éviter le coût de l'effet sur mobile. */}
          {isMobile ? (
            <div className="max-w-6xl mx-auto">
              <ScrollListIndex
                items={filteredProjects}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            /* -mx-4 md:-mx-16 : neutralise le padding horizontal de la
               section pour redonner à .dual-wave-wrapper une largeur proche
               du viewport complet. Son `gap: 25vw` (valeur du demo, non
               modifiée) est calculé par rapport au viewport, pas au
               conteneur : dans une largeur réduite par le padding de la
               page, ce gap fixe laissait 0px de marge de mouvement aux deux
               colonnes (elles remplissaient déjà tout l'espace restant),
               d'où l'absence d'ondulation. */
            <div className="-mx-4 md:-mx-16">
              <ProjectsDualWave projects={filteredProjects} />
            </div>
          )}
        </div>
      </motion.section>

      {/* Skills Section — entrée en parallax (léger décalage vertical qui se
          résorbe au scroll) : la section arrive avec un temps de retard
          volontaire plutôt que de suivre le flux de scroll au pixel près,
          pour ne pas empiéter visuellement sur la fin de la zone projets. */}
      <motion.section
        id="skills"
        className={`relative pt-8 md:pt-16 pb-16 md:pb-32 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-beige-light text-black'
            : 'bg-black text-beige'
        }`}
        initial={tier === 'full' ? { opacity: 0, y: 120 } : {}}
        whileInView={tier === 'full' ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true, amount: 0.15 }}
        transition={tier === 'full' ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] } : {}}
      >
        <div className="mb-12 text-center">
          <h2 className="text-xs md:text-sm tracking-widest text-gray-500">
            {t('home:skills.title')}
          </h2>
        </div>

        <div>
          <LogoCarousel
            skillCategories={skillCategories}
            isDarkMode={isDarkMode}
            performanceTier={tier}
          />
        </div>
      </motion.section>

      {/* Timeline Section */}
      <Timeline
        isDarkMode={isDarkMode}
        textEffectsEnabled={textEffectsEnabled}
      />

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="min-h-screen flex items-center justify-center px-4 md:px-8 py-16 md:py-32"
        initial={tier === 'full' ? { opacity: 0, x: -100 } : {}}
        whileInView={tier === 'full' ? { opacity: 1, x: 0 } : {}}
        viewport={{ once: true, amount: 0.3 }}
        transition={tier === 'full' ? { duration: 0.6, ease: "easeOut" } : {}}
      >
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-7xl lg:text-9xl mb-8 md:mb-20 leading-none text-center">
            {t('home:contact.title1')}
            <br />
            {t('home:contact.title2')}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Formulaire de contact */}
            <div>
              {formState.succeeded ? (
                <motion.div
                  className="text-center py-16"
                  initial={tier === 'full' ? { opacity: 0, scale: 0.9 } : {}}
                  animate={tier === 'full' ? { opacity: 1, scale: 1 } : {}}
                  transition={tier === 'full' ? { duration: 0.5 } : {}}
                >
                  <div className="mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'
                    }`}>
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl md:text-3xl font-light mb-4">
                    {t('common:form.successTitle')}
                  </p>
                  <p className="text-base md:text-xl text-gray-500">
                    {t('common:form.successMessage')}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
                  <div className="group">
                    <label htmlFor="contact-name" className="sr-only">{t('common:form.name')}</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder={t('common:form.name')}
                      className={`w-full bg-transparent border-b-2 py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-all duration-300 ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige placeholder:text-gray-600'
                          : 'border-gray-300 focus:border-black placeholder:text-gray-400'
                      }`}
                      required
                    />
                    <ValidationError prefix="Name" field="name" errors={formState.errors} />
                  </div>

                  <div className="group">
                    <label htmlFor="contact-email" className="sr-only">{t('common:form.email')}</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder={t('common:form.email')}
                      className={`w-full bg-transparent border-b-2 py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-all duration-300 ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige placeholder:text-gray-600'
                          : 'border-gray-300 focus:border-black placeholder:text-gray-400'
                      }`}
                      required
                    />
                    <ValidationError prefix="Email" field="email" errors={formState.errors} />
                  </div>

                  <div className="group">
                    <label htmlFor="contact-subject" className="sr-only">{t('common:form.subject')}</label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      placeholder={t('common:form.subject')}
                      className={`w-full bg-transparent border-b-2 py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-all duration-300 ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige placeholder:text-gray-600'
                          : 'border-gray-300 focus:border-black placeholder:text-gray-400'
                      }`}
                    />
                    <ValidationError prefix="Subject" field="subject" errors={formState.errors} />
                  </div>

                  <div className="group">
                    <label htmlFor="contact-message" className="sr-only">{t('common:form.message')}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder={t('common:form.message')}
                      rows="5"
                      className={`w-full bg-transparent border-b-2 py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-all duration-300 resize-none ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige placeholder:text-gray-600'
                          : 'border-gray-300 focus:border-black placeholder:text-gray-400'
                      }`}
                      required
                    />
                    <ValidationError prefix="Message" field="message" errors={formState.errors} />
                  </div>

                  <button
                    type="submit"
                    disabled={formState.submitting}
                    className={`group relative w-full border-2 py-4 md:py-6 text-base md:text-xl font-light tracking-widest transition-all duration-500 overflow-hidden ${
                      formState.submitting
                        ? 'opacity-50 cursor-not-allowed'
                        : isDarkMode
                        ? 'border-beige hover:border-beige'
                        : 'border-black hover:border-black'
                    }`}
                  >
                    <span className={`absolute inset-0 transition-transform duration-500 ${
                      formState.submitting ? '' : 'translate-y-full group-hover:translate-y-0'
                    } ${isDarkMode ? 'bg-beige' : 'bg-black'}`}></span>
                    <span className={`relative z-10 transition-colors duration-500 ${
                      formState.submitting ? '' : isDarkMode ? 'group-hover:text-black' : 'group-hover:text-white'
                    }`}>
                      {formState.submitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('common:buttons.sending')}
                        </span>
                      ) : t('common:buttons.sendMessage')}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Informations de contact */}
            <div className="flex flex-col justify-center space-y-8 md:space-y-10">
              <CVDownloadButton variant="secondary" isDarkMode={isDarkMode} className="self-start" />

              <motion.div
                initial={tier === 'full' ? { opacity: 0, x: 20 } : {}}
                whileInView={tier === 'full' ? { opacity: 1, x: 0 } : {}}
                viewport={{ once: true }}
                transition={tier === 'full' ? { delay: 0.1 } : {}}
                className="group"
              >
                <p className="text-xs md:text-sm text-gray-500 mb-3 tracking-widest">{t('common:contact.email')}</p>
                <a
                  href="mailto:rafa2002@hotmail.fr"
                  className={`text-lg md:text-2xl font-light transition-all duration-300 break-all inline-block relative ${
                    isDarkMode ? 'hover:text-beige' : 'hover:text-black'
                  }`}
                >
                  <span className="relative">
                    rafa2002@hotmail.fr
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isDarkMode ? 'bg-beige' : 'bg-black'
                    }`}></span>
                  </span>
                </a>
              </motion.div>

              <motion.div
                initial={tier === 'full' ? { opacity: 0, x: 20 } : {}}
                whileInView={tier === 'full' ? { opacity: 1, x: 0 } : {}}
                viewport={{ once: true }}
                transition={tier === 'full' ? { delay: 0.3 } : {}}
              >
                <p className="text-xs md:text-sm text-gray-500 mb-6 tracking-widest">{t('common:contact.social')}</p>
                <div className="grid grid-cols-2 gap-6 md:gap-8">
                  <a
                    href="https://www.linkedin.com/in/rafaelpiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/link text-lg md:text-2xl font-light transition-all duration-300 inline-block relative ${
                      isDarkMode ? 'hover:text-beige' : 'hover:text-black'
                    }`}
                  >
                    <span className="relative inline-flex items-center gap-2">
                      LinkedIn
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover/link:w-full ${
                        isDarkMode ? 'bg-beige' : 'bg-black'
                      }`}></span>
                    </span>
                  </a>
                  <a
                    href="https://github.com/rafaelpir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/link text-lg md:text-2xl font-light transition-all duration-300 inline-block relative ${
                      isDarkMode ? 'hover:text-beige' : 'hover:text-black'
                    }`}
                  >
                    <span className="relative inline-flex items-center gap-2">
                      GitHub
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover/link:w-full ${
                        isDarkMode ? 'bg-beige' : 'bg-black'
                      }`}></span>
                    </span>
                  </a>
                  <a
                    href="https://www.behance.net/rafaelpiral1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/link text-lg md:text-2xl font-light transition-all duration-300 inline-block relative ${
                      isDarkMode ? 'hover:text-beige' : 'hover:text-black'
                    }`}
                  >
                    <span className="relative inline-flex items-center gap-2">
                      Behance
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover/link:w-full ${
                        isDarkMode ? 'bg-beige' : 'bg-black'
                      }`}></span>
                    </span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className={`border-t py-16 md:py-24 px-4 md:px-16 ${
        isDarkMode ? 'border-beige/20' : 'border-black/20'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-xl md:text-2xl mb-6 tracking-wide">
                {t('common:footer.name')}
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed opacity-70">
                {t('common:footer.description')}
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="text-xl md:text-2xl mb-6 tracking-wide">
                {t('common:footer.navigation')}
              </h3>
              <nav className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('about')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <span className="text-[8px] align-super opacity-40 mr-1">01</span>{t('common:footer.aboutLink')}
                </button>
                <button onClick={() => scrollToSection('projects')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <span className="text-[8px] align-super opacity-40 mr-1">02</span>{t('common:footer.projectsLink')}
                </button>
                <button onClick={() => scrollToSection('skills')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <span className="text-[8px] align-super opacity-40 mr-1">03</span>{t('common:footer.skillsLink')}
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <span className="text-[8px] align-super opacity-40 mr-1">04</span>{t('common:footer.contactLink')}
                </button>
              </nav>
            </div>

            {/* Column 3 - Contact & Social */}
            <div>
              <h3 className="text-xl md:text-2xl mb-6 tracking-wide">
                {t('common:footer.contact')}
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:rafa2002@hotmail.fr"
                  className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                >
                  rafa2002@hotmail.fr
                </a>
                <div className="pt-4 space-y-2">
                  <a
                    href="https://www.linkedin.com/in/rafaelpiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    LinkedIn →
                  </a>
                  <a
                    href="https://github.com/rafaelpir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    GitHub →
                  </a>
                  <a
                    href="https://www.behance.net/rafaelpiral1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    Behance →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm opacity-50 ${
            isDarkMode ? 'border-beige/10' : 'border-black/10'
          }`}>
            <p>
              © {new Date().getFullYear()} Rafael Piral. {t('common:footer.rights')}
              {' · '}
              <Link to="/legal" className="hover:opacity-70 transition-opacity underline">
                {t('common:footer.legal')}
              </Link>
            </p>
            <img
              src="/images/rp-badge.svg"
              alt=""
              aria-hidden="true"
              className="w-full max-w-[220px] opacity-80 select-none pointer-events-none"
            />
          </div>
        </div>
      </footer>
    </div>
  );

  // Return conditionnel : Lenis uniquement sur desktop en tier full
  if (isMobile || tier !== 'full') {
    return (
      <>
        {helmet}
        {mainContent}
      </>
    );
  }

  return (
    <>
      {helmet}
      <ReactLenis
        root
        options={{
          lerp: 0.1,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
          syncTouch: true,
        }}
      >
        {mainContent}
      </ReactLenis>
    </>
  );
}