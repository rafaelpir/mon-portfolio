import { useEffect, useRef, useState } from 'react';
import { OUVERTURES, dureeTotale, tempsStyle } from '../transitions';
import { alea } from '../transitions/outils';

// Ouverture propre à un projet (variante du tourne-page, voir PageTurn.jsx).
// Un canvas plein écran, dimensionné sur sa vraie taille à l'écran (jamais
// étiré), dans lequel le style du projet se dessine image par image selon le
// temps écoulé. Chaque style couvre l'ancienne page avant `couvre` ms, puis
// découvre la nouvelle jusqu'à `duree` ms ; il se retire alors de lui-même.
export default function ProjectTransition({ style, infos }) {
  const canvasRef = useRef(null);
  const [fini, setFini] = useState(false);

  useEffect(() => {
    const ouverture = OUVERTURES[style];
    const canvas = canvasRef.current;
    if (!ouverture || !canvas) { setFini(true); return undefined; }
    const ctx = canvas.getContext('2d');
    let W = 0; let H = 0; let etat = null;
    let raf = 0; let debut = 0; let arrete = false;
    const graine = Math.floor(Math.random() * 1e9);

    const dimensionne = () => {
      const boite = canvas.getBoundingClientRect();
      if (!boite.width || !boite.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = boite.width; H = boite.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      etat = ouverture.prepare ? ouverture.prepare(W, H, alea(graine), infos) : {};
    };

    const image = (maintenant) => {
      if (arrete) return;
      if (!debut) debut = maintenant;
      const reel = maintenant - debut;
      if (reel >= dureeTotale(ouverture)) { setFini(true); return; }
      const ms = tempsStyle(ouverture, reel);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ouverture.dessine(ctx, W, H, ms, etat, infos);
      ctx.restore();
      raf = requestAnimationFrame(image);
    };

    dimensionne();
    const observe = new ResizeObserver(dimensionne);
    observe.observe(canvas);
    // polices du style : on ne les attend pas plus de 0,3 s
    const polices = document.fonts && ouverture.polices
      ? Promise.all(ouverture.polices.map((p) => document.fonts.load(p).catch(() => null)))
      : Promise.resolve();
    // une police qui ne charge pas ne doit jamais bloquer l'animation
    Promise.race([polices, new Promise((ok) => setTimeout(ok, 300))]).catch(() => null).then(() => {
      if (!arrete) raf = requestAnimationFrame(image);
    });
    return () => {
      arrete = true;
      cancelAnimationFrame(raf);
      observe.disconnect();
    };
  }, [style]);

  if (fini) return null;
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[2000] pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
