import { useState } from 'react';
import CVNavigation from '../components/CVNavigation';
import LetterBackground from '../components/LetterBackground';

export default function CVInterim() {
  const [scale, setScale] = useState(1);

  return (
    <LetterBackground>

      <style>{`
        section { contain: none !important; min-height: unset !important; }
        .cv-page h2, .cv-page h3, .cv-page h4 {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
        .cv-page .text-\\[7px\\]  { font-size: ${7  * scale}px !important; }
        .cv-page .text-\\[8px\\]  { font-size: ${8  * scale}px !important; }
        .cv-page .text-\\[9px\\]  { font-size: ${9  * scale}px !important; }
        .cv-page .text-\\[10px\\] { font-size: ${10 * scale}px !important; }
        .cv-page .text-\\[11px\\] { font-size: ${11 * scale}px !important; }
        .cv-page .text-xs        { font-size: ${12 * scale}px !important; }
        .cv-page .text-sm        { font-size: ${14 * scale}px !important; }
        .cv-page .text-3xl       { font-size: ${30 * scale}px !important; }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page { margin: 0; size: auto; }
          .no-print { display: none !important; }
        }
      `}</style>

      <CVNavigation />

      {/* CONTRÔLE TAILLE POLICE */}
      <div className="no-print mx-auto mb-4 flex items-center gap-3" style={{ maxWidth: '21cm' }}>
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Taille police</span>
        <button onClick={() => setScale(s => Math.max(0.7, +(s - 0.01).toFixed(2)))} className="w-7 h-7 rounded-full bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center">−</button>
        <span className="text-xs font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(1.5, +(s + 0.01).toFixed(2)))} className="w-7 h-7 rounded-full bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center">+</button>
        <button onClick={() => setScale(1)} className="text-xs text-gray-400 hover:text-gray-700 underline ml-1">reset</button>
      </div>

      {/* CONTENEUR A4 */}
      <div
        className="cv-page mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative isolate print:shadow-none print:m-0 print:w-full"
        style={{ width: '21cm', height: '29.7cm', padding: '1cm 1.5cm 1.2cm 1.5cm', boxSizing: 'border-box' }}
      >

        {/* HEADER */}
        <header className="border-b-2 border-gray-900 pb-3 mb-4 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-widest leading-none mb-1.5">RAFAEL PIRAL</h1>
              <p className="text-xs tracking-widest text-gray-900 uppercase font-bold">
                Disponible pour missions d'intérim
              </p>
              <p className="text-[10px] tracking-wider text-gray-500 uppercase font-medium mt-0.5">
                Disponible immédiatement · Juillet &amp; Août 2026 · Île-de-France · Permis B
              </p>
            </div>
            <div className="text-right text-[11px] leading-snug text-gray-600 flex flex-col items-end gap-0.5 shrink-0 ml-6">
              <a href="tel:+33769670407" className="font-bold text-gray-900 hover:underline cursor-pointer text-sm">
                07 69 67 04 07
              </a>
              <a href="mailto:rafa2002@hotmail.fr" className="hover:underline text-gray-700 cursor-pointer">
                rafa2002@hotmail.fr
              </a>
              <p>Le Pré Saint-Gervais, Île-de-France</p>
            </div>
          </div>
        </header>

        {/* PROFIL · pleine largeur */}
        <section className="mb-4 shrink-0">
          <h2 className="text-xs font-bold border-b border-gray-900 mb-2 uppercase tracking-wider text-black">Profil</h2>
          <p className="text-[11px] text-justify leading-relaxed text-gray-700">
            Disponible juillet et août 2026 en Île-de-France, permis B. Expérience en intérim de manutention aux JO de Paris 2024 via Proman. Fiable, ponctuel, grande capacité d'adaptation et fort esprit d'équipe. Équipements de sécurité personnels (casque, chaussures de sécurité, gants).
          </p>
        </section>

        {/* CORPS EN 2 COLONNES */}
        <div className="flex gap-6 flex-grow min-h-0">

          {/* COLONNE GAUCHE · Expériences */}
          <div className="flex flex-col justify-between" style={{ flex: '0 0 55%' }}>

            <section className="flex flex-col flex-grow">
              <h2 className="text-xs font-bold border-b border-gray-900 mb-3 uppercase tracking-wider text-black">Expériences Professionnelles</h2>
              <div className="flex flex-col gap-4 flex-grow">

                <div className="flex flex-col text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">Phantasmagloria, Stage Communication &amp; Audiovisuel</span>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">Avril / Juin 2026</span>
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1 leading-relaxed">
                    Stage de fin d'année universitaire. Gestion de projet, respect des délais, communication avec des interlocuteurs variés, travail en autonomie et en équipe.
                  </p>
                </div>

                <div className="flex flex-col text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="flex flex-col">
                      <span className="font-bold text-gray-900">JO Paris 2024, Manutentionnaire</span>
                      <span className="text-[9px] font-normal text-gray-500">(via Proman Intérim)</span>
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">Été 2024</span>
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1 leading-relaxed">
                    Préparation logistique des sites olympiques de Le Bourget (Escalade) et La Courneuve (Paramarathon). Port et déplacement de charges, installation et désinstallation de matériel, rangement des zones de stockage. Respect strict des consignes de sécurité, travail en équipe sous délais serrés et environnement à forte cadence.
                  </p>
                </div>

                <div className="flex flex-col text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">
                      HBC Nantes, Agent d'accueil &amp; agent de salle
                      <span className="ml-2 text-[9px] font-normal text-gray-500">(via Abalone Intérim)</span>
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">2021 / 2022</span>
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1 leading-relaxed">
                    Accueil et orientation du public lors des matchs de handball professionnel. Contrôle des billets, gestion des flux de foule, rangement et nettoyage de la salle après événement. Adaptation rapide aux imprévus et polyvalence sur différents postes.
                  </p>
                </div>

              </div>
            </section>

            {/* FORMATION */}
            <section>
              <h2 className="text-xs font-bold border-b border-gray-900 mb-3 uppercase tracking-wider text-black">Formation</h2>
              <div className="space-y-2 text-[11px] text-gray-800">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">BUT MMI Création Numérique, IUT Bobigny</span>
                  <span className="text-gray-500 text-[10px]">Depuis 2024</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">BUT Informatique (1ère année), IUT Lille</span>
                  <span className="text-gray-500 text-[10px]">2022 / 2023</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Baccalauréat STI2D, Lycée Lucie Aubrac</span>
                  <span className="text-gray-500 text-[10px]">2021</span>
                </div>
              </div>
            </section>

          </div>

          {/* SÉPARATEUR VERTICAL */}
          <div className="w-px bg-gray-200 shrink-0" />

          {/* COLONNE DROITE · Compétences */}
          <div className="flex flex-col justify-between flex-grow">

            <section className="flex flex-col flex-grow">
              <h2 className="text-xs font-bold border-b border-gray-900 mb-3 uppercase tracking-wider text-black">Compétences</h2>
              <div className="flex flex-col justify-between flex-grow">

                <div>
                  <h3 className="font-bold text-[10px] uppercase mb-2 text-gray-500 tracking-wider">Manutention &amp; Logistique</h3>
                  <ul className="text-[11px] text-gray-800 space-y-1">
                    <li>Port et déplacement de charges lourdes</li>
                    <li>Chargement / déchargement de véhicules</li>
                    <li>Préparation de commandes</li>
                    <li>Rangement &amp; organisation d'entrepôt</li>
                    <li>Utilisation de transpalette manuel</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] uppercase mb-2 text-gray-500 tracking-wider">Qualités personnelles</h3>
                  <ul className="text-[11px] text-gray-800 space-y-1">
                    <li>Ponctualité et fiabilité</li>
                    <li>Dynamisme et résistance physique</li>
                    <li>Esprit d'équipe</li>
                    <li>Prise en main rapide des consignes</li>
                    <li>Respect des règles de sécurité (EPI)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] uppercase mb-2 text-gray-500 tracking-wider">Disponibilité &amp; Mobilité</h3>
                  <ul className="text-[11px] text-gray-800 space-y-1">
                    <li>Permis B</li>
                    <li>Disponible du lundi au samedi</li>
                    <li>Horaires décalés &amp; week-end acceptés</li>
                    <li>Équipements de sécurité personnels (casque, chaussures, gants)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] uppercase mb-2 text-gray-500 tracking-wider">Autres</h3>
                  <ul className="text-[11px] text-gray-800 space-y-1">
                    <li>Suite Microsoft Office</li>
                    <li>Communication orale &amp; écrite</li>
                    <li>Français natif, Anglais intermédiaire, Espagnol intermédiaire</li>
                  </ul>
                </div>

              </div>
            </section>

          </div>

        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t border-gray-300 shrink-0 mt-4">
          <div className="flex text-[10px] text-gray-600 gap-4">
            <span className="font-bold uppercase text-gray-800">Centres d'intérêts:</span>
            <span>Football, Jeux Vidéo, Cinéma</span>
          </div>
        </div>

      </div>

      {/* BOUTON PDF */}
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

    </LetterBackground>
  );
}
