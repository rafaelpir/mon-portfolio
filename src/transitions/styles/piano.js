import { entre, ease, ajuste } from '../outils';

// Coffret 20 ans Alicia Keys : un clavier de piano tombe du haut de l'écran
// en glissando, touche après touche, sous une lumière dorée ; une gamme se
// joue (les touches s'enfoncent), puis les touches remontent une à une.
const IVOIRE = '#f3ead7';
const NOIR = '#16110c';
const OR = '#d9a24e';
const TITRE = (t) => `700 ${t}px "Bodoni Moda", Didot, Georgia, serif`;
const MOTIF_NOIRES = [1, 1, 0, 1, 1, 1, 0]; // une noire après do, ré, fa, sol, la

export default {
  couvre: 800,
  duree: 2400,
  lecture: [1200, 1500], // titre lisible : ralenti (voir TENUE)
  polices: ['700 64px "Bodoni Moda"'],
  prepare(W, H) {
    const n = Math.max(9, Math.round(W / Math.max(52, W / 15)));
    const lb = W / n;
    const blanches = Array.from({ length: n }, (_, i) => ({ x: i * lb, w: lb, i }));
    const noires = [];
    for (let i = 0; i < n - 1; i += 1) {
      if (MOTIF_NOIRES[i % 7]) noires.push({ x: (i + 1) * lb - lb * 0.3, w: lb * 0.6, i: i + 0.5 });
    }
    return { n, lb, blanches, noires };
  },
  dessine(ctx, W, H, ms, etat) {
    const { n } = etat;
    const hn = H * 0.58; // longueur des touches noires
    // une touche tombe (entrée) puis remonte (sortie), décalées en glissando
    const position = (i, noire) => {
      const decal = (i / n) * 420 + (noire ? 90 : 0);
      const descente = ease.out(entre(ms, decal, decal + 380));
      const montee = ease.in(entre(ms, 1600 + decal * 0.9 + (noire ? -60 : 0), 1600 + decal * 0.9 + 380));
      return -H * (1 - descente) - H * 1.05 * montee;
    };
    // gamme : chaque blanche s'enfonce à son tour
    const enfonce = (i) => {
      const t = (ms - 900 - (i / n) * 520) / 160;
      return t > 0 && t < 1 ? Math.sin(t * Math.PI) * H * 0.012 : 0;
    };
    for (const k of etat.blanches) {
      const y = position(k.i, false) + enfonce(k.i);
      if (y <= -H) continue;
      ctx.fillStyle = IVOIRE;
      ctx.fillRect(k.x, y - 24, k.w + 0.5, H + 24); // déborde en haut : une touche enfoncée ne laisse pas de jour
      ctx.fillStyle = 'rgba(22,17,12,0.25)';
      ctx.fillRect(k.x + k.w - 1, y, 1, H);
      // ombre dorée en bas des touches
      const g = ctx.createLinearGradient(0, y + H * 0.7, 0, y + H);
      g.addColorStop(0, 'rgba(217,162,78,0)'); g.addColorStop(1, 'rgba(217,162,78,0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(k.x, y + H * 0.7, k.w, H * 0.3);
    }
    for (const k of etat.noires) {
      const y = position(k.i, true);
      if (y <= -hn) continue;
      ctx.fillStyle = NOIR;
      ctx.fillRect(k.x, y, k.w, hn);
      ctx.fillStyle = 'rgba(217,162,78,0.18)';
      ctx.fillRect(k.x + k.w * 0.15, y + hn - 10, k.w * 0.7, 4);
    }
    // titre gravé or sur le bas du clavier
    const a = entre(ms, 950, 1200) * (1 - entre(ms, 1500, 1620));
    if (a > 0) {
      const titre = 'ALICIA KEYS';
      const taille = ajuste(ctx, titre, TITRE, W * 0.82, Math.min(W, H) * 0.12);
      ctx.globalAlpha = a;
      ctx.font = TITRE(taille);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = OR;
      ctx.fillText(titre, W / 2, H * 0.79);
      ctx.font = `400 ${Math.max(11, taille * 0.2)}px "PP Neue Montreal", sans-serif`;
      ctx.fillStyle = NOIR;
      ctx.fillText('T H E   2 0 T H   A N N I V E R S A R Y', W / 2, H * 0.79 + taille * 0.75);
      ctx.globalAlpha = 1;
    }
  },
};
