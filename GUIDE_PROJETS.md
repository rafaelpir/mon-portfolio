# Guide : Ajouter vos projets

## 📁 Structure des fichiers

```
mon-portfolio/
├── public/
│   ├── images/
│   │   └── projects/          ← Vos miniatures ici
│   └── videos/                ← Vos vidéos ici
└── src/
    └── data/
        └── projects.js        ← Fichier à modifier
```

## ✨ Comment ajouter un nouveau projet

### Étape 1 : Préparez vos médias

1. **Image miniature** (recommandé: 1920x1080px, format .jpg ou .webp)
   - Placez-la dans `/public/images/projects/`
   - Exemple : `mon-projet.jpg`

2. **Vidéo de présentation** (recommandé: 10-30 sec, format .mp4, max 5MB)
   - Placez-la dans `/public/videos/`
   - Exemple : `mon-projet.mp4`

### Étape 2 : Ajoutez le projet dans le fichier

Ouvrez `src/data/projects.js` et ajoutez votre projet dans le tableau :

```javascript
{
  id: 5,  // Incrémentez le dernier ID
  title: "Nom de votre projet",
  category: "Design graphique",  // Voir catégories ci-dessous
  year: "2024",
  description: "Description courte et impactante",
  video: "/videos/mon-projet.mp4",
  thumbnail: "/images/projects/mon-projet.jpg"
}
```

### Catégories disponibles

- `"Design graphique"`
- `"Développement web"`
- `"Motion design"`
- `"Photographie"`

**Astuce :** Vous pouvez créer de nouvelles catégories en changeant simplement le nom !

### Étape 3 : Sauvegardez

C'est tout ! Vos projets s'afficheront automatiquement sur votre portfolio.

## 🎨 Exemple complet

```javascript
export const projects = [
  // Projets existants...
  {
    id: 5,
    title: "Application mobile fitness",
    category: "Design UX/UI",
    year: "2024",
    description: "Interface moderne pour une app de coaching sportif",
    video: "/videos/app-fitness.mp4",
    thumbnail: "/images/projects/app-fitness.jpg"
  }
];
```

## 💡 Conseils

### Optimisation des images
- Utilisez [TinyPNG](https://tinypng.com/) pour compresser vos images
- Format WebP pour une meilleure performance

### Optimisation des vidéos
- Utilisez [HandBrake](https://handbrake.fr/) pour compresser vos vidéos
- Cible : ~1-2 MB par vidéo pour un chargement rapide

### Organisation
- Nommez vos fichiers de manière cohérente (ex: `projet-01.mp4`)
- Utilisez des noms sans espaces ni caractères spéciaux

## 🔧 Modifier vos compétences

Dans le même fichier `src/data/projects.js` :

```javascript
export const skills = [
  "Photoshop",
  "Illustrator",
  // Ajoutez vos compétences ici
];
```

## ❓ Questions fréquentes

**Q: Puis-je ajouter plus de 4 projets ?**
R: Oui, autant que vous voulez ! Le carrousel s'adaptera automatiquement.

**Q: Les vidéos sont obligatoires ?**
R: Oui pour l'instant. Vous pouvez utiliser une vidéo courte (5-10 sec) présentant votre projet.

**Q: Comment changer l'ordre des projets ?**
R: Changez simplement l'ordre dans le tableau. Le premier projet sera affiché en premier.

**Q: Puis-je utiliser des vidéos hébergées en ligne (YouTube, Vimeo) ?**
R: Pour l'instant, seules les vidéos locales sont supportées. Cela garantit de meilleures performances.

---

Besoin d'aide ? N'hésitez pas à demander ! 🚀
