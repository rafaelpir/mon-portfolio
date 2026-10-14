// Vrai quand le site tourne dans une iframe : c'est le cas de la page d'accueil
// vivante que le musée affiche derrière sa porte de sortie. Cette copie ne
// doit ni compter comme une visite, ni envoyer de mesures de performance.
export const EMBEDDED_COPY = typeof window !== 'undefined' && window.self !== window.top;

// Appareil tactile (téléphone, tablette) : le musée y passe en version
// allégée, avec un joystick pour marcher.
export const touchDevice = () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Le musée en 3D (/musee) se visite sur ordinateur (fenêtre d'au moins
// 1024 px, souris ou pavé tactile) et sur appareil tactile. Seule une fenêtre
// d'ordinateur trop étroite est refusée.
export const museumAvailable = () =>
  typeof window !== 'undefined' && (touchDevice() || window.matchMedia('(min-width: 1024px)').matches);
