"use client";

import { site, styleReferences } from "@/lib/content";
import { useCopyEmail } from "@/lib/hooks";
import Pending from "./Pending";

export default function Contact() {
  const { copied, copy } = useCopyEmail(site.email);

  return (
    <footer className="contact shell" id="contact">
      <span className="kicker">Contact</span>
      <h2 style={{ marginTop: 16 }}>Want it good, and by Friday?</h2>

      <div className="contact-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn" type="button" onClick={() => void copy()}>
            {copied ? "Copied to clipboard" : site.email}
          </button>
          <span className="copy-flash">Press E anywhere to copy it.</span>
        </div>

        <ul className="link-stack">
          {site.links.filter((l) => l.label !== "Email").map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>{" "}
              {l.pending ? <span className="pending">link pending</span> : null}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="foot-note">{site.name}</span>
          <span className="foot-note">{site.location}</span>
          <span className="foot-note"><Pending text={site.domain} /></span>
        </div>
      </div>

      <details style={{ marginTop: 44 }}>
        <summary className="foot-note" style={{ cursor: "pointer" }}>Style references this build works from</summary>
        <ul className="link-stack" style={{ marginTop: 12 }}>
          {styleReferences.map((r) => (
            <li key={r.url}>
              <span className="foot-note">{r.url}, {r.note}</span>
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}
