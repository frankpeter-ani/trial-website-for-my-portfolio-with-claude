"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Ambient element that follows the cursor loosely, the way the Claude icon
 * drifts. Slow, damped, never snapping to the pointer.
 */
export default function Drifter() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const off = reduced || !fine;

  useEffect(() => {
    if (off) return;
    const el = ref.current;
    if (!el) return;

    const target = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.4 };
    const at = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      at.x += (target.x - at.x) * 0.035;
      at.y += (target.y - at.y) * 0.035;
      el.style.transform = `translate3d(${at.x - 95}px, ${at.y - 95}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [off]);

  if (off) return null;
  return <div className="drifter" ref={ref} aria-hidden="true" />;
}
