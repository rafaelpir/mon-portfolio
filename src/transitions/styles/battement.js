import { entre, ease, ajuste } from '../outils';

// À Cœur Ouvert : l'écran s'assombrit, un tracé de battement de cœur le
// traverse, le cœur bat deux fois, puis l'écran s'ouvre par le milieu comme
// deux portes : un cœur ouvert.
const FOND = '#16070b';
const ROUGE = '#e0344f';
const ROSE = '#f6c9d1';
const TITRE = (t) => `800 ${t}px "PP Neue Montreal", sans-serif`;

// Tracé d'électrocardiogramme : plat, puis deux battements
function ecg(W, H) {
  const y = H / 2;
  const a = Math.min(W, H) * 0.16;
  const pts = [[0, y]];
  const battement = (x) => {
    pts.push([x, y], [x + 14, y - a * 0.15], [x + 26, y], [x + 40, y], [x + 50, y + a * 0.25],
      [x + 64, y - a], [x + 80, y + a * 0.55], [x + 94, y], [x + 120, y], [x + 140, y - a * 0.2], [x + 162, y]);
  };
  battement(W * 0.28);
  battement(W * 0.28 + Math.max(175, W * 0.22));
  pts.push([W, y]);
  return pts;
}

function coeur(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y - s * 0.1, x - s * 0.5, y + s * 0.25);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.55, x - s * 0.1, y + s * 0.75, x, y + s);
  ctx.bezierCurveTo(x + s * 0.1, y + s * 0.75, x + s * 0.5, y + s * 0.55, x + s * 0.5, y + s * 0.25);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.1, x, y, x, y + s * 0.3);
  ctx.closePath();
}

function scene(ctx, W, H, ms, etat) {
  ctx.fillStyle = FOND;
  ctx.fillRect(0, 0, W, H);
  // tracé qui avance, avec une traîne lumineuse
  const p = ease.inOut(entre(ms, 150, 1050));
  const pts = etat.pts;
  const xmax = W * p;
  ctx.strokeStyle = ROUGE;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.shadowColor = ROUGE;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) {
    const [x, y] = pts[i];
    if (x > xmax) {
      const [px, py] = pts[i - 1];
      ctx.lineTo(xmax, py + ((y - py) * (xmax - px)) / Math.max(1, x - px));
      break;
    }
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  // le cœur bat deux fois
  const b = ms - 950;
  if (b > 0) {
    const pulse = 1 + 0.12 * Math.max(0, Math.sin(Math.min(b, 500) / 500 * Math.PI * 2)) ;
    const s = Math.min(W, H) * 0.12 * pulse * ease.out(entre(ms, 950, 1150));
    ctx.fillStyle = ROUGE;
    coeur(ctx, W / 2, H / 2 - s * 0.62, s);
    ctx.fill();
  }
  const a = entre(ms, 1150, 1400);
  if (a > 0) {
    ctx.globalAlpha = a;
    const titre = 'À CŒUR OUVERT';
    const taille = ajuste(ctx, titre, TITRE, W * 0.8, Math.min(W, H) * 0.075);
    ctx.font = TITRE(taille);
    ctx.fillStyle = ROSE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(titre, W / 2, H / 2 + Math.min(W, H) * 0.12);
    ctx.globalAlpha = 1;
  }
}

export default {
  couvre: 450,
  duree: 2400,
  lecture: [1400, 1650], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "PP Neue Montreal"'],
  prepare: (W, H) => ({ pts: ecg(W, H) }),
  dessine(ctx, W, H, ms, etat) {
    if (ms < 1650) {
      ctx.globalAlpha = ease.out(entre(ms, 0, 450));
      scene(ctx, W, H, ms, etat);
      ctx.globalAlpha = 1;
      return;
    }
    // les deux portes s'ouvrent depuis le milieu
    if (!etat.cliche) {
      etat.cliche = document.createElement('canvas');
      etat.cliche.width = ctx.canvas.width; etat.cliche.height = ctx.canvas.height;
      const c = etat.cliche.getContext('2d');
      c.setTransform(ctx.canvas.width / W, 0, 0, ctx.canvas.height / H, 0, 0);
      scene(c, W, H, 1650, etat);
    }
    const d = ease.inOut(entre(ms, 1650, 2400)) * (W / 2 + 20);
    const cw = ctx.canvas.width; const ch = ctx.canvas.height; const k = cw / W;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(etat.cliche, 0, 0, cw / 2, ch, -d * k, 0, cw / 2, ch);
    ctx.drawImage(etat.cliche, cw / 2, 0, cw / 2, ch, cw / 2 + d * k, 0, cw / 2, ch);
  },
};
