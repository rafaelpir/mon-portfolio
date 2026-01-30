import { useState } from 'react';
import { projects } from '../data/projects';

// Descriptions courtes pour le CV (sinon la description complète est trop longue)
const cvDescriptions = {
  1: "Reproduction et réinterprétation d'une affiche de film sur Photoshop. Travail sur les textures, la typographie et le traitement photo.",
  2: "Réalisation d'une affiche pour un concours officiel. Illustration vectorielle en Flat Design sur Illustrator avec une palette de couleurs originale.",
  3: "Création d'une affiche hommage avec un style rétro années 80. Utilisation d'effets de trame (halftone) et mise en page typographique sur Photoshop.",
  4: "Projet universitaire de conception d'une application de mobilité sur Figma. Parcours utilisateur, Design System et maquettes interactives.",
  5: "Maquette d'un site web vitrine réalisée sur Figma. Création du logo, de l'identité visuelle et de la mise en page.",
  6: "Projet créatif : transformation d'une photo en Art ASCII sur Photoshop en jouant sur la densité des caractères.",
  7: "Création d'une identité visuelle complète pour une ONG fictive : logo, charte graphique et supports print sur Illustrator et InDesign.",
  8: "Réalisation d'une affiche de film dans un style grunge/années 90. Photomontage et typographie travaillée sur Photoshop.",
  9: "Création du logo et de la charte graphique pour le réseau alumni de l'IUT de Bobigny. Projet universitaire réalisé sur Illustrator.",
  10: "Court-métrage réalisé pour le Nikon Film Festival 2025 sur le thème « Super-pouvoir ». J'ai participé à l'écriture, au tournage, au montage et au sous-titrage."
};

// IDs des projets sélectionnés par défaut dans le CV
const defaultSelectedIds = [8, 1, 2, 3, 4, 5, 6, 7, 10];

