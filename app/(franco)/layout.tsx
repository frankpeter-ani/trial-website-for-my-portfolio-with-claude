import type { Metadata, Viewport } from "next";
import { site } from "@/lib/content";
import "./franco.css";

/**
 * Root layout for the FRANCO styled route. It is deliberately separate from
 * the main site layout: no shared nav, no drifter, no overlay, so the design
 * system can be judged on its own. The three families are the ones the
 * template uses, loaded at the weights it actually sets.
 */
export const metadata: Metadata = {
  title: `${site.name}, ${site.role}`,
  description:
    "Product and interaction design for founders and entrepreneurs who care about shipping quality, fast.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function FrancoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500&family=DM+Mono:wght@500&family=Host+Grotesk:wght@700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
