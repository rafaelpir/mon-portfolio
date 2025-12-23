# Guide de Style - Portfolio Rafael Piral
## Guide pour recréer le design dans Figma

---

## 🎨 Palette de Couleurs

### Mode Sombre (par défaut)
| Nom | Hex | Usage |
|-----|-----|-------|
| **Fond principal** | `#000000` | Background |
| **Texte principal** | `#ff7b00` (beige/orange) | Titres, textes importants |
| **Texte secondaire** | `#FFFFFF` | Texte blanc |
| **Texte tertiaire** | `#9CA3AF` (gray-400) | Texte de description |
| **Bordures** | `#ff7b00` avec 10% opacité | Séparateurs |
| **Accent orange** | `#ff7b00` | Éléments interactifs |
| **Orange clair** | `#ff9933` | Dégradés, highlights |
| **Orange foncé** | `#cc6200` | Ombres, profondeur |

### Mode Clair
| Nom | Hex | Usage |
|-----|-----|-------|
| **Fond principal** | `#ff7b00` (beige) | Background |
| **Texte principal** | `#000000` | Titres, textes |
| **Texte secondaire** | `#374151` (gray-700) | Texte de description |
| **Bordures** | `#000000` avec 10-20% opacité | Séparateurs |

### Couleurs des Blocs Glitch
| Nom | Hex | Usage |
|-----|-----|-------|
| **Bloc orange** | `#ff7b00` | Arrière-plan des blocs |
| **Texte sur bloc** | `#000000` | Texte noir sur fond orange |

---

## 📝 Typographie

### Police Principale
- **Nom**: StampRSPKOne
- **Fallback**: system-ui, sans-serif
- **Chargement**: Google Fonts

### Hiérarchie des Tailles

#### Desktop (écrans > 768px)

| Élément | Taille | Poids | Line Height | Espacement |
|---------|--------|-------|-------------|------------|
| **Hero titre** | 15vw | Light (300) | None (1.0) | Tight |
| **Section titre (Contact)** | 7xl - 9xl (72-128px) | Light (300) | None (1.0) | - |
| **Introduction** | 5xl - 7xl (48-72px) | Light (300) | Tight (1.25) | - |
| **À propos texte** | 2xl - 3xl (24-30px) | Light (300) | Relaxed (1.625) | - |
| **Navigation** | sm (14px) | Normal (400) | - | Widest (0.1em) |
| **Sous-titres** | xs - sm (12-14px) | Normal (400) | - | Widest (0.1em) |

#### Mobile (écrans < 768px)

| Élément | Taille | Poids |
|---------|--------|-------|
| **Hero titre** | 18vw | Light (300) |
| **Section titre** | 4xl (36px) | Light (300) |
| **Introduction** | 3xl (30px) | Light (300) |
| **À propos texte** | 2xl (24px) | Light (300) |
| **Navigation** | sm (14px) | Normal (400) |

---

## 📐 Espacements & Layout

### Conteneur Maximum
- **Max-width global**: `1280px` (max-w-7xl)
- **Max-width contenu**: `896px` (max-w-4xl)
- **Max-width projets**: `1152px` (max-w-6xl)

### Padding de Sections

| Section | Desktop | Mobile |
|---------|---------|--------|
| **Vertical (py)** | 128px (py-32) | 64px (py-16) |
| **Horizontal (px)** | 64px (px-16) | 32px (px-8) |

### Marges Internes

| Élément | Valeur |
|---------|--------|
| **Entre titres et contenu** | 64px (mb-16) |
| **Entre paragraphes (À propos)** | 32px (space-y-8) |
| **Entre sections** | 128px (gap-16) |

### Grid System

#### Footer
```
Desktop: 3 colonnes égales (grid-cols-3)
Mobile: 1 colonne (grid-cols-1)
Gap: 48-64px (gap-12 md:gap-16)
```

#### Contact Form
```
Desktop: 2 colonnes (md:grid-cols-2)
Mobile: 1 colonne
Gap: 32-64px (gap-8 md:gap-16)
```

