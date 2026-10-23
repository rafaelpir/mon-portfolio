import { useEffect, useRef, useState } from 'react';
import GridSparkles from './GridSparkles';

// Fond animé "grille vivante" : même quadrillage pointillé que GridSparkles,
// mais les intersections scintillent et des cellules s'allument par vagues
// (croix, cercles et carrés tracés en balayage, repères de coupe, diagonales,
// point qui voyage...), en gris très discret.
// Shader WebGL en plein écran sur un canvas transparent, en boucle parfaite
// de `loop` secondes. Retombe sur GridSparkles si WebGL n'est pas dispo.

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2  uRes;
uniform float uCell;   // taille d'une cellule en pixels écran
uniform vec2  uOrigin; // coin bas-gauche de la grille, en pixels écran
uniform vec2  uCount;  // nombre de cellules entières (colonnes, lignes)
uniform float uDpr;
uniform float uTime;
uniform float uLoop;
uniform float uSeed;
uniform vec3  uInk;

const float TAU = 6.28318;

float hash(vec2 p) {
  p = fract(p * vec2(233.34, 851.73) + uSeed * 0.173);
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}
float box(vec2 p, float a, float b) {
  vec2 s = step(vec2(a), p) * step(p, vec2(b));
  return s.x * s.y;
}
// 1 si v est dans [lo, hi], composante par composante
float within(vec2 v, vec2 lo, vec2 hi) {
  vec2 s = step(lo, v) * step(v, hi);
  return s.x * s.y;
}

void main() {
  vec2 pix = gl_FragCoord.xy;
  float ph = fract(uTime / uLoop);

  vec2 g  = (pix - uOrigin) / uCell;           // grille calée sur l'écran, cellules entières
  vec2 id = floor(g);
  vec2 f  = fract(g);
  float px = uDpr / uCell;                      // 1 px CSS en coordonnées de cellule

  // 1) lignes pointillées (1 px allumé sur 4)
  float dash = 4.0 * uDpr;
  // seulement les lignes intérieures, pour ne rien tracer sur le bord de l'écran
  float lx = step(f.x, px) * step(fract(pix.y / dash), 0.25)
           * within(id, vec2(1.0, 0.0), vec2(uCount.x - 1.0, uCount.y - 1.0));
  float ly = step(f.y, px) * step(fract(pix.x / dash), 0.25)
           * within(id, vec2(0.0, 1.0), vec2(uCount.x - 1.0, uCount.y - 1.0));
  float lum = 0.09 * clamp(lx + ly, 0.0, 1.0);

  // 2) éclats aux intersections, qui scintillent
  vec2 cid = floor(g + 0.5);
  float dist = length(g - cid) * uCell / uDpr;  // distance en px CSS
  float tw = 0.55 + 0.45 * sin(TAU * (ph * 2.0 + hash(cid + 1.3)));
  float inner = within(cid, vec2(1.0), uCount - 1.0);  // pas d'éclat coupé par le bord
  lum += (exp(-dist * 0.9) * 0.9 + exp(-dist * 0.25) * 0.15) * tw * 0.5 * inner;

  // 3) une cellule sur deux s'anime une fois par boucle, par vagues :
  //    sa forme se dessine, reste un instant, puis s'efface
  float h = hash(id);
  float wave = dot(id, vec2(0.08, 0.05));
  float s = fract(ph - wave - h * 0.6);
  float prog = clamp(s / 0.25, 0.0, 1.0) * step(s, 0.25);
  float alive = step(0.5, hash(id + 3.3));
  float draw = smoothstep(0.0, 0.6, prog);
  float fade = smoothstep(0.0, 0.05, prog) * (1.0 - smoothstep(0.8, 1.0, prog));
  float type = floor(hash(id + 5.1) * 10.0);
  float lw = 0.6 * px;                          // trait d'environ 1 px
  vec2 q = f - 0.5;
  float ang = fract(atan(q.y, q.x) / TAU + 0.25); // 0..1 autour du centre

  float glyph = 0.0;
  if (type < 1.0) {            // croix qui s'étire
    vec2 c = abs(q);
    float L = 0.08 * draw;
    glyph = max(step(c.y, lw) * step(c.x, L), step(c.x, lw) * step(c.y, L));
  } else if (type < 2.0) {     // petit carré plein qui grandit
    glyph = step(max(abs(q.x), abs(q.y)), 0.05 * draw);
  } else if (type < 3.0) {     // contour carré tracé en balayage
    glyph = step(abs(max(abs(q.x), abs(q.y)) - 0.38), lw) * step(ang, draw);
  } else if (type < 4.0) {     // cercle fin tracé en balayage
    glyph = step(abs(length(q) - 0.3), lw) * step(ang, draw);
  } else if (type < 5.0) {     // repères de coupe aux quatre coins
    vec2 e = (0.5 - abs(q)) - 0.1;
    float L = 0.12 * draw;
    glyph = max(step(abs(e.x), lw) * step(0.0, e.y) * step(e.y, L),
                step(abs(e.y), lw) * step(0.0, e.x) * step(e.x, L));
  } else if (type < 6.0) {     // diagonale qui se dessine
    vec2 a0 = vec2(-0.3), ab = vec2(0.6);
    float tt = clamp(dot(q - a0, ab) / dot(ab, ab), 0.0, 1.0);
    glyph = step(length(q - a0 - ab * tt), lw) * step(tt, draw);
  } else if (type < 7.0) {     // point qui voyage sur une ligne
    float line = step(abs(q.y), lw) * step(abs(q.x), 0.32) * 0.4;
    float x = mix(-0.32, 0.32, draw);
    glyph = max(line, step(length(q - vec2(x, 0.0)), 2.0 * px));
  } else if (type < 8.0) {     // trois points qui apparaissent l'un après l'autre
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      glyph += step(length(q - vec2((fi - 1.0) * 0.12, 0.0)), 1.8 * px) * step(fi / 3.0, draw - 0.01);
    }
  } else if (type < 9.0) {     // carrés concentriques, de l'extérieur vers le centre
    float r = max(abs(q.x), abs(q.y));
    glyph = step(abs(r - 0.32), lw)
          + step(abs(r - 0.2), lw) * step(0.45, draw)
          + step(r, 0.035) * step(0.9, draw);
  } else {                     // quart d'arc depuis un coin
    vec2 c = f - 0.12;
    float a2 = atan(c.y, c.x) / (TAU * 0.25);
    glyph = step(abs(length(c) - 0.6), lw) * step(0.0, a2) * step(a2, draw);
  }
  glyph = clamp(glyph, 0.0, 1.0) * 0.18 * fade * alive * within(id, vec2(0.0), uCount - 1.0);

  // sortie prémultipliée sur fond transparent
  lum = clamp(lum, 0.0, 1.0);
  vec3 col = uInk * (lum * (1.0 - glyph) + glyph);
  float alpha = lum * (1.0 - glyph) + glyph;
  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(log);
  }
  return s;
}

