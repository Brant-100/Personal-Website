import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

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
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkFor = (id) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
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
          {SECTIONS.map((l) => (
            <a
              key={l.id}
              href={linkFor(l.id)}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                "hover:text-foreground"
              )}
            >
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
