#!/usr/bin/env node
// Serves docs/ the way GitHub Pages does, for previewing on your own machine:
// folders serve their index.html and unknown paths get docs/404.html.
//
//   node tools/serve.mjs [port]     (default 8095)

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const PORT = Number(process.argv[2] || process.env.PORT || 8095);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^([/\\])+/, '');
  const file = join(ROOT, clean);
  if (file !== ROOT && !file.startsWith(ROOT + sep)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!urlPath.endsWith('/')) return { redirect: urlPath + '/' };
      return { file: join(file, 'index.html') };
    }
    return { file };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const found = await resolve(req.url || '/');
  if (found && found.redirect) {
    res.writeHead(301, { Location: found.redirect });
    res.end();
    return;
  }
  try {
    const file = found ? found.file : join(ROOT, '404.html');
    const body = await readFile(file);
    res.writeHead(found ? 200 : 404, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`lumaemusic.app preview on http://127.0.0.1:${PORT}/`);
});
