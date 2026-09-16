import { site, tools } from "./content";

/**
 * What it is allowed to know.
 *
 * This is a local answer bank so the overlay works with no backend attached.
 * When a model is wired in behind it, keep the two hard rules that matter:
 * never invent a figure or a client, and when it does not know, say so and
 * offer the email instead. A chatbot that confidently invents a metric about
 * you is worse than no chatbot.
 *
 * Voice: answers as him, not as an assistant. Short sentences, lowercase, the
 * occasional question answering itself. No "I would be happy to help".
 */

interface Answer {
  match: RegExp;
  reply: string;
}

const unknown = `not something i have written down yet, so i am not going to guess at it.\nemail me instead: ${site.email}`;

const bank: Answer[] = [
  {
    match: /ship|built|built it|what have you/i,
    reply:
      "design, motion and the front end, usually all three on the same project.\nthe work panels above are the short version. the case studies go into what broke and what it cost.\nthe specifics per project are still being written, so i am not going to pad them here.",
  },
  {
    match: /build|code|just design|develop/i,
    reply:
      "both.\ni design it, i animate it, then i build it. that is the whole pitch, and it is why the handoff never gets lost in translation.",
  },
  {
    match: /motion|stack|rive|after effects|tools/i,
    reply: `rive and after effects for motion. ${tools.slice(0, 6).join(", ")} for everything around it.\nrive when it has to ship into the product, after effects when it has to sell the idea.`,
  },
  {
    match: /available|hiring|role|open|work with/i,
    reply: `${site.status.toLowerCase()}, based in ${site.location}.\nfastest way in is email: ${site.email}`,
  },
  {
    match: /where|based|located|london|lagos/i,
    reply: `${site.location}.`,
  },
  {
    match: /basketball|coffee|reading|fun|hobby/i,
    reply: "basketball, mostly. coffee, obviously.\nwhat i am reading right now is not written down here yet.",
  },
];

export function answerFor(question: string): string {
  const hit = bank.find((a) => a.match.test(question));
  return hit ? hit.reply : unknown;
}
