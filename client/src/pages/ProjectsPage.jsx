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
  { id: "full-stack", label: "Full Stack" },
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-height backdrop: same idea as Services page — blurred orbs bleed behind header + filters + grid so the mesh never visibly restarts */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--primary)/0.05) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)/0.05) 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-10 top-32 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            {/* Soft accent low in the layout — positioned by % of page so it overlaps filters + grid, not clipped at one band */}
            <div className="absolute left-1/2 top-[45%] h-[28rem] w-[min(90vw,48rem)] -translate-x-1/2 rounded-full bg-pop-pink/[0.07] blur-3xl" />
            <div className="absolute -bottom-32 left-[15%] h-72 w-72 rounded-full bg-secondary/[0.12] blur-3xl" />
          </>
        )}
      </div>

      <div className="relative z-10">
        <div className="container pb-24 pt-32 md:pt-40 md:pb-32">
          <Reveal className="mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {isDark ? "// selected work" : "selected work"}
            </span>
          </Reveal>
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Projects
            </h1>
            <p
              className={cn(
                "mt-4 max-w-xl text-lg",
                isDark ? "text-muted-foreground" : "text-foreground/82"
              )}
            >
              Security tools, full stack platforms, and wellness software — each
              built end to end with a clear technical story.
            </p>
          </Reveal>

          {/* Filter + grid — same scrolling column as headline (backdrop already full-page) */}
          <div className="mt-10 md:mt-14">
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
                            ? "border border-primary/50 bg-primary text-primary-foreground shadow-soft-orange"
                            : "border border-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-primary/10"
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
      </div>
    </div>
  );
}
