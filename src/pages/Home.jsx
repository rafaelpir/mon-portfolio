import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import FlowingMenu from '../FlowingMenu';
import { useForm, ValidationError } from '@formspree/react';
import { Turnstile } from '@marsidev/react-turnstile';
import ShuffleText from '../ShuffleText';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { projects, experiencesPro, skillCategories } from '../data/projects';
import GlitchText from '../components/GlitchText';
import AvailabilityBadge from '../components/AvailabilityBadge';
import CVDownloadButton from '../components/CVDownloadButton';
import ProjectFilters from '../components/ProjectFilters';
import Timeline from '../components/Timeline';
import LogoCarousel from '../components/LogoCarousel';
import WorkInProgressBanner from '../components/WorkInProgressBanner';
import usePresentationMode from '../hooks/usePresentationMode';
import { PixelTrail } from '../components/ui/PixelTrail';

export default function Home() {
  const navigate = useNavigate();
  const { isPresentationMode, togglePresentationMode, isFullscreenSupported } = usePresentationMode();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Charger la préférence depuis localStorage
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [textEffectsEnabled, setTextEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('textEffects');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Désactiver tous les effets sur mobile
  const effectsEnabled = textEffectsEnabled && !isMobile;

  // État pour Cloudflare Turnstile
  const [turnstileToken, setTurnstileToken] = useState(null);

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

  // Gestion de la soumission avec validation Turnstile
  const handleFormSubmitWithTurnstile = async (e) => {
    e.preventDefault();

    // Vérifier que le token Turnstile est présent
    if (!turnstileToken) {
      alert('Veuillez compléter la vérification de sécurité');
      return;
    }

    // Soumettre le formulaire avec Formspree
    await handleFormSubmit(e);

    // Réinitialiser le token après soumission
    setTurnstileToken(null);
  };

  // Fonction de navigation smooth sans changer l'URL
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (isSettingsOpen && !e.target.closest('.settings-menu')) {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isSettingsOpen]);

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

  // Catégories à afficher dans les filtres (Expériences Pro en premier pour mise en avant)
  const categories = ['Tous', 'Expériences Pro', 'Affiches', 'UI/UX Design', 'Branding', 'Photographie'];

  // Extraire tous les tags uniques
  const allTags = [...new Set(allProjects.flatMap(p => p.tags || []))].sort();

  // Filtrer les projets selon la catégorie et les tags
  const filteredProjects = allProjects.filter(project => {
    const categoryMatch = selectedCategory === 'Tous' || project.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => (project.tags || []).includes(tag));
    return categoryMatch && tagMatch;
  });

  // Configuration du FlowingMenu avec les projets (memoized pour performance)
  const menuItems = useMemo(() =>
    filteredProjects.map((project) => ({
      link: `/project/${project.id}`,
      text: project.title,
      image: project.thumbnail,
      onClick: () => navigate(`/project/${project.id}`)
    })),
    [filteredProjects, navigate]
  );

  // Meta tags (toujours rendus, pas affectés par Lenis)
  const helmet = (
    <Helmet>
      {/* Meta Tags Essentiels */}
      <html lang="fr" />
        <title>Rafael Piral - Portfolio Développeur Web & Designer UI/UX | Piral Rafael</title>
        <meta name="description" content="Rafael Piral (Piral) - Portfolio officiel. Rafael, développeur web et designer UI/UX. Étudiant BUT MMI spécialisé en développement React, JavaScript, design Figma et motion design. Découvrez les projets créatifs de Rafael Piral." />
        <meta name="keywords" content="Rafael, Rafael Piral, Piral, Rafael développeur, Rafael designer, Rafael portfolio, Piral portfolio, Rafael développeur web, Rafael MMI, Rafael React, Rafael JavaScript, Piral développeur, Piral designer, développeur web Rafael Piral, designer Rafael Piral, Rafael BUT MMI, Piral BUT MMI, Rafael Paris, Piral Paris, Rafael Le Pré Saint Gervais, UI/UX design, Figma, motion design, stage développeur Paris" />
        <meta name="author" content="Rafael Piral (Piral)" />
        <meta name="geo.region" content="FR-75" />
        <meta name="geo.placename" content="Le Pré Saint Gervais" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rafaelpiral.fr/" />
        <meta property="og:title" content="Rafael Piral - Portfolio Développeur Web & Designer UI/UX" />
        <meta property="og:description" content="Découvrez le portfolio de Rafael Piral. Rafael, développeur web et designer UI/UX spécialisé en React, JavaScript et Figma. Projets créatifs et innovants." />
        <meta property="og:image" content="https://www.rafaelpiral.fr/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Rafael Piral (Piral) Portfolio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.rafaelpiral.fr/" />
        <meta name="twitter:title" content="Rafael Piral - Développeur Web & Designer UI/UX" />
        <meta name="twitter:description" content="Portfolio de Rafael Piral. Rafael, développeur web React, JavaScript et designer UI/UX Figma. Étudiant BUT MMI." />
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
            "jobTitle": "Développeur Web & Designer UI/UX",
            "worksFor": {
              "@type": "EducationalOrganization",
              "name": "BUT MMI"
            },
            "description": "Rafael Piral (Piral) - Étudiant en 2ème année de BUT MMI spécialisé en développement web, design UI/UX et motion design. Disponible pour stage en 2026.",
            "knowsAbout": ["Développement Web", "React", "JavaScript", "UI/UX Design", "Figma", "Photoshop", "Motion Design", "Adobe Suite"],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Le Pré Saint Gervais",
              "addressRegion": "Île-de-France",
              "addressCountry": "FR"
            },
            "email": "rafa2002@hotmail.fr",
            "alumniOf": "BUT MMI"
          })}
        </script>

        {/* JSON-LD Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Rafael Piral - Portfolio",
            "alternateName": "Piral Portfolio",
            "url": "https://www.rafaelpiral.fr",
            "description": "Portfolio officiel de Rafael Piral (Piral) - Développeur web et designer UI/UX",
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

      {/* Bannière "En construction" */}
      <WorkInProgressBanner isDarkMode={isDarkMode} />

      {/* Curseur personnalisé (masqué sur mobile) */}
      <div
        className={`hidden md:block fixed w-4 h-4 border-2 rounded-full pointer-events-none z-50 mix-blend-difference ${
          isDarkMode ? 'border-beige' : 'border-black'
        }`}
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'transform 0.15s ease-out'
        }}
      />

      {/* Header avec navigation */}
      {!isPresentationMode && (
      <header className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 md:py-6 border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-black/5 border-beige/10'
          : 'bg-beige/5 border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo bullet.png avec rotation liée au scroll */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <img
              src="/bullet.png"
              alt="Logo"
              className="w-full h-full object-contain"
              style={{
                transform: `rotate(${scrollY * 0.5}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <button
              onClick={() => scrollToSection('about')}
              className={`text-sm tracking-widest transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              À PROPOS
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`text-sm tracking-widest transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              PROJETS
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className={`text-sm tracking-widest transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              COMPÉTENCES
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-sm tracking-widest transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              CONTACT
            </button>

            {/* Bouton CV */}
            <CVDownloadButton
              variant="secondary"
              isDarkMode={isDarkMode}
            />

            {/* Liens réseaux sociaux */}
            <div className="flex items-center gap-3 ml-2">
              <a
                href="https://www.linkedin.com/in/rafaelpiral"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'hover:bg-beige/10 text-gray-400 hover:text-beige'
                    : 'hover:bg-black/10 text-gray-600 hover:text-black'
                }`}
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com/rafaelpir"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'hover:bg-beige/10 text-gray-400 hover:text-beige'
                    : 'hover:bg-black/10 text-gray-600 hover:text-black'
                }`}
                aria-label="GitHub"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            {/* Menu paramètres */}
            <div className="ml-4 relative settings-menu">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-beige/10 hover:bg-beige/20 text-beige'
                    : 'bg-black/10 hover:bg-black/20 text-black'
                }`}
                aria-label="Paramètres"
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
                    THÈME
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between ${
                      isDarkMode ? 'hover:bg-black/5 text-black' : 'hover:bg-beige/10 text-beige'
                    }`}
                  >
                    <span>{isDarkMode ? 'Mode sombre' : 'Mode clair'}</span>
                    {isDarkMode ? '🌙' : '☀️'}
                  </button>

                  <div className={`my-2 border-t ${isDarkMode ? 'border-black/10' : 'border-beige/10'}`} />

                  {/* Effets de texte */}
                  <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    EFFETS DE TEXTE
                  </div>
                  <button
                    onClick={() => setTextEffectsEnabled(!textEffectsEnabled)}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between ${
                      isDarkMode ? 'hover:bg-black/5 text-black' : 'hover:bg-beige/10 text-beige'
                    }`}
                  >
                    <span>Effets shuffle</span>
                    <span className={`text-sm ${textEffectsEnabled ? 'text-green-500' : 'text-red-500'}`}>
                      {textEffectsEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <div className={`my-2 border-t ${isDarkMode ? 'border-black/10' : 'border-beige/10'}`} />

                  {/* Mode Présentation */}
                  <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    MODE PRÉSENTATION
                  </div>
                  <button
                    onClick={togglePresentationMode}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between ${
                      isDarkMode ? 'hover:bg-black/5 text-black' : 'hover:bg-beige/10 text-beige'
                    }`}
                    title="Raccourci: Ctrl+P"
                  >
                    <span>Plein écran {!isFullscreenSupported && '(Non supporté)'}</span>
                    <span className={`text-sm ${isPresentationMode ? 'text-green-500' : 'text-gray-500'}`}>
                      {isPresentationMode ? '✓ Actif' : 'Ctrl+P'}
                    </span>
                  </button>

                </div>
              )}
            </div>
          </nav>

          {/* Menu burger mobile et toggle thème */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
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
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-2xl"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${
            isDarkMode ? 'bg-black' : 'bg-beige'
          } border-t ${
            isDarkMode ? 'border-beige/10' : 'border-black/10'
          }`}>
            <nav className="flex flex-col py-4">
              <button
                onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }}
                className={`px-8 py-4 text-sm tracking-widest transition-colors text-left ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                À PROPOS
              </button>
              <button
                onClick={() => { scrollToSection('projects'); setIsMobileMenuOpen(false); }}
                className={`px-8 py-4 text-sm tracking-widest transition-colors text-left ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                PROJETS
              </button>
              <button
                onClick={() => { scrollToSection('skills'); setIsMobileMenuOpen(false); }}
                className={`px-8 py-4 text-sm tracking-widest transition-colors text-left ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                COMPÉTENCES
              </button>
              <button
                onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }}
                className={`px-8 py-4 text-sm tracking-widest transition-colors text-left ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                CONTACT
              </button>
            </nav>
          </div>
        )}
      </header>
      )}

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* PixelTrail Background - uniquement sur desktop */}
        {!isMobile && (
          <PixelTrail
            pixelSize={80}
            fadeDuration={2000}
            delay={0}
            className="absolute inset-0 z-0"
            pixelClassName={isDarkMode ? "bg-beige/50" : "bg-black/40"}
            autoAnimateInterval={400}
          />
        )}

        {/* Contenu principal avec animations améliorées */}
        <div
          className={`text-center relative z-10 pointer-events-none ${!isMobile ? 'animate-fade-in-up' : ''}`}
          style={{
            opacity: isMobile ? 1 : 1 - scrollY / 500
          }}
        >
          <div className={!isMobile ? 'animate-slide-down' : ''} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
            <h1 className={`text-[14vw] md:text-[10vw] font-light leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <ShuffleText enabled={effectsEnabled}>Rafael</ShuffleText>
            </h1>
            <h1 className={`text-[14vw] md:text-[10vw] font-light leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <ShuffleText enabled={effectsEnabled}>Piral</ShuffleText>
            </h1>
          </div>

          <div className={`text-xs sm:text-sm md:text-base font-light tracking-wide px-4 mt-4 md:mt-6 ${!isMobile ? 'animate-fade-in' : ''} space-y-1 md:space-y-2 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            style={!isMobile ? { animationDelay: '0.4s' } : {}}>
            <p className="text-xs sm:text-sm md:text-lg tracking-widest">
              <ShuffleText enabled={effectsEnabled}>DESIGN GRAPHIQUE & UI/UX • AUDIOVISUEL</ShuffleText>
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm">
              <ShuffleText enabled={effectsEnabled}>BUT2 Métiers du Multimédia et de l'Internet • IUT de Bobigny</ShuffleText>
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm">
              <ShuffleText enabled={effectsEnabled}>Parcours Créations Numériques</ShuffleText>
            </p>
            <p className={`text-[10px] sm:text-xs md:text-sm font-medium mt-2 ${isDarkMode ? 'text-beige' : 'text-black'}`}>
              <ShuffleText enabled={effectsEnabled}>En recherche de stage de 12 semaines à partir du 7 avril 2026</ShuffleText>
            </p>
          </div>

          {/* Badge de disponibilité */}
          <div className={`mt-4 md:mt-6 ${!isMobile ? 'animate-fade-in' : ''} flex justify-center pointer-events-auto`} style={!isMobile ? { animationDelay: '0.5s' } : {}}>
            <AvailabilityBadge
              status="En recherche de stage"
              availableDate="Avril 2026"
              alternance="Alternance pour septembre 2026"
              isDarkMode={isDarkMode}
              textEffectsEnabled={effectsEnabled}
            />
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-xs md:text-sm tracking-widest ${!isMobile ? 'animate-bounce' : ''} flex items-center justify-center pointer-events-none ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} style={{ zIndex: 10, whiteSpace: 'nowrap' }}>
          <ShuffleText enabled={effectsEnabled}>DÉFILER</ShuffleText>
        </div>
      </section>

      {/* Introduction / About */}
      <motion.section
        id="about"
        className="min-h-screen flex items-center px-4 md:px-16 py-16 md:py-32"
        initial={isMobile ? {} : { opacity: 0, x: -100 }}
        whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={isMobile ? {} : { duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Colonne gauche - Texte */}
            <div>
              <div className="space-y-6 md:space-y-8 text-lg md:text-3xl font-light leading-relaxed mb-8 md:mb-12">
                <p>
                  <ShuffleText enabled={effectsEnabled}>Bonjour, je m'appelle Rafael Piral.</ShuffleText>
                </p>
                <p className="text-gray-400">
                  <ShuffleText enabled={effectsEnabled}>Étudiant en 2ème année de BUT Métiers du Multimédia et de l'Internet, parcours Création Numérique, je me spécialise dans le design graphique, l'audiovisuel et le développement web.</ShuffleText>
                </p>
                <p className="text-gray-400">
                  <ShuffleText enabled={effectsEnabled}>Je suis actuellement à la recherche d'un stage d'au moins 8 semaines à partir d'avril 2026 dans le domaine de la création numérique et de l'audiovisuel. Je cherche à découvrir ce métier de l'intérieur et à participer activement à vos projets.</ShuffleText>
                </p>
                <p className="text-gray-400">
                  <ShuffleText enabled={effectsEnabled}>Je recherche également une alternance à partir de septembre 2026 pour poursuivre ma formation en BUT MMI tout en contribuant activement à des projets d'entreprise.</ShuffleText>
                </p>
                <p className="text-gray-400">
                  <ShuffleText enabled={effectsEnabled}>Si vous acceptez de partager votre savoir-faire avec quelqu'un de curieux, je serais ravi de vous rencontrer.</ShuffleText>
                </p>
              </div>

              <div className="flex gap-8 text-sm tracking-wider">
                <div>
                  <p className="text-gray-500 mb-2">LOCALISATION</p>
                  <p>Le Pré Saint Gervais, France</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-2">DISPONIBILITÉ</p>
                  <p>Recherche de stage</p>
                </div>
              </div>
            </div>

            {/* Colonne droite - Vidéo */}
            <div className="space-y-8">
              {/* Vidéo de présentation */}
              <motion.div
                className="rounded-xl overflow-hidden"
                initial={isMobile ? {} : { opacity: 0, y: 20 }}
                whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={isMobile ? {} : { duration: 0.8, delay: 0.4 }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-auto rounded-xl ${
                    isDarkMode ? 'opacity-90' : 'opacity-80'
                  }`}
                >
                  <source src="/videos/fond_leger.mp4" type="video/mp4" />
                </video>
              </motion.div>
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
              <ShuffleText enabled={effectsEnabled}>EN SAVOIR PLUS</ShuffleText>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Projects Section - FlowingMenu */}
      <motion.section
        id="projects"
        className="py-16 md:py-32 px-4 md:px-16"
        initial={isMobile ? {} : { opacity: 0, y: 20 }}
        whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={isMobile ? {} : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2 className="text-[10px] md:text-sm tracking-widest mb-8 md:mb-16 text-gray-500 text-center">
          <ShuffleText enabled={effectsEnabled}>PROJETS SÉLECTIONNÉS</ShuffleText>
        </h2>

        {/* Filtres avancés */}
        <div className="mb-8 md:mb-16">
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

        {/* FlowingMenu avec les projets */}
        <div className="max-w-6xl mx-auto">
          <div className="h-[400px] md:h-[600px] rounded-lg overflow-hidden">
            <FlowingMenu items={menuItems} isDarkMode={isDarkMode} />
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <section
        id="skills"
        className={`py-16 md:py-32 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-beige-light text-black'
            : 'bg-black text-beige'
        }`}
      >
        <div className="mb-12 text-center">
          <h2 className="text-xs md:text-sm tracking-widest text-gray-500">
            <ShuffleText enabled={effectsEnabled}>COMPÉTENCES</ShuffleText>
          </h2>
        </div>

        <div>
          <LogoCarousel
            skillCategories={skillCategories}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Timeline Section */}
      <Timeline
        isDarkMode={isDarkMode}
        textEffectsEnabled={textEffectsEnabled}
        scrollY={scrollY}
      />

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="min-h-screen flex items-center justify-center px-4 md:px-8 py-16 md:py-32"
        initial={isMobile ? {} : { opacity: 0, x: -100 }}
        whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={isMobile ? {} : { duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-7xl lg:text-9xl font-light mb-8 md:mb-20 leading-none text-center">
            <ShuffleText enabled={effectsEnabled}>TRAVAILLONS</ShuffleText>
            <br />
            <ShuffleText enabled={effectsEnabled}>ENSEMBLE</ShuffleText>
          </h2>

          {/* Bouton CV */}
          <div className="mb-8 md:mb-12 flex justify-center">
            <CVDownloadButton
              variant="primary"
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Formulaire de contact */}
            <div>
              {formState.succeeded ? (
                <motion.div
                  className="text-center py-16"
                  initial={isMobile ? {} : { opacity: 0, scale: 0.9 }}
                  animate={isMobile ? {} : { opacity: 1, scale: 1 }}
                  transition={isMobile ? {} : { duration: 0.5 }}
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
                    <ShuffleText enabled={effectsEnabled}>
                      Merci pour votre message !
                    </ShuffleText>
                  </p>
                  <p className="text-base md:text-xl text-gray-500">
                    Je vous répondrai dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmitWithTurnstile} className="space-y-6 md:space-y-8">
                  <div className="group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom *"
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
                    <input
                      type="email"
                      name="email"
                      placeholder="Votre email *"
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
                    <input
                      type="text"
                      name="subject"
                      placeholder="Sujet"
                      className={`w-full bg-transparent border-b-2 py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-all duration-300 ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige placeholder:text-gray-600'
                          : 'border-gray-300 focus:border-black placeholder:text-gray-400'
                      }`}
                    />
                    <ValidationError prefix="Subject" field="subject" errors={formState.errors} />
                  </div>

                  <div className="group">
                    <textarea
                      name="message"
                      placeholder="Votre message *"
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

                  {/* Cloudflare Turnstile */}
                  <div className="flex justify-center">
                    <Turnstile
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                      onSuccess={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken(null)}
                      onError={() => setTurnstileToken(null)}
                      theme={isDarkMode ? 'dark' : 'light'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState.submitting || !turnstileToken}
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
                          ENVOI EN COURS...
                        </span>
                      ) : 'ENVOYER LE MESSAGE'}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Informations de contact */}
            <div className="flex flex-col justify-center space-y-8 md:space-y-10">
              <motion.div
                initial={isMobile ? {} : { opacity: 0, x: 20 }}
                whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={isMobile ? {} : { delay: 0.1 }}
                className="group"
              >
                <p className="text-xs md:text-sm text-gray-500 mb-3 tracking-widest">EMAIL</p>
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
                initial={isMobile ? {} : { opacity: 0, x: 20 }}
                whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={isMobile ? {} : { delay: 0.3 }}
              >
                <p className="text-xs md:text-sm text-gray-500 mb-6 tracking-widest">RÉSEAUX</p>
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
                    href="https://dribbble.com/RafaelPiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/link text-lg md:text-2xl font-light transition-all duration-300 inline-block relative ${
                      isDarkMode ? 'hover:text-beige' : 'hover:text-black'
                    }`}
                  >
                    <span className="relative inline-flex items-center gap-2">
                      Dribbble
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
      {!isPresentationMode && (
      <footer className={`border-t py-16 md:py-24 px-4 md:px-16 ${
        isDarkMode ? 'border-beige/20' : 'border-black/20'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={effectsEnabled}>RAFAEL PIRAL</ShuffleText>
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed opacity-70">
                <ShuffleText enabled={effectsEnabled}>
                  Étudiant en 2e année de BUT MMI, passionné par le design graphique et le développement web.
                </ShuffleText>
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={effectsEnabled}>NAVIGATION</ShuffleText>
              </h3>
              <nav className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('about')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <ShuffleText enabled={effectsEnabled}>À propos</ShuffleText>
                </button>
                <button onClick={() => scrollToSection('projects')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <ShuffleText enabled={effectsEnabled}>Projets</ShuffleText>
                </button>
                <button onClick={() => scrollToSection('skills')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <ShuffleText enabled={effectsEnabled}>Compétences</ShuffleText>
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity text-left">
                  <ShuffleText enabled={effectsEnabled}>Contact</ShuffleText>
                </button>
              </nav>
            </div>

            {/* Column 3 - Contact & Social */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={effectsEnabled}>CONTACT</ShuffleText>
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:rafa2002@hotmail.fr"
                  className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                >
                  <ShuffleText enabled={effectsEnabled}>rafa2002@hotmail.fr</ShuffleText>
                </a>
                <div className="pt-4 space-y-2">
                  <a
                    href="https://www.linkedin.com/in/rafaelpiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={effectsEnabled}>LinkedIn →</ShuffleText>
                  </a>
                  <a
                    href="https://github.com/rafaelpir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={effectsEnabled}>GitHub →</ShuffleText>
                  </a>
                  <a
                    href="https://dribbble.com/RafaelPiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={effectsEnabled}>Dribbble →</ShuffleText>
                  </a>
                  <a
                    href="https://www.behance.net/rafaelpiral1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={effectsEnabled}>Behance →</ShuffleText>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm opacity-50 ${
            isDarkMode ? 'border-beige/10' : 'border-black/10'
          }`}>
            <p>
              <ShuffleText enabled={effectsEnabled}>
                © {new Date().getFullYear()} Rafael Piral. Tous droits réservés.
              </ShuffleText>
              {' · '}
              <Link to="/legal" className="hover:opacity-70 transition-opacity underline">
                <ShuffleText enabled={effectsEnabled}>Mentions légales</ShuffleText>
              </Link>
            </p>
            <p>
              <ShuffleText enabled={effectsEnabled}>
                Conçu et développé avec passion
              </ShuffleText>
            </p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );

  // Return conditionnel : Lenis sur desktop, scroll natif sur mobile
  if (isMobile) {
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