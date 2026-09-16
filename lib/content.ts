/**
 * Single source of truth for every word on the site.
 *
 * Anything wrapped in TODO() is a slot the content brief marked as outstanding.
 * It renders visibly as a placeholder so nothing false ever ships, and so the
 * gaps are obvious in the browser rather than buried in a file.
 *
 * Two rules from the brief hold everywhere in here:
 *   1. No dashes and no hyphens in any copy.
 *   2. Never invent a metric. Mark the slot instead.
 */

export const TODO = (note: string) => `TODO: ${note}`;

export const site = {
  name: "Frankpeter Ani",
  role: "Product and interaction designer",
  location: "London Area, UK",
  status: "Open to full time roles",
  // TODO: swap in the real address before launch. It powers the copy shortcut,
  // the contact footer and the chatbot fallback.
  email: "you@example.com",
  domain: TODO("domain not chosen yet"),
  links: [
    { label: "Email", href: "mailto:you@example.com" },
    { label: "LinkedIn", href: "#", pending: true },
    { label: "Dribbble", href: "#", pending: true },
    { label: "Contra", href: "#", pending: true },
  ],
} as const;

export const nav = [
  { label: "My Playground", href: "#playground" },
  { label: "My Works", href: "#works" },
  { label: "About Me", href: "#about" },
] as const;

/**
 * Hero. Type behaviour comes from reference 2: the first clause sits in full
 * ink, everything after it drops to grey, so the eye reads the claim first and
 * the detail second.
 */
export const hero = {
  headlineLead: "Product and interaction design",
  headlineRest: "for founders and entrepreneurs who care about shipping quality, fast.",
  subline: "I design it, I animate it, then I build it.",
  primaryCta: { label: "See the work", target: "#works" },
  secondaryCta: { label: "Get in touch", target: "#contact" },
} as const;

export type MediaKind = "browser" | "video" | "illustration" | "data" | "slab";

export interface Project {
  slug: string;
  index: string;
  discipline: string;
  /** Two or three words per line, three lines maximum. */
  headline: string[];
  /** What was broken, and what you did about it. Two sentences. */
  summary: string;
  tags: string[];
  /** Panel background. Pulled from the project itself. */
  color: string;
  /** Ink that stays readable on that background. */
  ink: string;
  /** Muted ink on that background. */
  inkSoft: string;
  /** The right side changes format every time. */
  media: MediaKind;
  /** Case study metadata. Answers the reader's first three questions. */
  meta: { type: string; stage: string; deliverables: string };
}

/**
 * Which projects go in the panels is still outstanding in the brief. These are
 * scaffolded from the companies on the CV so the mechanic is real and the
 * words are honestly marked. Replace summary, tags and meta per project.
 */
export const projects: Project[] = [
  {
    slug: "tempo",
    index: "01",
    discipline: "Product and motion",
    headline: ["Tempo", "desktop", "app"],
    summary: TODO("two unpolished sentences. What was broken, and what you did about it."),
    tags: ["Product design", "Motion", "Rive", "Design system"],
    color: "#12324A",
    ink: "#F4F7FA",
    inkSoft: "rgba(244,247,250,0.66)",
    media: "browser",
    meta: {
      type: "Desktop product",
      stage: TODO("stage"),
      deliverables: "Product design, motion, front end",
    },
  },
  {
    slug: "linum-labs",
    index: "02",
    discipline: "Product design",
    headline: ["Shipping", "at", "volume"],
    summary: TODO("two unpolished sentences. The project count is one of the CV conflicts, so it stays empty until it is settled."),
    tags: ["Product design", "Web3", "Design system"],
    color: "#B4471F",
    ink: "#FFF6F1",
    inkSoft: "rgba(255,246,241,0.68)",
    media: "video",
    meta: {
      type: "Product studio work",
      stage: TODO("stage"),
      deliverables: "Product design, prototypes",
    },
  },
  {
    slug: "cherry-network",
    index: "03",
    discipline: "Interaction and motion",
    headline: ["Cherry", "Network"],
    summary: TODO("two unpolished sentences. What was broken, and what you did about it."),
    tags: ["Interaction", "Motion", "Brand"],
    color: "#2C2A66",
    ink: "#F1F0FF",
    inkSoft: "rgba(241,240,255,0.66)",
    media: "illustration",
    meta: {
      type: "Platform",
      stage: TODO("stage"),
      deliverables: "Interaction design, motion",
    },
  },
  {
    slug: "onenet",
    index: "04",
    discipline: "Product and systems",
    headline: ["Onenet", "platform"],
    summary: TODO("two unpolished sentences. What was broken, and what you did about it."),
    tags: ["Product design", "Data", "Systems"],
    color: "#1C4231",
    ink: "#EFF7F1",
    inkSoft: "rgba(239,247,241,0.66)",
    media: "data",
    meta: {
      type: "Platform",
      stage: TODO("stage"),
      deliverables: "Product design, data views",
    },
  },
  {
    slug: "inspark",
    index: "05",
    discipline: "Brand and product",
    headline: ["Inspark"],
    summary: TODO("two unpolished sentences. What was broken, and what you did about it."),
    tags: ["Brand", "Product design", "Motion"],
    color: "#7A2540",
    ink: "#FFF0F4",
    inkSoft: "rgba(255,240,244,0.66)",
    media: "slab",
    meta: {
      type: "Brand and product",
      stage: TODO("stage"),
      deliverables: "Brand, product design, motion",
    },
  },
];

