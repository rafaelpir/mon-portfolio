import { entre, ease, ajuste } from '../outils';

// Grand Prix de Monaco : la grille de départ. L'écran passe au noir, les cinq
// feux rouges s'allument un par un, tout passe au vert, et des traînées de
// vitesse arrachent le noir vers la droite : c'est parti.
const NOIR = '#0b0b0d';
const ROUGE = '#e1001a';
const VERT = '#18d36b';
const ETEINT = '#1e1416';
const BLANC = '#ffffff';
// Futura du site illisible par certains navigateurs : Bebas Neue prend le relais
const FUTURA = (t) => `700 ${t}px "Futura Condensed Bold", "Bebas Neue", sans-serif`;
const ALLUME = [350, 620, 890, 1160, 1430]; // un feu rouge de plus toutes les 270 ms
const FEU_VERT = 1950;
const DEPART = 2450;
const FIN = 3100;

function scene(ctx, W, H, ms) {
  ctx.fillStyle = NOIR;
  ctx.fillRect(0, 0, W, H);
  const m = Math.min(W, H);
  const r = Math.min(W / 16, m * 0.055);
  const pas = r * 2.9;
  const x0 = W / 2 - pas * 2;
  const y0 = H * 0.38;
  const vert = ms >= FEU_VERT;
  // portique
  ctx.fillStyle = '#18181c';
  ctx.fillRect(x0 - r * 1.6, y0 - r * 2.6, pas * 4 + r * 3.2, r * 5.2);
  ALLUME.forEach((t, i) => {
    const x = x0 + i * pas;
    // rangée du haut : rouges ; rangée du bas : verts au départ
    const rouge = ms >= t && !vert;
    for (const [dy, couleur, allume] of [[-r * 1.2, ROUGE, rouge], [r * 1.2, vert ? VERT : ROUGE, vert || rouge]]) {
      ctx.fillStyle = allume ? couleur : ETEINT;
      if (allume) { ctx.shadowColor = couleur; ctx.shadowBlur = r * 1.4; }
      ctx.beginPath();
      ctx.arc(x, y0 + dy, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });
  // lueur verte sur tout l'écran au moment du départ
  if (vert) {
    ctx.fillStyle = `rgba(24,211,107,${0.12 * (1 - entre(ms, FEU_VERT, FEU_VERT + 450))})`;
    ctx.fillRect(0, 0, W, H);
  }
  const a = entre(ms, 400, 650);
  if (a > 0) {
    ctx.globalAlpha = a;
    const titre = 'GRAND PRIX DE MONACO';
    const taille = ajuste(ctx, titre, FUTURA, W * 0.86, m * 0.1);
    ctx.font = FUTURA(taille);
    ctx.fillStyle = BLANC;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(titre, W / 2, y0 + r * 3.6);
    ctx.font = FUTURA(taille * 0.42);
    ctx.fillStyle = vert ? VERT : ROUGE;
    ctx.fillText('04 – 07 JUIN 2026 · 83E ÉDITION', W / 2, y0 + r * 3.6 + taille * 1.1);
    ctx.globalAlpha = 1;
  }
}

export default {
  couvre: 300,
  duree: FIN + 50,
  polices: ['700 64px "Futura Condensed Bold"', '400 64px "Bebas Neue"'],
  prepare(W, H, r) {
    const trainees = Array.from({ length: 30 }, () => ({
      y: r.uniform(0, H), h: r.uniform(1, 6), retard: r.uniform(0, 260), long: r.uniform(0.25, 0.7),
      vert: r.random() < 0.4,
    }));
    return { trainees };
  },
  dessine(ctx, W, H, ms, etat) {
    if (ms < DEPART) {
      ctx.globalAlpha = ease.out(entre(ms, 0, 300));
      scene(ctx, W, H, ms);
      ctx.globalAlpha = 1;
      return;
    }
    // départ : le noir est arraché vers la droite par un front incliné
    const p = ease.in(entre(ms, DEPART, FIN));
    const front = -W * 0.3 + p * W * 1.6;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(front, 0);
    ctx.lineTo(W + 10, 0);
    ctx.lineTo(W + 10, H);
    ctx.lineTo(front - W * 0.25, H);
    ctx.closePath();
    ctx.clip();
    scene(ctx, W, H, ms);
    ctx.restore();
    // traînées de vitesse devant le front
    for (const t of etat.trainees) {
      const q = ease.in(entre(ms, DEPART + t.retard, FIN));
      if (q <= 0 || q >= 1) continue;
      const x = -W * 0.4 + q * W * 1.8;
      const l = W * t.long;
      const g = ctx.createLinearGradient(x - l, 0, x, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, t.vert ? VERT : BLANC);
      ctx.fillStyle = g;
      ctx.fillRect(x - l, t.y, l, t.h);
    }
  },
};
