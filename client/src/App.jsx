import { ThemeProvider } from "@/context/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Credentials } from "@/components/sections/Credentials";
import { Experience } from "@/components/sections/Experience";

export default function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Projects />
          <Credentials />
          <Experience />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
