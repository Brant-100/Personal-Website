import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const STAGES = ["Sketch", "Wireframe", "Hi-Fi"];

function SketchCard() {
  return (
    <div className="rounded-2xl border-2 p-6 md:p-8" style={{
      borderColor: "#888",
      borderStyle: "solid",
      borderRadius: 16,
    }}>
      {/* Scribble header */}
      <svg width="100%" height="28" className="mb-4">
        <line x1="0" y1="14" x2="60" y2="14" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
        <line x1="70" y1="14" x2="130" y2="14" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3" />
        <line x1="140" y1="14" x2="180" y2="14" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
      </svg>
      {/* Sketch image placeholder */}
      <div className="mb-4 flex min-h-[10rem] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400/50 bg-gray-200/30 p-6 text-center dark:bg-gray-700/20 md:min-h-[14rem] md:p-8">
        <svg width="40" height="40" className="mx-auto mb-2 opacity-30">
          <rect x="4" y="4" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="4" y1="4" x2="36" y2="36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="36" y1="4" x2="4" y2="36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
        <div className="text-xs text-gray-400">[ image ]</div>
      </div>
      {/* Text lines */}
      <div className="space-y-2">
        {[80, 60, 70, 50].map((w, i) => (
          <div key={i} className="h-2 rounded-full bg-gray-300/60 dark:bg-gray-600/60" style={{ width: `${w}%` }} />
        ))}
      </div>
      {/* Button sketch */}
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-400/60 px-4 py-2 text-xs text-gray-400">
        [ button ]
      </div>
    </div>
  );
}

function WireframeCard() {
  return (
    <div className="rounded-2xl border border-gray-400/40 bg-gray-50/50 p-6 dark:bg-gray-900/50 md:p-8">
      {/* Wireframe nav */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-300/40 pb-3">
        <div className="h-4 w-20 rounded bg-gray-300/60 dark:bg-gray-700/60" />
        <div className="flex gap-2">
          {[3, 4, 3].map((w, i) => <div key={i} className={`h-3 w-${w * 4} rounded bg-gray-300/40 dark:bg-gray-700/40`} style={{ width: w * 12 }} />)}
        </div>
      </div>
      {/* Wireframe image */}
      <div className="mb-4 flex h-36 items-center justify-center rounded-lg border border-gray-300/40 bg-gray-200/40 dark:bg-gray-700/30 md:h-48">
        <div className="font-mono text-xs text-gray-400">300 × 180</div>
      </div>
      {/* Text blocks */}
      <div className="space-y-2 mb-4">
        <div className="h-5 w-3/4 rounded bg-gray-300/60 dark:bg-gray-700/50" />
        <div className="h-3 w-full rounded bg-gray-300/40 dark:bg-gray-700/40" />
        <div className="h-3 w-5/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
      </div>
      {/* CTA */}
      <div className="h-9 w-28 rounded-lg border border-gray-400/40 bg-gray-200/40 dark:bg-gray-700/40" />
    </div>
  );
}

function HiFiCard({ isDark }) {
  return (
    <div className={cn(
      "overflow-hidden rounded-2xl",
      isDark ? "border border-primary/30 bg-card shadow-neon-cyan" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
    )}>
      {/* Hero image */}
      <div className={cn(
        "flex h-40 items-center justify-center md:h-52",
        isDark
          ? "bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10"
          : "bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"
      )}>
        <span className={cn("font-mono text-xs uppercase tracking-widest", isDark ? "text-primary" : "text-primary")}>
          featured project
        </span>
      </div>
      <div className="p-6 md:p-8">
        <div className={cn("mb-1 font-mono text-[10px] uppercase tracking-widest", isDark ? "text-accent" : "text-secondary")}>
          case study
        </div>
        <h3 className="text-lg font-extrabold leading-tight md:text-xl">A product built to convert.</h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Clean typography, accessible color, and motion that earns its keep.
        </p>
        <button className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold",
          isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
        )}>
          View case study →
        </button>
      </div>
    </div>
  );
}

export function LayoutSkeletonTransitions() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [stage, setStage] = useState(0);

  return (
    <DemoSection
      eyebrow="design process"
      heading="Sketch → Wireframe → Hi-Fi"
      description="Click the tabs to watch the same card evolve through the design process."
      onReset={() => setStage(0)}
    >
      {/* Tabs — full content width so the block reads as one column with the preview */}
      <div className="mb-6 grid w-full grid-cols-3 gap-1 rounded-xl border border-border bg-card/60 p-1">
        {STAGES.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(i)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:px-4 sm:py-1.5",
              stage === i
                ? isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={prefersReduced ? {} : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {stage === 0 && <SketchCard />}
            {stage === 1 && <WireframeCard />}
            {stage === 2 && <HiFiCard isDark={isDark} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {["Rough layout exploration — fast, disposable, zero commitment.", "Structure without color — pure layout decisions.", "Color, type, motion, and the full token system."][stage]}
      </p>
    </DemoSection>
  );
}
