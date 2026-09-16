/**
 * Renders a content slot. Anything the brief left outstanding arrives here as
 * a "TODO: ..." string and is shown as a visible placeholder, so a gap is
 * obvious in the browser and never reads as a finished claim.
 */
export default function Pending({ text }: { text: string }) {
  if (text.startsWith("TODO:")) {
    return <span className="pending">{text}</span>;
  }
  return <>{text}</>;
}

export const isPending = (text: string) => text.startsWith("TODO:");
