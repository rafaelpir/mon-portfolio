# Guide : Générer l'audit Lighthouse pour le portfolio

## 📊 Pourquoi faire cet audit ?

La grille d'évaluation BUT2 exige un **PDF d'audit de votre site** pour vérifier :
- ✅ **Accessibilité** (pour les handicaps - WCAG 2.1)
- ✅ **Respect des normes** (HTML valide, bonnes pratiques)
- ✅ **SEO** (référencement naturel)
- ✅ **Performance** (vitesse de chargement)

**⚠️ Ce PDF est OBLIGATOIRE** : à déposer dans Teams AVANT la soutenance (26-27 janvier).

---

## 🚀 Méthode 1 : Google Lighthouse (Recommandée)

### Étape 1 : Ouvrir votre site en local

```bash
# Dans le terminal, lancer le serveur de prévisualisation
npm run preview
```

Le serveur démarre sur : `http://localhost:4173`

### Étape 2 : Ouvrir Chrome DevTools

1. Ouvrir Google Chrome
2. Aller sur `http://localhost:4173`
3. Appuyer sur `F12` (ou `Cmd+Option+I` sur Mac) pour ouvrir DevTools
4. Cliquer sur l'onglet **"Lighthouse"**

> ⚠️ Si vous ne voyez pas l'onglet Lighthouse, cliquez sur les `>>` à droite des onglets DevTools

### Étape 3 : Configurer l'audit

Cocher les catégories suivantes :
- ✅ **Performance**
- ✅ **Accessibility** (Accessibilité)
- ✅ **Best Practices** (Bonnes pratiques)
- ✅ **SEO**

Mode : **Desktop** (ordinateur)

### Étape 4 : Lancer l'audit

1. Cliquer sur **"Analyze page load"**
2. Attendre 30 secondes à 1 minute
3. Les résultats s'affichent avec un score sur 100 pour chaque catégorie

### Étape 5 : Télécharger le PDF

1. Cliquer sur l'icône **⚙️ (Settings)** en haut à droite du rapport Lighthouse
2. Sélectionner **"Save as PDF"** (ou clic droit > Imprimer > Enregistrer en PDF)
3. Nommer le fichier : `audit-lighthouse-portfolio-rafael-piral.pdf`
4. Sauvegarder le fichier

### Étape 6 : Déposer sur Teams

Téléverser le PDF dans votre dossier de rendu Teams **AVANT la soutenance**.

---

## 🚀 Méthode 2 : PageSpeed Insights (Alternative en ligne)

> ⚠️ Cette méthode ne fonctionne QUE si votre site est déjà déployé en ligne.

1. Aller sur : [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
2. Entrer l'URL de votre portfolio déployé (ex: `https://rafaelpiral.fr`)
3. Cliquer sur **"Analyser"**
4. Attendre les résultats
5. Prendre une capture d'écran complète OU utiliser l'impression PDF du navigateur

---

## 🚀 Méthode 3 : Extension Lighthouse Chrome

1. Installer l'extension : [Lighthouse Chrome Extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
2. Ouvrir votre site en local (`npm run preview` puis `localhost:4173`)
3. Cliquer sur l'icône Lighthouse dans la barre d'extensions
4. Choisir "Desktop" et cliquer "Generate report"
5. Exporter le PDF

---

## ✅ Objectifs de score

Pour valider la grille d'évaluation, viser :

| Catégorie | Score minimum | Bon score |
|-----------|--------------|-----------|
| **Performance** | 70+ | 90+ |
| **Accessibility** | 90+ | 95+ |
| **Best Practices** | 90+ | 95+ |
| **SEO** | 90+ | 95+ |

---

## 🔧 Si vos scores sont faibles

### Performance < 70

**Problèmes courants :**
- Images trop lourdes (> 500KB)
- Trop de JavaScript chargé

**Solutions :**
- Compresser toutes les images avec [TinyPNG](https://tinypng.com/)
- Utiliser le format WebP au lieu de JPG/PNG
- Lazy loading : `<img loading="lazy" />`

### Accessibility < 90

**Problèmes courants :**
- Boutons sans `aria-label`
- Mauvais contraste de couleurs
- Images sans attribut `alt`

**Solutions :**
- Ajouter `aria-label` sur tous les boutons icônes
- Vérifier les contrastes avec [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Ajouter des `alt` descriptifs sur toutes les images

### SEO < 90

**Problèmes courants :**
- Meta description manquante
- Titres (h1, h2) mal structurés
- Liens sans texte descriptif

**Solutions :**
- Vérifier que tous les meta tags sont présents (voir [SEO_GUIDE.md](SEO_GUIDE.md))
- Respecter la hiérarchie des titres (h1 → h2 → h3)
- Éviter les "Cliquez ici" dans les liens

---

## 📋 Checklist avant audit

- [ ] Build réussi (`npm run build`)
- [ ] Site lancé en preview (`npm run preview`)
- [ ] Chrome DevTools ouvert (F12)
- [ ] Onglet Lighthouse trouvé
- [ ] Les 4 catégories cochées (Performance, Accessibility, Best Practices, SEO)
- [ ] Mode "Desktop" sélectionné
- [ ] Audit lancé et terminé
- [ ] PDF téléchargé
- [ ] PDF nommé correctement
- [ ] PDF déposé sur Teams

---

## 🆘 Problèmes courants

**"Je ne vois pas l'onglet Lighthouse"**
- Vérifier que vous utilisez Google Chrome (pas Firefox/Safari)
- Cliquer sur les `>>` à droite des onglets DevTools
- Mettre à jour Chrome si nécessaire

**"L'audit échoue ou tourne en boucle"**
- Fermer tous les autres onglets Chrome
- Désactiver les extensions de navigateur temporairement
- Relancer Chrome en mode navigation privée

**"Mes scores sont très faibles"**
- C'est normal en local (pas de HTTPS, pas de CDN)
- L'important est de montrer que vous avez fait attention à l'accessibilité, au SEO et aux bonnes pratiques
- Les scores seront meilleurs une fois déployé en production

---

## 📝 Exemple de rapport à joindre

Le PDF Lighthouse contient :
- ✅ Scores des 4 catégories
- ✅ Liste des problèmes détectés
- ✅ Recommandations d'amélioration
- ✅ Métadonnées (URL testée, date, appareil)

**Format attendu** : 1 seul fichier PDF, 3-10 pages, lisible.

---

**Date de création :** 7 janvier 2026  
**Deadline audit :** AVANT soutenance (26-27 janvier)  
**Statut :** ⏳ En attente de génération
