import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Renderer, Camera, Transform, Plane, Box, Program, Mesh, Texture, Mat4, Geometry, Cylinder } from 'ogl';
import { projects } from '../data/projects';
import { museumAvailable, touchDevice } from '../utils/museumAccess';
import { SOCIAL_LOGOS } from '../data/socialLogos';
import { MUSEE_PLAYLIST } from '../data/museePlaylist';
import { MUSEE_EXHIBITS } from '../data/museeExhibits';

// Musée d'affiches en 3D : une galerie dans laquelle on marche, les affiches
// accrochées aux deux murs sous leur projecteur, un cartel à côté de chacune.
// Rendu WebGL avec OGL (déjà utilisé pour les shaders de la Home).

// Affiches exposées : la liste vient de data/museeExhibits.js ; titre, année
// et description viennent de la fiche projet correspondante.
const EXHIBITS = MUSEE_EXHIBITS.map((exhibit) => {
  const project = projects.find((p) => p.slug === exhibit.slug);
  return {
    ...exhibit,
    src: `/images/musee/${exhibit.image}.webp`,
    srcHd: `/images/musee/hd/${exhibit.image}.webp`,
    title: project?.shortTitle || project?.title || exhibit.slug,
    year: project?.year || '',
    category: project?.category || '',
    description: project?.description || '',
  };
});

// Dimensions de la salle, en mètres. La galerie s'étend vers -z.
const FIRST_Z = -3; // première paire d'affiches
const SPACING = 4; // entre deux paires
// La salle s'allonge avec le nombre d'affiches : 3,5 m après la dernière paire
const HALL = { halfWidth: 5, height: 5, zBack: 2.2, zEnd: FIRST_Z - SPACING * (Math.ceil(EXHIBITS.length / 2) - 1) - 3.5 };
const POSTER = { width: 1.2, height: 1.7, centerY: 1.75 };
const EYE = 1.65;
const FOV = 58;
const WALK_SPEED = 3.2;
const TURN_SPEED = 1.7;

// Coin écoute : un socle au milieu de la galerie, entre deux paires
// d'affiches, avec une platine posée dessus.
const STATION = { x: 0, z: -9, width: 0.66, depth: 0.52, height: 0.9 };
// Bancs au centre de la salle, de part et d'autre du coin écoute
const BENCHES = [{ x: 0, z: -4.6 }, { x: 0, z: -14.6 }];
const BENCH = { width: 1.8, depth: 0.5, height: 0.45 };
// Verrière : bandeau lumineux au centre du plafond
const SKYLIGHT = { halfWidth: 1.7, panel: 2.5 };
// Fenêtres : une porte-fenêtre dans chaque intervalle entre deux affiches,
// sur les deux murs. Légèrement décalées vers l'entrée pour laisser la place
// au cartel de l'affiche suivante.
const WINDOW = { width: 1.2, height: 2.8, sill: 0.75, shift: 0.25 };
const WINDOW_GAPS = Math.ceil(EXHIBITS.length / 2) - 1;
const windowZ = (gap) => FIRST_Z - SPACING * (gap + 0.5) + WINDOW.shift;
// Corniche : profil en gradins à la jonction des murs et du plafond, du
// plafond vers le bas. Chaque gradin : avancée depuis le mur et hauteur.
const CORNICE = [
  { depth: 0.27, height: 0.06 },
  { depth: 0.2, height: 0.07 },
  { depth: 0.13, height: 0.06 },
  { depth: 0.045, height: 0.1 },
];
const CORNICE_HEIGHT = CORNICE.reduce((total, step) => total + step.height, 0);
// Caissons : cadres moulurés au plafond, entre la verrière et la corniche
const COFFER = { inner: SKYLIGHT.halfWidth + 0.32, outer: HALL.halfWidth - 0.55 };
// Porte d'entrée : elle s'ouvre quand on s'en approche, et la franchir
// ramène au portfolio.
// Derrière elle, la vraie page d'accueil du portfolio, vivante, est placée de
// façon à remplir exactement l'écran quand le visiteur est sur le seuil (à
// `threshold` de la porte, regard droit) : à cet instant elle passe au
// premier plan et la navigation se fait dessous, sans coupure visible.
const EXIT = { width: 2, height: 3.1, openWithin: 3.4, threshold: 0.3 };
// Réseaux de Rafael : un téléviseur accroché au mur d'entrée, de l'autre côté
// de la porte par rapport au texte de salle. Son écran affiche une ligne par
// réseau ; un clic sur une ligne ouvre le réseau. logo : son tracé dans
// SOCIAL_LOGOS ; color : la couleur de la marque.
const SOCIALS = [
  { name: 'Instagram', logo: 'instagram', handle: '@rafa31z', href: 'https://www.instagram.com/rafa31z/', color: '#e1306c' },
  { name: 'LinkedIn', logo: 'linkedin', handle: 'Rafael Piral', href: 'https://www.linkedin.com/in/rafaelpiral', color: '#0a66c2' },
  { name: 'Behance', logo: 'behance', handle: 'rafaelpiral1', href: 'https://www.behance.net/rafaelpiral1', color: '#1769ff' },
  { name: 'GitHub', logo: 'github', handle: 'rafaelpir', href: 'https://github.com/rafaelpir', color: '#f4f1ea' },
];
// L'écran (dalle 16:9) : centre, dimensions en mètres, part de la hauteur
// prise par le bandeau de titre ; le reste est partagé entre les lignes.
const TV = { x: -3.05, y: 1.78, width: 1.9, height: 1.07, header: 0.27, bezel: 0.014, depth: 0.045 };
const TV_ROW = (TV.height * (1 - TV.header - 0.05)) / SOCIALS.length;
const socialY = (index) => TV.y + TV.height / 2 - TV.height * TV.header - TV_ROW * (index + 0.5);

// Position de chaque affiche : côté (-1 mur gauche, +1 mur droit) et z
const placement = (index) => ({ side: index % 2 === 0 ? -1 : 1, z: FIRST_Z - SPACING * Math.floor(index / 2) });

// Autres visiteurs : personnages 3D dans une pose de spectateur, appuyé sur
// une jambe, main au menton, mains dans le dos, sur la hanche… (avatars
// Microsoft Rocketbox, licence MIT, préparés avec Blender ; fichiers dans
// public/models/visiteurs/). Chacun se tient devant une affiche, un peu de
// côté pour ne pas la cacher quand on vient la regarder à son tour.
const VISITORS = [
  // affiche (index dans la visite), décalage le long du mur, distance au mur
  { model: 'm09', poster: 1, aside: -0.75, back: 1.55 },
  { model: 'm01', poster: 2, aside: 0.78, back: 1.45 },
  // un couple devant la même affiche
  { model: 'f04', poster: 5, aside: 0.8, back: 1.7 },
  { model: 'm05', poster: 5, aside: -0.78, back: 1.5 },
  { model: 'f13', poster: 6, aside: 0.76, back: 1.6 },
].map((visitor) => {
  const { side, z } = placement(visitor.poster);
  const x = side * (HALL.halfWidth - visitor.back);
  // tourné vers le centre de l'affiche
  return { ...visitor, x, z: z + visitor.aside, yaw: Math.atan2(side * HALL.halfWidth - x, -visitor.aside) };
});
// Téléphone d'exposition : le prototype du site mobile Armor Immo (Figma).
// Un vrai téléphone, à sa taille réelle, posé à plat sur un pupitre incliné,
// à côté du coin écoute : les deux objets « numériques » de la salle sont
// réunis au centre, sur le chemin de la visite. L'écran montre la page
// d'accueil du site ; un clic ouvre le vrai prototype, qu'on peut parcourir.
const PHONE = { x: STATION.x + 1.15, z: STATION.z, stand: 1.0, width: 0.0715, height: 0.1505, depth: 0.0078, slope: 0.36 };
const PHONE_PROJECT = projects.find((project) => project.slug === 'branding-agence-immobiliere');
const OBSTACLES = [
  { x: PHONE.x, z: PHONE.z, width: 0.36, depth: 0.32 },
  ...VISITORS.map((visitor) => ({ x: visitor.x, z: visitor.z, width: 0.25, depth: 0.25 })),
  STATION, ...BENCHES.map((bench) => ({ ...bench, width: BENCH.width, depth: BENCH.depth })),
];


// Projecteurs : un par affiche, sur un rail au plafond, à SPOT_SETBACK du mur
const SPOT_SETBACK = 2;
const SPOT_Y = HALL.height - 0.16;
const PAIRS = Math.ceil(EXHIBITS.length / 2);
const f = (value) => value.toFixed(3);

const VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

// Éclairage commun à toutes les surfaces : de vrais projecteurs (cône,
// distance, inclinaison de la surface) plus une lumière d'ambiance réchauffée
// près des zones éclairées. Les projecteurs étant régulièrement espacés, on
// retrouve les plus proches par le calcul plutôt qu'en passant leur liste.
const LIGHTING = /* glsl */ `
  uniform vec3 cameraPosition;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormal;

  const vec3 WARM = vec3(1.0, 0.93, 0.82);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 u = fract(p);
    u = u * u * u * (u * (u * 6.0 - 15.0) + 10.0); // pente continue d'une cellule à l'autre
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float spot(vec3 p, vec3 n, vec3 source, vec3 target) {
    vec3 toLight = source - p;
    float d = length(toLight);
    vec3 l = toLight / d;
    float cone = smoothstep(0.6, 0.93, dot(-l, normalize(target - source)));
    return cone * max(dot(n, l), 0.0) / (1.0 + 0.22 * d * d);
  }

  // Lumière reçue en p (normale n) : x = directe, y = ambiance
  vec2 lighting(vec3 p, vec3 n) {
    float direct = 0.0;
    float bounce = 0.0;
    float nearest = floor((${f(FIRST_Z)} - p.z) / ${f(SPACING)} + 0.5);
    for (int k = -1; k <= 1; k++) {
      float index = nearest + float(k);
      if (index < 0.0 || index > ${f(PAIRS - 1)}) continue;
      float z = ${f(FIRST_Z)} - ${f(SPACING)} * index;
      for (int s = -1; s <= 1; s += 2) {
        float side = float(s);
        vec3 target = vec3(side * ${f(HALL.halfWidth)}, ${f(POSTER.centerY)}, z);
        direct += spot(p, n, vec3(side * ${f(HALL.halfWidth - SPOT_SETBACK)}, ${f(SPOT_Y)}, z), target);
        vec3 d = p - target;
        bounce += exp(-dot(d, d) / 7.0);
      }
    }
    vec3 endTarget = vec3(0.0, 2.6, ${f(HALL.zEnd)});
    direct += spot(p, n, vec3(0.0, ${f(SPOT_Y)}, ${f(HALL.zEnd + 2.0)}), endTarget);
    bounce += exp(-dot(p - endTarget, p - endTarget) / 7.0);
    vec3 backTarget = vec3(3.05, 2.0, ${f(HALL.zBack)});
    direct += 0.8 * spot(p, n, vec3(3.05, ${f(SPOT_Y)}, ${f(HALL.zBack - 1.8)}), backTarget);
    bounce += 0.8 * exp(-dot(p - backTarget, p - backTarget) / 7.0);
    // Coin écoute : une douche de lumière sur le socle
    vec3 stationTarget = vec3(${f(STATION.x)}, ${f(STATION.height)}, ${f(STATION.z)});
    direct += 0.75 * spot(p, n, vec3(${f(STATION.x)}, ${f(SPOT_Y)}, ${f(STATION.z + 0.5)}), stationTarget);
    bounce += 0.5 * exp(-dot(p - stationTarget, p - stationTarget) / 4.0);
    // Salle baignée par la verrière : l'ambiance domine, les projecteurs
    // n'ajoutent qu'un accent chaud sur les œuvres
    return vec2(1.7 * direct, 0.8 + 0.02 * bounce);
  }

  // Épaule douce : les zones très éclairées saturent progressivement
  float shoulder(float x) {
    return 1.35 * x / (1.0 + 0.35 * x);
  }
  float fogAt(vec3 p) {
    return exp(-distance(p, cameraPosition) * 0.004);
  }
  float grain() {
    return (hash(gl_FragCoord.xy) - 0.5) * 0.01;
  }
`;

