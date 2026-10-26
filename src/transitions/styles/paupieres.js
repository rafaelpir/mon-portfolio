import { entre, ease, grain, poseGrain } from '../outils';

// Un Homme qui dort : deux paupières se ferment, noir et blanc granuleux, le
// titre en capitales empilées comme sur l'affiche, puis l'œil se rouvre.
const NOIR = '#0b0b0b';
const BLANC = '#f1f1ec';
const POLICE = (t) => `800 ${t}px "PP Neue Montreal", Helvetica, sans-serif`;
const MOTS = ['UN', 'HOMME', 'QUI', 'DORT'];

function paupieres(ctx, W, H, ouverture) {
  // ouverture : 0 = fermé, 1 = ouvert. Bords adoucis d'un dégradé.
  const demi = (H / 2) * (1 - ouverture);
  const flou = 70;
  ctx.fillStyle = NOIR;
  ctx.fillRect(0, 0, W, demi);
  ctx.fillRect(0, H - demi, W, demi);
  if (ouverture > 0 && ouverture < 1) {
    const haut = ctx.createLinearGradient(0, demi, 0, demi + flou);
    haut.addColorStop(0, NOIR); haut.addColorStop(1, 'rgba(11,11,11,0)');
    ctx.fillStyle = haut; ctx.fillRect(0, demi, W, flou);
    const bas = ctx.createLinearGradient(0, H - demi, 0, H - demi - flou);
    bas.addColorStop(0, NOIR); bas.addColorStop(1, 'rgba(11,11,11,0)');
    ctx.fillStyle = bas; ctx.fillRect(0, H - demi - flou, W, flou);
  }
}

export default {
  couvre: 750,
  duree: 2400,
  lecture: [950, 1500], // titre lisible : ralenti (voir TENUE)
  polices: ['800 64px "PP Neue Montreal"'],
  prepare: () => ({}),
  dessine(ctx, W, H, ms, etat) {
    if (!etat.motif) etat.motif = grain(ctx, 46);
    // fermeture (lente au début, comme un œil lourd), petit battement, réouverture
    let ouverture;
    if (ms < 750) ouverture = 1 - ease.inOut(entre(ms, 0, 750));
    else if (ms < 1550) ouverture = 0;
    else ouverture = ease.inOut(entre(ms, 1550, 2350));
    if (ouverture <= 0) {
      ctx.fillStyle = NOIR; ctx.fillRect(0, 0, W, H);
    } else {
      paupieres(ctx, W, H, ouverture);
    }
    // titre : apparaît paupières closes, s'estompe à la réouverture
    const alpha = Math.min(entre(ms, 700, 950), 1 - entre(ms, 1500, 1800));
    if (alpha > 0) {
      const marge = Math.max(24, W * 0.06);
      const taille = Math.min(W * 0.2, H * 0.17);
      const lh = taille * 0.86;
      const y0 = H / 2 - (lh * MOTS.length) / 2 + taille * 0.08;
      const derive = entre(ms, 700, 1800) * taille * 0.12;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = BLANC;
      ctx.font = POLICE(taille);
      ctx.textBaseline = 'top';
      MOTS.forEach((m, i) => ctx.fillText(m, marge, y0 + i * lh - derive));
      ctx.font = `400 ${Math.max(11, taille * 0.12)}px "PP Neue Montreal", sans-serif`;
      ctx.fillText('Georges Perec · Bernard Queysanne · 1974', marge, y0 + MOTS.length * lh + taille * 0.15 - derive);
      ctx.globalAlpha = 1;
    }
    if (ouverture < 1) poseGrain(ctx, W, H, etat.motif);
  },
};
