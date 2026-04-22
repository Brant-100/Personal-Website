import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function SectionNav() {
  const [active, setActive] = useState(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Show bar once user scrolls past ~80% of viewport height (past the hero)
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.nav
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-16 z-40 flex justify-center"
          aria-label="Section navigation"
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-1 backdrop-blur-md shadow-sm">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  active === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