// Murs, sol, plafond. uKind : 0 = mur à affiches, 1 = sol, 2 = plafond,
// 3 = mur d'extrémité, 4 = mobilier (rails, projecteurs).
// uMirror = 1 : copie renversée sous le sol, qui en fait le reflet.
const ROOM_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3 uAlbedo;
  uniform float uKind;
  uniform float uMirror;
  uniform sampler2D tPlaster;
  ${LIGHTING}

  float boxDistance(vec2 p, vec2 halfSize) {
    vec2 d = abs(p) - halfSize;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  void main() {
    vec3 p = vWorld;
    if (uMirror > 0.5) p.y = -p.y;
    vec3 n = normalize(vNormal);
    vec2 light = lighting(p, n);
    vec3 albedo = uAlbedo;
    float alpha = 1.0;

    bool wall = uKind < 0.5 || (uKind > 2.5 && uKind < 3.5);

    // Occlusion dans les angles de la salle
    float edge = wall ? min(p.y, ${f(HALL.height)} - p.y) : ${f(HALL.halfWidth)} - abs(p.x);
    float occlusion = mix(0.8, 1.0, smoothstep(0.0, 0.6, edge));
    float shade = 1.0;

    if (wall) {
      // Enduit taloché : la texture donne la pente du relief (rouge, vert)
      // et sa hauteur (bleu). La normale suit cette pente, donc le relief
      // accroche la lumière rasante des projecteurs comme un vrai mur. Deux
      // échelles superposées évitent que le motif se répète à l'œil.
      vec2 q = uKind < 0.5 ? p.zy : p.xy;
      vec3 tangent = uKind < 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
      vec3 fine = texture2D(tPlaster, q * 0.85).rgb;
      vec3 broad = texture2D(tPlaster, q * 0.19 + 0.37).rgb;
      vec2 slope = (fine.rg - 0.5) + 0.7 * (broad.rg - 0.5);
      // Mur de musée : enduit lisse, le relief se devine à peine
      n = normalize(n - 0.09 * (tangent * slope.x + vec3(0.0, 1.0, 0.0) * slope.y));
      light = lighting(p, n);
      albedo *= 0.975 + 0.03 * fine.b + 0.015 * broad.b;
      albedo = mix(vec3(0.5, 0.5, 0.49), albedo, smoothstep(0.09, 0.094, p.y));
    }
    if (wall) {
      // Ombre douce sous la corniche
      shade *= 1.0 - 0.22 * exp(-max(${f(HALL.height - CORNICE_HEIGHT)} - p.y, 0.0) * 9.0);
    }
    if (uKind > 3.5) {
      // Mobilier et moulures : la lumière vient d'en haut, donc les dessous
      // sont plus sombres que les faces, c'est ce qui dessine leur relief
      light.y *= 0.93 + 0.13 * n.y;
    }
    if (uKind < 0.5) {
      // Ombre portée du cadre sur le mur, décalée vers le bas (lumière du haut)
      float z = ${f(FIRST_Z)} - ${f(SPACING)} * clamp(floor((${f(FIRST_Z)} - p.z) / ${f(SPACING)} + 0.5), 0.0, ${f(PAIRS - 1)});
      float d = boxDistance(vec2(p.z - z, p.y - ${f(POSTER.centerY)} + 0.045), vec2(${f(POSTER.width / 2 + 0.035)}, ${f(POSTER.height / 2 + 0.035)}));
      shade *= 1.0 - 0.3 * exp(-max(d, 0.0) * 16.0);
    }
    if (uKind > 0.5 && uKind < 1.5) {
      // Parquet de chêne : lames dans la longueur de la salle, décalées d'un
      // rang à l'autre, chacune avec sa teinte et son fil ; joints sombres.
      float row = floor(p.x / 0.14);
      float along = (p.z + hash(vec2(row, 3.0)) * 1.6) / 1.6;
      float tone = hash(vec2(row, floor(along)));
      float joint = smoothstep(0.0, 0.006, fract(p.x / 0.14) * 0.14) * smoothstep(0.0, 0.008, fract(along) * 1.6);
      float fiber = noise(vec2(p.x * 70.0, p.z * 3.0) + tone * 40.0);
      albedo *= (0.9 + 0.15 * tone) * (0.95 + 0.08 * fiber) * mix(0.6, 1.0, joint);
      // Pied des murs d'extrémité : le sol s'assombrit un peu contre eux
      float ends = min(abs(p.z - ${f(HALL.zEnd)}), abs(p.z - ${f(HALL.zBack)}));
      shade *= mix(0.82, 1.0, smoothstep(0.0, 0.55, ends));
      // Lumière du jour qui entre par les fenêtres : une nappe claire au sol
      float gap = clamp(floor((${f(windowZ(0))} - p.z) / ${f(SPACING)} + 0.5), 0.0, ${f(WINDOW_GAPS - 1)});
      float dz = p.z - (${f(windowZ(0))} - ${f(SPACING)} * gap);
      float fromWall = ${f(HALL.halfWidth)} - abs(p.x);
      light.y += 0.24 * exp(-dz * dz / 0.55) * exp(-fromWall / 1.5);
    }
    vec3 emissive = vec3(0.0);
    if (uKind > 1.5 && uKind < 2.5) {
      // Verrière : panneaux lumineux au centre du plafond, séparés par des
      // montants ; le plafond s'éclaircit à leur approche
      float inside = step(abs(p.x), ${f(SKYLIGHT.halfWidth)});
      float cell = fract(p.z / ${f(SKYLIGHT.panel)});
      float pane = step(0.016, cell) * step(cell, 0.984) * step(0.035, abs(p.x)) * step(abs(p.x), ${f(SKYLIGHT.halfWidth - 0.04)});
      albedo = mix(albedo, vec3(0.3), inside * (1.0 - pane));
      float cloud = 0.6 * noise(p.xz * 0.45 + 3.1) + 0.4 * noise(p.xz * 1.3);
      emissive = vec3(1.16, 1.19, 1.24) * inside * pane * (0.9 + 0.1 * cloud) * (1.0 - 0.06 * abs(p.x) / ${f(SKYLIGHT.halfWidth)});
      light.y += 0.2 * exp(-max(abs(p.x) - ${f(SKYLIGHT.halfWidth)}, 0.0) * 0.9);

      // Caissons : un cadre mouluré par travée, de chaque côté de la verrière.
      // La moulure est suggérée par deux filets, un côté éclairé et un côté
      // dans l'ombre, comme un relief vu sous une lumière rasante.
      vec2 local = vec2(abs(p.x) - ${f((COFFER.inner + COFFER.outer) / 2)}, (cell - 0.5) * ${f(SKYLIGHT.panel)});
      float frame = boxDistance(local, vec2(${f((COFFER.outer - COFFER.inner) / 2)}, ${f(SKYLIGHT.panel / 2 - 0.22)}));
      float inner = boxDistance(local, vec2(${f((COFFER.outer - COFFER.inner) / 2 - 0.16)}, ${f(SKYLIGHT.panel / 2 - 0.38)}));
      float relief = smoothstep(0.022, 0.0, abs(frame + 0.012)) - smoothstep(0.022, 0.0, abs(frame - 0.012));
      relief += 0.6 * (smoothstep(0.014, 0.0, abs(inner + 0.008)) - smoothstep(0.014, 0.0, abs(inner - 0.008)));
      shade *= 1.0 + 0.13 * relief;
    }

    vec3 color = albedo * (WARM * shoulder(light.x) + vec3(1.0, 0.995, 0.98) * light.y) * occlusion * shade;
    color = mix(color, emissive, step(0.5, emissive.g));
    gl_FragColor = vec4(color * fogAt(vWorld) + grain(), alpha);
  }
`;

// Affiches, cartels, textes des murs : une image éclairée par la salle.
// Les affiches (uGlass) sont sous verre : un reflet discret suit le regard.
const IMAGE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uMirror;
  uniform float uGlass;
  ${LIGHTING}

  void main() {
    vec3 p = vWorld;
    if (uMirror > 0.5) p.y = -p.y;
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    vec2 light = lighting(p, n);
    vec4 texel = texture2D(tMap, vUv);
    if (texel.a < 0.5) discard; // disque de la platine : coins du carré transparents
    vec3 color = texel.rgb * min(0.3 + 0.82 * shoulder(light.x) + light.y, 1.06);

    vec3 view = normalize(cameraPosition - vWorld);
    vec3 toSpot = normalize(vec3(p.x - sign(p.x) * ${f(SPOT_SETBACK)}, ${f(SPOT_Y)}, p.z + 0.4) - p);
    float glint = pow(max(dot(reflect(-view, n), toSpot), 0.0), 26.0);
    color += uGlass * WARM * (0.16 * glint + 0.02);

    gl_FragColor = vec4(color * fogAt(vWorld) + grain(), 1.0);
  }
`;

// Visiteurs : ils ne sont pas des statues. Le haut du corps se balance très
// légèrement (de plus en plus vers la tête, les pieds restent au sol) et la
// poitrine se soulève au rythme de la respiration. uPhase décale chaque
// visiteur ; uTime vaut 0 si l'on a demandé moins d'animations.
const VISITOR_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uPhase;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vec3 p = position;
    float upper = smoothstep(0.85, 1.75, p.y);
    p.x += sin(uTime * 0.55 + uPhase) * 0.011 * upper * upper;
    p.z += sin(uTime * 0.41 + uPhase * 1.7) * 0.008 * upper * upper;
    float chest = smoothstep(1.05, 1.28, p.y) * (1.0 - smoothstep(1.42, 1.58, p.y));
    p += normal * 0.004 * chest * (0.5 + 0.5 * sin(uTime * 1.25 + uPhase * 2.3));
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
// Leur matière : un peu d'ombre vers le sol, et un liseré clair sur les
// contours (la lumière de la verrière qui accroche les épaules et les cheveux)
const VISITOR_FRAGMENT = IMAGE_FRAGMENT.replace(
  'vec3 view = normalize(cameraPosition - vWorld);',
  `vec3 view = normalize(cameraPosition - vWorld);
    color *= mix(0.8, 1.0, smoothstep(0.0, 0.55, p.y));
    color += vec3(0.07, 0.07, 0.065) * pow(1.0 - max(dot(n, view), 0.0), 3.0) * (0.4 + 0.6 * max(n.y, 0.0));`
);

// Vue par une fenêtre : une grande photo panoramique tendue loin dehors. On
// calcule où le regard la rencontre : elle remplit toujours la fenêtre et se
// décale derrière le cadre quand on se déplace, peu, comme un paysage
// lointain, et sans se déformer. Le mur a une épaisseur (REVEAL) : on voit
// l'embrasure autour de la vue.
// La photo est cadrée telle qu'on la verrait depuis l'axe de la salle, tendue
// à BACKDROP mètres derrière le mur ; elle est en réalité FAR fois plus loin
// et FAR fois plus grande. uSide : -1 mur gauche, +1 mur droit. uView : x =
// position de son centre le long de la salle, y = sa largeur, z = hauteur de
// son bord bas, w = sa hauteur (en mètres). uWinZ : position de la fenêtre le
// long de la salle.
const BACKDROP = 2.5;
const FAR = 3;
const REVEAL = 0.34;
// Sous chaque fenêtre, le toit en zinc de l'étage du dessous : il descend en
// pente douce depuis la façade et cache le bas de la photo, qu'on verrait
// sinon se finir en aplat flou quand on regarde vers le bas.
const ZINC = { top: WINDOW.sill - 0.1, slope: 0.32, length: 7, seam: 0.55, cornice: 0.4 };
const WINDOW_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uSide;
  uniform vec4 uView;
  uniform float uBlur;
  uniform vec3 uGround;
  uniform float uWinZ;
  uniform sampler2D tZinc;
  uniform sampler2D tStone;
  uniform vec3 cameraPosition;
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vec3 d = normalize(vWorld - cameraPosition);
    float outward = max(d.x * uSide, 0.0001);
    vec3 hit = cameraPosition + d * ((${f((HALL.halfWidth + BACKDROP) * FAR)} - cameraPosition.x * uSide) / outward);
    float u = 0.5 + uSide * (hit.z - uView.x) / (uView.y * ${f(FAR)});
    float v = (cameraPosition.y + (hit.y - cameraPosition.y) / ${f(FAR)} - uView.z) / uView.w;
    // Au-delà des bords de la photo (regard très oblique) : l'image repart
    // en miroir, floue si uBlur vaut 1, pour ne pas montrer un monument
    // en double.
    float beyond = max(-u, u - 1.0);
    float mirrored = 1.0 - abs(1.0 - mod(u, 2.0));
    vec3 color = texture2D(tMap, vec2(mirrored, clamp(v, 0.0, 1.0)), uBlur * 4.0 * smoothstep(0.0, 0.06, beyond)).rgb;
    // Sécurité : sous le bord bas de la photo, une teinte unie plutôt que la
    // dernière ligne de l'image étirée en bandes.
    color = mix(color, uGround, smoothstep(0.04, 0.0, v));

    float soft = 0.0012 * length(vWorld - cameraPosition) / outward;
    // Sous la fenêtre, la façade parisienne : une corniche en pierre de
    // taille, puis le toit en zinc de l'étage du dessous, feuilles patinées
    // (photo), tasseaux dans le sens de la pente, coulures de pluie, et la
    // gouttière au bout.
    float roofX = ${f(HALL.halfWidth + REVEAL)};
    vec2 roofN = vec2(${f(Math.sin(ZINC.slope))}, ${f(Math.cos(ZINC.slope))});
    float toward = d.x * uSide * roofN.x + d.y * roofN.y;
    float reachRoof = ((roofX - cameraPosition.x * uSide) * roofN.x + (${f(ZINC.top)} - cameraPosition.y) * roofN.y) / min(toward, -0.0001);
    vec3 onRoof = cameraPosition + d * reachRoof;
    float down = (onRoof.x * uSide - roofX) / roofN.y;
    if (toward < 0.0 && reachRoof > 0.0 && down > 0.0 && down < ${f(ZINC.length)}) {
      float fine = soft * (1.0 + reachRoof * 0.6);
      vec3 surface;
      if (down < ${f(ZINC.cornice)}) {
        // pierre calcaire : blocs, joints fins, larmier dans l'ombre
        vec3 stone = texture2D(tStone, vec2(onRoof.z * 0.7, down * 0.7)).rgb;
        surface = mix(vec3(0.86, 0.81, 0.7), stone * vec3(1.5, 1.42, 1.22), 0.55);
        float block = abs(fract(onRoof.z / 1.15) - 0.5) * 1.15;
        surface *= 1.0 - 0.28 * (1.0 - smoothstep(0.004, 0.004 + fine, block));
        surface *= 1.0 - 0.5 * smoothstep(${f(ZINC.cornice - 0.05)}, ${f(ZINC.cornice)}, down);
      } else {
        float sheet = floor(onRoof.z / ${f(ZINC.seam)});
        float tone = fract(sin(sheet * 12.9898) * 43758.5453);
        float across = (fract(onRoof.z / ${f(ZINC.seam)}) - 0.5) * ${f(ZINC.seam)};
        // patine : la photo donne le grain, étirée dans la pente elle donne les coulures
        float grainy = dot(texture2D(tZinc, vec2(onRoof.z, down) * 0.55 + tone).rgb, vec3(0.333));
        float streaks = dot(texture2D(tZinc, vec2(onRoof.z * 1.7, down * 0.05 + tone)).rgb, vec3(0.333));
        surface = vec3(0.5, 0.55, 0.61) * (0.86 + 0.14 * tone) * (0.55 + 0.42 * grainy + 0.36 * streaks);
        // tasseau : un bourrelet de 4 cm, éclairé d'un côté, dans l'ombre de l'autre
        float batten = 1.0 - smoothstep(0.02, 0.02 + fine, abs(across));
        surface = mix(surface, surface * (1.12 - 9.0 * across), batten);
        surface *= 1.0 - 0.3 * (smoothstep(0.02, 0.02 + fine, across) - smoothstep(0.045, 0.06, across));
        // recouvrement des feuilles, décalé d'une travée à l'autre
        float lap = abs(fract(down / 2.1 + tone) - 0.5) * 2.1;
        surface *= 1.0 - 0.22 * (1.0 - smoothstep(0.006, 0.006 + fine, lap));
        // ombre portée de la corniche, puis la gouttière
        surface *= 0.62 + 0.38 * smoothstep(${f(ZINC.cornice)}, ${f(ZINC.cornice + 0.3)}, down);
        surface *= 1.0 - 0.5 * smoothstep(${f(ZINC.length - 0.16)}, ${f(ZINC.length - 0.12)}, down);
      }
      // reflet du ciel en regard rasant, brume avec la distance
      surface = mix(surface, vec3(0.76, 0.81, 0.86), 0.3 * pow(1.0 + toward, 4.0));
      color = mix(surface, uGround, 0.3 * smoothstep(2.5, ${f(ZINC.length)}, down));
    }

    // Embrasure : le regard sort-il par l'ouverture, ou touche-t-il
    // l'épaisseur du mur ?
    vec3 exit = vWorld + d * (${f(REVEAL)} / outward);
    float side = abs(exit.z - uWinZ) - ${f(WINDOW.width / 2)};
    float above = exit.y - ${f(WINDOW.sill + WINDOW.height)};
    float below = ${f(WINDOW.sill)} - exit.y;
    float wall = max(side, max(above, below));
    // Appui clair (il reçoit le jour), linteau dans l'ombre, tableaux entre
    // les deux ; plus sombre vers l'intérieur.
    float shade = below > max(side, above) ? 0.97 : above > side ? 0.62 : 0.8;
    float inside = clamp(1.0 - wall * outward / (${f(REVEAL)} * 0.9), 0.0, 1.0);
    vec3 reveal = vec3(0.96, 0.95, 0.92) * shade * mix(1.0, 0.8, inside * inside);
    color = mix(color, reveal, smoothstep(0.0, soft, wall));

    // La vitre : un voile léger de face, un reflet clair de la salle quand
    // on la regarde de biais
    color = mix(color * vec3(0.975, 0.99, 0.985), vec3(0.93, 0.95, 0.96), 0.04 + 0.42 * pow(1.0 - outward, 3.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Photos panoramiques de Paris vues par les fenêtres (Wikimedia Commons,
// licences CC BY, crédits affichés dans la page). Les fichiers sont déjà
// préparés : ciel prolongé vers le haut, 4096 × 2048 (et 2048 × 1024 pour
// mobile). `view` : voir uView dans WINDOW_FRAGMENT. `mirror` : au-delà de
// ses bords, l'image se répète en miroir nette (true) ou floue (false, quand
// un monument s'y verrait en double). `ground` : teinte dans laquelle se fond
// le bas de la photo.
// Chaque photo est placée pour que sa ligne d'horizon soit à hauteur du
// regard et que son bord bas reste hors de vue, même collé à la fenêtre.
const PARIS_VIEWS = {
  // Mur gauche : les toits de Paris depuis Montmartre
  '-1': { file: 'paris-toits', view: [-10.15, 24, -1.5, 12], mirror: true, ground: [0.27, 0.29, 0.35] },
  // Mur droit : tour Eiffel, École militaire et Invalides, depuis l'UNESCO.
  // Centrée pour que la tour (au bord gauche de la photo) tombe derrière la
  // dernière fenêtre, au fond de la salle.
  1: { file: 'paris-eiffel', view: [-7.95, 21.8, -1.5, 10.9], mirror: false, ground: [0.3, 0.32, 0.3] },
};
const PARIS_CREDITS = [
  { author: 'Richard Munckton', license: 'CC BY 2.0', href: 'https://commons.wikimedia.org/wiki/File:Panorama_of_Paris_from_the_top_of_UNESCO.jpg' },
  { author: 'Renée Kools', license: 'CC BY 4.0', href: 'https://commons.wikimedia.org/wiki/File:Paris_skyline_from_Montmartre_2026-01-03.jpg' },
];

// Texture dessinée au canvas 2D. Redessinable : la police du site n'est
// pas forcément chargée au premier tracé.
// Les textes sont dessinés en plus haute définition que leurs dimensions
// nominales (TEXT_SCALE fois, sans dépasser 4096 px de côté) : sans cela,
// les lettres des murs et des cartels paraissent pixelisées de près.
// Les fonctions de dessin continuent de travailler en dimensions nominales.
let TEXT_SCALE = 3;
function textTexture(gl, width, height, draw, registry) {
  const scale = width * height <= 64 ? 1 : Math.min(TEXT_SCALE, 4096 / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const texture = new Texture(gl, { generateMipmaps: true, anisotropy: 16 });
  const paint = () => {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.textAlign = 'left';
    draw(ctx, width, height);
    texture.image = canvas;
    texture.needsUpdate = true;
  };
  paint();
  registry?.push(paint);
  return texture;
}

// Texture d'enduit, répétable sans raccord : bruit à plusieurs échelles
// calculé une fois, dont on stocke la pente (rouge, vert) et la hauteur (bleu).
function plasterTexture(gl) {
  const size = 512;
  const height = new Float32Array(size * size);
  let seed = 20260;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  [[4, 0.36], [8, 0.24], [16, 0.17], [32, 0.13], [64, 0.1]].forEach(([period, amplitude]) => {
    const lattice = Float32Array.from({ length: period * period }, random);
    const at = (x, y) => lattice[(y % period) * period + (x % period)];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const fx = (x / size) * period;
        const fy = (y / size) * period;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const u = fx - x0;
        const v = fy - y0;
        const su = u * u * u * (u * (u * 6 - 15) + 10);
        const sv = v * v * v * (v * (v * 6 - 15) + 10);
        const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * su;
        const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * su;
        height[y * size + x] += (top + (bottom - top) * sv) * amplitude;
      }
    }
  });

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(size, size);
  const h = (x, y) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      pixels.data[i] = 127.5 + Math.max(-127, Math.min(127, (h(x + 1, y) - h(x - 1, y)) * 2600));
      pixels.data[i + 1] = 127.5 + Math.max(-127, Math.min(127, (h(x, y + 1) - h(x, y - 1)) * 2600));
      pixels.data[i + 2] = h(x, y) * 255;
      pixels.data[i + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  const texture = new Texture(gl, { generateMipmaps: true, anisotropy: 16, wrapS: gl.REPEAT, wrapT: gl.REPEAT });
  texture.image = canvas;
  return texture;
}

// Cartels de la salle, tous sur le même modèle : un repère en grand chiffre
// fin (numéro de l'œuvre, ou court libellé), l'année en haut à droite, un
// filet, le titre en gras, une ligne dessous et, s'il y en a une, une
// indication en bas (« Prenez le baladeur… »).
function drawLabel({ mark, year, title, line, hint }) {
  return (ctx, w, h) => {
    ctx.fillStyle = '#fbfaf6';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#c9c5bb';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
    const x = 72;
    ctx.fillStyle = '#111';
    ctx.font = '200 150px "PP Neue Montreal", Helvetica, Arial, sans-serif';
    ctx.fillText(mark, x - 8, 180, w - x * 2 - 160);
    ctx.fillStyle = '#999';
    ctx.font = '500 34px "PP Neue Montreal", Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(year || ''), w - 64, 80);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ddd8cd';
    ctx.fillRect(x, 240, w - x * 2, 2);
    ctx.fillStyle = '#111';
    ctx.font = '600 86px "PP Neue Montreal", Helvetica, Arial, sans-serif';
    ctx.fillText(title, x, 380, w - x * 2);
    ctx.font = '400 52px "PP Neue Montreal", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#444';
    ctx.fillText(line, x, 470, w - x * 2);
    if (hint) {
      ctx.fillStyle = '#888';
      ctx.font = '400 40px "PP Neue Montreal", Helvetica, Arial, sans-serif';
      ctx.fillText(hint, x, h - 64, w - x * 2);
    }
  };
}

// Cartel d'une affiche (numéro de l'œuvre dans la visite)
const drawCartel = (exhibit, number) =>
  drawLabel({ mark: String(number).padStart(2, '0'), year: exhibit.year, title: exhibit.title, line: exhibit.note ? `Rafael Piral · ${exhibit.note}` : 'Rafael Piral' });

// Référencement de la page : titre, description, image de partage et données
// structurées (la salle comme collection d'œuvres, chaque affiche décrite et
// reliée à sa fiche projet, plus le fil d'Ariane).
const SITE = 'https://www.rafaelpiral.fr';
const SEO = {
  url: `${SITE}/musee`,
  title: "Musée d'affiches en 3D | Rafael Piral, graphiste",
  description: `Visitez le musée virtuel de Rafael Piral : une salle parisienne en 3D où se promener parmi ${EXHIBITS.length} affiches (cinéma, musique, sport), avec vue sur les toits de Paris et playlist à écouter.`,
  image: `${SITE}/images/musee/og-musee.jpg`,
};
SEO.jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['CollectionPage', 'ImageGallery'],
      '@id': `${SEO.url}#page`,
      url: SEO.url,
      name: SEO.title,
      description: SEO.description,
      inLanguage: 'fr',
      image: SEO.image,
      isPartOf: { '@type': 'WebSite', name: 'Rafael Piral | Portfolio', url: SITE },
      author: { '@type': 'Person', name: 'Rafael Piral', url: SITE, jobTitle: 'Graphiste' },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: EXHIBITS.length,
        itemListElement: EXHIBITS.map((exhibit, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'VisualArtwork',
            name: exhibit.title,
            artform: 'Affiche',
            artMedium: 'Impression numérique',
            dateCreated: String(exhibit.year),
            creator: { '@type': 'Person', name: 'Rafael Piral', url: SITE },
            image: `${SITE}${exhibit.srcHd}`,
            url: `${SITE}/work/${exhibit.slug}`,
            description: exhibit.description,
          },
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE },
        { '@type': 'ListItem', position: 2, name: "Musée d'affiches", item: SEO.url },
      ],
    },
  ],
};

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// La carte graphique sait-elle vraiment faire de la 3D ? Faux quand le
// navigateur n'a qu'un rendu logiciel (très lent) à proposer.
function hasRealGPU() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

