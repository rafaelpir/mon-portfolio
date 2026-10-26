import { entre, ease, ajuste } from '../outils';

// Armor Immo : un papier bleu d'architecte glisse sur l'écran, la grille et
// le plan d'une maison se tracent au trait, puis le papier repart de l'autre
// côté et laisse la page.
const BLEU = '#173a63';
const TRAIT = 'rgba(234,242,255,0.9)';
const GRILLE = 'rgba(234,242,255,0.12)';
const LEMON = (t) => `700 ${t}px "Lemon Milk", "PP Neue Montreal", sans-serif`;

// Longueur cumulée d'un tracé (liste de segments) pour le dessiner au fil du temps
function trace(ctx, segments, progression) {
  const total = segments.reduce((s, [a, b]) => s + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
  let reste = total * progression;
  ctx.beginPath();
  for (const [a, b] of segments) {
    if (reste <= 0) break;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const f = Math.min(1, reste / l);
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
    reste -= l;
  }
  ctx.stroke();
}

export default {
  couvre: 600,
  duree: 2400,
  lecture: [1350, 1650], // titre lisible : ralenti (voir TENUE)
  polices: ['700 64px "Lemon Milk"'],
  prepare(W, H) {
    const u = Math.min(W, H) * 0.0011; // unité ~ 1 à l'échelle 900 px
    const cx = W / 2; const cy = H / 2 - 40 * u;
    const lw = 300 * u; const mh = 170 * u; const toit = 120 * u;
    const x0 = cx - lw / 2; const y0 = cy - mh / 2 + toit / 2;
    const P = (x, y) => [x, y];
    const maison = [
      [P(x0, y0 + mh), P(x0 + lw, y0 + mh)],
      [P(x0 + lw, y0 + mh), P(x0 + lw, y0)],
      [P(x0 + lw, y0), P(cx, y0 - toit)],
      [P(cx, y0 - toit), P(x0, y0)],
      [P(x0, y0), P(x0, y0 + mh)],
      // porte
      [P(cx - 24 * u, y0 + mh), P(cx - 24 * u, y0 + mh - 80 * u)],
      [P(cx - 24 * u, y0 + mh - 80 * u), P(cx + 24 * u, y0 + mh - 80 * u)],
      [P(cx + 24 * u, y0 + mh - 80 * u), P(cx + 24 * u, y0 + mh)],
      // fenêtres
      [P(x0 + 40 * u, y0 + 40 * u), P(x0 + 90 * u, y0 + 40 * u)],
      [P(x0 + 90 * u, y0 + 40 * u), P(x0 + 90 * u, y0 + 85 * u)],
      [P(x0 + 90 * u, y0 + 85 * u), P(x0 + 40 * u, y0 + 85 * u)],
      [P(x0 + 40 * u, y0 + 85 * u), P(x0 + 40 * u, y0 + 40 * u)],
      [P(x0 + lw - 90 * u, y0 + 40 * u), P(x0 + lw - 40 * u, y0 + 40 * u)],
      [P(x0 + lw - 40 * u, y0 + 40 * u), P(x0 + lw - 40 * u, y0 + 85 * u)],
      [P(x0 + lw - 40 * u, y0 + 85 * u), P(x0 + lw - 90 * u, y0 + 85 * u)],
      [P(x0 + lw - 90 * u, y0 + 85 * u), P(x0 + lw - 90 * u, y0 + 40 * u)],
    ];
    // cote sous la maison
    const cote = [[P(x0, y0 + mh + 26 * u), P(x0 + lw, y0 + mh + 26 * u)]];
    return { u, maison, cote, bas: y0 + mh + 26 * u };
  },
  dessine(ctx, W, H, ms, etat) {
    const { u } = etat;
    // le papier entre par la gauche, ressort par la droite
    const entree = ease.inOut(entre(ms, 0, 600));
    const sortie = ease.inOut(entre(ms, 1650, 2400));
    const gauche = sortie * (W + 40);
    const droite = entree * (W + 40);
    if (droite <= gauche) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(gauche, 0, droite - gauche, H);
    ctx.clip();
    ctx.fillStyle = BLEU;
    ctx.fillRect(0, 0, W, H);
    // grille de 40 px
    ctx.strokeStyle = GRILLE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0.5; x < W; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0.5; y < H; y += 40) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
    // plan de la maison, tracé au fil du temps
    ctx.strokeStyle = TRAIT;
    ctx.lineWidth = Math.max(1.5, 2 * u);
    ctx.lineCap = 'round';
    trace(ctx, etat.maison, ease.inOut(entre(ms, 250, 1250)));
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1;
    trace(ctx, etat.cote, ease.out(entre(ms, 1000, 1350)));
    ctx.setLineDash([]);
    // nom
    const a = entre(ms, 1050, 1350);
    if (a > 0) {
      ctx.globalAlpha = a;
      ctx.fillStyle = TRAIT;
      const taille = ajuste(ctx, 'ARMOR IMMO', LEMON, W * 0.7, 44 * u + 10);
      ctx.font = LEMON(taille);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('ARMOR IMMO', W / 2, etat.bas + 34 * u);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // bord du papier
    ctx.fillStyle = 'rgba(234,242,255,0.8)';
    if (droite < W) ctx.fillRect(droite - 2, 0, 2, H);
    if (gauche > 0) ctx.fillRect(gauche, 0, 2, H);
  },
};
