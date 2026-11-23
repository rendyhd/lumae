#!/usr/bin/env node
// Builds the parts of lumaemusic.app that are derived from other files:
//   - copies the shared header and footer from docs/index.html into every
//     other page, adjusting relative links and the current header link;
//   - renders docs/privacy/index.html from PRIVACY.md;
//   - renders docs/changelog/index.html and its Atom feed from CHANGELOG.md;
//   - renders docs/404.html.
// The site itself needs no build step: the output is committed.
//
//   node tools/build-site.mjs           write the pages
//   node tools/build-site.mjs --check   exit 1 if any page is out of date

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(REPO, 'docs');
const SITE = 'https://lumaemusic.app';
const check = process.argv.includes('--check');

const BLOCKS = ['site-header', 'site-footer'];

function between(html, name, file) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a < 0 || b < a) throw new Error(`${file}: missing ${start} … ${end}`);
  return { before: html.slice(0, a + start.length), body: html.slice(a + start.length, b), after: html.slice(b) };
}

// Rewrites a block written for the site root (docs/index.html) for a page
// elsewhere. prefix is '../' for pages one folder down and '/' for 404.html,
// which can be served at any depth.
function localize(block, { prefix, current }) {
  let out = block.replace(/\b(href|src)="([^"]*)"/g, (match, attr, url) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(url)) return match;
    const path = url.startsWith('./') ? url.slice(2) : url;
    return `${attr}="${prefix}${path}"`;
  });
  out = out.replace(/ aria-current="page"/g, '');
  if (current) {
    out = out.replace(
      new RegExp(`(<a [^>]*data-nav="${current}")`),
      '$1 aria-current="page"',
    );
  }
  // The beta is for the app; say so where the page is about the radio.
  if (current === 'radio') out = out.replace('>Join the beta</a>', '>Join the app beta</a>');
  return out;
}

function withSharedBlocks(html, file, options, source) {
  let result = html;
  for (const name of BLOCKS) {
    const shared = between(source, name, 'docs/index.html').body;
    const parts = between(result, name, file);
    result = parts.before + localize(shared, options) + parts.after;
  }
  return result;
}

/* ---------- Markdown (only what PRIVACY.md and CHANGELOG.md use) ---------- */

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function inline(text) {
  const codes = [];
  let out = text.replace(/`([^`]+)`/g, (_m, code) => {
    codes.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = escapeHtml(out);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const external = /^https?:/.test(href);
    return `<a href="${href.replace(/"/g, '%22')}"${external ? ' rel="noopener"' : ''}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
  // Typographic apostrophes in running text.
  out = out.replace(/(\w)'(\w)/g, '$1’$2');
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i) => codes[Number(i)]);
  return out;
}

// idPrefix keeps heading ids unique when several pieces share one page.
function markdown(md, idPrefix = '') {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  const headings = [];
  const used = new Set();
  let i = 0;
  let seenH1 = false;
  let title = '';
  let meta = '';

  const uniqueId = (text) => {
    const base = idPrefix + (slug(text) || 'section');
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return id;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const heading = /^(#{1,4}) (.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (level === 1) {
        title = inline(text);
        seenH1 = true;
      } else {
        const id = uniqueId(text);
        if (level === 2) headings.push({ id, text });
        html.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      }
      i++;
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (row) =>
        row
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      html.push(
        '<div class="table-wrap">\n<table>\n<thead><tr>' +
          head.map((c) => `<th scope="col">${inline(c)}</th>`).join('') +
          '</tr></thead>\n<tbody>\n' +
          body.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('\n') +
          '\n</tbody>\n</table>\n</div>',
      );
      continue;
    }
    if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && (/^- /.test(lines[i]) || /^ {2,}\S/.test(lines[i]))) {
        if (/^- /.test(lines[i])) items.push(lines[i].slice(2).trim());
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      html.push('<ul>\n' + items.map((t) => `<li>${inline(t)}</li>`).join('\n') + '\n</ul>');
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4} |\||- )/.test(lines[i])) para.push(lines[i++].trim());
    const text = para.join(' ');
    if (seenH1 && /^Last updated:/.test(text) && !html.some((h) => h.startsWith('<p'))) {
      meta = inline(text);
    } else {
      html.push(`<p>${inline(text)}</p>`);
    }
  }
  return { title, meta, html: html.join('\n'), headings };
}

