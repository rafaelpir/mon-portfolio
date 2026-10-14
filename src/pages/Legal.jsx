import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function Legal() {
  const { i18n } = useTranslation();
  const fr = !i18n.language?.startsWith('en');
  const L = (frText, enText) => (fr ? frText : enText);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  return (
    <div className={`font-stamp min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-beige' : 'bg-white text-black'
    }`}>
      <Helmet>
        <title>{L('Mentions Légales & Droits | Rafael Piral', 'Legal Notice & Rights | Rafael Piral')}</title>
        <meta name="description" content={L("Mentions légales, droits d'auteur et politique de confidentialité du portfolio de Rafael Piral.", "Legal notice, copyright and privacy policy of Rafael Piral's portfolio.")} />
        <html lang={L('fr', 'en')} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header simple */}
      <header className={`border-b px-4 md:px-8 py-6 ${
        isDarkMode ? 'border-beige/10' : 'border-black/10'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm tracking-widest hover:opacity-70 transition-opacity">
            ← {L("RETOUR À L'ACCUEIL", 'BACK TO HOME')}
          </Link>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDarkMode
                ? 'bg-beige/10 hover:bg-beige/20 text-beige'
                : 'bg-black/10 hover:bg-black/20 text-black'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Titre */}
        <h1 className="text-4xl md:text-6xl font-light mb-4">
          {L('MENTIONS LÉGALES', 'LEGAL NOTICE')}
        </h1>
        <p className={`text-sm tracking-widest mb-16 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {L('Dernière mise à jour', 'Last updated')} : {new Date().toLocaleDateString(L('fr-FR', 'en-GB'), { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Sections */}
        <div className="space-y-16">
          {/* 1. Éditeur du site */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              {L('ÉDITEUR DU SITE', 'SITE PUBLISHER')}
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>{L('Nom', 'Name')} :</strong> Rafael Piral</p>
              <p><strong>{L('Statut', 'Status')} :</strong> {L("Étudiant en BUT MMI (Métiers du Multimédia et de l'Internet)", 'Student in BUT MMI (multimedia and internet professions)')}</p>
              <p><strong>Email :</strong> <a href="mailto:rafa2002@hotmail.fr" className="underline hover:opacity-70">rafa2002@hotmail.fr</a></p>
              <p><strong>{L('Localisation', 'Location')} :</strong> Le Pré Saint Gervais, France</p>
            </div>
          </section>

          {/* 2. Hébergement */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              {L('HÉBERGEMENT', 'HOSTING')}
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>{L('Hébergeur', 'Host')} :</strong> Vercel Inc.</p>
              <p><strong>{L('Adresse', 'Address')} :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p><strong>{L('Site web', 'Website')} :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">vercel.com</a></p>
            </div>
          </section>

          {/* 3. Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              {L('PROPRIÉTÉ INTELLECTUELLE', 'INTELLECTUAL PROPERTY')}
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                {L("L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, design) est la propriété exclusive de Rafael Piral, sauf mention contraire.", 'All content on this site (text, images, videos, logos, graphics, design) is the exclusive property of Rafael Piral, unless stated otherwise.')}
              </p>
              <p>
                {L("Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord écrit préalable de Rafael Piral.", 'Any reproduction, distribution, modification, adaptation, retransmission or publication of these elements is strictly prohibited without the prior written consent of Rafael Piral.')}
              </p>
              <p>
                <strong>© {new Date().getFullYear()} Rafael Piral. {L('Tous droits réservés.', 'All rights reserved.')}</strong>
              </p>
            </div>
          </section>

          {/* 4. Données personnelles */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              {L('PROTECTION DES DONNÉES', 'DATA PROTECTION')}
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <h3 className="text-xl font-light">{L('Collecte des données', 'Data collection')}</h3>
              <p>
                {L("Ce site ne collecte aucune donnée personnelle à l'exception des informations que vous choisissez de partager volontairement via le formulaire de contact.", 'This site collects no personal data apart from the information you choose to share through the contact form.')}
              </p>

              <h3 className="text-xl font-light mt-6">{L('Utilisation des données', 'Use of data')}</h3>
              <p>
                {L('Les informations collectées via le formulaire de contact sont uniquement utilisées pour répondre à vos demandes et ne sont jamais partagées avec des tiers.', 'Information sent through the contact form is only used to reply to your requests and is never shared with third parties.')}
              </p>

              <h3 className="text-xl font-light mt-6">Cookies</h3>
              <p>
                {L("Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement (stockage des préférences de thème). Aucun cookie de tracking ou publicitaire n'est utilisé.", 'This site only uses technical cookies needed for it to work (storing your theme preference). No tracking or advertising cookies are used.')}
              </p>

              <h3 className="text-xl font-light mt-6">{L('Vos droits', 'Your rights')}</h3>
              <p>
                {L("Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-moi à l'adresse :", 'Under the GDPR, you have the right to access, correct and delete your personal data. To exercise these rights, contact me at:')} <a href="mailto:rafa2002@hotmail.fr" className="underline hover:opacity-70">rafa2002@hotmail.fr</a>
              </p>
            </div>
          </section>

          {/* 5. Crédits */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              {L('CRÉDITS & TECHNOLOGIES', 'CREDITS & TECHNOLOGIES')}
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>{L('Design & Développement', 'Design & Development')} :</strong> Rafael Piral</p>
              <p><strong>{L('Technologies utilisées', 'Technologies used')} :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>React.js - {L('Bibliothèque JavaScript', 'JavaScript library')}</li>
                <li>Framer Motion - Animations</li>
                <li>Tailwind CSS - Framework CSS</li>
                <li>Vite - Build tool</li>
                <li>Vercel - {L('Hébergement & Déploiement', 'Hosting & Deployment')}</li>
              </ul>
              <p className="mt-6"><strong>{L('Police de caractères', 'Typeface')} :</strong> Satoshi ({L('par', 'by')} Indian Type Foundry)</p>
            </div>
          </section>

          {/* 6. Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              {L('LIMITATION DE RESPONSABILITÉ', 'LIMITATION OF LIABILITY')}
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                {L("Rafael Piral s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, il ne peut être tenu responsable des erreurs, omissions ou résultats obtenus suite à une mauvaise utilisation des informations.", 'Rafael Piral strives to keep the information on this site accurate and up to date. However, he cannot be held responsible for errors, omissions or results arising from misuse of the information.')}
              </p>
              <p>
                {L("Les liens hypertextes présents sur ce site peuvent renvoyer vers d'autres sites. Rafael Piral ne saurait être tenu responsable du contenu de ces sites externes.", 'Links on this site may lead to other websites. Rafael Piral cannot be held responsible for the content of those external sites.')}
              </p>
            </div>
          </section>

          {/* 7. Contact */}
          <section className={`border-t pt-8 ${
            isDarkMode ? 'border-beige/10' : 'border-black/10'
          }`}>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              CONTACT
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                {L("Pour toute question concernant ces mentions légales ou l'utilisation du site, vous pouvez me contacter :", 'For any question about this legal notice or the use of the site, you can contact me:')}
              </p>
              <p><strong>Email :</strong> <a href="mailto:rafa2002@hotmail.fr" className="underline hover:opacity-70">rafa2002@hotmail.fr</a></p>
              <p><strong>LinkedIn :</strong> <a href="https://linkedin.com/in/rafaelpiral" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">linkedin.com/in/rafaelpiral</a></p>
            </div>
          </section>
        </div>

        {/* Bouton retour */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className={`inline-block px-8 py-4 text-sm tracking-widest border transition-all duration-300 ${
              isDarkMode
                ? 'border-beige hover:bg-beige hover:text-black'
                : 'border-black hover:bg-black hover:text-white'
            }`}
          >
            {L("RETOUR À L'ACCUEIL", 'BACK TO HOME')}
          </Link>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className={`border-t px-4 md:px-8 py-8 text-center text-sm ${
        isDarkMode ? 'border-beige/10 text-gray-500' : 'border-black/10 text-gray-500'
      }`}>
        <p>© {new Date().getFullYear()} Rafael Piral. {L('Tous droits réservés.', 'All rights reserved.')}</p>
      </footer>
    </div>
  );
}
