"use client";

import { contacts, sections, site } from "@/lib/content";
import Pending from "@/components/Pending";
import { useCopyEmail, useMediaQuery } from "@/lib/hooks";

/**
 * The footer is the last piece of the masthead grid: one line said out loud,
 * the address as a press to copy target, then the small print.
 */
export default function Contact() {
  const { copied, copy } = useCopyEmail(site.email);
  const hasKeyboard = useMediaQuery("(pointer: fine)");

  return (
    <footer className="contact shell" id="contact" aria-label={sections.contact.title}>
      <p className="contact-line">
        Got something worth <em>building</em> properly?
      </p>

      <button className="contact-mail" type="button" onClick={() => void copy()}>
        {site.email}
        <span className="hint">{copied ? "Copied" : hasKeyboard ? "Press E to copy" : "Tap to copy"}</span>
      </button>

      <div className="contact-meta">
        <div>
          <span className="label">Based</span>
          <span>{site.location}</span>
        </div>
        <div>
          <span className="label">Status</span>
          <span>{site.status}</span>
        </div>
        <div>
          <span className="label">Elsewhere</span>
          {contacts.map((c) => (
            <a key={c.label} href={c.href}>
              {c.label}
              {c.pending ? " ·" : ""}
            </a>
          ))}
        </div>
        <div>
          <span className="label">Domain</span>
          <span>
            <Pending text={site.domain} />
          </span>
        </div>
      </div>

      <div className="colophon">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Set in Instrument Serif, Inter and JetBrains Mono</span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
