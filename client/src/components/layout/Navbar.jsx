import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, Terminal, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/** Ordered groups flattened into `NAV_LINKS` below (keeps edit intent in one place). */
const NAV_CLUSTERS = [
  [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ],
  [
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
  ],
  [
    { href: "/blog", label: "Blog" },
    { href: "/now", label: "Now" },
  ],
];

/** Nav link order preserved. */
const NAV_LINKS = NAV_CLUSTERS.flat();

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "testimonials", label: "Testimonials" },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef(null);
  const isHome = location.pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (e) => {
      if (mobilePanelRef.current && !mobilePanelRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

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
      {/* Top navbar: logo, page links, theme toggle */}
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

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-sm font-medium transition-colors lg:px-3",
                  location.pathname === l.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0 md:gap-3">
            <button
              type="button"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg md:hidden",
                isDark
                  ? "text-foreground hover:bg-primary/10"
                  : "text-foreground hover:bg-muted"
              )}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              aria-hidden
            />
            <motion.nav
              ref={mobilePanelRef}
              id="mobile-nav-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={cn(
                "fixed inset-y-0 right-0 z-50 flex w-[min(100%,20rem)] flex-col border-l md:hidden",
                isDark
                  ? "border-primary/20 bg-background/95 shadow-presence-rest"
                  : "border-border bg-background shadow-2xl"
              )}
              aria-label="Mobile primary"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <span className="font-mono text-sm font-bold tracking-tight">
                  brant<span className="text-primary">.</span>simpson
                </span>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      location.pathname === l.href
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Bottom floating section dock: home page only, appears after hero */}
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
