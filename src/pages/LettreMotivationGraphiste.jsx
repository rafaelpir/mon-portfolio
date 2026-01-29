import { useState } from 'react';

export default function LettreMotivationGraphiste() {
  // Liste des métiers
  const metiers = [
    { id: 'graphiste', label: 'Graphiste', domaine: 'la création graphique' },
    { id: 'motion-designer', label: 'Motion Designer', domaine: 'le motion design' },
    { id: 'monteur-video', label: 'Monteur Vidéo', domaine: 'le montage vidéo' },
    { id: 'directeur-artistique', label: 'Directeur Artistique', domaine: 'la direction artistique' },
    { id: 'ux-ui-designer', label: 'UX/UI Designer', domaine: 'le design UX/UI' },
    { id: 'videaste', label: 'Vidéaste', domaine: 'la production audiovisuelle' },
    { id: 'infographiste', label: 'Infographiste', domaine: 'l\'infographie' },
    { id: 'webdesigner', label: 'Webdesigner', domaine: 'le webdesign' },
    { id: 'chef-de-projet', label: 'Chef de Projet Multimédia', domaine: 'la gestion de projets multimédias' },
    { id: 'charge-de-communication', label: 'Chargé de Communication', domaine: 'la communication' },
  ];

  const [selectedMetier, setSelectedMetier] = useState(metiers[0]);
  const [entreprise, setEntreprise] = useState('');
  const [adresse, setAdresse] = useState('');

  // Date automatique
  const today = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);

  // Outils selon le métier
  const getOutils = () => {
    switch (selectedMetier.id) {
      case 'motion-designer':
        return '<strong>After Effects</strong>, <strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>Blender</strong> et <strong>Photoshop</strong>';
      case 'monteur-video':
        return '<strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>After Effects</strong> et <strong>Audition</strong>';
      case 'videaste':
        return '<strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>After Effects</strong> et la <strong>prise de vue/son</strong>';
      case 'ux-ui-designer':
        return '<strong>Figma</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong> et <strong>Protopie</strong>';
      case 'webdesigner':
        return '<strong>Figma</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>HTML/CSS</strong> et <strong>React</strong>';
      case 'directeur-artistique':
        return '<strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>InDesign</strong>, <strong>Figma</strong> et <strong>After Effects</strong>';
      case 'chef-de-projet':
        return '<strong>Figma</strong>, <strong>Notion</strong>, <strong>Suite Adobe</strong> et les <strong>outils collaboratifs</strong>';
      case 'charge-de-communication':
        return '<strong>Canva</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong> et <strong>Premiere Pro</strong>';
      default:
        return '<strong>Illustrator</strong>, <strong>Photoshop</strong>, <strong>InDesign</strong>, <strong>Canva</strong> et <strong>Affinity</strong>';
    }
  };

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

      {/* --- SÉLECTEUR DE MÉTIER ET DESTINATAIRE --- */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Métier */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Sélectionnez un métier</h2>
            <div className="flex flex-wrap gap-2">
              {metiers.map((metier) => (
                <button
                  key={metier.id}
                  onClick={() => setSelectedMetier(metier)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedMetier.id === metier.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {metier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destinataire */}
          <div>
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
        className="mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative print:shadow-none print:m-0 print:w-full"
        style={{
          width: '21cm',
          height: '29.7cm',
          padding: '1.5cm 2.5cm 2cm 2.5cm',
          boxSizing: 'border-box'
        }}
      >

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
            <span className="text-gray-700 ml-2">Candidature pour un stage de {selectedMetier.label.toLowerCase()} (8 semaines minimum - Avril 2026)</span>
          </p>
        </div>

        {/* --- CORPS DE LA LETTRE --- */}
        <div className="text-[12px] leading-[1.8] text-gray-800 text-justify space-y-5">

          <p>Madame, Monsieur,</p>

          <p>
            Actuellement étudiant en 2<sup>e</sup> année de BUT Métiers du Multimédia et de l'Internet,
            je suis à la recherche d'un stage d'au moins 8 semaines à partir d'avril 2026
            en tant que {selectedMetier.label.toLowerCase()}.
          </p>

          <p>
            Après une première année de BUT MMI où j'ai eu l'opportunité de travailler en équipe
            sur plusieurs projets créatifs, j'ai développé une solide maîtrise des outils de
            création. J'utilise régulièrement <span dangerouslySetInnerHTML={{ __html: getOutils() }} /> pour concevoir des visuels variés et des contenus de qualité.
            Ces expériences m'ont également permis de développer mon autonomie dans la gestion
            de projets, ma capacité à travailler en équipe, et m'ont poussé à faire une veille
            créative constante pour rester à l'affût des nouvelles tendances dans {selectedMetier.domaine}.
          </p>

          <p>
            Cette curiosité me permet aujourd'hui d'apporter des idées fraîches et actuelles à mes
            réalisations. Je suis convaincu que votre entreprise est l'endroit idéal pour continuer
            à apprendre et progresser dans ce domaine. Ce stage me permettrait d'acquérir une expérience
            professionnelle solide, en complément de ma formation.
          </p>

          <p>
            Je suis enthousiaste à l'idée de contribuer à vos projets et de mettre
            en pratique mes compétences créatives. Je suis également prêt à découvrir de nouveaux
            outils et à m'adapter rapidement à vos méthodes de travail.
          </p>

          <p>
            Je reste à votre disposition pour un entretien afin de discuter de ma candidature.
          </p>

          <p>
            Je vous remercie par avance de l'attention que vous porterez à mon dossier et vous
            prie d'agréer, Madame, Monsieur, mes salutations distinguées.
          </p>

        </div>

        {/* --- SIGNATURE --- */}
        <div className="mt-4">
          <p className="text-[14px] font-bold tracking-wide">Rafael Piral</p>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Rafael Piral — Candidature Stage {selectedMetier.label}</span>
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

    </div>
  );
}
