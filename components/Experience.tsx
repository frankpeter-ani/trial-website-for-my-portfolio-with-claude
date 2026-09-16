import { experience } from "@/lib/content";
import Pending from "./Pending";

/**
 * Four columns: years in grey, company in black, role in grey, description on
 * the right. No cards, no borders around rows, no icons. The restraint is the
 * point. Every number here is a marked slot until the CV conflicts are settled.
 */
export default function Experience() {
  return (
    <section className="section shell" id="experience" aria-label="Experience">
      <div className="section-head">
        <span className="section-num">06</span>
        <h2>Experience</h2>
      </div>
      <div className="exp">
        {experience.map((row) => (
          <div className="exp-row" key={row.company}>
            <span className="exp-years"><Pending text={row.years} /></span>
            <span className="exp-company">{row.company}</span>
            <span className="exp-role"><Pending text={row.role} /></span>
            <span className="exp-desc"><Pending text={row.description} /></span>
          </div>
        ))}
      </div>
    </section>
  );
}
