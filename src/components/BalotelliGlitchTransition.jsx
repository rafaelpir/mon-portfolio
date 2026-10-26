import { useEffect, useRef, useState } from 'react';
import { C, FPS, alea, montage, creeDessin, creeGrain } from '../utils/balotelliGlitch';

// Passage de l'accueil vers la page Balotelli (variante du tourne-page, voir
// PageTurn.jsx) : typographie glitch dessinée en direct dans un <canvas>.
// Environ 2 s : rafale de mises en page faites des vraies citations sur
// Balotelli, « WHY ALWAYS ME? » qui se casse, puis « MARIO BALOTELLI ». Pour
// finir, l'écran se découpe en bandes de 70 px, celles du fond de la page,
// qui glissent en alternance vers le haut et vers le bas en virant au bleu
// Inter : la page s'ouvre derrière. L'ancienne page est remplacée sous le
// glitch (GLITCH_IN), la transition se retire d'elle-même à la fin.

export const GLITCH_IN = 1000; // ms : l'ancienne page reste en place sous le glitch
export const GLITCH_TOTAL = 3300; // ms : durée de vie maximale de la transition

const BANDE = 70; // px, comme les bandes du maillot en fond de page
const SORTIE_BANDE = 520; // ms : glissement d'une bande
const SORTIE_DECALAGE = 300; // ms : décalage max entre le centre et les bords
const adoucit = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export default function BalotelliGlitchTransition() {
  const canvasRef = useRef(null);
  const [fini, setFini] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = 0; let H = 0; let dessine = null;
    let raf = 0; let debut = 0; let derniere = -1; let arrete = false;
    let sortie = null; // { debut, cliche } : dernière image, découpée en bandes à la sortie
    const { plans, total } = montage(alea(Math.floor(Math.random() * 1e9)));
    const debuts = plans.map((p) => p.start);
    const motif = ctx.createPattern(creeGrain(), 'repeat');

    // Taille réelle du canvas à l'écran (sans la barre de défilement) : le
    // dessin n'est jamais étiré.
    const dimensionne = () => {
      const boite = canvas.getBoundingClientRect();
      if (!boite.width || !boite.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = boite.width; H = boite.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      ctx.textBaseline = 'middle';
      dessine = creeDessin(ctx, W, H);
      derniere = -1;
      if (!sortie) { ctx.fillStyle = C.fond; ctx.fillRect(0, 0, W, H); }
    };

    // Ouverture : chaque bande emporte son morceau de la dernière image.
    const dessineSortie = (ms) => {
      const { cliche } = sortie;
      const cw = canvas.width; const ch = canvas.height;
      const b = BANDE * (cw / W);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      let termine = true;
      for (let i = 0, x = 0; x < cw; i += 1, x += b) {
        const distance = Math.abs(x + b / 2 - cw / 2) / (cw / 2);
        const p = Math.min(1, Math.max(0, (ms - distance * SORTIE_DECALAGE - (i % 2) * 50) / SORTIE_BANDE));
        if (p < 1) termine = false;
        const e = adoucit(p);
        const y = (i % 2 ? 1 : -1) * e * ch;
        ctx.drawImage(cliche, x, 0, b, ch, x, y, b, ch);
        if (i % 2 && e > 0) {
          ctx.globalAlpha = Math.min(1, e * 1.6) * 0.9;
          ctx.fillStyle = C.bleu;
          ctx.fillRect(x, y, b, ch);
          ctx.globalAlpha = 1;
        }
      }
      ctx.restore();
      return termine;
    };

    const image = (maintenant) => {
      if (arrete) return;
      if (!debut) debut = maintenant;
      const f = Math.floor(((maintenant - debut) / 1000) * FPS);
      if (f >= total) {
        if (!sortie) {
          const cliche = document.createElement('canvas');
          cliche.width = canvas.width; cliche.height = canvas.height;
          cliche.getContext('2d').drawImage(canvas, 0, 0);
          sortie = { debut: maintenant, cliche };
        }
        if (dessineSortie(maintenant - sortie.debut)) { setFini(true); return; }
        raf = requestAnimationFrame(image);
        return;
      }
      if (f !== derniere && dessine) {
        derniere = f;
        let i = debuts.length - 1;
        while (debuts[i] > f) i -= 1;
        const plan = plans[i];
        if (dessine(plan, f - plan.start)) {
          ctx.save();
          ctx.translate(-Math.random() * 160, -Math.random() * 160);
          ctx.fillStyle = motif;
          ctx.fillRect(0, 0, W + 160, H + 160);
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(image);
    };

    dimensionne();
    const observe = new ResizeObserver(dimensionne);
    observe.observe(canvas);
    // La police du site est déjà chargée par la page d'accueil ; au cas où,
    // on ne l'attend pas plus de 0,3 s.
    const polices = document.fonts
      ? Promise.all([400, 800].map((g) => document.fonts.load(`${g} 64px "PP Neue Montreal"`).catch(() => null)))
      : Promise.resolve();
    Promise.race([polices, new Promise((ok) => setTimeout(ok, 300))]).catch(() => null).then(() => {
      if (!arrete) raf = requestAnimationFrame(image);
    });
    return () => {
      arrete = true;
      cancelAnimationFrame(raf);
      observe.disconnect();
    };
  }, []);

  if (fini) return null;
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[2000] pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
