import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import './i18n';
import './index.css';
import App from './App';
import { startAnimatedFavicon } from './utils/animatedFavicon';

// Signatures des crawlers / bots de preview / outils d'automatisation
// (headless browsers, monitoring, scrapers) qui s'identifient honnêtement
// dans le user-agent ou via le flag navigator.webdriver.
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|slackbot|discordbot|telegrambot|whatsapp|twitterbot|linkedinbot|pinterest|embedly|quora link preview|outbrain|vkshare|headlesschrome|phantomjs|puppeteer|playwright|lighthouse|pagespeed|python-requests|curl|wget|scrapy|node-fetch|semrush|ahrefs|mj12bot|dotbot|petalbot/i;

function isLikelyBot() {
  if (typeof navigator === 'undefined') return false;
  if (navigator.webdriver) return true;
  return BOT_UA_PATTERN.test(navigator.userAgent || '');
}

// "manual" plutôt que la restauration native ("auto") : le contenu de la
// Home monte en plusieurs temps (sections lazy, animations GSAP qui posent
// leurs positions après coup), donc la hauteur de page n'est pas stable au
// moment où le navigateur voudrait restaurer l'ancien scroll — ça provoque
// un "saut". En "manual", chaque chargement démarre proprement en haut, et
// la navigation entre routes gère elle-même le scroll (voir App.jsx).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

startAnimatedFavicon();

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
