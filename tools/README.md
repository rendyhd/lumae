# lumaemusic.app

The website is the `docs/` folder: plain HTML, one stylesheet, one small script,
self-hosted fonts and images. There is no build step to publish it and it loads
nothing from other sites.

| Page | File |
| --- | --- |
| Lumae Music | `docs/index.html` |
| Lumae Radio | `docs/radio/index.html` |
| Privacy | `docs/privacy/index.html`, built from `PRIVACY.md` |
| Not found | `docs/404.html`, built |

## Preview

```sh
node tools/serve.mjs
```

Then open http://127.0.0.1:8095/. It serves `docs/` the way GitHub Pages does.

## After editing

- **The header or footer:** edit them in `docs/index.html` only, between the
  `site-header` and `site-footer` markers, then run `node tools/build-site.mjs`
  to copy them into the other pages.
- **The privacy policy:** edit `PRIVACY.md`, then run
  `node tools/build-site.mjs`.
- **Before publishing:** run `node tools/check-site.mjs`. It checks every link,
  image, font and `#anchor`, alt text, ids, and that nothing loads from another
  site. The app repository's tests run both scripts.

Screenshots in `docs/assets/img/screens/` come from the app's design harness
with made-up music. To replace one, keep the name and size (780×1688 WebP).
`docs/assets/img/og/` holds the 1200×630 images shown when a page is shared.

## Publish with GitHub Pages

1. In this repository on GitHub: **Settings → Pages → Build and deployment →
   Deploy from a branch**, branch `main`, folder `/docs`.
2. `docs/CNAME` already holds `lumaemusic.app`. At your domain registrar, point
   the apex domain at GitHub Pages with four `A` records (`185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and, for IPv6, four
   `AAAA` records (`2606:50c0:8000::153` to `2606:50c0:8003::153`). Optionally
   add `www` as a `CNAME` to `rendyhd.github.io`.
3. Verify the domain under your GitHub account's **Settings → Pages**, then tick
   **Enforce HTTPS** once the certificate is issued.

The privacy policy's "This website" section says the site is hosted on GitHub
Pages. If you host it elsewhere, update that sentence.
