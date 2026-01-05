# Guide d'Accessibilité et SEO - Portfolio Rafael Piral

## 📋 Résumé des améliorations apportées

### ✅ Améliorations déjà implémentées

1. **Langue du site** : Changement de `lang="en"` à `lang="fr"` dans `index.html`
2. **SkipLink** : Création d'un composant `SkipLink.jsx` pour la navigation au clavier
3. **Sitemap.xml** : Mise à jour complète avec toutes les pages et images (6 projets + 4 pages)
4. **Robots.txt** : Déjà en place et bien configuré

---

## 🎯 Recommandations pour améliorer l'accessibilité (WCAG 2.1 AA)

### 1. Intégrer le composant SkipLink

Ajouter le composant SkipLink dans `Home.jsx` et `About.jsx` :

```jsx
import SkipLink from '../components/SkipLink';

// Dans le return, juste après l'ouverture de la div principale :
<div className="...">
  <SkipLink isDarkMode={isDarkMode} />
  {/* Reste du contenu */}
</div>
```

Puis ajouter l'ID `main-content` à la section principale :

```jsx
<main id="main-content">
  {/* Contenu principal */}
</main>
```

### 2. Améliorer les textes alternatifs des images

#### Images de projets
Remplacer les alt génériques par des descriptions détaillées dans `ProjectDetail.jsx` :

```jsx
// ❌ Mauvais
<img src={project.thumbnail} alt={project.title} />

// ✅ Bon
<img
  src={project.thumbnail}
  alt={`Aperçu du projet ${project.title} - ${project.category}`}
/>
```

#### Images décoratives
Pour les images purement décoratives, utiliser `alt=""` et `aria-hidden="true"` :

```jsx
<img src="/bullet.png" alt="" aria-hidden="true" />
```

### 3. Attributs ARIA pour les éléments interactifs

#### Boutons
```jsx
// Navigation
<button aria-label="Ouvrir le menu de navigation">
  <svg aria-hidden="true">...</svg>
</button>

// Dark mode toggle
<button
  aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
  aria-pressed={isDarkMode}
>
  {/* Icône */}
</button>

// Fermeture
<button aria-label="Fermer le menu">
  <svg aria-hidden="true">...</svg>
</button>
```

#### Liens externes
```jsx
<a
  href="https://github.com/rafaelpiral"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visiter mon profil GitHub (s'ouvre dans un nouvel onglet)"
>
  GitHub
</a>
```

### 4. Navigation au clavier

Assurer que tous les éléments interactifs sont accessibles au clavier :

```jsx
// Focus visible
<button className="focus:ring-2 focus:ring-beige focus:outline-none">
  {/* Contenu */}
</button>

// Ordre de tabulation logique : utiliser tabindex="0" pour les éléments personnalisés
```

### 5. Contrastes de couleurs (WCAG AA)

Vérifier les contrastes avec un outil comme [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) :

- **Texte normal** : ratio minimum de 4.5:1
- **Texte large (18pt+)** : ratio minimum de 3:1

Couleurs actuelles à vérifier :
- Beige (#E8DCC4) sur noir (#000000) ✅
- Gris clair sur beige (vérifier les opacités)

### 6. Balises sémantiques HTML

Structurer le HTML avec les bonnes balises :

```jsx
<header>Navigation</header>
<main id="main-content">
  <section aria-labelledby="projects-heading">
    <h2 id="projects-heading">Projets</h2>
    {/* Contenu */}
  </section>

  <section aria-labelledby="about-heading">
    <h2 id="about-heading">À propos</h2>
    {/* Contenu */}
  </section>
</main>
<footer>Pied de page</footer>
```

### 7. Formulaire de contact accessible

Dans `Home.jsx`, améliorer le formulaire :

```jsx
<form>
  <label htmlFor="name" className="sr-only">Nom</label>
  <input
    id="name"
    name="name"
    type="text"
    placeholder="Nom"
    aria-required="true"
    aria-invalid={errors.name ? "true" : "false"}
  />
  {errors.name && (
    <span role="alert" className="text-red-500">
      {errors.name}
    </span>
  )}
</form>
```

### 8. Animations respectueuses

Respecter la préférence `prefers-reduced-motion` :

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 Recommandations SEO

### 1. Méta-tags essentiels

Ajouter dans `Home.jsx` avec React Helmet :

```jsx
<Helmet>
  {/* Titre optimisé */}
  <title>Rafael Piral - Designer UI/UX & Développeur Web | Portfolio</title>

  {/* Description */}
  <meta
    name="description"
    content="Portfolio de Rafael Piral, étudiant en BUT MMI. Découvrez mes projets de design graphique, UI/UX et développement web. Disponible pour un stage à partir d'avril 2026."
  />

  {/* Mots-clés (optionnel mais utile) */}
  <meta
    name="keywords"
    content="design graphique, UI/UX, développement web, portfolio, étudiant BUT MMI, stage, Rafael Piral"
  />

  {/* Auteur */}
  <meta name="author" content="Rafael Piral" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://rafaelpiral.fr/" />
</Helmet>
```

### 2. Open Graph pour les réseaux sociaux

```jsx
<Helmet>
  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://rafaelpiral.fr/" />
  <meta property="og:title" content="Rafael Piral - Designer UI/UX & Développeur Web" />
  <meta property="og:description" content="Portfolio de Rafael Piral. Projets de design graphique, UI/UX et développement web." />
  <meta property="og:image" content="https://rafaelpiral.fr/og-image.jpg" />
  <meta property="og:locale" content="fr_FR" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://rafaelpiral.fr/" />
  <meta name="twitter:title" content="Rafael Piral - Designer UI/UX & Développeur Web" />
  <meta name="twitter:description" content="Portfolio de Rafael Piral. Projets de design graphique, UI/UX et développement web." />
  <meta name="twitter:image" content="https://rafaelpiral.fr/og-image.jpg" />
</Helmet>
```

**Action requise** : Créer une image OG (1200x630px) dans `/public/og-image.jpg`

### 3. Données structurées (JSON-LD)

Déjà en place dans `Home.jsx` ✅
- Schema.org Person
- Schema.org WebSite
- BreadcrumbList

À ajouter pour les projets dans `ProjectDetail.jsx` :

```jsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": project.title,
      "description": project.description,
      "image": `https://rafaelpiral.fr${project.thumbnail}`,
      "creator": {
        "@type": "Person",
        "name": "Rafael Piral"
      },
      "datePublished": project.year
    })}
  </script>
