import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import FlowingMenu from '../FlowingMenu';
import { useForm, ValidationError } from '@formspree/react';
import ShuffleText from '../ShuffleText';
import { ScrollVelocityContainer, ScrollVelocityRow } from '../ScrollVelocity';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { projects, skills } from '../data/projects';
import GlitchText from '../components/GlitchText';
import AvailabilityBadge from '../components/AvailabilityBadge';
import Statistics from '../components/Statistics';
import CVDownloadButton from '../components/CVDownloadButton';
import ProjectFilters from '../components/ProjectFilters';
import Timeline from '../components/Timeline';
import WorkInProgress from '../components/WorkInProgress';
import usePresentationMode from '../hooks/usePresentationMode';

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
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Formspree hook pour le formulaire de contact
  // Remplacez "xjknoepn" par votre vrai ID de formulaire Formspree
  const [formState, handleFormSubmit] = useForm("xjknoepn");

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



  // Extraire les catégories uniques
  const categories = ['Tous', ...new Set(projects.map(p => p.category))];

  // Extraire tous les tags uniques
  const allTags = [...new Set(projects.flatMap(p => p.tags || []))].sort();

  // Filtrer les projets selon la catégorie et les tags
  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === 'Tous' || project.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => (project.tags || []).includes(tag));
    return categoryMatch && tagMatch;
  });

  // Configuration du FlowingMenu avec les projets
  const menuItems = filteredProjects.map((project) => ({
    link: `/project/${project.id}`,
    text: project.title,
    image: project.thumbnail,
    onClick: () => navigate(`/project/${project.id}`)
  }));

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <Helmet>
        {/* Meta Tags Essentiels */}
        <html lang="fr" />
        <title>Rafael Piral - Portfolio | Développeur Créatif & Étudiant MMI</title>
        <meta name="description" content="Portfolio de Rafael Piral, étudiant en 2ème année de BUT MMI spécialisé en création numérique, développement web et audiovisuel. Découvrez mes projets créatifs et mon parcours." />
        <meta name="keywords" content="Rafael Piral, portfolio, développeur web, MMI, création numérique, design graphique, audiovisuel, développement créatif, BUT MMI, étudiant développeur, Paris" />
        <meta name="author" content="Rafael Piral" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rafaelpiral.fr/" />
        <meta property="og:title" content="Rafael Piral - Portfolio | Développeur Créatif & Étudiant MMI" />
        <meta property="og:description" content="Étudiant en BUT MMI passionné par la création numérique et le développement web. Découvrez mes projets et mon parcours." />
        <meta property="og:image" content="https://rafaelpiral.fr/og-image.jpg" />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://rafaelpiral.fr/" />
        <meta name="twitter:title" content="Rafael Piral - Portfolio | Développeur Créatif" />
        <meta name="twitter:description" content="Étudiant en BUT MMI spécialisé en création numérique et développement web." />
        <meta name="twitter:image" content="https://rafaelpiral.fr/twitter-image.jpg" />

        {/* Informations Additionnelles */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://rafaelpiral.fr/" />
      </Helmet>

      <div className={`font-stamp transition-colors duration-300 overflow-x-hidden ${
        isDarkMode
          ? 'bg-black text-beige'
          : 'bg-white text-black'
      }`}>

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
            <Link
              to="/about"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              À PROPOS
            </Link>
            <a
              href="#projects"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              PROJETS
            </a>
            <a
              href="#skills"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              COMPÉTENCES
            </a>
            <a
              href="#contact"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              CONTACT
            </a>

            {/* Bouton CV */}
            <CVDownloadButton
              variant="secondary"
              isDarkMode={isDarkMode}
            />

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
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-8 py-4 text-sm tracking-widest transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                À PROPOS
              </Link>
              <a
                href="#projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-8 py-4 text-sm tracking-widest transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                PROJETS
              </a>
              <a
                href="#skills"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-8 py-4 text-sm tracking-widest transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                COMPÉTENCES
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-8 py-4 text-sm tracking-widest transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                CONTACT
              </a>
            </nav>
          </div>
        )}
      </header>
      )}

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* Vidéo de fond */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isDarkMode ? 0.15 : 0.1,
            filter: isDarkMode ? 'none' : 'invert(1)',
            transform: 'scale(1.1)'
          }}
        >
          <source src="/videos/output_leger.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay animé */}
        <div className="absolute inset-0" style={{
          background: isDarkMode
            ? 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />

        {/* Contenu principal avec animations améliorées */}
        <div
          className="text-center relative z-10 animate-fade-in-up"
          style={{
            opacity: 1 - scrollY / 500
          }}
        >
          <div className="animate-slide-down" style={{ animationDelay: '0.2s' }}>
            <h1 className={`text-[18vw] md:text-[15vw] font-light leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <ShuffleText enabled={textEffectsEnabled}>Rafael</ShuffleText>
            </h1>
            <h1 className={`text-[18vw] md:text-[15vw] font-light leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <ShuffleText enabled={textEffectsEnabled}>Piral</ShuffleText>
            </h1>
          </div>

          <p className={`text-sm md:text-2xl font-light tracking-widest px-4 mt-4 md:mt-8 animate-fade-in ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            style={{
              animationDelay: '0.4s'
            }}>
            <ShuffleText enabled={textEffectsEnabled}>ÉTUDIANT EN 2E ANNEE DE BUT MMI • CRÉATIONS NUMÉRIQUES</ShuffleText>
          </p>

          {/* Badge de disponibilité */}
          <div className="mt-6 md:mt-8 animate-fade-in flex justify-center" style={{ animationDelay: '0.5s' }}>
            <AvailabilityBadge
              status="En recherche de stage"
              availableDate="Avril 2026"
              alternance="Alternance pour septembre 2026"
              isDarkMode={isDarkMode}
              textEffectsEnabled={textEffectsEnabled}
            />
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-xs md:text-sm tracking-widest animate-bounce flex items-center justify-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} style={{ zIndex: 20, whiteSpace: 'nowrap' }}>
          <ShuffleText enabled={textEffectsEnabled}>DÉFILER</ShuffleText>
        </div>
      </section>

      {/* Introduction / About */}
      <motion.section
        id="about"
        className="min-h-screen flex items-center px-4 md:px-16 py-16 md:py-32"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6 md:space-y-8 text-lg md:text-3xl font-light leading-relaxed mb-8 md:mb-12">
            <p>
              <ShuffleText enabled={textEffectsEnabled}>Bonjour, je m'appelle Rafael Piral.</ShuffleText>
            </p>
            <p className="text-gray-400">
              <ShuffleText enabled={textEffectsEnabled}>Je suis étudiant en 2ème année de BUT MMI. Pour faire simple : le monde de l'audiovisuel m'intéresse vraiment et j'ai envie d'apprendre.</ShuffleText>
            </p>
            <p className="text-gray-400">
              <ShuffleText enabled={textEffectsEnabled}>Je ne cherche pas seulement à valider mon diplôme, je cherche surtout à découvrir ce métier de l'intérieur. Je suis à la recherche d'un stage (dès le [Mois]) pour observer, écouter et participer à vos projets.</ShuffleText>
            </p>
            <p className="text-gray-400">
              <ShuffleText enabled={textEffectsEnabled}>Si vous acceptez de partager votre savoir-faire avec quelqu'un de curieux, je serais ravi de vous rencontrer.</ShuffleText>
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
      </motion.section>

      {/* Projects Section - FlowingMenu */}
      <motion.section
        id="projects"
        className="py-16 md:py-32 px-4 md:px-16"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-xs md:text-sm tracking-widest mb-8 md:mb-16 text-gray-500 text-center">
          <ShuffleText enabled={textEffectsEnabled}>PROJETS SÉLECTIONNÉS</ShuffleText>
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
          <div className="h-[300px] md:h-[600px] rounded-lg overflow-hidden">
            <FlowingMenu items={menuItems} isDarkMode={isDarkMode} />
          </div>
        </div>
      </motion.section>

      {/* Work In Progress Section */}
      <WorkInProgress
        isDarkMode={isDarkMode}
        textEffectsEnabled={textEffectsEnabled}
        scrollY={scrollY}
      />

      {/* Skills Section */}
      <motion.section
        id="skills"
        className={`py-16 md:py-32 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-beige-light text-black'
            : 'bg-black text-beige'
        }`}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-12 text-center">
          <h2 className="text-xs md:text-sm tracking-widest text-gray-500">
            <ShuffleText enabled={textEffectsEnabled}>COMPÉTENCES</ShuffleText>
          </h2>
        </div>

        <div className="relative w-full overflow-hidden">
          <ScrollVelocityContainer>
            <ScrollVelocityRow baseVelocity={2} direction={1} className="py-4">
              {skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="mx-4 text-2xl md:text-4xl font-light">
                  {skill}
                </span>
              ))}
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={2} direction={-1} className="py-4">
              {skills.slice(4, 8).map((skill, idx) => (
                <span key={idx} className="mx-4 text-2xl md:text-4xl font-light">
                  {skill}
                </span>
              ))}
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={2} direction={1} className="py-4">
              {skills.slice(8).map((skill, idx) => (
                <span key={idx} className="mx-4 text-2xl md:text-4xl font-light">
                  {skill}
                </span>
              ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>

          {/* Gradients pour effet de fade sur les côtés */}
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r ${
            isDarkMode ? 'from-beige-light' : 'from-black'
          }`}></div>
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l ${
            isDarkMode ? 'from-beige-light' : 'from-black'
          }`}></div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <Statistics
        stats={[
          { value: projects.length, label: "PROJETS RÉALISÉS", suffix: "+" }
        ]}
        isDarkMode={isDarkMode}
        textEffectsEnabled={textEffectsEnabled}
        scrollY={scrollY}
      />

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
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-7xl lg:text-9xl font-light mb-8 md:mb-20 leading-none text-center">
            <ShuffleText enabled={textEffectsEnabled}>TRAVAILLONS</ShuffleText>
            <br />
            <ShuffleText enabled={textEffectsEnabled}>ENSEMBLE</ShuffleText>
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
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
                    <ShuffleText enabled={textEffectsEnabled}>
                      Merci pour votre message !
                    </ShuffleText>
                  </p>
                  <p className="text-base md:text-xl text-gray-500">
                    Je vous répondrai dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
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
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
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
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <p className="text-xs md:text-sm text-gray-500 mb-3 tracking-widest">TÉLÉPHONE</p>
                <a
                  href="tel:+33600000000"
                  className={`text-lg md:text-2xl font-light transition-all duration-300 inline-block relative ${
                    isDarkMode ? 'hover:text-beige' : 'hover:text-black'
                  }`}
                >
                  <span className="relative">
                    +33 6 XX XX XX XX
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isDarkMode ? 'bg-beige' : 'bg-black'
                    }`}></span>
                  </span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs md:text-sm text-gray-500 mb-3 tracking-widest">RÉSEAUX</p>
                <div className="space-y-3">
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
                <ShuffleText enabled={textEffectsEnabled}>RAFAEL PIRAL</ShuffleText>
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed opacity-70">
                <ShuffleText enabled={textEffectsEnabled}>
                  Étudiant en 2e année de BUT MMI, passionné par le design graphique et le développement web.
                </ShuffleText>
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={textEffectsEnabled}>NAVIGATION</ShuffleText>
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/about" className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled}>À propos</ShuffleText>
                </Link>
                <a href="#projects" className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled}>Projets</ShuffleText>
                </a>
                <a href="#skills" className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled}>Compétences</ShuffleText>
                </a>
                <a href="#contact" className="text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled}>Contact</ShuffleText>
                </a>
              </nav>
            </div>

            {/* Column 3 - Contact & Social */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={textEffectsEnabled}>CONTACT</ShuffleText>
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:rafa2002@hotmail.fr"
                  className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                >
                  <ShuffleText enabled={textEffectsEnabled}>rafa2002@hotmail.fr</ShuffleText>
                </a>
                <a
                  href="tel:+33600000000"
                  className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                >
                  <ShuffleText enabled={textEffectsEnabled}>+33 6 XX XX XX XX</ShuffleText>
                </a>
                <div className="pt-4 space-y-2">
                  <a
                    href="https://www.linkedin.com/in/rafaelpiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={textEffectsEnabled}>LinkedIn →</ShuffleText>
                  </a>
                  <a
                    href="https://github.com/rafaelpir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={textEffectsEnabled}>GitHub →</ShuffleText>
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
              <ShuffleText enabled={textEffectsEnabled}>
                © {new Date().getFullYear()} Rafael Piral. Tous droits réservés.
              </ShuffleText>
            </p>
            <p>
              <ShuffleText enabled={textEffectsEnabled}>
                Conçu et développé avec passion
              </ShuffleText>
            </p>
          </div>
        </div>
      </footer>
      )}
    </div>
    </ReactLenis>
  );
}