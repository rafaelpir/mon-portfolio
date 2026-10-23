import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { projects } from '../data/projects';

// Changement de page façon catalogue : une feuille de papier traverse l'écran
// et tourne la page. Elle porte le titre de la page où l'on va (« Planche 07 ·
// Gummo », « Sommaire », « Salle des affiches »…). L'ancienne page est
// remplacée pendant que la feuille couvre tout l'écran, donc sans à-coup.
// phase : 'in' (la feuille arrive et couvre), 'out' (elle repart), null.
export const TURN_IN = 520; // ms : durée de l'arrivée, pendant laquelle l'ancienne page reste en place
export const MOSAIC_IN = 820; // ms : idem pour la mosaïque, le temps que la vague couvre l'écran

export function pageLabel(pathname, french) {
  if (pathname === '/#projects') return { top: 'Rafael Piral', title: french ? 'Projets' : 'Projects' };
  if (pathname === '/' || pathname.startsWith('/#')) return { top: 'Rafael Piral', title: french ? 'Accueil' : 'Home' };
  if (pathname.startsWith('/work/')) {
    const visible = projects.filter((project) => !project.hidden);
    const index = visible.findIndex((project) => project.slug === pathname.slice(6));
    if (index >= 0) {
      const label = { top: `${french ? 'Planche' : 'Plate'} ${String(index + 1).padStart(2, '0')}`, title: visible[index].shortTitle || visible[index].title };
      // Portrait ouzbek : la transition reprend l'animation du projet
      if (visible[index].slug === 'portrait-ouzbek') label.mosaic = true;
      return label;
    }
  }
  if (pathname === '/musee') return { top: 'Rafael Piral', title: french ? 'Le musée' : 'The museum' };
  if (pathname === '/about') return { top: 'Rafael Piral', title: french ? 'À propos' : 'About' };
  if (pathname === '/legal') return { top: 'Rafael Piral', title: french ? 'Mentions légales' : 'Legal notice' };
  return { top: 'Rafael Piral', title: '' };
}

// Transition du Portrait ouzbek : une grille de tuiles aux teintures d'Asie
// centrale du projet (aplats ou bandes façon ikat) se pose en vague à partir
// du centre de l'écran, comme dans le projet, puis repart de même.
// (teintes assombries, comme des tissus dans la pénombre)
const MOSAIC_COLORS = ['#5c0a0d', '#6e1630', '#7a5a08', '#121a52', '#0c2566', '#06504f', '#244f17', '#77390d', '#141414'];

function Mosaic({ phase, label }) {
  const [layout] = useState(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cols = vw > vh ? 12 : 6;
    const size = vw / cols;
    const rows = Math.ceil(vh / size);
    const face = { x: vw / 2, y: vh * 0.4 };
    const far = Math.hypot(Math.max(face.x, vw - face.x), Math.max(face.y, vh - face.y));
    const tiles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * size;
        const y = r * size;
        const cx = x + size / 2;
        const cy = y + size / 2;
        const delay = (Math.hypot(cx - face.x, cy - face.y) / far) * 0.42 + Math.random() * 0.08;
        const stripes = Math.random() < 0.5;
        const color = MOSAIC_COLORS[Math.floor(Math.random() * MOSAIC_COLORS.length)];
        tiles.push({
          key: `${r}-${c}`,
          delay,
          style: {
            left: x,
            top: y,
            width: size + 1,
            height: size + 1,
            // ikat : bandes aux bords flous, ou aplat de teinture
            backgroundColor: color,
            backgroundImage: stripes ? `repeating-linear-gradient(${Math.random() < 0.5 ? 0 : 90}deg, rgba(0,0,0,0.45) 0 ${size / 8}px, transparent ${size / 8 + 2}px ${size / 4}px)` : 'none',
          },
        });
      }
    }
    return tiles;
  });
  return (
    <div className={`page-mosaic is-${phase}`} aria-hidden="true">
      {layout.map((tile) => (
        <span key={tile.key} style={{ ...tile.style, animationDelay: `${(phase === 'in' ? tile.delay : tile.delay * 0.8).toFixed(3)}s` }} />
      ))}
      <p className="page-mosaic-label">
        <span>{label?.top}</span>
        {label?.title}
      </p>
    </div>
  );
}

export default function PageTurn({ phase, label }) {
  const [node, setNode] = useState(null);
  // Attachée à <html> : le transform du body casserait position: fixed
  useEffect(() => {
    const element = document.createElement('div');
    document.documentElement.appendChild(element);
    setNode(element);
    return () => element.remove();
  }, []);

  if (!node || !phase) return null;
  if (label?.mosaic) return createPortal(<Mosaic phase={phase} label={label} />, node);
  return createPortal(
    <div className={`page-turn is-${phase}`} aria-hidden="true">
      <div className="page-turn-sheet">
        <p className="page-turn-top">{label?.top}</p>
        <p className="page-turn-title">{label?.title}</p>
        <span className="page-turn-rule" />
      </div>
    </div>,
    node
  );
}
