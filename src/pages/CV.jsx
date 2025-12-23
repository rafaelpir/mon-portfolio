import { useState } from 'react';
import { projects, skills } from '../data/projects';

export default function CV() {
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  return (
    <div className={`min-h-screen font-stamp ${
      isDarkMode ? 'bg-black text-beige' : 'bg-beige text-black'
    }`}>
      {/* Format A4 pour impression */}
      <div className="max-w-[21cm] mx-auto bg-black text-white shadow-2xl" style={{ minHeight: '29.7cm' }}>

        {/* En-tête */}
        <header className="border-b-4 border-white p-8">
          <h1 className="text-6xl font-bold tracking-wider mb-2">RAFAEL PIRAL</h1>
          <p className="text-2xl opacity-70">Designer Graphique & Développeur Web</p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold">EMAIL:</span>
              <span>contact@rafaelpiral.fr</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">PORTFOLIO:</span>
              <span>rafaelpiral.fr</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">LOCALISATION:</span>
              <span>France</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Profil */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold border-b-2 border-white pb-2 mb-4">PROFIL</h2>
            <p className="text-base leading-relaxed opacity-80">
              Étudiant passionné par le design graphique et le développement web.
              Spécialisé dans la création d'identités visuelles, d'interfaces UI/UX et de sites web modernes.
              Maîtrise des outils Adobe Creative Suite et des technologies web front-end.
            </p>
          </section>

          {/* Compétences */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold border-b-2 border-white pb-2 mb-4">COMPÉTENCES</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Design Graphique</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Photoshop</li>
                  <li>• Illustrator</li>
                  <li>• InDesign</li>
                  <li>• After Effects</li>
                  <li>• Premiere Pro</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Développement Web</h3>
                <ul className="space-y-1 text-sm">
                  <li>• HTML/CSS</li>
                  <li>• JavaScript</li>
                  <li>• React</li>
                  <li>• Figma</li>
                  <li>• WordPress</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Projets Récents */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold border-b-2 border-white pb-2 mb-4">PROJETS RÉCENTS</h2>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border-l-4 border-white pl-4">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm opacity-70 mb-1">{project.category} • {project.year}</p>
                  <p className="text-sm leading-relaxed opacity-80">
                    {project.description.length > 150
                      ? project.description.substring(0, 150) + '...'
                      : project.description}
                  </p>
                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-white text-black">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Formation */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold border-b-2 border-white pb-2 mb-4">FORMATION</h2>
            <div className="border-l-4 border-white pl-4">
              <h3 className="font-bold text-lg">Étudiant en Développement Web & Design</h3>
              <p className="text-sm opacity-70">2024 - 2025</p>
              <p className="text-sm mt-2 opacity-80">
                Formation spécialisée en développement web front-end et design d'interfaces utilisateur.
              </p>
            </div>
          </section>

          {/* Langues */}
          <section>
            <h2 className="text-3xl font-bold border-b-2 border-white pb-2 mb-4">LANGUES</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold">Français:</span> Langue maternelle
              </div>
              <div>
                <span className="font-bold">Anglais:</span> Intermédiaire
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t-4 border-white p-8 mt-auto">
          <p className="text-xs text-center opacity-50">
            Portfolio disponible sur rafaelpiral.fr • Ce CV a été généré le {new Date().toLocaleDateString('fr-FR')}
          </p>
        </footer>
      </div>

      {/* Instructions pour screenshot */}
      <div className="max-w-[21cm] mx-auto mt-8 p-4 bg-yellow-100 text-black rounded">
        <h3 className="font-bold mb-2">Pour créer une image de ce CV :</h3>
        <ol className="text-sm space-y-1">
          <li>1. Appuie sur <kbd className="bg-gray-200 px-2 py-1 rounded">Cmd + Shift + 4</kbd> (Mac) ou utilise l'outil capture d'écran</li>
          <li>2. Sélectionne la zone du CV (rectangle noir)</li>
          <li>3. Ou utilise <kbd className="bg-gray-200 px-2 py-1 rounded">Cmd + P</kbd> pour imprimer en PDF</li>
          <li>4. Tu peux aussi ouvrir ce CV dans Photoshop pour plus de personnalisation</li>
        </ol>
      </div>
    </div>
  );
}
