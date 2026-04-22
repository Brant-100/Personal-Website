import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const CURVES = [
  {
    name: "linear",
    label: "Linear",
    ease: { ease: "linear", duration: 0.6 },
    code: "transition={{ ease: 'linear', duration: 0.6 }}",
    note: "Constant velocity — feels mechanical.",
  },
  {
    name: "ease-in",
    label: "Ease In",
    ease: { ease: "easeIn", duration: 0.6 },
    code: "transition={{ ease: 'easeIn', duration: 0.6 }}",
    note: "Starts slow, accelerates — good for exits.",
  },
  {
    name: "ease-out",
    label: "Ease Out",
    ease: { ease: "easeOut", duration: 0.5 },
    code: "transition={{ ease: 'easeOut', duration: 0.5 }}",
    note: "Decelerates to rest — natural entrances.",
  },
  {
    name: "ease-in-out",
    label: "Ease In-Out",
    ease: { ease: "easeInOut", duration: 0.6 },
    code: "transition={{ ease: 'easeInOut', duration: 0.6 }}",
    note: "Accelerates then decelerates — polished.",
  },
  {
    name: "spring-soft",
    label: "Spring (soft)",
    ease: { type: "spring", stiffness: 120, damping: 20 },
    code: "transition={{ type: 'spring', stiffness: 120, damping: 20 }}",
    note: "Gentle spring — smooth, airy feel.",
  },
  {
    name: "spring-snap",
    label: "Spring (snap)",
    ease: { type: "spring", stiffness: 380, damping: 26 },
    code: "transition={{ type: 'spring', stiffness: 380, damping: 26 }}",
    note: "Fast, crisp spring — UI feels responsive.",
  },
  {
    name: "spring-bouncy",
    label: "Spring (bouncy)",
    ease: { type: "spring", stiffness: 260, damping: 14 },
    code: "transition={{ type: 'spring', stiffness: 260, damping: 14 }}",
    note: "Overshoots — playful and expressive.",
  },
  {
    name: "cubic",
    label: "Custom Cubic",
    ease: { ease: [0.34, 1.56, 0.64, 1], duration: 0.5 },
    code: "transition={{ ease: [0.34, 1.56, 0.64, 1], duration: 0.5 }}",
    note: "Custom cubic-bezier with overshoot.",
  },
];

function BallTrack({ curve, isHovered, prefersReduced, isDark }) {
  return (
    <div className="relative h-6 w-full overflow-visible">
      <div className={cn(
        "absolute top-1/2 left-2 right-2 h-px -translate-y-1/2",
        isDark ? "bg-border" : "bg-border"
      )} />
      <motion.div
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full",
          isDark ? "bg-primary shadow-neon-cyan" : "bg-foreground"
        )}
        style={{ left: 8 }}
        animate={!prefersReduced && isHovered
          ? { left: ["8px", "calc(100% - 24px)", "8px"] }
          : { left: "8px" }
        }
        transition={!prefersReduced && isHovered
          ? { ...curve.ease, repeat: Infinity, repeatDelay: 0.3 }
          : {}
        }
      />
    </div>
  );
}

export function MotionCurvePreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  return (
    <DemoSection
      eyebrow="motion curves"
      heading="Every curve, live"
      description="Hover a tile to see the animation — and the code that produces it."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CURVES.map((curve) => {
          const isHovered = hovered === curve.name;
          return (
            <div
              key={curve.name}
              onMouseEnter={() => setHovered(curve.name)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "rounded-2xl border p-4 transition-colors cursor-default",
                isHovered
                  ? isDark ? "border-primary/50 bg-primary/5" : "border-foreground bg-accent/10"
                  : "border-border bg-card/60"
              )}
            >
              <div className="mb-3">
                <BallTrack curve={curve} isHovered={isHovered} prefersReduced={prefersReduced} isDark={isDark} />
              </div>
              <div className="text-sm font-semibold">{curve.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{curve.note}</div>
              {isHovered && (
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "mt-3 overflow-x-auto rounded-lg p-2 font-mono text-[10px] leading-5",
                    isDark ? "bg-muted/40" : "bg-muted/60"
                  )}
                >
                  {curve.code}
                </motion.pre>
              )}
            </div>
          );
        })}
      </div>
    </DemoSection>
  );
}
