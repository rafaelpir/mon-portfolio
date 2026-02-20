import { useState } from 'react';
import { projects } from '../data/projects';
import CVNavigation from '../components/CVNavigation';

// Short English descriptions for the CV
const cvDescriptions = {
  1: "Reproduction and reinterpretation of a film poster in Photoshop. Work on textures, typography and photo editing.",
  2: "Poster created for an official competition. Vector illustration in Flat Design using Illustrator with an original colour palette.",
  3: "Tribute poster with a retro 80s style. Halftone effects and typographic layout created in Photoshop.",
  4: "University project: design of a mobility app in Figma. User journey, Design System and interactive mockups.",
  5: "Showcase website mockup designed in Figma. Logo creation, visual identity and page layout.",
  6: "Creative project: transforming a photo into ASCII Art in Photoshop by playing with character density.",
  7: "Full visual identity for a fictional NGO: logo, brand guidelines and print materials in Illustrator and InDesign.",
  8: "Film poster in a 90s style. Photo montage and refined typography in Photoshop.",
  9: "Logo and brand guidelines for the IUT de Bobigny alumni network. University project made in Illustrator.",
  10: "Short film made for the Nikon Film Festival 2025 on the theme 'Super-power'. I took part in writing, filming, editing and subtitling.",
  11: "Website built on Jimdo dedicated to the Batman: The Dark Knight franchise. Exploration of cross-media adaptations and animated GIF creation."
};

// Translate French project titles to English
const titleEN = {
  1: "A Man Asleep — Reimagined Poster",
  2: "Poster Competition: Saint-Paul-lès-Dax Festival 2025",
  3: "Poster Tribute: Sade – Diamond Life",
  4: "UX Design: Veco App",
  5: "UI Design & Branding: Real Estate Agency",
  6: "Statue of Liberty — From Photo to ASCII",
  7: "À Cœur Ouvert — NGO Visual Identity",
  8: "Gummo — Film Poster",
  9: "Alumni Network — IUT de Bobigny",
  10: "FLEMME — Short Film",
  11: "Batman: The Dark Knight — Jimdo Website",
};

// Translate French categories to English
const categoryEN = {
  'Affiches': 'Posters',
  'UI/UX Design': 'UI/UX Design',
  'Photographie': 'Photography',
  'Branding': 'Branding',
  'Audiovisuel': 'Audiovisual',
  'Développement web': 'Web Development',
};

// IDs des projets sélectionnés par défaut dans le CV
const defaultSelectedIds = [8, 1, 2, 3, 4, 5, 6, 7, 10];

export default function CVEN() {
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

      {/* STYLE IMPRESSION + OVERRIDE CLS GLOBAL */}
      <style>{`
        /* Override des règles globales CLS qui cassent le layout A4 */
        section {
          contain: none !important;
          min-height: unset !important;
        }
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

      <CVNavigation />

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
          Select projects ({selectedIds.length}/{projects.length})
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
                    {titleEN[project.id] || project.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {categoryEN[project.category] || project.category} — {project.year}
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
                Graphic Designer, UX/UI Designer, Audiovisual & Communications
              </p>
            </div>
            <div className="text-right text-[11px] leading-snug text-gray-600 flex flex-col items-end">
              <a href="mailto:rafa2002@hotmail.fr" className="font-bold hover:underline decoration-black text-gray-900 cursor-pointer">
                rafa2002@hotmail.fr
              </a>
              <a href="https://rafaelpiral.fr" target="_blank" rel="noreferrer" className="hover:underline decoration-black text-gray-900 cursor-pointer">
                rafaelpiral.fr
              </a>
              <p>Le Pré Saint-Gervais, Île-de-France, France</p>
            </div>
          </div>
        </header>

        {/* --- CORPS DU CV --- */}
        <div className="flex-grow flex flex-col gap-4">

          {/* 1. PROFILE */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Profile</h2>
            <p className="text-[11px] text-justify leading-relaxed text-gray-700">
              {"Second-year Bachelor's degree student in Multimedia and Internet Techniques with a major in Digital Creation (MIT), seeking a minimum 10-week internship from April 2026 in digital creation, audiovisual production and communications. Eager to contribute to creative and innovative projects while developing professional expertise."}
            </p>
          </section>

          {/* 2. SKILLS */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Skills</h2>

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
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">{"Audiovisual & 3D"}</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  DaVinci Resolve, Premiere Pro, Blender, Camera/Sound
                </p>
              </div>

              {/* --- GAUCHE : Dev Web --- */}
              <div>
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">Web Development</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  HTML / CSS, JavaScript, React, PHP, WordPress
                </p>
              </div>

              {/* --- DROITE : Transverses --- */}
              <div>
                <h3 className="font-bold text-[11px] uppercase mb-1 text-gray-500">Soft Skills</h3>
                <p className="text-[11px] leading-relaxed text-gray-800">
                  Office Suite, Social Media, Project Management, Communications
                </p>
              </div>

            </div>
          </section>

          {/* 3. PROJECTS */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">
              Projects
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
                        <h3 className="font-bold text-[11px] uppercase text-black">{titleEN[project.id] || project.title}</h3>

                        {/* --- BADGES --- */}
                        {project.type === 'Universitaire' ? (
                          <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded bg-blue-100 text-blue-800 border border-blue-200">
                            UNIV.
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded bg-orange-100 text-orange-800 border border-orange-200">
                            PERS.
                          </span>
                        )}

                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{project.year}</span>
                    </div>

                    <p className="text-[10px] leading-tight text-gray-600 text-left">
                      <span className="text-gray-400 mr-1 font-mono">[{categoryEN[project.category] || project.category}]</span>
                      {descriptionSansOrphelin(desc)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. WORK EXPERIENCE */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Work Experience</h2>
            <div className="space-y-2">
              <div className="flex flex-col text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">Paris 2024 Olympics — Warehouse Operative (Proman)</span>
                  <span className="text-[10px] text-gray-500">Summer 2024</span>
                </div>
                <p className="text-gray-600 text-[10px]">
                  Logistics preparation for Olympic venues: Le Bourget (Climbing) and La Courneuve (Paramarathon).
                </p>
              </div>
              <div className="flex flex-col text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">HBC Nantes — Front Desk Agent (Abalone)</span>
                  <span className="text-[10px] text-gray-500">2021 - 2022</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. EDUCATION */}
          <section>
            <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Education</h2>
            <div className="space-y-2 text-[11px] text-gray-800">

              <div className="flex justify-between items-baseline">
                <span className="font-bold">{"Bachelor's in MIT (Digital Creation) — IUT Bobigny"}</span>
                <span className="text-gray-500 text-[10px]">Since 2024</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">{"Bachelor's in Computer Science (1st year) — IUT Lille"}</span>
                <span className="text-gray-500 text-[10px]">2022 - 2023</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">BSc Mathematics-Computer Science — University of Nantes</span>
                <span className="text-gray-500 text-[10px]">2021 - 2022</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold">{"Baccalauréat STI2D — Lycée Lucie Aubrac"}</span>
                <span className="text-gray-500 text-[10px]">2021</span>
              </div>

            </div>
          </section>

        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto pt-3 border-t border-gray-300 shrink-0">
          <div className="flex justify-between text-[10px] text-gray-600">
            <div className="flex gap-4">
              <span className="font-bold uppercase text-gray-800">Languages:</span>
              <span>French (Native), English (Intermediate), Spanish (Intermediate)</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold uppercase text-gray-800">Interests:</span>
              <span>Football, Video Games, Cinema</span>
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
