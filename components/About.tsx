"use client";

import { about, site } from "@/lib/content";
import { useCopyEmail, useDrag, useMediaQuery } from "@/lib/hooks";
import Pending from "./Pending";

/**
 * Two references solving different halves: the desktop metaphor carries the
 * human side, the credentials layout carries the contact links and the bio.
 * The pinned objects use the same physics as the hero object, so the two
 * sections rhyme.
 */
export default function About() {
  const isPhone = useMediaQuery("(max-width: 760px)");
  const { copied, copy } = useCopyEmail(site.email);

  return (
    <section className="section shell" id="about" aria-label="About Me">
      <div className="section-head">
        <span className="section-num">05</span>
        <h2>About Me</h2>
      </div>

      <div className="about-grid">
        <div className="desktop">
          <span className="kicker desk-label"><span aria-hidden="true">🗂</span> Pinned on Desktop</span>
          {about.pinned.map((item) => (
            <PinnedItem key={item.id} item={item} still={isPhone} />
          ))}
        </div>

        <div className="bio">
          <ul className="link-stack">
            <li>
              <button className="btn ghost" type="button" onClick={() => void copy()} style={{ padding: "8px 14px" }}>
                {copied ? "Copied" : site.email}
              </button>
            </li>
            {site.links.filter((l) => l.label !== "Email").map((l) => (
              <li key={l.label}>
                <a href={l.href}>
                  {l.label} {l.pending ? <span className="pending">link pending</span> : null}
                </a>
              </li>
            ))}
          </ul>

          {about.paragraphs.map((text, i) => (
            <p key={i} style={{ color: "var(--ink-2)" }}><Pending text={text} /></p>
          ))}

          <ul className="snapshot">
            {about.snapshot.map((s) => (
              <li key={s.label}>
                <b>{s.label}</b>
                <Pending text={s.value} />
              </li>
            ))}
          </ul>

          <ul className="path">
            {about.path.map((p) => (
              <li key={p.step}>
                <span className="step">{p.step}</span>
                <span><Pending text={p.text} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PinnedItem({ item, still }: { item: (typeof about.pinned)[number]; still: boolean }) {
  const { pos, dragging, handlers } = useDrag({ x: 0, y: 0 }, { enabled: !still });
  return (
    <div
      className="pin"
      data-dragging={dragging}
      style={
        still
          ? undefined
          : {
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${item.rotate}deg)`,
            }
      }
      {...(still ? {} : handlers)}
    >
      <div className="thumb" />
      <b><Pending text={item.title} /></b>
      <small><Pending text={item.note} /></small>
    </div>
  );
}
