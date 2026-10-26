// Moteur de la transition glitch Balotelli : montage des plans et dessin
// d'une image dans un contexte 2D. Sans React, pour pouvoir dessiner
// n'importe quelle image à part (tests, aperçus).

export const C = {
  fond: '#040707',
  texte: '#f2f2f2',
  bleu: '#08018C',
  or: '#A39261',
  orClair: '#d0bb7c',
  gris: '#8c8c94',
  grisClair: '#bdbdc8',
  grisFonce: '#3d3d4c',
};

const POLICE = '"PP Neue Montreal", system-ui, sans-serif';
export const FPS = 30;

// Déclarations réelles, en langue originale (voir le projet TouchDesigner).
const CITATIONS = [
  'I could write a book of 200 pages about my two years with Mario. But the book would not be a drama, it would be a comedy.',
  'The talent is still there – no doubt about it.',
  'If you played with me, 10 years ago, I give to you every day one punch in your head!',
  'Balotelli è italiano perché ha la cittadinanza italiana, ma non potrà mai essere del tutto italiano.',
  'Il problema è che io sono italiano.',
  "Il calcio è uno sport di squadra, e l'intelligenza conta più dei piedi.",
  'Io sono forte, e voi?',
  "I don't celebrate because I'm just doing my job. When a postman delivers letters, does he celebrate?",
  'One of the greatest strikers of recent times.',
];
const MOTS = CITATIONS.join(' ').split(/\s+/);

const MODES = ['caps', 'espace', 'colonnesNoir', 'colonnesBleu', 'droite', 'denseNoir', 'denseBleu'];
const FOND_BLEU = new Set(['caps', 'colonnesBleu', 'denseBleu']);

// Petit générateur pseudo-aléatoire à graine (mulberry32) : un même plan
// garde sa mise en page, seuls les surlignages changent d'une image à l'autre.
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
    choice: (liste) => liste[Math.floor(random() * liste.length)],
    uniform: (min, max) => min + random() * (max - min),
  };
}

export function montage(r) {
  const plans = [];
  let f = 0;
  let precedent = null;
  const ajoute = (plan) => {
    plans.push({ seed: Math.floor(r.random() * 1e9), ...plan, start: f });
    f += plan.n;
  };
  const rafale = (k, durees) => {
    for (let i = 0; i < k; i += 1) {
      const mode = r.choice(MODES.filter((m) => m !== precedent));
      precedent = mode;
      ajoute({ mode, n: r.choice(durees) });
    }
  };
  ajoute({ mode: 'vide', n: 1 });
  rafale(5, [2, 3, 3, 4]);
  ajoute({ mode: 'gros', n: 9, phrase: 'WHY ALWAYS ME?', drop: 0.4 });
  rafale(3, [2, 3]);
  // Fin : « MARIO BALOTELLI » se reconstruit au centre puis reste, avant le fondu sur la page
  ajoute({ mode: 'gros', n: 26, phrase: 'MARIO BALOTELLI', fixe: true, seed: 45 });
  return { plans, total: f };
}

// Style d'un mot dans les plans denses : [couleur de boîte ou null, couleur du texte]
function style(r, fond) {
  const x = r.random();
  const table = fond === 'noir'
    ? [[0.5, null, C.texte], [0.58, null, C.gris], [0.68, C.or, C.fond], [0.78, C.bleu, C.texte],
       [0.83, C.orClair, C.fond], [0.88, C.grisFonce, C.texte], [0.93, C.texte, C.fond], [0.97, null, C.or], [1, null, C.orClair]]
    : [[0.55, null, C.texte], [0.67, C.fond, C.texte], [0.77, C.or, C.fond], [0.83, C.texte, C.fond],
       [0.9, C.orClair, C.fond], [0.95, null, C.grisClair], [1, null, C.orClair]];
  const ligne = table.find(([seuil]) => x <= seuil) || table[table.length - 1];
  return [ligne[1], ligne[2]];
}

