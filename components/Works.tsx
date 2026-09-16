"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/lib/content";
import { usePanelSound, usePrefersReducedMotion } from "@/lib/hooks";
import PanelMedia from "./PanelMedia";
import Pending from "./Pending";

/**
 * The section the whole site is built around.
 *
 * One full viewport panel per project. Each panel owns a background colour and
 * the whole page changes colour as you move through the work. The left column
 * stays exactly where it is and only its content swaps; the right side changes
 * format every time. The snapping stops after the last project.
 */
export default function Works() {
  const [active, setActive] = useState(0);
  const [sliver, setSliver] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { muted, toggle, swoosh } = usePanelSound();
  const reduced = usePrefersReducedMotion();
  const lastActive = useRef(0);

  /* Which panel is centred. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = panels.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { threshold: 0.55 },
    );
    panels.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Is the work section holding the viewport. A five panel section is five
     screens tall, so an intersection ratio never gets near one: ask whether the
     section covers the middle of the screen instead. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      setInView(r.top <= middle && r.bottom >= middle);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Sound is tied to the wipe, so it fires once per panel and never stutters.
     The outgoing colour survives as a sliver for a beat afterwards. */
  useEffect(() => {
    if (active === lastActive.current) return;
    const previous = lastActive.current;
    lastActive.current = active;
    swoosh(active);
    setSliver(projects[previous].color);
    const t = window.setTimeout(() => setSliver(null), 900);
    return () => window.clearTimeout(t);
  }, [active, swoosh]);

  /* The nav flips colour to stay readable against whatever is behind it. */
  useEffect(() => {
    const root = document.documentElement;
    const keys = ["--nav-ink", "--nav-bg", "--nav-line", "--nav-hover", "--panel-ink"];
    if (!inView) {
      keys.forEach((k) => root.style.removeProperty(k));
      return;
    }
    const p = projects[active];
    root.style.setProperty("--nav-ink", p.ink);
    root.style.setProperty("--nav-bg", "rgba(255,255,255,0.08)");
    root.style.setProperty("--nav-line", "rgba(255,255,255,0.22)");
    root.style.setProperty("--nav-hover", "rgba(255,255,255,0.14)");
    root.style.setProperty("--panel-ink", p.ink);
    return () => keys.forEach((k) => root.style.removeProperty(k));
  }, [active, inView]);

  /* Thin progress bar along the very top, measuring the work section. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      setProgress(Math.min(1, Math.max(0, -r.top / span)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    panels.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const current = projects[active];

  return (
    <>
      {inView ? (
        <>
          <div className="progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="dot-index" data-visible="true" role="tablist" aria-label="Work panels">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-label={p.headline.join(" ")}
                aria-selected={i === active}
                data-on={i === active}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <span className="section-counter" data-visible="true">
            {String(active + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
          </span>
          <button
            className="sound-toggle"
            type="button"
            onClick={toggle}
            aria-pressed={!muted}
            aria-label={muted ? "Turn panel sound on" : "Turn panel sound off"}
            title={muted ? "Sound off" : "Sound on"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </>
      ) : null}

      <section
        className="works"
        id="works"
        ref={sectionRef}
        style={{ ["--panel-color" as string]: current.color }}
        aria-label="My Works"
      >
        {projects.map((p, i) => {
          const showSliver = i === active && sliver !== null;
          return (
            <article
              key={p.slug}
              className="panel"
              ref={(el) => { panels.current[i] = el; }}
              data-active={i === active}
              data-leaving={showSliver}
              style={{
                ["--panel-own" as string]: p.color,
                ["--panel-ink" as string]: p.ink,
                ["--panel-soft" as string]: p.inkSoft,
                ["--sliver" as string]: sliver ?? "transparent",
                color: p.ink,
              }}
            >
              <div className="panel-ground" aria-hidden="true" />
              <div className="panel-sliver" aria-hidden="true" />
              <Shapes seed={i} />

              <div className="shell panel-grid">
                <div className="panel-left">
                  <span className="kicker">{p.index} / {p.discipline}</span>
                  <h3>
                    {p.headline.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p><Pending text={p.summary} /></p>
                  <ul className="pill-row">
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <a className="panel-link" href={`/work/${p.slug}/`}>
                    Read the case study <span aria-hidden="true">→</span>
                  </a>
                </div>
                <PanelMedia project={p} position={i + 1} total={projects.length} />
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

/** Loose geometric shapes drifting behind the type, coloured from the panel. */
function Shapes({ seed }: { seed: number }) {
  const specs = [
    { cls: "circle", size: 180, left: 6, top: 14, dur: 26 },
    { cls: "ring", size: 120, left: 78, top: 8, dur: 34 },
    { cls: "square", size: 76, left: 44, top: 74, dur: 30 },
    { cls: "circle", size: 54, left: 88, top: 62, dur: 22 },
    { cls: "ring", size: 210, left: 26, top: 58, dur: 40 },
  ];
  return (
    <div className="shapes" aria-hidden="true">
      {specs.map((s, i) => (
        <span
          key={`${s.cls}-${i}`}
          className={`shape ${s.cls}`}
          style={{
            width: s.size,
            height: s.size,
            left: `${(s.left + seed * 7) % 92}%`,
            top: `${s.top}%`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${-i * 4}s`,
          }}
        />
      ))}
    </div>
  );
}
