import CVNavigation from '../components/CVNavigation';
import LetterBackground from '../components/LetterBackground';
import A4Shader from '../components/A4Shader';

export default function LettrePUC() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <LetterBackground>

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
          @page { margin: 0; size: auto; }
          .no-print { display: none !important; }
        }
      `}</style>

      <CVNavigation />

      {/* --- CONTENEUR A4 --- */}
      <div
        className="mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative isolate print:shadow-none print:m-0 print:w-full"
        style={{ width: '21cm', height: '29.7cm', padding: '1.5cm 2.5cm 2cm 2.5cm', boxSizing: 'border-box' }}
      >
      <A4Shader />

        {/* --- HEADER --- */}
        <header className="flex justify-between items-start mb-10">
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

          <div className="text-right mt-6">
            <p className="text-[12px] text-gray-500 mb-6">Le Pré Saint-Gervais, le {formattedDate}</p>
            <div className="text-[12px] text-gray-700">
              <p className="font-medium">Paris Université Club</p>
              <p>À l'attention de Chloé Pouymayou</p>
              <p>17, Avenue Pierre de Coubertin</p>
              <p>75013 Paris</p>
            </div>
          </div>
        </header>

        {/* --- OBJET --- */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <p className="text-[12px]">
            <span className="font-bold text-gray-800">Objet :</span>
            <span className="text-gray-700 ml-2">Candidature pour une alternance de Community Manager à partir de septembre 2026</span>
          </p>
        </div>

        {/* --- CORPS --- */}
        <div className="text-[12px] leading-[1.8] text-gray-800 text-justify space-y-5">

          <p>Madame Pouymayou,</p>

          <p>
            Actuellement étudiant en 2<sup>e</sup> année de BUT Métiers du Multimédia et de l'Internet,
            je suis à la recherche d'une alternance pour ma 3<sup>e</sup> année à partir de septembre 2026.
            C'est avec un vif intérêt que je vous adresse ma candidature pour le poste de Community Manager
            au sein du Paris Université Club.
          </p>

          <p>
            Après mes 2 premières années de BUT MMI où j'ai eu l'opportunité de travailler en équipe sur plusieurs
            projets créatifs, j'ai développé de solides compétences en création visuelle, rédaction de contenus
            et gestion des réseaux sociaux. J'utilise régulièrement <strong>Photoshop</strong>,{' '}
            <strong>Illustrator</strong>, <strong>Affinity</strong> et <strong>Canva</strong> pour concevoir
            des visuels adaptés aux différentes plateformes, et j'ai des bases en <strong>Premiere Pro</strong>{' '}
            et <strong>After Effects</strong> pour la production de vidéos courtes. Ces expériences m'ont
            également permis de développer mon autonomie dans la gestion de projets, ma capacité à travailler
            en équipe, et m'ont poussé à effectuer une veille constante des tendances digitales et des réseaux sociaux.
          </p>

          <p>
            Cette curiosité me permet aujourd'hui d'apporter des idées nouvelles et actuelles à mes réalisations.
            Intéressé par le monde du sport, rejoindre le Paris Université Club
            représente pour moi une véritable opportunité de conjuguer mes compétences
            multimédia et mon intérêt pour le sport. Cette alternance me permettrait d'acquérir une expérience
            professionnelle solide, en complément de ma formation.
          </p>

          <p>
            Je suis enthousiaste à l'idée de contribuer à la visibilité et à l'animation des réseaux sociaux
            du PUC, de mettre en valeur ses événements, ses équipes et la vie associative du club. Je suis
            également prêt à m'investir lors des événements ponctuels et à m'adapter rapidement à vos méthodes
            de travail.
          </p>

          <p>Je reste à votre disposition pour un entretien afin de discuter de ma candidature.</p>

          <p>
            Je vous remercie par avance de l'attention que vous porterez à mon dossier et vous prie d'agréer,
            Madame, mes salutations distinguées.
          </p>

        </div>

        {/* --- SIGNATURE --- */}
        <div className="mt-4">
          <p className="text-[14px] font-bold tracking-wide">Rafael Piral</p>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Rafael Piral  Candidature Community Manager  Paris Université Club</span>
            <a href="https://rafaelpiral.fr" target="_blank" rel="noreferrer" className="hover:underline hover:text-gray-600">
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