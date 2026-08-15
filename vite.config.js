import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs'
import { resolve, join, extname, relative } from 'path'

const IMAGE_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif', '.avif']);

function walkImages(dir, base) {
  let results = [];
  let entries;
  try { entries = readdirSync(dir); } catch { return results; }
  for (const name of entries) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walkImages(full, base));
    } else if (IMAGE_EXTS.has(extname(name).toLowerCase())) {
      const rel = relative(base, full).replace(/\\/g, '/');
      results.push('/images/projects/' + rel);
    }
  }
  return results;
}

function readBody(req) {
  return new Promise((ok, fail) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => ok(Buffer.concat(chunks)));
    req.on('error', fail);
  });
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] && typeof target[key] === 'object' ? target[key] : {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function projectsAdminPlugin() {
  return {
    name: 'projects-admin',
    configureServer(server) {

      // Lister les images
      server.middlewares.use('/api/list-images', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const dir = resolve('./public/images/projects');
          const images = walkImages(dir, dir);
          res.writeHead(200);
          res.end(JSON.stringify({ images }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });

      // Uploader une image
      server.middlewares.use('/api/upload-image', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') { res.writeHead(405); res.end('{}'); return; }
        try {
          const buf = await readBody(req);
          const { filename, data, subfolder } = JSON.parse(buf.toString());
          const base64 = data.replace(/^data:[^;]+;base64,/, '');
          const dir = resolve('./public/images/projects', subfolder || '');
          mkdirSync(dir, { recursive: true });
          const dest = join(dir, filename);
          writeFileSync(dest, Buffer.from(base64, 'base64'));
          const relPath = subfolder
            ? `/images/projects/${subfolder}/${filename}`
            : `/images/projects/${filename}`;
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, path: relPath }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });

      // Sauvegarder les projets
      server.middlewares.use('/api/save-projects', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') { res.writeHead(405); res.end('{}'); return; }
        try {
          const buf = await readBody(req);
          const { projects } = JSON.parse(buf.toString());
          const filePath = resolve('./src/data/projects.js');
          const current = readFileSync(filePath, 'utf-8');
          const serialized = JSON.stringify(projects, null, 2);
          const updated = current.replace(
            /export const projects = \[[\s\S]*?\n\];/,
            `export const projects = ${serialized};`
          );
          if (updated === current) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Pattern introuvable dans projects.js' }));
            return;
          }
          writeFileSync(filePath, updated, 'utf-8');
          res.writeHead(200);
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });

      // Sauvegarder la timeline
      server.middlewares.use('/api/save-timeline', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') { res.writeHead(405); res.end('{}'); return; }
        try {
          const buf = await readBody(req);
          const { events } = JSON.parse(buf.toString());
          const filePath = resolve('./src/data/timeline.js');
          const current = readFileSync(filePath, 'utf-8');
          const serialized = JSON.stringify(events, null, 2);
          const updated = current.replace(
            /export const timelineEvents = \[[\s\S]*?\n\];/,
            `export const timelineEvents = ${serialized};`
          );
          if (updated === current) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Pattern introuvable dans timeline.js' }));
            return;
          }
          writeFileSync(filePath, updated, 'utf-8');
          res.writeHead(200);
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });

      // Sauvegarder le contenu du profil (fr/en, fichiers i18n home.json)
      server.middlewares.use('/api/save-content', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') { res.writeHead(405); res.end('{}'); return; }
        try {
          const buf = await readBody(req);
          const { fr, en } = JSON.parse(buf.toString());
          for (const [lang, patch] of [['fr', fr], ['en', en]]) {
            if (!patch) continue;
            const filePath = resolve(`./src/i18n/locales/${lang}/home.json`);
            const current = JSON.parse(readFileSync(filePath, 'utf-8'));
            const merged = deepMerge(current, patch);
            writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
          }
          res.writeHead(200);
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    svgr(),
    projectsAdminPlugin(),
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-framer': ['framer-motion'],
          'vendor-lenis': ['lenis'],
        }
      }
    },
    // Réduire la taille des chunks
    chunkSizeWarningLimit: 500
  }
})
