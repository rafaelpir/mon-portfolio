# 📝 Guide : Ajouter un projet

## 🚀 Méthode rapide (recommandée)

### 1. Lance le script
```bash
npm run add-project
```

### 2. Réponds aux questions
Le script te demandera :
- **Titre** : Nom de ton projet
- **Description** : Brève description
- **Catégorie** : Choisis dans la liste (1-6)
- **Miniature** : Chemin de l'image (ex: `/images/projects/mon-projet.jpg`)
- **Vidéo** : Chemin de la vidéo (ex: `/videos/mon-projet.mp4`)
- **Tags** : Mots-clés séparés par des virgules
- **Année** : Année du projet (Enter pour année actuelle)

### 3. Place tes fichiers
```bash
# Miniature
public/images/projects/mon-projet.jpg

# Vidéo
public/videos/mon-projet.mp4
```

### 4. C'est tout ! ✅
Le projet est automatiquement ajouté à `src/data/projects.js`

---

## 🛠️ Méthode manuelle (VS Code)

Si tu préfères éditer directement le code :

1. Ouvre `src/data/projects.js`
2. Ajoute un nouvel objet dans le tableau :

```javascript
{
  id: Date.now(), // ID unique
  title: "Mon Super Projet",
  description: "Description de mon projet",
  category: "Développement Web",
  thumbnail: "/images/projects/mon-projet.jpg",
  video: "/videos/mon-projet.mp4",
  tags: ["React", "Vite", "Design"],
  year: "2025"
}
```

3. Sauvegarde le fichier

---

## 📁 Structure des dossiers

```
public/
├── images/
│   └── projects/          ← Place tes miniatures ici
│       ├── projet1.jpg
│       └── projet2.jpg
└── videos/                ← Place tes vidéos ici
    ├── projet1.mp4
    └── projet2.mp4
```

---

## 💡 Conseils

### Taille des fichiers
- **Miniatures** : max 500 KB (optimise avec TinyPNG)
- **Vidéos** : max 10 MB (compresse avec ffmpeg ou Handbrake)

### Formats recommandés
- Images : JPG, PNG, WebP
- Vidéos : MP4 (H.264)

### Compression vidéo rapide
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow output.mp4
```

---

## 🎨 Catégories disponibles

1. Design Graphique
2. Développement Web
3. Audiovisuel
4. Motion Design
5. UI/UX
6. Autre

---

## ❓ FAQ

**Q: Le script ne fonctionne pas ?**
A: Vérifie que tu es bien dans le dossier du projet (`cd mon-portfolio`)

**Q: Comment supprimer un projet ?**
A: Ouvre `src/data/projects.js` et supprime l'objet correspondant

**Q: Comment modifier un projet existant ?**
A: Ouvre `src/data/projects.js` et modifie directement l'objet

**Q: La vidéo ne s'affiche pas ?**
A: Vérifie que le chemin commence par `/` et que le fichier est dans `public/videos/`

---

## 🚀 Workflow complet

1. **Créer le projet** dans ton logiciel (Figma, code, etc.)
2. **Exporter** miniature + vidéo
3. **Compresser** les fichiers
4. **Placer** dans `public/images/projects/` et `public/videos/`
5. **Lancer** `npm run add-project`
6. **Tester** avec `npm start`
7. **Commit** et **push** sur Git
8. **Déployer** (Vercel, Netlify, etc.)

✅ Terminé !
