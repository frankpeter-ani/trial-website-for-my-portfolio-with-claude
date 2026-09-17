"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { menu, site } from "@/lib/content";
import { useCopyEmail } from "@/lib/hooks";

/**
 * The masthead holds the real navigation. This is the thin version of it that
 * arrives once the masthead has scrolled away, so the menu is never more than
 * a glance out of reach.
 */
export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const { copied, copy } = useCopyEmail(site.email);
  const pathname = usePathname();

  /* On the home page the masthead is the navigation, so this waits until the
     masthead has gone. Every other route has no masthead, so it shows at once. */
  const isHome = pathname === "/";
  const shown = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="topbar" data-shown={shown}>
      <a href={isHome ? "#top" : "/"}>+ {site.name}</a>
      <nav aria-label="Sections">
        {menu.map((item) => (
          <a key={item.href} href={isHome ? item.href : `/${item.href}`}>
            {item.label}
          </a>
        ))}
      </nav>
      <button type="button" onClick={() => void copy()}>
        {copied ? "Copied" : "Copy email"}
      </button>
    </header>
  );
}
