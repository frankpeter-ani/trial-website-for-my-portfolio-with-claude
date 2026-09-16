"use client";

import { useEffect, useRef, useState } from "react";
import { hero, site } from "@/lib/content";
import { useCopyEmail, useDrag, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Composition from the augen reference: navigation floating at the top,
 * headline low left, image large on the right. Type behaviour from reference
 * 2: first clause in full ink, remainder grey. One graphic object from
 * reference 1, and only one, carrying the status line.
 */
export default function Hero() {
  const { pos, dragging, handlers } = useDrag({ x: 0, y: 0 });
  const { copied, copy } = useCopyEmail(site.email);
  const shotRef = useRef<HTMLDivElement>(null);
  const [dither, setDither] = useState({ dot: 6, opacity: 0.5 });
  const reduced = usePrefersReducedMotion();
  const hasKeyboard = useMediaQuery("(pointer: fine)");

  /* The portrait treatment reacts to the cursor: dither density shifting as
     the pointer passes over it. */
  useEffect(() => {
    if (reduced) return;
    const el = shotRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      const inside = nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1;
      setDither(inside ? { dot: 3.4 + nx * 5, opacity: 0.22 + ny * 0.42 } : { dot: 6, opacity: 0.5 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1 className="rise rise-1">
            <span className="lead">{hero.headlineLead} </span>
            <span className="rest">{hero.headlineRest}</span>
          </h1>
          <p className="subline rise rise-1">{hero.subline}</p>

          <div className="hero-actions rise rise-2">
            <a
              className="btn"
              href={hero.primaryCta.target}
              onClick={(e) => {
                /* The work button scrolls, it does not navigate. */
                e.preventDefault();
                document.querySelector(hero.primaryCta.target)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
              }}
            >
              {hero.primaryCta.label}
            </a>
            <a className="btn ghost" href={hero.secondaryCta.target}>{hero.secondaryCta.label}</a>
            <button className="btn ghost" type="button" onClick={() => void copy()}>
              {copied ? "Copied" : hasKeyboard ? "Press E to copy email" : "Copy email"}
            </button>
          </div>
        </div>

        <div className="hero-shot rise rise-2" ref={shotRef}>
          <div
            className="dither"
            style={{ ["--dot" as string]: `${dither.dot}px`, ["--dither-opacity" as string]: dither.opacity }}
          />
          <span className="kicker shot-label">Portrait, dithered. Image pending.</span>
        </div>
      </div>

      {/* The one graphic object. Draggable, with a little weight to it. */}
      <div
        className="card-object rise rise-3"
        data-dragging={dragging}
        style={{ right: "clamp(16px, 6vw, 84px)", bottom: "clamp(84px, 14vh, 150px)", transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(-3deg)` }}
        {...handlers}
      >
        <span className="status-where"><span className="status-dot" />{site.status}</span>
        <span className="status-line">{site.location}</span>
        <span className="doodle">{"  o\n /|\\  drag me\n / \\"}</span>
      </div>
    </section>
  );
}
