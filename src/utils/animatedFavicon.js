// Favicon animée : l'icône est un disque percé (favicon.png) qui tourne sur
// lui-même comme un CD, sous un reflet fixe. Le navigateur n'animant pas
// lui-même une favicon (hors GIF/SVG sous Firefox), on redessine l'icône
// dans un canvas et on remplace le href du <link rel="icon"> image par image.
// Sans effet sous Safari (qui ne rafraîchit pas la favicon) : il garde
// simplement l'icône fixe déclarée dans index.html.

const SIZE = 64;
const HOLE = 0.22; // rayon du trou central, en fraction du rayon du disque (comme favicon.png)
// Les navigateurs ne rafraîchissent l'icône d'un onglet que quelques fois par
// seconde, quel que soit le rythme auquel on la change. Pour que ça paraisse
// fluide malgré tout : rotation lente (petit angle entre deux images
// réellement affichées) et cadence modérée mais régulière, plutôt que 30
// images/s dont le navigateur saute une partie de façon irrégulière.
const TURN = 7000; // durée d'un tour complet
const FRAMES = 105; // images par tour, soit 15 images/s

export function startAnimatedFavicon() {
  if (typeof document === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const half = SIZE / 2;

    // Masque en anneau (disque moins le trou) : sans lui, le reflet
    // déborderait sur les zones transparentes.
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.arc(half, half, half * HOLE, 0, Math.PI * 2);
    ctx.clip('evenodd');

    // Reflet de CD : deux faisceaux opposés, fixes pendant que le disque
    // tourne dessous. `color-dodge` éclaircit le rouge mais laisse le noir
    // des lettres intact.
    let sheen = null;
    if (ctx.createConicGradient) {
      sheen = ctx.createConicGradient(-Math.PI / 3, half, half);
      const clear = 'rgba(255, 255, 255, 0)';
      const light = 'rgba(255, 235, 225, 0.8)';
      [0, 0.5].forEach((at) => {
        sheen.addColorStop(at, clear);
        sheen.addColorStop(at + 0.09, light);
        sheen.addColorStop(at + 0.18, clear);
      });
      sheen.addColorStop(1, clear);
    }

    // Le reflet étant fixe, l'animation est exactement périodique : on rend
    // une fois pour toutes les images d'un tour, puis on ne fait plus que
    // changer de href (pas d'encodage PNG à chaque image, donc fluide).
    const frames = [];
    for (let i = 0; i < FRAMES; i++) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.translate(half, half);
      ctx.rotate((i / FRAMES) * Math.PI * 2);
      ctx.drawImage(image, -half, -half, SIZE, SIZE);
      ctx.restore();

      if (sheen) {
        ctx.globalCompositeOperation = 'color-dodge';
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, SIZE, SIZE);
      }
      frames.push(canvas.toDataURL('image/png'));
    }

    // requestAnimationFrame : calé sur l'affichage, et suspendu de lui-même
    // quand l'onglet est masqué.
    link.type = 'image/png';
    let current = -1;
    const tick = (now) => {
      const index = Math.floor(((now % TURN) / TURN) * FRAMES);
      if (index !== current) {
        current = index;
        link.href = frames[index];
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  image.src = '/favicon.png';
}
