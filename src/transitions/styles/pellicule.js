import { entre, ease, alea, ajuste, grain, poseGrain } from '../outils';

// Gummo : une pellicule 35 mm défile dans le projecteur, ralentit et se cale
// sur l'image du titre, qui scintille comme à la projection. Puis la
// pellicule brûle depuis un point : un trou au bord incandescent s'élargit et
// la page apparaît dedans.
const NOIR = '#0b0907';
const IMAGE = '#26221d';
const PERFO = '#d9d1c1';
const BLANC = '#f4f0e6';
const ORANGE = '#e07a2a';
const TITRE = (t) => `800 ${t}px "PP Neue Montreal", sans-serif`;
const PETIT = (t) => `600 ${t}px ui-monospace, Menlo, monospace`;
const DEFILE = 1150; // fin du défilement
const BRULE = 1750; // début de la brûlure
const FIN = 2600;
const N = 6; // images qui défilent avant le titre

function film(ctx, W, H, ms, etat) {
  const r = alea(Math.floor(ms / 50));
  ctx.fillStyle = NOIR;
  ctx.fillRect(0, 0, W, H);
  const bord = Math.max(26, W * 0.06); // bandes perforées à gauche et à droite
  const hImage = Math.min(H * 0.86, (W - bord * 2) * 0.75);
  const pasImage = hImage + H * 0.06;
  const p = ease.out(entre(ms, 0, DEFILE));
  const tremble = ms > DEFILE ? (r.random() - 0.5) * 2 : 0; // léger flottement du film
  const decal = (1 - p) * N * pasImage + tremble;
  const x0 = bord + W * 0.02; const wImage = W - 2 * x0;
  // images : la dernière (index 0) porte le titre
  for (let k = 0; k <= N; k += 1) {
    const y = (H - hImage) / 2 - k * pasImage + decal;
    if (y > H || y + hImage < 0) continue;
    ctx.fillStyle = k === 0 ? '#1c1916' : IMAGE;
    ctx.fillRect(x0, y, wImage, hImage);
    if (k > 0) {
      // images floues de la projection : un aplat clair qui bouge
      ctx.fillStyle = 'rgba(244,240,230,0.06)';
      ctx.fillRect(x0 + wImage * 0.2, y + hImage * (0.2 + 0.1 * Math.sin(k)), wImage * 0.6, hImage * 0.5);
    } else {
      const taille = ajuste(ctx, 'GUMMO', TITRE, wImage * 0.78, hImage * 0.42);
      ctx.fillStyle = BLANC;
      ctx.font = TITRE(taille);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GUMMO', W / 2, y + hImage / 2 - taille * 0.08);
      ctx.font = PETIT(Math.max(11, taille * 0.12));
      ctx.fillText('H A R M O N Y   K O R I N E   ·   1 9 9 7', W / 2, y + hImage / 2 + taille * 0.62);
    }
    // marquage du bord de pellicule
    ctx.save();
    ctx.translate(bord * 0.5, y + hImage / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = PETIT(Math.max(9, bord * 0.28));
    ctx.fillStyle = ORANGE;
    ctx.textAlign = 'center';
    ctx.fillText(`KODAK 5245   ${String(24 - k).padStart(2, '0')}`, 0, bord * 0.05);
    ctx.restore();
  }
  // perforations
  const hp = Math.max(10, bord * 0.42); const wp = bord * 0.42; const pasP = hp * 1.9;
  ctx.fillStyle = PERFO;
  for (let y = (decal % pasP) - pasP; y < H; y += pasP) {
    for (const x of [bord * 0.2, W - bord * 0.2 - wp]) {
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, wp, hp, 3) : ctx.rect(x, y, wp, hp);
      ctx.fill();
    }
  }
  // scintillement du projecteur
  ctx.fillStyle = `rgba(255,236,200,${0.03 + r.random() * 0.05})`;
  ctx.fillRect(0, 0, W, H);
  poseGrain(ctx, W, H, etat.motif);
}

// Contour irrégulier de la brûlure : rayon modulé par un bruit lissé
// deux échelles de bruit : de grandes avancées irrégulières et une dentelle fine
const lisse = (tab, f) => {
  const n = tab.length;
  const i0 = Math.floor(f) % n; const i1 = (i0 + 1) % n; const u = f - Math.floor(f);
  return tab[i0] * (1 - u) + tab[i1] * u;
};

function trou(ctx, cx, cy, rayon, bruit, t, k) {
  ctx.beginPath();
  const N = 140;
  for (let i = 0; i <= N; i += 1) {
    const a = (i / N) * Math.PI * 2;
    const grand = lisse(bruit.grand, (i / N) * bruit.grand.length);
    const fin = lisse(bruit.fin, (i / N) * bruit.fin.length + t * 3);
    const rr = rayon * k * (1 + 0.3 * grand + 0.07 * fin);
    const x = cx + Math.cos(a) * rr; const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export default {
  couvre: 350,
  duree: FIN,
  lecture: [1150, 1700], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "PP Neue Montreal"'],
  prepare(W, H, r) {
    return {
      bruit: {
        grand: Array.from({ length: 9 }, () => r.uniform(-1, 1) * r.uniform(0.3, 1)),
        fin: Array.from({ length: 70 }, () => r.uniform(-1, 1)),
      },
      cx: W * r.uniform(0.3, 0.7), cy: H * r.uniform(0.3, 0.7),
    };
  },
  dessine(ctx, W, H, ms, etat) {
    if (!etat.motif) etat.motif = grain(ctx, 40);
    ctx.globalAlpha = ease.out(entre(ms, 0, 350));
    film(ctx, W, H, ms, etat);
    ctx.globalAlpha = 1;
    if (ms < BRULE) return;
    // la pellicule brûle
    const p = ease.in(entre(ms, BRULE, FIN - 50));
    const rayon = Math.hypot(W, H) * 1.4 * p + 4; // assez grand pour emporter les coins
    const t = ms / 1000;
    const { cx, cy, bruit } = etat;
    ctx.fillStyle = 'rgba(40,14,2,0.75)'; // film roussi
    trou(ctx, cx, cy, rayon, bruit, t, 1.32); ctx.fill();
    ctx.fillStyle = ORANGE;
    trou(ctx, cx, cy, rayon, bruit, t, 1.12); ctx.fill();
    ctx.fillStyle = '#ffe2a6';
    trou(ctx, cx, cy, rayon, bruit, t, 1.04); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    trou(ctx, cx, cy, rayon, bruit, t, 1); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  },
};
