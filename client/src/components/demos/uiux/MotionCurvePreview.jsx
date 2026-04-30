import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/* Curves here are chosen to *not* duplicate Design system tokens → Motion (soft / snap / bouncy springs, ease-out, ease-in-out). */
const CURVES = [
  {
    name: "linear",
    label: "Linear",
    ease: { type: "tween", ease: "linear", duration: 0.75 },
    code: `transition={{
  type: 'tween',
  ease: 'linear',
  duration: 0.75,
}}`,
    note: "Constant speed: scrubbers, loaders, anything that should feel neutral.",
  },
  {
    name: "ease-in",
    label: "Ease In",
    ease: { type: "tween", ease: "easeIn", duration: 0.7 },
    code: `transition={{
  type: 'tween',
  ease: 'easeIn',
  duration: 0.7,
}}`,
    note: "Creeps in, then accelerates, common for things leaving focus.",
  },
  {
    name: "circ-out",
    label: "Circ Out",
    ease: { type: "tween", ease: [0, 0, 0.55, 1], duration: 0.65 },
    code: `transition={{
  type: 'tween',
  ease: [0, 0, 0.55, 1],
  duration: 0.65,
}}`,
    note: "Circular deceleration: long, soft landing.",
  },
  {
    name: "back-out",
    label: "Back Out",
    ease: { type: "tween", ease: [0.175, 0.885, 0.32, 1.275], duration: 0.65 },
    code: `transition={{
  type: 'tween',
  ease: [0.175, 0.885, 0.32, 1.275],
  duration: 0.65,
}}`,
    note: "Passes the end value slightly, then settles (overshoot without a physics spring).",
  },
  {
    name: "anticipate",
    label: "Anticipate",
    ease: { type: "tween", ease: [0.36, 0, 0.66, -0.56], duration: 0.55 },
    code: `transition={{
  type: 'tween',
  ease: [0.36, 0, 0.66, -0.56],
  duration: 0.55,
}}`,
    note: "Bezier dips below zero: wind-up before the main move (anticipate-style).",
  },
  {
    name: "emphasized",
    label: "Emphasized (Material)",
    ease: { type: "tween", ease: [0.2, 0, 0, 1], duration: 0.55 },
    code: `transition={{
  type: 'tween',
  ease: [0.2, 0, 0, 1],
  duration: 0.55,
}}`,
    note: "Standard expressive decel, familiar from Material-style motion.",
  },
  {
    name: "expo-out",
    label: "Expo Out",
    ease: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.55 },
    code: `transition={{
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.55,
}}`,
    note: "Snappy start, very soft finish, common in iOS-feeling transitions.",
  },
  {
    name: "cubic-overshoot",
    label: "Cubic Overshoot",
    ease: { type: "tween", ease: [0.34, 1.56, 0.64, 1], duration: 0.55 },
    code: `transition={{
  type: 'tween',
  ease: [0.34, 1.56, 0.64, 1],
  duration: 0.55,
}}`,
    note: "Bezier pushes past 1 on the graph: playful, cartoony settle.",
  },
];

const TRACK_GUTTER_PX = 8;
const DOT_PX = 16;

function BallTrack({ curve, isHovered, prefersReduced, isDark }) {
  const trackRef = useRef(null);
  const [travelPx, setTravelPx] = useState(0);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setTravelPx(Math.max(0, w - 2 * TRACK_GUTTER_PX - DOT_PX));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const active = !prefersReduced && isHovered && travelPx > 0;

  return (
    <div
      ref={trackRef}
      className="relative h-6 w-full overflow-hidden rounded-full"
    >
      <div
        className={cn(
          "absolute left-2 right-2 top-1/2 h-px -translate-y-1/2",
          isDark ? "bg-border" : "bg-border"
        )}
      />
      {/* Wrapper keeps vertical centering: Framer's `x` overwrites transform on the motion node */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <motion.div
          className={cn(
            "block h-4 w-4 rounded-full will-change-transform",
            isDark ? "bg-primary shadow-neon-cyan" : "bg-foreground"
          )}
          initial={false}
          animate={active ? { x: [0, travelPx] } : { x: 0 }}
          transition={
            active
              ? {
                  ...curve.ease,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 0.35,
                }
              : { duration: 0.15 }
          }
        />
      </div>
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
      description="Hover a tile to see the animation and the code that produces it."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-start">
        {CURVES.map((curve) => {
          const isHovered = hovered === curve.name;
          return (
            <div
              key={curve.name}
              onMouseEnter={() => setHovered(curve.name)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex flex-col rounded-2xl border p-3 transition-colors cursor-default",
                isHovered
                  ? isDark ? "border-primary/50 bg-primary/5" : "border-foreground bg-accent/10"
                  : "border-border bg-card/60"
              )}
            >
              <div className="mb-2 shrink-0">
                <BallTrack curve={curve} isHovered={isHovered} prefersReduced={prefersReduced} isDark={isDark} />
              </div>
              <div className="text-sm font-semibold leading-tight">{curve.label}</div>
              <div className="mt-1 shrink-0 text-[11px] leading-snug text-muted-foreground">{curve.note}</div>
              <div className="mt-2 shrink-0">
                {isHovered && (
                  <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "max-h-[6rem] max-w-full overflow-y-auto overscroll-contain rounded-md p-1.5 font-mono text-[9px] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                      isDark ? "bg-muted/40" : "bg-muted/60"
                    )}
                  >
                    {curve.code}
                  </motion.pre>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DemoSection>
  );
}
