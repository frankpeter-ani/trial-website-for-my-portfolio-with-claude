# FRANCO® design system

Measured off the rendered snapshot in this folder at 1440, 1280, 1000 and
390px, using computed styles rather than read off the source. Everything below
is what the browser actually resolved, so it can be copied into CSS directly.

Source: `franco-template.framer.website`, template by Ariel / BYQ Supply.

## Colour

Five colours carry the whole site. There is no accent hue and no gradient.

| Token | Value | Use |
|---|---|---|
| Ink | `#16231B` | Dark sections, body text on cream, dark buttons |
| Cream | `#F9F5EB` | Page background, text on ink |
| Sand | `#ECE7D9` | Card fill on cream, the one step between the two |
| Ink 60 / 40 / 16 / 0 | `#16231B` at `99`, `66`, `29`, `00` | Muted text, hairlines, overlays, gradient stops |
| Cream 50 | `rgba(249,245,235,.5)` | Footer column labels, fine print on ink |
| White 16 | `rgba(255,255,255,.16)` | Transparent button and card fill on photography |

Two rules hold across every section: text is Ink on Cream or Cream on Ink,
never a third combination, and any card sitting on Cream is Sand.

## Type

Four families, each with one job.

| Family | Role |
|---|---|
| **Instrument Serif** 400 | Every section heading. The whole voice of the template. |
| **Inter** 400/500 | Body, nav, buttons, card copy. |
| **DM Mono** 500 | Eyebrows and labels, always uppercase, always `0.24px` tracked. |
| **Host Grotesk** 700 | The FRANCO wordmark only. Nothing else uses it. |

Scale at 1440px, with the responsive steps:

| Role | Family | 1440 | ≤1199 | ≤809 | Tracking |
|---|---|---|---|---|---|
| Wordmark | Host Grotesk 700 | 321px / 268px, uppercase | fluid | fluid | `+6.4px` |
| Display | Instrument Serif 400 | 88px / 88px | 64px | 56px | `-1.76px` |
| Section heading | Instrument Serif 400 | 56px / 56px | 46px | 36px | `-1.12px` |
| Lead | Inter 400 | 24px / 28px | 24px | 20px | `-0.72px` |
| Body large | Inter 400 | 20px / 28px | 20px | 18px | `-0.6px` |
| Body | Inter 400 | 16px / 24px | 16px | 16px | `normal` |
| Button / caption | Inter 500 | 14px / 20px | 14px | 14px | `-0.14px` |
| Eyebrow | DM Mono 500 | 12px / 16px, uppercase | 12px | 12px | `+0.24px` |

Two habits worth copying. Headings are set solid, line-height equal to font
size, with negative tracking that grows with the size. Everything below 20px
runs at default or positive tracking instead. The serif never appears below
36px and the mono never appears above 12px, so the two ends of the scale stay
unmistakable.

## Layout

| | Value |
|---|---|
| Page max width | 1440px, content column 1376px |
| Gutter | 32px desktop, 20px at ≤1199 |
| Section padding | 120px top and bottom, 80px at ≤1199 |
| Narrow measure | 704–760px for centred paragraphs |
| Breakpoints | ≥1440, 1200–1439, 810–1199, 0–809 |
| Nav height | 64px, flush cream, hairline under |

Sections are separated by their own padding, not by rules or spacers. The one
structural motif is a full-bleed colour flip: a Cream section followed by an
Ink one, which is how the page gets its rhythm without any dividers.

## Components

**Button Dark Small** — 32px high, padding `6px 12px`, radius 8px, fill Ink,
text Cream Inter 14/500. The nav CTA.

**Button Light** — 40px high, padding `8px 16px`, radius 8px, fill Cream, text
Ink Inter 16/400. Primary CTA on ink or photography.

**Button Transparent** — 40px high, padding `8px 16px`, radius 8px, fill
`rgba(255,255,255,.16)`, text Cream Inter 16/400. Always the secondary, always
next to a light button.

**Chip** — 24px high, padding `4px 16px`, radius 24px so it reads as a full
pill, transparent fill with a 1px inset ring. Holds the DM Mono eyebrow. Light
and Dark variants differ only in ring and text colour. Every section opens with
one.

**Card** — radius 8px, fill Sand on cream sections or Ink on light ones, no
border, no shadow. Testimonial cards run 439x589. Media inside a card gets the
same 8px radius; only the video overlay card uses 24px.

Radii are just two values, 8px for everything rectangular and 24px for pills.
There is one shadow in the entire template, on the floating video card, and it
is a three-layer soft drop rather than a single blur.

## Section pattern

Every section on the homepage is built the same way, which is what makes the
template easy to extend:

```
chip (DM Mono eyebrow)
  ↓ 
heading (Instrument Serif, 2 to 5 words per line, set solid)
  ↓
lead paragraph (Inter 24px, capped around 700px)
  ↓
content (cards, tabs, marquee, or media)
```

Homepage order, with measured heights at 1440:

| Section | Height | Background |
|---|---|---|
| Hero, wordmark over full-bleed photo | 900px | Cream over image |
| Services, `TRUSTED BY INDUSTRY LEADERS` | 912px | Cream |
| Features, tabbed | — | Ink |
| Testimonials, `SUCCESS STORIES` | 1133px | Cream, Sand and Ink cards |
| Stories, `Intuitive design ensures your message is clear` | 1010px | Cream |
| Blog, `JOURNAL` | 1113px | Cream |
| CTA, `GET STARTED TODAY` | — | Ink |
| Footer, four column sitemap plus newsletter | — | Ink |

## What this snapshot cannot tell you

The JavaScript never shipped with the export, so anything driven by it is
invisible here: the tab switching in the features section, the logo marquee,
the testimonial carousel, scroll reveal animation, video playback, and the
mobile nav, which overflows offline instead of collapsing to a menu. Static
layout, colour, type and spacing are all trustworthy. Motion is not documented
because it could not be observed.
