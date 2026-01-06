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
    title: "Un Homme qui dort - Affiche revisitée",
    category: "Affiches",
    year: "2025",
    description: "Revisite personnelle de l'affiche classique de 1974. Conservation de la typographie culte originale avec changement radical de l'iconographie : gros plans texturés et granuleux pour matérialiser l'ennui et l'introspection par la matière plutôt que par le vide.",
    thumbnail: "/images/projects/lhommequidort.webp",
    youtubeId: "LUMifnAPafc",
    tags: ["Photoshop"]
  },
  {
    id: 2,
    title: "Concours d'affiche : Fêtes Populaires de Saint-Paul-lès-Dax 2025",
    category: "Affiches",
    year: "2025",
    description: "Affiche créée pour le concours officiel de la ville. Au lieu de suivre les codes rouge et blanc classiques des ferias, j'ai choisi le bleu : une référence au Lac de Christus et à l'ambiance estivale de cette ville thermale. La Grande Roue structure l'image et surplombe les scènes locales (course landaise, bandas, folklore). Le flat design apporte clarté et légèreté pour toucher un public familial.",
    thumbnail: "/images/projects/Dax.webp",
    tags: ["Photoshop", "Illustrator"]
  },
  {
    id: 3,
    title: "Poster Tribute : Sade – Diamond Life",
    category: "Affiches",
    year: "2025",
    description: "Hommage personnel à l'album Diamond Life de Sade (1984). J'ai voulu capturer visuellement la sophistication soul/jazz de cet album iconique. Traitement rétro avec un effet halftone prononcé qui rappelle les vieilles impressions de journaux. La palette sépia/marron chaud évoque le vinyle et une nostalgie luxueuse. Le contraste entre la serif grasse et condensée du titre et la signature manuscrite de \"Sade\" renforce cette élégance intemporelle.",
    thumbnail: "/images/projects/sade.webp",
    tags: ["Photoshop"]
  },
  {
    id: 4,
    title: "UI Design & Branding : Application Veco",
    category: "UI/UX Design",
    year: "2025",
    description: "Conception visuelle de Veco, une app de location de véhicules électriques entre particuliers. J'ai traduit les valeurs de mobilité douce et d'écologie en interface intuitive. Palette verte et naturelle pour ancrer l'univers éco-responsable. Les maquettes couvrent le parcours complet (location, profil, réservation) avec un design pensé pour rassurer et simplifier la prise en main.",
    thumbnail: "/images/projects/veco/thumbnail.webp",
    gallery: [
      { src: "/images/projects/veco/thumbnail.webp", description: "Présentation de l'application Veco : Vue d'ensemble de l'identité visuelle et du design system de l'application de mobilité électrique." },
      { src: "/images/projects/veco/1.webp", description: "Écran d'accueil et d'inscription : Interface de connexion et d'inscription épurée, mettant en avant l'identité visuelle de l'application dès l'ouverture." },
      { src: "/images/projects/veco/2.webp", description: "Géolocalisation des véhicules : Vue principale de la carte interactive affichant en temps réel tous les véhicules disponibles autour de la position de l'utilisateur." },
      { src: "/images/projects/veco/3.webp", description: "Sélection du véhicule et devis : Fiche détaillée du véhicule sélectionné, présentant ses caractéristiques (modèle, autonomie) ainsi qu'une estimation claire du prix de la course." },
      { src: "/images/projects/veco/4.webp", description: "Guidage vers le point de prise en charge : Navigation GPS intégrée guidant l'utilisateur (itinéraire piéton) pour rejoindre l'emplacement exact où son véhicule est garé." },
      { src: "/images/projects/veco/5.webp", description: "Filtrage par catégorie \"Vélo-Taxi\" : Activation du mode spécifique \"Vélo-Taxi\" via le sélecteur, filtrant la carte pour n'afficher que les vélos-taxis disponibles à proximité immédiate." },
      { src: "/images/projects/veco/6.webp", description: "Saisie de la destination : Interface de recherche intuitive permettant à l'utilisateur de choisir son point d'arrivée ou de sélectionner une destination favorite." },
      { src: "/images/projects/veco/7.webp", description: "Validation et Paiement : Écran récapitulatif de la course avec sélection du moyen de paiement sécurisé avant la validation finale." },
      { src: "/images/projects/veco/8.webp", description: "Centre d'aide et support : Accès rapide au service client et à la FAQ via le bouton d'aide, pour assister l'utilisateur en cas de problème." },
      { src: "/images/projects/veco/9.webp", description: "Profil et Paramètres : Menu de configuration permettant de gérer le compte utilisateur, les préférences de notification et l'historique des trajets." }
    ],
    tags: ["Figma", "UI Design"]
  },
  {
    id: 5,
    title: "UI Design & Branding : Agence Immobilière",
    category: "UI/UX Design",
    year: "2025",
    description: "Conception d'une interface web pour une agence immobilière fictive avec une contrainte majeure : l'optimisation SEO aux normes 2025. Le but n'était pas seulement de faire joli, mais de concevoir une structure performante pour le référencement naturel. J'ai créé l'identité visuelle complète (logo et Design System) lisible et impactante, capable de se décliner sur tous les supports numériques sans alourdir le chargement. Les maquettes Figma (Accueil et Page Lots) travaillent la hiérarchie visuelle pour guider l'œil de l'utilisateur et faciliter l'indexation par les moteurs de recherche. Le design est mis au service de la conversion et de la clarté de l'information.",
    thumbnail: "/images/projects/armorimmo.webp",
    figmaEmbed: "https://embed.figma.com/proto/IySCrSMWMDsUfz9bO51rrz/Site-Immo-Referencement?page-id=6%3A32&node-id=16-2&viewport=154%2C281%2C0.18&scaling=scale-down&content-scaling=fixed&starting-point-node-id=16%3A2&embed-host=share",
    tags: ["Figma", "UI Design", "Branding", "SEO"]
  },
  {
    id: 6,
    title: "Statue de la Liberté — De la photo à l'ASCII",
    category: "Photographie",
    year: "2025",
    description: "Lors d'un voyage à New York, j'ai photographié la Statue de la Liberté depuis Liberty Island. Cette photo est devenue le point de départ d'une expérimentation graphique : transformer une image réelle en une composition entièrement faite de caractères ASCII. L'idée était simple : comment réinterpréter un monument aussi iconique avec un langage purement numérique et typographique ? Le résultat joue sur une tension visuelle : de loin, on reconnaît la statue ; de près, on ne voit que du texte. La statue devient une structure de données, quelque chose entre la photographie et le code informatique.",
    thumbnail: "/images/projects/Liberté.webp",
    tags: ["Photoshop", "Photographie"]
  },
  {
    id: 7,
    title: "À Cœur Ouvert — Identité visuelle d'une ONG",
    category: "Branding",
    year: "2025",
    description: "Projet SAE : création complète de l'identité visuelle pour À Cœur Ouvert, ONG fictive de lutte contre les violences conjugales. J'ai conçu le logo de A à Z, développé la charte graphique (typographie, couleurs, usages) et rédigé un article portrait donnant la parole à une victime. Le nom 'À Cœur Ouvert' symbolise un espace de parole sans jugement. Mon challenge : créer une identité à la fois rassurante et professionnelle, qui véhicule confiance et bienveillance tout en marquant le positionnement inclusif de l'ONG (accueil universel sans distinction de genre, écoute 24h/24 et 7j/7).",
    thumbnail: "/images/projects/ACoeurOuvert.svg",
    pdfFile: "/images/projects/portrait.pdf",
    tags: ["Branding", "Illustrator", "InDesign"]
  }
];

