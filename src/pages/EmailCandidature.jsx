import { useState } from 'react';
import CVNavigation from '../components/CVNavigation';
import LetterBackground from '../components/LetterBackground';

const metiers = [
  { id: 'graphiste', label: 'Graphiste' },
  { id: 'motion-designer', label: 'Motion Designer' },
  { id: 'monteur-video', label: 'Monteur Vidéo' },
  { id: 'directeur-artistique', label: 'Directeur Artistique' },
  { id: 'ux-ui-designer', label: 'UX/UI Designer' },
  { id: 'videaste', label: 'Vidéaste' },
  { id: 'infographiste', label: 'Infographiste' },
  { id: 'webdesigner', label: 'Webdesigner' },
  { id: 'chef-de-projet', label: 'Chef de Projet Multimédia' },
  { id: 'charge-de-communication', label: 'Chargé de Communication' },
  { id: 'assistant-communication', label: 'Assistant Communication' },
  { id: 'community-manager', label: 'Community Manager' },
  { id: 'social-media-design', label: 'Social Media & Design Graphique' },
  { id: 'communication-social-media-assistant', label: 'Communication & Social Media Assistant' },
  { id: 'assistant-com-evenementielle', label: 'Assistant Communication-Événementiel H/F' },
];

export default function EmailCandidature() {
  const [selectedMetier, setSelectedMetier] = useState(metiers[0]);
  const [prefixeComEv, setPrefixeComEv] = useState('assistant');
  const [copied, setCopied] = useState(false);
  const [copiedPUC, setCopiedPUC] = useState(false);

  const metierLabel = selectedMetier.id === 'assistant-com-evenementielle'
    ? (prefixeComEv === 'assistant' ? 'assistant communication-événementiel' : 'chargé·e de communication-événementielle')
    : selectedMetier.label.toLowerCase();

  const elision = /[aeiouyéèêëàâùûîïœæh]/i.test(metierLabel[0]) ? "qu'" : 'que ';

  const emailText = `Madame, Monsieur,\n\nActuellement étudiant en 3e année de BUT Métiers du Multimédia et de l'Internet, je suis à la recherche d'une alternance en tant ${elision}${metierLabel} à partir de septembre 2026.\n\nVous trouverez ci-joint mon CV ainsi que ma lettre de motivation. Je vous invite également à consulter mon portfolio : rafaelpiral.fr\n\nJe reste à votre disposition pour un entretien.\nCordialement,\n\nRafael Piral\n07.69.67.04.07\nrafa2002@hotmail.fr\nhttps://www.rafaelpiral.fr/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <LetterBackground>
      <CVNavigation />

      <div className="max-w-2xl mx-auto space-y-6 px-4">

        {/* Sélecteur */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Poste visé</h2>
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
          {selectedMetier.id === 'assistant-com-evenementielle' && (
            <div className="flex gap-2">
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

        {/* Email PUC */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Email · Paris Université Club</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Madame Pouymayou,\n\nActuellement étudiant en 3e année de BUT Métiers du Multimédia et de l'Internet, je me permets de vous adresser ma candidature pour le poste de Community Manager au sein du Paris Université Club.\n\nVous trouverez ci-joint mon CV ainsi que ma lettre de motivation. Je vous invite également à consulter mon portfolio : rafaelpiral.fr\n\nJe reste à votre disposition pour un entretien.\nCordialement,\n\nRafael Piral\n07.69.67.04.07\nrafa2002@hotmail.fr\nhttps://www.rafaelpiral.fr/`);
                setCopiedPUC(true);
                setTimeout(() => setCopiedPUC(false), 2000);
              }}
              className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                copiedPUC ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {copiedPUC ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="text-sm text-gray-800 bg-gray-50 rounded-lg p-5 space-y-4 leading-relaxed">
            <p>Madame Pouymayou,</p>
            <p>Actuellement étudiant en 2<sup>e</sup> année de BUT Métiers du Multimédia et de l'Internet, je suis à la recherche d'une alternance pour ma 3<sup>e</sup> année et me permets de vous adresser ma candidature pour le poste de Community Manager au sein du Paris Université Club.</p>
            <p>Vous trouverez ci-joint mon CV ainsi que ma lettre de motivation. Je vous invite également à consulter mon portfolio : rafaelpiral.fr</p>
            <p>Je reste à votre disposition pour un entretien.<br />Cordialement,</p>
            <p>
              Rafael Piral<br />
              07.69.67.04.07<br />
              rafa2002@hotmail.fr<br />
              https://www.rafaelpiral.fr/
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Email de candidature</h2>
            <button
              onClick={handleCopy}
              className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                copied ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="text-sm text-gray-800 bg-gray-50 rounded-lg p-5 space-y-4 leading-relaxed">
            <p>Madame, Monsieur,</p>
            <p>
              Actuellement étudiant en 2<sup>e</sup> année de BUT Métiers du Multimédia et de l'Internet,
              {' '}je suis à la recherche d'une alternance pour ma 3<sup>e</sup> année en tant{' '}
              {elision}{metierLabel} à partir de septembre 2026.
            </p>
            <p>Vous trouverez ci-joint mon CV ainsi que ma lettre de motivation. Je vous invite également à consulter mon portfolio : rafaelpiral.fr</p>
            <p>Je reste à votre disposition pour un entretien.<br />Cordialement,</p>
            <p>
              Rafael Piral<br />
              07.69.67.04.07<br />
              rafa2002@hotmail.fr<br />
              https://www.rafaelpiral.fr/
            </p>
          </div>
        </div>

      </div>
    </LetterBackground>
  );
}