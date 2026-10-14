import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { projects } from '../data/projects';

// Changement de page façon catalogue : une feuille de papier traverse l'écran
// et tourne la page. Elle porte le titre de la page où l'on va (« Planche 07 ·
// Gummo », « Sommaire », « Salle des affiches »…). L'ancienne page est
// remplacée pendant que la feuille couvre tout l'écran, donc sans à-coup.
// phase : 'in' (la feuille arrive et couvre), 'out' (elle repart), null.
export const TURN_IN = 520; // ms : durée de l'arrivée, pendant laquelle l'ancienne page reste en place

export function pageLabel(pathname, french) {
  if (pathname === '/#projects') return { top: 'Rafael Piral', title: french ? 'Projets' : 'Projects' };
  if (pathname === '/' || pathname.startsWith('/#')) return { top: 'Rafael Piral', title: french ? 'Accueil' : 'Home' };
  if (pathname.startsWith('/work/')) {
    const visible = projects.filter((project) => !project.hidden);
    const index = visible.findIndex((project) => project.slug === pathname.slice(6));
    if (index >= 0) return { top: `${french ? 'Planche' : 'Plate'} ${String(index + 1).padStart(2, '0')}`, title: visible[index].shortTitle || visible[index].title };
  }
  if (pathname === '/musee') return { top: 'Rafael Piral', title: french ? 'Le musée' : 'The museum' };
  if (pathname === '/about') return { top: 'Rafael Piral', title: french ? 'À propos' : 'About' };
  if (pathname === '/legal') return { top: 'Rafael Piral', title: french ? 'Mentions légales' : 'Legal notice' };
  return { top: 'Rafael Piral', title: '' };
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
