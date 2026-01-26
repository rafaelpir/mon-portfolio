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
    type: "Personnel",
    year: "2025",
    context: "Projet personnel - Réinterprétation d'affiche de film",
    period: "Janvier 2025",
    duration: "2 semaines",
    description: "J'ai voulu revisiter l'affiche du film 'Un Homme qui dort' (1974), un classique qui m'a marqué par son atmosphère si particulière. J'ai gardé la typographie originale que j'adore, mais j'ai complètement repensé l'image : des gros plans texturés et granuleux qui, pour moi, traduisent mieux l'ennui et l'introspection que le vide habituel. Une façon de raconter l'isolement par la\u00A0matière.",
    thumbnail: "/images/projects/lhommequidort.webp",
    youtubeId: "LUMifnAPafc",
    gallery: [
      { src: "/images/projects/lhommequidort.webp", description: "Affiche revisitée du film 'Un Homme qui dort' (1974)." },
      { src: "/images/projects/uhqdmockup.webp", description: "Mockup de présentation de l'affiche revisitée 'Un Homme qui dort'." }
    ],
    tags: ["Photoshop"],
    competences: ["Conception d'affiche", "Retouche photo", "Direction artistique", "Composition visuelle"],
    outils: ["Adobe Photoshop"]
  },
  {
    id: 2,
    title: "Concours d'affiche : Fêtes Populaires de Saint-Paul-lès-Dax 2025",
    category: "Affiches",
    type: "Universitaire",
    year: "2025",
    context: "Concours officiel - Ville de Saint-Paul-lès-Dax",
    period: "Décembre 2024 - Janvier 2025",
    duration: "3 semaines",
    description: "J'ai participé au concours officiel d'affiche organisé par la ville de Saint-Paul-lès-Dax pour leurs Fêtes Populaires 2025. L'objectif était de proposer une affiche qui représente l'esprit festif de cet événement\u00A0incontournable.",
    thumbnail: "/images/projects/daxmockup.webp",
    gallery: [
      { src: "/images/projects/Dax.webp", description: "Affiche originale des Fêtes Populaires de Saint-Paul-lès-Dax 2025." },
      { src: "/images/projects/daxmockup.webp", description: "Mockup de présentation de l'affiche des Fêtes Populaires de Saint-Paul-lès-Dax." }
    ],
    tags: ["Photoshop", "Illustrator"],
    competences: ["Conception d'affiche", "Illustration vectorielle", "Flat design", "Direction artistique"],
    outils: ["Adobe Photoshop", "Adobe Illustrator"]
  },
  {
    id: 3,
    title: "Poster Tribute : Sade – Diamond Life",
    category: "Affiches",
    type: "Personnel",
    year: "2025",
    context: "Projet personnel - Hommage graphique",
    period: "Décembre 2024",
    duration: "1 semaine",
    description: "Diamond Life de Sade (1984), c'est un album que j'apprécie. J'ai voulu lui rendre hommage à travers un poster qui capture cette élégance soul/jazz si particulière, avec un traitement rétro et des tons sépia qui évoquent le vinyle et la\u00A0nostalgie.",
    thumbnail: "/images/projects/sademockup.webp",
    gallery: [
      { src: "/images/projects/sade.webp", description: "Poster Tribute original de l'album Diamond Life de Sade." },
      { src: "/images/projects/sademockup.webp", description: "Mockup de présentation du poster tribute Sade – Diamond Life." }
    ],
    tags: ["Photoshop"],
    competences: ["Design d'affiche", "Traitement rétro", "Typographie", "Composition visuelle"],
    outils: ["Adobe Photoshop"]
  },
  {
    id: 4,
    title: "UX Design : Application Veco",
    category: "UI/UX Design",
    type: "Universitaire",
    year: "2025",
    context: "Projet SAE BUT2 - Conception d'application mobile",
    period: "Octobre - Novembre 2025",
    duration: "6 semaines",
    description: "Conception visuelle de Veco, application de location de véhicules électriques entre particuliers. Traduction des valeurs de mobilité douce et d'écologie en interface intuitive. Palette verte et naturelle pour ancrer l'univers éco-responsable. Les maquettes couvrent le parcours complet (géolocalisation, réservation, profil utilisateur) avec un design pensé pour rassurer et simplifier la prise en\u00A0main.",
    thumbnail: "/images/projects/veco/thumbnail.webp",
    competences: ["Conception d'interfaces mobiles", "UX Design", "UI Design", "Branding", "Design System"],
    outils: ["Figma"],
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
    type: "Universitaire",
    year: "2025",
    context: "Projet SAE BUT2 - Optimisation SEO et conception web",
    period: "Septembre - Octobre 2025",
    duration: "5 semaines",
    description: "Ce projet avait une contrainte intéressante : penser le design pour le SEO dès le départ. Pas juste faire joli, mais créer une structure qui plaise aussi aux moteurs de recherche. J'ai conçu toute l'identité visuelle — logo, Design System — en veillant à ce que tout reste léger et performant. Les maquettes jouent sur la hiérarchie visuelle pour guider naturellement l'utilisateur tout en facilitant\u00A0l'indexation.",
    thumbnail: "/images/projects/armorimmo.webp",
    figmaEmbed: "https://embed.figma.com/proto/IySCrSMWMDsUfz9bO51rrz/Site-Immo-Referencement?page-id=6%3A32&node-id=16-2&viewport=154%2C281%2C0.18&scaling=scale-down&content-scaling=fixed&starting-point-node-id=16%3A2&embed-host=share",
    gallery: [
      { src: "/images/projects/armorimmo.webp", description: "Identité visuelle et Design System de l'agence immobilière Armor Immo." },
      { src: "/images/projects/armorimmomockup1.webp", description: "Mockup de présentation de la page d'accueil du site Armor Immo." },
      { src: "/images/projects/armorimmomockup2.webp", description: "Mockup de présentation de la page des lots immobiliers." }
    ],
    tags: ["Figma", "UI Design", "Branding", "SEO"],
    competences: ["Conception web", "UI/UX Design", "Branding", "SEO", "Design System", "Architecture de l'information"],
    outils: ["Figma"]
  },
  {
    id: 6,
    title: "Statue de la Liberté — De la photo à l'ASCII",
    category: "Photographie",
    type: "Personnel",
    year: "2025",
    context: "Projet personnel - Expérimentation graphique",
    period: "Août 2025",
    duration: "3 jours",
    description: "Lors de mon voyage à New York, j'ai pris cette photo de la Statue de la Liberté depuis Liberty Island. De retour, j'ai eu envie d'expérimenter : transformer l'image en caractères ASCII\u00A0uniquement.",
    thumbnail: "/images/projects/libertemockup.webp",
    gallery: [
      { src: "/images/projects/Liberté.webp", description: "Statue de la Liberté en art ASCII : Version finale de l'expérimentation graphique transformant la photographie iconique en composition typographique pure." },
      { src: "/images/projects/libertemockup.webp", description: "Mockup de présentation du projet Statue de la Liberté en ASCII." }
    ],
    tags: ["Photoshop", "Photographie"],
    competences: ["Retouche photo", "Art ASCII", "Expérimentation visuelle", "Traitement numérique"],
    outils: ["Adobe Photoshop"]
  },
  {
    id: 7,
    title: "À Cœur Ouvert — Identité visuelle d'une ONG",
    category: "Branding",
    type: "Universitaire",
    year: "2025",
    hidden: true,
    context: "Projet SAE BUT2 - Création d'identité visuelle",
    period: "Novembre - Décembre 2025",
    duration: "4 semaines",
    description: "À Cœur Ouvert est une ONG fictive de lutte contre les violences conjugales. J'ai créé toute l'identité visuelle : le logo, la charte graphique, et j'ai aussi rédigé un article portrait donnant la parole à une victime. Le nom évoque un espace de parole sans jugement. Mon défi : trouver le bon équilibre entre une image rassurante et professionnelle, qui inspire confiance et bienveillance. L'ONG se veut inclusive — accueil universel, écoute 24h/24 — et l'identité devait refléter\u00A0ça.",
    thumbnail: "/images/projects/ACoeurOuvert.svg",
    pdfFile: "/images/projects/portrait.pdf",
    tags: ["Branding", "Illustrator", "InDesign"],
    competences: ["Création d'identité visuelle", "Design graphique", "Charte graphique", "Rédaction de contenu"],
    outils: ["Adobe Illustrator", "Adobe InDesign"]
  },
  {
    id: 8,
    title: "Gummo — Affiche de film",
    category: "Affiches",
    type: "Personnel",
    year: "2026",
    context: "Projet personnel - Création d'affiche de film",
    period: "Janvier 2026",
    duration: "1 semaine",
    description: "Gummo (1997) d'Harmony Korine, c'est un film qui ne laisse pas indifférent. Expérimental, dérangeant, mais aussi étrangement poétique. J'ai voulu créer une affiche qui capture cette ambiance si particulière : l'imagerie trash et nostalgique, les couleurs désaturées des années 90, cette atmosphère désenchantée. La typo s'inspire de l'esthétique lo-fi et underground du cinéma indépendant américain de cette\u00A0époque.",
    thumbnail: "/images/projects/gummomockup.webp",
    youtubeId: "hYalnCwEd5c",
    gallery: [
      { src: "/images/projects/Gummo.webp", description: "Affiche originale du film Gummo (1997)." },
      { src: "/images/projects/gummomockup.webp", description: "Mockup de présentation de l'affiche du film Gummo." }
    ],
    tags: ["Photoshop", "Illustrator"],
    competences: ["Conception d'affiche", "Direction artistique", "Composition visuelle", "Typographie"],
    outils: ["Adobe Photoshop", "Adobe Illustrator"]
  }
];

