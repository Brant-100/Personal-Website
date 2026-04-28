import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
];

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const { theme } = useTheme();
  const location = useLocation();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const [dockVisible, setDockVisible] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    let timer;
    const showDock = () => {
      setDockVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setDockVisible(false), 1000);
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
      if (window.scrollY > window.innerHeight * 0.8) showDock();
      else setDockVisible(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top navbar — logo, page links, theme toggle */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className={cn(
          /* Avoid transition-all + heavy backdrop-blur: both cause scroll jank on long pages */
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ease-out",
          scrolled
            ? cn(
                "border-b border-border bg-background/92 dark:bg-background/95 supports-[backdrop-filter]:backdrop-blur-sm supports-[backdrop-filter]:bg-background/80",
                isDark ? "shadow-presence-rest dark:border-primary/22" : "shadow-[0_12px_36px_-14px_rgb(0_0_0_/0.06)]"
              )
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                isDark
                  ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                  : "bg-foreground text-background"
              )}
            >
              <Terminal className="h-4 w-4" />
            </span>
            <span className="font-mono text-sm font-bold tracking-tight">
              brant<span className="text-primary">.</span>simpson
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === l.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Bottom floating section dock — home page only, appears after hero */}
      <AnimatePresence>
        {isHome && pastHero && (
          <motion.nav
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{
              y: 0,
              opacity: dockVisible ? 1 : 0,
              scale: dockVisible ? 1 : 0.96,
            }}
            exit={{ y: 24, opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onMouseEnter={() => setDockVisible(true)}
            onMouseLeave={() => setDockVisible(false)}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none"
            aria-label="Section navigation"
          >
            <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/10 bg-background/70 px-1.5 py-1 shadow-2xl shadow-black/20 backdrop-blur-2xl ring-1 ring-black/5">
              {SECTIONS.map(({ id, label }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollTo(id)}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "relative rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150",
                    activeSection === id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <AnimatePresence mode="sync">
                    {activeSection === id && (
                      <motion.span
                        key={id}
                        className="absolute inset-0 rounded-full bg-primary/20 ring-1 ring-primary/30"
                        initial={{ scaleX: 0.12, scaleY: 0.4, opacity: 0 }}
                        animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                        exit={{ scaleX: 2.8, scaleY: 0.15, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 480,
                          damping: 20,
                          opacity: { duration: 0.12, ease: "easeOut" },
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