/* ---------- Page templates ---------- */

const THEME_SCRIPT = `<script>
      (function () {
        var d = document.documentElement;
        d.className = d.className.replace('no-js', 'js');
        try {
          var t = localStorage.getItem('lumae-site-theme');
          if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
        } catch (e) {}
      })();
    </script>`;

const THEME_SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false">
      <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" /></symbol>
      <symbol id="i-sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </symbol>
    </svg>`;

function head({ prefix, title, description, path, robots, feed }) {
  const canonical = path ? `\n    <link rel="canonical" href="${SITE}${path}" />` : '';
  const alternate = feed
    ? `\n    <link rel="alternate" type="application/atom+xml" title="${feed}" href="${prefix}changelog/feed.xml" />`
    : '';
  const og = path
    ? `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Lumae" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${SITE}${path}" />
    <meta property="og:image" content="${SITE}/assets/img/og/og-music.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Lumae on two phones: Home with The Pulse, and Now Playing with large album art." />
    <meta name="twitter:card" content="summary_large_image" />`
    : '';
  return `<!doctype html>
<html lang="en" class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${description}" />${robots ? `\n    <meta name="robots" content="${robots}" />` : ''}${canonical}
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0d0d0f" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#f7f7f4" media="(prefers-color-scheme: light)" />
    <link rel="icon" href="${prefix}assets/img/brand/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="${prefix}assets/img/brand/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="${prefix}assets/img/brand/apple-touch-icon.png" />
    <link rel="manifest" href="${prefix}site.webmanifest" />${alternate}${og}
    <link rel="preload" href="${prefix}assets/fonts/geist-600.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="${prefix}assets/fonts/geist-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${prefix}assets/css/site.css" />
    ${THEME_SCRIPT}
    <script src="${prefix}assets/js/site.js" defer></script>
  </head>`;
}

function shell({ prefix, main, bodyClass }) {
  return `
  <body${bodyClass ? ` class="${bodyClass}"` : ''}>
    ${THEME_SPRITE}

    <a class="skip-link" href="#main">Skip to content</a>

    <!-- site-header:start --><!-- site-header:end -->

    <main id="main">
${main}
    </main>

    <!-- site-footer:start --><!-- site-footer:end -->
  </body>
</html>
`;
}

function privacyPage() {
  const md = readFileSync(join(REPO, 'PRIVACY.md'), 'utf8');
  const { title, meta, html, headings } = markdown(md);
  const toc = headings.map((h) => `                <li><a href="#${h.id}">${inline(h.text)}</a></li>`).join('\n');
  const body = html
    .split('\n')
    .map((l) => `            ${l}`)
    .join('\n');
  const main = `      <section class="section section--doc">
        <header class="wrap doc-head">
          <h1>${title}</h1>
          <p class="doc-meta">${meta}</p>
        </header>
        <div class="wrap doc">
          <nav class="doc-toc" data-toc aria-label="On this page">
            <details open>
              <summary>On this page</summary>
              <ol role="list">
${toc}
              </ol>
            </details>
          </nav>
          <article class="prose">
