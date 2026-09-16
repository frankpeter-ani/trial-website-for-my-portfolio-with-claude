"use client";

import { useCallback, useRef, useState } from "react";

type Kind = "scrub" | "compare" | "expand" | "pins";

/**
 * Two or three of these per case study, never more. Each one hands the visitor
 * the playhead rather than autoplaying at them.
 */
export default function CaseMoment({ kind, accent }: { kind: Kind; accent: string }) {
  if (kind === "scrub") return <Scrub accent={accent} />;
  if (kind === "compare") return <Compare />;
  if (kind === "pins") return <Pins accent={accent} />;
  return <Expand accent={accent} />;
}

/** Hover to scrub a clip, so the visitor controls the playhead. */
function Scrub({ accent }: { accent: string }) {
  const [t, setT] = useState(0.3);
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  }, []);
  return (
    <div className="moment">
      <div className="moment-head"><span>Hover to scrub</span><span>Clip pending</span></div>
      <div className="moment-stage" onPointerMove={onMove}>
        <div className="scrub-fill" style={{ transform: `scaleX(${t})`, background: accent, opacity: 0.35 }} />
        <span className="scrub-read">{(t * 12).toFixed(1)}s</span>
      </div>
    </div>
  );
}

/** Drag to compare before and after on a single screen. */
function Compare() {
  const [x, setX] = useState(0.5);
  const stage = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    setX(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  }, []);
  return (
    <div className="moment">
      <div className="moment-head"><span>Drag to compare</span><span>Before and after</span></div>
      <div className="moment-stage" ref={stage} onPointerMove={onMove} onPointerDown={onMove}>
        <div className="compare-a">BEFORE</div>
        <div className="compare-b" style={{ clipPath: `inset(0 0 0 ${x * 100}%)` }}>AFTER</div>
        <div className="compare-handle" style={{ left: `${x * 100}%` }} />
      </div>
    </div>
  );
}

/** Numbered annotation pins, one line of explanation each, on hover. */
function Pins({ accent }: { accent: string }) {
  const pins = [
    { n: 1, x: 22, y: 30, note: "TODO: one line" },
    { n: 2, x: 58, y: 54, note: "TODO: one line" },
    { n: 3, x: 78, y: 26, note: "TODO: one line" },
  ];
  const [on, setOn] = useState<number | null>(null);
  return (
    <div className="moment">
      <div className="moment-head"><span>Annotated screen</span><span>Hover a pin</span></div>
      <div className="moment-stage" style={{ background: `${accent}18` }}>
        {pins.map((p) => (
          <span key={p.n} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%` }}>
            <button
              className="pin-dot"
              type="button"
              onMouseEnter={() => setOn(p.n)}
              onMouseLeave={() => setOn(null)}
              onFocus={() => setOn(p.n)}
              onBlur={() => setOn(null)}
            >
              {p.n}
            </button>
            {on === p.n ? <span className="pin-note">{p.note}</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Click a screenshot to expand it into a full bleed viewer. */
function Expand({ accent }: { accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="moment">
      <div className="moment-head"><span>Click to expand</span><span>Screenshot pending</span></div>
      <button
        className="moment-stage"
        type="button"
        onClick={() => setOpen(true)}
        style={{ width: "100%", border: 0, background: `${accent}18`, cursor: "zoom-in" }}
        aria-label="Expand screenshot"
      />
      {open ? (
        <div
          className="ama-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          style={{ cursor: "zoom-out", justifyContent: "center", alignItems: "center" }}
        >
          <div style={{ width: "min(1100px, 92vw)", aspectRatio: "16 / 9", background: accent, borderRadius: 6 }} />
        </div>
      ) : null}
    </div>
  );
}
