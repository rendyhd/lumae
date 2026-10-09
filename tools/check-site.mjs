#!/usr/bin/env node
// Checks docs/ before it is published:
//   - every page has a language, title, description and viewport;
//   - every local link, image, script, stylesheet, font and icon exists,
//     including #fragments on this or another page;
//   - ids are unique and every id reference (aria-*, <use>, #links) resolves;
//   - every image has alt text and a size;
//   - nothing loads from another site, and the script makes no requests.
// Exits 1 with a list of problems.
//
//   node tools/check-site.mjs [docs folder]

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = process.argv[2] ? resolve(process.argv[2]) : join(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const REPO = dirname(DOCS);
const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(DOCS);
const pages = files.filter((f) => f.endsWith('.html'));
const rel = (f) => relative(REPO, f).split(sep).join('/');

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

// Resolves a local URL from a page to a file in docs/.
function resolveLocal(fromFile, url) {
  const [pathPart] = url.split(/[?#]/);
  let target;
  if (pathPart === '') target = fromFile;
  else if (pathPart.startsWith('/')) target = join(DOCS, pathPart);
  else target = join(dirname(fromFile), pathPart);
  if (pathPart.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) {
    target = join(target, 'index.html');
  }
  return target;
}

const isExternal = (url) => /^[a-z][a-z0-9+.-]*:/i.test(url);

let linkCount = 0;

for (const page of pages) {
  const where = rel(page);
  const html = readFileSync(page, 'utf8');
  const noindex = /<meta\s+name="robots"\s+content="noindex"/.test(html);

  if (!/<html lang="en"/.test(html)) fail(where, 'missing <html lang="en">');
  const title = /<title>([^<]*)<\/title>/.exec(html);
  if (!title || !title[1].trim()) fail(where, 'missing <title>');
  if (!/<meta\s+name="description"\s+content="[^"]{20,}"/.test(html)) fail(where, 'missing meta description');
  if (!/<meta\s+name="viewport"/.test(html)) fail(where, 'missing meta viewport');
  if (!noindex && !/<link rel="canonical" href="https:\/\/lumaemusic\.app\//.test(html)) {
    fail(where, 'missing canonical link');
  }
  if (!/<main id="main"/.test(html)) fail(where, 'missing <main id="main"> for the skip link');
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(where, 'expected exactly one <h1>');

  // Unique ids.
  const seen = new Map();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) || 0) + 1);
  for (const [id, n] of seen) if (n > 1) fail(where, `duplicate id "${id}"`);
  const ids = idsOf(page);

  // Id references.
  for (const m of html.matchAll(/\saria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!ids.has(id)) fail(where, `aria reference to missing id "${id}"`);
  }
  for (const m of html.matchAll(/<use href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) fail(where, `<use> of missing symbol "#${m[1]}"`);
  }

  // Images.
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) fail(where, `image without alt: ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(where, `image without width/height: ${tag.slice(0, 80)}`);
  }

  // Nothing may load from another site.
  const loaders = [
    /<script\b[^>]*\ssrc="([^"]+)"/g,
    /<img\b[^>]*\ssrc="([^"]+)"/g,
    /<source\b[^>]*\ssrcset="([^"]+)"/g,
    /<link\b[^>]*\srel="(?:stylesheet|preload|icon|apple-touch-icon|manifest|modulepreload)"[^>]*\shref="([^"]+)"/g,
    /<(?:iframe|video|audio|embed|object)\b[^>]*\s(?:src|data)="([^"]+)"/g,
  ];
  for (const re of loaders) {
    for (const m of html.matchAll(re)) if (isExternal(m[1])) fail(where, `loads from another site: ${m[1]}`);
  }
  if (/<iframe\b/.test(html)) fail(where, 'iframes are not allowed');

  // Local links and assets, including #fragments.
  for (const m of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const url = m[2];
    if (!url) {
      fail(where, `empty ${m[1]}`);
      continue;
    }
    if (isExternal(url)) {
      if (/^http:/.test(url)) fail(where, `insecure link: ${url}`);
      continue;
    }
    linkCount++;
    const target = resolveLocal(page, url);
    if (!existsSync(target)) {
      fail(where, `broken link: ${url}`);
      continue;
    }
    const hash = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) {
      fail(where, `link to missing fragment: ${url}`);
    }
  }
}

// Stylesheets: url() must be local and exist.
for (const css of files.filter((f) => f.endsWith('.css'))) {
  const text = readFileSync(css, 'utf8');
  if (/@import\b/.test(text)) fail(rel(css), '@import is not allowed');
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const url = m[1];
    if (url.startsWith('#') || url.startsWith('data:')) continue;
    if (isExternal(url)) {
      fail(rel(css), `loads from another site: ${url}`);
      continue;
    }
    if (!existsSync(join(dirname(css), url))) fail(rel(css), `missing file: ${url}`);
  }
}

// Scripts: no network requests of any kind.
for (const js of files.filter((f) => f.endsWith('.js'))) {
  const text = readFileSync(js, 'utf8');
  for (const api of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'EventSource', 'importScripts', 'new Image(']) {
    if (text.includes(api)) fail(rel(js), `makes network requests (${api})`);
  }
}

// Manifest, domain and sitemap.
const manifest = JSON.parse(readFileSync(join(DOCS, 'site.webmanifest'), 'utf8'));
for (const icon of manifest.icons || []) {
  if (!existsSync(join(DOCS, icon.src))) fail('docs/site.webmanifest', `missing icon ${icon.src}`);
}
const cname = existsSync(join(DOCS, 'CNAME')) ? readFileSync(join(DOCS, 'CNAME'), 'utf8').trim() : '';
if (cname !== 'lumaemusic.app') fail('docs/CNAME', `expected lumaemusic.app, found "${cname}"`);
const sitemap = readFileSync(join(DOCS, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>https:\/\/lumaemusic\.app(\/[^<]*)<\/loc>/g)) {
  if (!existsSync(resolveLocal(join(DOCS, 'index.html'), m[1]))) fail('docs/sitemap.xml', `no page for ${m[1]}`);
}
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const canonical = /<link rel="canonical" href="https:\/\/lumaemusic\.app([^"]*)"/.exec(html);
  if (canonical && !sitemap.includes(`<loc>https://lumaemusic.app${canonical[1]}</loc>`)) {
    fail('docs/sitemap.xml', `missing ${canonical[1]}`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`site ok: ${pages.length} pages, ${linkCount} local links and assets checked`);
