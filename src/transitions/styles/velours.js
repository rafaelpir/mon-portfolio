import { entre, ease, grain, poseGrain, ajuste } from '../outils';

// Sade, Diamond Life : la lumière baisse comme dans un club de jazz, un filet
// d'or traverse l'écran, le titre en italique s'approche, puis l'écran
// s'ouvre en deux le long du filet.
const FOND = '#120b07';
const OR = '#c9a35e';
const OR_CLAIR = '#ead39c';
const ITALIQUE = (t) => `italic 400 ${t}px "Playfair Display", "Bodoni Moda", Georgia, serif`;
const BODONI = (t) => `700 ${t}px "Bodoni Moda", Didot, Georgia, serif`;

function scene(ctx, W, H, ms, etat) {
  // fond velours avec un halo chaud au centre
  ctx.fillStyle = FOND;
  ctx.fillRect(0, 0, W, H);
  const halo = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
  halo.addColorStop(0, 'rgba(120,72,30,0.35)');
  halo.addColorStop(1, 'rgba(18,11,7,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  // filet d'or qui se déploie depuis le centre
  const filet = ease.out(entre(ms, 250, 1000));
  if (filet > 0) {
    const l = W * 0.9 * filet;
    const g = ctx.createLinearGradient(W / 2 - l / 2, 0, W / 2 + l / 2, 0);
    g.addColorStop(0, 'rgba(201,163,94,0)'); g.addColorStop(0.5, OR_CLAIR); g.addColorStop(1, 'rgba(201,163,94,0)');
    ctx.fillStyle = g;
    ctx.fillRect(W / 2 - l / 2, H / 2 - 0.75, l, 1.5);
  }
  // titre : l'interlettrage se resserre en apparaissant
  const a = entre(ms, 650, 1150);
  if (a > 0) {
    const titre = 'Diamond Life';
    const taille = ajuste(ctx, titre, ITALIQUE, W * 0.8, Math.min(W, H) * 0.16);
    const ecart = (1 - ease.out(a)) * taille * 0.35;
    ctx.globalAlpha = a;
    ctx.fillStyle = OR_CLAIR;
    ctx.font = ITALIQUE(taille);
    ctx.textBaseline = 'alphabetic';
    let largeur = 0;
    for (const ch of titre) largeur += ctx.measureText(ch).width + ecart;
    let x = W / 2 - (largeur - ecart) / 2;
    for (const ch of titre) { ctx.fillText(ch, x, H / 2 - taille * 0.22); x += ctx.measureText(ch).width + ecart; }
    const petit = Math.max(11, taille * 0.16);
    ctx.font = BODONI(petit);
    ctx.fillStyle = OR;
    const sous = 'S  A  D  E     ·     1 9 8 4';
    ctx.fillText(sous, W / 2 - ctx.measureText(sous).width / 2, H / 2 + petit * 2.2);
    ctx.globalAlpha = 1;
  }
  poseGrain(ctx, W, H, etat.motif);
}

export default {
  couvre: 650,
  duree: 2400,
  lecture: [1150, 1650], // titre lisible : ralenti (voir TENUE)
  polices: ['italic 400 64px "Playfair Display"', '700 64px "Bodoni Moda"'],
  prepare: () => ({}),
  dessine(ctx, W, H, ms, etat) {
    if (!etat.motif) etat.motif = grain(ctx, 22);
    if (ms < 1650) {
      // la lumière baisse
      ctx.globalAlpha = ease.inOut(entre(ms, 0, 650));
      scene(ctx, W, H, ms, etat);
      ctx.globalAlpha = 1;
      return;
    }
    // ouverture : les deux moitiés s'écartent le long du filet
    if (!etat.cliche) {
      etat.cliche = document.createElement('canvas');
      etat.cliche.width = ctx.canvas.width; etat.cliche.height = ctx.canvas.height;
      const c = etat.cliche.getContext('2d');
      c.setTransform(ctx.canvas.width / W, 0, 0, ctx.canvas.height / H, 0, 0);
      scene(c, W, H, 1650, etat);
    }
    const d = ease.inOut(entre(ms, 1650, 2400)) * (H / 2 + 20);
    const cw = ctx.canvas.width; const ch = ctx.canvas.height; const k = ch / H;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(etat.cliche, 0, 0, cw, ch / 2, 0, -d * k, cw, ch / 2);
    ctx.drawImage(etat.cliche, 0, ch / 2, cw, ch / 2, 0, ch / 2 + d * k, cw, ch / 2);
  },
};
