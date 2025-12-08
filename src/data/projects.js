// ============================================
// DONNÉES DES PROJETS
// ============================================
// Pour ajouter un nouveau projet :
// 1. Ajoutez vos médias dans /public/images/ et /public/videos/
// 2. Copiez un objet projet existant
// 3. Modifiez les informations
// 4. Sauvegardez le fichier

export const projects = [
  {
    id: 1,
    title: "Identité visuelle événementielle",
    category: "Design graphique",
    year: "2024",
    description: "Création complète d'une identité pour un festival étudiant",
    video: "/videos/identite-visuelle.mp4",
    thumbnail: "/images/projects/identite-visuelle.jpg"
  },
  {
    id: 2,
    title: "Plateforme web interactive",
    category: "Développement web",
    year: "2024",
    description: "Site responsive avec animations fluides et interface moderne",
    video: "/videos/plateforme-web.mp4",
    thumbnail: "/images/projects/plateforme-web.jpg"
  },
  {
    id: 3,
    title: "Court-métrage animé",
    category: "Motion design",
    year: "2023",
    description: "Animation 2D réalisée avec After Effects",
    video: "/videos/court-metrage.mp4",
    thumbnail: "/images/projects/court-metrage.jpg"
  },
  {
    id: 4,
    title: "Série photographique urbaine",
    category: "Photographie",
    year: "2023",
    description: "Exploration visuelle de l'architecture contemporaine",
    video: "/videos/photo-urbaine.mp4",
    thumbnail: "/images/projects/photo-urbaine.jpg"
  }
];

// ============================================
// COMPÉTENCES
// ============================================
export const skills = [
  "Photoshop", "Illustrator", "Figma", "InDesign",
  "HTML/CSS", "JavaScript", "React", "WordPress",
  "Premiere Pro", "After Effects", "Blender"
];

// ============================================
// TEMPLATE POUR AJOUTER UN NOUVEAU PROJET
// ============================================
// Décommentez et modifiez ce template :
/*
{
  id: 5, // Incrémentez le numéro
  title: "Titre de votre projet",
  category: "Design graphique" | "Développement web" | "Motion design" | "Photographie",
  year: "2024",
  description: "Description courte et impactante de votre projet",
  video: "/videos/votre-video.mp4", // Placez la vidéo dans /public/videos/
  thumbnail: "/images/projects/votre-image.jpg" // Placez l'image dans /public/images/projects/
}
*/
