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
          <Link to="/" className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <img
              src="/bullet.png"
              alt="Logo Rafael Piral"
              className="w-full h-full object-contain"
              style={{
                transform: `rotate(${scrollY * 0.5}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
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
              Créatif passionné par le design graphique et l'audiovisuel, j'aime donner vie aux idées à travers l'image
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
                Depuis, je ne cesse d'explorer les possibilités infinies du design graphique,
                du motion design et de l'identité visuelle.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Le développement web est venu compléter naturellement ce parcours,
                comme un moyen supplémentaire de donner vie à mes créations et de les
                rendre interactives. Mais c'est avant tout l'aspect visuel et créatif
                qui guide mon travail.
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
                Pour moi, chaque image raconte une histoire. Que ce soit une affiche,
                une identité visuelle ou une vidéo, je cherche toujours à transmettre
                une émot ion, à créer une atmosphère qui résonne avec le public.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                J'aime jouer avec la composition, les contrastes, la typographie et les
                couleurs pour créer des univers visuels uniques. Mon approche mêle
                minimalisme et audace : chaque élément a sa raison d'être, chaque
                détail compte.
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Le motion design m'attire particulièrement car il permet d'ajouter
                une dimension temporelle à mes créations, de guider le regard et
                d'intensifier l'impact émotionnel d'un message.
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
              Mes Inspirations
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
                Je passe beaucoup de temps à explorer les tendances visuelles, à étudier
                les travaux de designers et directeurs artistiques que j'admire. Que ce soit
                une affiche de film, un générique, une campagne publicitaire ou un clip musical,
                chaque création marquante nourrit mon regard et enrichit mon approche créative.
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
                Le design et l'audiovisuel évoluent constamment, et j'adore ça. Je consacre
                du temps chaque semaine à expérimenter de nouvelles techniques de composition,
                d'animation, de montage, ou à maîtriser de nouveaux outils créatifs.
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
