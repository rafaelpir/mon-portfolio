import React from 'react';
import { motion } from 'framer-motion';
import { workInProgressProjects } from '../data/projects';

export default function WorkInProgress({ isDarkMode }) {
  if (workInProgressProjects.length === 0) return null;

  return (
    <motion.section
      className="py-16 md:py-32 px-4 md:px-16"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-xs md:text-sm tracking-widest mb-12 md:mb-16 text-center ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          PROJETS EN COURS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {workInProgressProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative overflow-hidden rounded-lg"
            >
              {/* Image container avec effet blur */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isDarkMode
                      ? 'grayscale blur-sm group-hover:grayscale-0 group-hover:blur-none'
                      : 'grayscale-[50%] blur-sm group-hover:grayscale-0 group-hover:blur-none'
                  }`}
                />

                {/* Overlay gradient */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-t from-black via-black/50 to-transparent'
                    : 'bg-gradient-to-t from-white via-white/50 to-transparent'
                } group-hover:opacity-70`} />

                {/* Badge "EN COURS" */}
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium backdrop-blur-md ${
                    isDarkMode
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                      : 'bg-orange-500/20 text-orange-600 border border-orange-600/30'
                  }`}>
                    {project.status.toUpperCase()}
                  </div>
                </div>

                {/* Contenu au bas de la carte */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Category */}
                  <p className={`text-xs md:text-sm mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {project.category}
                  </p>

                  {/* Title */}
                  <h3 className={`text-xl md:text-2xl font-light mb-3 ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}>
                    {project.title}
                  </h3>

                  {/* Description (visible au hover) */}
                  <p className={`text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {project.description}
                  </p>

                  {/* Progress bar */}
                  {project.progress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Progression
                        </span>
                        <span className={`text-xs font-medium ${
                          isDarkMode ? 'text-beige' : 'text-black'
                        }`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-beige/20' : 'bg-black/20'
                      }`}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isDarkMode ? 'bg-beige' : 'bg-black'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Estimated completion */}
                  {project.estimatedCompletion && (
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Fin prévue : {project.estimatedCompletion}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note explicative */}
        <div className={`mt-8 text-center text-xs md:text-sm ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          <p>
            Ces projets sont actuellement en développement et seront bientôt disponibles
          </p>
        </div>
      </div>
    </motion.section>
  );
}
