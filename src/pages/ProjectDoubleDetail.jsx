import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactLenis } from 'lenis/dist/lenis-react';
import { projects } from '../data/projects';

function SubProjectGallery({ subProject, isDarkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const gallery = subProject.gallery || [];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));

  if (gallery.length === 0) return null;

  return (
    <div className="mt-8">
      {/* Image — hauteur fixe */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ maxWidth: expanded ? '100%' : '460px', height: expanded ? 'auto' : '420px' }}
      >
        <img
          src={gallery[currentIndex].src}
          alt={`${subProject.title} - Image ${currentIndex + 1}`}
          className={`rounded-lg transition-all duration-300 ${expanded ? 'w-full object-contain' : 'absolute inset-0 w-full h-full object-contain'}`}
          style={{ cursor: isMobile ? 'default' : (expanded ? 'zoom-out' : 'zoom-in') }}
          draggable={false}
          onClick={isMobile ? undefined : () => setExpanded(!expanded)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
          onTouchEnd={() => {
            const diff = touchStartX.current - touchEndX.current;
            if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
            touchStartX.current = 0;
            touchEndX.current = 0;
          }}
        />
      </div>

      {/* Boutons + compteur — hauteur fixe, jamais déplacés */}
      {gallery.length > 1 && (
        <div className="flex items-center justify-between mt-3" style={{ height: '36px', maxWidth: '460px', margin: '12px auto 0' }}>
          <button
            onClick={handlePrev}
            className={`hidden md:flex items-center justify-center p-2 rounded-full border transition-colors ${
              isDarkMode
                ? 'border-beige/20 hover:border-beige hover:bg-beige/10'
                : 'border-black/20 hover:border-black hover:bg-black/10'
            }`}
            aria-label="Image précédente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs opacity-40">{currentIndex + 1} / {gallery.length}</span>
          <button
            onClick={handleNext}
            className={`hidden md:flex items-center justify-center p-2 rounded-full border transition-colors ${
              isDarkMode
                ? 'border-beige/20 hover:border-beige hover:bg-beige/10'
                : 'border-black/20 hover:border-black hover:bg-black/10'
            }`}
            aria-label="Image suivante"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Description — hauteur fixe pour éviter tout déplacement */}
      <div style={{ height: '4rem', overflow: 'hidden', marginTop: '8px', maxWidth: '460px', margin: '8px auto 0' }}>
        {gallery[currentIndex].description && (
          <p className="text-center text-sm opacity-60">
            {gallery[currentIndex].description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProjectDoubleDetail({ project }) {
  const navigate = useNavigate();
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const isLocalhost = window.location.hostname === 'localhost';
  const visibleProjects = projects.filter(p => !p.hidden || isLocalhost);
  const currentVisibleIndex = visibleProjects.findIndex(p => p.id === project.id);
  const previousProject = visibleProjects[currentVisibleIndex - 1];
  const nextProject = visibleProjects[currentVisibleIndex + 1];

  const subProjects = project.subProjects || [];

  return (
    <>
    <ReactLenis root options={{ lerp: 0.05, duration: 1.2, smoothWheel: true }}>
      <div className={`min-h-screen font-stamp ${isDarkMode ? 'bg-black text-beige' : 'bg-beige text-black'}`}>

        {/* Header */}
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
              <span className="text-sm tracking-wider">Retour</span>
            </button>

            <span className="text-base tracking-widest font-heading">Rafael Piral</span>

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
                <Link to="/" className={`transition-colors ${isDarkMode ? 'text-beige/50 hover:text-beige' : 'text-black/50 hover:text-black'}`}>
                  Accueil
                </Link>
              </li>
              <li className="opacity-30">/</li>
              <li>
                <Link to="/#projects" className={`transition-colors ${isDarkMode ? 'text-beige/50 hover:text-beige' : 'text-black/50 hover:text-black'}`}>
                  Projets
                </Link>
              </li>
              <li className="opacity-30">/</li>
              <li className={`truncate max-w-[200px] ${isDarkMode ? 'text-beige' : 'text-black'}`}>
                {project.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-40 pb-20 px-4 md:px-16"
        >
          <div className="max-w-6xl mx-auto">

            {/* En-tête du projet combiné */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm opacity-70">
                <span className="px-3 py-1 border rounded-full">{project.category}</span>
                <span>{project.year}</span>
                <span className="px-3 py-1 border rounded-full opacity-60">{project.type}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                {project.title}
              </h1>

              <p className="text-lg opacity-50 max-w-2xl mb-8">
                {project.description}
              </p>

              {/* Métadonnées communes */}
              <ul className={`flex flex-wrap gap-6 text-sm border-t pt-8 ${isDarkMode ? 'border-beige/10' : 'border-black/10'}`}>
                {subProjects[0]?.period && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-wider uppercase">Période</span>
                    <span className="opacity-80">{subProjects[0].period}</span>
                  </li>
                )}
                {subProjects[0]?.duration && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-wider uppercase">Durée</span>
                    <span className="opacity-80">{subProjects[0].duration}</span>
                  </li>
                )}
                {project.type && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-wider uppercase">Contexte</span>
                    <span className="opacity-80">{project.type}</span>
                  </li>
                )}
                {project.collaborators && project.collaborators.length > 0 && (
                  <li className="flex flex-col gap-1">
                    <span className="opacity-40 text-xs tracking-wider uppercase">Réalisé avec</span>
                    <span className="opacity-80 flex flex-col gap-1">
                      {project.collaborators.map((c, i) => (
                        <a
                          key={i}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`underline underline-offset-2 transition-opacity hover:opacity-60`}
                        >
                          {c.name}
                        </a>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>

            {subProjects.map((sub, idx) => (
              <div key={sub.key || idx}>
                {/* Séparateur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + idx * 0.2 }}
                  className={`flex items-center gap-4 mb-12 ${isDarkMode ? 'text-beige/30' : 'text-black/30'}`}
                >
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-beige/10' : 'bg-black/10'}`} />
                  <span className="text-xs tracking-[0.3em] uppercase">
                    Partie {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-beige/10' : 'bg-black/10'}`} />
                </motion.div>

                {/* Contenu alterné */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + idx * 0.2 }}
                  className="mb-20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className={idx % 2 === 1 ? 'order-2 lg:order-1' : ''}>
                      {idx % 2 === 0 ? (
                        <>
                          <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight">{sub.title}</h2>
                          <p className="text-base opacity-70 leading-relaxed mb-8">{sub.description}</p>
                          {sub.tags && (
                            <div className="flex flex-col gap-2">
                              <span className="opacity-40 text-xs tracking-wider uppercase">Outils</span>
                              <div className="flex flex-wrap gap-2">
                                {sub.tags.map((tag, i) => (
                                  <span key={i} className={`px-3 py-1 border rounded-full text-xs ${isDarkMode ? 'border-beige/20' : 'border-black/20'}`}>{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <SubProjectGallery subProject={sub} isDarkMode={isDarkMode} />
                      )}
                    </div>
                    <div className={idx % 2 === 1 ? 'order-1 lg:order-2' : ''}>
                      {idx % 2 === 0 ? (
                        <SubProjectGallery subProject={sub} isDarkMode={isDarkMode} />
                      ) : (
                        <>
                          <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight">{sub.title}</h2>
                          <p className="text-base opacity-70 leading-relaxed mb-8">{sub.description}</p>
                          {sub.tags && (
                            <div className="flex flex-col gap-2">
                              <span className="opacity-40 text-xs tracking-wider uppercase">Outils</span>
                              <div className="flex flex-wrap gap-2">
                                {sub.tags.map((tag, i) => (
                                  <span key={i} className={`px-3 py-1 border rounded-full text-xs ${isDarkMode ? 'border-beige/20' : 'border-black/20'}`}>{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Compétences globales */}
            {project.competences && project.competences.length > 0 && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.75 }}
                className={`border-t pt-12 mb-16 ${isDarkMode ? 'border-beige/10' : 'border-black/10'}`}
              >
                <h3 className="text-sm tracking-wider opacity-40 uppercase mb-6">Compétences mobilisées</h3>
                <div className="flex flex-wrap gap-2">
                  {project.competences.map((comp, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 text-sm rounded-full ${isDarkMode ? 'bg-beige/10' : 'bg-black/10'}`}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation vers autres projets */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
              className={`border-t pt-12 ${isDarkMode ? 'border-beige/20' : 'border-black/20'}`}
            >
              <h3 className="text-sm tracking-wider opacity-50 mb-8">Autres projets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <div className="text-xs opacity-70 mb-2 text-beige">← Précédent</div>
                        <div className="text-xl font-light text-beige">{previousProject.title}</div>
                      </div>
                    </div>
                  </Link>
                )}
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
                        <div className="text-xs opacity-70 mb-2 text-beige">Suivant →</div>
                        <div className="text-xl font-light text-beige">{nextProject.title}</div>
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

    </>
  );
}
