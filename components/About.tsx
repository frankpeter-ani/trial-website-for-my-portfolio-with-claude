import { about, sections, site } from "@/lib/content";
import Pending from "@/components/Pending";
import Experience from "@/components/Experience";
import Tools from "@/components/Tools";

/**
 * About. Two paragraphs set in the serif so they read as speech, a ruled table
 * of facts beside them, then the CV as a four column list and the tools as one
 * slow moving row.
 */
export default function About() {
  return (
    <section className="section shell" id="about" aria-label={sections.about.title}>
      <div className="section-head">
        <span className="label">{sections.about.num}</span>
        <h2>{sections.about.title}</h2>
        <p>{sections.about.note}</p>
      </div>

      <div className="about-grid">
        <span className="label">Words</span>

        <div className="about-copy">
          {about.paragraphs.map((p, i) => (
            <p key={i}>
              <Pending text={p} />
            </p>
          ))}

          <div className="path">
            {about.path.map((step) => (
              <div key={step.step}>
                <span className="label">{step.step}</span>
                <span>
                  <Pending text={step.text} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="facts">
            {about.snapshot.map((row) => (
              <div key={row.label}>
                <span className="label">{row.label}</span>
                <span>
                  <Pending text={row.value} />
                </span>
              </div>
            ))}
            <div>
              <span className="label">Status</span>
              <span>{site.status}</span>
            </div>
          </div>
        </div>
      </div>

      <Experience />
      <Tools />
    </section>
  );
}