// En dessous de ce nombre d'images par seconde, mesuré pendant les premières
// secondes de la visite, on considère que l'ordinateur ne suit pas.
const MIN_FPS = 20;

export default function Musee() {
  const containerRef = useRef(null);
  const lidsRef = useRef(null); // paupières du visiteur
  const barRef = useRef(null); // sa barre de progression
  const [menuOpen, setMenuOpen] = useState(false); // écran du baladeur : liste des titres
  const [menuIndex, setMenuIndex] = useState(0); // titre surligné dans la liste
  const menuRef = useRef(null);
  const apiRef = useRef(null); // { goTo(index) } exposé par la scène
  const [focused, setFocused] = useState(null);
  const focusedRef = useRef(null);
  focusedRef.current = focused;
  const [zoomed, setZoomed] = useState(null); // affiche ouverte en grand (index), ou null
  const [phoneOpen, setPhoneOpen] = useState(false); // prototype Armor Immo ouvert
  // Coin écoute : null tant qu'il n'a pas été lancé, puis { playing, index }
  const [music, setMusic] = useState(null);
  // audio : lecteur des extraits ; previews : adresse de l'extrait et lien
  // vers le morceau complet, par identifiant ; play(index) lance un titre
  const musicRef = useRef({ audio: null, playing: false, started: false, index: 0, previews: {}, play: () => {} });
  const [previewsFailed, setPreviewsFailed] = useState(false);
  // La visite en 3D demande un ordinateur (fenêtre assez large, souris), un
  // navigateur qui sait faire de la 3D et une machine assez puissante. Sinon
  // on explique pourquoi, avec un retour vers le portfolio. `blocker` : la
  // raison du refus, ou null si la visite peut avoir lieu.
  const [desktop, setDesktop] = useState(museumAvailable);
  // Appareil tactile : version allégée et joystick. stickRef : direction
  // demandée par le joystick (x vers la droite, y vers l'avant, de -1 à 1).
  const [touch] = useState(touchDevice);
  const stickRef = useRef({ x: 0, y: 0 });
  const knobRef = useRef(null);
  const [webgl] = useState(hasWebGL);
  const [weak, setWeak] = useState(() => hasWebGL() && !hasRealGPU()); // devient vrai aussi si la salle rame
  const [forced, setForced] = useState(false); // « visiter quand même »
  const blocker = !desktop ? 'size' : !webgl ? 'browser' : weak && !forced ? 'power' : null;
  const supported = blocker === null;
  const forcedRef = useRef(false);
  forcedRef.current = forced;
  // La fenêtre peut être agrandie ou réduite en cours de route
  useEffect(() => {
    const onResize = () => setDesktop(museumAvailable());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Quand la salle se ferme, son interface repart de zéro
  useEffect(() => {
    if (supported) return;
    setMusic(null);
    setFocused(null);
    setMenuOpen(false);
  }, [supported]);
  const navigate = useNavigate();
  // traversée de la porte de sortie en cours : l'interface est masquée
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!supported) return;
    const container = containerRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lite = touchDevice(); // téléphone, tablette : rendu allégé
    TEXT_SCALE = lite ? 1.5 : 3;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2), antialias: !lite, alpha: true, premultipliedAlpha: false });
    const { gl } = renderer;
    gl.clearColor(0.9, 0.9, 0.88, 1);
    gl.canvas.style.display = 'block';
    gl.canvas.style.touchAction = 'none';
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: FOV, near: 0.1, far: 80 });
    const scene = new Transform();

    // ── Salle ──────────────────────────────────────────────────────────────
    const length = HALL.zBack - HALL.zEnd;
    const zCenter = (HALL.zBack + HALL.zEnd) / 2;
    const plaster = plasterTexture(gl);
    const roomProgram = (albedo, kind, mirror = 0) =>
      new Program(gl, {
        vertex: VERTEX,
        fragment: ROOM_FRAGMENT,
        uniforms: { uAlbedo: { value: albedo }, uKind: { value: kind }, uMirror: { value: mirror }, tPlaster: { value: plaster } },
        cullFace: mirror ? null : gl.BACK,
      });
    const surface = (width, height, albedo, kind, mirror) =>
      new Mesh(gl, { geometry: new Plane(gl, { width, height }), program: roomProgram(albedo, kind, mirror) });
    const WALL = [0.95, 0.945, 0.93];

    const floor = surface(HALL.halfWidth * 2, length, [0.74, 0.58, 0.4], 1);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, zCenter);
    const ceiling = surface(HALL.halfWidth * 2, length, [0.93, 0.93, 0.92], 2);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, HALL.height, zCenter);
    // Murs à affiches et mur du fond
    [0].forEach((mirror) => {
      [-1, 1].forEach((side) => {
        const wall = surface(length, HALL.height, WALL, 0, mirror);
        wall.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
        wall.position.set(side * HALL.halfWidth, (mirror ? -1 : 1) * (HALL.height / 2), zCenter);
        if (mirror) wall.scale.y = -1;
        wall.setParent(scene);
      });
      const end = surface(HALL.halfWidth * 2, HALL.height, WALL, 3, mirror);
      end.position.set(0, (mirror ? -1 : 1) * (HALL.height / 2), HALL.zEnd);
      if (mirror) end.scale.y = -1;
      end.setParent(scene);
    });
    // Mur d'entrée, en trois pans autour de l'ouverture de la porte de sortie
    const sideWidth = HALL.halfWidth - EXIT.width / 2;
    [
      { width: sideWidth, height: HALL.height, x: -(HALL.halfWidth + EXIT.width / 2) / 2, y: HALL.height / 2 },
      { width: sideWidth, height: HALL.height, x: (HALL.halfWidth + EXIT.width / 2) / 2, y: HALL.height / 2 },
      { width: EXIT.width, height: HALL.height - EXIT.height, x: 0, y: (HALL.height + EXIT.height) / 2 },
    ].forEach(({ width, height, x, y }) => {
      const pan = surface(width, height, WALL, 3);
      pan.rotation.y = Math.PI;
      pan.position.set(x, y, HALL.zBack);
      pan.setParent(scene);
    });
    [floor, ceiling].forEach((mesh) => mesh.setParent(scene));

    const fixture = (width, height, depth, albedo) =>
      new Mesh(gl, { geometry: new Box(gl, { width, height, depth }), program: roomProgram(albedo, 4) });

    // Corniche sur les quatre murs
    const WHITE = [0.95, 0.945, 0.93];
    let cornerY = HALL.height;
    CORNICE.forEach(({ depth, height }) => {
      const y = cornerY - height / 2;
      cornerY -= height;
      [-1, 1].forEach((side) => {
        const along = fixture(depth, height, length, WHITE);
        along.position.set(side * (HALL.halfWidth - depth / 2), y, zCenter);
        along.setParent(scene);
      });
      [
        [HALL.zEnd + depth / 2],
        [HALL.zBack - depth / 2],
      ].forEach(([z]) => {
        const across = fixture(HALL.halfWidth * 2, height, depth, WHITE);
        across.position.set(0, y, z);
        across.setParent(scene);
      });
    });
    // Encadrement mouluré de la verrière
    [
      { offset: 0.05, drop: 0.11, width: 0.1 },
      { offset: 0.17, drop: 0.055, width: 0.14 },
    ].forEach(({ offset, drop, width }) => {
      [-1, 1].forEach((side) => {
        const border = fixture(width, drop, length, WHITE);
        border.position.set(side * (SKYLIGHT.halfWidth + offset), HALL.height - drop / 2, zCenter);
        border.setParent(scene);
      });
    });

    // Rails et projecteurs au plafond
    [-1, 1].forEach((side) => {
      const x = side * (HALL.halfWidth - SPOT_SETBACK);
      const rail = fixture(0.05, 0.04, length - 1, [0.85, 0.85, 0.84]);
      rail.position.set(x, HALL.height - 0.02, zCenter);
      rail.setParent(scene);
      for (let pair = 0; pair < PAIRS; pair++) {
        const z = FIRST_Z - SPACING * pair;
        const head = fixture(0.11, 0.2, 0.11, [0.88, 0.88, 0.87]);
        head.position.set(x, HALL.height - 0.15, z);
        head.rotation.z = -side * 0.6; // incliné vers le mur
        head.setParent(scene);
        // Lentille allumée : très claire, elle sature à l'écran
        const lens = fixture(0.085, 0.012, 0.085, [60, 54, 44]);
        lens.position.set(x + side * 0.062, HALL.height - 0.238, z);
        lens.rotation.z = -side * 0.6;
        lens.setParent(scene);
      }
    });

    // ── Affiches, cadres, reflets et cartels ───────────────────────────────
    const repaint = []; // textes à redessiner une fois la police chargée
    const imageMesh = (width, height, texture, { mirror = 0, glass = 0 } = {}) =>
      new Mesh(gl, {
        geometry: new Plane(gl, { width, height }),
        program: new Program(gl, {
          vertex: VERTEX,
          fragment: IMAGE_FRAGMENT,
          uniforms: { tMap: { value: texture }, uMirror: { value: mirror }, uGlass: { value: glass } },
          cullFace: null,
        }),
      });
    const frame = () => new Mesh(gl, { geometry: new Box(gl, { width: POSTER.width + 0.07, height: POSTER.height + 0.07, depth: 0.035 }), program: roomProgram([0.035, 0.033, 0.03], 4) });
    // Textures haute définition sur grand écran, allégées sur mobile
    const hd = !lite && Math.max(window.innerWidth, window.innerHeight) * (window.devicePixelRatio || 1) > 1400;

    EXHIBITS.forEach((exhibit, index) => {
      const { side, z } = placement(index);
      const wallX = side * HALL.halfWidth;
      const rotationY = side < 0 ? Math.PI / 2 : -Math.PI / 2;
      const hang = (mesh, offset, y, alongZ = z) => {
        mesh.rotation.y = rotationY;
        mesh.position.set(wallX - side * offset, y, alongZ);
        mesh.setParent(scene);
      };

      const texture = new Texture(gl, { generateMipmaps: true, anisotropy: 16 });
      const image = new Image();
      image.onload = () => {
        texture.image = image;
      };
      image.src = hd ? exhibit.srcHd : exhibit.src;

      hang(frame(), 0.0175, POSTER.centerY);
      hang(imageMesh(POSTER.width, POSTER.height, texture, { glass: 1 }), 0.037, POSTER.centerY);

      // Cartel, du côté de l'entrée (à hauteur de regard)
      const cartel = imageMesh(0.44, 0.275, textTexture(gl, 1024, 640, drawCartel(exhibit, index + 1), repaint));
      hang(cartel, 0.006, 1.25, z + POSTER.width / 2 + 0.42);
    });

    // ── Autres visiteurs ───────────────────────────────────────────────────
    // Ombre de contact au sol, sous les pieds
    const shadowProgram = new Program(gl, {
      vertex: VERTEX,
      fragment: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.42 * pow(1.0 - min(d, 1.0), 1.6));
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    // l'alpha du canvas doit rester à 1 : dessous, il y a la page
    shadowProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    const visitorTime = { value: 0 }; // horloge commune de leur respiration
    // (trois visiteurs seulement en version allégée)
    VISITORS.slice(0, lite ? 3 : VISITORS.length).forEach(({ model, x, z, yaw }, order) => {
      const base = `/models/visiteurs/${model}`;
      Promise.all([fetch(`${base}.json`).then((r) => r.json()), fetch(`${base}.bin`).then((r) => r.arrayBuffer())])
        .then(([manifest, buffer]) => {
          if (disposed) return;
          const person = new Transform();
          person.position.set(x, 0, z);
          person.rotation.y = yaw;
          manifest.parts.forEach((part) => {
            // sommets entrelacés : position (3), normale (3), uv (2)
            const data = new Float32Array(buffer, part.vertexOffset, part.vertexCount * 8);
            const position = new Float32Array(part.vertexCount * 3);
            const normal = new Float32Array(part.vertexCount * 3);
            const uv = new Float32Array(part.vertexCount * 2);
            for (let i = 0; i < part.vertexCount; i++) {
              position.set(data.subarray(i * 8, i * 8 + 3), i * 3);
              normal.set(data.subarray(i * 8 + 3, i * 8 + 6), i * 3);
              uv[i * 2] = data[i * 8 + 6];
              uv[i * 2 + 1] = 1 - data[i * 8 + 7];
            }
            const index = new Uint16Array(buffer, part.indexOffset, part.indexCount);
            const texture = new Texture(gl, { generateMipmaps: true, anisotropy: 16 });
            const image = new Image();
            image.onload = () => {
              texture.image = image;
            };
            image.src = `${base}-${part.name}${hd ? '-hd' : ''}.webp`;
            const program = new Program(gl, {
                vertex: VISITOR_VERTEX,
                fragment: VISITOR_FRAGMENT,
                uniforms: { tMap: { value: texture }, uMirror: { value: 0 }, uGlass: { value: 0 }, uTime: visitorTime, uPhase: { value: order * 1.7 } },
                // cheveux et cils : des plaques ajourées, visibles des deux côtés
              cullFace: part.name === 'opacity' ? null : gl.BACK,
            });
            const build = (indices) => new Mesh(gl, { geometry: new Geometry(gl, { position: { size: 3, data: position }, normal: { size: 3, data: normal }, uv: { size: 2, data: uv }, index: { data: indices } }), program });
            build(index).setParent(person);
          });
          person.setParent(scene);
          const shadow = new Mesh(gl, { geometry: new Plane(gl, { width: 1.1, height: 0.8 }), program: shadowProgram });
          shadow.rotation.x = -Math.PI / 2;
          shadow.rotation.z = yaw;
          shadow.position.set(x, 0.004, z);
          shadow.setParent(scene);
        })
        .catch(() => {}); // sans visiteurs, la salle reste visitable
    });

    // ── Fenêtres sur Paris ─────────────────────────────────────────────────
    // Matières de la façade vue par les fenêtres (photos ambientCG, CC0)
    const tiled = (src) => {
      const texture = new Texture(gl, { generateMipmaps: true, anisotropy: 16, wrapS: gl.REPEAT, wrapT: gl.REPEAT });
      const image = new Image();
      image.onload = () => {
        texture.image = image;
      };
      image.src = src;
      return texture;
    };
    const zincTexture = tiled('/images/musee/zinc.webp');
    const stoneTexture = tiled('/images/musee/pierre.webp');
    [-1, 1].forEach((side) => {
      const paris = PARIS_VIEWS[side];
      // En attendant la photo : un ciel uni
      const panorama = textTexture(gl, 4, 4, (ctx, w, h) => {
        ctx.fillStyle = '#bcd3e8';
        ctx.fillRect(0, 0, w, h);
      });
      panorama.minFilter = gl.LINEAR_MIPMAP_LINEAR; // flou lisse, sans effet de mosaïque
      panorama.anisotropy = 16;
      const photo = new Image();
      photo.onload = () => {
        panorama.image = photo;
        panorama.needsUpdate = true;
      };
      photo.src = `/images/musee/${paris.file}${hd ? '' : '-2048'}.webp`;
      const centerY = WINDOW.sill + WINDOW.height / 2;
      // Pièce de menuiserie le long du mur : épaisseur (vers la salle), hauteur, largeur
      const IRON = [0.1, 0.1, 0.11];
      const piece = (thickness, height, width, y, z, albedo = WHITE) => {
        const mesh = fixture(thickness, height, width, albedo);
        mesh.position.set(side * (HALL.halfWidth - thickness / 2), y, z);
        mesh.setParent(scene);
      };
      for (let gap = 0; gap < WINDOW_GAPS; gap++) {
        const z = windowZ(gap);
        const pane = new Mesh(gl, {
          geometry: new Plane(gl, { width: WINDOW.width, height: WINDOW.height }),
          program: new Program(gl, { vertex: VERTEX, fragment: WINDOW_FRAGMENT, uniforms: { tMap: { value: panorama }, tZinc: { value: zincTexture }, tStone: { value: stoneTexture }, uSide: { value: side }, uView: { value: paris.view }, uWinZ: { value: z }, uBlur: { value: paris.mirror ? 0 : 1 }, uGround: { value: paris.ground } } }),
        });
        pane.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
        pane.position.set(side * (HALL.halfWidth - 0.012), centerY, z);
        pane.setParent(scene);

        // Menuiserie d'une fenêtre à la française : chambranle mouluré et
        // sa corniche, appui et son tablier, dormant, puis deux ouvrants
        // (montants, traverses, petits-bois fins) et la crémone en fer au
        // milieu, avec sa poignée.
        const W = WINDOW.width;
        const H = WINDOW.height;
        const bottom = WINDOW.sill;
        [-1, 1].forEach((edge) => piece(0.035, H + 0.2, 0.1, centerY, z + edge * (W / 2 + 0.05)));
        piece(0.035, 0.1, W + 0.2, bottom + H + 0.05, z);
        piece(0.075, 0.04, W + 0.3, bottom + H + 0.12, z);
        piece(0.17, 0.045, W + 0.32, bottom - 0.0225, z);
        piece(0.03, 0.09, W + 0.16, bottom - 0.09, z);
        [-1, 1].forEach((edge) => piece(0.06, H, 0.035, centerY, z + edge * (W / 2 - 0.0175)));
        piece(0.06, 0.035, W, bottom + H - 0.0175, z);
        piece(0.06, 0.04, W, bottom + 0.02, z);
        const sashWidth = (W - 0.07) / 2;
        const sashBottom = bottom + 0.04;
        const sashTop = bottom + H - 0.035;
        [-1, 1].forEach((half) => {
          const center = z + half * (sashWidth / 2);
          piece(0.05, sashTop - sashBottom, 0.045, (sashTop + sashBottom) / 2, z + half * (sashWidth - 0.0225));
          piece(0.05, sashTop - sashBottom, 0.042, (sashTop + sashBottom) / 2, z + half * 0.0225);
          piece(0.05, 0.05, sashWidth, sashTop - 0.025, center);
          piece(0.05, 0.085, sashWidth, sashBottom + 0.0425, center);
          [1, 2, 3].forEach((row) => piece(0.034, 0.028, sashWidth - 0.08, sashBottom + 0.085 + ((sashTop - sashBottom - 0.135) * row) / 4, center));
        });
        // joint entre les deux ouvrants, crémone et poignée
        piece(0.0505, sashTop - sashBottom, 0.004, (sashTop + sashBottom) / 2, z, [0.6, 0.6, 0.58]);
        piece(0.064, sashTop - sashBottom - 0.1, 0.012, (sashTop + sashBottom) / 2, z, IRON);
        piece(0.07, 0.11, 0.03, 1.12, z, IRON);
        piece(0.1, 0.035, 0.02, 1.12, z, IRON);
        [sashBottom + 0.12, sashTop - 0.12].forEach((y) => piece(0.068, 0.03, 0.026, y, z, IRON));
      }
    });

    // ── Portes ─────────────────────────────────────────────────────────────
    // facing : +1 pour le mur du fond (face vers l'entrée), -1 pour le mur d'entrée
    // Un vantail : une vraie épaisseur de bois, habillée d'une face de porte à
    // panneaux moulurés (modélisée et rendue dans Blender, chêne ambientCG
    // CC0 : le relief et les ombres des moulures sont dans l'image), et une
    // béquille en laiton de chaque côté. handleSide : -1 poignée à gauche,
    // +1 à droite (vu de face).
    const photoTexture = (src) => {
      const texture = new Texture(gl, { generateMipmaps: true, anisotropy: 16 });
      const image = new Image();
      image.onload = () => {
        texture.image = image;
      };
      image.src = src;
      return texture;
    };
    const singleDoorTexture = photoTexture('/images/musee/porte-simple.webp');
    const BRASS = [0.78, 0.62, 0.3];
    const LEAF_DEPTH = 0.045;
    const doorLeaf = (width, height, texture, handleSide) => {
      const leaf = new Transform();
      const slab = new Mesh(gl, {
        geometry: new Box(gl, { width, height, depth: LEAF_DEPTH }),
        program: new Program(gl, { vertex: VERTEX, fragment: IMAGE_FRAGMENT, uniforms: { tMap: { value: texture }, uMirror: { value: 0 }, uGlass: { value: 0 } } }),
      });
      slab.setParent(leaf);
      const brass = (geometry, px, py, pz) => {
        const mesh = new Mesh(gl, { geometry, program: roomProgram(BRASS, 4) });
        mesh.position.set(px, py, pz);
        mesh.setParent(leaf);
        return mesh;
      };
      const hx = handleSide * (width / 2 - 0.058);
      const hy = 1.05 - height / 2;
      [-1, 1].forEach((face) => {
        const z = face * (LEAF_DEPTH / 2);
        // rosace, tige, béquille tournée vers le milieu du vantail, entrée de clé
        brass(new Cylinder(gl, { radiusTop: 0.026, radiusBottom: 0.026, height: 0.008, radialSegments: 24 }), hx, hy, z + face * 0.004).rotation.x = Math.PI / 2;
        brass(new Cylinder(gl, { radiusTop: 0.009, radiusBottom: 0.009, height: 0.05, radialSegments: 12 }), hx, hy, z + face * 0.025).rotation.x = Math.PI / 2;
        brass(new Cylinder(gl, { radiusTop: 0.008, radiusBottom: 0.0095, height: 0.125, radialSegments: 12 }), hx - handleSide * 0.055, hy, z + face * 0.048).rotation.z = Math.PI / 2;
        brass(new Cylinder(gl, { radiusTop: 0.016, radiusBottom: 0.016, height: 0.006, radialSegments: 20 }), hx, hy - 0.11, z + face * 0.003).rotation.x = Math.PI / 2;
      });
      return leaf;
    };
    const door = (x, wallZ, facing, width, height, leaves) => {
      if (leaves) {
        const leaf = doorLeaf(width, height, singleDoorTexture, -Math.sign(x));
        leaf.position.set(x, height / 2, wallZ + facing * 0.005);
        leaf.setParent(scene);
      }
      // Chambranle mouluré et son fronton
      const trim = (w, h, depth, cx, cy) => {
        const mesh = fixture(w, h, depth, WHITE);
        mesh.position.set(cx, cy, wallZ + (facing * depth) / 2);
        mesh.setParent(scene);
      };
      [-1, 1].forEach((edge) => trim(0.12, height + 0.12, 0.06, x + edge * (width / 2 + 0.06), (height + 0.12) / 2));
      trim(width + 0.24, 0.12, 0.06, x, height + 0.06);
      trim(width + 0.36, 0.06, 0.11, x, height + 0.15);
    };
    // Deux portes vers les salles suivantes, de part et d'autre du titre…
    [-1, 1].forEach((side) => door(side * (HALL.halfWidth - 0.95), HALL.zEnd, 1, 1.15, 2.6, 1));
    // …et la grande porte d'entrée à deux vantaux, derrière le visiteur au
    // départ. C'est la sortie : ses vantaux pivotent sur leurs gonds et
    // découvrent un passage lumineux qui ramène au portfolio.
    door(0, HALL.zBack, -1, EXIT.width, EXIT.height, 0);
    // …et l'accueil du portfolio, vivant : la vraie page tourne dans une
    // iframe glissée SOUS le canvas, et ce plan perce un trou transparent
    // dans le rendu 3D, de la taille de l'embrasure : la page occupe donc
    // toute la porte, d'où qu'on la regarde. L'iframe est attachée à <html> :
    // on peut ainsi la faire passer au premier plan au moment de sortir sans
    // la déplacer dans le DOM (ce qui la rechargerait).
    const PORTAL_Z = HALL.zBack + 0.08;
    const portal = new Mesh(gl, {
      geometry: new Plane(gl, { width: EXIT.width + 0.6, height: EXIT.height + 0.4 }),
      program: new Program(gl, {
        vertex: VERTEX,
        fragment: /* glsl */ `
          precision highp float;
          void main() {
            gl_FragColor = vec4(0.0);
          }
        `,
      }),
    });
    portal.rotation.y = Math.PI;
    portal.position.set(0, EXIT.height / 2, PORTAL_Z);
    portal.setParent(scene);
    const homeFrame = document.createElement('iframe');
    homeFrame.title = 'Portfolio';
    homeFrame.tabIndex = -1;
    homeFrame.setAttribute('aria-hidden', 'true');
    // (en version allégée, pas de copie vivante de l'accueil : la porte
    // ouvre sur le noir du portfolio et la sortie se fait en fondu)
    if (!lite) homeFrame.src = '/';
    homeFrame.className = 'musee-portal';
    document.documentElement.appendChild(homeFrame);
    const fitPortal = () => {
      if (!container.clientWidth || !container.clientHeight) return;
      homeFrame.style.width = `${container.clientWidth}px`;
      homeFrame.style.height = `${container.clientHeight}px`;
    };
    const fill = (matrix, values) => {
      for (let i = 0; i < 16; i++) matrix[i] = values[i];
      return matrix;
    };
    const pageToWorld = new Mat4();
    const clipToScreen = new Mat4();
    const viewProjection = new Mat4();
    const pageToScreen = new Mat4();
    const projected = new Mat4();
    // Place l'iframe derrière le trou (matrices en colonnes, comme matrix3d).
    // De loin, la page est tendue dans l'embrasure comme un écran, assez
    // grande pour la couvrir entièrement. En approchant, elle glisse vers sa
    // place réelle, plein écran, à l'échelle 1, et l'atteint avant le
    // seuil : il ne reste alors qu'à franchir la porte.
    const placePortal = (open) => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      // mètres par pixel : la page, centrée à hauteur de regard, couvre
      // l'embrasure en largeur comme en hauteur
      const scale = Math.max((EXIT.width + 0.1) / W, (2 * Math.max(EYE, EXIT.height - EYE)) / H);
      // pixel de la page → point du mur (la page est vue depuis la salle : sa
      // gauche est du côté des x positifs)
      fill(pageToWorld, [-scale, 0, 0, 0, 0, -scale, 0, 0, 0, 0, 1, 0, (scale * W) / 2, EYE + (scale * H) / 2, PORTAL_Z, 1]);
      fill(clipToScreen, [W / 2, 0, 0, 0, 0, -H / 2, 0, 0, 0, 0, 1, 0, W / 2, H / 2, 0, 1]);
      viewProjection.multiply(camera.projectionMatrix, camera.viewMatrix);
      projected.multiply(viewProjection, pageToWorld);
      pageToScreen.multiply(clipToScreen, projected);
      // Distance à laquelle la page tendue dans la porte se voit à l'échelle 1
      const natural = (scale * H) / (2 * Math.tan((FOV * Math.PI) / 360));
      const distance = HALL.zBack - camera.position.z;
      const t = Math.min(1, Math.max(0, (natural - distance) / (natural * 0.6)));
      const lock = t * t * (3 - 2 * t);
      // Profondeur du centre de la page : sert à ramener la matrice à la même
      // échelle que l'identité avant de les mélanger
      const depth = pageToScreen[3] * (W / 2) + pageToScreen[7] * (H / 2) + pageToScreen[15];
      if (lock > 0 && depth > 0.05) {
        for (let i = 0; i < 16; i++) pageToScreen[i] = (pageToScreen[i] / depth) * (1 - lock) + (i % 5 === 0 ? lock : 0);
      }
      // Visible seulement si la porte est entrouverte et qu'un coin au moins
      // de la page est devant la caméra
      const inFront = [[0, 0], [W, 0], [0, H], [W, H]].some(([x, y]) => pageToScreen[3] * x + pageToScreen[7] * y + pageToScreen[15] > 0);
      homeFrame.style.visibility = open > 0.01 && inFront ? 'visible' : 'hidden';
      homeFrame.style.transform = `matrix3d(${Array.from(pageToScreen).join(',')})`;
    };
    // Un vantail = un pivot sur le gond + la porte décalée d'une demi-largeur
    const leafTexture = photoTexture('/images/musee/porte-vantail.webp');
    const hinges = [1, -1].map((side) => {
      const hinge = new Transform();
      hinge.position.set((side * EXIT.width) / 2, 0, HALL.zBack - 0.02);
      hinge.setParent(scene);
      const leaf = doorLeaf(EXIT.width / 2 - 0.004, EXIT.height, leafTexture, -side); // poignée du côté de la jointure
      leaf.position.set((-side * EXIT.width) / 4, EXIT.height / 2, -0.012);
      leaf.setParent(hinge);
      return { hinge, side };
    });
    let doorOpen = 0; // 0 fermée, 1 grande ouverte
    let exiting = false; // le visiteur est en train de franchir la porte
    let left = false; // la page d'accueil a été demandée
    // Plaque au-dessus de la porte
    const exitSign = imageMesh(
      1.5,
      0.1875,
      textTexture(
        gl,
        1024,
        128,
        (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = '#2a2a2a';
          ctx.textAlign = 'center';
          ctx.font = '500 70px "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('S O R T I E  ·  P O R T F O L I O', w / 2, 90, w - 40);
        },
        repaint
      )
    );
    exitSign.rotation.y = Math.PI;
    exitSign.position.set(0, EXIT.height + 0.36, HALL.zBack - 0.02);
    exitSign.setParent(scene);

    // Mur du fond : titre de l'exposition
    const titleWall = imageMesh(
      6,
      3,
      textTexture(
        gl,
        2048,
        1024,
        (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h); // lettres posées à même le mur
          ctx.fillStyle = '#0d0d0d';
          ctx.textAlign = 'center';
          ctx.font = '400 330px "Bebas Neue Mur", "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('RAFAEL PIRAL', w / 2, 440, w - 200);
          ctx.font = '400 190px "Bebas Neue Mur", "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('CREATION', w / 2, 690, w - 200);
          ctx.font = '400 100px "Bebas Neue Mur", "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('2024-2026', w / 2, 860, w - 200);
        },
        repaint
      )
    );
    titleWall.position.set(0, 2.6, HALL.zEnd + 0.02);
    titleWall.setParent(scene);

    // Mur d'entrée (derrière le visiteur au départ) : texte de salle
    const introWall = imageMesh(
      3.2,
      1.6,
      textTexture(gl, 1600, 800, (ctx, w) => {
        ctx.clearRect(0, 0, w, 800);
        ctx.fillStyle = '#141414';
        ctx.font = '700 96px "PP Neue Montreal", Helvetica, Arial, sans-serif';
        ctx.fillText("MUSÉE D'AFFICHES", 90, 190, w - 180);
        ctx.font = '400 44px "PP Neue Montreal", Helvetica, Arial, sans-serif';
        ctx.fillStyle = '#2a2a2a';
        ['Cinéma, musique, sport : la création graphique', "s'impose le temps de votre visite."].forEach((line, i) => ctx.fillText(line, 90, 320 + i * 66, w - 180));
        ctx.fillStyle = '#555';
        ctx.font = '400 34px "PP Neue Montreal", Helvetica, Arial, sans-serif';
        ctx.fillText('Rafael Piral, graphiste', 90, 560, w - 180);
      }, repaint)
    );
    introWall.rotation.y = Math.PI;
    introWall.position.set(3.05, 2.0, HALL.zBack - 0.02);
    introWall.setParent(scene);

    // Mur d'entrée, de l'autre côté de la porte : le téléviseur des réseaux.
    // Coque noire à bord fin, support mural, voyant de veille ; la dalle
    // émet sa propre lumière (elle ne suit pas l'éclairage de la salle) et
    // renvoie un léger reflet de la verrière.
    const tvZ = HALL.zBack - 0.03 - TV.depth / 2;
    const tvPart = (width, height, depth, albedo, x, y, z) => {
      const mesh = fixture(width, height, depth, albedo);
      mesh.position.set(TV.x + x, TV.y + y, z);
      mesh.setParent(scene);
    };
    tvPart(0.5, 0.35, 0.03, [0.03, 0.03, 0.03], 0, 0, HALL.zBack - 0.015); // support mural
    tvPart(TV.width + TV.bezel * 2, TV.height + TV.bezel * 2 + 0.012, TV.depth, [0.02, 0.02, 0.022], 0, -0.006, tvZ);
    tvPart(0.012, 0.004, 0.002, [0.9, 0.12, 0.1], TV.width / 2 - 0.05, -TV.height / 2 - TV.bezel - 0.006, tvZ - TV.depth / 2 - 0.001); // voyant
    const tvScreen = new Mesh(gl, {
      geometry: new Plane(gl, { width: TV.width, height: TV.height }),
      program: new Program(gl, {
        vertex: VERTEX,
        fragment: /* glsl */ `
          precision highp float;
          uniform sampler2D tMap;
          uniform vec3 cameraPosition;
          varying vec2 vUv;
          varying vec3 vWorld;
          void main() {
            vec3 color = texture2D(tMap, vUv).rgb;
            // dalle : un peu plus sombre dans les angles et vue de biais
            vec2 c = vUv - 0.5;
            color *= 1.0 - 0.35 * dot(c, c);
            vec3 view = normalize(cameraPosition - vWorld);
            color *= 0.75 + 0.25 * abs(view.z);
            // reflet de la verrière sur le verre : une bande claire en biais
            float glare = smoothstep(0.16, 0.0, abs(vUv.x * 0.8 + vUv.y - 1.25 + view.x * 0.5));
            color += vec3(0.05, 0.055, 0.06) * glare;
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        uniforms: {
          tMap: {
            value: textTexture(
              gl,
              1920,
              1080,
              (ctx, w, h) => {
                const back = ctx.createLinearGradient(0, 0, w, h);
                back.addColorStop(0, '#11131a');
                back.addColorStop(1, '#05060a');
                ctx.fillStyle = back;
                ctx.fillRect(0, 0, w, h);
                const sans = '"PP Neue Montreal", Helvetica, Arial, sans-serif';
                ctx.fillStyle = '#f4f1ea';
                ctx.font = `700 84px ${sans}`;
                ctx.fillText('Pour suivre le travail et échanger :', 110, 190, w - 220);
                const top = h * TV.header;
                const row = (h * (1 - TV.header - 0.05)) / SOCIALS.length;
                SOCIALS.forEach((social, index) => {
                  const y = top + row * index;
                  ctx.fillStyle = 'rgba(244, 241, 234, 0.06)';
                  ctx.beginPath();
                  ctx.roundRect(90, y + 10, w - 180, row - 20, 22);
                  ctx.fill();
                  // le vrai logo, dans la couleur de la marque (dégradé pour Instagram)
                  const size = 92;
                  const left = 124;
                  const topEdge = y + row / 2 - size / 2;
                  ctx.save();
                  ctx.translate(left, topEdge);
                  ctx.scale(size / 24, size / 24);
                  if (social.logo === 'instagram') {
                    const brand = ctx.createLinearGradient(0, 24, 24, 0);
                    brand.addColorStop(0, '#feda75');
                    brand.addColorStop(0.3, '#fa7e1e');
                    brand.addColorStop(0.55, '#d62976');
                    brand.addColorStop(0.8, '#962fbf');
                    brand.addColorStop(1, '#4f5bd5');
                    ctx.fillStyle = brand;
                  } else {
                    ctx.fillStyle = social.color;
                  }
                  ctx.fill(new Path2D(SOCIAL_LOGOS[social.logo]));
                  ctx.restore();
                  ctx.fillStyle = '#f4f1ea';
                  ctx.font = `600 70px ${sans}`;
                  ctx.fillText(social.name, 256, y + row / 2 + 24);
                  ctx.textAlign = 'right';
                  ctx.fillStyle = 'rgba(244, 241, 234, 0.6)';
                  ctx.font = `400 50px ${sans}`;
                  ctx.fillText(`${social.handle}   ↗`, w - 136, y + row / 2 + 18);
                  ctx.textAlign = 'left';
                });
              },
              repaint
            ),
          },
        },
      }),
    });
    tvScreen.rotation.y = Math.PI;
    tvScreen.position.set(TV.x, TV.y, tvZ - TV.depth / 2 - 0.001);
    tvScreen.setParent(scene);

    // ── Coin écoute ────────────────────────────────────────────────────────
    const box = (width, height, depth, albedo, mirror = 0) =>
      new Mesh(gl, { geometry: new Box(gl, { width, height, depth }), program: roomProgram(albedo, 4, mirror) });
    // Pupitre en marbre poli (photos ambientCG, CC0) : un fût de marbre blanc
    // veiné, entre un socle et une tablette de marbre noir qui débordent
    // légèrement. uGlass : le reflet des projecteurs sur la pierre polie.
    const marble = (src) => new Program(gl, { vertex: VERTEX, fragment: IMAGE_FRAGMENT, uniforms: { tMap: { value: photoTexture(src) }, uMirror: { value: 0 }, uGlass: { value: 1.6 } } });
    const whiteMarble = marble('/images/musee/marbre-blanc.webp');
    const blackMarble = marble('/images/musee/marbre-noir.webp');
    const PLINTH = 0.07;
    const SLAB = 0.045;
    [
      { program: blackMarble, width: STATION.width + 0.08, depth: STATION.depth + 0.08, height: PLINTH, y: PLINTH / 2 },
      { program: whiteMarble, width: STATION.width - 0.05, depth: STATION.depth - 0.05, height: STATION.height - PLINTH - SLAB, y: PLINTH + (STATION.height - PLINTH - SLAB) / 2 },
      { program: blackMarble, width: STATION.width + 0.04, depth: STATION.depth + 0.04, height: SLAB, y: STATION.height - SLAB / 2 },
    ].forEach(({ program, width, depth, height, y }) => {
      const block = new Mesh(gl, { geometry: new Box(gl, { width, height, depth }), program });
      block.position.set(STATION.x, y, STATION.z);
      block.setParent(scene);
    });
    // Baladeur à molette posé sur un petit présentoir, incliné vers le
    // visiteur. Quand on le prend (musique lancée), il quitte le socle et
    // s'affiche au premier plan (voir .musee-player dans le rendu de la page).
    const BLACK = [0.045, 0.045, 0.05];
    const PLAYER = { width: 0.0618, height: 0.1035, depth: 0.0105, scale: 1.5 };
    const playerStand = new Transform();
    playerStand.position.set(STATION.x, STATION.height, STATION.z);
    playerStand.setParent(scene);
    const rest = box(0.17, 0.028, 0.11, BLACK);
    rest.position.set(0, 0.014, 0);
    rest.setParent(playerStand);
    const lip = box(0.11, 0.012, 0.012, BLACK);
    lip.position.set(0, 0.034, 0.03);
    lip.setParent(playerStand);
    const player = new Transform();
    player.scale.set(PLAYER.scale, PLAYER.scale, PLAYER.scale);
    player.rotation.x = -0.42;
    player.position.set(0, 0.03 + (PLAYER.height * PLAYER.scale * Math.cos(0.42)) / 2, 0.0);
    player.setParent(playerStand);
    box(PLAYER.width, PLAYER.height, PLAYER.depth, [0.8, 0.81, 0.83]).setParent(player);
    const playerFace = imageMesh(
      PLAYER.width - 0.001,
      PLAYER.height - 0.001,
      textTexture(
        gl,
        512,
        858,
        (ctx, w, h) => {
          // façade claire aux coins arrondis, écran sombre, molette et bouton central
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = '#d9d9db';
          ctx.beginPath();
          ctx.roundRect(0, 0, w, h, 38);
          ctx.fill();
          ctx.fillStyle = '#0b0c0f';
          ctx.beginPath();
          ctx.roundRect(w * 0.0875, h * 0.0555, w * 0.825, h * 0.377, 10);
          ctx.fill();
          ctx.fillStyle = '#f4f1ea';
          ctx.textAlign = 'center';
          ctx.font = '700 84px "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('RP', w / 2, h * 0.225);
          ctx.font = '500 26px "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('P L A Y L I S T', w / 2, h * 0.285);
          ctx.fillStyle = 'rgba(244, 241, 234, 0.55)';
          ctx.font = '400 20px "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText(`${MUSEE_PLAYLIST.length} titres  ▶`, w / 2, h * 0.37);
          ctx.fillStyle = '#a9aaad';
          ctx.beginPath();
          ctx.arc(w / 2, h * 0.727, w * 0.348, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#d9d9db';
          ctx.beginPath();
          ctx.arc(w / 2, h * 0.727, w * 0.125, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 24px "PP Neue Montreal", Helvetica, Arial, sans-serif';
          ctx.fillText('MENU', w / 2, h * 0.727 - w * 0.225);
          ctx.fillText('▶ ❚❚', w / 2, h * 0.727 + w * 0.27);
          ctx.fillText('◀◀', w / 2 - w * 0.24, h * 0.727 + 8);
          ctx.fillText('▶▶', w / 2 + w * 0.24, h * 0.727 + 8);
        },
        repaint
      )
    );
    playerFace.position.set(0, 0, PLAYER.depth / 2 + 0.0004);
    playerFace.setParent(player);

    // Bancs : trois lames de chêne massif sur un piètement en acier noir
    // (deux cadres en tube carré reliés par une traverse), avec leur ombre
    // au sol.
    const oakProgram = new Program(gl, { vertex: VERTEX, fragment: IMAGE_FRAGMENT, uniforms: { tMap: { value: photoTexture('/images/musee/chene.webp') }, uMirror: { value: 0 }, uGlass: { value: 0 } } });
    const STEEL = [0.07, 0.07, 0.075];
    const groundShadow = (x, z, width, depth) => {
      const mesh = new Mesh(gl, { geometry: new Plane(gl, { width, height: depth }), program: shadowProgram });
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.004, z);
      mesh.setParent(scene);
    };
    BENCHES.forEach(({ x, z }) => {
      const put = (mesh, dx, y, dz) => {
        mesh.position.set(x + dx, y, z + dz);
        mesh.setParent(scene);
      };
      const slat = (BENCH.depth - 0.016) / 3;
      [-1, 0, 1].forEach((row) => {
        put(new Mesh(gl, { geometry: new Box(gl, { width: BENCH.width, height: 0.045, depth: slat }), program: oakProgram }), 0, BENCH.height - 0.0225, row * (slat + 0.008));
      });
      const tube = 0.03;
      const legHeight = BENCH.height - 0.045;
      const span = BENCH.depth - 0.07;
      [-1, 1].forEach((end) => {
        const dx = end * (BENCH.width / 2 - 0.2);
        [-1, 1].forEach((edge) => put(box(tube, legHeight, tube, STEEL), dx, legHeight / 2, (edge * span) / 2));
        put(box(tube, tube, span, STEEL), dx, legHeight - tube / 2, 0);
        put(box(tube, tube, span, STEEL), dx, tube / 2, 0);
      });
      put(box(BENCH.width - 0.4, tube, tube, STEEL), 0, legHeight - tube / 2, 0);
      groundShadow(x, z, BENCH.width + 0.5, BENCH.depth + 0.5);
    });
    groundShadow(STATION.x, STATION.z, STATION.width + 0.6, STATION.depth + 0.6);

    // Téléphone d'exposition (voir PHONE) : colonne de marbre et pupitre
    // incliné, téléphone posé dessus, cartel sur la tablette
    const LECTERN = { width: 0.34, depth: 0.26, top: 0.035 };
    [
      { program: blackMarble, width: 0.36, depth: 0.32, height: 0.05, y: 0.025 },
      { program: whiteMarble, width: 0.2, depth: 0.2, height: PHONE.stand - 0.09, y: 0.05 + (PHONE.stand - 0.09) / 2 },
    ].forEach(({ program, width, depth, height, y }) => {
      const block = new Mesh(gl, { geometry: new Box(gl, { width, height, depth }), program });
      block.position.set(PHONE.x, y, PHONE.z);
      block.setParent(scene);
    });
    groundShadow(PHONE.x, PHONE.z, 0.7, 0.6);
    const lectern = new Transform();
    lectern.position.set(PHONE.x, PHONE.stand, PHONE.z);
    lectern.rotation.x = PHONE.slope; // le bord avant plus bas, tourné vers le visiteur
    lectern.setParent(scene);
    const slab = new Mesh(gl, { geometry: new Box(gl, { width: LECTERN.width, height: LECTERN.top, depth: LECTERN.depth }), program: blackMarble });
    slab.setParent(lectern);
    // le téléphone, à plat sur la tablette, écran vers le haut
    const phone = new Transform();
    phone.position.set(0.035, LECTERN.top / 2 + PHONE.depth / 2 + 0.001, -0.01);
    phone.rotation.x = -Math.PI / 2;
    phone.rotation.z = -0.08;
    phone.setParent(lectern);
    fixture(PHONE.width, PHONE.height, PHONE.depth, [0.03, 0.03, 0.035]).setParent(phone);
    const phoneScreen = imageMesh(PHONE.width - 0.005, PHONE.height - 0.006, photoTexture('/images/musee/armor-immo-ecran.webp'), { glass: 1 });
    phoneScreen.position.set(0, 0, PHONE.depth / 2 + 0.0005);
    phoneScreen.setParent(phone);
    // cartel, à gauche du téléphone sur la tablette
    const phoneCartel = imageMesh(
      0.128,
      0.08,
      textTexture(gl, 1024, 640, drawLabel({ mark: 'UI', year: '2025', title: 'Armor Immo', line: 'Prototype du site mobile', hint: "Touchez l'écran pour l'essayer" }), repaint)
    );
    phoneCartel.rotation.x = -Math.PI / 2;
    phoneCartel.position.set(-0.095, LECTERN.top / 2 + 0.001, 0.02);
    phoneCartel.setParent(lectern);

    // Cartel du coin écoute, sur la face du socle tournée vers l'entrée
    const stationCartel = imageMesh(
      0.5,
      0.3125,
      textTexture(
        gl,
        1024,
        640,
        drawLabel({ mark: '♪', year: '2026', title: 'Coin écoute', line: `Playlist de Rafael Piral, ${MUSEE_PLAYLIST.length} titres`, hint: 'Prenez le baladeur pour écouter' }),
        repaint
      )
    );
    stationCartel.position.set(STATION.x, 0.56, STATION.z + (STATION.depth - 0.05) / 2 + 0.004); // sur le fût
    stationCartel.setParent(scene);

    // Projecteur du coin écoute
    const stationHead = fixture(0.11, 0.2, 0.11, [0.88, 0.88, 0.87]);
    stationHead.position.set(STATION.x, HALL.height - 0.1, STATION.z + 0.5);
    stationHead.setParent(scene);
    const stationLens = fixture(0.085, 0.012, 0.085, [60, 54, 44]);
    stationLens.position.set(STATION.x, HALL.height - 0.206, STATION.z + 0.5);
    stationLens.setParent(scene);

    let disposed = false;
    Promise.all([...['600', '400', '700'].map((weight) => document.fonts.load(`${weight} 40px "PP Neue Montreal"`)), document.fonts.load('400 40px "Bebas Neue Mur"')])
      .then(() => {
        if (!disposed) repaint.forEach((paint) => paint());
      })
      .catch(() => {});

    // ── Visiteur ───────────────────────────────────────────────────────────
    // yaw 0 = regard vers le fond (-z) ; yaw > 0 = vers le mur gauche
    const view = { x: 0, z: 0.6, yaw: 0, pitch: 0 };
    let goal = null; // position visée après un clic sur une affiche
    let travel = null; // trajet guidé en cours vers `goal`
    const keys = new Set();
    const motion = { forward: 0, strafe: 0, turn: 0 };

    const goTo = (index) => {
      const { side, z } = placement(index);
      // Recul tel que l'affiche tienne dans l'écran (en largeur sur mobile, en
      // hauteur sur desktop), et regard légèrement baissé pour qu'elle
      // remonte au-dessus du panneau d'information.
      const span = 2 * Math.tan((FOV * Math.PI) / 360);
      const aspect = container.clientWidth / container.clientHeight;
      const distance = Math.min(Math.max(POSTER.width / 0.82 / (span * aspect), POSTER.height / 0.52 / span), HALL.halfWidth * 2 - 1.2);
      // (sur appareil tactile la fiche est en haut de l'écran : le regard se
      // lève un peu, pour que l'affiche descende dessous)
      const tilt = lite ? (aspect > 1 ? 0.09 : 0.07) : -0.07;
      goal = { x: side * (HALL.halfWidth - distance), z, yaw: side < 0 ? Math.PI / 2 : -Math.PI / 2, pitch: Math.atan(tilt * span) };
      if (reducedMotion) {
        Object.assign(view, goal);
        goal = null;
      }
      setFocused(index);
    };
    // S'approcher du coin écoute et lancer (ou reprendre) la musique
    const goToStation = () => {
      goal = { x: STATION.x, z: STATION.z + 1.9, yaw: 0, pitch: -0.3 };
      if (reducedMotion) {
        Object.assign(view, goal);
        goal = null;
      }
      setFocused(null);
      const state = musicRef.current;
      if (!state.started) state.play(0);
      else if (!state.playing) state.audio?.play().catch(() => {});
    };
    // Marcher jusqu'à la porte de sortie et la franchir
    const goToExit = () => {
      goal = { x: 0, z: HALL.zBack - 0.15, yaw: Math.PI, pitch: 0 };
      if (reducedMotion) {
        Object.assign(view, goal);
        goal = null;
      }
      setFocused(null);
    };
    apiRef.current = { goTo, goToStation };

    // Arrivée depuis une fiche projet (/musee?affiche=…) : on démarre
    // directement devant l'affiche demandée
    const requested = new URLSearchParams(window.location.search).get('affiche');
    const startAt = EXHIBITS.findIndex((exhibit) => exhibit.image === requested);
    if (startAt >= 0) {
      goTo(startAt);
      if (goal) {
        Object.assign(view, goal);
        goal = null;
      }
    }

    // Affiche visée par un point de l'écran (intersection rayon/mur)
    // Renvoie l'index de l'affiche visée, 'station' pour le coin écoute, 'exit'
    // pour la porte de sortie, { social } pour une ligne du téléviseur des réseaux, ou null
    const posterAt = (clientX, clientY) => {
      const rect = gl.canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      const tan = Math.tan((FOV * Math.PI) / 360);
      // Direction dans le repère caméra, puis rotation pitch (x) et yaw (y)
      let dx = nx * tan * (rect.width / rect.height);
      let dy = ny * tan;
      let dz = -1;
      const cp = Math.cos(view.pitch);
      const sp = Math.sin(view.pitch);
      [dy, dz] = [dy * cp - dz * sp, dy * sp + dz * cp];
      const cy = Math.cos(view.yaw);
      const sy = Math.sin(view.yaw);
      [dx, dz] = [dx * cy + dz * sy, -dx * sy + dz * cy];

      let best = null;
      EXHIBITS.forEach((_, index) => {
        const { side, z } = placement(index);
        if (dx * side <= 0) return; // on ne regarde pas vers ce mur
        const t = (side * HALL.halfWidth - view.x) / dx;
        const hitY = EYE + dy * t;
        const hitZ = view.z + dz * t;
        if (Math.abs(hitZ - z) < POSTER.width / 2 && Math.abs(hitY - POSTER.centerY) < POSTER.height / 2 && (!best || t < best.t)) {
          best = { index, t };
        }
      });
      // Coin écoute : rayon contre la boîte du socle et de sa platine
      const half = [STATION.width / 2, (STATION.height + 0.12) / 2, STATION.depth / 2];
      const center = [STATION.x, (STATION.height + 0.12) / 2, STATION.z];
      const origin = [view.x, EYE, view.z];
      const direction = [dx, dy, dz];
      let near = 0;
      let far = Infinity;
      for (let axis = 0; axis < 3; axis++) {
        const a = (center[axis] - half[axis] - origin[axis]) / direction[axis];
        const b = (center[axis] + half[axis] - origin[axis]) / direction[axis];
        near = Math.max(near, Math.min(a, b));
        far = Math.min(far, Math.max(a, b));
      }
      if (near <= far && (!best || near < best.t)) return 'station';
      // Téléphone d'exposition et son socle
      {
        const half = [0.2, (PHONE.stand + 0.1) / 2, 0.17];
        const center = [PHONE.x, (PHONE.stand + 0.1) / 2, PHONE.z];
        let enter = 0;
        let leave = Infinity;
        for (let axis = 0; axis < 3; axis++) {
          const a = (center[axis] - half[axis] - origin[axis]) / direction[axis];
          const b = (center[axis] + half[axis] - origin[axis]) / direction[axis];
          enter = Math.max(enter, Math.min(a, b));
          leave = Math.min(leave, Math.max(a, b));
        }
        if (enter <= leave && (!best || enter < best.t)) return 'phone';
      }
      // Porte de sortie, sur le mur d'entrée
      if (dz > 0) {
        const t = (HALL.zBack - view.z) / dz;
        if (Math.abs(view.x + dx * t) < EXIT.width / 2 && EYE + dy * t < EXIT.height && EYE + dy * t > 0 && (!best || t < best.t)) return 'exit';
        // Lignes du téléviseur des réseaux, sur le même mur
        if (Math.abs(view.x + dx * t - TV.x) < TV.width / 2 - 0.09 && (!best || t < best.t)) {
          const social = SOCIALS.findIndex((_, index) => Math.abs(EYE + dy * t - socialY(index)) < TV_ROW / 2 - 0.01);
          if (social >= 0) return { social };
        }
      }
      return best ? best.index : null;
    };

    let drag = null;
    const onPointerDown = (e) => {
      gl.canvas.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, moved: 0 };
    };
    const onPointerMove = (e) => {
      if (!drag) {
        gl.canvas.style.cursor = posterAt(e.clientX, e.clientY) !== null ? 'pointer' : 'grab';
        return;
      }
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved > 6 && !exiting) {
        goal = null;
        gl.canvas.style.cursor = 'grabbing';
        view.yaw += dx * 0.0042;
        view.pitch = Math.max(-0.55, Math.min(0.55, view.pitch + dy * 0.0042));
      }
    };
    const onPointerUp = (e) => {
      if (drag && drag.moved <= 6) {
        const index = posterAt(e.clientX, e.clientY);
        if (index === 'station') goToStation();
        else if (index === 'exit') goToExit();
        else if (index === 'phone') setPhoneOpen(true);
        else if (index?.social !== undefined) window.open(SOCIALS[index.social].href, '_blank', 'noopener');
        // un clic sur l'affiche devant laquelle on se tient déjà l'ouvre en grand
        else if (index !== null && index === focusedRef.current && !goal) setZoomed(index);
        else if (index !== null) goTo(index);
      }
      drag = null;
    };
    const MOVE_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const onKeyDown = (e) => {
      // e.code = position physique de la touche : ZQSD en AZERTY, WASD en QWERTY
      if (!MOVE_KEYS.includes(e.code) || exiting) return;
      e.preventDefault();
      keys.add(e.code);
      goal = null;
      setFocused(null);
    };
    const onKeyUp = (e) => keys.delete(e.code);
    const onBlur = () => keys.clear();

    gl.canvas.addEventListener('pointerdown', onPointerDown);
    gl.canvas.addEventListener('pointermove', onPointerMove);
    gl.canvas.addEventListener('pointerup', onPointerUp);
    gl.canvas.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: container.clientWidth / container.clientHeight });
      fitPortal();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let raf;
    let last = performance.now();
    // Mesure de fluidité : entre la 2e et la 7e seconde, onglet visible
    const pace = { start: performance.now(), frames: 0, time: 0, done: false };
    const tick = (now) => {
      const elapsed = now - last;
      const dt = Math.min(elapsed / 1000, 0.05);
      last = now;
      if (!pace.done && !forcedRef.current && now - pace.start > 2000 && document.visibilityState === 'visible' && elapsed < 400) {
        pace.frames += 1;
        pace.time += elapsed;
        if (pace.time > 5000) {
          pace.done = true;
          if ((pace.frames * 1000) / pace.time < MIN_FPS) {
            setWeak(true);
            return; // la salle va se fermer
          }
        }
      }

      if (goal && !exiting && Math.hypot(stickRef.current.x, stickRef.current.y) > 0.25) goal = null; // le joystick reprend la main
      if (goal) {
        // Trajet guidé : un mouvement doux, qui démarre lentement, prend de la
        // vitesse puis ralentit avant d'arriver (au lieu de partir d'un coup).
        // Sa durée suit la distance et l'angle à parcourir.
        if (!travel || travel.goal !== goal) {
          const turn = Math.atan2(Math.sin(goal.yaw - view.yaw), Math.cos(goal.yaw - view.yaw)); // plus court chemin
          const length = Math.hypot(goal.x - view.x, goal.z - view.z) + Math.abs(turn) * 1.6;
          travel = { goal, from: { ...view }, turn, time: 0, duration: Math.min(3.4, Math.max(1.3, 1 + length * 0.24)) };
        }
        travel.time += dt;
        const p = Math.min(1, travel.time / travel.duration);
        const eased = p * p * p * (p * (p * 6 - 15) + 10);
        view.x = travel.from.x + (goal.x - travel.from.x) * eased;
        view.z = travel.from.z + (goal.z - travel.from.z) * eased;
        view.yaw = travel.from.yaw + travel.turn * eased;
        view.pitch = travel.from.pitch + (goal.pitch - travel.from.pitch) * eased;
        if (p >= 1) {
          Object.assign(view, goal);
          goal = null;
          travel = null;
        }
        motion.forward = motion.strafe = motion.turn = 0;
      } else {
        // Vitesses amorties : on accélère et on s'arrête en douceur
        const ease = 1 - Math.exp(-dt * 9);
        // clavier, ou joystick sur appareil tactile (dosé : on peut marcher lentement)
        const stick = stickRef.current;
        const wantForward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) + stick.y;
        const wantStrafe = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0) + stick.x;
        motion.forward += (Math.max(-1, Math.min(1, wantForward)) - motion.forward) * ease;
        motion.strafe += (Math.max(-1, Math.min(1, wantStrafe)) - motion.strafe) * ease;
        motion.turn += ((keys.has('ArrowLeft') ? 1 : 0) - (keys.has('ArrowRight') ? 1 : 0) - motion.turn) * ease;
        view.yaw += motion.turn * TURN_SPEED * dt;
        const sin = Math.sin(view.yaw);
        const cos = Math.cos(view.yaw);
        view.x += (-sin * motion.forward + cos * motion.strafe) * WALK_SPEED * dt;
        view.z += (-cos * motion.forward - sin * motion.strafe) * WALK_SPEED * dt;
      }
      // Les murs arrêtent le visiteur
      view.x = Math.max(-HALL.halfWidth + 1, Math.min(HALL.halfWidth - 1, view.x));
      // La porte d'entrée s'ouvre à l'approche ; ouverte, on peut la franchir
      const nearDoor = Math.hypot(view.x, HALL.zBack - view.z) < EXIT.openWithin;
      doorOpen += ((nearDoor ? 1 : 0) - doorOpen) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 3.5));
      hinges.forEach(({ hinge, side }) => {
        hinge.rotation.y = -side * doorOpen * 1.75; // vers l'intérieur de la salle
      });
      // …à condition de lui faire face : le visiteur démarre juste devant, on
      // ne doit pas sortir par mégarde en reculant.
      const canPass = doorOpen > 0.6 && Math.abs(view.x) < EXIT.width / 2 - 0.25 && Math.cos(view.yaw) < -0.2;
      view.z = Math.max(HALL.zEnd + 1.2, Math.min(HALL.zBack - (canPass || exiting ? EXIT.threshold : 0.6), view.z));
      if (canPass && view.z > HALL.zBack - 0.75 && !exiting) {
        // On franchit la porte : le visiteur est amené droit sur le seuil, où
        // l'embrasure, donc la page, remplit tout l'écran…
        exiting = true;
        setLeaving(true);
        keys.clear();
        goal = { x: 0, z: HALL.zBack - EXIT.threshold, yaw: Math.PI, pitch: 0 };
        if (reducedMotion) Object.assign(view, goal);
      }
      if (exiting && !left && Math.abs(view.x) + Math.abs(view.z - (HALL.zBack - EXIT.threshold)) + Math.abs(Math.sin(view.yaw)) + Math.abs(view.pitch) < 0.012) {
        // …puis la page vivante passe au premier plan, la navigation se fait
        // dessous, et elle s'efface une fois la vraie page montée.
        left = true;
        if (lite) {
          homeFrame.remove();
          navigate('/');
        } else {
          Object.assign(homeFrame.style, { transform: 'none', zIndex: '1000', visibility: 'visible' });
          navigate('/');
          setTimeout(() => {
            homeFrame.classList.add('musee-portal-out');
            setTimeout(() => homeFrame.remove(), 700);
          }, 1100);
        }
      }

      // …et le mobilier aussi (socle du coin écoute, bancs) : on le contourne
      // (pas pendant un trajet guidé : on y glisse entre les obstacles)
      (goal ? [] : OBSTACLES).forEach((obstacle) => {
        const ox = view.x - obstacle.x;
        const oz = view.z - obstacle.z;
        const reachX = obstacle.width / 2 + 0.45;
        const reachZ = obstacle.depth / 2 + 0.45;
        if (Math.abs(ox) < reachX && Math.abs(oz) < reachZ) {
          if (reachX - Math.abs(ox) < reachZ - Math.abs(oz)) view.x = obstacle.x + Math.sign(ox || 1) * reachX;
          else view.z = obstacle.z + Math.sign(oz || 1) * reachZ;
        }
      });
      // Le baladeur est sur son socle tant qu'on ne l'a pas pris ; une fois
      // pris, il reste fixe en bas de l'écran.
      const state = musicRef.current;
      playerStand.visible = !state.started;
      if (barRef.current && state.audio) barRef.current.style.transform = `scaleX(${state.audio.duration ? Math.min(1, state.audio.currentTime / state.audio.duration) : 0})`;

      // Respiration et balancement des visiteurs (voir VISITOR_VERTEX)
      if (!reducedMotion) visitorTime.value = now / 1000;

      camera.position.set(view.x, EYE, view.z);
      camera.rotation.y = view.yaw;
      camera.rotation.x = view.pitch;
      renderer.render({ scene, camera });
      if (!left && !lite) placePortal(doorOpen);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      apiRef.current = null;
      if (!left) homeFrame.remove();
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [supported, navigate]);

  // Clignements d'yeux : deux paupières se referment un bref instant, à
  // intervalles irréguliers, parfois deux fois de suite. Animées par script
  // (Web Animations) : la règle mobile qui coupe les animations CSS ne les
  // touche pas.
  useEffect(() => {
    const lids = lidsRef.current;
    if (!supported || !lids || !lids.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer;
    const blink = (again) => {
      [...lids.children].forEach((lid, i) => {
        const open = `translateY(${i ? 130 : -130}%)`;
        lid.animate([{ transform: open }, { transform: 'translateY(0)', offset: 0.42 }, { transform: 'translateY(0)', offset: 0.55 }, { transform: open }], { duration: 260, easing: 'ease-in-out' });
      });
      timer = setTimeout(() => blink(Math.random() < 0.2), again ? 330 : 3500 + Math.random() * 4500);
    };
    timer = setTimeout(() => blink(false), 6000);
    return () => clearTimeout(timer);
  }, [supported]);

  // Lecteur des extraits du coin écoute. Les adresses des extraits sont
  // demandées au catalogue iTunes au chargement (elles peuvent changer).
  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    const state = musicRef.current;
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = 0.85; // dans les oreilles : le même niveau partout dans la salle
    state.audio = audio;

    state.play = (index) => {
      const track = MUSEE_PLAYLIST[(index + MUSEE_PLAYLIST.length) % MUSEE_PLAYLIST.length];
      const preview = state.previews[track.itunesId];
      state.started = true;
      state.index = MUSEE_PLAYLIST.indexOf(track);
      setMusic({ playing: false, index: state.index });
      if (!preview) return;
      audio.src = preview.url;
      audio.play().catch(() => {});
    };
    const onPlayState = () => {
      state.playing = !audio.paused;
      if (state.started) setMusic({ playing: state.playing, index: state.index });
    };
    const onEnded = () => state.play(state.index + 1);
    audio.addEventListener('play', onPlayState);
    audio.addEventListener('pause', onPlayState);
    audio.addEventListener('ended', onEnded);

    fetch(`https://itunes.apple.com/lookup?country=FR&id=${MUSEE_PLAYLIST.map((track) => track.itunesId).join(',')}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        data.results.forEach((result) => {
          if (result.previewUrl) state.previews[result.trackId] = { url: result.previewUrl, link: result.trackViewUrl };
        });
        if (!Object.keys(state.previews).length) setPreviewsFailed(true);
        // Musique demandée avant l'arrivée des extraits : on la lance maintenant
        else if (state.started && audio.paused) state.play(state.index);
      })
      .catch(() => {
        if (!cancelled) setPreviewsFailed(true);
      });

    return () => {
      cancelled = true;
      audio.pause();
      audio.removeEventListener('play', onPlayState);
      audio.removeEventListener('pause', onPlayState);
      audio.removeEventListener('ended', onEnded);
      audio.removeAttribute('src');
      Object.assign(state, { audio: null, playing: false, started: false, index: 0, previews: {}, play: () => {} });
    };
  }, [supported]);

  const toggleMusic = () => {
    const { audio, playing, index } = musicRef.current;
    if (playing) audio?.pause();
    else if (audio?.src) audio.play().catch(() => {});
    else musicRef.current.play(index);
  };

  // Repose le baladeur sur son socle : la musique s'arrête (un clic sur le
  // socle le reprend)
  const closeMusic = () => {
    const state = musicRef.current;
    state.started = false;
    state.audio?.pause();
    setMenuOpen(false);
    setMusic(null);
  };

  // Affiche en grand : Échap la referme, et elle se referme d'elle-même si
  // on quitte l'affiche
  useEffect(() => {
    if (zoomed === null) return undefined;
    const onKey = (e) => e.key === 'Escape' && setZoomed(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed]);
  useEffect(() => {
    if (focused === null) setZoomed(null);
  }, [focused]);

  // Prototype Armor Immo : Échap le referme
  useEffect(() => {
    if (!phoneOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setPhoneOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phoneOpen]);

  // Joystick tactile : le pouce déplace le bouton dans son socle ; la
  // direction et la force sont lues à chaque image par la salle (stickRef).
  const moveStick = (e) => {
    const base = e.currentTarget.getBoundingClientRect();
    const reach = base.width / 2;
    let x = (e.clientX - (base.left + reach)) / reach;
    let y = (e.clientY - (base.top + reach)) / reach;
    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    stickRef.current = { x, y: -y };
    if (knobRef.current) knobRef.current.style.transform = `translate(${(x * reach * 0.55).toFixed(1)}px, ${(y * reach * 0.55).toFixed(1)}px)`;
  };
  const startStick = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFocused(null);
    moveStick(e);
  };
  const endStick = () => {
    stickRef.current = { x: 0, y: 0 };
    if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
  };

  // Menu du baladeur : la molette monte et descend dans la liste, le bouton
  // central lance le titre surligné.
  const openMenu = () => {
    setMenuIndex((music?.index ?? 0) % MUSEE_PLAYLIST.length);
    setMenuOpen(true);
  };
  const moveMenu = (delta) => setMenuIndex((index) => (index + delta + MUSEE_PLAYLIST.length) % MUSEE_PLAYLIST.length);
  const pickMenu = (index) => {
    musicRef.current.play(index);
    setMenuOpen(false);
  };
  // Le titre surligné reste visible : la liste défile avec lui
  useEffect(() => {
    const list = menuRef.current;
    const item = list?.children[menuIndex];
    if (!menuOpen || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
  }, [menuOpen, menuIndex]);

  const step = (delta) => {
    const next = focused === null ? (delta > 0 ? 0 : EXHIBITS.length - 1) : (focused + delta + EXHIBITS.length) % EXHIBITS.length;
    apiRef.current?.goTo(next);
  };
  const exhibit = focused === null ? null : EXHIBITS[focused];
  const currentTrack = MUSEE_PLAYLIST[(music?.index ?? 0) % MUSEE_PLAYLIST.length];

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={SEO.url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rafael Piral | Portfolio" />
        <meta property="og:url" content={SEO.url} />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:image" content={SEO.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Salle du musée en 3D : affiches de Rafael Piral accrochées aux murs, sous une verrière" />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO.title} />
        <meta name="twitter:description" content={SEO.description} />
        <meta name="twitter:image" content={SEO.image} />
        <script type="application/ld+json">{JSON.stringify(SEO.jsonLd)}</script>
      </Helmet>

      {!supported ? (
        // Visite impossible ici : on dit pourquoi, on ramène au portfolio, et
        // on montre quand même les affiches, à plat.
        <div className="min-h-screen bg-black text-beige font-stamp px-4 md:px-16 py-10">
          <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
            <p className="text-xs tracking-[0.3em] uppercase opacity-60">Musée d'affiches</p>
            <h1 className="mt-6 text-3xl md:text-4xl" style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}>
              {blocker === 'size' && 'La fenêtre est trop étroite'}
              {blocker === 'browser' && "Ce navigateur ne peut pas afficher la visite"}
              {blocker === 'power' && "Cet appareil n'est pas assez puissant"}
            </h1>
            <p className="mt-5 text-sm md:text-base opacity-70">
              {blocker === 'size' && "Le musée est une salle en 3D dans laquelle on se promène : sur ordinateur, il lui faut une fenêtre d'au moins 1024 pixels de large. Agrandissez la fenêtre pour commencer la visite."}
              {blocker === 'browser' && "Le musée est une salle en 3D, et ce navigateur ne sait pas l'afficher (WebGL indisponible). Essayez avec un navigateur récent, comme Chrome, Firefox ou Safari."}
              {blocker === 'power' && "Le musée est une salle en 3D, et elle ne s'affiche pas de façon fluide sur cet appareil. Fermer d'autres onglets ou applications peut aider."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/" className="px-5 py-3 text-xs tracking-widest uppercase border border-beige bg-beige text-black transition-opacity hover:opacity-80">
                ← Retour au portfolio
              </Link>
              {blocker === 'power' && (
                <button type="button" onClick={() => setForced(true)} className="px-5 py-3 text-xs tracking-widest uppercase border border-beige/30 transition-colors hover:border-beige">
                  Visiter quand même
                </button>
              )}
            </div>
          </div>
          <p className="mt-6 text-xs tracking-[0.3em] uppercase opacity-60">Les affiches exposées</p>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-6">
            {EXHIBITS.map((item) => (
              <li key={item.image}>
                <Link to={`/work/${item.slug}`}>
                  <img src={item.src} alt={`Affiche : ${item.title}`} loading="lazy" />
                  <span className="mt-2 block text-sm">{item.title} · {item.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={`relative text-beige font-stamp overflow-clip ${leaving ? 'musee-leaving' : ''}`} style={{ height: '100dvh' }}>
          <div ref={containerRef} className="absolute inset-0" role="img" aria-label="Galerie en 3D : huit affiches accrochées aux murs blancs d'une salle d'exposition, sous une verrière" />
          {/* La salle est une image pour les moteurs de recherche et les
              lecteurs d'écran : ce bloc leur en donne le contenu en texte. */}
          <div className="sr-only">
            <p>
              Musée virtuel de Rafael Piral, graphiste : une salle d'exposition parisienne en 3D, sous verrière, où l'on se promène parmi {EXHIBITS.length} affiches de cinéma, de musique et de sport, avec vue sur les toits de Paris et la tour Eiffel.
            </p>
            <h2>Affiches exposées</h2>
            <ul>
              {EXHIBITS.map((item) => (
                <li key={item.image}>
                  <Link to={`/work/${item.slug}`}>
                    {item.title}, {item.note || item.category}, {item.year}
                  </Link>
                  {item.description ? ` : ${item.description}` : ''}
                </li>
              ))}
            </ul>
            <p>
              <Link to="/">Retour au portfolio de Rafael Piral</Link>
            </p>
          </div>
          <div aria-hidden="true" className="musee-vignette" />
          <div ref={lidsRef} aria-hidden="true" className="musee-lids">
            <span />
            <span />
          </div>
          {/* Voiles sombres en haut et en bas : l'interface reste lisible sur la salle claire */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.42) 0%, transparent 13%, transparent 74%, rgba(0, 0, 0, 0.6) 100%)' }} />

          <div className="absolute top-0 left-0 right-0 flex items-baseline justify-between px-4 md:px-8 py-4 text-xs md:text-sm tracking-[0.3em] uppercase pointer-events-none">
            <Link to="/" className="pointer-events-auto opacity-70 transition-opacity hover:opacity-100">← Portfolio</Link>
            <h1 className="opacity-70">Musée d'affiches</h1>
          </div>

          {/* Coin écoute : une fois pris, le baladeur reste en bas à droite de
              l'écran. Son écran affiche le titre en cours ou la liste, sa
              molette change de morceau. L'image de l'appareil est un rendu
              Blender ; l'écran et les boutons sont posés dessus. */}
          {music && (
            <div className="musee-player" role="group" aria-label="Baladeur : playlist de Rafael Piral">
              <div className="musee-player-hand">
                <img src="/images/musee/baladeur.webp" alt="" draggable={false} />
                <div className="musee-player-device">
                  <div className="musee-player-screen">
                    <div className="musee-player-head">
                      <span>{music.playing ? '▶' : '❚❚'}</span>
                      <span>{menuOpen ? 'Morceaux' : 'En lecture'}</span>
                      <span className="musee-player-battery" />
                    </div>
                    <div className="musee-player-body">
                    {menuOpen ? (
                      <ol ref={menuRef} data-lenis-prevent onWheel={(e) => e.stopPropagation()}>
                        {MUSEE_PLAYLIST.map((track, index) => {
                          const current = index === music.index % MUSEE_PLAYLIST.length;
                          return (
                            <li key={track.itunesId}>
                              <button type="button" aria-current={current ? 'true' : undefined} data-selected={index === menuIndex ? '' : undefined} onMouseEnter={() => setMenuIndex(index)} onClick={() => pickMenu(index)}>
                                <span>{track.title}</span>
                                <span aria-hidden="true">{current ? '♪' : '›'}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <>
                        <p className="musee-player-count">
                          {(music.index % MUSEE_PLAYLIST.length) + 1} sur {MUSEE_PLAYLIST.length}
                        </p>
                        <p className="musee-player-title">{currentTrack.title}</p>
                        <p className="musee-player-artist">{currentTrack.artist}</p>
                        <div className="musee-player-bar">
                          <span ref={barRef} />
                        </div>
                        <p className="musee-player-note">
                          {previewsFailed ? (
                            'Extraits indisponibles'
                          ) : (
                            <a href={musicRef.current.previews[currentTrack.itunesId]?.link || 'https://music.apple.com/fr/'} target="_blank" rel="noopener noreferrer">
                              Extrait · Apple Music ↗
                            </a>
                          )}
                        </p>
                      </>
                    )}
                    </div>
                  </div>
                  <div className="musee-player-wheel">
                    <button type="button" className="is-menu" onClick={menuOpen ? () => setMenuOpen(false) : openMenu} aria-expanded={menuOpen} aria-label={menuOpen ? 'Revenir au titre en cours' : 'Afficher la liste des titres'}>
                      MENU
                    </button>
                    <button type="button" className="is-prev" onClick={menuOpen ? () => moveMenu(-1) : () => musicRef.current.play(music.index - 1)} aria-label={menuOpen ? 'Monter dans la liste' : 'Titre précédent'}>
                      ◀◀
                    </button>
                    <button type="button" className="is-next" onClick={menuOpen ? () => moveMenu(1) : () => musicRef.current.play(music.index + 1)} aria-label={menuOpen ? 'Descendre dans la liste' : 'Titre suivant'}>
                      ▶▶
                    </button>
                    <button type="button" className="is-play" onClick={toggleMusic} aria-label={music.playing ? 'Mettre en pause' : 'Reprendre la lecture'}>
                      ▶❚❚
                    </button>
                    <button type="button" className="is-center" onClick={menuOpen ? () => pickMenu(menuIndex) : toggleMusic} aria-label={menuOpen ? 'Lancer le titre surligné' : music.playing ? 'Mettre en pause' : 'Reprendre la lecture'} />
                  </div>
                </div>
              </div>
              <button type="button" className="musee-player-drop" onClick={closeMusic}>
                Reposer le baladeur ✕
              </button>
            </div>
          )}

          {/* Crédits des photos de Paris (licences CC BY : mention obligatoire) */}
          <p className="hidden md:block absolute bottom-2 right-3 z-[1] text-[10px] text-beige/50">
            Vues de Paris :{' '}
            {PARIS_CREDITS.map((credit, i) => (
              <span key={credit.href}>
                {i > 0 && ', '}
                <a href={credit.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-beige">
                  {credit.author}
                </a>{' '}
                ({credit.license})
              </span>
            ))}
          </p>

          {/* Prototype Armor Immo, ouvert depuis le téléphone d'exposition */}
          {phoneOpen && PHONE_PROJECT?.figmaEmbed && (
            <div className="musee-zoom musee-phone" role="dialog" aria-modal="true" aria-label="Prototype du site mobile Armor Immo" onClick={() => setPhoneOpen(false)}>
              <div className="musee-phone-frame" onClick={(e) => e.stopPropagation()}>
                <iframe src={PHONE_PROJECT.figmaEmbed} title="Prototype Figma du site mobile Armor Immo" allowFullScreen />
              </div>
              <p className="musee-phone-caption">
                Armor Immo, prototype du site mobile · <Link to={`/work/${PHONE_PROJECT.slug}`}>Voir le projet →</Link>
              </p>
              <button type="button" aria-label="Fermer" onClick={() => setPhoneOpen(false)}>
                ✕
              </button>
            </div>
          )}

          {/* Affiche ouverte en grand : un clic n'importe où, ou Échap, la referme */}
          {zoomed !== null && EXHIBITS[zoomed] && (
            <div className="musee-zoom" role="dialog" aria-modal="true" aria-label={`Affiche : ${EXHIBITS[zoomed].title}`} onClick={() => setZoomed(null)}>
              <img src={EXHIBITS[zoomed].srcHd} alt={`Affiche : ${EXHIBITS[zoomed].title}`} draggable={false} />
              <button type="button" aria-label="Fermer" onClick={() => setZoomed(null)}>
                ✕
              </button>
            </div>
          )}

          {/* Appareil tactile : joystick pour marcher (pouce gauche), l'autre
              doigt glisse sur la salle pour regarder */}
          {touch && (
            <div className="musee-stick" onPointerDown={startStick} onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && moveStick(e)} onPointerUp={endStick} onPointerCancel={endStick} role="presentation">
              <span ref={knobRef} />
            </div>
          )}

          <div className="musee-bottom absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-5 flex flex-col items-center gap-3 pointer-events-none">
            {exhibit ? (
              <div className="musee-info pointer-events-auto w-full max-w-xl bg-black/70 backdrop-blur-sm border border-beige/15 px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-lg md:text-xl" style={{ fontFamily: '"PP Neue Montreal", sans-serif', fontWeight: 600 }}>{exhibit.title}</p>
                  <p className="text-xs opacity-50 tabular-nums whitespace-nowrap">{String(focused + 1).padStart(2, '0')} / {String(EXHIBITS.length).padStart(2, '0')}</p>
                </div>
                <p className="mt-1 text-xs tracking-widest uppercase opacity-50">{exhibit.note || exhibit.category} · {exhibit.year}</p>
                <p className="mt-2 text-sm opacity-70 line-clamp-2">{exhibit.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <button type="button" onClick={() => setZoomed(focused)} className="underline underline-offset-2 transition-opacity hover:opacity-60">
                    Voir en grand ⤢
                  </button>
                  <Link to={`/work/${exhibit.slug}`} className="underline underline-offset-2 transition-opacity hover:opacity-60">
                    Voir le projet →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-[11px] md:text-xs tracking-[0.25em] uppercase opacity-60 text-center">
                {touch ? 'Joystick pour marcher · Glisse pour regarder · Touche une affiche' : 'Flèches ou ZQSD pour marcher · Glisse pour regarder · Clique une affiche ou le baladeur · Sortie par la porte'}
              </p>
            )}
            <div className="musee-actions pointer-events-auto flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} className="px-4 py-2 text-xs tracking-widest uppercase border border-beige/25 bg-black/60 transition-colors hover:border-beige">
                ←<span className="musee-wide"> Précédente</span>
              </button>
              <button type="button" onClick={() => step(1)} className="px-4 py-2 text-xs tracking-widest uppercase border border-beige/25 bg-black/60 transition-colors hover:border-beige">
                {focused === null ? (touch ? 'Visite guidée' : 'Commencer la visite') : 'Suivante →'}
              </button>
              <button type="button" onClick={() => apiRef.current?.goToStation()} className="px-4 py-2 text-xs tracking-widest uppercase border border-beige/25 bg-black/60 transition-colors hover:border-beige">
                ♪<span className="musee-wide"> Coin écoute</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
