# 🖼️ Image Open Graph - Guide de création

**Date de création :** 12 janvier 2026
**Statut :** ✅ SVG créé - Conversion en PNG requise
**Objectif :** Image optimisée pour les partages sur réseaux sociaux

---

## 🎯 C'est quoi une image Open Graph ?

Quand tu partages ton portfolio sur **LinkedIn**, **Facebook**, **Twitter** ou **WhatsApp**, une grande image s'affiche avec :
- Ton nom
- Ton titre
- Ton URL

**Sans image Open Graph** : Partage basique avec juste le texte ❌
**Avec image Open Graph** : Partage professionnel avec visuel attractif ✅

---

## ⚡ Conversion SVG → PNG (3 méthodes)

J'ai créé un fichier SVG : `public/og-image.svg`

Tu dois le convertir en PNG (1200x630px) pour qu'il fonctionne partout.

### Méthode 1 : En ligne (RAPIDE - 2 minutes)

1. **Va sur CloudConvert** : https://cloudconvert.com/svg-to-png

2. **Upload le fichier** : `public/og-image.svg`

3. **Paramètres** :
   - Width : `1200`
   - Height : `630`
   - Clique sur **"Convert"**

4. **Télécharge le PNG** généré

5. **Renomme-le** en `og-image.png`

6. **Place-le** dans `/Users/rafael/mon-portfolio/public/`

**✅ C'est tout ! L'image est prête.**

---

### Méthode 2 : Avec Figma (si tu préfères)

1. **Ouvre Figma** (ou Adobe Illustrator)

2. **Crée un frame** : 1200x630px

