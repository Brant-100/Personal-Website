import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, spring } from "@/components/motion/MotionPrimitives";
import { ProjectCard } from "@/components/sections/Projects";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { FALLBACK as PROJECT_FALLBACK } from "@/lib/projectFallback";

const FILTER_TAGS = [
  { id: "all", label: "All" },
  { id: "offensive-cyber", label: "Security" },
  { id: "full-stack", label: "Full-Stack" },
];

export function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(PROJECT_FALLBACK);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const ctrl = new AbortController();
    api.projects({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) {
        setItems([...data].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)));
      }
    });
    return () => ctrl.abort();
  }, []);

  const sorted = [...items].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));
  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((p) => (p.tags || []).includes(activeFilter));

  return (
    <div className="relative min-h-screen">
      {/* Hero band */}
      <div
        className={cn(
          "relative overflow-hidden pb-12 pt-32 md:pt-40",
          isDark
            ? "bg-gradient-to-br from-background via-background to-primary/5"
            : "bg-gradient-to-br from-background via-background to-primary/10"
        )}
      >
        {isDark && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)/0.05) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)/0.05) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}
        <div className="container relative z-10">
          <Reveal className="mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {isDark ? "// selected work" : "selected work"}
            </span>
          </Reveal>
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Projects
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Security tools, full-stack platforms, and wellness software — each
              built end-to-end with a clear technical story.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Filter + grid */}
      <div className="container py-12 md:py-16">
        {/* Filter pills */}
        <Reveal className="mb-10">
          <div className="flex flex-wrap gap-2">
            {FILTER_TAGS.map((f) => {
              const isActive = activeFilter === f.id;
              const hasMatch =
                f.id === "all" ||
                sorted.some((p) => (p.tags || []).includes(f.id));
              if (!hasMatch) return null;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-[0.18em] transition-all",
                    isDark
                      ? isActive
                        ? "bg-primary text-primary-foreground shadow-neon-cyan"
                        : "border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                      : isActive
                      ? "border-2 border-foreground bg-primary text-primary-foreground shadow-pop"
                      : "border-2 border-foreground bg-card text-foreground hover:bg-primary/10"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Project grid — same 2-col layout as homepage */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring.soft}
            className="grid items-start gap-4 md:grid-cols-2 md:gap-5"
          >
            {filtered.map((p, i) => (
              <ProjectCard key={p.id || p.title} project={p} index={i} isDark={isDark} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-16 text-center text-muted-foreground">
                No projects match this filter yet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
