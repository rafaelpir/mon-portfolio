import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectDoubleDetail from './ProjectDoubleDetail';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['projects', 'common']);
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  // Projets précédent et suivant (en excluant les projets cachés)
  const visibleProjects = projects.filter(p => !p.hidden);
  const currentVisibleIndex = visibleProjects.findIndex(p => p.id.toString() === id);
  const previousProject = visibleProjects[currentVisibleIndex - 1];
  const nextProject = visibleProjects[currentVisibleIndex + 1];

  // Get translated project data
  const getProjectData = (proj) => {
    const translatedProject = t(`projects:items.${proj.id}`, { returnObjects: true });
    return {
      ...proj,
      title: translatedProject?.title || proj.title,
      description: translatedProject?.description || proj.description,
      category: translatedProject?.category || proj.category,
      type: translatedProject?.type || proj.type,
      context: translatedProject?.context || proj.context,
      period: translatedProject?.period || proj.period,
      duration: translatedProject?.duration || proj.duration,
      competences: translatedProject?.competences || proj.competences,
      galleryDescriptions: translatedProject?.gallery || []
    };
  };

  // Layout double : déléguer au composant dédié
  if (project?.layout === 'double') {
    return <ProjectDoubleDetail project={project} />;
  }

  const translatedProject = project ? getProjectData(project) : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">{t('projects:details.notFound')}</h1>
          <Link
            to="/"
            className="text-beige hover:underline"
          >
            {t('projects:details.backToHome')}
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
              <span className="text-sm tracking-wider">{t('projects:details.back')}</span>
            </button>

            <span className="text-sm tracking-widest font-light">
              Rafael Piral
            </span>

            <div className="text-sm tracking-wider opacity-50">
              {currentVisibleIndex + 1} / {visibleProjects.length}
            </div>
          </div>
        </header>

        {/* Fil d'Ariane */}
        <nav className="fixed top-20 left-0 right-0 z-40 px-8 py-3" aria-label="Breadcrumb">
          <div className="max-w-7xl mx-auto">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className={`transition-colors ${
                    isDarkMode ? 'text-beige/50 hover:text-beige' : 'text-black/50 hover:text-black'
                  }`}
                >
                  {t('projects:details.breadcrumb.home')}
                </Link>
              </li>
              <li className="opacity-30">/</li>
              <li>
                <Link
                  to="/#projects"
                  className={`transition-colors ${
                    isDarkMode ? 'text-beige/50 hover:text-beige' : 'text-black/50 hover:text-black'
                  }`}
                >
                  {t('projects:details.breadcrumb.projects')}
                </Link>
              </li>
              <li className="opacity-30">/</li>
              <li className={`truncate max-w-[200px] ${isDarkMode ? 'text-beige' : 'text-black'}`}>
                {translatedProject.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-40 pb-20 px-4 md:px-16"
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
                <span className="px-3 py-1 border rounded-full">{translatedProject.category}</span>
                <span>{project.year}</span>
                {project.tags && project.tags.map((tag, i) => (
                  <span key={i} className="opacity-50">#{tag}</span>
                ))}
              </div>

              <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                {translatedProject.title}
              </h1>

              <p className="text-xl md:text-2xl font-light opacity-70 max-w-3xl">
                {translatedProject.description}
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
                <div
                  className="relative rounded-lg overflow-hidden bg-black/5 max-h-[600px] flex items-center justify-center"
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-contain max-h-[600px]"
                    loading="lazy"
                  />
                </div>
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
                  {t('projects:details.portraitArticle')}
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
                    <span className="text-sm tracking-wider">{t('common:buttons.openFullscreen')}</span>
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
                    <span className="text-sm tracking-wider">{t('common:buttons.download')}</span>
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
                  {t('projects:details.mockups')}
                </h2>

                {/* Image avec boutons de navigation */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  {/* Bouton précédent - masqué sur mobile */}
                  <button
                    onClick={handlePrevImage}
                    className={`hidden md:block p-3 rounded-full border transition-colors flex-shrink-0 ${
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
                  <div
                    className="relative rounded-lg overflow-hidden bg-black/5 flex-shrink-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
                    style={{ width: '500px', height: '450px' }}
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0].clientX;
                    }}
                    onTouchMove={(e) => {
                      touchEndX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={() => {
                      const diff = touchStartX.current - touchEndX.current;
                      const minSwipeDistance = 50;
                      if (Math.abs(diff) > minSwipeDistance) {
                        if (diff > 0) {
                          handleNextImage();
                        } else {
                          handlePrevImage();
                        }
                      }
                      touchStartX.current = 0;
                      touchEndX.current = 0;
                    }}
                  >
                    <img
                      src={project.gallery[currentImageIndex].src}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain select-none pointer-events-none"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Bouton suivant - masqué sur mobile */}
                  <button
                    onClick={handleNextImage}
                    className={`hidden md:block p-3 rounded-full border transition-colors flex-shrink-0 ${
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

                {/* Compteur et indication swipe mobile */}
                <div className="text-center mb-4">
                  <span className="text-sm opacity-50">
                    {currentImageIndex + 1} / {project.gallery.length}
                  </span>
                  <p className="text-xs opacity-30 mt-1 md:hidden">
                    {t('projects:details.swipeToNavigate')}
                  </p>
                </div>

                {/* Description de l'image */}
                {(translatedProject.galleryDescriptions[currentImageIndex] || project.gallery[currentImageIndex].description) && (
                  <p className="text-center text-base opacity-70 max-w-3xl mx-auto">
                    {translatedProject.galleryDescriptions[currentImageIndex] || project.gallery[currentImageIndex].description}
                  </p>
                )}
              </motion.div>
            )}

            {/* Vidéo (si présente) */}
            {(project.youtubeId || project.video) && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-light mb-6 opacity-70">
                  {t('projects:details.videoPresentation')}
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
                transition={{ delay: 0.7 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-light mb-6 opacity-70">
                  {t('projects:details.interactivePrototype')}
                </h2>
                <div className="relative rounded-lg overflow-hidden bg-black/5" style={{ height: '600px' }}>
                  <iframe
                    src={project.figmaEmbed}
                    title={`${translatedProject.title} - Prototype Figma`}
                    allowFullScreen
                    className="w-full border-0"
                    style={{
                      height: 'calc(100% + 50px)',
                      marginTop: '-50px'
                    }}
                  />
                </div>
                <p className="text-center mt-4 text-sm opacity-50">
                  {t('projects:details.prototypeHint')}
                </p>
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
                {t('projects:details.projectDetails')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Informations */}
                <div>
                  <h3 className="text-xl font-light mb-4 opacity-70">{t('projects:details.info')}</h3>
                  <ul className="space-y-3 text-sm">
                    {project.role && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.role')}</span>
                        <span>{project.role}</span>
                      </li>
                    )}
                    {translatedProject.context && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.context')}</span>
                        <span>{translatedProject.context}</span>
                      </li>
                    )}
                    {translatedProject.period && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.period')}</span>
                        <span>{translatedProject.period}</span>
                      </li>
                    )}
                    {translatedProject.duration && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.duration')}</span>
                        <span>{translatedProject.duration}</span>
                      </li>
                    )}
                    <li className="flex flex-col gap-1">
                      <span className="opacity-50 text-xs tracking-wider">{t('projects:details.type')}</span>
                      <span>{translatedProject.type || translatedProject.category}</span>
                    </li>
                    {project.team && (
                      <li className="flex flex-col gap-1">
                        <span className="opacity-50 text-xs tracking-wider">{t('projects:details.format')}</span>
                        <span>
                          {t('projects:details.teamWith')}{' '}
                          <a
                            href={project.team.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline transition-colors ${
                              isDarkMode ? 'hover:text-beige/70' : 'hover:text-black/70'
                            }`}
                          >
                            {project.team.name}
                          </a>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Outils utilisés */}
                <div>
                  <h3 className="text-xl font-light mb-4 opacity-70">{t('projects:details.tools')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(project.outils || project.tags || []).map((outil, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 border rounded-full text-sm ${
                          isDarkMode ? 'border-beige/20' : 'border-black/20'
                        }`}
                      >
                        {outil}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compétences */}
                {translatedProject.competences && translatedProject.competences.length > 0 && (
                  <div>
                    <h3 className="text-xl font-light mb-4 opacity-70">{t('projects:details.skills')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {translatedProject.competences.map((comp, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 text-sm rounded-full ${
                            isDarkMode ? 'bg-beige/10' : 'bg-black/10'
                          }`}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lien externe */}
              {project.externalUrl && (
                <div className="mt-8">
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-colors ${
                      isDarkMode
                        ? 'border-beige hover:bg-beige hover:text-black'
                        : 'border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm tracking-wider">{t('common:buttons.viewSite')}</span>
                  </a>
                </div>
              )}
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
              <h3 className="text-sm tracking-wider opacity-50 mb-8">{t('projects:details.otherProjects')}</h3>

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
                        <div className="text-xs opacity-70 mb-2">← {t('projects:details.previous')}</div>
                        <div className="text-xl font-light">{t(`projects:items.${previousProject.id}.title`, previousProject.title)}</div>
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
                        <div className="text-xs opacity-70 mb-2">{t('projects:details.next')} →</div>
                        <div className="text-xl font-light">{t(`projects:items.${nextProject.id}.title`, nextProject.title)}</div>
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
