import { entre, ease, alea, ajuste } from '../outils';

// Iris, sculpture de verre liquide : une bulle irisée naît au centre et
// gonfle jusqu'à nous envelopper. À l'intérieur, un ciel pâle traversé de
// reflets d'interférence, comme une paroi de savon. Puis la bulle éclate
// d'un point : la paroi se déchire en un cercle aux bords irisés, quelques
// gouttelettes s'envolent, et la page apparaît.
const CIEL_HAUT = '#8fb3d6';
const CIEL_BAS = '#e3ebf1';
const BLANC = '#ffffff';
const FIN_GONFLE = 800;
const ECLATE = 1600;
const FIN = 2250;
const TITRE = (t) => `300 ${t}px "PP Neue Montreal", sans-serif`;

// Dégradé d'interférence (magenta, cyan, jaune…) autour d'un point
function irise(ctx, x, y, angle = 0) {
  if (ctx.createConicGradient) {
    const g = ctx.createConicGradient(angle, x, y);
    ['#ff7ad9', '#7af0ff', '#fff27a', '#9a7aff', '#7affb5', '#ff7ad9'].forEach((c, i, l) => g.addColorStop(i / (l.length - 1), c));
    return g;
  }
  return '#c9a7ff';
}

function ciel(ctx, W, H, ms, etat) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, CIEL_HAUT); g.addColorStop(1, CIEL_BAS);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // reflets d'interférence qui dérivent lentement
  const t = ms / 1000;
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  for (const r of etat.reflets) {
    const x = (r.x + Math.sin(t * r.v + r.p) * 0.08) * W;
    const y = (r.y + Math.cos(t * r.v * 0.8 + r.p) * 0.06) * H;
    const rad = r.r * Math.max(W, H);
    const halo = ctx.createRadialGradient(x, y, 0, x, y, rad);
    halo.addColorStop(0, `hsla(${r.h + t * 40},90%,70%,0.9)`);
    halo.addColorStop(1, `hsla(${r.h + 60 + t * 40},90%,70%,0)`);
    ctx.fillStyle = halo;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  ctx.restore();
}

export default {
  couvre: FIN_GONFLE,
  duree: FIN,
  lecture: [950, 1500], // titre lisible : ralenti (voir TENUE)
  polices: ['300 64px "PP Neue Montreal"'],
  prepare(W, H, r) {
    const reflets = Array.from({ length: 6 }, () => ({
      x: r.uniform(0.1, 0.9), y: r.uniform(0.1, 0.9), r: r.uniform(0.25, 0.5),
      v: r.uniform(0.6, 1.4), p: r.uniform(0, 6), h: r.uniform(0, 360),
    }));
    const px = W * r.uniform(0.6, 0.78); const py = H * r.uniform(0.25, 0.4); // point d'éclatement
    const gouttes = Array.from({ length: 46 }, () => ({
      a: r.uniform(0, Math.PI * 2), v: r.uniform(0.25, 1), t: r.uniform(4, 10),
    }));
    return { reflets, px, py, gouttes, r: alea(r.int(0, 1e6)) };
  },
  dessine(ctx, W, H, ms, etat) {
    const diag = Math.hypot(W, H);
    if (ms < ECLATE) {
      // la bulle gonfle depuis le centre
      const g = ease.inOut(entre(ms, 0, FIN_GONFLE));
      const rayon = diag * 0.56 * g;
      if (rayon < 1) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, rayon, 0, Math.PI * 2);
      ctx.clip();
      ciel(ctx, W, H, ms, etat);
      ctx.restore();
      if (g < 1) {
        // paroi irisée et reflet de lumière
        ctx.lineWidth = 3 + rayon * 0.025;
        ctx.strokeStyle = irise(ctx, W / 2, H / 2, ms / 600);
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(W / 2, H / 2, rayon, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = BLANC;
        ctx.lineWidth = Math.max(2, rayon * 0.03);
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(W / 2, H / 2, rayon * 0.82, Math.PI * 1.08, Math.PI * 1.38); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // titre
      const a = entre(ms, 850, 1100) * (1 - entre(ms, 1450, ECLATE));
      if (a > 0) {
        const taille = ajuste(ctx, 'IRIS', TITRE, W * 0.6, Math.min(W, H) * 0.3);
        ctx.globalAlpha = a;
        ctx.font = TITRE(taille);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = taille * 0.15;
        ctx.fillStyle = BLANC;
        ctx.fillText('IRIS', W / 2, H / 2 - taille * 0.05);
        ctx.shadowBlur = 0;
        ctx.font = `400 ${Math.max(11, taille * 0.09)}px "PP Neue Montreal", sans-serif`;
        ctx.fillText('S C U L P T U R E   D E   V E R R E   L I Q U I D E', W / 2, H / 2 + taille * 0.55);
        ctx.globalAlpha = 1;
      }
      return;
    }
    // la bulle éclate depuis un point : trou irisé qui s'agrandit très vite
    ciel(ctx, W, H, ms, etat);
    const p = ease.out(entre(ms, ECLATE, FIN - 80));
    const rayon = diag * 1.2 * p;
    const { px, py } = etat;
    ctx.lineWidth = 6 + 18 * (1 - p);
    ctx.strokeStyle = irise(ctx, px, py, ms / 300);
    ctx.globalAlpha = 1 - p * 0.6;
    ctx.beginPath(); ctx.arc(px, py, rayon + ctx.lineWidth / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(px, py, rayon, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // gouttelettes projetées
    for (const g of etat.gouttes) {
      const d = rayon * (0.6 + g.v * 0.5);
      const x = px + Math.cos(g.a) * d; const y = py + Math.sin(g.a) * d + p * p * H * 0.1;
      ctx.globalAlpha = 0.85 * (1 - p);
      ctx.fillStyle = irise(ctx, x, y, g.a);
      ctx.beginPath(); ctx.arc(x, y, g.t * (1 - p * 0.7), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
};
