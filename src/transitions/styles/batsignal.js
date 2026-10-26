import { entre, ease, ajuste } from '../outils';

// Batman, The Dark Knight : la nuit tombe sur Gotham, le bat-signal balaie le
// ciel puis se fige au centre. La chauve-souris fonce ensuite vers l'écran :
// la page apparaît à travers sa silhouette, qui grandit jusqu'à tout couvrir.
const NUIT = '#06070b';
const JAUNE = '#f2c230';
const TITRE = (t) => `800 ${t}px "Coolvetica", "PP Neue Montreal", sans-serif`;

// Logo Batman de 1989 (fichier vectoriel seeklogo « batman-seeklogo.eps »,
// tracé repris tel quel) : centré sur (0, 0), envergure 2 (de -1 à 1), y vers
// le bas. Les bords extérieurs des ailes suivent l'ovale du logo.
const CHAUVE_SOURIS = [
  ['M', 0.441, -0.5043],
  ['C', 0.441, -0.5043, 0.5613, -0.3379, 0.5061, -0.2516],
  ['C', 0.4656, -0.1883, 0.3976, -0.1725, 0.3405, -0.1725],
  ['C', 0.1724, -0.1725, 0.1663, -0.2681, 0.1663, -0.2681],
  ['C', 0.1663, -0.2681, 0.1432, -0.5591, 0.1432, -0.5591],
  ['C', 0.1432, -0.5591, 0.0647, -0.4344, 0.0647, -0.4344],
  ['C', 0.0647, -0.4344, -0.0647, -0.4344, -0.0647, -0.4344],
  ['C', -0.0647, -0.4344, -0.1432, -0.5591, -0.1432, -0.5591],
  ['C', -0.1432, -0.5591, -0.1663, -0.2681, -0.1663, -0.2681],
  ['C', -0.1663, -0.2681, -0.1724, -0.1725, -0.3405, -0.1725],
  ['C', -0.3977, -0.1725, -0.4656, -0.1883, -0.5061, -0.2516],
  ['C', -0.5613, -0.3379, -0.441, -0.5043, -0.441, -0.5043],
  ['C', -0.7721, -0.4127, -1.0, -0.2213, -1.0, 0.0],
  ['C', -1.0, 0.1728, -0.8611, 0.3273, -0.6427, 0.4304],
  ['C', -0.6685, 0.3939, -0.7323, 0.2878, -0.6606, 0.2124],
  ['C', -0.5729, 0.12, -0.4343, 0.1754, -0.3742, 0.2678],
  ['C', -0.3742, 0.2678, -0.3696, 0.1615, -0.2633, 0.1754],
  ['C', -0.1571, 0.1893, -0.0185, 0.314, -0.0, 0.4618],
  ['C', 0.0185, 0.314, 0.1571, 0.1893, 0.2633, 0.1754],
  ['C', 0.3696, 0.1615, 0.3742, 0.2678, 0.3742, 0.2678],
  ['C', 0.4342, 0.1754, 0.5728, 0.12, 0.6606, 0.2124],
  ['C', 0.7322, 0.2878, 0.6685, 0.3939, 0.6426, 0.4304],
  ['C', 0.8611, 0.3273, 1.0, 0.1728, 1.0, 0.0],
  ['C', 1.0, -0.2213, 0.7721, -0.4127, 0.441, -0.5043],
];
// ovale jaune du logo, dans la même unité
const OVALE_RX = 1.1629;
const OVALE_RY = 0.6533;

function chauveSouris(ctx) {
  ctx.beginPath();
  for (const [op, ...v] of CHAUVE_SOURIS) {
    if (op === 'M') ctx.moveTo(v[0], v[1]);
    else if (op === 'L') ctx.lineTo(v[0], v[1]);
    else ctx.bezierCurveTo(v[0], v[1], v[2], v[3], v[4], v[5]);
  }
  ctx.closePath();
}

export default {
  couvre: 450,
  duree: 2400,
  lecture: [1250, 1500], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "Coolvetica"'],
  dessine(ctx, W, H, ms) {
    const m = Math.min(W, H);
    // la nuit tombe
    ctx.globalAlpha = ease.out(entre(ms, 0, 450));
    ctx.fillStyle = NUIT;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    // le faisceau monte du bas et vient se poser au centre
    const balaye = ease.inOut(entre(ms, 200, 1050));
    const cx = W * (0.15 + 0.35 * balaye);
    const cy = H * (0.95 - 0.47 * balaye);
    const rx = m * (0.25 + 0.17 * balaye);
    const ry = rx * (OVALE_RY / OVALE_RX); // proportions de l'ovale du logo
    const allume = entre(ms, 200, 450);
    if (ms < 1600 && allume > 0) {
      // cône de lumière depuis le coin bas gauche
      ctx.globalAlpha = 0.18 * allume;
      ctx.fillStyle = JAUNE;
      ctx.beginPath();
      ctx.moveTo(-20, H + 20);
      ctx.lineTo(cx - rx * 0.9, cy - ry * 0.4);
      ctx.lineTo(cx + rx * 0.9, cy + ry * 0.4);
      ctx.closePath();
      ctx.fill();
      // disque du signal
      ctx.globalAlpha = allume;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      g.addColorStop(0, '#ffe58a'); g.addColorStop(0.75, JAUNE); g.addColorStop(1, 'rgba(242,194,48,0.6)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = NUIT;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(rx / OVALE_RX, rx / OVALE_RX);
      chauveSouris(ctx);
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    // titre
    const a = entre(ms, 1000, 1250) * (1 - entre(ms, 1500, 1650));
    if (a > 0) {
      ctx.globalAlpha = a;
      const titre = 'THE DARK KNIGHT';
      const taille = ajuste(ctx, titre, TITRE, W * 0.8, m * 0.07);
      ctx.font = TITRE(taille);
      ctx.fillStyle = JAUNE;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(titre, W / 2, H / 2 + ry + taille * 0.6);
      ctx.globalAlpha = 1;
    }
    // la chauve-souris fonce vers l'écran : la page apparaît à travers elle
    if (ms >= 1600) {
      const z = ease.expoIn(entre(ms, 1600, 2400));
      const echelle = (rx / OVALE_RX) * (1 + z * 60);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.save();
      ctx.translate(W / 2, H / 2 - echelle * 0.1 * z);
      ctx.scale(echelle, echelle);
      chauveSouris(ctx);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }
  },
};
