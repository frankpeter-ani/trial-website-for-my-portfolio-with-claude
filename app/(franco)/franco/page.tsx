import type { CSSProperties } from "react";
import Link from "next/link";
import Pending, { isPending } from "@/components/Pending";
import { site, nav, hero, projects, about, experience, tools } from "@/lib/content";

/**
 * The portfolio homepage rebuilt in the FRANCO design system.
 *
 * Every measurement comes from reference/franco-template/DESIGN-SYSTEM.md, and
 * every word comes from lib/content.ts. The two rules from the brief still
 * hold: nothing outstanding is filled in with invented copy, it renders as a
 * marked slot instead, and no dashes or hyphens appear anywhere in the words.
 *
 * Section order alternates cream and ink, which is how the template gets its
 * rhythm without rules or spacers.
 */
export default function FrancoHome() {
  /* The wordmark holds the full measure at any width. FRANCO sets six letters
     across 1376px; this keeps the same letter to width ratio for any name. */
  const markStyle = {
    "--mark-len": site.name.split(" ")[0].length,
  } as CSSProperties;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <header className="nav">
        <div className="nav-inner shell">
          <Link className="nav-mark" href="/franco">{site.name}</Link>
          <nav className="nav-links">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>
          <a className="btn btn-dark btn-sm" href="#contact">Get in touch</a>
        </div>
      </header>

      <main id="main">
        {/* 01 Hero */}
        <section className="hero on-ink">
          <div className="shell">
            <h1 className="hero-mark" style={markStyle}>{site.name.split(" ")[0]}</h1>
            <div className="hero-meta">
              <p className="eyebrow">{site.role}</p>
              <p className="eyebrow">{site.location}</p>
            </div>
          </div>

          <div className="shell hero-foot">
            <h2 className="heading">
              {hero.headlineLead}{" "}
              <span style={{ color: "var(--cream-50)" }}>{hero.headlineRest}</span>
            </h2>
            <p className="lead">{hero.subline}</p>
            <div className="hero-actions">
              <a className="btn btn-light" href={hero.primaryCta.target}>{hero.primaryCta.label}</a>
              <a className="btn btn-transparent" href={hero.secondaryCta.target}>{hero.secondaryCta.label}</a>
            </div>
          </div>
        </section>

        {/* 02 Work */}
        <section className="section on-cream" id="works">
          <div className="shell">
            <div className="section-head">
              <p className="chip eyebrow">My Works</p>
              <h2 className="display">Selected work</h2>
            </div>

            <div className="work-grid">
              {projects.map((project) => (
                <Link key={project.slug} className="card work-card" href={`/work/${project.slug}`}>
                  {/* The media slot. Until real work lands here it carries the
                      project's own colour rather than a grey box. */}
                  <div className="work-media" style={{ background: project.color }} aria-hidden />

                  <div className="work-top">
                    <p className="eyebrow">{project.index}</p>
                    <p className="eyebrow">{project.discipline}</p>
                  </div>

                  <h3 className="heading">{project.headline.join(" ")}</h3>

                  {isPending(project.summary)
                    ? <Pending text={project.summary} />
                    : <p className="body-lg">{project.summary}</p>}

                  <div className="work-tags">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 03 About */}
        <section className="section on-ink" id="about">
          <div className="shell">
            <div className="section-head">
              <p className="chip eyebrow">About me</p>
              <h2 className="display">{hero.subline}</h2>
            </div>

            <div className="about-grid">
              <div className="about-copy">
                {about.paragraphs.map((paragraph, i) =>
                  isPending(paragraph)
                    ? <Pending key={i} text={paragraph} />
                    : <p className="body-lg" key={i}>{paragraph}</p>
                )}
              </div>

              <div className="snapshot">
                {about.snapshot.map((row) => (
                  <div className="snapshot-row" key={row.label}>
                    <p className="eyebrow">{row.label}</p>
                    {isPending(row.value)
                      ? <Pending text={row.value} />
                      : <p className="body-lg">{row.value}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 04 Experience */}
        <section className="section on-cream" id="experience">
          <div className="shell">
            <div className="section-head">
              <p className="chip eyebrow">Experience</p>
              <h2 className="display">Where I have worked</h2>
            </div>

            <div className="table">
              <div className="table-row table-head">
                <p className="eyebrow">Years</p>
                <p className="eyebrow">Company</p>
                <p className="eyebrow">Role</p>
                <p className="eyebrow">What it was</p>
              </div>

              {experience.map((row) => (
                <div className="table-row" key={row.company}>
                  {isPending(row.years) ? <Pending text={row.years} /> : <p className="caption">{row.years}</p>}
                  <p className="body-lg">{row.company}</p>
                  {isPending(row.role) ? <Pending text={row.role} /> : <p className="body-lg">{row.role}</p>}
                  {isPending(row.description)
                    ? <Pending text={row.description} />
                    : <p className="caption">{row.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 Tools */}
        <section className="section on-ink" id="tools">
          <div className="shell">
            <div className="section-head">
              <p className="chip eyebrow">Tools I use</p>
            </div>
          </div>

          <div className="marquee" aria-label={`Tools: ${tools.join(", ")}`}>
            <div className="marquee-track">
              {[...tools, ...tools].map((tool, i) => (
                <span className="marquee-item" key={`${tool}-${i}`} aria-hidden={i >= tools.length}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 06 Contact */}
        <section className="section on-cream" id="contact">
          <div className="shell">
            <div className="section-head">
              <p className="chip eyebrow">Contact</p>
              <h2 className="display">Want it good, and by Friday?</h2>
              <p className="lead">{site.status}. Based in {site.location}.</p>
            </div>

            <div className="contact-actions">
              <a className="btn btn-dark" href={`mailto:${site.email}`}>{site.email}</a>
              <a className="btn btn-transparent" href="/">See the full site</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell">
          <div className="footer-grid">
            <div className="footer-col">
              <p className="footer-mark">{site.name}</p>
              <p className="caption" style={{ color: "var(--cream-50)" }}>{site.role}</p>
            </div>

            <div className="footer-col">
              <p className="eyebrow">Main pages</p>
              {nav.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
              <a href="#contact">Contact</a>
            </div>

            <div className="footer-col">
              <p className="eyebrow">Elsewhere</p>
              {site.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                  {"pending" in link && link.pending ? <span className="pending" style={{ marginLeft: 8 }}>link pending</span> : null}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-fine">
            <p className="caption">{site.location}</p>
            <p className="caption">{site.status}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
