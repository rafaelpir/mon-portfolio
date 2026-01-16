import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Legal() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  return (
    <div className={`font-stamp min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-beige' : 'bg-white text-black'
    }`}>
      <Helmet>
        <title>Mentions Légales & Droits | Rafael Piral</title>
        <meta name="description" content="Mentions légales, droits d'auteur et politique de confidentialité du portfolio de Rafael Piral." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header simple */}
      <header className={`border-b px-4 md:px-8 py-6 ${
        isDarkMode ? 'border-beige/10' : 'border-black/10'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm tracking-widest hover:opacity-70 transition-opacity">
            ← RETOUR À L'ACCUEIL
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
          MENTIONS LÉGALES
        </h1>
        <p className={`text-sm tracking-widest mb-16 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Sections */}
        <div className="space-y-16">
          {/* 1. Éditeur du site */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              ÉDITEUR DU SITE
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>Nom :</strong> Rafael Piral</p>
              <p><strong>Statut :</strong> Étudiant en BUT MMI (Métiers du Multimédia et de l'Internet)</p>
              <p><strong>Email :</strong> <a href="mailto:rafa2002@hotmail.fr" className="underline hover:opacity-70">rafa2002@hotmail.fr</a></p>
              <p><strong>Localisation :</strong> Le Pré Saint Gervais, France</p>
            </div>
          </section>

          {/* 2. Hébergement */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              HÉBERGEMENT
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">vercel.com</a></p>
            </div>
          </section>

          {/* 3. Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              PROPRIÉTÉ INTELLECTUELLE
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, design) est la propriété exclusive de Rafael Piral, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord écrit préalable de Rafael Piral.
              </p>
              <p>
                <strong>© {new Date().getFullYear()} Rafael Piral. Tous droits réservés.</strong>
              </p>
            </div>
          </section>

          {/* 4. Données personnelles */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              PROTECTION DES DONNÉES
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <h3 className="text-xl font-light">Collecte des données</h3>
              <p>
                Ce site ne collecte aucune donnée personnelle à l'exception des informations que vous choisissez de partager volontairement via le formulaire de contact.
              </p>

              <h3 className="text-xl font-light mt-6">Utilisation des données</h3>
              <p>
                Les informations collectées via le formulaire de contact sont uniquement utilisées pour répondre à vos demandes et ne sont jamais partagées avec des tiers.
              </p>

              <h3 className="text-xl font-light mt-6">Cookies</h3>
              <p>
                Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement (stockage des préférences de thème). Aucun cookie de tracking ou publicitaire n'est utilisé.
              </p>

              <h3 className="text-xl font-light mt-6">Vos droits</h3>
              <p>
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-moi à l'adresse : <a href="mailto:rafa2002@hotmail.fr" className="underline hover:opacity-70">rafa2002@hotmail.fr</a>
              </p>
            </div>
          </section>

          {/* 5. Crédits */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              CRÉDITS & TECHNOLOGIES
            </h2>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>Design & Développement :</strong> Rafael Piral</p>
              <p><strong>Technologies utilisées :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>React.js - Bibliothèque JavaScript</li>
                <li>Framer Motion - Animations</li>
                <li>Tailwind CSS - Framework CSS</li>
                <li>Vite - Build tool</li>
                <li>Vercel - Hébergement & Déploiement</li>
              </ul>
              <p className="mt-6"><strong>Police de caractères :</strong> Satoshi (par Indian Type Foundry)</p>
            </div>
          </section>

          {/* 6. Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              LIMITATION DE RESPONSABILITÉ
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                Rafael Piral s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, il ne peut être tenu responsable des erreurs, omissions ou résultats obtenus suite à une mauvaise utilisation des informations.
              </p>
              <p>
                Les liens hypertextes présents sur ce site peuvent renvoyer vers d'autres sites. Rafael Piral ne saurait être tenu responsable du contenu de ces sites externes.
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
                Pour toute question concernant ces mentions légales ou l'utilisation du site, vous pouvez me contacter :
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
            RETOUR À L'ACCUEIL
          </Link>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className={`border-t px-4 md:px-8 py-8 text-center text-sm ${
        isDarkMode ? 'border-beige/10 text-gray-500' : 'border-black/10 text-gray-500'
      }`}>
        <p>© {new Date().getFullYear()} Rafael Piral. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
