import type { Project } from "@/lib/content";

/**
 * The right side changes format every time. Sameness on the left is what
 * licenses the variety here. One project, one panel, one enormous piece of
 * media: no card, no caption overlay competing with it.
 */
export default function PanelMedia({ project, position, total }: { project: Project; position: number; total: number }) {
  const counter = `${String(position).padStart(2, "0")} of ${String(total).padStart(2, "0")}`;

  if (project.media === "browser") {
    return (
      <div className="panel-media">
        <div className="frame-bar">
          <span className="dots"><i /><i /><i /></span>
          <span>{project.slug}</span>
          <span className="counter">{counter}</span>
        </div>
        <div className="frame-body">
          <div className="slab" />
          <div className="media-note">Case study scrolling in frame. Media pending.</div>
        </div>
      </div>
    );
  }

  if (project.media === "video") {
    return (
      <div className="panel-media">
        <div className="frame-bar">
          <span>{project.discipline}</span>
          <span className="counter">{counter}</span>
        </div>
        <div className="frame-body">
          <div className="slab" />
        </div>
        <div className="player-bar">
          <button className="round-btn" type="button" aria-label="Previous clip">‹</button>
          <span className="track"><i /></span>
          <span>01:24</span>
          <button className="round-btn" type="button" aria-label="Next clip">›</button>
        </div>
      </div>
    );
  }

  if (project.media === "data") {
    return (
      <div className="panel-media" style={{ background: "rgba(0,0,0,0.34)" }}>
        <div className="frame-body">
          <div className="timeline">
            {[68, 44, 86, 30, 58].map((w, i) => (
              <span className="row" key={w}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <i className="bar" style={{ width: `${w}%` }} />
              </span>
            ))}
          </div>
        </div>
        <div className="player-bar">
          <button className="round-btn" type="button" aria-label="Previous step">‹</button>
          <span style={{ marginLeft: "auto" }}>{counter}</span>
          <button className="round-btn" type="button" aria-label="Next step">›</button>
        </div>
      </div>
    );
  }

  /* illustration and slab both read as one large object filling the frame. */
  return (
    <div className="panel-media" style={{ aspectRatio: project.media === "slab" ? "1 / 1" : "4 / 3" }}>
      <div className="frame-body">
        <div className="slab" />
        {project.media === "illustration" ? <div className="media-note">Abstract illustration, not real screens.</div> : null}
      </div>
    </div>
  );
}