</Helmet>
```

### 4. Performance et Core Web Vitals

Optimisations à implémenter :

```jsx
// 1. Lazy loading des images
<img
  src={project.thumbnail}
  alt="..."
  loading="lazy"
  decoding="async"
/>

// 2. Pré-chargement des ressources critiques
<link rel="preload" href="/fonts/Satoshi-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

// 3. Préconnexion aux domaines externes
<link rel="preconnect" href="https://www.youtube.com" />
<link rel="dns-prefetch" href="https://www.youtube.com" />
```

### 5. URLs SEO-friendly

Les URLs sont déjà bonnes ✅ :
- `/` - Accueil
- `/about` - À propos
- `/cv` - CV
- `/project/1` - Projet 1
- `/legal` - Mentions légales

### 6. Balises de titre hiérarchiques

Assurer une hiérarchie logique :

```jsx
// Page d'accueil
<h1>Rafael Piral - Designer & Développeur</h1>
<h2>Projets</h2>
<h3>Nom du projet</h3>

// Page projet
<h1>{project.title}</h1>
<h2>Détails du projet</h2>
<h3>Technologies utilisées</h3>
```

**⚠️ Important** : Un seul `<h1>` par page !

### 7. Fichier manifest.json

Vérifier que `/public/manifest.json` est correct :

```json
{
  "short_name": "Rafael Piral",
  "name": "Rafael Piral - Portfolio",
  "description": "Portfolio de Rafael Piral - Designer UI/UX & Développeur Web",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#E8DCC4",
  "lang": "fr"
}
```

---

## 🔍 Outils de vérification

### Accessibilité
1. **WAVE** : https://wave.webaim.org/
2. **axe DevTools** : Extension Chrome/Firefox
3. **Lighthouse** : Dans Chrome DevTools (onglet Lighthouse)
4. **NVDA/JAWS** : Lecteurs d'écran pour tester

### SEO
1. **Google Search Console** : https://search.google.com/search-console
2. **Lighthouse** : Dans Chrome DevTools
3. **Google PageSpeed Insights** : https://pagespeed.web.dev/
4. **Schema Markup Validator** : https://validator.schema.org/

### Performance
1. **WebPageTest** : https://www.webpagetest.org/
2. **GTmetrix** : https://gtmetrix.com/
3. **Chrome DevTools Performance** : Onglet Performance

---

## 📊 Checklist finale

### Accessibilité
- [x] Langue du document (lang="fr")
- [x] SkipLink créé
- [ ] SkipLink intégré dans les pages
- [ ] Alt text descriptifs sur toutes les images
- [ ] Attributs ARIA sur les boutons
- [ ] Contrastes vérifiés (ratio 4.5:1 minimum)
- [ ] Navigation au clavier fonctionnelle
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Labels de formulaire associés
- [ ] Gestion de prefers-reduced-motion

### SEO
- [x] Sitemap.xml complet
- [x] Robots.txt configuré
- [ ] Méta-tags optimisés (title, description)
- [ ] Open Graph tags (og:image requis)
- [ ] Données structurées JSON-LD pour projets
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Performance > 90 sur Lighthouse
- [ ] Balises H1-H6 hiérarchiques
- [ ] URLs descriptives (déjà OK)
- [ ] Manifest.json mis à jour

### À faire manuellement
1. Créer l'image Open Graph (1200x630px) : `/public/og-image.jpg`
2. Soumettre le sitemap à Google Search Console
3. Configurer Google Analytics (optionnel)
4. Tester avec des lecteurs d'écran (NVDA, VoiceOver)
5. Vérifier les contrastes avec WebAIM Contrast Checker

---

## 📚 Ressources utiles

- **WCAG 2.1** : https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibilité** : https://developer.mozilla.org/fr/docs/Web/Accessibility
- **Google SEO Guide** : https://developers.google.com/search/docs
- **Schema.org** : https://schema.org/

---

**Date de création** : 5 janvier 2026
**Dernière mise à jour** : 5 janvier 2026