export function creeDessin(ctx, W, H) {
  const k = Math.min(W, H) / 720; // les tailles sont pensées pour 720 px de large
  const largeurs = new Map();

  const police = (taille, graisse = 400) => {
    const p = `${graisse} ${taille}px ${POLICE}`;
    if (ctx.font !== p) ctx.font = p;
    return p;
  };
  const lettre = (p, ch) => {
    const cle = p + ch;
    let w = largeurs.get(cle);
    if (w === undefined) {
      w = ctx.measureText(ch).width;
      largeurs.set(cle, w);
    }
    return w;
  };
  const longueur = (p, texte, track = 0) => {
    let w = 0;
    for (const ch of texte) w += lettre(p, ch);
    return w + track * Math.max(texte.length - 1, 0);
  };
  const rect = (x, y, w, h, couleur) => {
    ctx.fillStyle = couleur;
    ctx.fillRect(x, y, w, h);
  };
  // Un mot dessiné lettre par lettre : certaines lettres disparaissent (drop).
  const mot = (x, y, texte, taille, graisse, boite, couleur, drop, r, h, track = 0, largeurBoite = null, pad = 3) => {
    const p = police(taille, graisse);
    const largeur = longueur(p, texte, track);
    if (boite) rect(x - pad * k, y, (largeurBoite ?? largeur) + 2 * pad * k, h, boite);
    ctx.fillStyle = couleur;
    let cx = x;
    for (const ch of texte) {
      if (r.random() >= drop) ctx.fillText(ch, cx, y + h / 2);
      cx += lettre(p, ch) + track;
    }
    return largeur;
  };
  const extrait = (r, n) => {
    const i = r.int(0, MOTS.length - 1);
    return Array.from({ length: n }, (_, j) => MOTS[(i + j) % MOTS.length]);
  };

  const modes = {
    gros(plan, fr, r, t) {
      const lay = alea(plan.seed);
      const fixe = Boolean(plan.fixe);
      const lignes = fixe && W > H ? [plan.phrase] : plan.phrase.split(' ');
      let taille = lay.choice([84, 96, 110]) * k * (W > H ? 1.35 : 1.7);
      // le mot le plus long tient toujours dans 92 % de la largeur
      const plusLong = Math.max(...lignes.map((m) => longueur(police(taille, 800), m) + 6 * k * m.length));
      if (plusLong > W * 0.92) taille *= (W * 0.92) / plusLong;
      const lh = taille * 1.18;
      // plan fixe : les lettres arrivent sur les 40 premiers % puis tout reste en place
      const drop = fixe ? Math.max(0, 0.8 - 2 * t) : plan.drop ?? 0.72 - 0.35 * t;
      const p = police(taille, 800);
      const y0 = fixe ? (H - lh * lignes.length) / 2 : lay.int(20, Math.max(21, H - lh * (lignes.length + 3)));
      lignes.forEach((m, li) => {
        const y = y0 + li * lh * (fixe ? 1 : lay.choice([1, 1, 2]));
        let x = fixe
          ? (W - longueur(p, m) - 6 * k * m.length) / 2
          : lay.int(-40 * k, Math.max(-39 * k, W - longueur(p, m) - 10));
        let n = 0;
        for (const ch of m) {
          const cw = lettre(p, ch);
          n += 1;
          if (ch !== ' ' && r.random() >= drop) {
            // plan fixe : chaque lettre garde sa couleur, rien ne clignote
            const v = fixe ? alea(plan.seed * 97 + li * 31 + n).random() : r.random();
            const [boite, couleur] = v < 0.45 ? [C.bleu, C.texte] : v < 0.6 ? [C.or, C.fond] : v < 0.72 ? [C.texte, C.fond] : [null, C.texte];
            if (boite) rect(x - 4 * k, y, cw + 8 * k, lh - 6 * k, boite);
            police(taille, 800);
            ctx.fillStyle = couleur;
            ctx.fillText(ch, x, y + (lh - 6 * k) / 2);
          }
          x += cw + 6 * k;
        }
      });
      if (fixe && drop === 0) return;
      for (let i = r.int(0, 3); i > 0; i -= 1) {
        rect(r.int(0, W - 120 * k), r.int(0, H - 60 * k), r.int(60, 260) * k, r.int(30, 60) * k, r.choice([C.bleu, C.texte, C.or]));
      }
    },
    caps(plan, fr, r, t) {
      const lay = alea(plan.seed);
      const taille = 44 * k; const track = 14 * k; const lh = 58 * k;
      const mots = extrait(lay, 160);
      let y = lay.int(-20, 30) * k; let i = 0;
      while (y < H && i < mots.length) {
        let x = lay.int(-90, 10) * k;
        while (x < W + 40 * k && i < mots.length) {
          const m = mots[i].toUpperCase(); i += 1;
          const v = r.random();
          const [boite, couleur] = v < 0.07 ? [C.fond, C.texte] : v < 0.1 ? [null, C.or] : [null, C.texte];
          const w = mot(x, y, m, taille, 400, boite, couleur, 0.3 + 0.25 * t, r, lh - 6 * k, track);
          if (couleur === C.or) rect(x, y + lh - 10 * k, w, 3 * k, C.or);
          x += w + 40 * k;
        }
        y += lh;
      }
    },
    espace(plan, fr, r, t) {
      const lay = alea(plan.seed);
      const taille = 30 * k; const track = 13 * k; const lh = 36 * k;
      const mots = extrait(lay, 120);
      const p = police(taille);
      let i = 0;
      for (let row = 0; row < H / lh; row += 1) {
        if (lay.random() < 0.45) continue;
        const y = row * lh;
        let x = lay.int(-30 * k, W / 2);
        for (let j = lay.int(1, 3); j > 0; j -= 1) {
          const m = mots[i % mots.length]; i += 1;
          const v = r.random();
          const [boite, couleur] = v < 0.25 ? [C.grisFonce, C.texte] : v < 0.35 ? [C.or, C.fond] : v < 0.43 ? [C.texte, C.fond] : v < 0.48 ? [C.bleu, C.texte] : [null, C.texte];
          const bw = boite ? longueur(p, m, track) + r.int(0, 160) * k : null;
          const w = mot(x, y, m, taille, 400, boite, couleur, 0.15 + 0.3 * t, r, lh - 4 * k, track, bw);
          x += (bw ?? w) + lay.int(30, 120) * k;
        }
      }
    },
    colonnes(plan, fr, r, t, fond) {
      const lay = alea(plan.seed);
      const taille = 23 * k; const lh = 27 * k;
      const cols = Math.max(5, Math.round(W / (144 * k)));
      const cw = W / cols;
      const rows = Math.ceil(H / lh) + 1;
      const mots = extrait(lay, cols * rows);
      const vide = 0.15 + 0.55 * t;
      for (let c = 0; c < cols; c += 1) {
        for (let row = 0; row < rows; row += 1) {
          if (lay.random() < vide * 0.6 || r.random() < vide * 0.4) continue;
          const p = r.random();
          let boite; let couleur;
          if (fond === 'noir') {
            [boite, couleur] = p < 0.12 ? [C.or, C.fond] : p < 0.18 ? [C.grisFonce, C.texte] : p < 0.24 ? [null, C.or]
              : p < 0.27 ? [C.bleu, C.texte] : p < 0.45 ? [null, C.gris] : [null, C.texte];
          } else {
            [boite, couleur] = p < 0.08 ? [C.or, C.fond] : p < 0.12 ? [C.fond, C.texte] : p < 0.55 ? [null, C.grisClair] : [null, C.texte];
          }
          mot(c * cw + 4 * k, row * lh, mots[c * rows + row], taille, 400, boite, couleur, 0, r, lh - 1, 0, cw - 8 * k, 2);
        }
      }
    },
    droite(plan, fr, r, t) {
      const lay = alea(plan.seed);
      const taille = 46 * k; const lh = 54 * k;
      const p = police(taille);
      const espace = lettre(p, ' ');
      const base = extrait(lay, 40);
      const lignes = [];
      let cur = [];
      for (const m of base) {
        cur.push(m);
        if (longueur(p, cur.join(' ')) > W * lay.uniform(0.7, 1.15)) { lignes.push(cur); cur = []; }
      }
      if (!lignes.length) lignes.push(base.slice(0, 4));
      let y = lay.int(-30, 10) * k; let n = 0;
      while (y < H) {
        const ligne = lignes[n % lignes.length]; n += 1;
        let x = W - longueur(p, ligne.join(' ')) - lay.choice([8, 8, -60, 40]) * k;
        for (const m of ligne) {
          const v = r.random();
          const [boite, couleur] = v < 0.22 ? [C.bleu, C.texte] : v < 0.28 ? [C.or, C.fond] : v < 0.34 ? [C.texte, C.fond] : [null, C.texte];
          x += mot(x, y, m, taille, 400, boite, couleur, 0.04 * t, r, lh - 2 * k) + espace;
        }
        y += lh;
      }
    },
    dense(plan, fr, r, t, fond) {
      const lay = alea(plan.seed);
      const taille = lay.choice([20, 22]) * k; const lh = taille * 1.08;
      const p = police(taille);
      const espace = lettre(p, ' ');
      const mots = extrait(lay, 1600);
      const larg = W + 60 * k; const x0 = -30 * k;
      let y = -lay.int(0, 20) * k - fr * 2 * k; let i = 0;
      while (y < H && i < mots.length) {
        const ligne = []; let lw = 0;
        while (i < mots.length && lw + longueur(p, mots[i]) < larg) {
          ligne.push(mots[i]); lw += longueur(p, mots[i]) + espace; i += 1;
        }
        const ecart = espace + (larg - lw) / Math.max(ligne.length - 1, 1);
        let x = x0;
        for (const m of ligne) {
          const w = longueur(p, m);
          if (r.random() < 0.05 + 0.1 * t) {
            rect(x, y, w, lh - 1, fond === 'noir' ? C.grisFonce : C.fond);
          } else {
            const [boite, couleur] = style(r, fond);
            mot(x, y, m, taille, 400, boite, couleur, 0.06 + 0.1 * t, r, lh, 0, null, 1);
          }
          x += w + ecart;
        }
        y += lh;
      }
    },
  };

  return (plan, fr) => {
    const t = fr / Math.max(plan.n - 1, 1);
    const r = alea(plan.seed * 1000 + Math.floor(fr / 2)); // les surlignages changent toutes les 2 images
    rect(0, 0, W, H, FOND_BLEU.has(plan.mode) ? C.bleu : C.fond);
    switch (plan.mode) {
      case 'vide': return false;
      case 'gros': modes.gros(plan, fr, r, t); break;
      case 'caps': modes.caps(plan, fr, r, t); break;
      case 'espace': modes.espace(plan, fr, r, t); break;
      case 'colonnesNoir': modes.colonnes(plan, fr, r, t, 'noir'); break;
      case 'colonnesBleu': modes.colonnes(plan, fr, r, t, 'bleu'); break;
      case 'droite': modes.droite(plan, fr, r, t); break;
      case 'denseNoir': modes.dense(plan, fr, r, t, 'noir'); break;
      case 'denseBleu': modes.dense(plan, fr, r, t, 'bleu'); break;
      default: break;
    }
    return true;
  };
}

// Grain argentique : une petite texture de bruit répétée, décalée à chaque image.
export function creeGrain() {
  const taille = 160;
  const toile = document.createElement('canvas');
  toile.width = taille; toile.height = taille;
  const c = toile.getContext('2d');
  const img = c.createImageData(taille, taille);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 26;
  }
  c.putImageData(img, 0, 0);
  return toile;
}
