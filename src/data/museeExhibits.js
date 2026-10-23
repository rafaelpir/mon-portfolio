// Affiches exposées au musée (/musee), dans l'ordre de la visite (alternance
// mur gauche / mur droit). `image` : fichier dans public/images/musee/ ;
// `slug` : fiche projet correspondante ; `note` : précision sur le cartel
// quand plusieurs affiches viennent du même projet ; `video` : œuvre animée,
// jouée en boucle et sans le son dans son cadre (l'image sert d'attente) ;
// `videoRatio` : largeur / hauteur de la vidéo (au-delà de 1, l'écran est à
// l'horizontale) ; `title`, `text` : titre et texte propres à l'œuvre, quand
// elle n'est qu'une partie de son projet.
export const MUSEE_EXHIBITS = [
  { image: 'homme-qui-dort', slug: 'un-homme-qui-dort' },
  { image: 'sade', slug: 'poster-sade-diamond-life' },
  { image: 'gummo', slug: 'affiche-gummo' },
  { image: 'liberte', slug: 'statue-liberte-ascii' },
  { image: 'monaco', slug: 'grand-prix-monaco' },
  { image: 'kaka', slug: 'affiche-kaka' },
  { image: 'balotelli', slug: 'affiche-balotelli' },
  { image: 'alicia', slug: 'coffret-alicia-keys', note: 'Affiche de tournée' },
  { image: 'iris', slug: 'iris', video: '/videos/iris.mp4', videoRatio: 4 / 5, note: 'Œuvre vidéo' },
  {
    image: 'iris-anomalie',
    slug: 'iris',
    video: '/videos/iris-anomalie.mp4',
    videoRatio: 4 / 3,
    note: 'Œuvre vidéo',
    title: { fr: 'Anomalie', en: 'Anomalie' },
    text: {
      fr: "Iris incrustée dans un vrai plan de rivière, puis filmée comme par un caméscope de 2003 : cadre 4:3, grain, couleurs qui bavent et date incrustée. Une vidéo amateur qui aurait capté quelque chose d'inexpliqué.",
      en: 'Iris composited into real river footage, then filmed as if by a 2003 camcorder: 4:3 frame, grain, bleeding colours and a burned-in date. A home video that caught something unexplained.',
    },
  },
  { image: 'portrait-ouzbek', slug: 'portrait-ouzbek', video: '/videos/portrait-ouzbek.mp4', videoRatio: 720 / 1082, note: 'Œuvre vidéo' },
];

// Adresse du musée qui amène directement devant l'affiche d'un projet, ou
// null si le projet n'y est pas exposé.
export function museumLinkFor(slug) {
  const exhibit = MUSEE_EXHIBITS.find((item) => item.slug === slug);
  return exhibit ? `/musee?affiche=${exhibit.image}` : null;
}