${body}
            <p class="doc-source">
              This page is generated from
              <a href="https://github.com/rendyhd/lumae/blob/main/PRIVACY.md">PRIVACY.md on GitHub</a>, which keeps
              its full history.
            </p>
          </article>
        </div>
      </section>`;
  return (
    head({
      prefix: '../',
      title: 'Privacy · Lumae',
      description:
        'How Lumae and Lumae Radio handle your data: no account, no ads, no tracking. Your library, history and taste stay on your phone and your own servers.',
      path: '/privacy/',
    }) + shell({ prefix: '../', main, bodyClass: 'page-doc' })
  );
}

/* ---------- Changelog ---------- */

// CHANGELOG.md: "# Title", an intro, then "## Product" groups of
// "### Name {#id}" releases. A "> " line right under a release is its meta
// line. Each release names its date ("November 7, 2026") in its name or meta.
// Links to the site are written in full (https://lumaemusic.app/...) so they
// work on GitHub too; the page makes them relative.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DATE = new RegExp(`\\b(${MONTHS.join('|')}) (\\d{1,2}), (\\d{4})\\b`);

function findDate(text) {
  const m = DATE.exec(text);
  if (!m) return null;
  const month = String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0');
  return { text: m[0], iso: `${m[3]}-${month}-${m[2].padStart(2, '0')}` };
}

function parseChangelog() {
  const md = readFileSync(join(REPO, 'CHANGELOG.md'), 'utf8');
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let title = '';
  const intro = [];
  const groups = [];
  let group = null;
  let release = null;
  for (const line of lines) {
    let m;
    if ((m = /^# (.+)$/.exec(line))) {
      title = m[1].trim();
    } else if ((m = /^## (.+)$/.exec(line))) {
      group = { name: m[1].trim(), id: slug(m[1]), intro: [], releases: [] };
      groups.push(group);
      release = null;
    } else if ((m = /^### (.+?)\s*\{#([a-z0-9-]+)\}\s*$/.exec(line))) {
      if (!group) throw new Error(`CHANGELOG.md: "${line}" comes before any "## " product`);
      release = { name: m[1].trim(), id: m[2], meta: '', body: [], group };
      group.releases.push(release);
    } else if (/^### /.test(line)) {
      throw new Error(`CHANGELOG.md: give "${line}" an id, like {#music-2026-11-10}`);
    } else if (release && !release.body.some((l) => l.trim()) && (m = /^> ?(.*)$/.exec(line))) {
      release.meta = `${release.meta} ${m[1].trim()}`.trim();
    } else if (release) {
      release.body.push(line);
    } else if (group) {
      group.intro.push(line);
    } else if (!/^# /.test(line)) {
      intro.push(line);
    }
  }
  if (!title) throw new Error('CHANGELOG.md: missing "# " title');
  const ids = new Set();
  for (const r of groups.flatMap((g) => g.releases)) {
    if (ids.has(r.id)) throw new Error(`CHANGELOG.md: two releases use {#${r.id}}`);
    ids.add(r.id);
    r.date = findDate(r.name) || findDate(r.meta);
    if (!r.date) throw new Error(`CHANGELOG.md: "${r.name}" names no date, like "November 7, 2026"`);
    r.html = markdown(r.body.join('\n'), `${r.id}-`).html;
  }
  return { title, intro: markdown(intro.join('\n')).html, groups, ids };
}

const withTime = (html, date) =>
  html.replace(date.text, `<time datetime="${date.iso}">${date.text}</time>`);

const indent = (html, pad) =>
  html
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n');

