import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Playground from "@/components/Playground";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Tools from "@/components/Tools";
import Contact from "@/components/Contact";

/**
 * Page order, as agreed in the brief. Work sits directly under the hero.
 * Everything after the work panels scrolls normally.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Works />
      <Playground />
      <About />
      <Experience />
      <Tools />
      <Contact />
    </>
  );
}
