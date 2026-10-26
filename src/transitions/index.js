// Ouvertures de projet : un style par projet (champ `pageTransition` dans
// src/data/projects.js), joué quand on ouvre le projet depuis l'accueil.
// Chaque style : { couvre, duree, polices?, prepare?(W, H, alea, infos),
// dessine(ctx, W, H, ms, etat, infos) }. Il doit couvrir tout l'écran entre
// `couvre` ms (l'ancienne page est alors remplacée dessous) et le début de son
// ouverture, puis dévoiler la nouvelle page avant `duree` ms.
import paupieres from './styles/paupieres';
import velours from './styles/velours';
import appli from './styles/appli';
import plan from './styles/plan';
import ascii from './styles/ascii';
import battement from './styles/battement';
import pellicule from './styles/pellicule';
import batsignal from './styles/batsignal';
import reseau from './styles/reseau';
import piano from './styles/piano';
import depart from './styles/depart';
import rossoneri from './styles/rossoneri';
import bulle from './styles/bulle';

// Temps de lecture : la phase où le titre est lisible (`lecture: [début, fin]`
// en ms du style) est ralentie pour durer au moins TENUE ms, le reste de
// l'animation garde son rythme.
export const TENUE = 1400;

function etirement(o) {
  if (!o.lecture) return 0;
  const [a, b] = o.lecture;
  return Math.max(0, TENUE - (b - a));
}

// Durée réelle d'une ouverture, ralenti compris
export const dureeTotale = (o) => o.duree + etirement(o);

// Temps « du style » correspondant à un temps réel
export function tempsStyle(o, ms) {
  if (!o.lecture) return ms;
  const [a, b] = o.lecture;
  const L = b - a;
  const T = L + etirement(o);
  if (ms <= a) return ms;
  if (ms <= a + T) return a + ((ms - a) * L) / T;
  return ms - (T - L);
}

export const OUVERTURES = {
  paupieres, // Un Homme qui dort
  velours, // Sade, Diamond Life
  appli, // Veco
  plan, // Armor Immo
  ascii, // Statue de la Liberté
  battement, // À Cœur Ouvert
  pellicule, // Gummo
  batsignal, // Batman
  reseau, // Réseau Alumni
  piano, // Alicia Keys
  depart, // Grand Prix de Monaco
  rossoneri, // Kaká
  bulle, // Iris
};
