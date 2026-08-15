import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import './i18n';
import './index.css';
import App from './App';

// Signatures des crawlers / bots de preview / outils d'automatisation
// (headless browsers, monitoring, scrapers) qui s'identifient honnêtement
// dans le user-agent ou via le flag navigator.webdriver.
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|slackbot|discordbot|telegrambot|whatsapp|twitterbot|linkedinbot|pinterest|embedly|quora link preview|outbrain|vkshare|headlesschrome|phantomjs|puppeteer|playwright|lighthouse|pagespeed|python-requests|curl|wget|scrapy|node-fetch|semrush|ahrefs|mj12bot|dotbot|petalbot/i;

function isLikelyBot() {
  if (typeof navigator === 'undefined') return false;
  if (navigator.webdriver) return true;
  return BOT_UA_PATTERN.test(navigator.userAgent || '');
}

// Par défaut ("auto"), le navigateur restaure la position de scroll précédente
// après un F5 — mais le Preloader fige <body> à la hauteur d'un viewport
// (position:fixed) pendant ~2s avant de révéler le vrai contenu (plusieurs
// milliers de px). La restauration du navigateur intervient pendant cette
// fenêtre, sur une hauteur de page encore fausse : dès que le Preloader
// libère <body>, la page "saute" à l'ancienne position. En passant en
// "manual", chaque chargement démarre proprement en haut de page.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HelmetProvider>
        <App />
        <Analytics beforeSend={(event) => (isLikelyBot() ? null : event)} />
      </HelmetProvider>
    </Suspense>
  </React.StrictMode>
);
