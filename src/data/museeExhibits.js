// Affiches exposées au musée (/musee), dans l'ordre de la visite (alternance
// mur gauche / mur droit). `image` : fichier dans public/images/musee/ ;
// `slug` : fiche projet correspondante ; `note` : précision sur le cartel
// quand plusieurs affiches viennent du même projet.
export const MUSEE_EXHIBITS = [
  { image: 'homme-qui-dort', slug: 'un-homme-qui-dort' },
  { image: 'sade', slug: 'poster-sade-diamond-life' },
  { image: 'gummo', slug: 'affiche-gummo' },
  { image: 'liberte', slug: 'statue-liberte-ascii' },
  { image: 'monaco', slug: 'grand-prix-monaco' },
  { image: 'kaka', slug: 'affiche-kaka' },
  { image: 'balotelli', slug: 'affiche-balotelli' },
  { image: 'alicia', slug: 'coffret-alicia-keys', note: 'Affiche de tournée' },
];

// Adresse du musée qui amène directement devant l'affiche d'un projet, ou
// null si le projet n'y est pas exposé.
export function museumLinkFor(slug) {
  const exhibit = MUSEE_EXHIBITS.find((item) => item.slug === slug);
  return exhibit ? `/musee?affiche=${exhibit.image}` : null;
}
