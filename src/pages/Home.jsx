import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowingMenu from '../FlowingMenu';
import { useForm, ValidationError } from '@formspree/react';
import ShuffleText from '../ShuffleText';
import { ScrollVelocityContainer, ScrollVelocityRow } from '../ScrollVelocity';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { projects, skills } from '../data/projects';

export default function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('Tous');
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
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem('selectedFont') || 'StampRSPKOne';
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

  // Sauvegarder les préférences d'effets de texte et police
  useEffect(() => {
    localStorage.setItem('textEffects', JSON.stringify(textEffectsEnabled));
  }, [textEffectsEnabled]);

  useEffect(() => {
    localStorage.setItem('selectedFont', selectedFont);
  }, [selectedFont]);



  // Extraire les catégories uniques
  const categories = ['Tous', ...new Set(projects.map(p => p.category))];

  // Filtrer les projets selon la catégorie
  const filteredProjects = selectedCategory === 'Tous'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

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
      <div className={`font-stamp transition-colors duration-300 ${
        isDarkMode
          ? 'bg-black text-beige'
          : 'bg-beige text-black'
      }`}>

      {/* Curseur personnalisé */}
      <div
        className={`fixed w-4 h-4 border-2 rounded-full pointer-events-none z-50 mix-blend-difference ${
          isDarkMode ? 'border-beige' : 'border-black'
        }`}
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'transform 0.15s ease-out'
        }}
      />

      {/* Header avec navigation */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-8 py-6 border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-black/5 border-beige/10'
          : 'bg-beige/5 border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo R avec rotation 360° */}
          <div className="perspective-1000">
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              <div
                className="text-4xl md:text-6xl font-black animate-spin-3d-full"
                style={{
                  transformStyle: 'preserve-3d',
                  textShadow: '3px 3px 6px rgba(255,123,0,0.4), -3px -3px 6px rgba(0,0,0,0.6)',
                  background: 'linear-gradient(135deg, #ff9933 0%, #ff7b00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'StampRSPKOne, sans-serif'
                }}
              >
                R
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a
              href="#about"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-beige'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              À PROPOS
            </a>
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

                  {/* Police */}
                  <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    POLICE
                  </div>
                  {['StampRSPKOne', 'Arial', 'Helvetica', 'Times New Roman', 'Courier'].map((font) => (
                    <button
                      key={font}
                      onClick={() => setSelectedFont(font)}
                      className={`w-full px-4 py-2 text-left flex items-center justify-between ${
                        isDarkMode ? 'hover:bg-black/5 text-black' : 'hover:bg-beige/10 text-beige'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      <span>{font}</span>
                      {selectedFont === font && <span>✓</span>}
                    </button>
                  ))}
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
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-8 py-4 text-sm tracking-widest transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-beige'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                À PROPOS
              </a>
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


      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden px-4">
        <div
          className="text-center relative z-10"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 1 - scrollY / 500,
            pointerEvents: 'none'
          }}
        >
          <div style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
            <h1 className={`text-[18vw] md:text-[15vw] font-light leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Rafael</ShuffleText>
            </h1>
            <h1 className={`text-[18vw] md:text-[15vw] font-light leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Piral</ShuffleText>
            </h1>
          </div>
          <p className={`text-sm md:text-2xl font-light tracking-widest px-4 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            style={{
              transform: `translateY(${scrollY * 0.1}px)`
            }}>
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>ÉTUDIANT EN 2E ANNEE DE BUT MMI • CRÉATIONS NUMÉRIQUES</ShuffleText>
          </p>
        </div>

        <div className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-xs md:text-sm tracking-widest animate-bounce ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} style={{ zIndex: 20, pointerEvents: 'none' }}>
          <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>DÉFILER</ShuffleText>
        </div>
      </section>

      {/* Introduction */}
      <section id="about" className="min-h-screen flex items-center px-4 md:px-16 py-16 md:py-32">
        <div className="max-w-5xl mx-auto" style={{ transform: `translateY(${(scrollY - 800) * 0.1}px)` }}>
          <p className="text-3xl md:text-5xl lg:text-7xl font-light leading-tight mb-8 md:mb-12">
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Étudiant en 2e année de BUT MMI,</ShuffleText>
            <br />
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>je conçois des expériences</ShuffleText>
            <br />
            <span className="italic"><ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>numériques créatives</ShuffleText></span>
          </p>
          <div className="flex gap-8 text-sm tracking-wider" style={{ transform: `translateY(${(scrollY - 900) * 0.05}px)` }}>
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
      </section>

      {/* Projects Section - FlowingMenu */}
      <section id="projects" className="py-16 md:py-32 px-4 md:px-16">
        <h2 className="text-xs md:text-sm tracking-widest mb-8 md:mb-16 text-gray-500 text-center" style={{ transform: `translateY(${(scrollY - 1200) * 0.08}px)` }}>
          <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>PROJETS SÉLECTIONNÉS</ShuffleText>
        </h2>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative text-sm tracking-wider transition-all duration-300 group ${
                isDarkMode ? 'hover:text-beige' : 'hover:text-black'
              }`}
              style={{
                color: selectedCategory === category
                  ? (isDarkMode ? '#ff7b00' : '#000000')
                  : '#666666'
              }}
            >
              {category}
              {selectedCategory === category && (
                <span className={`absolute -bottom-2 left-0 right-0 h-px transition-all duration-300 ${
                  isDarkMode ? 'bg-beige' : 'bg-black'
                }`} />
              )}
            </button>
          ))}
        </div>

        {/* FlowingMenu avec les projets */}
        <div className="max-w-6xl mx-auto">
          <div className="h-[400px] md:h-[600px] rounded-lg overflow-hidden">
            <FlowingMenu items={menuItems} isDarkMode={isDarkMode} />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-16 md:py-32 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-beige-light text-black'
          : 'bg-black text-beige'
      }`}>
        <div className="mb-12 text-center" style={{ transform: `translateY(${(scrollY - 2000) * 0.08}px)` }}>
          <h2 className="text-xs md:text-sm tracking-widest text-gray-500">
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>COMPÉTENCES</ShuffleText>
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
      </section>

      {/* About Section */}
      <section className="py-32 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm tracking-widest mb-16 text-gray-500" style={{ transform: `translateY(${(scrollY - 2800) * 0.08}px)` }}>
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>À PROPOS</ShuffleText>
          </h2>

          <div className="space-y-8 text-2xl md:text-3xl font-light leading-relaxed" style={{ transform: `translateY(${(scrollY - 2900) * 0.06}px)` }}>
            <p>
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Actuellement en deuxième année de BUT Métiers du Multimédia et de l'Internet, parcours Créations Numériques.</ShuffleText>
            </p>
            <p className="text-gray-400">
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Je développe une approche multidisciplinaire combinant design graphique, développement web et création audiovisuelle pour concevoir des projets créatifs et innovants.</ShuffleText>
            </p>
            <p className="text-gray-400">
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>À la recherche d'un stage pour approfondir mes compétences et contribuer à des projets ambitieux.</ShuffleText>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 md:px-8 py-16 md:py-32">
        <div className="max-w-4xl w-full">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-light mb-8 md:mb-16 leading-none text-center" style={{ transform: `translateY(${(scrollY - 3500) * 0.08}px)` }}>
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>TRAVAILLONS</ShuffleText>
            <br />
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>ENSEMBLE</ShuffleText>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Formulaire de contact */}
            <div>
              {formState.succeeded ? (
                <div className="text-center py-16">
                  <p className="text-2xl md:text-3xl font-light mb-4">
                    <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                      Merci pour votre message !
                    </ShuffleText>
                  </p>
                  <p className="text-base md:text-xl text-gray-500">
                    Je vous répondrai dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom *"
                      className={`w-full bg-transparent border-b py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-colors ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige'
                          : 'border-gray-700 focus:border-black'
                      }`}
                      required
                    />
                    <ValidationError prefix="Name" field="name" errors={formState.errors} />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Votre email *"
                      className={`w-full bg-transparent border-b py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-colors ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige'
                          : 'border-gray-700 focus:border-black'
                      }`}
                      required
                    />
                    <ValidationError prefix="Email" field="email" errors={formState.errors} />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Sujet"
                      className={`w-full bg-transparent border-b py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-colors ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige'
                          : 'border-gray-700 focus:border-black'
                      }`}
                    />
                    <ValidationError prefix="Subject" field="subject" errors={formState.errors} />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      placeholder="Votre message *"
                      rows="4"
                      className={`w-full bg-transparent border-b py-3 md:py-4 text-base md:text-xl font-light focus:outline-none transition-colors resize-none ${
                        isDarkMode
                          ? 'border-gray-800 focus:border-beige'
                          : 'border-gray-700 focus:border-black'
                      }`}
                      required
                    />
                    <ValidationError prefix="Message" field="message" errors={formState.errors} />
                  </div>

                  <button
                    type="submit"
                    disabled={formState.submitting}
                    className={`w-full border py-4 md:py-6 text-base md:text-xl font-light tracking-widest transition-all duration-300 ${
                      formState.submitting
                        ? 'opacity-50 cursor-not-allowed'
                        : isDarkMode
                        ? 'border-beige hover:bg-beige hover:text-black'
                        : 'border-black hover:bg-black hover:text-beige'
                    }`}
                  >
                    {formState.submitting ? 'ENVOI EN COURS...' : 'ENVOYER'}
                  </button>
                </form>
              )}
            </div>

            {/* Informations de contact */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-8">
              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-2 tracking-widest">EMAIL</p>
                <a
                  href="mailto:rafa2002@hotmail.fr"
                  className="text-lg md:text-2xl font-light hover:italic transition-all break-all"
                >
                  rafa2002@hotmail.fr
                </a>
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-2 tracking-widest">TÉLÉPHONE</p>
                <a
                  href="tel:+33600000000"
                  className="text-lg md:text-2xl font-light hover:italic transition-all"
                >
                  +33 6 XX XX XX XX
                </a>
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-2 tracking-widest">RÉSEAUX</p>
                <div className="space-y-2">
                  <a
                    href="www.linkedin.com/in/rafaelpiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-lg md:text-2xl font-light hover:italic transition-all"
                  >
                    LinkedIn →
                  </a>
                  <a
                    href="https://github.com/rafaelpir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-lg md:text-2xl font-light hover:italic transition-all"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-16 md:py-24 px-4 md:px-16 ${
        isDarkMode ? 'border-beige/20' : 'border-black/20'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>RAFAEL PIRAL</ShuffleText>
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed opacity-70">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Étudiant en 2e année de BUT MMI, passionné par le design graphique et le développement web.
                </ShuffleText>
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>NAVIGATION</ShuffleText>
              </h3>
              <nav className="space-y-3">
                <a href="#about" className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>À propos</ShuffleText>
                </a>
                <a href="#projects" className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Projets</ShuffleText>
                </a>
                <a href="#skills" className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Compétences</ShuffleText>
                </a>
                <a href="#contact" className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity">
                  <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>Contact</ShuffleText>
                </a>
              </nav>
            </div>

            {/* Column 3 - Contact & Social */}
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>CONTACT</ShuffleText>
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:rafa2002@hotmail.fr"
                  className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                >
                  <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>rafa2002@hotmail.fr</ShuffleText>
                </a>
                <a
                  href="tel:+33600000000"
                  className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                >
                  <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>+33 6 XX XX XX XX</ShuffleText>
                </a>
                <div className="pt-4 space-y-2">
                  <a
                    href="https://www.linkedin.com/in/rafaelpiral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>LinkedIn →</ShuffleText>
                  </a>
                  <a
                    href="https://github.com/rafaelpir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm md:text-base font-light opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>GitHub →</ShuffleText>
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
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                © {new Date().getFullYear()} Rafael Piral. Tous droits réservés.
              </ShuffleText>
            </p>
            <p>
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                Conçu et développé avec passion
              </ShuffleText>
            </p>
          </div>
        </div>
      </footer>
    </div>
    </ReactLenis>
  );
}