function changelogPage() {
  const { title, intro, groups } = parseChangelog();
  const latest = groups.flatMap((g) => g.releases).sort((a, b) => b.date.iso.localeCompare(a.date.iso))[0];
  const relative = (html) => html.replace(/(href)="https:\/\/lumaemusic\.app\//g, '$1="../');
  const toc = groups
    .map(
      (g) => `                <li>
                  <a href="#${g.id}">${inline(g.name)}</a>
                  <ol role="list">
${g.releases.map((r) => `                    <li><a href="#${r.id}">${inline(r.name)}</a></li>`).join('\n')}
                  </ol>
                </li>`,
    )
    .join('\n');
  const body = groups
    .map((g) => {
      const releases = g.releases
        .map((r) => {
          const name = withTime(inline(r.name), r.date);
          const meta = r.meta ? withTime(inline(r.meta), r.date) : '';
          return `<section class="change" aria-labelledby="${r.id}">
  <header class="change-head">
    <h3 id="${r.id}">${name}</h3>${meta ? `\n    <p class="change-meta">${meta}</p>` : ''}
  </header>
${indent(r.html, '  ')}
</section>`;
        })
        .join('\n');
      const groupIntro = markdown(g.intro.join('\n'), `${g.id}-`).html;
      return `<h2 id="${g.id}">${inline(g.name)}</h2>${groupIntro ? `\n${groupIntro}` : ''}\n${releases}`;
    })
    .join('\n');
  const main = `      <section class="section section--doc">
        <header class="wrap doc-head">
          <p class="kicker">Changelog</p>
          <h1>${inline(title)}</h1>
          <p class="doc-meta">Updated ${latest.date.text} · <a href="feed.xml">Atom feed</a></p>
        </header>
        <div class="wrap doc">
          <nav class="doc-toc doc-toc--nested" data-toc aria-label="On this page">
            <details open>
              <summary>On this page</summary>
              <ol role="list">
${toc}
              </ol>
            </details>
          </nav>
          <article class="prose changelog">
${indent(relative(intro), '            ')}
${indent(relative(body), '            ')}
            <p class="doc-source">
              This page is generated from
              <a href="https://github.com/rendyhd/lumae/blob/main/CHANGELOG.md">CHANGELOG.md on GitHub</a>. Follow it in a feed
              reader with the <a href="feed.xml">Atom feed</a>.
            </p>
          </article>
        </div>
      </section>`;
  return (
    head({
      prefix: '../',
      title: 'What’s new · Lumae',
      description:
        'What changed in each Lumae beta build and update for Android and iPhone, and in each Lumae Radio release.',
      path: '/changelog/',
      feed: 'What’s new in Lumae',
    }) + shell({ prefix: '../', main, bodyClass: 'page-doc' })
  );
}

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function changelogFeed() {
  const { title, groups } = parseChangelog();
  const releases = groups
    .flatMap((g) => g.releases)
    .sort((a, b) => b.date.iso.localeCompare(a.date.iso));
  const page = `${SITE}/changelog/`;
  const entries = releases
    .map((r) => {
      const content = (r.meta ? `<p>${inline(r.meta)}</p>\n` : '') + r.html;
      return `  <entry>
    <title>${escapeXml(`${r.group.name} · ${r.name}`)}</title>
    <id>${page}#${r.id}</id>
    <link rel="alternate" type="text/html" href="${page}#${r.id}" />
    <updated>${r.date.iso}T00:00:00Z</updated>
    <content type="html">${escapeXml(content)}</content>
  </entry>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title.replace(/'/g, '’'))}</title>
  <subtitle>Lumae beta builds and updates, and Lumae Radio releases.</subtitle>
  <id>${page}</id>
  <link rel="self" type="application/atom+xml" href="${page}feed.xml" />
  <link rel="alternate" type="text/html" href="${page}" />
  <updated>${releases[0].date.iso}T00:00:00Z</updated>
  <author><name>Lumae</name></author>
  <icon>${SITE}/assets/img/brand/favicon-32.png</icon>
${entries}
</feed>
`;
}

function notFoundPage() {
  const main = `      <section class="section section--lost">
        <div class="wrap lost">
          <img class="lost-mark only-dark" src="/assets/img/brand/mark.svg" alt="" width="96" height="96" />
          <img class="lost-mark only-light" src="/assets/img/brand/mark-light.svg" alt="" width="96" height="96" />
          <p class="kicker">404</p>
          <h1 class="h2">This page drifted off.</h1>
          <p class="lead">Nothing plays at this address. Try one of these instead.</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="/">Lumae Music</a>
            <a class="btn btn--ghost" href="/radio/">Lumae Radio</a>
            <a class="btn btn--ghost" href="/privacy/">Privacy</a>
          </div>
        </div>
      </section>`;
  return (
    head({
      prefix: '/',
      title: 'Page not found · Lumae',
      description: 'This page does not exist on lumaemusic.app.',
      robots: 'noindex',
    }) + shell({ prefix: '/', main })
  );
}

/* ---------- Run ---------- */

const source = readFileSync(join(DOCS, 'index.html'), 'utf8');
const pages = [
  { file: 'radio/index.html', prefix: '../', current: 'radio' },
  { file: 'radio/docs/index.html', prefix: '../../', current: 'radio' },
  { file: 'guide/index.html', prefix: '../', current: 'guide' },
  { file: 'guide/undertone/index.html', prefix: '../../', current: 'guide' },
  { file: 'beta/index.html', prefix: '../', current: null },
  { file: 'privacy/index.html', prefix: '../', current: null, render: privacyPage },
  { file: 'changelog/index.html', prefix: '../', current: 'changelog', render: changelogPage },
  { file: 'changelog/feed.xml', render: changelogFeed, raw: true },
  { file: '404.html', prefix: '/', current: null, render: notFoundPage },
];

let stale = 0;
for (const page of pages) {
  const path = join(DOCS, page.file);
  const base = page.render ? page.render() : readFileSync(path, 'utf8');
  const next = page.raw ? base : withSharedBlocks(base, page.file, page, source);
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (current === next) continue;
  if (check) {
    console.error(`out of date: docs/${page.file}`);
    stale++;
    continue;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, next);
  console.log(`wrote ${relative(REPO, path)}`);
}
if (check && stale) {
  console.error('Run: node tools/build-site.mjs');
  process.exit(1);
}
if (check) console.log('site pages are up to date');
