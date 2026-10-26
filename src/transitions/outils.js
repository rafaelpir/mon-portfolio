// Outils partagés par les ouvertures de projet (voir src/transitions/index.js).

export const borne = (x, min = 0, max = 1) => Math.min(max, Math.max(min, x));

// progression 0 → 1 entre deux instants (ms)
export const entre = (ms, debut, fin) => borne((ms - debut) / (fin - debut));

export const ease = {
  in: (x) => x * x * x,
  out: (x) => 1 - (1 - x) ** 3,
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
  expoOut: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
  expoIn: (x) => (x <= 0 ? 0 : 2 ** (10 * x - 10)),
};

// Générateur pseudo-aléatoire à graine (mulberry32)
export function alea(graine) {
  let a = graine >>> 0;
  const random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    random,
    int: (min, max) => Math.floor(min + random() * (max - min + 1)),
    uniform: (min, max) => min + random() * (max - min),
    choice: (liste) => liste[Math.floor(random() * liste.length)],
  };
}

// Taille de police pour qu'un texte tienne dans une largeur donnée
export function ajuste(ctx, texte, police, largeurMax, tailleMax) {
  ctx.font = police(tailleMax);
  const w = ctx.measureText(texte).width;
  return w > largeurMax ? (tailleMax * largeurMax) / w : tailleMax;
}

// Grain argentique : petite texture de bruit, à poser en motif
let grainCache = null;
export function grain(ctx, opacite = 26) {
  if (!grainCache) {
    const taille = 160;
    const toile = document.createElement('canvas');
    toile.width = taille; toile.height = taille;
    const c = toile.getContext('2d');
    const img = c.createImageData(taille, taille);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = opacite;
    }
    c.putImageData(img, 0, 0);
    grainCache = toile;
  }
  return ctx.createPattern(grainCache, 'repeat');
}

// Le grain ne se pose que sur ce qui est déjà dessiné (pas sur la page qui apparaît)
export function poseGrain(ctx, W, H, motif) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.translate(-Math.random() * 160, -Math.random() * 160);
  ctx.fillStyle = motif;
  ctx.fillRect(0, 0, W + 160, H + 160);
  ctx.restore();
}

// Titre court du projet en capitales, coupé en lignes d'au plus n caractères
export function lignes(texte, n = 12) {
  const mots = texte.split(/\s+/);
  const out = [];
  let cur = '';
  for (const m of mots) {
    if (cur && (cur + ' ' + m).length > n) { out.push(cur); cur = m; } else { cur = cur ? `${cur} ${m}` : m; }
  }
  if (cur) out.push(cur);
  return out;
}
