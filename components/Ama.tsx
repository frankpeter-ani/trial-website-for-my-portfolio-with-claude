"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ama, site } from "@/lib/content";
import { answerFor } from "@/lib/ama-answers";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Turn { q: string; a: string; typed: string }

/**
 * A dark room with a question in the middle of it. No chat bubbles, no avatar
 * per message, no product feel. The launcher sits on every page; the overlay
 * fades in over a blurred version of it and closes on escape.
 */
export default function Ama() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Answers are typed out rather than dumped. */
  const ask = useCallback((question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const reply = answerFor(trimmed);
    setDraft("");
    setTurns((t) => [...t, { q: trimmed, a: reply, typed: reduced ? reply : "" }]);
    if (reduced) return;

    const index = turns.length;
    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setTurns((t) =>
        t.map((turn, n) => (n === index ? { ...turn, typed: turn.a.slice(0, i) } : turn)),
      );
      if (i >= reply.length) window.clearInterval(timer);
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
    }, 18);
  }, [reduced, turns.length]);

  return (
    <>
      <button className="ama-launcher" type="button" onClick={() => setOpen(true)}>
        <span className="avatar" aria-hidden="true">FA</span>
        {ama.launcher}
      </button>

      {open ? (
        <div className="ama-overlay" role="dialog" aria-modal="true" aria-label="Ask me anything">
          <div className="ama-top">
            <span className="ama-who">
              <span className="ring">
                <span className="avatar" aria-hidden="true">FA</span>
                <i className="online" />
              </span>
              {ama.presence}
            </span>
            <button
              className="round-btn"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ width: 36, height: 36, color: "inherit" }}
            >
              ✕
            </button>
          </div>

          <div className="ama-body" data-started={turns.length > 0} ref={bodyRef}>
            {turns.length === 0 ? (
              <>
                <p className="ama-greeting">{ama.greeting}</p>
                <div className="starters">
                  {ama.starters.map((s) => (
                    <button key={s} type="button" onClick={() => ask(s)}>{s}</button>
                  ))}
                </div>
              </>
            ) : (
              <div className="thread">
                {turns.map((t, i) => (
                  <div key={`${t.q}-${i}`}>
                    <p className="q">{t.q}</p>
                    <p className="a">
                      {t.typed}
                      {t.typed.length < t.a.length ? <span className="caret" /> : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ama-foot">
            <form
              className="ama-input"
              onSubmit={(e) => { e.preventDefault(); ask(draft); }}
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={ama.placeholder}
                aria-label="Ask a question"
              />
              <button className="ama-send" type="submit" aria-label="Send">↑</button>
            </form>
            <span className="ama-hint">{ama.hint}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
