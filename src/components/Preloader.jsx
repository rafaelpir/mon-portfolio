import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

const pad = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

// Enveloppe sinusoïdale (pas de bruit uniforme) : une vraie mesure de niveau
// par bande de fréquence a des zones qui montent/descendent plutôt qu'un
// plateau plat — le sinus donne cette respiration, le random garde chaque
// barre irrégulière. Valeurs normalisées 0..1 (converties en hauteur SVG au
// rendu, en fonction de l'échelle dB du diagramme).
function generateSpectrum(count) {
  const bars = [];
  for (let i = 0; i < count; i++) {
    const envelope = 0.3 + 0.7 * Math.abs(Math.sin(i * 0.3 + 0.6));
    bars.push(Math.min(1, envelope * (0.35 + Math.random() * 0.65)));
  }
  return bars;
}

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const lerp = (a, b, t) => a + (b - a) * t;

// Rectangle d'or subdivisé récursivement (136 → 84 → 52 → 32, suite de
// Fibonacci) : quatre arcs quart-de-cercle chaînés, chacun partant du point
// d'arrivée du précédent, pour une spirale continue.
const GOLDEN_SPIRAL_PATH =
  'M10,142 A136,136 0 0 1 146,6 A84,84 0 0 1 230,90 A52,52 0 0 1 178,142 A32,32 0 0 1 146,110 A20,20 0 0 1 166,90 A12,12 0 0 1 178,102';
const GOLDEN_SPIRAL_LENGTH = 540;
// Suite des côtés successifs (136 → 84 → 52 → 32 → 20 → 12), chacun étant le
// précédent divisé par φ : sert à la fois à dessiner les carrés et à
// afficher la table des ratios sous le diagramme.
const GOLDEN_SQUARES = [
  { side: 136, x: 10, y: 6 },
  { side: 84, x: 146, y: 6 },
  { side: 52, x: 178, y: 90 },
  { side: 32, x: 146, y: 110 },
  { side: 20, x: 146, y: 90 },
  { side: 12, x: 166, y: 90 },
];
const GOLDEN_TANGENT_POINTS = [
  [10, 142], [146, 6], [230, 90], [178, 142], [146, 110], [166, 90], [178, 102],
];

// Figure de Lissajous 3:2 (ratio de fréquences), précalculée une seule fois
// au chargement du module — elle ne dépend que du temps t, pas des props.
const LISSAJOUS_PATH = (() => {
  const N = 140;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const x = 100 + 65 * Math.sin(3 * t + Math.PI / 2);
    const y = 100 + 65 * Math.sin(2 * t);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
})();
const LISSAJOUS_LENGTH = 620;

// Grille de points en trame (halftone) tournée d'un angle donné : simule les
// angles de trame CMJN classiques (15°/45°/75°/90°) utilisés en impression
// pour éviter les effets de moiré entre les quatre couches d'encre.
function halftoneDots(angleDeg, spacing, boundR) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const steps = Math.ceil(boundR / spacing) + 1;
  const pts = [];
  for (let i = -steps; i <= steps; i++) {
    for (let j = -steps; j <= steps; j++) {
      const lx = i * spacing;
      const ly = j * spacing;
      const x = lx * cos - ly * sin;
      const y = lx * sin + ly * cos;
      if (x * x + y * y <= boundR * boundR) pts.push([x, y]);
    }
  }
  return pts;
}

// Analyseur de spectre audio : axe fréquence en échelle log (20Hz–20kHz,
// grille d'octaves) + axe niveau en dB, comme un vrai analyseur FFT.
const AV_X0 = 20;
const AV_X1 = 300;
const AV_BASE_Y = 140;
const AV_TOP_Y = 20;
const AV_FREQ_LABELS = [
  { f: '20', x: 20 }, { f: '100', x: 85 }, { f: '1k', x: 178 }, { f: '10k', x: 272 }, { f: '20k', x: 300 },
];
const AV_MINOR_X = [20, 57, 85, 113, 151, 178, 207, 244, 272, 300];
const AV_DB_LINES = [
  { db: '0', y: 20 }, { db: '-6', y: 50 }, { db: '-12', y: 80 }, { db: '-18', y: 110 }, { db: '-24', y: 140 },
];