---

## 🎭 Composants Principaux

### 1. Header (Navigation)
**Position**: Fixed top
**Hauteur**: Auto (py-6 = 24px top/bottom)
**Background**:
- Mode sombre: `rgba(0,0,0,0.05)`
- Mode clair: `rgba(255,123,0,0.05)`
**Bordure**: Bottom 1px, 10% opacité
**Padding**: 32px horizontal (px-8)

**Logo "R"**:
- Taille: 64x64px desktop, 80x80px mobile
- Font-size: 48-60px
- Animation: Rotation 3D continue (8s)
- Dégradé: `linear-gradient(135deg, #ff9933 0%, #ff7b00 100%)`
- Ombres:
  - `3px 3px 6px rgba(255,123,0,0.4)`
  - `-3px -3px 6px rgba(0,0,0,0.6)`

**Liens navigation**:
- Taille: 14px
- Espacement lettres: 0.1em (tracking-widest)
- Hover: Effet de surlignage orange

### 2. Hero Section
**Hauteur**: 100vh
**Alignement**: Center (flex items-center justify-center)
**Effet parallaxe**:
- Titre: `translateY(scrollY * 0.15)`
- Sous-titre: `translateY(scrollY * 0.1)`
- Opacité: `1 - scrollY / 500`

**Texte "DÉFILER"**:
- Position: Bottom (32-48px)
- Animation: bounce
- Opacité: 0.6

### 3. Section Introduction
**Layout**: Text large centré à gauche
**Informations**:
- Grid 2 colonnes sur desktop
- Gap: 32px
- Labels: Gray-500, 12px, tracking-wider, mb-2

