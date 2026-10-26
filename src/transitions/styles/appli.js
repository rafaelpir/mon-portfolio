import { entre, ease, ajuste } from '../outils';

// Veco : comme le lancement d'une application. Un écran arrondi vert grandit
// depuis le centre jusqu'à remplir la fenêtre, le logo apparaît avec une
// barre de chargement, puis un cercle s'ouvre au centre sur la page.
const VERT = '#3db38e';
const VERT_FONCE = '#2a8f70';
const BLANC = '#ffffff';
const POLICE = (t) => `800 ${t}px "Inter Display", "PP Neue Montreal", sans-serif`;

function rectArrondi(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default {
  couvre: 650,
  duree: 2100,
  lecture: [700, 1400], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "Inter Display"'],
  dessine(ctx, W, H, ms) {
    const g = ease.expoOut(entre(ms, 0, 650));
    // l'écran d'app part de la taille d'une icône
    const w0 = Math.min(W, H) * 0.14;
    const w = w0 + (W + 4 - w0) * g;
    const h = w0 + (H + 4 - w0) * g;
    const r = (1 - g) * w0 * 0.28 + 2;
    ctx.fillStyle = VERT;
    rectArrondi(ctx, (W - w) / 2, (H - h) / 2, w, h, r);
    ctx.fill();
    if (ms > 350) {
      // logo + barre de chargement
      const a = entre(ms, 350, 650) * (1 - entre(ms, 1400, 1550));
      const taille = ajuste(ctx, 'VECO', POLICE, W * 0.5, Math.min(W, H) * 0.16);
      ctx.globalAlpha = a;
      ctx.fillStyle = BLANC;
      ctx.font = POLICE(taille * (0.94 + 0.06 * ease.out(entre(ms, 350, 900))));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VECO', W / 2, H / 2 - taille * 0.15);
      const bw = Math.min(W * 0.4, taille * 2.6);
      const by = H / 2 + taille * 0.6;
      ctx.fillStyle = VERT_FONCE;
      ctx.fillRect(W / 2 - bw / 2, by, bw, 3);
      ctx.fillStyle = BLANC;
      ctx.fillRect(W / 2 - bw / 2, by, bw * ease.inOut(entre(ms, 500, 1350)), 3);
      ctx.globalAlpha = 1;
    }
    // ouverture : un cercle se creuse au centre
    const o = ease.in(entre(ms, 1450, 2100));
    if (o > 0) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, Math.hypot(W, H) * 0.52 * o, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  },
};
