import { entre, ease, ajuste } from '../outils';

// Réseau Alumni : un fond bleu université, des points (les anciens élèves)
// apparaissent et se relient entre voisins, le nom du réseau s'affiche, puis
// chaque point s'ouvre en cercle jusqu'à ce que tous se rejoignent sur la page.
const BLEU = '#1f2f6e';
const BLANC = '#f2f3f8';
const BRONZE = '#b89566';
const TITRE = (t) => `600 ${t}px "PP Neue Montreal", sans-serif`;

export default {
  couvre: 550,
  duree: 2350,
  lecture: [1150, 1550], // titre lisible : ralenti (voir TENUE)
  polices: ['600 64px "PP Neue Montreal"'],
  prepare(W, H, r) {
    const n = Math.round(Math.max(26, Math.min(70, (W * H) / 22000)));
    const points = Array.from({ length: n }, () => ({
      x: r.uniform(0.04, 0.96) * W,
      y: r.uniform(0.06, 0.94) * H,
      t: r.uniform(150, 800),
      dephase: r.uniform(0, Math.PI * 2),
    }));
    // trois voisins les plus proches pour chaque point
    const liens = [];
    points.forEach((p, i) => {
      points
        .map((q, j) => [j, Math.hypot(p.x - q.x, p.y - q.y)])
        .filter(([j]) => j !== i)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .forEach(([j]) => { if (i < j || !liens.some(([a, b]) => a === j && b === i)) liens.push([i, j]); });
    });
    const rmax = Math.hypot(W, H) / Math.sqrt(n) * 1.6;
    return { points, liens, rmax };
  },
  dessine(ctx, W, H, ms, etat) {
    const { points, liens } = etat;
    ctx.globalAlpha = ease.out(entre(ms, 0, 550));
    ctx.fillStyle = BLEU;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    // liens : chacun se trace entre ses deux points
    ctx.lineWidth = 1;
    for (const [i, j] of liens) {
      const a = points[i]; const b = points[j];
      const p = ease.inOut(entre(ms, Math.max(a.t, b.t), Math.max(a.t, b.t) + 450));
      if (p <= 0) continue;
      ctx.strokeStyle = 'rgba(242,243,248,0.32)';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p);
      ctx.stroke();
    }
    for (const p of points) {
      const v = ease.out(entre(ms, p.t, p.t + 250));
      if (v <= 0) continue;
      ctx.fillStyle = BLANC;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, 2.5 * v + Math.sin(ms / 180 + p.dephase) * 0.6 * v), 0, Math.PI * 2);
      ctx.fill();
    }
    const a = entre(ms, 900, 1150) * (1 - entre(ms, 1550, 1700));
    if (a > 0) {
      const titre = 'RÉSEAU ALUMNI';
      const taille = ajuste(ctx, titre, TITRE, W * 0.8, Math.min(W, H) * 0.09);
      ctx.globalAlpha = a;
      ctx.font = TITRE(taille);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const w = ctx.measureText(titre).width;
      ctx.fillStyle = BLEU;
      ctx.fillRect(W / 2 - w / 2 - taille * 0.35, H / 2 - taille * 0.75, w + taille * 0.7, taille * 1.95);
      ctx.fillStyle = BLANC;
      ctx.fillText(titre, W / 2, H / 2);
      ctx.font = `400 ${Math.max(11, taille * 0.24)}px "PP Neue Montreal", sans-serif`;
      ctx.fillStyle = BRONZE;
      ctx.fillText('I U T   D E   B O B I G N Y   ·   S O R B O N N E   P A R I S   N O R D', W / 2, H / 2 + taille * 0.82);
      ctx.globalAlpha = 1;
    }
    // ouverture : chaque point devient un cercle qui grandit
    const o = entre(ms, 1600, 2350);
    if (o > 0) {
      ctx.globalCompositeOperation = 'destination-out';
      for (const p of points) {
        const d = ease.in(entre(o, p.t / 1600, 1));
        ctx.beginPath();
        // les cercles finissent par tout couvrir, sans trou
        ctx.arc(p.x, p.y, (etat.rmax + Math.hypot(W, H) * 0.6 * ease.in(entre(o, 0.6, 1))) * d, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  },
};
