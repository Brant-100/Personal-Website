import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const STACK = [
  { name: "React",         color: "#61DAFB", purpose: "Component-driven UI: the whole frontend is a tree of composable, re-usable pieces." },
  { name: "Vite",          color: "#646CFF", purpose: "Sub-second dev server and fast production builds via native ESM and Rollup." },
  { name: "Tailwind",      color: "#06B6D4", purpose: "Utility-first CSS: no naming wars, no specificity bugs, consistent spacing tokens." },
  { name: "Framer Motion", color: "#FF0055", purpose: "Physics-based animations (springs, layout, presence) that feel real, not tween-y." },
  { name: "shadcn/ui",     color: "#E4E4E7", purpose: "Accessible Radix primitives with Tailwind styling (owned code, not a black-box library)." },
  { name: "FastAPI",       color: "#009688", purpose: "High-performance Python API with auto-generated OpenAPI docs and Pydantic type safety." },
  { name: "Python",        color: "#FFD43B", purpose: "Backends, CLIs, data pipelines, automations; Python does it all and does it cleanly." },
  { name: "Docker",        color: "#2496ED", purpose: "Every service runs in a container so dev and prod are identical (no “works on my machine”)." },
  { name: "TypeScript",    color: "#3178C6", purpose: "Type-safe frontend code means fewer runtime surprises and better editor autocomplete." },
  { name: "Postgres",      color: "#336791", purpose: "The relational backbone: ACID transactions, JSON columns, and rock-solid performance." },
];

const MORE = {
  name: "and more",
  color: "#94a3b8",
  purpose:
    "I'm always picking up new tools as projects call for them; this grid is just a handful of some I use day to day.",
};

function randomDrift(seed) {
  const s = seed * 137.508;
  return {
    x: [0, Math.sin(s) * 12, Math.cos(s * 0.7) * -10, 0],
    y: [0, Math.cos(s) * -10, Math.sin(s * 0.6) * 8, 0],
    duration: 5 + (seed % 4),
  };
}

function DriftingChip({ tech, driftSeed, hovered, setHovered, isDark, prefersReduced, dashedIdle }) {
  const drift = randomDrift(driftSeed);
  const isOn = hovered === tech.name;

  return (
    <motion.div
      className={cn("relative w-max", isOn && "z-30")}
      animate={prefersReduced ? {} : { x: drift.x, y: drift.y }}
      transition={prefersReduced ? {} : {
        duration: drift.duration,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "loop",
      }}
      whileHover={prefersReduced ? {} : { scale: 1.06 }}
      style={{ transformOrigin: "50% 100%" }}
    >
      <motion.button
        type="button"
        onMouseEnter={() => setHovered(tech.name)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(tech.name)}
        onBlur={() => setHovered(null)}
        className={cn(
          "relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
          isOn
            ? "border-transparent text-black"
            : dashedIdle
            ? isDark
              ? "border-dashed border-primary/40 bg-card/80 text-muted-foreground hover:border-primary/60 hover:text-foreground"
              : "border-dashed border-foreground/35 bg-card text-muted-foreground hover:border-foreground/55 hover:text-foreground"
            : isDark
            ? "border-border bg-card/80 text-foreground hover:border-primary/40"
            : "border-border bg-card text-foreground hover:border-foreground"
        )}
        style={isOn ? { background: tech.color } : {}}
      >
        <span
          className="mr-1.5 inline-block h-2 w-2 rounded-full"
          style={{ background: tech.color }}
        />
        {tech.name}
      </motion.button>

      {/* Absolutely positioned so opening the tooltip never reflows the chip row; parent carries drift only */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={cn(
              // Center with margin, not translate: Framer sets transform for y and would clobber -translate-x-1/2
              "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -ml-[7rem] rounded-xl px-3 py-2.5 text-left text-xs shadow-xl",
              isDark
                ? "bg-card border border-border text-foreground"
                : "border border-border bg-card/80 backdrop-blur-sm text-foreground shadow-soft"
            )}
          >
            <div className="mb-0.5 font-semibold" style={{ color: tech.color }}>
              {tech.name}
            </div>
            <div className="leading-relaxed text-muted-foreground">{tech.purpose}</div>
            {/* Full-width flex center: avoids left-1/2 + translate on children breaking under Framer/parent transforms */}
            <div className="pointer-events-none absolute -bottom-1.5 left-0 right-0 flex justify-center">
              <div
                className={cn(
                  "h-3 w-3 shrink-0 rotate-45",
                  isDark ? "bg-card border-r border-b border-border" : "bg-card border-r-2 border-b-2 border-foreground"
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
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
      description="Hover any chip to see what it does and why I use it. These are highlights; I bring in whatever fits the job."
    >
      <div
        className={cn(
          "relative flex flex-col gap-8 rounded-2xl p-8 min-h-[280px]",
          isDark ? "border border-border bg-card/60 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {STACK.map((tech, i) => (
            <DriftingChip
              key={tech.name}
              tech={tech}
              driftSeed={i}
              hovered={hovered}
              setHovered={setHovered}
              isDark={isDark}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>

        <div className="flex flex-1 items-end justify-center">
          <DriftingChip
            tech={MORE}
            driftSeed={STACK.length}
            hovered={hovered}
            setHovered={setHovered}
            isDark={isDark}
            prefersReduced={prefersReduced}
            dashedIdle
          />
        </div>
      </div>
    </DemoSection>
  );
}
