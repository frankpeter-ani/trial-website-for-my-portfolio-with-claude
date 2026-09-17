"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playgroundItems, sections } from "@/lib/content";
import { useDrag, useMediaQuery } from "@/lib/hooks";

/**
 * The loosest part of the site. An open canvas rather than a grid: a ruler
 * across the top, a faint grid behind everything, items at slight angles with
 * handwritten labels, a cursor tag following the pointer.
 *
 * On a phone this becomes a scrollable scattered layout. Dragging on touch is
 * not attempted.
 */
export default function Playground() {
  const isPhone = useMediaQuery("(max-width: 760px)");
  const [view, setView] = useState({ x: 0, y: 0, z: 1 });
  const [panning, setPanning] = useState(false);
  const [tag, setTag] = useState<{ x: number; y: number } | null>(null);
  const [nonce, setNonce] = useState(0);
  const pan = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  /* Zoom with scroll, with limits so nobody gets lost. */
  useEffect(() => {
    if (isPhone) return;
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      setView((v) => ({ ...v, z: Math.min(1.6, Math.max(0.6, v.z - e.deltaY * 0.0015)) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isPhone]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target !== e.currentTarget) return; /* dragging the background only */
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pan.current = { x: e.clientX, y: e.clientY };
    setPanning(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTag({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (!panning) return;
    const dx = e.clientX - pan.current.x;
    const dy = e.clientY - pan.current.y;
    pan.current = { x: e.clientX, y: e.clientY };
    setView((v) => ({
      ...v,
      x: Math.min(260, Math.max(-260, v.x + dx)),
      y: Math.min(200, Math.max(-200, v.y + dy)),
    }));
  }, [panning]);

  const endPan = useCallback((e: React.PointerEvent) => {
    if (panning) (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setPanning(false);
  }, [panning]);

  const reset = useCallback(() => {
    setView({ x: 0, y: 0, z: 1 });
    setNonce((n) => n + 1); /* remounts the chips, putting everything back */
  }, []);

  return (
    <section className="section shell" id="craft" aria-label={sections.craft.title}>
      <div className="section-head">
        <span className="label">{sections.craft.num}</span>
        <h2>{sections.craft.title}</h2>
        <p>{sections.craft.note}</p>
      </div>

      {isPhone ? (
        <div className="scatter">
          {playgroundItems.map((item) => (
            <div className="chip" key={item.id} style={{ transform: `rotate(${item.rotate}deg)` }}>
              <div className="swatch" style={{ background: item.tone }} />
              <span className="hand">{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="canvas-wrap">
          <div className="ruler" aria-hidden="true" />
          <div
            className="canvas"
            ref={canvasRef}
            data-panning={panning}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPan}
            onPointerLeave={(e) => { endPan(e); setTag(null); }}
          >
            <div className="grid-bg" aria-hidden="true" />
            <div
              className="canvas-inner"
              style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.z})` }}
            >
              {playgroundItems.map((item) => (
                <Chip key={`${item.id}-${nonce}`} item={item} />
              ))}
            </div>
            {tag ? <span className="cursor-tag" style={{ left: tag.x, top: tag.y }}>you</span> : null}
          </div>
          <div className="canvas-tools">
            <button className="btn ghost" type="button" onClick={reset}>Reset</button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Items lift slightly and cast a shadow while being dragged, and stay where
    they are left for the session. */
function Chip({ item }: { item: (typeof playgroundItems)[number] }) {
  const { pos, dragging, handlers } = useDrag({ x: 0, y: 0 });
  return (
    <div
      className="chip"
      data-dragging={dragging}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.w}px`,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${item.rotate}deg) scale(${dragging ? 1.03 : 1})`,
      }}
      {...handlers}
    >
      <div className="swatch" style={{ background: item.tone }} />
      <span className="hand">{item.label}</span>
    </div>
  );
}
