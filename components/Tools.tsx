import { tools } from "@/lib/content";

/**
 * Small label, then plain tiles on a faint grid running off the edge of the
 * screen to imply there are more. Slow marquee that pauses on hover, and each
 * tile shows its name on hover rather than permanently. No skill percentages.
 */
export default function Tools() {
  const doubled = [...tools, ...tools];
  return (
    <section className="section" id="tools" aria-label="Tools I use">
      <div className="shell">
        <span className="kicker">Tools I use</span>
      </div>
      <div className="marquee" style={{ marginTop: 18 }}>
        <div className="marquee-track">
          {doubled.map((tool, i) => (
            <span className="tool" key={`${tool}-${i}`} tabIndex={i < tools.length ? 0 : -1} aria-hidden={i >= tools.length}>
              <i aria-hidden="true" />
              <span>{tool}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
