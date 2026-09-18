# FRANCO® Framer template (reference snapshot)

A static export of `franco-template.framer.website`, unzipped here as design
reference only. Nothing in this folder is part of the Next.js build: it is not
imported, not routed, and not included in `npm run build`.

## Viewing it

```bash
cd reference/franco-template
python3 -m http.server 8100
# http://127.0.0.1:8100/index.html
```

## What was changed after unzipping

The export still pointed at `framerusercontent.com` and `fonts.gstatic.com` for
every image and font, so it rendered grey and unstyled offline. Two mechanical
edits fixed that:

1. The 55 font files shipped as `*.woff2.bin` were renamed to `*.woff2`.
2. Asset URLs in `index.html` and `scripts/` were rewritten to the copies that
   shipped in `images/`: 76 of them now resolve locally.

## What is still missing

* **The JavaScript chunks.** `index.html` asks for about a dozen modules under
  `scripts/` that the zip never contained. The page is server rendered markup,
  so it reads correctly, but hydration never runs: no scroll animation, no
  marquee motion, no carousel, no video playback.
* **Seven images** are referenced but absent from the zip, among them the hero
  video poster and the open graph image.

Both gaps need the original CDN, which is unreachable from this environment.