// ============================================
// EXPÉRIENCES PROFESSIONNELLES
// ============================================
// Section réservée aux stages et alternances
// À remplir au fur et à mesure de vos expériences
export const experiencesPro = [
  // EXEMPLE - À décommenter et remplir après votre stage BUT2 :
  /*
  {
    id: "exp-1",
    title: "Stage BUT2 - [Nom de l'entreprise]",
    category: "Expériences Pro",
    year: "2026",
    period: "Avril - Juin 2026",
    duration: "12 semaines",
    company: "Nom de l'entreprise",
    location: "Ville, Pays",
    context: "Stage de 2ème année de BUT MMI",
    description: "Description de vos missions et réalisations pendant le stage. Soyez précis sur VOS contributions personnelles.",
    tags: ["Compétences utilisées"],
    thumbnail: "/images/projects/stage-thumbnail.jpg",
    // Optionnel :
    gallery: [],
    achievements: [
      "Réalisation 1",
      "Réalisation 2",
      "Réalisation 3"
    ]
  }
  */
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
    skills: ["Photoshop", "Illustrator", "Figma", "InDesign", "Canva", "Lightroom", "Affinity"]
  },
  {
    category: "DÉVELOPPEMENT WEB",
    skills: ["HTML/CSS", "JavaScript", "React", "WordPress", "PHP"]
  },
  {
    category: "AUDIOVISUEL",
    skills: ["Premiere Pro", "DaVinci Resolve", "Blender"]
  },
  {
    category: "BUREAUTIQUE",
    skills: ["Excel", "Word", "PowerPoint"]
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
