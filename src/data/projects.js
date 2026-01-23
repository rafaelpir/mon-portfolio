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
    description: "Revisite personnelle de l'affiche classique du film 'Un Homme qui dort' (1974). Conservation de la typographie culte originale avec changement radical de l'iconographie : gros plans texturés et granuleux pour matérialiser l'ennui et l'introspection par la matière plutôt que par le vide. Expérimentation visuelle sur le thème de l'isolement et de la\u00A0mélancolie.",
    thumbnail: "/images/projects/lhommequidort.webp",
    youtubeId: "LUMifnAPafc",
    gallery: [
      { src: "/images/projects/homme-qui-dort/1.webp", description: "Image 1 - À compléter" },
      { src: "/images/projects/homme-qui-dort/2.webp", description: "Image 2 - À compléter" },
      { src: "/images/projects/homme-qui-dort/3.webp", description: "Image 3 - À compléter" }
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
    description: "Affiche créée pour le concours officiel de la ville de Saint-Paul-lès-Dax. Au lieu de suivre les codes rouge et blanc classiques des ferias, choix du bleu en référence au Lac de Christus et à l'ambiance estivale de cette ville thermale. La Grande Roue structure la composition et surplombe les scènes locales (course landaise, bandas, folklore). Le flat design apporte clarté et légèreté pour toucher un public\u00A0familial.",
    thumbnail: "/images/projects/Dax.webp",
    gallery: [
      { src: "/images/projects/dax/1.webp", description: "Image 1 - À compléter" },
      { src: "/images/projects/dax/2.webp", description: "Image 2 - À compléter" },
      { src: "/images/projects/dax/3.webp", description: "Image 3 - À compléter" }
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
    description: "Hommage personnel à l'album Diamond Life de Sade (1984). Capturer visuellement la sophistication soul/jazz de cet album iconique à travers un traitement rétro avec effet halftone prononcé rappelant les vieilles impressions de journaux. Palette sépia/marron chaud évoquant le vinyle et une nostalgie luxueuse. Contraste typographique entre serif grasse condensée et signature manuscrite renforçant l'élégance\u00A0intemporelle.",
    thumbnail: "/images/projects/sade.webp",
    gallery: [
      { src: "/images/projects/sade/1.webp", description: "Image 1 - À compléter" },
      { src: "/images/projects/sade/2.webp", description: "Image 2 - À compléter" },
      { src: "/images/projects/sade/3.webp", description: "Image 3 - À compléter" }
    ],
    tags: ["Photoshop"],
    competences: ["Design d'affiche", "Traitement rétro", "Typographie", "Composition visuelle"],
    outils: ["Adobe Photoshop"]
  },
  {
    id: 4,
    title: "UI Design & Branding : Application Veco",
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
    description: "Conception d'une interface web pour une agence immobilière fictive avec contrainte majeure : optimisation SEO aux normes 2025. L'objectif n'était pas seulement esthétique, mais la conception d'une structure performante pour le référencement naturel. Création de l'identité visuelle complète (logo et Design System) lisible et impactante, déclinable sur tous supports numériques sans alourdir le chargement. Les maquettes Figma (Accueil et Page Lots) travaillent la hiérarchie visuelle pour guider l'utilisateur et faciliter l'indexation par les moteurs de\u00A0recherche.",
    thumbnail: "/images/projects/armorimmo.webp",
    figmaEmbed: "https://embed.figma.com/proto/IySCrSMWMDsUfz9bO51rrz/Site-Immo-Referencement?page-id=6%3A32&node-id=16-2&viewport=154%2C281%2C0.18&scaling=scale-down&content-scaling=fixed&starting-point-node-id=16%3A2&embed-host=share",
    gallery: [
      { src: "/images/projects/armorimmo/1.webp", description: "Image 1 - À compléter" },
      { src: "/images/projects/armorimmo/2.webp", description: "Image 2 - À compléter" },
      { src: "/images/projects/armorimmo/3.webp", description: "Image 3 - À compléter" }
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
    description: "Expérimentation graphique à partir d'une photographie de la Statue de la Liberté prise depuis Liberty Island à New York. Transformation de l'image en composition entièrement faite de caractères ASCII. Le défi : réinterpréter un monument iconique avec un langage purement numérique et typographique. Le résultat joue sur une tension visuelle : de loin, reconnaissance de la statue ; de près, uniquement du texte. La statue devient une structure de données, entre photographie et code\u00A0informatique.",
    thumbnail: "/images/projects/Liberté.webp",
    gallery: [
      { src: "/images/projects/Liberté.webp", description: "Statue de la Liberté en art ASCII : Version finale de l'expérimentation graphique transformant la photographie iconique en composition typographique pure." },
      { src: "/images/projects/LibertéVerte.webp", description: "Variation verte de la Statue de la Liberté : Déclinaison colorée de la composition ASCII avec une palette verte rappelant la patine du monument." }
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
    context: "Projet SAE BUT2 - Création d'identité visuelle",
    period: "Novembre - Décembre 2025",
    duration: "4 semaines",
    description: "Création complète de l'identité visuelle pour À Cœur Ouvert, ONG fictive de lutte contre les violences conjugales. Conception du logo de A à Z, développement de la charte graphique (typographie, couleurs, usages) et rédaction d'un article portrait donnant la parole à une victime. Le nom 'À Cœur Ouvert' symbolise un espace de parole sans jugement. Mon challenge : créer une identité à la fois rassurante et professionnelle, qui véhicule confiance et bienveillance tout en marquant le positionnement inclusif de l'ONG (accueil universel sans distinction de genre, écoute 24h/24 et\u00A07j/7).",
    thumbnail: "/images/projects/ACoeurOuvert.svg",
    pdfFile: "/images/projects/portrait.pdf",
    gallery: [
      { src: "/images/projects/acoeurouvert/1.webp", description: "Image 1 - À compléter" },
      { src: "/images/projects/acoeurouvert/2.webp", description: "Image 2 - À compléter" },
      { src: "/images/projects/acoeurouvert/3.webp", description: "Image 3 - À compléter" }
    ],
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
    description: "Création d'une affiche pour Gummo (1997), film culte de Harmony Korine. Ce film expérimental et controversé explore la marginalité américaine avec une esthétique crue et poétique. L'affiche capture l'univers étrange et dérangeant du film : ambiance désenchantée, imagerie trash et nostalgique, palette de couleurs désaturées évoquant les années 90. Travail typographique inspiré de l'esthétique lo-fi et underground du cinéma indépendant américain de cette\u00A0époque.",
    thumbnail: "/images/projects/Gummo.webp",
    gallery: [
      { src: "/images/projects/gummo/1.webp", description: "Image 1 - À compléter" },
      { src: "/images/projects/gummo/2.webp", description: "Image 2 - À compléter" },
      { src: "/images/projects/gummo/3.webp", description: "Image 3 - À compléter" }
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
