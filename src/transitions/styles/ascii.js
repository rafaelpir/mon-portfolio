import { entre, ease, alea, ajuste } from '../outils';

// Statue de la Liberté, de la photo à l'ASCII : l'écran se remplit de
// caractères depuis le centre, ils se brouillent sans cesse, le titre se
// détache, puis les caractères s'éteignent ligne par ligne vers le bas.
const FOND = '#0d0f0e';
const TEXTE = '#e9e6dc';
const VERT = '#5fae84';
const ORANGE = '#e0602e';
const RAMPE = ' .:-=+*#%@';
const MONO = (t) => `500 ${t}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
const TITRE = (t) => `800 ${t}px "PP Neue Montreal", sans-serif`;

export default {
  couvre: 750,
  duree: 2300,
  lecture: [950, 1450], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "PP Neue Montreal"'],
  prepare(W, H, r) {
    const cell = Math.max(10, Math.round(Math.min(W, H) / 52));
    const cols = Math.ceil(W / (cell * 0.62)) + 1;
    const rows = Math.ceil(H / cell) + 1;
    const cellules = [];
    const cx = cols / 2; const cy = rows / 2;
    const dmax = Math.hypot(cx, cy);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const d = Math.hypot(x - cx, (y - cy) * 1.6) / dmax;
        // densité qui rappelle une silhouette claire au centre
        const densite = Math.max(0, 1 - d * 1.15) * 0.8 + r.random() * 0.35;
        cellules.push({
          x, y,
          entree: d * 600 + r.random() * 150,
          sortie: 1500 + (y / rows) * 600 + r.random() * 120,
          densite,
          couleur: r.random() < 0.06 ? ORANGE : r.random() < 0.1 ? VERT : TEXTE,
          graine: r.int(0, 1e6),
        });
      }
    }
    return { cell, cols, rows, cellules };
  },
  dessine(ctx, W, H, ms, etat) {
    const { cell } = etat;
    const cw = cell * 0.62;
    // fond : couvre avec les caractères
    const fond = ease.out(entre(ms, 0, 750));
    ctx.fillStyle = FOND;
    ctx.globalAlpha = fond;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    // à la sortie, le fond s'efface ligne par ligne avec les caractères
    if (ms > 1500) {
      ctx.globalCompositeOperation = 'destination-out';
      const ligne = ((ms - 1500) / 600) * etat.rows;
      ctx.fillRect(0, 0, W, Math.max(0, ligne - 2) * cell);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.font = MONO(cell * 0.95);
    ctx.textBaseline = 'top';
    const tic = Math.floor(ms / 70); // les caractères changent ~14 fois par seconde
    for (const c of etat.cellules) {
      if (ms < c.entree || ms > c.sortie) continue;
      const r = alea(c.graine + tic * 7919);
      const v = Math.min(0.999, c.densite * (0.7 + r.random() * 0.5));
      const ch = RAMPE[Math.floor(v * RAMPE.length)];
      if (ch === ' ') continue;
      ctx.fillStyle = c.couleur;
      ctx.fillText(ch, c.x * cw, c.y * cell);
    }
    // titre sur un bandeau
    const a = entre(ms, 700, 950) * (1 - entre(ms, 1450, 1600));
    if (a > 0) {
      const titre = 'STATUE OF LIBERTY';
      const taille = ajuste(ctx, titre, TITRE, W * 0.82, Math.min(W, H) * 0.09);
      ctx.font = TITRE(taille);
      const w = ctx.measureText(titre).width;
      ctx.globalAlpha = a;
      ctx.fillStyle = FOND;
      ctx.fillRect(W / 2 - w / 2 - taille * 0.4, H / 2 - taille * 0.8, w + taille * 0.8, taille * 1.6);
      ctx.fillStyle = TEXTE;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(titre, W / 2, H / 2);
      ctx.font = MONO(Math.max(11, taille * 0.22));
      ctx.fillStyle = ORANGE;
      ctx.fillText('L I B E R T Y   I S L A N D  ·  N E W   Y O R K', W / 2, H / 2 + taille * 1.25);
      ctx.globalAlpha = 1;
    }
  },
};
