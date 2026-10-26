import { entre, ease, ajuste } from '../outils';

// Ricardo Kaká : le maillot rossonero. Des bandes rouges et noires montent
// du bas de l'écran en vague, « KAKÁ » s'inscrit en grand avec le 22, puis
// chaque bande se referme sur elle-même et laisse passer la page.
const ROUGE = '#b5141f';
const NOIR = '#0b0b0b';
const CREME = '#f0e1c0';
const BEBAS = (t) => `400 ${t}px "Bebas Neue", "Futura Condensed Bold", sans-serif`;

export default {
  couvre: 750,
  duree: 2300,
  lecture: [1000, 1550], // titre lisible : ralenti (voir TENUE)
  polices: ['400 64px "Bebas Neue"'],
  prepare(W) {
    const largeur = Math.max(48, Math.min(90, W / 12));
    const n = Math.ceil(W / largeur);
    return { largeur, n };
  },
  dessine(ctx, W, H, ms, etat) {
    const { largeur, n } = etat;
    for (let i = 0; i < n; i += 1) {
      const x = i * largeur;
      // montée en vague depuis le centre
      const d = Math.abs(i + 0.5 - n / 2) / (n / 2);
      const monte = ease.out(entre(ms, d * 300, d * 300 + 450));
      // fermeture : la bande se pince vers son milieu (centre en premier)
      const ferme = ease.inOut(entre(ms, 1600 + d * 250, 1600 + d * 250 + 450));
      const w = largeur * (1 - ferme);
      if (monte <= 0 || w <= 0.2) continue;
      ctx.fillStyle = i % 2 ? NOIR : ROUGE;
      ctx.fillRect(x + (largeur - w) / 2, H * (1 - monte), w + 0.6, H * monte + 1);
    }
    const a = entre(ms, 750, 1000) * (1 - entre(ms, 1550, 1700));
    if (a > 0) {
      const taille = ajuste(ctx, 'KAKÁ', BEBAS, W * 0.8, H * 0.42);
      ctx.globalAlpha = a;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // 22 en contour derrière
      ctx.font = BEBAS(taille * 1.5);
      ctx.strokeStyle = 'rgba(240,225,192,0.35)';
      ctx.lineWidth = 2;
      ctx.strokeText('22', W / 2, H / 2);
      ctx.font = BEBAS(taille);
      ctx.fillStyle = CREME;
      const glisse = (1 - ease.out(entre(ms, 750, 1100))) * taille * 0.15;
      ctx.fillText('KAKÁ', W / 2, H / 2 + taille * 0.04 + glisse);
      ctx.font = BEBAS(taille * 0.2);
      ctx.fillText('R I C A R D O', W / 2, H / 2 - taille * 0.52 + glisse);
      ctx.globalAlpha = 1;
    }
  },
};
