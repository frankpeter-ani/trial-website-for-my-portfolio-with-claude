"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { projects, sections, stamps } from "@/lib/content";
import Pending, { isPending } from "@/components/Pending";
import Stamp from "@/components/Stamp";

/**
 * The work index. A ruled list rather than a carousel: every project is one
 * line, the case study is one click, and the stamp for the row being read
 * follows the cursor so the pile from the masthead carries through.
 */
export default function WorkIndex() {
  const [peek, setPeek] = useState<{ slug: string; x: number; y: number } | null>(null);
  const frame = useRef(0);

  const track = useCallback((slug: string, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const { clientX, clientY } = e;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      setPeek({ slug, x: clientX + 130, y: clientY });
    });
  }, []);

  return (
    <section className="section shell" id="work" aria-label={sections.work.title}>
      <div className="section-head">
        <span className="label">{sections.work.num}</span>
        <h2>{sections.work.title}</h2>
        <p>{sections.work.note}</p>
      </div>

      <div className="work-list">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="work-row"
            onPointerMove={(e) => track(project.slug, e)}
            onPointerLeave={() => setPeek(null)}
          >
            <span className="idx">{project.index}</span>
            <span className="name">{project.headline.join(" ")}</span>
            <span className="disc">{project.discipline}</span>
            <span className="deliv">
              {isPending(project.meta.stage) ? project.meta.type : project.meta.stage}
            </span>
            <span className="go" aria-hidden="true">
              →
            </span>
            {isPending(project.summary) ? null : <p className="tagline">{project.summary}</p>}
          </Link>
        ))}
      </div>

      {/* The summaries are still open slots in the brief. Saying so once, here,
          is more honest than five identical placeholders down the list. */}
      <p style={{ marginTop: 22, fontSize: 13, color: "var(--ink-2)" }}>
        <Pending text={projects[0].summary} />
      </p>

      <PeekStamp peek={peek} />
    </section>
  );
}

function PeekStamp({ peek }: { peek: { slug: string; x: number; y: number } | null }) {
  const stamp = peek ? stamps.find((s) => s.slug === peek.slug) : undefined;
  return (
    <div
      className="work-peek"
      data-shown={Boolean(stamp)}
      style={{ left: peek?.x ?? 0, top: peek?.y ?? 0 }}
      aria-hidden="true"
    >
      {stamp ? <Stamp stamp={stamp} sharp /> : null}
    </div>
  );
}
