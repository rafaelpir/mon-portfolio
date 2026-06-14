import { useState } from 'react';
import CVNavigation from '../components/CVNavigation';
import LetterBackground from '../components/LetterBackground';
import A4Shader from '../components/A4Shader';

export default function LettreClubFoot() {
  const postes = [
    { id: 'graphiste', label: 'Graphiste', domaine: 'la création graphique' },
    { id: 'motion-designer', label: 'Motion Designer', domaine: 'le motion design' },
    { id: 'monteur-video', label: 'Monteur Vidéo', domaine: 'le montage vidéo' },
    { id: 'directeur-artistique', label: 'Directeur Artistique', domaine: 'la direction artistique' },
    { id: 'ux-ui', label: 'UX/UI Designer', domaine: 'le design UX/UI' },
    { id: 'videaste', label: 'Vidéaste', domaine: 'la production vidéo' },
    { id: 'infographiste', label: 'Infographiste', domaine: 'l\'infographie' },
    { id: 'webdesigner', label: 'Webdesigner', domaine: 'le webdesign' },
    { id: 'chef-projet-multimedia', label: 'Chef de Projet Multimédia', domaine: 'la gestion de projets multimédia' },
    { id: 'charge-communication', label: 'Chargé de Communication', domaine: 'la communication' },
    { id: 'assistant-communication', label: 'Assistant Communication', domaine: 'la communication' },
    { id: 'community-manager', label: 'Community Manager', domaine: 'le community management' },
    { id: 'social-media-design', label: 'Social Media & Design Graphique', domaine: 'le social media et le design graphique' },
    { id: 'com-social-media-assistant', label: 'Communication & Social Media Assistant', domaine: 'la communication et les réseaux sociaux' },
    { id: 'assistant-com-evenementielle', label: 'Assistant Communication-Événementiel H/F', domaine: 'la communication événementielle' },
    { id: 'createur-contenu', label: 'Créateur de Contenus', domaine: 'la création de contenus' },
  ];

  const [selectedPoste, setSelectedPoste] = useState(postes[0]);
  const [prefixeComEv, setPrefixeComEv] = useState('assistant');
  const [club, setClub] = useState('');

  const posteLabel = selectedPoste.id === 'assistant-com-evenementielle'
    ? (prefixeComEv === 'assistant' ? 'assistant communication-événementiel' : 'chargé·e de communication-événementielle')
    : selectedPoste.label.toLowerCase();
  const [adresse, setAdresse] = useState('');
  const [articleClub, setArticleClub] = useState('la');
  const [typeOrga, setTypeOrga] = useState('ligue');
  const [paragrapheLibre, setParagrapheLibre] = useState(
    "Le football tient une grande place dans ma vie, et pas seulement en tant que supporter. J'ai toujours été attentif à la manière dont les grandes organisations sportives soignent leur image, animent leurs réseaux et créent des contenus qui parlent aux gens. Pouvoir faire ce travail pour votre organisation, c'est une vraie motivation pour moi."
  );

  const today = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);

  const getOutils = () => {
    switch (selectedPoste.id) {
      case 'graphiste':
      case 'infographiste':
      case 'directeur-artistique':
        return '<strong>Illustrator</strong>, <strong>Photoshop</strong>, <strong>InDesign</strong> et <strong>Figma</strong>';
      case 'motion-designer':
        return '<strong>After Effects</strong>, <strong>Premiere Pro</strong>, <strong>Illustrator</strong> et <strong>Photoshop</strong>';
      case 'monteur-video':
      case 'videaste':
        return '<strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>After Effects</strong> et <strong>Audition</strong>';
      case 'ux-ui':
      case 'webdesigner':
        return '<strong>Figma</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong> et <strong>After Effects</strong>';
      case 'chef-projet-multimedia':
        return '<strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong> et <strong>Figma</strong>';
      case 'community-manager':
      case 'social-media-design':
      case 'com-social-media-assistant':
        return '<strong>Canva</strong>, <strong>Photoshop</strong>, <strong>Premiere Pro</strong> et les <strong>outils de planification réseaux sociaux</strong>';
      case 'charge-communication':
      case 'assistant-communication':
        return '<strong>Canva</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>Premiere Pro</strong> et les <strong>réseaux sociaux</strong>';
      case 'assistant-com-evenementielle':
        return '<strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>InDesign</strong>, <strong>Canva</strong> et <strong>Premiere Pro</strong>';
      case 'createur-contenu':
        return '<strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>Affinity</strong>, et des bases de <strong>Premiere Pro</strong>, <strong>After Effects</strong> et <strong>DaVinci Resolve</strong>';
      default:
        return '<strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong> et <strong>Figma</strong>';
    }
  };

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

      {/* --- SÉLECTEUR --- */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">

          {/* Poste */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Poste visé</h2>
            <div className="flex flex-wrap gap-2">
              {postes.map((poste) => (
                <button
                  key={poste.id}
                  onClick={() => setSelectedPoste(poste)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPoste.id === poste.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {poste.label}
                </button>
              ))}
            </div>
            {selectedPoste.id === 'assistant-com-evenementielle' && (
              <div className="flex gap-2 mt-3">
                {['assistant', 'charge'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrefixeComEv(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      prefixeComEv === p ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'assistant' ? 'Assistant' : 'Chargé·e de'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Paragraphe libre */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Paragraphe personnalisé</h2>
            <textarea
              value={paragrapheLibre}
              onChange={(e) => setParagrapheLibre(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-y"
            />
          </div>

          {/* Destinataire */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Club destinataire</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {['club', 'ligue', 'association', 'fédération', 'organisme', 'structure'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeOrga(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    typeOrga === type ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {['le', 'la', 'les', 'du', 'de la', 'de l\'', 'de', 'l\''].map((art) => (
                <button
                  key={art}
                  onClick={() => setArticleClub(art)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    articleClub === art ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {art}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du club"
                value={club}
                onChange={(e) => setClub(e.target.value)}
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
            {(club || adresse) && (
              <div className="text-[12px] text-gray-700 mb-2">
                {club && <p className="font-medium">{club}</p>}
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
              {`Candidature pour une alternance de ${posteLabel} à partir de septembre 2026`}
            </span>
          </p>
        </div>

        {/* --- CORPS --- */}
        <div className="text-[12px] leading-[1.8] text-gray-800 text-justify space-y-5">

          <p>Madame, Monsieur,</p>

          <p>
            Actuellement étudiant en 2<sup>e</sup> année de BUT Métiers du Multimédia et de l'Internet,
            {' '}je suis à la recherche d'une alternance pour ma 3<sup>e</sup> année à partir de septembre 2026 en tant {/[aeiouyéèêëàâùûîïœæh]/i.test(posteLabel[0]) ? "qu'" : 'que '}{posteLabel}.
            {' '}Passionné de football depuis mon plus jeune âge, pouvoir mettre mes compétences multimédia
            au service {articleClub} {club || `votre ${typeOrga}`} est une ambition qui me tient particulièrement à cœur.
          </p>

          <p>
            Au cours de ma formation en BUT MMI, j'ai développé de solides compétences en{' '}
            {selectedPoste.domaine}, notamment à travers des projets concrets : création de visuels,
            montage vidéo, gestion de contenus pour les réseaux sociaux, et réalisation de courts-métrages. Je maîtrise{' '}
            <span dangerouslySetInnerHTML={{ __html: getOutils() }} /> et <strong>WordPress</strong>.
          </p>

          <p>{paragrapheLibre}</p>

          <p>
            Cette alternance représente pour moi l'opportunité
            idéale de conjuguer ma formation multimédia et ma passion pour le football au sein {articleClub}{' '}
            {club ? <strong>{club}</strong> : 'votre club'}, et d'y contribuer concrètement à
            travers des productions de qualité.
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
            <span>Rafael Piral  Candidature {posteLabel} {club ? club : '· Club de Football'}</span>
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