export default function CV() {
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds);
  const [showSelector, setShowSelector] = useState(false);

  const toggleProject = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const selectedProjects = projects
    .filter(p => selectedIds.includes(p.id))
    .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-900 py-10 print:p-0 print:m-0 print:bg-white">
      
      {/* STYLE IMPRESSION */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* --- SÉLECTEUR DE PROJETS --- */}
      <div className="no-print mx-auto mb-6" style={{ maxWidth: '21cm' }}>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showSelector ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Sélectionner les projets ({selectedIds.length}/{projects.length})
        </button>

        {showSelector && (
          <div className="mt-3 p-4 bg-white rounded-lg shadow-md border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {projects.map((project) => (
              <label
                key={project.id}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedIds.includes(project.id)
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(project.id)}
                  onChange={() => toggleProject(project.id)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate block">
                    {project.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {project.category} — {project.type} — {project.year}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* --- CONTENEUR A4 --- */}
      <div
        className="mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative print:shadow-none print:m-0 print:w-full"
        style={{
          width: '21cm',
          height: '29.7cm',
          // MODIFICATION ICI : Padding Haut réduit à 1cm (au lieu de 1.5cm) pour remonter le titre
          padding: '1cm 1.5cm 1.5cm 1.5cm',
          boxSizing: 'border-box'
        }}
      >

        {/* --- HEADER --- */}
        <header className="border-b-2 border-gray-900 pb-3 mb-4 shrink-0">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-widest leading-none mb-1.5">RAFAEL PIRAL</h1>
              <p className="text-xs tracking-widest text-gray-600 uppercase font-medium">
                Graphiste, Designer UX/UI, Audiovisuel & Communication
              </p>
            </div>
            <div className="text-right text-[11px] leading-snug text-gray-600 flex flex-col items-end">
              <a href="mailto:rafa2002@hotmail.fr" className="font-bold hover:underline decoration-black text-gray-900 cursor-pointer">
                rafa2002@hotmail.fr
              </a>
              <a href="https://rafaelpiral.fr" target="_blank" rel="noreferrer" className="hover:underline decoration-black text-gray-900 cursor-pointer">
                rafaelpiral.fr
              </a>
              <p>Le Pré Saint-Gervais, Île-de-France</p>
            </div>
          </div>
        </header>

        {/* --- CORPS DU CV --- */}
        <div className="flex-grow flex flex-col gap-4">

          {/* 1. PROFIL */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Profil</h2>
            <p className="text-[11px] text-justify leading-relaxed text-gray-700">
              Étudiant en 2e année de BUT Métiers du Multimédia et de l'Internet, je suis à la recherche d'un stage d'au moins 8 semaines à partir d'avril 2026 dans le domaine de la création numérique, de l'audiovisuel et de la communication. Je souhaite contribuer à des projets créatifs et innovants tout en développant mon expertise professionnelle.
            </p>
          </section>

          {/* 2. COMPÉTENCES */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Compétences</h2>
            
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 items-start">
              
              {/* --- GAUCHE : Design --- */}
              <div>
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">Design & UX/UI</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  Figma, Photoshop, Illustrator, InDesign, Canva
                </p>
              </div>

              {/* --- DROITE : Audiovisuel --- */}
              <div>
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">Audiovisuel & 3D</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  DaVinci Resolve, Premiere Pro, Blender, Prise de vue/son
                </p>
              </div>

              {/* --- GAUCHE : Dev Web --- */}
              <div>
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">Développement Web</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  HTML / CSS, JavaScript, React, PHP, WordPress
                </p>
              </div>

              {/* --- DROITE : Transverses --- */}
              <div>
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">Transverses</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  Suite Office, Réseaux Sociaux, Gestion de projet, Communication
                </p>
              </div>

            </div>
          </section>

          {/* 3. PROJETS */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">
              Mes Projets
            </h2>
            <div className="space-y-2.5">
              {selectedProjects.map((project) => {

                // --- FONCTION ANTI-ORPHELINS ---
                const descriptionSansOrphelin = (text) => {
                   if (!text) return "";
                   const lastSpaceIndex = text.lastIndexOf(" ");
                   if (lastSpaceIndex === -1) return text;
                   return text.substring(0, lastSpaceIndex) + "\u00A0" + text.substring(lastSpaceIndex + 1);
                };

                const desc = cvDescriptions[project.id] || project.description;

                return (
                  <div key={project.id} className="border-l-2 border-gray-900 pl-3 relative">

                    <div className="flex items-baseline justify-between mb-0.5">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-bold text-[11px] uppercase text-black">{project.title}</h3>

                        {/* --- BADGES --- */}
                        {project.type === 'Universitaire' ? (
                          <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded bg-blue-100 text-blue-800 border border-blue-200">
                            UNIV.
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded bg-orange-100 text-orange-800 border border-orange-200">
                            PERSO.
                          </span>
                        )}

                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{project.year}</span>
                    </div>

                    <p className="text-[10px] leading-tight text-gray-600 text-left">
                      <span className="text-gray-400 mr-1 font-mono">[{project.category}]</span>
                      {descriptionSansOrphelin(desc)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. EXPÉRIENCES */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Expériences Professionnelles</h2>
            <div className="space-y-2">
              <div className="flex flex-col text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">JO Paris 2024 — Manutentionnaire (Proman)</span>
                  <span className="text-[10px] text-gray-500">Été 2024</span>
                </div>
                <p className="text-gray-600 text-[10px]">
                  Préparation logistique des sites : Le Bourget (Escalade) et La Courneuve (Paramarathon).
                </p>
              </div>
              <div className="flex flex-col text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">HBC Nantes — Agent d’accueil (Abalone)</span>
                  <span className="text-[10px] text-gray-500">2021 - 2022</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FORMATION */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Formation scolaire</h2>
            <div className="space-y-2 text-[11px] text-gray-800">
              
              <div className="flex justify-between items-baseline">
                <span className="font-bold">BUT MMI (Création Numérique) — IUT Bobigny</span>
                <span className="text-gray-500 text-[10px]">Depuis 2024</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">BUT Informatique (1ère année) — IUT Lille</span>
                <span className="text-gray-500 text-[10px]">2022 - 2023</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">Licence Mathématiques-Informatique — Université de Nantes</span>
                <span className="text-gray-500 text-[10px]">2021 - 2022</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">Baccalauréat STI2D (Mention Bien) — Lycée Lucie Aubrac</span>
                <span className="text-gray-500 text-[10px]">2021</span>
              </div>

            </div>
          </section>

        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto pt-3 border-t border-gray-300 shrink-0">
          <div className="flex justify-between text-[10px] text-gray-600">
            <div className="flex gap-4">
              <span className="font-bold uppercase text-gray-800">Langues:</span>
              <span>Français (Natif), Anglais (Intermédiaire), Espagnol (Intermédiaire)</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold uppercase text-gray-800">Centres d'intérêts:</span>
              <span>Football, Jeux Vidéo, Cinéma</span>
            </div>
          </div>
          <div className="text-center mt-1 text-gray-400 text-[9px]"> 
            <a href="https://rafaelpiral.fr" target="_blank" rel="noreferrer" className="ml-1 hover:underline text-gray-500 cursor-pointer">
              rafaelpiral.fr
            </a>
          </div>
        </div>

      </div>

      {/* --- BOUTON DOWNLOAD --- */}
      <div className="fixed bottom-6 right-6 z-50 no-print">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black text-white font-bold py-3 px-5 rounded-full shadow-xl hover:bg-gray-800 border-2 border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          PDF
        </button>
      </div>

    </div>
  );
}