3. **Recrée le design** :
   - Fond noir (#000000)
   - Nom "Rafael Piral" en gros (120px, blanc)
   - Sous-titre "DESIGN GRAPHIQUE & UI/UX • AUDIOVISUEL" (32px, beige #D4C5B0)
   - Formation "BUT2 MMI..." (24px, gris)
   - URL "rafaelpiral.fr" (28px, beige)

4. **Exporte en PNG** :
   - Résolution : 2x (pour la qualité)
   - Format : PNG
   - Nom : `og-image.png`

5. **Place-le** dans `public/og-image.png`

---

### Méthode 3 : Avec Node.js (automatique)

Si tu veux automatiser la conversion :

```bash
npm install -g sharp-cli
sharp -i public/og-image.svg -o public/og-image.png --width 1200 --height 630
```

---

## 📐 Spécifications techniques

### Dimensions requises

| Plateforme | Taille recommandée | Ratio |
|------------|-------------------|-------|
| **Facebook** | 1200x630px | 1.91:1 |
| **LinkedIn** | 1200x627px | 1.91:1 |
| **Twitter** | 1200x600px | 2:1 |
| **Open Graph** | **1200x630px** | **1.91:1** ✅ |

**Notre image (1200x630px) fonctionne pour TOUS les réseaux** ✅

### Poids du fichier

- **Maximum recommandé** : 1 Mo
- **Idéal** : 200-500 Ko
- Si ton PNG dépasse 1 Mo, utilise [TinyPNG](https://tinypng.com/) pour le compresser

---

## 🎨 Design de l'image

L'image créée contient :

### Éléments visuels
- **Fond noir** avec grille subtile
- **Nom** : "Rafael Piral" (blanc, 120px)
- **Sous-titre** : "DESIGN GRAPHIQUE & UI/UX • AUDIOVISUEL" (beige #D4C5B0)
- **Formation** : "BUT2 MMI IUT Bobigny" (gris)
- **URL** : "rafaelpiral.fr" (beige, en évidence)

### Palette de couleurs
- Noir : `#000000`
- Blanc : `#FFFFFF`
- Beige : `#D4C5B0` (cohérent avec ton site)
- Gris : `#999999`

**Ce design est cohérent avec ton identité visuelle actuelle** ✅

---

## 🔧 Intégration dans le site

Une fois que tu as créé `public/og-image.png`, les meta tags sont déjà configurés dans `index.html` :

```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:image" content="https://rafaelpiral.fr/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />

<!-- Twitter -->
<meta property="twitter:image" content="https://rafaelpiral.fr/og-image.png" />
```

**Tu n'as rien à coder, juste à placer l'image !**

---

## ✅ Vérifier que ça fonctionne

### Test 1 : Facebook Sharing Debugger

1. **Va sur** : https://developers.facebook.com/tools/debug/

2. **Entre ton URL** : `https://rafaelpiral.fr`

3. **Clique sur "Déboguer"**

4. **Tu devrais voir** ton image Open Graph s'afficher

Si elle n'apparaît pas :
- Clique sur **"Scrape Again"** (Facebook met en cache les images)
- Attends quelques minutes et réessaye

### Test 2 : LinkedIn Post Inspector

1. **Va sur** : https://www.linkedin.com/post-inspector/

2. **Entre ton URL** : `https://rafaelpiral.fr`

3. **Tu devrais voir** l'aperçu avec ton image

### Test 3 : Twitter Card Validator

1. **Va sur** : https://cards-dev.twitter.com/validator

2. **Entre ton URL** : `https://rafaelpiral.fr`

3. **L'image devrait s'afficher** dans l'aperçu

---

## 💡 Conseils pour un résultat optimal

### Design

1. **Texte lisible** : Évite les polices trop fines, garde de la lisibilité
2. **Contraste élevé** : Texte blanc sur fond noir = parfait ✅
3. **Zone de sécurité** : Garde 100px de marge sur les côtés (fait ✅)
4. **Pas trop de texte** : Les petits textes ne sont pas lisibles en miniature

### Technique

1. **Format PNG** : Meilleure qualité que JPEG pour du texte
2. **Poids optimisé** : Compresse l'image si > 500 Ko
3. **Nom simple** : `og-image.png` (pas d'espaces, pas d'accents)
4. **HTTPS obligatoire** : Ton site est déjà en HTTPS ✅

---

## 🎨 Personnalisation (optionnel)

Si tu veux customiser l'image :

### Variantes possibles

1. **Avec photo** : Ajoute une photo de toi (optionnel)
2. **Avec projets** : Miniatures de tes projets en arrière-plan
3. **Couleur** : Change le fond noir pour du beige (ton identité)
4. **Typographie** : Utilise une police plus distinctive

### Outils recommandés

- **Figma** (gratuit) : Parfait pour créer des visuels
- **Canva** (gratuit) : Templates prêts à l'emploi (1200x630px)
- **Adobe Photoshop** : Si tu l'as déjà

**Le design actuel (minimaliste noir) est déjà très professionnel** ✅

---

## 📊 Impact sur le SEO et les partages

### Avantages d'une image Open Graph

✅ **Taux de clics +40%** : Les partages avec image sont beaucoup plus cliqués

✅ **Professionnel** : Montre que tu maîtrises les bonnes pratiques web

✅ **Branding** : Cohérence visuelle sur tous les réseaux

✅ **Mémorable** : Les recruteurs se souviennent de ton portfolio

### Statistiques

Une étude BuzzSumo (2024) montre que :
- Posts avec image : **2.3x plus d'engagement**
- Posts sans image : Taux de clic faible

**L'image Open Graph est un must-have pour un portfolio pro** 🚀

---

## 🐛 Dépannage

### Problème 1 : L'image ne s'affiche pas sur Facebook

**Solution** :
1. Va sur https://developers.facebook.com/tools/debug/
2. Entre ton URL et clique "Scrape Again"
3. Vide le cache de Facebook

### Problème 2 : L'image est coupée sur mobile

**Solution** :
- Assure-toi que l'image fait exactement **1200x630px**
- Garde les éléments importants au centre (fait ✅)

### Problème 3 : L'image est floue

**Solution** :
- Exporte en 2x (2400x1260px) puis redimensionne à 1200x630px
- Utilise PNG, pas JPEG

### Problème 4 : L'image est trop lourde (> 1 Mo)

**Solution** :
- Compresse avec https://tinypng.com/
- Ou exporte en qualité 80% depuis Photoshop

---

## ✅ Checklist

Avant de déployer :

- [ ] Fichier `og-image.svg` converti en PNG
- [ ] Image renommée en `og-image.png`
- [ ] Image placée dans `/public/og-image.png`
- [ ] Dimensions vérifiées : 1200x630px
- [ ] Poids vérifié : < 500 Ko
- [ ] Site redéployé sur Vercel
- [ ] Test Facebook Sharing Debugger réussi
- [ ] Test LinkedIn Post Inspector réussi
- [ ] Partage sur LinkedIn pour vérifier

---

## 📚 Ressources utiles

- **CloudConvert** : https://cloudconvert.com/svg-to-png
- **TinyPNG** : https://tinypng.com/ (compression)
- **Facebook Debugger** : https://developers.facebook.com/tools/debug/
- **LinkedIn Inspector** : https://www.linkedin.com/post-inspector/
- **Twitter Validator** : https://cards-dev.twitter.com/validator
- **Canva** : https://www.canva.com/ (templates 1200x630)

---

**Dernière mise à jour :** 12 janvier 2026
**Statut :** SVG créé, conversion PNG requise
**Temps estimé :** 5 minutes avec CloudConvert
