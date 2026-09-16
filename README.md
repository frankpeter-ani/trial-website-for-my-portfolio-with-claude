# Frankpeter portfolio

Next.js build of the content brief, section by section. Everything the brief
specified as content and behaviour is implemented; everything it listed as
outstanding is a visible placeholder rather than an invented fact.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## Where the words live

`lib/content.ts` is the only file you need to touch to fill the site in. Every
string on the page comes from it. Anything wrapped in `TODO(...)` renders as a
marked placeholder in the browser, so a gap is obvious rather than quietly
reading as a finished claim.

Two rules from the brief hold throughout: no dashes and no hyphens in any copy,
and never a metric that was not supplied.

## Page order

Work sits directly under the hero. Everything after the work panels scrolls
normally.

| | Section | Behaviour |
|---|---|---|
| 01 | Hero | Static, one draggable object, ambient cursor drifter |
| 02 | My Works | Scroll snapped panels, colour per project, sound |
| 03 | Case studies | Separate routes at `/work/[slug]` |
| 04 | My Playground | Pannable, zoomable canvas |
| 05 | About Me | Desktop metaphor plus credentials |
| 06 | Experience | Four column table |
| 07 | Tools I use | Marquee row |
| 08 | Ask me anything | Overlay, reachable from every page |
| 09 | Contact | Footer |

## Decisions taken during the build

* **Hero copy.** Headline and subline are the positioning line you chose, set
  with the reference 2 type behaviour: the first clause in full ink, the
  remainder dropped to grey.
* **Location.** London Area, UK, everywhere it appears: the status card, the
  about snapshot, the footer and the page metadata.
* **Snapping.** Scoped to the work panels only, using `scroll-snap-align` with
  `proximity` on the document, and switched off below 900px, on coarse pointers
  and under reduced motion. Everything below the last project scrolls normally.
* **Sound.** One swoosh synthesised in the Web Audio API, pitched per panel,
  tied to the wipe rather than to scroll position. Muted by default, the choice
  is remembered in local storage, nothing plays before the visitor has
  interacted, and it stays silent under reduced motion.
* **Drag physics.** One hook (`useDrag`) powers the hero object, the playground
  chips and the pinned photos, so the three sections rhyme as the brief asked.
* **Ask me anything.** Wired to a local answer bank in `lib/ama-answers.ts` so
  it works with no backend. It refuses to guess: anything outside the bank gets
  a plain "not written down yet" plus the email. Swap that one function for a
  model call and keep the same rule.
* **Touch.** Dragging is not attempted on phones. The playground becomes a
  scrollable scattered layout and the pinned photos sit still, exactly as the
  brief specified.

## Still outstanding

These are the brief's own open items. Each one is a marked slot in the code.

1. **Which projects go in the work panels.** Five panels are scaffolded from the
   companies on the CV. Replace the slugs, headlines, colours and media kinds in
   `projects`.
2. **Per project:** what was broken, what constrained you, what you decided and
   what you gave up, what happened.
3. **The CV conflicts.** The two Tempo roles overlap by two months, and the
   Linum project count is 25 on the CV against 35 in conversation. Both slots
   are empty until they are settled.
4. **Email address.** `site.email` is a placeholder. It powers the copy
   shortcut, the footer and the chatbot fallback, so it is one edit in one
   place.
5. **Domain, Dribbble and Contra links** for the footer.
6. **Real media.** Every panel, case study and playground tile is a placeholder
   shape sized to the real thing.
7. **Portrait.** The hero holds a dithered field that reacts to the cursor.
   Drop the real image behind it when you have one.

## Keyboard

* `E` copies the email from anywhere on the page.
* `Escape` closes the ask me anything overlay.
* `Enter` sends a question.