// Trois variantes structurellement différentes, chacune sur un diagramme
// scientifique réel de la discipline — pas une simple grille décorative :
// dispersion de la lumière par un prisme (optique, loi de Snell) pour le
// design, construction de De Casteljau d'une courbe de Bézier cubique pour
// l'UX/UI, analyseur de spectre FFT pour l'audiovisuel. Badges/citation/CTA
// restent communs pour garder une identité reconnaissable d'un chargement à
// l'autre ; une variante est tirée au sort à chaque montage.
const VARIANTS = [
  {
    key: 'design-prism',
    group: 'design',
    subtitle: 'GRAPHIC DESIGNER',
    badges: ['GRAPHIC DESIGNER', 'UX/UI', 'AUDIOVISUEL'],
    quote: 'Design is intelligence made visible.',
    logLines: ['INIT_SYSTEM...', 'LOAD_ASSETS...', 'COMPILE_STYLES...', 'RENDER_UI...', 'READY'],
    maxWidth: 460,
    caption: 'n = sinθ₁ ⁄ sinθ₂ · SNELL’S LAW OF REFRACTION',
    info: (progress) => ['©2026', '380–700NM', `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'ISAAC NEWTON · OPTICKS, 1704', detail: 'En 1666, Newton décompose la lumière blanche avec un prisme et prouve que les couleurs préexistent dans la lumière : le verre ne fait que les séparer.' },
      { text: 'c = 299 792 458 m/s (VACUUM)', detail: 'Vitesse de la lumière dans le vide, constante universelle qui définit le mètre depuis 1983.' },
      { text: 'CRITICAL ANGLE θc = arcsin(1/n)', detail: 'Au-delà de cet angle, la lumière ne traverse plus la surface : elle est totalement réfléchie à l’intérieur du milieu.' },
      { text: 'DISPERSION Δn ∝ 1/λ²', detail: 'L’indice de réfraction varie avec la longueur d’onde : le violet est plus dévié que le rouge, d’où l’étalement du spectre.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <path d="M6 28 C 10 10, 26 10, 30 8" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <circle cx="6" cy="28" r="2" fill="#E5E5E5" />
        <circle cx="30" cy="8" r="2" fill="#E5E5E5" />
        <line x1="6" y1="28" x2="14" y2="14" stroke="#E5E5E5" strokeWidth="0.6" />
        <circle cx="14" cy="14" r="1.5" fill="none" stroke="#E5E5E5" strokeWidth="0.6" />
        <line x1="30" y1="8" x2="22" y2="16" stroke="#E5E5E5" strokeWidth="0.6" />
        <circle cx="22" cy="16" r="1.5" fill="none" stroke="#E5E5E5" strokeWidth="0.6" />
      </svg>
    ),
    // Dispersion de la lumière blanche à travers un prisme : rayon incident,
    // réfraction (normales en pointillés, angles θ₁/θ₂), puis éventail du
    // spectre visible — révélé progressivement avec le chargement.
    centerpiece: (progress) => (
      <svg width="240" height="148" viewBox="0 0 260 160" fill="none">
        <polygon points="60,130 110,30 140,130" stroke="#E5E5E5" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="10" y1="90" x2="80" y2="90" stroke="#E5E5E5" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="80" y1="90" x2="125" y2="80" stroke="#E5E5E5" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="62" y1="81" x2="98" y2="99" stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="0.6" strokeDasharray="2 2" />
        <line x1="106" y1="86" x2="144" y2="74" stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x="82" y="103" fontSize="6" fill="#E5E5E5" opacity="0.5">θ₁</text>
        <text x="116" y="70" fontSize="6" fill="#E5E5E5" opacity="0.5">θ₂</text>
        <text x="14" y="82" fontSize="6" fill="#E5E5E5" opacity="0.4">WHITE LIGHT</text>

        <clipPath id="preloaderPrismClip">
          <rect x="125" y="0" width={105 * (progress / 100)} height="160" />
        </clipPath>
        <g clipPath="url(#preloaderPrismClip)">
          {[
            { c: '#ff6b5c', y: 58, nm: '700' },
            { c: '#ffa35c', y: 70, nm: '620' },
            { c: '#ffd95c', y: 82, nm: '580' },
            { c: '#8cd97a', y: 94, nm: '530' },
            { c: '#5c9eff', y: 106, nm: '470' },
            { c: '#a56cff', y: 118, nm: '420' },
          ].map((ray) => (
            <React.Fragment key={ray.nm}>
              <line x1="125" y1="80" x2="230" y2={ray.y} stroke={ray.c} strokeOpacity="0.85" strokeWidth="1" />
              <text x="234" y={ray.y + 3} fontSize="6" fill={ray.c} opacity="0.85">{ray.nm}</text>
            </React.Fragment>
          ))}
        </g>
      </svg>
    ),
  },
  {
    key: 'uxui-bezier',
    group: 'uxui',
    subtitle: 'UX/UI DESIGNER',
    badges: ['UX/UI', 'GRAPHIC DESIGNER', 'AUDIOVISUEL'],
    quote: 'Good design is as little design as possible. · Dieter Rams',
    logLines: ['PARSE_LAYOUT...', 'COMPUTE_GRID...', 'BIND_STATE...', 'HYDRATE_UI...', 'READY'],
    maxWidth: 440,
    caption: 'B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃',
    info: (progress) => ['©2026', 't=0.500', `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'PIERRE BÉZIER · RENAULT, 1962', detail: 'Ingénieur français, il formalise ces courbes pour modéliser des carrosseries. Aujourd’hui, la base de toutes les courbes vectorielles (SVG, polices, motion design).' },
      { text: 'φ = 1.6180339887…', detail: 'Le nombre d’or, un ratio retrouvé dans de nombreuses grilles de composition et proportions jugées harmonieuses.' },
      { text: 'PARAMETRIC DOMAIN t ∈ [0, 1]', detail: 't=0 est le premier point de contrôle, t=1 le dernier : chaque valeur intermédiaire donne un point précis sur la courbe.' },
      { text: 'CUBIC → 4 CONTROL POINTS', detail: 'Une Bézier cubique (degré 3) est définie par 4 points : 2 ancres, 2 poignées, le standard de tous les outils vectoriels.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <rect x="4" y="6" width="28" height="24" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <line x1="4" y1="13" x2="32" y2="13" stroke="#E5E5E5" strokeWidth="0.8" />
        <line x1="14" y1="13" x2="14" y2="30" stroke="#E5E5E5" strokeWidth="0.8" />
        <circle cx="8" cy="9.5" r="1" fill="#E5E5E5" />
        <circle cx="12" cy="9.5" r="1" fill="#E5E5E5" />
      </svg>
    ),
    // Construction de De Casteljau d'une courbe de Bézier cubique : polygone
    // de contrôle (P0..P3), interpolations successives (Q, R) jusqu'au point
    // sur la courbe à t=0.5 — la courbe elle-même se trace avec le chargement.
    centerpiece: (progress) => {
      const P0 = [20, 130], P1 = [60, 20], P2 = [150, 20], P3 = [200, 120];
      const Q0 = mid(P0, P1), Q1 = mid(P1, P2), Q2 = mid(P2, P3);
      const R0 = mid(Q0, Q1), R1 = mid(Q1, Q2);
      const S0 = mid(R0, R1);
      const path = `M${P0[0]},${P0[1]} C${P1[0]},${P1[1]} ${P2[0]},${P2[1]} ${P3[0]},${P3[1]}`;
      const len = 280;
      return (
        <svg width="220" height="160" viewBox="0 0 220 160" fill="none">
          <line x1={P0[0]} y1={P0[1]} x2={P1[0]} y2={P1[1]} stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1={P1[0]} y1={P1[1]} x2={P2[0]} y2={P2[1]} stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1={P2[0]} y1={P2[1]} x2={P3[0]} y2={P3[1]} stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1={Q0[0]} y1={Q0[1]} x2={Q1[0]} y2={Q1[1]} stroke="#E5E5E5" strokeOpacity="0.3" strokeWidth="0.75" />
          <line x1={Q1[0]} y1={Q1[1]} x2={Q2[0]} y2={Q2[1]} stroke="#E5E5E5" strokeOpacity="0.3" strokeWidth="0.75" />
          <line x1={R0[0]} y1={R0[1]} x2={R1[0]} y2={R1[1]} stroke="#E5E5E5" strokeOpacity="0.45" strokeWidth="0.75" />
          <path d={path} stroke="#E5E5E5" strokeWidth="1.2" fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - progress / 100)} />
          {[P0, P1, P2, P3].map((p, i) => (
            <React.Fragment key={i}>
              <circle cx={p[0]} cy={p[1]} r="2" fill="#E5E5E5" />
              <text x={p[0] + 4} y={p[1] - 4} fontSize="6" fill="#E5E5E5" opacity="0.5">{`P${i}`}</text>
            </React.Fragment>
          ))}
          <circle cx={S0[0]} cy={S0[1]} r="2.4" fill="none" stroke="#E5E5E5" strokeWidth="1" />
          <text x={S0[0] + 5} y={S0[1] + 3} fontSize="6" fill="#E5E5E5" opacity="0.6">t=0.5</text>
        </svg>
      );
    },
  },
  {
    key: 'av-fft',
    group: 'av',
    subtitle: 'AUDIOVISUAL CREATOR',
    badges: ['AUDIOVISUEL', 'GRAPHIC DESIGNER', 'UX/UI'],
    quote: "Cinema is a matter of what's in the frame and what's out. · M. Scorsese",
    logLines: ['REC_INIT...', 'LOAD_FOOTAGE...', 'RENDER_TIMELINE...', 'EXPORT_MASTER...', 'READY'],
    maxWidth: 520,
    caption: 'FFT · 20Hz–20kHz · 0 TO −24dB',
    info: (progress) => {
      const totalFrames = Math.floor((progress / 100) * (24 * 12));
      const sec = Math.floor(totalFrames / 24);
      const frames = totalFrames % 24;
      return ['©2026', '24FPS', `TC 00:${pad(sec)}:${pad(frames)}`];
    },
    annotations: [
      { text: 'NYQUIST f = SAMPLE RATE ÷ 2', detail: 'Fréquence maximale représentable sans repliement (aliasing) : à 48kHz d’échantillonnage, on capture jusqu’à 24kHz.' },
      { text: 'SPEED OF SOUND (20°C) = 343 m/s', detail: 'Varie avec la température de l’air, utile pour calculer délais et réverbérations en post-production son.' },
      { text: 'HUMAN HEARING RANGE 20Hz–20kHz', detail: 'Plage théorique de l’audition humaine : elle se réduit avec l’âge, surtout sur les fréquences aiguës.' },
      { text: 'CD AUDIO 44.1kHz / 16-BIT', detail: 'Standard fixé en 1980 par Sony et Philips, largement au-dessus du seuil de Nyquist pour l’audition humaine.' },
      { text: '24 FPS · STANDARD DU CINÉMA', detail: 'Fréquence adoptée dès les années 1920 pour synchroniser image et son optique ; reste la norme du cinéma aujourd’hui.' },
      { text: 'PERSISTENCE OF VISION', detail: 'Le cerveau retient une image environ 1/10 de seconde après sa disparition, ce qui fait percevoir une suite d’images fixes comme un mouvement continu.' },
      { text: 'SHUTTER ANGLE 180°', detail: 'Règle classique du flou de mouvement au cinéma : temps d’exposition = 1/(2×fps), pour un rendu naturel et fluide.' },
      { text: 'DECIBEL (dB) · ÉCHELLE LOGARITHMIQUE', detail: 'Chaque +10dB correspond à ×10 en intensité physique, mais seulement environ ×2 en perception sonore.' },
      { text: 'FLETCHER–MUNSON CURVES', detail: 'L’oreille humaine n’est pas également sensible à toutes les fréquences : graves et aigus semblent plus faibles à bas volume.' },
      { text: 'DOPPLER EFFECT', detail: 'La fréquence perçue d’un son change selon la vitesse relative de la source : c’est la base physique du "vroum" d’un véhicule qui passe.' },
      { text: 'ROOM MODES / STANDING WAVES', detail: 'Dans une pièce fermée, certaines fréquences s’accumulent aux dimensions correspondantes, créant des résonances indésirables en enregistrement.' },
      { text: 'XLR · BALANCED SIGNAL', detail: 'Transmission en phase inversée puis soustraction, pour annuler les interférences électromagnétiques captées sur de longs câbles.' },
      { text: 'COLOR TEMPERATURE (KELVIN)', detail: 'Échelle physique décrivant la teinte d’une source lumineuse : environ 3200K pour le tungstène (chaud), 5600K pour la lumière du jour (froid).' },
      { text: 'LOG vs REC.709', detail: 'Un profil colorimétrique log capture une plage dynamique plus large en aplatissant le contraste, à corriger ensuite en étalonnage.' },
      { text: 'TIMECODE SMPTE (HH:MM:SS:FF)', detail: 'Standard universel de synchronisation image/son à l’image près, indispensable au montage professionnel.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <polygon points="14,11 14,25 26,18" fill="none" stroke="#E5E5E5" strokeWidth="1" />
      </svg>
    ),
    // Analyseur de spectre audio : grille dB (horizontale) + fréquence en
    // échelle log (verticale), barres par bande, curseur de lecture qui
    // avance avec le chargement — comme un vrai analyseur FFT de studio.
    centerpiece: (progress, extra) => {
      const bars = extra?.bars || [];
      const n = bars.length;
      const step = n > 1 ? (AV_X1 - AV_X0) / n : 0;
      const playX = AV_X0 + (progress / 100) * (AV_X1 - AV_X0);
      return (
        <svg width="100%" height="148" viewBox="0 0 320 160" fill="none" style={{ maxWidth: 480 }}>
          {AV_DB_LINES.map((l) => (
            <React.Fragment key={l.db}>
              <line x1={AV_X0} y1={l.y} x2={AV_X1} y2={l.y} stroke="#E5E5E5" strokeOpacity="0.1" strokeWidth="0.6" />
              <text x="2" y={l.y + 3} fontSize="6" fill="#E5E5E5" opacity="0.4">{l.db}</text>
            </React.Fragment>
          ))}
          <line x1={AV_X0} y1={AV_TOP_Y} x2={AV_X0} y2={AV_BASE_Y} stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="0.75" />
          {AV_MINOR_X.map((x, i) => (
            <line key={i} x1={x} y1={AV_BASE_Y} x2={x} y2={AV_BASE_Y + 4} stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="0.75" />
          ))}
          {AV_FREQ_LABELS.map((l) => (
            <text key={l.f} x={l.x} y={AV_BASE_Y + 13} fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">{l.f}</text>
          ))}
          {bars.map((v, i) => {
            const h = v * (AV_BASE_Y - AV_TOP_Y);
            const x = AV_X0 + i * step + step * 0.15;
            const w = Math.max(1.5, step * 0.7);
            return <rect key={i} x={x} y={AV_BASE_Y - h} width={w} height={h} fill="#E5E5E5" fillOpacity="0.45" />;
          })}
          <line x1={playX} y1={AV_TOP_Y - 6} x2={playX} y2={AV_BASE_Y} stroke="#E5E5E5" strokeWidth="1" />
          <circle cx={playX} cy={AV_TOP_Y - 6} r="2.4" fill="#E5E5E5" />
        </svg>
      );
    },
  },
  {
    key: 'design-wheel',
    group: 'design',
    subtitle: 'GRAPHIC DESIGNER',
    badges: ['GRAPHIC DESIGNER', 'UX/UI', 'AUDIOVISUEL'],
    quote: 'Colour is a power which directly influences the soul. · Wassily Kandinsky',
    logLines: ['SAMPLE_HUES...', 'MIX_PIGMENTS...', 'CALIBRATE_WHEEL...', 'RENDER_SPECTRUM...', 'READY'],
    maxWidth: 420,
    caption: 'HSL WHEEL · 12 HUES AT 30° INTERVALS',
    info: (progress) => ['©2026', `HUE ${Math.floor((progress / 100) * 360)}°`, `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'CIE 1931 COLOR SPACE', detail: 'Premier modèle mathématique reliant longueur d’onde et couleur perçue, encore à la base des espaces sRGB, Adobe RGB et Pantone aujourd’hui.' },
      { text: 'RGB · SYNTHÈSE ADDITIVE', detail: 'Les écrans mélangent des lumières rouge, verte et bleue ; les trois combinées à pleine intensité donnent du blanc.' },
      { text: 'CMJN · SYNTHÈSE SOUSTRACTIVE', detail: 'Les encres d’impression absorbent (soustraient) certaines longueurs d’onde au lieu d’en émettre ; combinées, elles tendent vers le noir.' },
      { text: 'GAMMA CORRECTION γ ≈ 2.2', detail: 'Encodage non linéaire qui compense la sensibilité de l’œil humain, elle-même logarithmique et non proportionnelle à la lumière reçue.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <line x1="18" y1="4" x2="18" y2="32" stroke="#E5E5E5" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="4" y1="18" x2="32" y2="18" stroke="#E5E5E5" strokeWidth="0.5" strokeOpacity="0.5" />
        <circle cx="18" cy="18" r="2" fill="#E5E5E5" />
      </svg>
    ),
    // Roue chromatique à 12 teintes (intervalles de 30°) ; un curseur balaie
    // la roue au fil du chargement, indiquant la teinte "active" en degrés.
    centerpiece: (progress) => {
      const cx = 90, cy = 90, r = 68;
      const wedges = Array.from({ length: 12 }, (_, i) => {
        const hue = i * 30;
        const a1 = ((hue - 90) * Math.PI) / 180;
        const a2 = ((hue + 30 - 90) * Math.PI) / 180;
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
        return { hue, d: `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z` };
      });
      const hue = Math.floor((progress / 100) * 360);
      const pointerAngle = ((hue - 90) * Math.PI) / 180;
      const px = cx + (r + 10) * Math.cos(pointerAngle);
      const py = cy + (r + 10) * Math.sin(pointerAngle);
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          {wedges.map((w) => (
            <path key={w.hue} d={w.d} fill={`hsl(${w.hue},70%,55%)`} fillOpacity="0.55" stroke="#000" strokeOpacity="0.3" strokeWidth="0.5" />
          ))}
          <circle cx={cx} cy={cy} r={r} stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="1" fill="none" />
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#E5E5E5" strokeWidth="1" />
          <circle cx={px} cy={py} r="3" fill="#E5E5E5" />
          <text x={cx} y={cy - r - 16} fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">0°</text>
          <text x={cx + r + 16} y={cy + 3} fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">90°</text>
          <text x={cx} y={cy + r + 16} fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">180°</text>
          <text x={cx - r - 16} y={cy + 3} fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">270°</text>
        </svg>
      );
    },
  },
  {
    key: 'design-spiral',
    group: 'design',
    subtitle: 'GRAPHIC DESIGNER',
    badges: ['GRAPHIC DESIGNER', 'AUDIOVISUEL', 'UX/UI'],
    quote: 'Simplicity is the ultimate sophistication. · Leonardo da Vinci',
    logLines: ['SEED_RECTANGLE...', 'DIVIDE_RATIO...', 'TRACE_ARCS...', 'CONVERGE_SPIRAL...', 'READY'],
    maxWidth: 460,
    caption: 'FIBONACCI CONSTRUCTION · 6 ITERATIONS · φ = 1.618…',
    info: (progress) => ['©2026', 'φ = 1.618', `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'GOLDEN RATIO φ = 1.618…', detail: 'Ratio retrouvé dans de nombreuses grilles de composition classiques ; son statut d’"harmonie universelle" reste débattu scientifiquement.' },
      { text: 'RULE OF THIRDS', detail: 'Approximation simplifiée de la grille du nombre d’or, largement utilisée pour cadrer une composition ou une photo.' },
      { text: 'FIBONACCI SEQUENCE', detail: '1, 1, 2, 3, 5, 8, 13… chaque terme est la somme des deux précédents ; le ratio entre deux termes consécutifs tend vers φ.' },
      { text: 'LOGARITHMIC SPIRAL', detail: 'Contrairement à une spirale d’Archimède, son pas grandit de façon exponentielle : elle garde la même forme à toute échelle.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <rect x="4" y="6" width="24" height="24" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <rect x="20" y="6" width="8" height="8" stroke="#E5E5E5" strokeWidth="0.6" fill="none" />
        <path d="M4 30 A26 26 0 0 1 28 6" stroke="#E5E5E5" strokeWidth="0.8" fill="none" />
      </svg>
    ),
    // Rectangle d'or subdivisé sur 6 niveaux (136→84→52→32→20→12, chaque
    // côté = le précédent ÷ φ), spirale tracée progressivement avec le
    // chargement, point de tangence à chaque changement de rayon, et table
    // des ratios sous le diagramme — la construction complète au compas.
    centerpiece: (progress) => (
      <svg width="230" height="176" viewBox="0 0 240 182" fill="none">
        <rect x="10" y="6" width="220" height="136" stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="146" y1="6" x2="146" y2="142" stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" />
        <line x1="146" y1="90" x2="230" y2="90" stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" />
        <line x1="178" y1="90" x2="178" y2="142" stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" />
        <line x1="146" y1="110" x2="178" y2="110" stroke="#E5E5E5" strokeOpacity="0.2" strokeWidth="0.75" />
        <line x1="166" y1="90" x2="166" y2="110" stroke="#E5E5E5" strokeOpacity="0.15" strokeWidth="0.6" />
        <line x1="166" y1="102" x2="178" y2="102" stroke="#E5E5E5" strokeOpacity="0.15" strokeWidth="0.6" />
        {GOLDEN_SQUARES.map((sq) => (
          <text
            key={sq.side}
            x={sq.x + sq.side / 2}
            y={sq.y + sq.side / 2 + 2.5}
            fontSize={sq.side >= 32 ? 8 : 5.5}
            fill="#E5E5E5"
            opacity="0.3"
            textAnchor="middle"
          >
            {sq.side}
          </text>
        ))}
        <path
          d={GOLDEN_SPIRAL_PATH}
          stroke="#E5E5E5"
          strokeWidth="1.1"
          fill="none"
          strokeDasharray={GOLDEN_SPIRAL_LENGTH}
          strokeDashoffset={GOLDEN_SPIRAL_LENGTH * (1 - progress / 100)}
        />
        {GOLDEN_TANGENT_POINTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#E5E5E5" />
        ))}
        <text x="14" y="132" fontSize="7" letterSpacing="1" fill="#E5E5E5" opacity="0.5">Φ 1.618</text>
        <text x="153" y="80" fontSize="7" letterSpacing="1" fill="#E5E5E5" opacity="0.5">GOLDEN GRID</text>
        {/* Table des ratios : chaque côté ÷ le suivant converge vers φ */}
        <line x1="10" y1="156" x2="230" y2="156" stroke="#E5E5E5" strokeOpacity="0.15" strokeWidth="0.75" />
        {GOLDEN_SQUARES.slice(0, -1).map((sq, i) => {
          const next = GOLDEN_SQUARES[i + 1];
          const ratio = (sq.side / next.side).toFixed(3);
          return (
            <text key={sq.side} x={10 + i * 44} y="170" fontSize="6" fill="#E5E5E5" opacity="0.4" fontVariantNumeric="tabular-nums">
              {sq.side}/{next.side}={ratio}
            </text>
          );
        })}
      </svg>
    ),
  },
  {
    key: 'design-halftone',
    group: 'design',
    subtitle: 'GRAPHIC DESIGNER',
    badges: ['GRAPHIC DESIGNER', 'AUDIOVISUEL', 'UX/UI'],
    quote: 'The medium is the message. · Marshall McLuhan',
    logLines: ['SCREEN_CYAN...', 'SCREEN_MAGENTA...', 'SCREEN_YELLOW...', 'SCREEN_KEY...', 'READY'],
    maxWidth: 420,
    caption: 'HALFTONE ROSETTE · SCREEN ANGLES 15° / 45° / 75° / 90°',
    info: (progress) => ['©2026', '175 LPI', `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'PANTONE MATCHING SYSTEM, 1963', detail: 'Bibliothèque de couleurs numérotées et standardisées, créée pour résoudre le problème des couleurs qui varient d’une imprimante ou d’un support à l’autre.' },
      { text: 'MÉTAMÉRISME', detail: 'Deux couleurs peuvent paraître identiques sous une source lumineuse et différentes sous une autre : un défi courant en calibration écran/impression.' },
      { text: 'MOIRÉ PATTERN', detail: 'Des trames mal désaxées entre elles créent des interférences visuelles indésirables ; les angles 15/45/75/90° minimisent ce risque.' },
      { text: 'LPI · LIGNES PAR POUCE', detail: 'Résolution de trame d’impression ; plus la valeur est haute, plus les points sont fins et invisibles à l’œil nu.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        {[6, 14, 22, 30].map((y) => (
          <React.Fragment key={y}>
            {[6, 14, 22, 30].map((x) => <circle key={x} cx={x} cy={y} r="1.4" fill="#E5E5E5" fillOpacity="0.6" />)}
          </React.Fragment>
        ))}
      </svg>
    ),
    // Rosette de trame : quatre grilles de points tournées (cyan/magenta/
    // jaune/noir), aux angles classiques de l'impression CMJN.
    centerpiece: () => {
      const R = 62;
      const layers = [
        { angle: 15, color: '#4dd0e1' },
        { angle: 75, color: '#f06292' },
        { angle: 0, color: '#fff176' },
        { angle: 45, color: '#E5E5E5' },
      ];
      return (
        <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
          <circle cx="85" cy="85" r={R + 4} stroke="#E5E5E5" strokeOpacity="0.15" strokeWidth="1" />
          {layers.map((l) => (
            <g key={l.angle + l.color} transform="translate(85,85)">
              {halftoneDots(l.angle, 9, R).map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="1.5" fill={l.color} fillOpacity="0.5" />
              ))}
            </g>
          ))}
        </svg>
      );
    },
  },
  {
    key: 'uxui-fitts',
    group: 'uxui',
    subtitle: 'UX/UI DESIGNER',
    badges: ['UX/UI', 'AUDIOVISUEL', 'GRAPHIC DESIGNER'],
    quote: 'Simplicity is about subtracting the obvious and adding the meaningful. · John Maeda',
    logLines: ['PLACE_CURSOR...', 'MEASURE_DISTANCE...', 'COMPUTE_INDEX...', 'PREDICT_TIME...', 'READY'],
    maxWidth: 460,
    caption: "FITTS'S LAW · MT = a + b·log2(2D/W)",
    interactive: 'BOUGE LA SOURIS SUR LE DIAGRAMME',
    info: () => ['©2026', 'W:32', 'LIVE ID'],
    annotations: [
      { text: "FITTS'S LAW · MT = a + b·log2(2D/W)", detail: 'Modélise le temps nécessaire pour atteindre une cible selon sa distance D et sa largeur W ; base théorique du dimensionnement des boutons et zones cliquables.' },
      { text: 'PAUL FITTS, 1954', detail: 'Psychologue américain, il formule cette loi en étudiant la performance motrice humaine pour l’armée de l’air.' },
      { text: 'INDEX OF DIFFICULTY', detail: 'ID = log2(2D/W) : plus une cible est petite ou éloignée, plus la tâche est jugée "difficile".' },
      { text: 'TOUCH TARGET SIZE', detail: 'Apple et Google recommandent une zone tactile minimale d’environ 44×44px, directement issue de cette loi.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="8" cy="28" r="2" fill="#E5E5E5" />
        <circle cx="28" cy="10" r="6" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <line x1="10" y1="26" x2="24" y2="13" stroke="#E5E5E5" strokeWidth="0.6" strokeDasharray="2 2" />
      </svg>
    ),
    // Loi de Fitts : curseur, cible (distance D, largeur W). Tant que la
    // souris ne survole pas le diagramme, un point fait une démo automatique
    // en glissant vers la cible avec le chargement ; au survol, le curseur
    // suit la souris et D / ID (index de difficulté) se recalculent en direct.
    centerpiece: (progress, extra) => {
      const start = [20, 115], end = [205, 55], W = 32;
      const auto = [lerp(start[0], end[0], progress / 100), lerp(start[1], end[1], progress / 100)];
      const cursor = extra?.mousePos ?? auto;
      const dist = Math.hypot(end[0] - cursor[0], end[1] - cursor[1]);
      const idValue = Math.log2((2 * dist) / W + 1).toFixed(2);
      const move = (evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();
        const x = ((evt.clientX - rect.left) / rect.width) * 240;
        const y = ((evt.clientY - rect.top) / rect.height) * 140;
        extra?.setMousePos?.([x, y]);
      };
      return (
        <svg
          width="240"
          height="140"
          viewBox="0 0 240 140"
          fill="none"
          onMouseMove={move}
          onMouseLeave={() => extra?.setMousePos?.(null)}
          style={{ cursor: 'crosshair' }}
        >
          <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx={start[0]} cy={start[1]} r="3" fill="#E5E5E5" fillOpacity="0.6" />
          <circle cx={end[0]} cy={end[1]} r="16" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <circle cx={cursor[0]} cy={cursor[1]} r="3.5" fill="#E5E5E5" />
          <text x={(start[0] + end[0]) / 2} y={(start[1] + end[1]) / 2 - 8} fontSize="7" fill="#E5E5E5" opacity="0.5">D</text>
          <line x1={end[0] - 16} y1="82" x2={end[0] + 16} y2="82" stroke="#E5E5E5" strokeOpacity="0.4" strokeWidth="0.75" />
          <line x1={end[0] - 16} y1="78" x2={end[0] - 16} y2="86" stroke="#E5E5E5" strokeOpacity="0.4" strokeWidth="0.75" />
          <line x1={end[0] + 16} y1="78" x2={end[0] + 16} y2="86" stroke="#E5E5E5" strokeOpacity="0.4" strokeWidth="0.75" />
          <text x={end[0]} y="96" fontSize="7" fill="#E5E5E5" opacity="0.5" textAnchor="middle">W</text>
          <text x="4" y="14" fontSize="7" fill="#E5E5E5" opacity="0.6" fontVariantNumeric="tabular-nums">
            {`D=${dist.toFixed(0)}px  ID=${idValue}`}
          </text>
        </svg>
      );
    },
  },
  {
    key: 'uxui-breakpoints',
    group: 'uxui',
    subtitle: 'UX/UI DESIGNER',
    badges: ['UX/UI', 'AUDIOVISUEL', 'GRAPHIC DESIGNER'],
    quote: "Content precedes design. Design in the absence of content is not design, it's decoration. · Jeffrey Zeldman",
    logLines: ['DETECT_VIEWPORT...', 'MATCH_BREAKPOINT...', 'RESIZE_GRID...', 'REFLOW_LAYOUT...', 'READY'],
    maxWidth: 480,
    caption: 'RESPONSIVE BREAKPOINTS · 320 / 768 / 1024 / 1440',
    interactive: 'GLISSE LE MARQUEUR SUR LA RÈGLE',
    info: (progress, extra) => {
      const bps = [320, 768, 1024, 1440];
      if (extra?.manualBpX != null) {
        const w = Math.round(lerp(300, 1600, (extra.manualBpX - 20) / 220));
        return ['©2026', `${w}PX`, 'MANUAL'];
      }
      const idx = Math.min(3, Math.floor((progress / 100) * 4));
      return ['©2026', `${bps[idx]}PX`, `BUILD.${Math.floor(progress)}`];
    },
    annotations: [
      { text: 'ETHAN MARCOTTE, 2010', detail: 'Il invente le terme "responsive web design" dans un article fondateur pour A List Apart.' },
      { text: 'MOBILE FIRST', detail: 'Approche consistant à concevoir d’abord pour le plus petit écran, puis à enrichir progressivement pour les grands.' },
      { text: 'FLUID GRID', detail: 'Grille dont les colonnes sont définies en pourcentage plutôt qu’en pixels fixes, pour s’adapter à toute largeur d’écran.' },
      { text: '8-POINT GRID SYSTEM', detail: 'Système d’espacement où chaque valeur est un multiple de 8px, garantissant un alignement net sur toutes les densités d’écran.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <rect x="4" y="10" width="6" height="16" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <rect x="14" y="6" width="10" height="24" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <rect x="28" y="2" width="4" height="32" stroke="#E5E5E5" strokeWidth="1" fill="none" />
      </svg>
    ),
    // Règle de largeurs avec les breakpoints standards. Le marqueur glisse
    // avec le chargement par défaut, mais on peut cliquer/glisser sur la
    // règle pour le positionner soi-même et lire le breakpoint correspondant.
    centerpiece: (progress, extra) => {
      const markerX = extra?.manualBpX ?? lerp(20, 240, progress / 100);
      const drag = (evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();
        const x = Math.min(240, Math.max(20, ((evt.clientX - rect.left) / rect.width) * 260));
        extra?.setManualBpX?.(x);
      };
      return (
        <svg
          width="240"
          height="120"
          viewBox="0 0 260 120"
          fill="none"
          onMouseDown={drag}
          onMouseMove={(e) => { if (e.buttons === 1) drag(e); }}
          style={{ cursor: 'ew-resize' }}
        >
          <line x1="20" y1="70" x2="240" y2="70" stroke="#E5E5E5" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="37" y="30" width="8" height="14" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <rect x="93" y="26" width="14" height="18" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <rect x="150" y="24" width="20" height="13" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <line x1="152" y1="37" x2="168" y2="37" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="2" />
          <rect x="208" y="22" width="24" height="15" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <line x1="218" y1="37" x2="222" y2="37" stroke="#E5E5E5" strokeOpacity="0.5" strokeWidth="2" />
          {[[40, '320'], [100, '768'], [160, '1024'], [220, '1440']].map(([x, label]) => (
            <React.Fragment key={label}>
              <line x1={x} y1="65" x2={x} y2="75" stroke="#E5E5E5" strokeOpacity="0.4" strokeWidth="0.75" />
              <text x={x} y="92" fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">{label}</text>
            </React.Fragment>
          ))}
          <line x1={markerX} y1="55" x2={markerX} y2="80" stroke="#E5E5E5" strokeWidth="1.2" />
          <polygon points={`${markerX - 4},50 ${markerX + 4},50 ${markerX},58`} fill="#E5E5E5" />
        </svg>
      );
    },
  },
  {
    key: 'av-lissajous',
    group: 'av',
    subtitle: 'AUDIOVISUAL CREATOR',
    badges: ['AUDIOVISUEL', 'UX/UI', 'GRAPHIC DESIGNER'],
    quote: 'Sound is the vocabulary of nature. · Pierre Schaeffer',
    logLines: ['GEN_SIGNAL_X...', 'GEN_SIGNAL_Y...', 'PHASE_LOCK...', 'TRACE_FIGURE...', 'READY'],
    maxWidth: 420,
    caption: '3:2 LISSAJOUS FIGURE · PHASE SCOPE',
    info: (progress) => ['©2026', 'RATIO 3:2', `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'DECIBEL (dB) · ÉCHELLE LOGARITHMIQUE', detail: 'Chaque +10dB correspond à ×10 en intensité physique, mais seulement environ ×2 en perception sonore.' },
      { text: 'FLETCHER–MUNSON CURVES', detail: 'L’oreille humaine n’est pas également sensible à toutes les fréquences : graves et aigus semblent plus faibles à bas volume.' },
      { text: 'XLR · BALANCED SIGNAL', detail: 'Transmission en phase inversée puis soustraction, pour annuler les interférences électromagnétiques captées sur de longs câbles.' },
      { text: 'ROOM MODES / STANDING WAVES', detail: 'Dans une pièce fermée, certaines fréquences s’accumulent aux dimensions correspondantes, créant des résonances indésirables en enregistrement.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <rect x="4" y="4" width="28" height="28" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        <path d="M10 18 C 14 8, 22 28, 26 18" stroke="#E5E5E5" strokeWidth="0.8" fill="none" />
      </svg>
    ),
    // Figure de Lissajous (rapport 3:2), tracée progressivement — motif
    // classique d'un oscilloscope en mode X-Y (phase scope).
    centerpiece: (progress) => (
      <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
        <line x1="100" y1="15" x2="100" y2="185" stroke="#E5E5E5" strokeOpacity="0.1" strokeWidth="0.75" />
        <line x1="15" y1="100" x2="185" y2="100" stroke="#E5E5E5" strokeOpacity="0.1" strokeWidth="0.75" />
        <path
          d={LISSAJOUS_PATH}
          stroke="#E5E5E5"
          strokeWidth="1"
          fill="none"
          strokeDasharray={LISSAJOUS_LENGTH}
          strokeDashoffset={LISSAJOUS_LENGTH * (1 - progress / 100)}
        />
      </svg>
    ),
  },
  {
    key: 'av-doppler',
    group: 'av',
    subtitle: 'AUDIOVISUAL CREATOR',
    badges: ['AUDIOVISUEL', 'GRAPHIC DESIGNER', 'UX/UI'],
    quote: 'The Doppler shift tells us the universe is expanding. · Edwin Hubble',
    logLines: ['EMIT_WAVEFRONT...', 'TRACK_SOURCE...', 'COMPUTE_SHIFT...', 'SIMULATE_DOPPLER...', 'READY'],
    maxWidth: 460,
    caption: 'DOPPLER EFFECT · fobs = fsrc·(v / (v − vsrc))',
    info: () => ['©2026', 'Δf SHIFT', 'PHYSICS'],
    annotations: [
      { text: 'DOPPLER EFFECT', detail: 'La fréquence perçue d’un son change selon la vitesse relative de la source : c’est la base physique du "vroum" d’un véhicule qui passe.' },
      { text: 'CHRISTIAN DOPPLER, 1842', detail: 'Physicien autrichien, il décrit ce décalage de fréquence dû au mouvement relatif entre une source et un observateur.' },
      { text: 'REDSHIFT / BLUESHIFT', detail: 'En astronomie, ce même effet appliqué à la lumière révèle si une étoile s’éloigne ou se rapproche de nous.' },
      { text: "SIRÈNE D'AMBULANCE", detail: 'Exemple sonore classique : le son perçu est plus aigu à l’approche, plus grave à l’éloignement du véhicule.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="26" cy="18" r="3" fill="#E5E5E5" />
        <circle cx="18" cy="18" r="8" stroke="#E5E5E5" strokeWidth="0.6" fill="none" strokeOpacity="0.5" />
        <circle cx="12" cy="18" r="14" stroke="#E5E5E5" strokeWidth="0.6" fill="none" strokeOpacity="0.3" />
      </svg>
    ),
    // Source en mouvement + fronts d'onde : cercles compressés à l'avant,
    // étalés à l'arrière — schéma classique de l'effet Doppler.
    centerpiece: () => (
      <svg width="230" height="140" viewBox="0 0 240 140" fill="none">
        <circle cx="100" cy="70" r="68" stroke="#E5E5E5" strokeOpacity="0.18" strokeWidth="1" fill="none" />
        <circle cx="125" cy="70" r="48" stroke="#E5E5E5" strokeOpacity="0.26" strokeWidth="1" fill="none" />
        <circle cx="145" cy="70" r="30" stroke="#E5E5E5" strokeOpacity="0.35" strokeWidth="1" fill="none" />
        <circle cx="160" cy="70" r="15" stroke="#E5E5E5" strokeOpacity="0.45" strokeWidth="1" fill="none" />
        <circle cx="170" cy="70" r="4" fill="#E5E5E5" />
        <line x1="170" y1="70" x2="200" y2="70" stroke="#E5E5E5" strokeWidth="1" />
        <polygon points="200,66 200,74 208,70" fill="#E5E5E5" />
        <text x="200" y="58" fontSize="6" fill="#E5E5E5" opacity="0.5">v</text>
        <text x="188" y="118" fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">fobs &gt; fsrc</text>
        <text x="40" y="118" fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">fobs &lt; fsrc</text>
      </svg>
    ),
  },
  {
    key: 'av-colortemp',
    group: 'av',
    subtitle: 'AUDIOVISUAL CREATOR',
    badges: ['AUDIOVISUEL', 'GRAPHIC DESIGNER', 'UX/UI'],
    quote: 'Light is the first of painters. · Ralph Waldo Emerson',
    logLines: ['SAMPLE_WHITE_BALANCE...', 'MAP_KELVIN...', 'CALIBRATE_TINT...', 'RENDER_GRADIENT...', 'READY'],
    maxWidth: 480,
    caption: 'COLOR TEMPERATURE · KELVIN SCALE',
    interactive: 'GLISSE LE CURSEUR SUR LE DÉGRADÉ',
    info: (progress, extra) => {
      if (extra?.manualTempX != null) {
        const k = Math.round(1000 + ((extra.manualTempX - 20) / 220) * 9000);
        return ['©2026', `${k}K`, 'MANUAL'];
      }
      return ['©2026', `${Math.floor(1000 + (progress / 100) * 9000)}K`, `BUILD.${Math.floor(progress)}`];
    },
    annotations: [
      { text: 'LORD KELVIN, 1848', detail: 'Physicien britannique à l’origine de l’échelle de température absolue portant son nom, utilisée pour décrire la teinte lumineuse.' },
      { text: 'TUNGSTÈNE ≈ 3200K', detail: 'Lumière chaude et orangée, standard historique de l’éclairage de plateau cinéma.' },
      { text: 'LUMIÈRE DU JOUR ≈ 5600K', detail: 'Référence "neutre" utilisée pour calibrer la balance des blancs en extérieur.' },
      { text: 'CIEL COUVERT ≈ 7000–10000K', detail: 'Lumière froide et bleutée ; nécessite souvent une correction en post-production.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="10" fill="none" stroke="#E5E5E5" strokeWidth="1" />
        <line x1="18" y1="2" x2="18" y2="6" stroke="#E5E5E5" strokeWidth="1" />
        <line x1="18" y1="30" x2="18" y2="34" stroke="#E5E5E5" strokeWidth="1" />
        <line x1="2" y1="18" x2="6" y2="18" stroke="#E5E5E5" strokeWidth="1" />
        <line x1="30" y1="18" x2="34" y2="18" stroke="#E5E5E5" strokeWidth="1" />
      </svg>
    ),
    // Échelle de température de couleur (Kelvin). Le marqueur glisse avec le
    // chargement par défaut ; cliquer/glisser sur le dégradé le positionne
    // manuellement et affiche la valeur K exacte.
    centerpiece: (progress, extra) => {
      const markerX = extra?.manualTempX ?? lerp(20, 240, progress / 100);
      const drag = (evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();
        const x = Math.min(240, Math.max(20, ((evt.clientX - rect.left) / rect.width) * 260));
        extra?.setManualTempX?.(x);
      };
      return (
        <svg
          width="240"
          height="80"
          viewBox="0 0 260 80"
          fill="none"
          onMouseDown={drag}
          onMouseMove={(e) => { if (e.buttons === 1) drag(e); }}
          style={{ cursor: 'ew-resize' }}
        >
          <defs>
            <linearGradient id="preloaderTempGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff4d00" />
              <stop offset="25%" stopColor="#ffb066" />
              <stop offset="50%" stopColor="#fff4e0" />
              <stop offset="75%" stopColor="#cfe0ff" />
              <stop offset="100%" stopColor="#6699ff" />
            </linearGradient>
          </defs>
          <rect x="20" y="28" width="220" height="16" fill="url(#preloaderTempGrad)" opacity="0.85" />
          <rect x="20" y="28" width="220" height="16" stroke="#E5E5E5" strokeOpacity="0.25" strokeWidth="1" fill="none" />
          {[[20, '1000K'], [76, '3200K'], [124, '5000K'], [162, '6500K'], [240, '10000K']].map(([x, label]) => (
            <React.Fragment key={label}>
              <line x1={x} y1="44" x2={x} y2="50" stroke="#E5E5E5" strokeOpacity="0.3" strokeWidth="0.75" />
              <text x={x} y="60" fontSize="6" fill="#E5E5E5" opacity="0.4" textAnchor="middle">{label}</text>
            </React.Fragment>
          ))}
          <polygon points={`${markerX - 4},20 ${markerX + 4},20 ${markerX},27`} fill="#E5E5E5" />
        </svg>
      );
    },
  },
  {
    key: 'psg-champions',
    group: 'personal',
    subtitle: 'PARIS SAINT-GERMAIN',
    badges: ['PARIS', 'ROUGE ET BLEU', 'CHAMPIONS D’EUROPE'],
    quote: 'A team of 11 stars, that’s football. · Luis Enrique',
    logLines: ['LOAD_TIFO...', 'INIT_PARC_DES_PRINCES...', 'SYNC_ETOILES...', 'RENDER_TROPHEE...', 'READY'],
    maxWidth: 420,
    caption: 'PARIS SAINT-GERMAIN · 2× CHAMPIONS D’EUROPE',
    info: (progress) => ['©2026', '14 Ligue 1 · 16 Coupe de France · 14 Trophée des Champions · 9 Coupe de la Ligue · 2 Ligue des Champions · 2 Supercoupe d’Europe · 1 Coupe Intercontinentale · 1 Coupe d’Europe des vainqueurs de coupe · 1 Coupe Intertoto', `BUILD.${Math.floor(progress)}`],
    annotations: [
      { text: 'PREMIER SACRE EUROPÉEN, 2025', detail: 'Le Paris Saint-Germain remporte sa première Ligue des Champions en 2025, après des décennies d’attente pour le club et ses supporters.' },
      { text: 'PARC DES PRINCES, DEPUIS 1974', detail: 'Stade historique du club dans le 16e arrondissement de Paris, réputé pour l’ambiance de son Kop et sa forme d’amphithéâtre unique en Europe.' },
      { text: 'UEFA CHAMPIONS LEAGUE', detail: 'La plus prestigieuse compétition de clubs en Europe, disputée chaque saison depuis 1955 sous le nom de Coupe des clubs champions européens.' },
      { text: 'UNE ÉTOILE PAR TITRE', detail: 'Convention héritée du football sud-américain : chaque étoile au-dessus d’un blason représente un titre continental majeur remporté par le club.' },
      { text: 'PALMARÈS COMPLET, 60 TROPHÉES', detail: 'Depuis la fondation du club en 1970 : 14 Ligue 1 · 16 Coupe de France · 14 Trophée des Champions · 9 Coupe de la Ligue · 2 Ligue des Champions · 2 Supercoupes d’Europe · 1 Coupe Intercontinentale · 1 Coupe d’Europe des vainqueurs de coupe · 1 Coupe Intertoto.' },
    ],
    icon: (
      <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
        <image href="/images/psg-star-mono.svg" x="4" y="4.7" width="28" height="27.3" />
      </svg>
    ),
    // Vrai blason du club (fichier Wikipédia, fourni par l'utilisateur),
    // reteinté en niveaux du beige du site plutôt que ses couleurs
    // officielles (bleu/rouge/or) — cohérent avec les 12 autres variantes.
    // Apparaît en "tampon" (scale-in) avec le chargement plutôt qu'un tracé
    // au trait, puisque c'est une image en aplats et non du line-art.
    // Deux étoiles fixes au-dessus (une par titre européen déjà acquis) et
    // un halo pointillé tournant une fois le blason presque en place.
    centerpiece: (progress) => {
      const cx = 100, cy = 128;
      const haloOpacity = Math.max(0, Math.min(1, (progress - 85) / 15));
      const crestScale = Math.max(0, Math.min(1, progress / 90));
      return (
        <svg width="170" height="210" viewBox="0 0 200 240" fill="none">
          <image className="preloader__psg-star" href="/images/psg-star-mono.svg" x="66" y="0.5" width="24" height="23.4" opacity="0.85" />
          <image className="preloader__psg-star" href="/images/psg-star-mono.svg" x="110" y="0.5" width="24" height="23.4" opacity="0.85" />
          <text x="78" y="32" fontSize="7" fill="#E5E5E5" opacity="0.5" textAnchor="middle">2025</text>
          <text x="122" y="32" fontSize="7" fill="#E5E5E5" opacity="0.5" textAnchor="middle">2026</text>

          <image
            href="/images/psg-crest-mono.svg"
            x={cx - 68} y={cy - 68} width="136" height="136"
            opacity={crestScale}
            style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${0.85 + crestScale * 0.15})` }}
          />

          {/* Reflet qui balaie le blason en continu, une fois en place */}
          <defs>
            <clipPath id="psgShineClip">
              <circle cx={cx} cy={cy} r="58" />
            </clipPath>
            <linearGradient id="psgShineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E5E5E5" stopOpacity="0" />
              <stop offset="50%" stopColor="#E5E5E5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E5E5E5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g clipPath="url(#psgShineClip)" opacity={haloOpacity}>
            <rect
              className="preloader__psg-shine"
              x={cx - 12} y={cy - 140} width="24" height="280"
              fill="url(#psgShineGrad)"
            />
          </g>
        </svg>
      );
    },
  },
];

const Preloader = ({ onComplete, minDuration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentLog, setCurrentLog] = useState(0);
  const [variant] = useState(() => VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
  const spectrumBars = useMemo(() => generateSpectrum(42), []);
  // État des quelques centerpieces interactifs à la souris : tant que
  // l'utilisateur n'a pas touché au diagramme, chaque valeur reste `null`
  // et le centerpiece se rabat sur son animation automatique liée à
  // `progress` — l'interaction, quand elle a lieu, prend le dessus.
  const [mousePos, setMousePos] = useState(null);
  const [manualBpX, setManualBpX] = useState(null);
  const [manualTempX, setManualTempX] = useState(null);

  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const centerpieceRef = useRef(null);
  const badgesRef = useRef(null);
  const barRef = useRef(null);
  const statusRef = useRef(null);
  const quoteRef = useRef(null);
  const cornersRef = useRef(null);
  const footerRef = useRef(null);
  const ctaRef = useRef(null);
  const scanlineRef = useRef(null);
  const curtainRef = useRef(null);
  // Le rideau de sortie ne doit se jouer qu'une fois — sans ce garde, un
  // clic sur "PASSER" pile au moment où la barre atteint 100% déclencherait
  // la même timeline GSAP deux fois en parallèle.
  const hasExitedRef = useRef(false);
  const rafRef = useRef(null);

  // <body> a `transform: translateZ(0)` sur desktop (perf Lenis, index.css),
  // ce qui crée un stacking context : un simple z-index élevé à l'intérieur
  // de <body> ne suffit plus à passer au-dessus d'éléments portalés hors de
  // <body> (le header, notamment — voir Home.jsx). Portail attaché à <html>
  // pour rester au-dessus de tout, même chose.
  const [portalNode, setPortalNode] = useState(null);
  useEffect(() => {
    const node = document.createElement('div');
    document.documentElement.appendChild(node);
    setPortalNode(node);
    return () => document.documentElement.removeChild(node);
  }, []);

  // Entrée : le panneau descend en rideau depuis le haut (symétrique du
  // rideau de sortie qui remonte), suivi d'un balayage lumineux façon "boot
  // scan" une fois en place, puis les blocs du HUD apparaissent en cascade
  // (fondu + léger décalage vertical, badges et coins déclinés item par
  // item) plutôt que tous d'un coup.
  useEffect(() => {
    if (!portalNode) return undefined;

    const els = [
      headerRef.current,
      centerpieceRef.current,
      barRef.current,
      statusRef.current,
      quoteRef.current,
      ctaRef.current,
      footerRef.current,
    ].filter(Boolean);

    // C'est le calque `curtain` qui glisse — le fond noir de `.preloader`
    // (rootRef) reste fixe et opaque en permanence, sinon on verrait la
    // vraie page apparaître par en dessous pendant la descente.
    gsap.set(curtainRef.current, { yPercent: -100 });
    gsap.set(els, { opacity: 0, y: 10 });
    gsap.set(cornersRef.current?.children, { opacity: 0, y: 0, scale: 0.6 });
    gsap.set(badgesRef.current?.children, { opacity: 0, y: 8, scale: 0.9 });
    gsap.set(scanlineRef.current, { top: '0%', opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } });
    tl.to(curtainRef.current, { yPercent: 0, duration: 0.7, ease: 'power4.out' }, 0)
      .to(scanlineRef.current, { opacity: 1, duration: 0.1 }, 0.45)
      .fromTo(scanlineRef.current, { top: '0%' }, { top: '100%', duration: 0.55, ease: 'power2.inOut' }, 0.45)
      .to(scanlineRef.current, { opacity: 0, duration: 0.2 }, 0.95)
      .to(cornersRef.current?.children, { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4 }, 0.5)
      .to(headerRef.current, { opacity: 1, y: 0 }, 0.6)
      .to(centerpieceRef.current, { opacity: 1, y: 0 }, 0.68)
      .to(badgesRef.current?.children, { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.35 }, 0.84)
      .to(barRef.current, { opacity: 1, y: 0 }, 0.96)
      .to(statusRef.current, { opacity: 1, y: 0 }, 1.02)
      .to(quoteRef.current, { opacity: 1, y: 0 }, 1.08)
      .to(ctaRef.current, { opacity: 1, y: 0 }, 1.14)
      .to(footerRef.current, { opacity: 1, y: 0 }, 1.0);

    return () => tl.kill();
  }, [portalNode]);

  // Bloquer le scroll pendant le chargement
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // Sortie en "rideau" : le contenu se resserre d'abord, puis tout le
  // panneau glisse hors de l'écran vers le haut (même direction/ease que le
  // rideau de transition de page, pour rester cohérent). Partagée entre la
  // fin naturelle du chargement et le clic sur le CTA "PASSER".
  const runExit = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const content = [
      headerRef.current,
      centerpieceRef.current,
      badgesRef.current,
      barRef.current,
      statusRef.current,
      quoteRef.current,
      ctaRef.current,
      footerRef.current,
    ].filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (onComplete) onComplete();
      },
    });
    tl.to(content, { opacity: 0, y: -8, duration: 0.3, stagger: 0.02, ease: 'power2.in' })
      .to(rootRef.current, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, 0.15);
  };

  useEffect(() => {
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);
      setCurrentLog(Math.min(Math.floor(newProgress / 20), 4));

      if (newProgress < 100) {
        rafRef.current = requestAnimationFrame(updateProgress);
      } else {
        // À 100%, on enchaîne automatiquement sur le rideau de sortie — le
        // CTA/la molette restent un raccourci pour sauter l'attente, mais
        // ne sont plus nécessaires pour entrer sur le site.
        runExit();
      }
    };

    rafRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafRef.current);
  }, [minDuration, onComplete]);

  const handleSkip = () => {
    setProgress(100);
    runExit();
  };

  // Le scroll (molette/trackpad) vaut clic sur le CTA : un geste de scroll
  // dit "laisse-moi entrer" aussi clairement qu'un clic — pas besoin
  // d'attendre la fin du chargement pour que ce raccourci fonctionne.
  useEffect(() => {
    const onWheel = () => handleSkip();
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  if (!isVisible || !portalNode) return null;

  const centerpieceExtra = {
    bars: spectrumBars,
    mousePos, setMousePos,
    manualBpX, setManualBpX,
    manualTempX, setManualTempX,
  };

  return createPortal(
    <>
      <style>{`
        .preloader {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: #000 !important;
          overflow: hidden !important;
          z-index: 999999 !important;
          font-family: 'PP Neue Montreal', 'Satoshi', sans-serif !important;
        }
        .preloader__curtain {
          position: absolute !important;
          inset: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .preloader__grid {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background-image: linear-gradient(rgba(229,229,229,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(229,229,229,0.03) 1px, transparent 1px) !important;
          background-size: 40px 40px !important;
          pointer-events: none !important;
        }
        .preloader__scanline {
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          height: 2px !important;
          background: linear-gradient(90deg, transparent, rgba(229,229,229,0.7), transparent) !important;
          box-shadow: 0 0 14px rgba(229,229,229,0.55) !important;
          pointer-events: none !important;
          z-index: 3 !important;
        }
        .preloader__content {
          position: relative !important;
          z-index: 1 !important;
          width: 90% !important;
        }
        .preloader__header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 24px !important;
        }
        .preloader__logo {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .preloader__logo-icon {
          display: block !important;
        }
        .preloader__logo-text {
          color: #E5E5E5 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          letter-spacing: 2px !important;
        }
        .preloader__logo-sub {
          color: #E5E5E5 !important;
          font-size: 9px !important;
          opacity: 0.5 !important;
          letter-spacing: 1px !important;
        }
        .preloader__circuit {
          display: block !important;
        }
        .preloader__centerpiece-wrap {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          margin-bottom: 8px !important;
        }
        .preloader__centerpiece {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
        }
        .preloader__caption {
          text-align: center !important;
          color: #E5E5E5 !important;
          font-size: 9px !important;
          opacity: 0.35 !important;
          letter-spacing: 0.5px !important;
          margin-top: 8px !important;
          margin-bottom: 18px !important;
          font-variant-numeric: tabular-nums !important;
        }
        .preloader__interactive-tag {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          margin-top: 10px !important;
          padding: 3px 9px !important;
          border: 1px solid rgba(229,229,229,0.35) !important;
          color: #E5E5E5 !important;
          font-size: 8px !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
        }
        .preloader__interactive-dot {
          width: 5px !important;
          height: 5px !important;
          border-radius: 50% !important;
          background: #E5E5E5 !important;
          animation: preloaderPulse 1.2s ease-in-out infinite !important;
        }
        @keyframes preloaderPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .preloader__psg-star {
          transform-box: fill-box !important;
          transform-origin: center !important;
          animation: preloaderStarGlow 2.4s ease-in-out infinite !important;
        }
        .preloader__psg-star:nth-child(2) {
          animation-delay: 0.6s !important;
        }
        @keyframes preloaderStarGlow {
          0%, 100% { opacity: 0.7; filter: none; }
          50% { opacity: 1; filter: drop-shadow(0 0 3px rgba(229,229,229,0.9)); }
        }
        .preloader__psg-shine {
          transform-box: fill-box !important;
          transform-origin: center !important;
          animation: preloaderShineSweep 3.5s ease-in-out infinite !important;
        }
        @keyframes preloaderShineSweep {
          0%, 10% { transform: translateX(-90px) rotate(24deg); }
          60%, 100% { transform: translateX(90px) rotate(24deg); }
        }
        .preloader__badges {
          display: flex !important;
          gap: 8px !important;
          margin-bottom: 25px !important;
          flex-wrap: wrap !important;
        }
        .preloader__badge {
          padding: 4px 10px !important;
          border: 1px solid rgba(229,229,229,0.4) !important;
          color: #E5E5E5 !important;
          font-size: 9px !important;
          letter-spacing: 1px !important;
        }
        .preloader__bar-container {
          margin-bottom: 12px !important;
        }
        .preloader__bar {
          height: 2px !important;
          background: rgba(229,229,229,0.15) !important;
        }
        .preloader__bar-fill {
          height: 100% !important;
          background: #E5E5E5 !important;
          box-shadow: 0 0 10px rgba(229,229,229,0.5) !important;
        }
        .preloader__status {
          display: flex !important;
          justify-content: space-between !important;
          color: #E5E5E5 !important;
          font-size: 10px !important;
          letter-spacing: 1px !important;
          font-variant-numeric: tabular-nums !important;
        }
        .preloader__log {
          opacity: 0.5 !important;
        }
        .preloader__quote {
          text-align: center !important;
          color: #E5E5E5 !important;
          font-size: 11px !important;
          opacity: 0.4 !important;
          margin-top: 30px !important;
          font-style: italic !important;
          letter-spacing: 1px !important;
        }
        .preloader__cta-wrap {
          display: flex !important;
          justify-content: center !important;
          margin-top: 24px !important;
        }
        .preloader__cta {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 8px 16px !important;
          background: transparent !important;
          border: 1px solid rgba(229,229,229,0.4) !important;
          color: #E5E5E5 !important;
          font-family: 'PP Neue Montreal', 'Satoshi', sans-serif !important;
          font-weight: 600 !important;
          font-size: 10px !important;
          letter-spacing: 2px !important;
          cursor: pointer !important;
          transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease !important;
        }
        .preloader__cta:hover {
          background: rgba(229,229,229,0.08) !important;
          border-color: rgba(229,229,229,0.8) !important;
        }
        .preloader__cta-arrow {
          transition: transform 0.2s ease !important;
        }
        .preloader__cta:hover .preloader__cta-arrow {
          transform: translateX(3px) !important;
        }
        .preloader__corner {
          position: absolute !important;
          width: 30px !important;
          height: 30px !important;
          border-color: rgba(229,229,229,0.2) !important;
          border-style: solid !important;
          border-width: 0 !important;
        }
        .preloader__corner--tl {
          top: 20px !important;
          left: 20px !important;
          border-top-width: 1px !important;
          border-left-width: 1px !important;
        }
        .preloader__corner--tr {
          top: 20px !important;
          right: 20px !important;
          border-top-width: 1px !important;
          border-right-width: 1px !important;
        }
        .preloader__corner--bl {
          bottom: 20px !important;
          left: 20px !important;
          border-bottom-width: 1px !important;
          border-left-width: 1px !important;
        }
        .preloader__corner--br {
          bottom: 20px !important;
          right: 20px !important;
          border-bottom-width: 1px !important;
          border-right-width: 1px !important;
        }
        .preloader__footer {
          position: absolute !important;
          bottom: 30px !important;
          display: flex !important;
          gap: 20px !important;
          color: #E5E5E5 !important;
          font-size: 8px !important;
          opacity: 0.3 !important;
          letter-spacing: 2px !important;
        }
        .preloader__footer-link {
          color: inherit !important;
          text-decoration: underline !important;
          text-decoration-style: dotted !important;
          text-underline-offset: 2px !important;
          cursor: pointer !important;
          transition: opacity 0.2s ease, text-decoration-style 0.2s ease !important;
        }
        .preloader__footer-link:hover {
          opacity: 0.7 !important;
          text-decoration-style: solid !important;
        }
      `}</style>

      <div ref={rootRef} className="preloader">
        <div ref={curtainRef} className="preloader__curtain">
        <div className="preloader__grid" />
        <div ref={scanlineRef} className="preloader__scanline" />

        <div className="preloader__content" style={{ maxWidth: variant.maxWidth }}>
          {/* Header */}
          <div ref={headerRef} className="preloader__header">
            <div className="preloader__logo">
              {variant.icon}
              <div>
                <div className="preloader__logo-text">RAFAEL PIRAL</div>
                <div className="preloader__logo-sub">{variant.subtitle}</div>
              </div>
            </div>

            {/* Circuit decoration */}
            <svg className="preloader__circuit" width="40" height="24" viewBox="0 0 40 24">
              <line x1="0" y1="12" x2="12" y2="12" stroke="#E5E5E5" strokeWidth="1" />
              <line x1="28" y1="12" x2="40" y2="12" stroke="#E5E5E5" strokeWidth="1" />
              <rect x="12" y="6" width="16" height="12" stroke="#E5E5E5" strokeWidth="1" fill="none" />
              <circle cx="6" cy="12" r="2" fill="#E5E5E5" />
              <circle cx="34" cy="12" r="2" fill="#E5E5E5" />
            </svg>
          </div>

          {/* Centerpiece — diagramme scientifique unique par variante */}
          <div ref={centerpieceRef} className="preloader__centerpiece-wrap">
            <div className="preloader__centerpiece">
              {variant.centerpiece(progress, centerpieceExtra)}
            </div>
            {variant.interactive && (
              <div className="preloader__interactive-tag">
                <span className="preloader__interactive-dot" />
                {variant.interactive}
              </div>
            )}
            {variant.caption && <div className="preloader__caption">{variant.caption}</div>}
          </div>

          {/* Badges */}
          <div ref={badgesRef} className="preloader__badges">
            {variant.badges.map((b) => (
              <span key={b} className="preloader__badge">{b}</span>
            ))}
          </div>

          {/* Progress bar */}
          <div ref={barRef} className="preloader__bar-container">
            <div className="preloader__bar">
              <div className="preloader__bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Status */}
          <div ref={statusRef} className="preloader__status">
            <span className="preloader__log">{variant.logLines[currentLog]}</span>
            <span>{Math.floor(progress)}%</span>
          </div>

          {/* Quote */}
          <div ref={quoteRef} className="preloader__quote">
            {variant.quote}
          </div>

          {/* CTA — passe directement au rideau de sortie */}
          <div ref={ctaRef} className="preloader__cta-wrap">
            <button type="button" className="preloader__cta" onClick={handleSkip}>
              <span>{progress >= 100 ? 'ENTRER' : 'PASSER'}</span>
              <span className="preloader__cta-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Corner decorations */}
        <div ref={cornersRef}>
          <div className="preloader__corner preloader__corner--tl" />
          <div className="preloader__corner preloader__corner--tr" />
          <div className="preloader__corner preloader__corner--bl" />
          <div className="preloader__corner preloader__corner--br" />
        </div>

        {/* Footer */}
        <div ref={footerRef} className="preloader__footer">
          <span>FRANCE</span>
          <span>•</span>
          <a
            href="https://fr.wikipedia.org/wiki/Le_Pré-Saint-Gervais"
            target="_blank"
            rel="noopener noreferrer"
            className="preloader__footer-link"
          >
            LE PRÉ-SAINT-GERVAIS 93310
          </a>
          <span>•</span>
          <span>48.8819°N 2.4108°E</span>
        </div>
        </div>
      </div>
    </>,
    portalNode
  );
};

export default Preloader;
