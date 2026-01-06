import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ShuffleText from '../ShuffleText';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { useState } from 'react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Trouver le projet actuel
  const currentIndex = projects.findIndex(p => p.id.toString() === id);
  const project = projects[currentIndex];

  // Fonctions pour le carousel
  const handleNextImage = () => {
    if (project.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
    }
  };

  const handlePrevImage = () => {
    if (project.gallery) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.gallery.length - 1 : prev - 1
      );
    }
  };

  // Projets précédent et suivant
  const previousProject = projects[currentIndex - 1];
  const nextProject = projects[currentIndex + 1];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Projet non trouvé</h1>
          <Link
            to="/"
            className="text-beige hover:underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <div className={`min-h-screen font-stamp ${
        isDarkMode ? 'bg-black text-beige' : 'bg-beige text-black'
      }`}>
        {/* Header avec bouton retour */}
        <header className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 border-b transition-colors ${
          isDarkMode ? 'bg-black/80 border-beige/10 backdrop-blur-md' : 'bg-beige/80 border-black/10 backdrop-blur-md'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 transition-colors ${
                isDarkMode ? 'text-beige hover:text-beige/70' : 'text-black hover:text-black/70'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm tracking-wider">RETOUR</span>
            </button>

            <div className="text-sm tracking-wider opacity-50">
              {currentIndex + 1} / {projects.length}
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-32 pb-20 px-4 md:px-16"
        >
          <div className="max-w-6xl mx-auto">
            {/* Titre et infos */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm opacity-70">
                <span className="px-3 py-1 border rounded-full">{project.category}</span>
                <span>{project.year}</span>
                {project.tags && project.tags.map((tag, i) => (
                  <span key={i} className="opacity-50">#{tag}</span>
                ))}
              </div>

              <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                <ShuffleText>{project.title}</ShuffleText>
              </h1>

              <p className="text-xl md:text-2xl font-light opacity-70 max-w-3xl">
                {project.description}
              </p>
            </motion.div>

            {/* Image principale du projet (masquée si carousel présent) */}
            {!project.gallery && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <div className="relative rounded-lg overflow-hidden bg-black/5 max-h-[600px] flex items-center justify-center">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-contain max-h-[600px]"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}

            {/* Vidéo (si présente) */}
            {(project.youtubeId || project.video) && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-light mb-6 opacity-70">
                  <ShuffleText>Présentation vidéo</ShuffleText>
                </h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5">
                  {project.youtubeId ? (
                    // YouTube embed
                    <iframe
                      src={`https://www.youtube.com/embed/${project.youtubeId}`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    // Vidéo locale
                    <video
                      src={project.video}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Prototype Figma interactif */}
            {project.figmaEmbed && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-light mb-6 opacity-70">
                  <ShuffleText>Prototype interactif</ShuffleText>
                </h2>
                <div className="relative rounded-lg overflow-hidden bg-black/5" style={{ height: '600px' }}>
                  <iframe
                    src={project.figmaEmbed}
                    title={`${project.title} - Prototype Figma`}
                    allowFullScreen
                    className="w-full border-0"
                    style={{
                      height: 'calc(100% + 50px)',
                      marginTop: '-50px'
                    }}
                  />
                </div>
                <p className="text-center mt-4 text-sm opacity-50">
                  Cliquez et naviguez dans le prototype pour explorer les maquettes interactives
                </p>
              </motion.div>
            )}

            {/* PDF Document */}
            {project.pdfFile && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-light mb-6 opacity-70">
                  <ShuffleText>Article portrait</ShuffleText>
                </h2>
                <div className="relative rounded-lg overflow-hidden bg-black/5" style={{ height: '800px' }}>
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + project.pdfFile)}&embedded=true`}
                    title={`${project.title} - Article Portrait`}
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <a
                    href={project.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-colors ${
                      isDarkMode
                        ? 'border-beige hover:bg-beige hover:text-black'
                        : 'border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm tracking-wider">OUVRIR EN PLEIN ÉCRAN</span>
                  </a>
                  <a
                    href={project.pdfFile}
                    download
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-colors ${
                      isDarkMode
                        ? 'border-beige hover:bg-beige hover:text-black'
                        : 'border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm tracking-wider">TÉLÉCHARGER</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* Carousel d'images */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-light mb-6 opacity-70">
                  <ShuffleText>Maquettes</ShuffleText>
                </h2>

                {/* Image avec boutons de navigation */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  {/* Bouton précédent */}
                  <button
                    onClick={handlePrevImage}
                    className={`p-3 rounded-full border transition-colors flex-shrink-0 ${
                      isDarkMode
                        ? 'border-beige/20 hover:border-beige hover:bg-beige/10'
                        : 'border-black/20 hover:border-black hover:bg-black/10'
                    }`}
                    aria-label="Image précédente"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Image du carousel */}
                  <div className="relative rounded-lg overflow-hidden bg-black/5 flex-shrink-0" style={{ maxWidth: '350px' }}>
                    <img
                      src={project.gallery[currentImageIndex].src}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '300px' }}
                      loading="lazy"
                    />
                  </div>

                  {/* Bouton suivant */}
                  <button
                    onClick={handleNextImage}
                    className={`p-3 rounded-full border transition-colors flex-shrink-0 ${
                      isDarkMode
                        ? 'border-beige/20 hover:border-beige hover:bg-beige/10'
                        : 'border-black/20 hover:border-black hover:bg-black/10'
                    }`}
                    aria-label="Image suivante"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Compteur */}
                <div className="text-center mb-4">
                  <span className="text-sm opacity-50">
                    {currentImageIndex + 1} / {project.gallery.length}
                  </span>
                </div>

                {/* Description de l'image */}
                {project.gallery[currentImageIndex].description && (
                  <p className="text-center text-base opacity-70 max-w-3xl mx-auto">
                    {project.gallery[currentImageIndex].description}
                  </p>
                )}
              </motion.div>
            )}

            {/* Détails du projet */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-light mb-8">
                <ShuffleText>Détails du projet</ShuffleText>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-light mb-4 opacity-70">Technologies utilisées</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags && project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 border rounded-full text-sm ${
                          isDarkMode ? 'border-beige/20' : 'border-black/20'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-light mb-4 opacity-70">Informations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="opacity-70">Catégorie</span>
                      <span>{project.category}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="opacity-70">Année</span>
                      <span>{project.year}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="opacity-70">Type</span>
                      <span>Projet {project.category.toLowerCase()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Navigation vers autres projets */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`border-t pt-12 ${
                isDarkMode ? 'border-beige/20' : 'border-black/20'
              }`}
            >
              <h3 className="text-sm tracking-wider opacity-50 mb-8">AUTRES PROJETS</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Projet précédent */}
                {previousProject && (
                  <Link
                    to={`/project/${previousProject.id}`}
                    className={`group relative overflow-hidden rounded-lg aspect-video ${
                      isDarkMode ? 'bg-beige/5' : 'bg-black/5'
                    }`}
                  >
                    <img
                      src={previousProject.thumbnail}
                      alt={previousProject.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <div>
                        <div className="text-xs opacity-70 mb-2">← PRÉCÉDENT</div>
                        <div className="text-xl font-light">{previousProject.title}</div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Projet suivant */}
                {nextProject && (
                  <Link
                    to={`/project/${nextProject.id}`}
                    className={`group relative overflow-hidden rounded-lg aspect-video ${
                      isDarkMode ? 'bg-beige/5' : 'bg-black/5'
                    }`}
                  >
                    <img
                      src={nextProject.thumbnail}
                      alt={nextProject.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <div className="ml-auto text-right">
                        <div className="text-xs opacity-70 mb-2">SUIVANT →</div>
                        <div className="text-xl font-light">{nextProject.title}</div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ReactLenis>
  );
}
