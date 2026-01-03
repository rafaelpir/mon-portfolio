import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ShuffleText from '../ShuffleText';

export default function About() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [textEffectsEnabled, setTextEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('textEffects');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem('selectedFont') || 'Satoshi';
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <title>À Propos - Rafael Piral | Creative Developer</title>
        <meta name="description" content="Découvrez mon parcours, mes passions et ma vision du design et du développement web." />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className={`text-xl font-bold tracking-wider transition-colors ${
            isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'
          }`}>
            RP
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm tracking-widest transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-beige' : 'text-gray-700 hover:text-black'
              }`}
            >
              RETOUR
            </Link>

            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors ${
                isDarkMode ? 'bg-beige' : 'bg-black'
              }`}
            >
              <div className={`w-5 h-5 rounded-full transition-transform ${
                isDarkMode ? 'bg-black translate-x-6' : 'bg-white translate-x-1'
              }`} />
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
          <h1
            className="text-[12vw] md:text-[8vw] font-light leading-none tracking-tight mb-8"
          >
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
              À Propos
            </ShuffleText>
          </h1>

          <p
            className={`text-lg md:text-2xl font-light leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
              Designer graphique et développeur web passionné par la création d'expériences numériques uniques
            </ShuffleText>
          </p>
        </div>
      </section>

      {/* Mon Parcours */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                Mon Parcours
              </ShuffleText>
            </h2>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Étudiant en 2e année de BUT Métiers du Multimédia et de l'Internet,
                parcours Création Numérique, je me spécialise dans le design graphique,
                l'audiovisuel et le développement web front-end.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Je suis actuellement à la recherche d'un stage d'au moins 8 semaines à partir
                d'avril 2026 dans le domaine de la création numérique et de l'audiovisuel.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Ma passion pour le design a commencé avec la découverte d'Adobe Photoshop,
                qui m'a ouvert les portes de la création visuelle. Depuis, j'ai développé
                mes compétences en identité visuelle, UI/UX design et motion design.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Parallèlement, j'ai appris le développement web pour donner vie à mes créations.
                Cette combinaison de compétences me permet de créer des expériences complètes,
                de la conception à la réalisation.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                Ma Vision
              </ShuffleText>
            </h2>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Je crois que le design doit être à la fois esthétique et fonctionnel.
                Chaque projet est une opportunité de créer quelque chose d'unique qui
                raconte une histoire et engage l'utilisateur.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Mon approche combine minimalisme et créativité, avec une attention
                particulière portée aux détails, à la typographie et aux animations subtiles
                qui enrichissent l'expérience utilisateur.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Je suis constamment à la recherche de nouvelles techniques et tendances
                pour faire évoluer mes créations et repousser les limites du design web.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences & Outils */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-light mb-16 text-center">
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
              Compétences & Outils
            </ShuffleText>
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Design */}
            <div className={`p-8 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-light mb-6">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Design
                </ShuffleText>
              </h3>
              <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Adobe Photoshop</li>
                <li>• Adobe Illustrator</li>
                <li>• Adobe InDesign</li>
                <li>• Figma</li>
                <li>• After Effects</li>
                <li>• Premiere Pro</li>
              </ul>
            </div>

            {/* Développement */}
            <div className={`p-8 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-light mb-6">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Développement
                </ShuffleText>
              </h3>
              <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• HTML / CSS / JavaScript</li>
                <li>• React.js</li>
                <li>• Tailwind CSS</li>
                <li>• GSAP / Framer Motion</li>
                <li>• Git / GitHub</li>
                <li>• WordPress</li>
              </ul>
            </div>

            {/* Soft Skills */}
            <div className={`p-8 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-light mb-6">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Soft Skills
                </ShuffleText>
              </h3>
              <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Créativité</li>
                <li>• Attention aux détails</li>
                <li>• Gestion de projet</li>
                <li>• Travail d'équipe</li>
                <li>• Autonomie</li>
                <li>• Curiosité</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Passions & Intérêts */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-light mb-12">
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
              Au-delà du Code
            </ShuffleText>
          </h2>

          <div className="space-y-8 text-base md:text-lg font-light leading-relaxed">
            <div>
              <h3 className="text-2xl mb-4">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Design & Inspiration
                </ShuffleText>
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Je passe beaucoup de temps à explorer les tendances du design, à étudier
                les portfolios de designers que j'admire, et à décortiquer les sites web
                qui me marquent. Cette veille créative nourrit constamment mes projets.
              </p>
            </div>

            <div>
              <h3 className="text-2xl mb-4">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Photographie
                </ShuffleText>
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                La photographie m'a appris à voir la composition, la lumière et les détails.
                Ces compétences se retrouvent naturellement dans mon approche du design visuel.
              </p>
            </div>

            <div>
              <h3 className="text-2xl mb-4">
                <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
                  Apprentissage Continu
                </ShuffleText>
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Le web évolue constamment, et j'adore ça. Je consacre du temps chaque semaine
                à apprendre de nouvelles technologies, techniques d'animation, ou principes de design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-light mb-8">
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
              Travaillons Ensemble
            </ShuffleText>
          </h2>
          <p className={`text-lg md:text-xl font-light mb-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <ShuffleText enabled={textEffectsEnabled} fontFamily={selectedFont}>
              Un projet en tête ? Discutons-en autour d'un café (virtuel ou réel)
            </ShuffleText>
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
              ENVOYER UN EMAIL
            </a>

            <Link
              to="/"
              className={`px-8 py-4 border-2 text-sm tracking-widest transition-all ${
                isDarkMode
                  ? 'border-gray-600 text-gray-400 hover:border-beige hover:text-beige'
                  : 'border-gray-400 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              VOIR MES PROJETS
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} px-4 md:px-8 py-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © 2024 Rafael Piral. Tous droits réservés.
          </p>

          <div className="flex gap-6">
            <a
              href="https://github.com/rafaelpiral"
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
              href="https://instagram.com/rafaelpiral"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-beige' : 'text-gray-600 hover:text-black'
              }`}
            >
              Instagram
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