// `fullPage` : canvas fixe à la taille de l'écran, sans fondu, pour servir
// de fond à toute la page pendant le défilement.
export default function LivingGrid({ isDarkMode = true, cell = 150, loop = 20, seed = 4, opacity = 1, fullPage = false, className = '' }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) { setFailed(true); return undefined; }

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (e) {
      console.warn('LivingGrid: shader indisponible, retour au quadrillage statique', e);
      setFailed(true);
      return undefined;
    }
    gl.useProgram(program);

    // un triangle qui couvre tout l'écran
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(program, n);
    const uRes = u('uRes'), uCell = u('uCell'), uDpr = u('uDpr'), uTime = u('uTime');
    const uOrigin = u('uOrigin'), uCount = u('uCount');
    gl.uniform1f(u('uLoop'), loop);
    gl.uniform1f(u('uSeed'), seed);
    gl.uniform3fv(u('uInk'), isDarkMode ? [0.898, 0.898, 0.898] : [0, 0, 0]);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const draw = () => {
      gl.uniform1f(uTime, reduceMotion ? 3 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      // nombre entier de cellules carrées qui tient dans l'écran, grille centrée
      const cols = Math.max(1, Math.round(w / (cell * dpr)));
      const rows = Math.max(1, Math.round(h / (cell * dpr)));
      const size = Math.floor(Math.min(w / cols, h / rows));
      gl.uniform1f(uCell, size);
      gl.uniform2f(uOrigin, Math.floor((w - cols * size) / 2), Math.floor((h - rows * size) / 2));
      gl.uniform2f(uCount, cols, rows);
      gl.uniform1f(uDpr, dpr);
      draw();
    };
    const loopFrame = () => {
      draw();
      raf = requestAnimationFrame(loopFrame);
    };
    const play = () => {
      if (reduceMotion || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loopFrame);
    };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    // ne calcule rien quand le fond est hors écran ou l'onglet caché
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play(); else pause();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVis);
    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [isDarkMode, cell, loop, seed]);

  const position = fullPage ? 'fixed inset-0 w-full h-full' : 'absolute inset-0 w-full h-full';
  if (failed) {
    return fullPage
      ? <div className={`${position} pointer-events-none ${className}`}><GridSparkles isDarkMode={isDarkMode} cell={cell} /></div>
      : <GridSparkles isDarkMode={isDarkMode} cell={cell} className={className} />;
  }

  // même fondu vers les bords que GridSparkles, sauf en pleine page
  const vignette = 'radial-gradient(ellipse at center, black 0%, black 35%, transparent 75%)';
  const mask = fullPage ? {} : { WebkitMaskImage: vignette, maskImage: vignette };
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${position} pointer-events-none ${className}`}
      style={{ opacity, ...mask }}
    />
  );
}
