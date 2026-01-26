import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LiquidMetal } from '@paper-design/shaders-react';

export default function About() {
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
        <title>À Propos - Rafael Piral | Creative Developer</title>
        <meta name="description" content="Découvrez mon parcours, mes passions et ma vision du design et du développement web." />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
            <LiquidMetal
              style={{ width: '100%', height: '100%' }}
              image="/images/logos/RP.png"
              colorBack={isDarkMode ? "#00000000" : "#00000000"}
              repetition={6}
              softness={0.8}
              shiftRed={1}
              shiftBlue={-1}
              distortion={0.4}
              contour={0.4}
              angle={0}
              speed={1}
              scale={0.7}
              fit="contain"
            />
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
            À Propos
          </h1>

          <p className={`text-lg md:text-2xl font-light leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Créatif passionné par le design graphique et l'audiovisuel, j'aime donner vie aux idées à travers l'image
          </p>
        </div>
      </section>

      {/* Mon Parcours */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              De l'informatique à la création numérique
            </h2>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Étudiant en 2e année de BUT Métiers du Multimédia et de l'Internet,
                je suis un créatif dans l'âme, toujours en quête de nouvelles façons
                d'exprimer des idées à travers le design et l'image.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Actuellement à la recherche d'un stage d'au moins 8 semaines à partir
                d'avril 2026, je souhaite mettre mes compétences au service de projets
                créatifs dans le domaine de l'audiovisuel et du design graphique.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Tout a commencé avec Photoshop. Cette première rencontre avec l'outil
                a été une révélation : j'ai découvert qu'on pouvait créer des univers,
                raconter des histoires, et transmettre des émotions uniquement par l'image.
                Depuis, je ne cesse d'explorer les possibilités infinies du design graphique
               et de l'identité visuelle.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Illustrator et Figma ont compléter naturellement ce parcours,
                comme un moyen supplémentaire de donner vie à mes créations et de les
                rendre interactives. Mais c'est avant tout l'aspect visuel et créatif
                qui guide mon travail.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              Ce qui m'attire
            </h2>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Je me verrais particulièrement évoluer dans deux univers qui me
                passionnent : le graphisme et l'audiovisuel.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                En tant que graphiste, j'aimerais travailler sur des projets
                d'identité visuelle, de création d'affiches, de supports print
                ou digitaux. Concevoir des visuels qui marquent les esprits et
                racontent une histoire est ce qui me motive au quotidien.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Le monde de l'audiovisuel m'attire également énormément. Travailler
                sur des plateaux de tournage, que ce soit en tant qu'assistant
                réalisateur, perchman, aide sur le plateau ou dans l'équipe technique,
                serait une expérience enrichissante qui me permettrait de découvrir
                les coulisses de la création audiovisuelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences & Outils */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-light mb-16 text-center">
            Compétences & Outils
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Design Graphique */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                Design Graphique
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Photoshop</li>
                <li>• Illustrator</li>
                <li>• InDesign</li>
                <li>• Lightroom</li>
                <li>• Affinity</li>
                <li>• Canva</li>
                <li>• Figma</li>
              </ul>
            </div>

            {/* Audiovisuel */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                Audiovisuel
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Da Vinci Resolve</li>
                <li>• Premiere Pro (bases)</li>
                <li>• After Effects</li>
                <li>• Blender (bases)</li>
              </ul>
            </div>

            {/* Développement Web */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                Développement Web
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• HTML / CSS</li>
                <li>• JavaScript</li>
                <li>• React</li>
                <li>• WordPress</li>
                <li>• PHP</li>
                <li>• Tailwind CSS</li>
                <li>• Git / GitHub</li>
              </ul>
            </div>

            {/* Soft Skills */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                Soft Skills
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Sérieux</li>
                <li>• Autonomie</li>
                <li>• Esprit d'équipe</li>
                <li>• Adaptabilité</li>
                <li>• Créativité</li>
                <li>• Attention aux détails</li>
                <li>• Gestion de projet</li>
              </ul>
            </div>
          </div>

          {/* Autres compétences */}
          <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                Bureautique
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Suite Microsoft Office</li>
              </ul>
            </div>

            <div className={`p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-xl font-light mb-6">
                Communication
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Réseaux sociaux</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Passions & Intérêts */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-light mb-12">
            Mes Inspirations
          </h2>

          <div className="space-y-8 text-base md:text-lg font-light leading-relaxed">
            <div>
              <h3 className="text-2xl mb-4">
                Design & Inspiration
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Je passe beaucoup de temps à explorer les tendances visuelles, à étudier
                les travaux de designers et directeurs artistiques. Que ce soit
                une affiche de film, un générique, une campagne publicitaire ou un clip musical,
                chaque création marquante nourrit mon regard et enrichit mon approche créative.
              </p>
            </div>

      

            <div>
              <h3 className="text-2xl mb-4">
                Apprentissage Continu
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Le design et l'audiovisuel évoluent constamment, et j'adore ça.
                Je suis toujours en recherche de nouvelles connaissances et de nouvelles technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-light mb-8">
            Travaillons Ensemble
          </h2>
          <p className={`text-lg md:text-xl font-light mb-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Un projet en tête ? Discutons-en.
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
            © {new Date().getFullYear()} Rafael Piral. Tous droits réservés.
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
