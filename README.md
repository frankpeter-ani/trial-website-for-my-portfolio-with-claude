# Frankpeter portfolio

Next.js build of the portfolio. The current design is the paper edition: a
printed masthead for a hero, with the rest of the page inheriting its grid.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
STATIC_EXPORT=1 npm run build   # plain files in out/ for a preview host
```

## Where the words live

`lib/content.ts` is the only file you need to touch to fill the site in. Every
string on the page comes from it, the stamps included. Anything wrapped in
`TODO(...)` renders as a marked placeholder in the browser, so a gap is obvious
rather than quietly reading as a finished claim.

Two rules hold throughout: no dashes and no hyphens in any copy, and never a
metric that was not supplied.

## The masthead

The hero is set like a printed cover.

* **Corners carry the information.** Name and discipline top left, menu and
  contact under it, the standing profile copy and a dated note top right.
* **The claim sits low left**, large, with one word in italic serif so it reads
  in two beats.
* **The works card is cropped by the right edge**, so it reads as the start of
  a second page rather than a button.
* **A drift of postage stamps floats through the middle.** One per thing on the
  CV. Each one is drawn in CSS: the perforated edge is a four way mask, the
  shadow is a drop shadow filter on the wrapper so the mask does not clip it,
  and the art is a gradient or a letterform sized to the real thing. Drop a
  photograph in behind any of them and nothing moves.

Three transforms stack on separate elements so they never fight: the wrapper
carries the drag offset and the cursor parallax, the inner element carries the
rotation and the drift. Depth per stamp decides how far it lags the cursor, and
the ones behind are blurred until you touch them.

On a phone the masthead stops being a cover and becomes a sequence: who, the
claim, the stamps, then the standing copy. Dragging is not attempted on touch.

## Page order

| | Section | Behaviour |
|---|---|---|
| | Masthead | Draggable stamps, cursor parallax, ambient drift |
| 01 | Work | Ruled index, one line per project, stamp preview follows the cursor |
| 02 | Craft | Pannable, zoomable canvas |
| 03 | About | Copy, facts, the CV as four columns, tools as a marquee |
| 04 | Contact | Press to copy address and the small print |

Case studies live at `/work/[slug]`. The thin top bar appears once the masthead
has scrolled away, and is there from the start on every other route.

## Decisions taken during the build

* **Type.** Instrument Serif for anything said out loud, Inter for anything
  explained, JetBrains Mono for the labels holding the grid together.
* **Surface.** One warm paper with a fine grain and a soft vignette, both fixed
  behind the content and neither interactive.
* **Sound.** The scroll snapped work panels are gone, and the swoosh that was
  tied to them with them. `usePanelSound` is still in `lib/hooks.ts` if a future
  section wants it.
* **Drag physics.** One hook (`useDrag`) powers the stamps and the craft chips,
  so the two piles rhyme.
* **Ask me anything.** Unchanged in behaviour, restyled onto the paper. It still
  refuses to guess: anything outside `lib/ama-answers.ts` gets a plain "not
  written down yet" plus the email.
* **Reduced motion.** Drift, marquee, the scroll cue and the typing caret all
  stop, and transitions collapse.

## Still outstanding

These are the brief's own open items. Each one is a marked slot in the code.

1. **Per project:** what was broken, what constrained you, what you decided and
   what you gave up, what happened.
2. **The CV conflicts.** The two Tempo roles overlap by two months, and the
   Linum project count is 25 on the CV against 35 in conversation. Both slots
   are empty until they are settled.
3. **Email address.** `site.email` is a placeholder. It powers the copy
   shortcut, the footer and the chatbot fallback, so it is one edit in one
   place.
4. **Domain and the three social links** in `contacts`.
5. **Real media.** Every stamp, case study and craft tile is a placeholder shape
   sized to the real thing.
6. **About copy.** Two paragraphs, the three step path and two of the facts.

## Keyboard

* `E` copies the email from anywhere on the page.
* `Escape` closes the ask me anything overlay.
* `Enter` sends a question.
