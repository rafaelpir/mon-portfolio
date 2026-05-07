import { useState } from 'react';
import CVNavigation from '../components/CVNavigation';
import LetterBackground from '../components/LetterBackground';
import A4Shader from '../components/A4Shader';

export default function LettreAssistantSonPlateau() {
  const [entreprise, setEntreprise] = useState('');
  const [adresse, setAdresse] = useState('');

  const today = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);

  return (
    <LetterBackground>

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

      <CVNavigation />

      {/* --- SÉLECTEUR MODE --- */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Destinataire */}
          <div className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Destinataire</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom de l'entreprise"
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENEUR A4 --- */}
      <div
        className="mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative isolate print:shadow-none print:m-0 print:w-full"
        style={{
          width: '21cm',
          height: '29.7cm',
          padding: '1.5cm 2.5cm 2cm 2.5cm',
          boxSizing: 'border-box'
        }}
      >
      <A4Shader />

        {/* --- HEADER DEUX COLONNES --- */}
        <header className="flex justify-between items-start mb-10">
          {/* Expéditeur - Gauche */}
          <div>
            <h1 className="text-3xl font-bold tracking-wider leading-tight mb-3">
              RAFAEL<br />PIRAL
            </h1>
            <div className="text-[12px] leading-relaxed text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">07.69.67.04.07</p>
              <p>rafa2002@hotmail.fr</p>
              <p>Le Pré Saint-Gervais</p>
              <p>Permis B</p>
            </div>
          </div>

          {/* Destinataire - Droite */}
          <div className="text-right mt-6">
            <p className="text-[12px] text-gray-500 mb-6">Le Pré Saint-Gervais, le {formattedDate}</p>
            {(entreprise || adresse) && (
              <div className="text-[12px] text-gray-700 mb-2">
                {entreprise && <p className="font-medium">{entreprise}</p>}
                {adresse && <p>{adresse}</p>}
              </div>
            )}
          </div>
        </header>

        {/* --- OBJET --- */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <p className="text-[12px]">
            <span className="font-bold text-gray-800">Objet :</span>
            <span className="text-gray-700 ml-2">
              Candidature pour une alternance d'assistant·e son et plateau à partir de septembre 2026
            </span>
          </p>
        </div>

        {/* --- CORPS DE LA LETTRE --- */}
        <div className="text-[12px] leading-[1.8] text-gray-800 text-justify space-y-5">

          <p>Madame, Monsieur,</p>

          <p>
            Actuellement étudiant en 2<sup>e</sup> année de BUT Métiers du Multimédia et de l'Internet,
            {' '}je suis à la recherche d'une alternance à partir de septembre 2026 en tant qu'assistant·e son et plateau.
          </p>

          <p>
            Au cours de ma formation en BUT MMI, j'ai eu l'opportunité de travailler sur des projets
            audiovisuels concrets, notamment en participant à l'écriture, au tournage, à la{' '}
            <strong>prise de son</strong>, au montage et au sous-titrage, jusqu'à la réalisation de{' '}
            courts-métrages, dont un pour le <strong>Nikon Film Festival 2025</strong>.
            Ces expériences m'ont permis de me familiariser avec les contraintes d'un tournage,
            la gestion du son en situation réelle, et le travail en équipe sur un plateau.
            J'utilise régulièrement <strong>DaVinci Resolve</strong> et <strong>Premiere Pro</strong>{' '}
            pour le montage et le traitement audio, et j'ai développé une rigueur dans la gestion
            des différentes étapes de production.
          </p>

          <p>
            Cette expérience du terrain, combinée à mon sens de l'organisation et ma capacité
            d'adaptation, me pousse aujourd'hui à vouloir approfondir ma pratique du son et du
            plateau dans un environnement professionnel. Je suis convaincu que votre structure est
            l'endroit idéal pour continuer à apprendre et progresser dans ce domaine.{' '}
            Cette alternance me permettrait d'acquérir une
            expérience solide, en complément de ma formation.
          </p>

          <p>
            Je suis enthousiaste à l'idée de contribuer à vos productions et de mettre en pratique
            mes compétences techniques. Je suis également prêt à découvrir de nouveaux outils et à
            m'adapter rapidement à vos méthodes de travail.
          </p>

          <p>
            Je reste à votre disposition pour un entretien afin de discuter de ma candidature.
          </p>

          <p>
            Je vous remercie par avance de l'attention que vous porterez à mon dossier et vous
            prie d'agréer, Madame, Monsieur, mes salutations&nbsp;distinguées.
          </p>

        </div>

        {/* --- SIGNATURE --- */}
        <div className="mt-4">
          <p className="text-[14px] font-bold tracking-wide">Rafael Piral</p>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Rafael Piral  Candidature Assistant·e Son et Plateau</span>
            <a href="https://rafaelpiral.fr" target="_blank" rel="noreferrer" className="hover:underline cursor-pointer hover:text-gray-600">
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
          aria-label="Télécharger en PDF"
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