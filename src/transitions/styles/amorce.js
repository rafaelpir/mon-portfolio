import { entre, ease, grain, poseGrain } from '../outils';

// Inventaire & Le Sommeil : une rafale d'archives, comme dans les films.
// Le noir tombe, douze images des deux films défilent en coupes de plus en
// plus courtes, le titre tient en blanc sur noir, puis coupe franche sur la
// page.
const NOIR = '#0b0b0b';
const BLANC = '#efece6';
const GRIS = '#8f8c85';
const POLICE = (t) => `800 ${t}px "PP Neue Montreal", Helvetica, sans-serif`;
const FINE = (t) => `400 ${t}px "PP Neue Montreal", Helvetica, sans-serif`;

const DOSSIER = '/images/projects/inventaire-le-sommeil/rafale/';
const NB = 12;
// durée de chaque plan (ms) : la rafale accélère
const PLANS = [170, 150, 130, 115, 100, 90, 80, 70, 60, 50, 50, 50];
const DEBUT = 300;
const FIN_RAFALE = DEBUT + PLANS.reduce((a, b) => a + b, 0);
const FIN_TITRE = FIN_RAFALE + 700;

// Les images ne sont chargées qu'à la première ouverture, puis gardées.
let images = null;
function charge() {
  if (!images) {
    images = Array.from({ length: NB }, (_, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${DOSSIER}${String(i).padStart(2, '0')}.webp`;
      return img;
    });
  }
  return images;
}

// Image en plein cadre, recadrée comme `object-fit: cover`
function plein(ctx, img, W, H) {
  if (!img || !img.complete || !img.naturalWidth) return false;
  const k = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * k; const h = img.naturalHeight * k;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  return true;
}

export default {
  couvre: DEBUT,
  duree: FIN_TITRE + 20,
  lecture: [FIN_RAFALE + 60, FIN_TITRE - 40], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "PP Neue Montreal"', '400 16px "PP Neue Montreal"'],
  prepare: () => ({ images: charge() }),
  dessine(ctx, W, H, ms, etat) {
    if (!etat.motif) etat.motif = grain(ctx, 34);

    // 1. le noir tombe
    if (ms < DEBUT) {
      ctx.globalAlpha = ease.out(entre(ms, 0, DEBUT));
      ctx.fillStyle = NOIR; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      return;
    }

    ctx.fillStyle = NOIR; ctx.fillRect(0, 0, W, H);

    // 2. rafale : une image par plan, coupes franches
    if (ms < FIN_RAFALE) {
      let t = DEBUT; let i = 0;
      while (i < PLANS.length - 1 && ms >= t + PLANS[i]) { t += PLANS[i]; i += 1; }
      plein(ctx, etat.images[i], W, H);
      poseGrain(ctx, W, H, etat.motif);
      return;
    }

    // 3. titre, blanc sur noir ; à FIN_TITRE, coupe franche sur la page
    const marge = Math.max(24, W * 0.06);
    const taille = Math.min(W * 0.11, H * 0.15);
    const lh = taille * 0.9;
    const lignes = ['INVENTAIRE', '& LE SOMMEIL'];
    const y0 = H / 2 - (lh * lignes.length) / 2;
    ctx.fillStyle = BLANC;
    ctx.textBaseline = 'top';
    ctx.font = POLICE(taille);
    lignes.forEach((l, i) => ctx.fillText(l, marge, y0 + i * lh));
    ctx.font = FINE(Math.max(11, taille * 0.16));
    ctx.fillStyle = GRIS;
    ctx.fillText("Deux films d'archives · TouchDesigner · 2026", marge, y0 + lignes.length * lh + taille * 0.2);
    poseGrain(ctx, W, H, etat.motif);
  },
};
