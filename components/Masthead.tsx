"use client";

import { useEffect, useRef, useState } from "react";
import {
  contacts,
  masthead,
  menu,
  profile,
  site,
  stamps,
  worksCard,
  type Stamp as StampData,
} from "@/lib/content";
import Stamp from "@/components/Stamp";
import { useDrag, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The masthead. Information is pinned to the corners the way a printed cover
 * sets it: who, what, where on the left, the standing copy on the right, the
 * claim low and large, and the work card cropped by the right edge so it reads
 * as the start of a second page.
 *
 * Between all of it, the stamps. They drift on their own, lag the cursor by
 * different amounts so the pile has depth, and can be picked up and thrown.
 */
export default function Masthead() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const canDrag = useMediaQuery("(pointer: fine)");
  const compact = useMediaQuery("(max-width: 760px)");

  /* Parallax. One listener writing two custom properties, rather than a state
     update per stamp per frame. */
  useEffect(() => {
    if (reduced || !canDrag) return;
    const el = stageRef.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--px", `${nx * 34}`);
        el.style.setProperty("--py", `${ny * 26}`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced, canDrag]);

  return (
    <section className="masthead" id="top">
      <div className="mast-top">
        <div className="mast-id">
          <span className="mono">+ {site.name}</span>
          <span className="role">{site.role}</span>
        </div>

        <div className="mast-menu">
          <span className="label">Menu</span>
          <ul>
            {menu.map((item, i) => (
              <li key={item.href}>
                <a href={item.href} data-current={i === 0}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mast-links">
            <span className="label">Contact</span>
            <ul>
              {contacts.map((c) => (
                <li key={c.label}>
                  <a href={c.href} data-pending={c.pending}>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mast-note">
          <span className="label">{profile.label}</span>
          {profile.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="mast-note">
          <span className="label">{profile.noteLabel}</span>
          <p>{profile.note}</p>
        </div>
      </div>

      <div className="stage" ref={stageRef} aria-hidden="true">
        {stamps.map((stamp, i) => (
          <FloatingStamp
            key={stamp.id}
            stamp={stamp}
            order={i}
            draggable={canDrag}
            still={reduced}
            compact={compact}
          />
        ))}
      </div>

      <div className="mast-bottom">
        <h1 className="claim">
          <span>
            {masthead.lineOne.before}
            <em>{masthead.lineOne.italic}</em>
            {masthead.lineOne.after}
          </span>
          <span>{masthead.lineTwo}</span>
        </h1>

        <span className="scroll-cue">
          Scroll <i>↓</i> for work
        </span>

        <div className="works-card">
          <div className="card-top">
            <a href="#work">{worksCard.cta} →</a>
          </div>
          <h2 className="serif">{worksCard.title}</h2>
          <p>{worksCard.note}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * One stamp in the pile. Three transforms stack, each on its own element, so
 * they never fight: the wrapper carries drag and parallax, the inner element
 * carries the rotation and the drift.
 */
function FloatingStamp({
  stamp,
  order,
  draggable,
  still,
  compact,
}: {
  stamp: StampData;
  order: number;
  draggable: boolean;
  still: boolean;
  compact: boolean;
}) {
  const { pos, dragging, handlers } = useDrag({ x: 0, y: 0 }, { enabled: draggable });
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    if (dragging) setLifted(true);
  }, [dragging]);

  const parallax = still
    ? "translate3d(0, 0, 0)"
    : `translate3d(calc(var(--px, 0) * ${stamp.depth} * 1px), calc(var(--py, 0) * ${stamp.depth} * 1px), 0)`;

  return (
    <div
      className="stamp-wrap"
      style={{
        /* The phone stage is a fraction of the width and half the height, so
           the drift is pulled in rather than letting stamps fall off the edge. */
        left: `${compact ? 2 + stamp.x * 0.62 : stamp.x}%`,
        top: `${compact ? 2 + stamp.y * 0.62 : stamp.y}%`,
        width: `min(${stamp.w}px, 30vw)`,
        zIndex: lifted ? 30 : order + 1,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) ${parallax}`,
      }}
      {...handlers}
    >
      <div
        className="stamp-float"
        style={{
          ["--rot" as string]: `${stamp.rotate}deg`,
          ["--sway" as string]: `${order % 2 === 0 ? 2.2 : -2.6}deg`,
          ["--dur" as string]: `${7 + order * 1.3}s`,
          ["--delay" as string]: `${order * 0.45}s`,
        }}
      >
        <Stamp stamp={stamp} dragging={dragging} sharp={dragging} />
      </div>
    </div>
  );
}
