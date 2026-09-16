"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

/**
 * Wordmark left, navigation right. Reappears on scroll up. On the work panels
 * the colour flips to stay readable: the panels write --nav-ink and friends
 * onto the document element as they become active.
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 140 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" data-hidden={hidden}>
      <div className="shell">
        <a className="wordmark" href="#top">{site.name}</a>
        <nav className="nav-pill" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
