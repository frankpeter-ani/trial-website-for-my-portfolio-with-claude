import Masthead from "@/components/Masthead";
import WorkIndex from "@/components/WorkIndex";
import Playground from "@/components/Playground";
import About from "@/components/About";
import Contact from "@/components/Contact";

/**
 * One page, four sections, in the order the masthead menu lists them.
 * Case studies live on their own routes under /work.
 */
export default function Home() {
  return (
    <>
      <Masthead />
      <WorkIndex />
      <Playground />
      <About />
      <Contact />
    </>
  );
}