### 4. Section Projets (FlowingMenu)
**Filtres**:
- Display: Flex wrap center
- Gap: 16-24px
- Couleur active: Orange (#ff7b00)
- Indicateur: Ligne bottom 1px

**Container projets**:
- Hauteur: 400px mobile, 600px desktop
- Border-radius: 8px (rounded-lg)

### 5. Section Compétences (Skills)
**Background inversé**:
- Mode sombre: Beige-light (#ff9933)
- Mode clair: Black (#000000)

**ScrollVelocity**:
- 3 rangées
- Direction alternée (1, -1, 1)
- Vitesse base: 2
- Taille texte: 32-64px (2xl - 4xl)
- Espacement: 16px entre items (mx-4)

**Gradients latéraux**:
- Largeur: 25% de chaque côté
- Direction: Left to right / Right to left

### 6. Section À Propos
**Titre**:
- Taille: 12-14px
- Tracking: widest (0.1em)
- Couleur: Gray-500
- Margin-bottom: 64px

**Paragraphes**:
- Espacement vertical: 32px (space-y-8)
- Couleur: Gray-400 (sauf premier paragraphe)

### 7. Section Contact
**Titre**:
- Taille: 72-128px (4xl - 9xl)
- 2 lignes: "TRAVAILLONS" / "ENSEMBLE"
- Centré

**Formulaire**:
- Inputs: Border-bottom only
- Padding: 12-16px (py-3 md:py-4)
- Taille texte: 16-20px (base - xl)
- Focus: Border color change to orange/black
- Background: Transparent

**Bouton**:
- Border: 1px solid
- Padding vertical: 16-24px (py-4 md:py-6)
- Tracking: widest
- Hover: Background fill + color inverse

**Informations contact**:
- Labels: 12-14px, gray-500, tracking-widest, mb-2
- Liens: 18-24px (lg - 2xl)
- Hover: Italic

### 8. Footer
**3 colonnes**:
1. À propos (brève description)
2. Navigation (liens internes)
3. Contact & Réseaux

**Bottom bar**:
- Border-top: 1px, 10% opacité
- Padding-top: 32px (pt-8)
- Flex entre copyright et signature
- Taille: 12-14px (xs - sm)
- Opacité: 50%

---

## ✨ Effets & Animations

### 1. GlitchText (Blocs oranges)
**Comportement**:
- Génération automatique toutes les 2 secondes
- 3-6 blocs aléatoires par texte
- Longueur bloc: 2-10 caractères
- Régénération au survol

**Visuel**:
- Background: `#ff7b00`
- Position: Derrière le texte (z-index: -1)
- Couleur texte sur bloc: `#000000`
- Padding bloc: 2px extension sur tous les côtés
- Transition: 0.2s ease

### 2. ShuffleText
**Effet**: Animation de lettres qui se mélangent avant de se stabiliser
**Durée**: Variable selon la longueur du texte
**Police**: Configurable (StampRSPKOne par défaut)

### 3. Hover Effects

**Navigation links (hover-highlight)**:
```css
Position: relative
Pseudo ::before:
  - Background: linear-gradient(135deg, #ff7b00 0%, #ff9933 100%)
  - Transform: scaleX(0) → scaleX(1)
  - Transform-origin: left
  - Border-radius: 4px
  - Opacity: 0 → 1
  - Duration: 0.4s
  - Easing: cubic-bezier(0.4, 0, 0.2, 1)
  - Z-index: -1
  - Padding: -4px horizontal

Hover:
  - Color: #000000
```

### 4. Parallax Scrolling
**Hero section**:
- Titre principal: `transform: translateY(scrollY * 0.3px)`
- Sous-titre: `transform: translateY(scrollY * 0.15px)`
- Opacité: `1 - scrollY / 500`

**Sections**:
- À propos titre: `translateY((scrollY - 2800) * 0.08px)`
- À propos texte: `translateY((scrollY - 2900) * 0.06px)`
- Projets titre: `translateY((scrollY - 1200) * 0.08px)`
- Skills titre: `translateY((scrollY - 2000) * 0.08px)`
- Contact titre: `translateY((scrollY - 3500) * 0.08px)`

### 5. Logo "R" Animation (3D)
```css
Animation: rotate3dFull 8s linear infinite
Keyframes:
  0%: rotateY(0deg) rotateX(0deg)
  25%: rotateY(90deg) rotateX(90deg)
  50%: rotateY(180deg) rotateX(180deg)
  75%: rotateY(270deg) rotateX(270deg)
  100%: rotateY(360deg) rotateX(360deg)
Transform-style: preserve-3d
```

### 6. Smooth Scroll (Lenis)
```javascript
Options:
  lerp: 0.05
  duration: 1.2s
  smoothWheel: true
```

### 7. Transitions de Page (Framer Motion)
**TerminalLoader Exit**:
```javascript
exit: { opacity: 0 }
duration: 0.8s
easing: easeInOut
```

**Contenu Enter**:
```javascript
initial: { opacity: 0 }
animate: { opacity: 1 }
duration: 1s
easing: easeInOut
```

### 8. Curseur Personnalisé
**Taille**: 16x16px (w-4 h-4)
**Style**: Border 2px, rounded-full
**Couleur**: Inverse du fond (mix-blend-difference)
**Suiveur**: Mouse position - 8px offset
**Transition**: 0.15s ease-out
**Z-index**: 50

---

## 🎯 États Interactifs

### Boutons
```
Default: Border solid, Background transparent
Hover: Background fill, Text color inverse
Active/Focus: Outline none
Disabled: Opacity 50%, Cursor not-allowed
```

### Liens
```
Default: Couleur par défaut
Hover: Classe hover-highlight OU italic
Active: Couleur orange (#ff7b00)
```

### Inputs de formulaire
```
Default: Border-bottom, Background transparent
Focus: Border color change
Invalid: Validation error display
```

### Menu Mobile
```
Closed: Hidden (md:hidden)
Open: Full width, Border-top
Overlay: Background color du thème
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| **sm** | 640px | Petits ajustements |
| **md** | 768px | Tablette, menu desktop |
| **lg** | 1024px | Desktop standard |
| **xl** | 1280px | Large desktop |

### Comportements Responsive Clés

1. **Navigation**: Burger menu < 768px, Nav complète ≥ 768px
2. **Grid**: 1 colonne mobile, 2-3 colonnes desktop
3. **Tailles texte**: Réduction proportionnelle mobile
4. **Padding**: Réduit de 50% sur mobile
5. **FlowingMenu**: Hauteur 400px mobile, 600px desktop

---

## 🔧 Paramètres Configurables

### Settings Menu
**Options disponibles**:
1. **Thème**: Mode sombre / Mode clair
2. **Effets texte**: ShuffleText ON/OFF
3. **Police**:
   - StampRSPKOne (défaut)
   - Arial
   - Helvetica
   - Times New Roman
   - Courier

**Stockage**: localStorage
- `darkMode`: boolean
- `textEffects`: boolean
- `selectedFont`: string

---

## 📦 Composants React à Recréer

### Liste des Composants

1. **TerminalLoader** - Écran de chargement initial
2. **GlitchText** - Effet de blocs oranges aléatoires
3. **ShuffleText** - Animation de lettres mélangées
4. **FlowingMenu** - Menu de projets avec images
5. **ScrollVelocityContainer** - Container pour scroll horizontal infini
6. **ScrollVelocityRow** - Rangée de scroll avec vitesse configurable
7. **Header** - Navigation fixe avec logo 3D
8. **Footer** - Pied de page 3 colonnes
9. **ContactForm** - Formulaire avec validation Formspree
10. **SettingsMenu** - Menu déroulant de paramètres

---

## 🎨 Instructions Figma

### Étape 1: Configuration
1. Créer un nouveau fichier Figma
2. Configurer la grille: 12 colonnes, gutter 16px
3. Créer des styles de couleur pour chaque couleur listée
4. Créer des styles de texte pour chaque hiérarchie

### Étape 2: Frames
Créer des frames pour chaque breakpoint:
- **Mobile**: 375px de largeur
- **Tablet**: 768px de largeur
- **Desktop**: 1440px de largeur

### Étape 3: Composants
Créer les composants suivants avec variants:
- **Button**: Default, Hover, Disabled
- **Input**: Default, Focus, Error
- **Link**: Default, Hover, Active
- **Card Project**: Default, Hover
- **Navigation**: Desktop, Mobile

### Étape 4: Auto Layout
Utiliser Auto Layout pour:
- Header (space-between)
- Navigation (gap 32px)
- Footer colonnes (gap 48-64px)
- Sections (padding vertical 128px)

### Étape 5: Effets
- **Blur**: Background header (opacity 5%)
- **Shadow**: Logo "R" avec ombres multiples
- **Gradient**: Compétences sections latérales

### Étape 6: Prototypage
- Lier les boutons de navigation aux sections correspondantes
- Créer les interactions hover sur les liens
- Animer la transition du loader

---

## 📝 Notes Importantes

1. **Police StampRSPKOne**: Assurez-vous de l'installer dans Figma
2. **Effets de parallaxe**: Ne peuvent être simulés dans Figma, documenter uniquement
3. **Animations complexes**: Créer des frames d'état (before/after)
4. **Dégradés**: Utiliser l'outil Gradient avec les angles exacts
5. **Mix-blend-mode**: Peut ne pas s'afficher correctement dans Figma

---

## 🔗 Ressources

- **Police Google Fonts**: [StampRSPKOne](https://fonts.google.com)
- **Palette de couleurs**: Exporter vers Figma avec un plugin
- **Icons**: Utiliser Heroicons (même bibliothèque que le code)

---

## ✅ Checklist de Validation

- [ ] Toutes les couleurs sont créées comme styles
- [ ] Toutes les tailles de texte sont créées comme styles
- [ ] Les composants principaux sont créés avec variants
- [ ] Les breakpoints responsive sont configurés
- [ ] Les espacements correspondent exactement
- [ ] Les effets hover sont documentés
- [ ] Les grids et auto-layouts sont correctement configurés
- [ ] Le prototype de navigation fonctionne
- [ ] Les assets (logo, images) sont exportés
- [ ] La documentation des animations est complète

---

**Date de création**: 20 décembre 2025
**Version**: 1.0
**Auteur**: Rafael Piral
