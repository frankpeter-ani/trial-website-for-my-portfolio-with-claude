"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return matches;
}

export interface Point { x: number; y: number }

/**
 * Pointer drag with a little weight to it: the object keeps the velocity it
 * had when you let go and settles rather than stopping dead. The same physics
 * is reused by the hero object, the playground chips and the pinned photos,
 * so the three sections rhyme.
 */
export function useDrag(initial: Point, opts: { friction?: number; enabled?: boolean } = {}) {
  const { friction = 0.9, enabled = true } = opts;
  const [pos, setPos] = useState<Point>(initial);
  const [dragging, setDragging] = useState(false);
  const state = useRef({ last: initial, vx: 0, vy: 0, grab: { x: 0, y: 0 }, raf: 0 });
  const reduced = usePrefersReducedMotion();

  const settle = useCallback(() => {
    const tick = () => {
      const s = state.current;
      s.vx *= friction;
      s.vy *= friction;
      if (Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05) {
        s.raf = 0;
        return;
      }
      setPos((p) => ({ x: p.x + s.vx, y: p.y + s.vy }));
      s.raf = requestAnimationFrame(tick);
    };
    state.current.raf = requestAnimationFrame(tick);
  }, [friction]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
      cancelAnimationFrame(state.current.raf);
      state.current.raf = 0;
      state.current.grab = { x: e.clientX, y: e.clientY };
      state.current.vx = 0;
      state.current.vy = 0;
      setDragging(true);
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const s = state.current;
      const dx = e.clientX - s.grab.x;
      const dy = e.clientY - s.grab.y;
      s.grab = { x: e.clientX, y: e.clientY };
      s.vx = dx;
      s.vy = dy;
      setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
    },
    [dragging],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      setDragging(false);
      if (!reduced) settle();
    },
    [dragging, reduced, settle],
  );

  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  const reset = useCallback(() => {
    cancelAnimationFrame(state.current.raf);
    state.current.raf = 0;
    setPos(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.x, initial.y]);

  return {
    pos,
    dragging,
    reset,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}

/**
 * One sound, pitched slightly differently per panel. Muted by default, the
 * choice is remembered, nothing plays before the visitor has interacted, and
 * it stays silent under reduced motion.
 */
export function usePanelSound() {
  const [muted, setMuted] = useState(true);
  const interacted = useRef(false);
  const ctx = useRef<AudioContext | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fp:sound");
      if (saved === "on") setMuted(false);
    } catch {
      /* storage can be blocked. Silence is the safe default. */
    }
    const mark = () => { interacted.current = true; };
    window.addEventListener("pointerdown", mark, { once: true });
    window.addEventListener("keydown", mark, { once: true });
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        window.localStorage.setItem("fp:sound", next ? "off" : "on");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  /** A short swoosh with no tail. Texture, not an effect. */
  const swoosh = useCallback(
    (step: number) => {
      if (muted || reduced || !interacted.current) return;
      try {
        ctx.current ??= new (window.AudioContext || (window as any).webkitAudioContext)();
        const ac = ctx.current;
        if (!ac) return;
        void ac.resume();
        const now = ac.currentTime;
        const noise = ac.createBufferSource();
        const len = Math.floor(ac.sampleRate * 0.28);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
        noise.buffer = buf;

        const band = ac.createBiquadFilter();
        band.type = "bandpass";
        band.Q.value = 1.1;
        const base = 520 + step * 70;
        band.frequency.setValueAtTime(base, now);
        band.frequency.exponentialRampToValueAtTime(base * 2.1, now + 0.22);

        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

        noise.connect(band).connect(gain).connect(ac.destination);
        noise.start(now);
        noise.stop(now + 0.3);
      } catch {
        /* audio is a nicety. Never let it break the page. */
      }
    },
    [muted, reduced],
  );

  return { muted, toggle, swoosh };
}

/** Press to copy the email, borrowed from the old site. */
export function useCopyEmail(email: string, key = "e") {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be denied. The address is on the page either way. */
    }
  }, [email]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === key) void copy();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copy, key]);

  return { copied, copy };
}
