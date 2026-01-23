import { useState } from 'react';

export default function CV() {
  
  // --- DONNÉES PROJETS (Descriptions optimisées) ---
  const customProjects = [
    {
      id: 8,
      title: "Gummo — Affiche de film",
      category: "Affiches",
      type: "Personnel",
      year: "2026",
      description: "Conception d'affiche au style 'Grunge/90s'. Travail de composition, photomontage et typographie distordue pour refléter l'univers underground du film."
    },
    {
      id: 1,
      title: "Un Homme qui dort",
      category: "Affiches",
      type: "Personnel",
      year: "2025",
      description: "Réinterprétation graphique d'une affiche culte. Composition texturée mêlant typographie d'époque et traitement photo granuleux pour une ambiance mélancolique."
    },
    {
      id: 2,
      title: "Fêtes de Saint-Paul-lès-Dax",
      category: "Affiches",
      type: "Universitaire",
      year: "2025",
      description: "Affiche de concours officiel. Illustration vectorielle (Flat Design) et choix stratégique d'une palette bleue pour rompre avec les codes traditionnels des ferias."
    },
    {
      id: 3,
      title: "Sade – Diamond Life",
      category: "Affiches",
      type: "Personnel",
      year: "2025",
      description: "Affiche hommage style rétro. Maîtrise des effets de trame (halftone) et composition typographique élégante évoquant l'esthétique vinyle des années 80."
    },
    {
      id: 4,
      title: "Application Veco",
      category: "UI/UX Design",
      type: "Universitaire",
      year: "2025",
      description: "Conception UX/UI d'une app de mobilité. Création du parcours utilisateur, du Design System et des maquettes interactives haute fidélité sur Figma."
    },
    {
      id: 5,
      title: "Agence Immobilière Web",
      category: "UI/UX Design",
      type: "Universitaire",
      year: "2025",
      description: "Design d'interface web optimisé pour le SEO. Création de l'identité de marque et structuration de l'information pour maximiser la lisibilité et la conversion."
    },
    {
      id: 6,
      title: "Statue de la Liberté ASCII",
      category: "Photographie",
      type: "Personnel",
      year: "2025",
      description: "Expérimentation graphique technique : transformation d'une photographie en composition typographique pure (Art ASCII) jouant sur la densité des caractères."
    },
    {
      id: 7,
      title: "ONG À Cœur Ouvert",
      category: "Branding",
      type: "Universitaire",
      year: "2025",
      description: "Création de l'identité visuelle globale (Logo, Charte, Print). Conception d'un univers rassurant et professionnel pour une ONG fictive."
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-900 py-10">
      
      {/* STYLE IMPRESSION (Fond blanc forcé) */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
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

      {/* --- CONTENEUR A4 --- */}
      <div
        className="mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative"
        style={{
          width: '21cm',
          height: '29.7cm',
          padding: '1.5cm',
          boxSizing: 'border-box'
        }}
      >

        {/* --- HEADER --- */}
        <header className="border-b-2 border-gray-900 pb-3 mb-3 shrink-0">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-widest leading-none mb-1">RAFAEL PIRAL</h1>
              <p className="text-xs tracking-widest text-gray-600 uppercase font-medium">
                Graphiste, Designer UX/UI & Audiovisuel
              </p>
            </div>
            <div className="text-right text-[10px] leading-snug text-gray-600 flex flex-col items-end">
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
        <div className="flex-grow flex flex-col justify-between gap-2">

          {/* 1. PROFIL */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-1 uppercase tracking-wider text-black">Profil</h2>
            <p className="text-[10px] text-justify leading-snug text-gray-700">
            Étudiant en 2e année de BUT Métiers du Multimédia et de l'Internet, je suis à la recherche d'un stage d'au moins 8 semaines à partir d'avril 2026 dans le domaine de la création numérique et de l'audiovisuel. Je souhaite contribuer à des projets créatifs et innovants tout en développant mon expertise professionnelle.            </p>
          </section>
{/* 2. COMPÉTENCES */}
<section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Compétences</h2>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-start">
              
              {/* --- GAUCHE : Design --- */}
              <div>
                <h3 className="font-bold text-[10px] uppercase mb-1 text-gray-500">Design & UX/UI</h3>
                <p className="text-[10px] leading-relaxed text-gray-800">
                  Figma, Photoshop, Illustrator, InDesign, Canva
                </p>
              </div>

              {/* --- DROITE : Audiovisuel --- */}
              <div>
                <h3 className="font-bold text-[10px] uppercase mb-1 text-gray-500">Audiovisuel & 3D</h3>
                <p className="text-[10px] leading-relaxed text-gray-800">
                  DaVinci Resolve, Premiere Pro, Blender, Prise de vue/son
                </p>
              </div>

              {/* --- GAUCHE : Dev Web --- */}
              <div>
                <h3 className="font-bold text-[10px] uppercase mb-1 text-gray-500">Développement Web</h3>
                <p className="text-[10px] leading-relaxed text-gray-800">
                  HTML / CSS, JavaScript, React, PHP, WordPress
                </p>
              </div>

              {/* --- DROITE : Transverses --- */}
              <div>
                <h3 className="font-bold text-[10px] uppercase mb-1 text-gray-500">Transverses</h3>
                <p className="text-[10px] leading-relaxed text-gray-800">
                  Suite Office, Réseaux Sociaux, Gestion de projet, 
                </p>
              </div>

            </div>
          </section>

{/* 3. PROJETS */}
<section className="flex-grow">
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">
              Mes Projets
            </h2>
            <div className="space-y-2">
              {customProjects.map((project) => {
                
                // --- FONCTION ANTI-ORPHELINS ---
                // Cette logique remplace la dernière espace par une espace insécable
                // pour coller le dernier mot au précédent.
                const descriptionSansOrphelin = (text) => {
                   if (!text) return "";
                   const lastSpaceIndex = text.lastIndexOf(" ");
                   if (lastSpaceIndex === -1) return text;
                   // On coupe le texte avant la dernière espace et on ajoute une espace insécable (\u00A0)
                   return text.substring(0, lastSpaceIndex) + "\u00A0" + text.substring(lastSpaceIndex + 1);
                };

                return (
                  <div key={project.id} className="border-l-2 border-gray-900 pl-3 relative">
                    
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-bold text-[10px] uppercase text-black">{project.title}</h3>

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
                      <span className="text-[9px] text-gray-500 font-mono">{project.year}</span>
                    </div>

                    <p className="text-[9px] leading-tight text-gray-600 mt-0.5 text-left">
                      <span className="text-gray-400 mr-1 font-mono">[{project.category}]</span>
                      {/* Utilisation de la fonction ici */}
                      {descriptionSansOrphelin(project.description)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. EXPÉRIENCES */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-1 uppercase tracking-wider text-black">Expériences Professionnelles</h2>
            <div className="space-y-1">
              <div className="flex flex-col text-[10px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">JO Paris 2024 — Manutentionnaire (Proman)</span>
                  <span className="text-[9px] text-gray-500">Été 2024</span>
                </div>
                <p className="text-gray-600 text-[9px]">
                  Préparation logistique des sites : Le Bourget (Escalade) et La Courneuve (Paramarathon).
                </p>
              </div>
              <div className="flex flex-col text-[10px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">HBC Nantes — Agent d’accueil (Abalone)</span>
                  <span className="text-[9px] text-gray-500">2021 - 2022</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FORMATION */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-1 uppercase tracking-wider text-black">Formation scolaire</h2>
            <div className="space-y-1 text-[10px] text-gray-800">
              
              <div className="flex justify-between items-baseline">
                <span className="font-bold">BUT MMI (Création Numérique) — IUT Bobigny</span>
                <span className="text-gray-500 text-[9px]">Depuis 2024</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">BUT Informatique (1ère année) — IUT Lille</span>
                <span className="text-gray-500 text-[9px]">2022 - 2023</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">Licence Mathématiques-Informatique — Université de Nantes</span>
                <span className="text-gray-500 text-[9px]">2021 - 2022</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">Baccalauréat STI2D (Mention Bien) — Lycée Lucie Aubrac</span>
                <span className="text-gray-500 text-[9px]">2021</span>
              </div>

            </div>
          </section>

        </div>

        {/* --- FOOTER --- */}
        <div className="mt-2 pt-2 border-t border-gray-300 shrink-0">
          <div className="flex justify-between text-[9px] text-gray-600">
            <div className="flex gap-4">
              <span className="font-bold uppercase text-gray-800">Langues:</span>
              <span>Français (Natif), Anglais (Intermédiaire), Espagnol (Intermédiaire)</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold uppercase text-gray-800">Centres d'intérêts:</span>
              <span>Football, Jeux Vidéo, Cinéma</span>
            </div>
          </div>
          <div className="text-center mt-1 text-gray-400 text-[8px]">
            CV généré le {new Date().toLocaleDateString('fr-FR')} • 
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