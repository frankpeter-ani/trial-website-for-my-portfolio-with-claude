import type { Stamp as StampData, StampMotif } from "@/lib/content";

/**
 * A postage stamp. The perforated edge is a mask in CSS, so the shadow lives
 * on the wrapper rather than here, and the art is drawn rather than loaded:
 * every motif is a gradient or a letterform, sized to the real thing, so a
 * photograph can be dropped in behind it later without the layout moving.
 */
export default function Stamp({
  stamp,
  dragging = false,
  sharp = false,
}: {
  stamp: StampData;
  dragging?: boolean;
  sharp?: boolean;
}) {
  return (
    <div
      className="stamp"
      data-dragging={dragging}
      style={{
        ["--tone" as string]: stamp.tone,
        ["--ink-on" as string]: stamp.ink,
        ["--soft" as string]: sharp ? "0px" : `${stamp.blur ?? 0}px`,
      }}
    >
      <div className="stamp-face">
        <div className="stamp-art">
          <Motif motif={stamp.motif} title={stamp.title} />
        </div>
        <span className="stamp-caption">{stamp.footline}</span>
        <div className="stamp-foot">
          <span className="stamp-title">
            {stamp.title.map((line) => (
              <span key={line} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </span>
          <span className="value">{stamp.value}</span>
        </div>
      </div>
    </div>
  );
}

function Motif({ motif, title }: { motif: StampMotif; title: string[] }) {
  if (motif === "letter") {
    return <span className={`motif motif-${motif}`}>{title[0]?.[0] ?? "F"}</span>;
  }
  if (motif === "specimen") {
    return <span className={`motif motif-${motif}`}>Spécimen</span>;
  }
  return <span className={`motif motif-${motif}`} aria-hidden="true" />;
}
