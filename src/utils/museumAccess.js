// Vrai quand le site tourne dans une iframe : c'est le cas de la page d'accueil
// vivante que le musée affiche derrière sa porte de sortie. Cette copie ne
// doit ni compter comme une visite, ni envoyer de mesures de performance.
export const EMBEDDED_COPY = typeof window !== 'undefined' && window.self !== window.top;

// Appareil tactile (téléphone, tablette) : le musée y passe en version
// allégée, avec un joystick pour marcher.
export const touchDevice = () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Téléphone : appareil tactile dont le petit côté de l'écran fait moins de
// 768 px. Le musée n'y est pas proposé (la 3D y est trop dégradée).
export const phoneDevice = () =>
  typeof window !== 'undefined' && touchDevice() && Math.min(window.screen.width, window.screen.height) < 768;

// Le musée en 3D (/musee) se visite sur ordinateur (fenêtre d'au moins
// 1024 px, souris ou pavé tactile) et sur tablette. Il est retiré du site sur
// téléphone (carte de l'accueil et liens des projets masqués).
export const museumAvailable = () =>
  typeof window !== 'undefined' && !phoneDevice() && (touchDevice() || window.matchMedia('(min-width: 1024px)').matches);
