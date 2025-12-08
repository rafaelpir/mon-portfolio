# 📹 Guide des Vidéos

## Comment ajouter vos vidéos

1. **Placez vos fichiers vidéo ici** dans ce dossier `public/videos/`

2. **Formats recommandés** :
   - MP4 (recommandé - meilleure compatibilité)
   - WebM
   - OGG

3. **Nommage des fichiers** :
   Utilisez les noms exacts définis dans `src/App.js` :
   - `identite-visuelle.mp4`
   - `plateforme-web.mp4`
   - `court-metrage.mp4`
   - `photo-urbaine.mp4`

4. **Optimisation** :
   - Compressez vos vidéos avant de les ajouter
   - Résolution recommandée : 1920x1080 (Full HD)
   - Taille recommandée : < 50 MB par vidéo
   - FPS recommandé : 24-30 fps

5. **Miniatures (optionnel)** :
   Placez les images de prévisualisation dans `public/images/projects/`
   avec le même nom que la vidéo mais en `.jpg`

## Outils de compression recommandés

- [HandBrake](https://handbrake.fr/) - Gratuit et open source
- [FFmpeg](https://ffmpeg.org/) - Ligne de commande
- Adobe Media Encoder - Si vous avez la suite Adobe

## Exemple de structure

```
public/
├── videos/
│   ├── identite-visuelle.mp4
│   ├── plateforme-web.mp4
│   ├── court-metrage.mp4
│   └── photo-urbaine.mp4
└── images/
    └── projects/
        ├── identite-visuelle.jpg
        ├── plateforme-web.jpg
        ├── court-metrage.jpg
        └── photo-urbaine.jpg
```
