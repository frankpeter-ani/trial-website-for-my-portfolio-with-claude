import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudyScaffold, projects, site } from "@/lib/content";
import Pending from "@/components/Pending";
import CaseMoment from "@/components/CaseMoment";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: site.name };
  return {
    title: `${project.headline.join(" ")}, ${site.name}`,
    description: `${project.discipline}. ${project.meta.deliverables}.`,
  };
}

/**
 * Metalab structure: almost no preamble, straight into metadata, then media
 * doing most of the talking. Alternating large media and short text, numbered
 * markers down the edge, and two or three interactive moments.
 */
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="case">
      <div className="shell">
        <h1>{project.headline.join(" ")}</h1>
        <div className="case-meta">
          <div>
            <span className="kicker">Type</span>
            <span><Pending text={project.meta.type} /></span>
          </div>
          <div>
            <span className="kicker">Stage</span>
            <span><Pending text={project.meta.stage} /></span>
          </div>
          <div>
            <span className="kicker">Deliverables</span>
            <span><Pending text={project.meta.deliverables} /></span>
          </div>
        </div>
      </div>

      {/* Full bleed hero clip straight after the metadata. */}
      <div className="case-hero" style={{ background: project.color, marginTop: 0 }}>
        <div className="slab" />
        <div className="media-note" style={{ color: project.ink }}>
          Full bleed hero video. Clip pending.
        </div>
      </div>

      <div className="shell case-body">
        {caseStudyScaffold.map((block, i) => (
          <section className="case-block" key={i}>
            <span className="marker">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2><Pending text={block.heading} /></h2>
              <p><Pending text={block.body} /></p>
              {block.moment ? <CaseMoment kind={block.moment} accent={project.color} /> : null}
            </div>
          </section>
        ))}

        <section className="case-block">
          <span className="marker">{String(caseStudyScaffold.length + 1).padStart(2, "0")}</span>
          <div>
            <h2>Next</h2>
            <p style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 14 }}>
              <a className="panel-link" href="/#works">All work <span aria-hidden="true">→</span></a>
              <a className="panel-link" href="/#contact">Get in touch <span aria-hidden="true">→</span></a>
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
