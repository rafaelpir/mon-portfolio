# Guide SEO - Portfolio Rafael Piral

## ✅ Meta Tags Installés

### Ce qui a été ajouté :

1. **Meta Tags Essentiels** dans [src/pages/Home.jsx](src/pages/Home.jsx:104-131)
   - Title SEO optimisé
   - Description du site
   - Mots-clés pertinents
   - Auteur et langue

2. **Open Graph Tags** (Facebook, LinkedIn)
   - Titre et description pour partages sociaux
   - Image de prévisualisation
   - URL canonique
   - Locale française

3. **Twitter Card Tags**
   - Format carte avec grande image
   - Métadonnées optimisées pour Twitter

4. **Fichiers SEO**
   - [public/robots.txt](public/robots.txt) - Configuration crawl bots
   - [public/sitemap.xml](public/sitemap.xml) - Plan du site pour Google

---

## ⚠️ À FAIRE AVANT LE DÉPLOIEMENT

### 1. Remplacer l'URL dans les Meta Tags

Actuellement, l'URL est définie comme `https://rafaelpiral.fr/`

**Mettre à jour dans [src/pages/Home.jsx](src/pages/Home.jsx) :**
- Ligne 114 : `<meta property="og:url" content="VOTRE_URL_ICI" />`
- Ligne 122 : `<meta name="twitter:url" content="VOTRE_URL_ICI" />`
- Ligne 130 : `<link rel="canonical" href="VOTRE_URL_ICI" />`

**Mettre à jour dans [public/sitemap.xml](public/sitemap.xml) :**
- Remplacer toutes les occurrences de `https://rafaelpiral.fr/` par votre vraie URL

**Mettre à jour dans [public/robots.txt](public/robots.txt) :**
- Ligne 8 : `Sitemap: VOTRE_URL_ICI/sitemap.xml`

---

### 2. Créer des Images pour Réseaux Sociaux

Vous devez créer deux images pour les partages :

**Image Open Graph** (`og-image.jpg`) :
- Dimensions : 1200x630px
- Format : JPG ou PNG
- Emplacement : `/public/og-image.jpg`
- Contenu suggéré : Votre nom + "Portfolio" + design minimaliste

**Image Twitter** (`twitter-image.jpg`) :
- Dimensions : 1200x600px
- Format : JPG ou PNG
- Emplacement : `/public/twitter-image.jpg`
- Même design que og-image

**Outils pour créer les images :**
- [Canva](https://canva.com) - Gratuit, templates disponibles
- Figma - Design personnalisé
- Photoshop/GIMP

---

## 🚀 Après le Déploiement

### 1. Google Search Console
1. Aller sur [Google Search Console](https://search.google.com/search-console)
2. Ajouter votre site
3. Vérifier la propriété (via meta tag ou DNS)
4. Soumettre votre sitemap : `https://votre-url.com/sitemap.xml`

### 2. Google Analytics (Optionnel)
1. Créer un compte sur [Google Analytics](https://analytics.google.com)
2. Ajouter le tracking code dans `public/index.html`
3. Suivre le trafic et le comportement des visiteurs

### 3. Tester le SEO
**Outils gratuits :**
- [Google PageSpeed Insights](https://pagespeed.web.dev/) - Performance
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Données structurées
- [Meta Tags Debugger](https://metatags.io/) - Vérifier Open Graph
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Tester partage Twitter

---

## 📊 Vérifier les Meta Tags

### Avant déploiement (Local)
```bash
npm run build
npm run preview
```

Puis dans le navigateur :
1. Ouvrir DevTools (F12)
2. Onglet "Elements"
3. Chercher `<head>`
4. Vérifier que tous les meta tags sont présents

### Après déploiement
1. Tester avec [Meta Tags](https://metatags.io/)
2. Entrer votre URL
3. Vérifier l'aperçu Google, Facebook, Twitter

---

## 🎯 Optimisations Futures (Optionnel)

### Pour Améliorer Encore le SEO :

#### 1. Pre-rendering avec react-snap
```bash
npm install --save-dev react-snap

# Ajouter dans package.json
"scripts": {
  "postbuild": "react-snap"
}
```

#### 2. Données Structurées (Schema.org)
Ajouter un script JSON-LD dans le `<head>` :
```jsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Rafael Piral",
      "jobTitle": "Étudiant Développeur Web",
      "url": "https://rafaelpiral.fr",
      "sameAs": [
        "https://linkedin.com/in/rafaelpiral",
        "https://github.com/rafaelpir"
      ]
    })}
  </script>
</Helmet>
```

#### 3. Compression d'Images
- Optimiser toutes les images avant upload
- Utiliser WebP au lieu de JPG/PNG
- Lazy loading avec `loading="lazy"`

#### 4. Performance
- Minifier CSS/JS (déjà fait par Vite)
- Utiliser CDN (Vercel/Netlify le font automatiquement)
- Activer la compression Gzip/Brotli

---

## 📝 Checklist Finale

Avant de déployer :
- [ ] Remplacer `https://rafaelpiral.fr/` par votre vraie URL
- [ ] Créer `og-image.jpg` (1200x630px)
- [ ] Créer `twitter-image.jpg` (1200x600px)
- [ ] Tester en local (`npm run build && npm run preview`)
- [ ] Vérifier meta tags dans DevTools

Après déploiement :
- [ ] Tester avec [Meta Tags](https://metatags.io/)
- [ ] Soumettre sitemap à Google Search Console
- [ ] Tester performance avec PageSpeed Insights
- [ ] Vérifier l'indexation Google (rechercher `site:votre-url.com`)

---

## 🆘 Besoin d'Aide ?

Si vous avez des questions :
1. Vérifier ce guide en premier
2. Tester les outils mentionnés
3. Google "[votre problème] SEO React"

**Ressources utiles :**
- [Guide SEO Google](https://developers.google.com/search/docs)
- [Documentation React Helmet](https://github.com/staylor/react-helmet-async)
- [Vercel SEO Guide](https://vercel.com/docs/concepts/seo)

---

**Date de configuration :** 21 décembre 2025
**Version :** 1.0
**Statut :** ✅ Meta tags configurés, prêt pour déploiement
