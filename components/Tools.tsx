import { tools } from "@/lib/content";

/** One row, moving slowly, doubled so the loop never shows a seam. */
export default function Tools() {
  const run = [...tools, ...tools];
  return (
    <div className="marquee" aria-label="Tools I use">
      <div className="marquee-track">
        {run.map((tool, i) => (
          <span key={`${tool}-${i}`} aria-hidden={i >= tools.length}>
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
