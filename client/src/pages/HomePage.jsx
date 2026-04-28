import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { CredentialHighlights } from "@/components/sections/CredentialHighlights";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <CredentialHighlights />
      <Experience />
      <Contact />
    </>
  );
}