// ============================================
// PROJETS EN COURS (WORK IN PROGRESS)
// ============================================
export const workInProgressProjects = [
  {
    id: "wip-1",
    title: "Refonte Portfolio Personnel",
    category: "Développement web",
    status: "En cours",
    progress: 75,
    estimatedCompletion: "Février 2025",
    description: "Amélioration continue du portfolio avec nouvelles fonctionnalités et optimisations.",
    thumbnail: "/images/projects/veco/thumbnail.webp" // Placeholder
  },
  {
    id: "wip-2",
    title: "Projet Motion Design",
    category: "Motion design",
    status: "En préparation",
    progress: 30,
    estimatedCompletion: "Mars 2025",
    description: "Création d'une animation motion design pour un projet personnel.",
    thumbnail: "/images/projects/sade.webp" // Placeholder
  }
];

// ============================================
// COMPÉTENCES PAR CATÉGORIES
// ============================================
export const skillCategories = [
  {
    category: "DESIGN GRAPHIQUE",
    skills: ["Photoshop", "Illustrator", "Figma", "InDesign"]
  },
  {
    category: "DÉVELOPPEMENT WEB",
    skills: ["HTML/CSS", "JavaScript", "React", "WordPress"]
  },
  {
    category: "AUDIOVISUEL",
    skills: ["Premiere Pro", "After Effects", "Blender"]
  }
];

// Export des skills en tableau plat pour compatibilité
export const skills = skillCategories.flatMap(cat => cat.skills);

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
