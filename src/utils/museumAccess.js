// Le musée en 3D (/musee) n'est proposé pour l'instant que sur ordinateur :
// écran large, souris ou pavé tactile. Sur téléphone et tablette, les liens
// vers lui sont masqués et la page affiche les affiches à plat.
export const museumAvailable = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
