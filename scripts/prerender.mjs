// Après `vite build` : une page de départ par adresse (dist/<route>/index.html).
// Le site se construit dans le navigateur ; sans ce passage, Google, Instagram,
// WhatsApp ou LinkedIn ne lisent qu'une page vide au titre générique. Chaque
// page reçoit ici son titre, sa description, son image d'aperçu et un texte
// lisible sans JavaScript. Les balises portent data-rh : react-helmet-async
// les remplace au chargement, sans doublon.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { projects } from '../src/data/projects.js';
import { MUSEE_EXHIBITS } from '../src/data/museeExhibits.js';

const require = createRequire(import.meta.url);
const frProjects = require('../src/i18n/locales/fr/projects.json');
const seo = require('../src/i18n/locales/fr/seo.json');

const SITE = 'https://www.rafaelpiral.fr';
const template = readFileSync('dist/index.html', 'utf8');

const esc = (text = '') =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cut = (text = '', max = 155) => {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  return `${slice.slice(0, slice.lastIndexOf(' '))}…`;
};

// Liens communs à toutes les pages, pour que chaque page mène aux autres
const projectLinks = projects
  .map((project) => `<li><a href="/work/${project.slug}">${esc(frProjects.items[project.id]?.title || project.title)}</a></li>`)
  .join('');
const footer = `<h2>Projets</h2><ul>${projectLinks}</ul>
        <p><a href="/">Accueil</a> | <a href="/musee">Musée d'affiches en 3D</a> | <a href="/about">À propos</a> | <a href="/legal">Mentions légales</a></p>
        <p>Instagram : <a href="https://www.instagram.com/rafa31z/" rel="me">@rafa31z</a> | <a href="https://www.linkedin.com/in/rafaelpiral" rel="me">LinkedIn</a></p>`;

function page({ path, title, description, image, imageAlt, type = 'website', jsonLd, body }) {
  const url = `${SITE}${path === '/' ? '' : path}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(description)}" />`,
    `<link data-rh="true" rel="canonical" href="${url}" />`,
    `<meta data-rh="true" property="og:type" content="${type}" />`,
    `<meta data-rh="true" property="og:url" content="${url}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(title)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(description)}" />`,
    `<meta data-rh="true" property="og:image" content="${image}" />`,
    `<meta data-rh="true" property="og:image:width" content="1200" />`,
    `<meta data-rh="true" property="og:image:height" content="630" />`,
    `<meta data-rh="true" property="og:image:alt" content="${esc(imageAlt || title)}" />`,
    `<meta data-rh="true" property="og:locale" content="fr_FR" />`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(title)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${image}" />`,
    jsonLd && `<script data-rh="true" type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');

  let html = template.replace(/<title>[\s\S]*?<\/title>/, head);
  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>
      <div style="font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto;">
        ${body}
        ${footer}
      </div>
    </noscript>`
  );
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
  mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  writeFileSync(file, html);
  return path;
}

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rafael Piral',
  url: SITE,
  jobTitle: 'Graphiste',
  sameAs: ['https://www.instagram.com/rafa31z/', 'https://www.linkedin.com/in/rafaelpiral'],
};

const written = [];

written.push(page({
  path: '/',
  title: seo.home.title,
  description: seo.home.description,
  image: `${SITE}/og-image.jpg`,
  jsonLd: person,
  body: `<h1>Rafael Piral, graphiste</h1>
        <p>${esc(seo.home.description)}</p>
        <h2>Services</h2>
        <ul><li>Affiche</li><li>Identité visuelle</li><li>Site &amp; application</li><li>Vidéo &amp; motion</li></ul>`,
}));

written.push(page({
  path: '/about',
  title: seo.about.title,
  description: seo.about.description,
  image: `${SITE}/og-image.jpg`,
  jsonLd: person,
  body: `<h1>À propos de Rafael Piral</h1><p>${esc(seo.about.description)}</p>`,
}));

written.push(page({
  path: '/legal',
  title: seo.legal.title,
  description: seo.legal.description,
  image: `${SITE}/og-image.jpg`,
  body: `<h1>Mentions légales</h1><p>${esc(seo.legal.description)}</p>`,
}));

const museumDescription = `Visitez le musée virtuel de Rafael Piral : une salle parisienne en 3D où se promener parmi ${MUSEE_EXHIBITS.length} affiches (cinéma, musique, sport), avec vue sur les toits de Paris et playlist à écouter.`;
written.push(page({
  path: '/musee',
  title: "Musée d'affiches en 3D | Rafael Piral, graphiste",
  description: museumDescription,
  image: `${SITE}/images/musee/og-musee.jpg`,
  imageAlt: 'Salle du musée en 3D : affiches de Rafael Piral accrochées aux murs, sous une verrière',
  jsonLd: { '@context': 'https://schema.org', '@type': 'ExhibitionEvent', name: "Musée d'affiches de Rafael Piral", url: `${SITE}/musee`, organizer: person },
  body: `<h1>Musée d'affiches en 3D</h1><p>${esc(museumDescription)}</p>`,
}));

for (const project of projects) {
  const copy = { ...project, ...(frProjects.items[project.id] || {}) };
  const description = cut(copy.description) || `${copy.title}, ${copy.category}, ${project.year}. Un projet de Rafael Piral.`;
  written.push(page({
    path: `/work/${project.slug}`,
    title: `${copy.title} · Rafael Piral`,
    description,
    image: `${SITE}/og/${project.slug}.jpg`,
    imageAlt: `${copy.title}, ${copy.category}, Rafael Piral`,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: copy.title,
      url: `${SITE}/work/${project.slug}`,
      image: `${SITE}/og/${project.slug}.jpg`,
      dateCreated: String(project.year),
      creator: person,
      description,
    },
    body: `<h1>${esc(copy.title)}</h1>
        <p>${esc(copy.category)} · ${esc(project.year)}${copy.context ? ` · ${esc(copy.context)}` : ''}</p>
        <p>${esc(copy.description)}</p>`,
  }));
}

console.log(`Pages de départ : ${written.length} (${written.join(', ')})`);
