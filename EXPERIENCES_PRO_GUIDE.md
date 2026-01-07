# Guide : Ajouter une Expérience Professionnelle

## 📝 Quand utiliser cette section ?

La section "Expériences Pro" est réservée pour :
- ✅ Stage BUT2 (12 semaines à partir d'avril 2026)
- ✅ Alternance BUT3 (septembre 2026)
- ✅ Stages précédents (si applicable)

**NE PAS utiliser pour** : Projets universitaires (SAE, R), projets personnels, ou freelance non structuré.

---

## 🚀 Comment ajouter votre stage BUT2 ?

### Étape 1 : Préparer vos médias

1. Créer un dossier : `/public/images/experiences/stage-but2/`

2. Ajouter vos médias :
   - `thumbnail.jpg` - Image principale (1200x800px recommandé)
   - `image1.jpg`, `image2.jpg`, etc. - Captures de vos réalisations
   - Optimiser les images avant upload (< 500KB chacune)

### Étape 2 : Éditer le fichier projects.js

Ouvrir : `src/data/projects.js`

Trouver la section `experiencesPro` (ligne 96) et décommenter le template :

```javascript
export const experiencesPro = [
  {
    id: "exp-1",
    title: "Stage BUT2 - [Nom de l'entreprise]",
    category: "Expériences Pro",
    year: "2026",
    period: "Avril - Juin 2026",
    duration: "12 semaines",
    company: "Nom de l'entreprise",
    location: "Paris, France",
    context: "Stage de 2ème année de BUT MMI - Parcours Créations Numériques",
    
    // Description détaillée de VOS missions
    description: "Au sein de [Nom de l'entreprise], j'ai contribué à [projet principal]. Mes missions principales incluaient la conception graphique de supports de communication, la création de contenus audiovisuels, et la participation active aux brainstormings créatifs. J'ai notamment réalisé [réalisation concrète 1], développé [réalisation 2], et optimisé [réalisation 3].",
    
    // Compétences et outils utilisés
    tags: ["Photoshop", "Illustrator", "Premiere Pro", "Figma", "UI Design"],
    
    thumbnail: "/images/experiences/stage-but2/thumbnail.jpg",
    
    // Galerie de vos réalisations
    gallery: [
      { 
        src: "/images/experiences/stage-but2/image1.jpg", 
        description: "Description de cette réalisation" 
      },
      { 
        src: "/images/experiences/stage-but2/image2.jpg", 
        description: "Description de cette réalisation" 
      }
    ],
    
    // Liste à puces de vos accomplissements
    achievements: [
      "Conception de 15 visuels pour les réseaux sociaux (Instagram, LinkedIn)",
      "Montage de 3 vidéos promotionnelles (durée totale : 5 minutes)",
      "Refonte de la charte graphique interne",
      "Participation à 2 campagnes publicitaires digitales"
    ]
  }
];
```

### Étape 3 : Personnaliser le contenu

**✅ Points importants :**

1. **Focus sur VOS contributions** : Dans les projets de groupe, détaillez CE QUE VOUS avez fait personnellement

2. **Utiliser le vocabulaire métier** :
   - ❌ "J'ai utilisé Figma"
   - ✅ "Conception d'interfaces interactives avec Figma"
   
   - ❌ "J'ai fait du montage"
   - ✅ "Montage vidéo et color grading sur Adobe Premiere Pro"

3. **Quantifier vos réalisations** :
   - Nombre de visuels créés
   - Durée des vidéos produites
   - Nombre de pages web développées
   - Impact mesurable (ex: +30% d'engagement sur les RS)

4. **Mentionner les compétences de savoir-être** :
   - Travail collaboratif en équipe de X personnes
   - Gestion de projet sous Trello/Notion
   - Respect des deadlines serrées
   - Autonomie dans la recherche de solutions

---

## 📊 Exemple complet (fictif)

```javascript
export const experiencesPro = [
  {
    id: "exp-1",
    title: "Stage BUT2 - Agence Créa'Digital",
    category: "Expériences Pro",
    year: "2026",
    period: "7 avril - 27 juin 2026",
    duration: "12 semaines",
    company: "Agence Créa'Digital",
    location: "Paris 11ème, France",
    context: "Stage de 2ème année de BUT MMI - Parcours Créations Numériques",
    
    description: "Au sein de l'agence Créa'Digital, spécialisée dans le branding et la communication digitale pour les startups, j'ai intégré l'équipe créative (6 personnes). Mes missions principales ont porté sur la conception graphique de supports de communication multi-formats, la création de contenus audiovisuels pour les réseaux sociaux, et la participation active aux brainstormings créatifs client. J'ai notamment réalisé la refonte graphique complète du compte Instagram de 3 clients, développé une série de 8 vidéos motion design pour une campagne de lancement produit, et optimisé le processus de production visuelle en créant un design system réutilisable sur Figma.",
    
    tags: ["Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Figma", "Motion Design", "Brand Identity"],
    
    thumbnail: "/images/experiences/stage-but2/thumbnail.jpg",
    
    gallery: [
      { 
        src: "/images/experiences/stage-but2/instagram-grids.jpg", 
        description: "Grilles Instagram réalisées pour 3 clients - Conception visuelle et déclinaison de charte" 
      },
      { 
        src: "/images/experiences/stage-but2/motion-design.jpg", 
        description: "Série de 8 vidéos motion design (15-30 sec) - Animation After Effects" 
      },
      { 
        src: "/images/experiences/stage-but2/design-system.jpg", 
        description: "Design System Figma - Bibliothèque de composants réutilisables" 
      }
    ],
    
    achievements: [
      "Conception et déclinaison de 45 visuels pour réseaux sociaux (Instagram, LinkedIn, Facebook)",
      "Création de 8 vidéos motion design (durée totale : 3 minutes)",
      "Refonte complète de 3 identités visuelles Instagram (+40% d'engagement moyen)",
      "Développement d'un design system Figma réduisant le temps de production de 30%",
      "Gestion autonome de 2 projets clients de A à Z",
      "Participation à 6 présentations client et intégration du feedback"
    ]
  }
];
```

---

## ✅ Checklist avant publication

- [ ] Toutes les images sont optimisées (< 500KB)
- [ ] Les chemins des images sont corrects
- [ ] La description fait au moins 3-4 phrases
- [ ] Les tags reflètent les compétences réellement utilisées
- [ ] Les achievements sont quantifiés et concrets
- [ ] Le vocabulaire est professionnel (pas de "j'ai juste fait...")
- [ ] Focus sur VOS contributions personnelles
- [ ] Mention du contexte (équipe, méthodologie, outils)

---

## 🎯 Pourquoi c'est important ?

La grille d'évaluation BUT2 demande :
- ✅ Une rubrique "Expériences Pro" distincte des projets universitaires
- ✅ Mise en avant des stages/alternances pour faciliter la recherche d'emploi
- ✅ Portfolio prévu pour évoluer sur 3 ans (BUT2 → BUT3 → Post-BUT)

Pendant votre stage, **mettez à jour votre portfolio en temps réel** :
- Ajoutez vos réalisations au fur et à mesure
- Prenez des screenshots/photos de vos créations
- Documentez vos missions et leur impact

Cela facilitera **votre recherche d'alternance en BUT3** !

---

**Date de création :** 7 janvier 2026  
**Dernière mise à jour :** 7 janvier 2026
