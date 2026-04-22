import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const STACK = [
  { name: "React",         color: "#61DAFB", purpose: "Component-driven UI — the whole frontend is a tree of composable, re-usable pieces." },
  { name: "Vite",          color: "#646CFF", purpose: "Sub-second dev server and fast production builds via native ESM and Rollup." },
  { name: "Tailwind",      color: "#06B6D4", purpose: "Utility-first CSS — no naming wars, no specificity bugs, consistent spacing tokens." },
  { name: "Framer Motion", color: "#FF0055", purpose: "Physics-based animations (springs, layout, presence) that feel real, not tween-y." },
  { name: "shadcn/ui",     color: "#E4E4E7", purpose: "Accessible Radix primitives with Tailwind styling — owned code, not a black-box library." },
  { name: "FastAPI",       color: "#009688", purpose: "High-performance Python API with auto-generated OpenAPI docs and Pydantic type safety." },
  { name: "Python",        color: "#FFD43B", purpose: "Backends, CLIs, data pipelines, automations — Python does it all and does it cleanly." },
  { name: "Docker",        color: "#2496ED", purpose: "Every service runs in a container so dev and prod are identical — no 'works on my machine.'" },
  { name: "TypeScript",    color: "#3178C6", purpose: "Type-safe frontend code means fewer runtime surprises and better editor autocomplete." },
  { name: "Postgres",      color: "#336791", purpose: "The relational backbone — ACID transactions, JSON columns, and rock-solid performance." },
];

function randomDrift(seed) {
  const s = seed * 137.508;
  return {
    x: [0, Math.sin(s) * 12, Math.cos(s * 0.7) * -10, 0],
    y: [0, Math.cos(s) * -10, Math.sin(s * 0.6) * 8, 0],
    duration: 5 + (seed % 4),
  };
}

export function TechStackGalaxy() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  return (
    <DemoSection
      eyebrow="tech stack"
      heading="Tools I reach for"
      description="Hover any chip to see what it does and why I use it."
    >
      <div className={cn(
        "relative rounded-2xl p-8 min-h-[280px]",
        isDark ? "border border-border bg-card/60 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
      )}>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          {STACK.map((tech, i) => (
            <div key={tech.name} className="relative">
              <motion.button
                animate={prefersReduced ? {} : {
                  x: randomDrift(i).x,
                  y: randomDrift(i).y,
                }}
                transition={prefersReduced ? {} : {
                  duration: randomDrift(i).duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                }}
                onMouseEnter={() => setHovered(tech.name)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(tech.name)}
                onBlur={() => setHovered(null)}
                whileHover={prefersReduced ? {} : { scale: 1.1, zIndex: 10 }}
                className={cn(
                  "relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  hovered === tech.name
                    ? "border-transparent text-black"
                    : isDark
                    ? "border-border bg-card/80 text-foreground hover:border-primary/40"
                    : "border-border bg-white text-foreground hover:border-foreground"
                )}
                style={hovered === tech.name ? { background: tech.color } : {}}
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                  style={{ background: tech.color }}
                />
                {tech.name}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hovered === tech.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    className={cn(
                      "absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-xl px-3 py-2.5 text-xs shadow-xl",
                      isDark
                        ? "bg-card border border-border text-foreground"
                        : "bg-white border-2 border-foreground text-foreground shadow-pop"
                    )}
                  >
                    <div className="font-semibold mb-0.5" style={{ color: tech.color }}>{tech.name}</div>
                    <div className="text-muted-foreground leading-relaxed">{tech.purpose}</div>
                    {/* Arrow */}
                    <div className={cn(
                      "absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45",
                      isDark ? "bg-card border-r border-b border-border" : "bg-white border-r-2 border-b-2 border-foreground"
                    )} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </DemoSection>
  );
}
