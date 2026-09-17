import { experience } from "@/lib/content";
import Pending from "@/components/Pending";

/** Four columns, in CV order. Nothing summarised, nothing invented. */
export default function Experience() {
  return (
    <div className="xp">
      {experience.map((row) => (
        <div className="xp-row" key={row.company}>
          <span className="years">
            <Pending text={row.years} />
          </span>
          <span className="company">{row.company}</span>
          <span className="role">
            <Pending text={row.role} />
          </span>
          <span className="what">
            <Pending text={row.description} />
          </span>
        </div>
      ))}
    </div>
  );
}