/** Case study body. Section headers are full sentences, never labels. */
export interface CaseBlock {
  heading: string;
  body: string;
  /** Interactive moment attached to this block. */
  moment?: "scrub" | "compare" | "expand" | "pins";
}

export const caseStudyScaffold: CaseBlock[] = [
  {
    heading: TODO("a full sentence header. Something closer to 'The constraint was money per interaction'"),
    body: TODO("under 80 words. State the decision, then what it cost. Never the decision alone."),
    moment: "scrub",
  },
  {
    heading: TODO("a full sentence header"),
    body: TODO("under 80 words. State the decision, then what it cost."),
    moment: "compare",
  },
  {
    heading: TODO("a full sentence header"),
    body: TODO("under 80 words. State the decision, then what it cost."),
    moment: "pins",
  },
];

/** Playground. Handwritten labels, no dates and no client names. */
export const playgroundItems = [
  { id: "p1", label: "still fixing the easing", x: 4, y: 6, w: 24, rotate: -4, tone: "#E8D7C3" },
  { id: "p2", label: "tuesday afternoon", x: 37, y: 4, w: 21, rotate: 3, tone: "#CBD9E8" },
  { id: "p3", label: "not sure what this is", x: 70, y: 10, w: 23, rotate: -2, tone: "#D9E2CC" },
  { id: "p4", label: "rive test, third try", x: 10, y: 54, w: 23, rotate: 5, tone: "#EBD3D8" },
  { id: "p5", label: "type, no brief", x: 42, y: 60, w: 20, rotate: -6, tone: "#E3DDF0" },
  { id: "p6", label: "blender, badly", x: 72, y: 56, w: 21, rotate: 2, tone: "#DCD5C6" },
] as const;

/** About. Two paragraphs, first person, no career summary language. */
export const about = {
  paragraphs: [
    TODO("first paragraph. What you do, in your own words, first person."),
    TODO("second paragraph. How you got here. No career summary language."),
  ],
  pinned: [
    { id: "a1", title: "Shipping the Tempo desktop app", note: TODO("what it meant"), x: 4, y: 8, rotate: -3 },
    { id: "a2", title: "Product Hunt day", note: TODO("what it meant"), x: 36, y: 5, rotate: 2 },
    { id: "a3", title: "The design system", note: TODO("what it meant"), x: 66, y: 46, rotate: -2 },
    { id: "a4", title: TODO("a photo you actually have"), note: TODO("what it meant"), x: 22, y: 52, rotate: 4 },
  ],
  snapshot: [
    { label: "Reading", value: TODO("what you are reading") },
    { label: "Court", value: "Basketball" },
    { label: "Fuel", value: TODO("what fuels the work") },
    { label: "Based", value: site.location },
  ],
  path: [
    { step: "01", text: TODO("where you started") },
    { step: "02", text: TODO("the turn") },
    { step: "03", text: TODO("now") },
  ],
} as const;

/**
 * Experience. Four columns, straight from the CV, in this order.
 * The strongest real number per role is a marked slot: the brief flags the
 * Linum project count and the Tempo date overlap as unresolved.
 */
export const experience = [
  {
    years: TODO("years"),
    company: "Tempo AI",
    role: TODO("role"),
    description: TODO("one line, plus the strongest real number for this role. Two Tempo roles overlap by two months on the CV."),
  },
  {
    years: TODO("years"),
    company: "Linum Labs",
    role: TODO("role"),
    description: TODO("one line. The project count is contested, 25 on the CV against 35 in conversation."),
  },
  { years: TODO("years"), company: "Cherry Network", role: TODO("role"), description: TODO("one line, plus the strongest real number") },
  { years: TODO("years"), company: "Onenet", role: TODO("role"), description: TODO("one line, plus the strongest real number") },
  { years: TODO("years"), company: "Inspark", role: TODO("role"), description: TODO("one line, plus the strongest real number") },
  { years: TODO("years"), company: "Dazeign Studios", role: "The practice running underneath all of it", description: TODO("one line") },
] as const;

export const tools = [
  "Figma", "Framer", "After Effects", "Rive", "Blender",
  "Jitter", "Cursor", "Tempo", "Lovable", "GitHub", "Linear",
] as const;

/** Ask me anything. It answers as him, not as an assistant. */
export const ama = {
  launcher: "ask me anything",
  greeting: "hey, frankpeter here, ask me anything!",
  presence: "frankpeter is online",
  placeholder: "ask me anything.",
  hint: "press enter to send, escape to close",
  starters: [
    "what have you actually shipped?",
    "can you build it too, or just design it?",
    "what is in your motion stack?",
    "are you available right now?",
  ],
} as const;

export const styleReferences = [
  { url: "fs-oliverboyle.framer.website", note: "Interaction and overall theme" },
  { url: "td-alexfolio.framer.website", note: "Content layout and hero" },
  { url: "dazeign.framer.website", note: "Voice, press to copy email, personal section" },
  { url: "metalab.com/work/windsurf", note: "Case study structure" },
  { url: "codemathics.design", note: "Sound on scroll and the chatbot" },
] as const;
