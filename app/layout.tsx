import type { Metadata, Viewport } from "next";
import { site } from "@/lib/content";
import TopBar from "@/components/TopBar";
import Ama from "@/components/Ama";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name}, ${site.role}`,
  description:
    "Product and interaction design for founders and entrepreneurs who care about shipping quality, fast. I design it, I animate it, then I build it.",
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name}, ${site.role}`,
    description:
      "Product and interaction design for founders and entrepreneurs who care about shipping quality, fast.",
    locale: "en_GB",
    type: "website",
  },
  other: {
    // The brief flags this as the one thing to fix first. It is London.
    "geo.placename": site.location,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <TopBar />
        <main id="main">{children}</main>
        <Ama />
      </body>
    </html>
  );
}
