import { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    id: "colors",
    label: "Colors",
    tokens: [
      { name: "primary",    value: "hsl(var(--primary))",    display: "#22E5FF / #FA6B1F" },
      { name: "secondary",  value: "hsl(var(--secondary))",  display: "#B678FF / #1F6BFA" },
      { name: "accent",     value: "hsl(var(--accent))",     display: "#3BF475 / #FFD028" },
      { name: "background", value: "hsl(var(--background))", display: "#070B14 / #FAFAF7" },
      { name: "muted",      value: "hsl(var(--muted))",      display: "#1a1f2e / #F0EEE9" },
    ],
    render: (token) => (
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 shrink-0 rounded-lg border border-white/10 shadow-sm"
          style={{ background: token.value }}
        />
        <div>
          <div className="text-xs font-semibold">{token.name}</div>
          <div className="font-mono text-[10px] text-muted-foreground">{token.display}</div>
        </div>
      </div>
    ),
  },
  {
    id: "spacing",
    label: "Spacing",
    tokens: [
      { name: "xs",  value: "4px" },
      { name: "sm",  value: "8px" },
      { name: "md",  value: "16px" },
      { name: "lg",  value: "24px" },
      { name: "xl",  value: "32px" },
      { name: "2xl", value: "48px" },
      { name: "3xl", value: "64px" },
    ],
    render: (token) => (
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 rounded-sm bg-primary/60"
          style={{ width: token.value, height: 16 }}
        />
        <div>
          <span className="text-xs font-semibold">{token.name}</span>
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">{token.value}</span>
        </div>
      </div>
    ),
  },
  {
    id: "radii",
    label: "Radii",
    tokens: [
      { name: "sm",   value: "4px" },
      { name: "md",   value: "8px" },
      { name: "lg",   value: "12px" },
      { name: "xl",   value: "16px" },
      { name: "2xl",  value: "20px" },
      { name: "full", value: "9999px" },
    ],
    render: (token) => (
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 shrink-0 border-2 border-primary/60 bg-primary/10"
          style={{ borderRadius: token.value }}
        />
        <div>
          <span className="text-xs font-semibold">{token.name}</span>
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">{token.value}</span>
        </div>
      </div>
    ),
  },
  {
    id: "shadows",
    label: "Shadows",
    tokens: [
      { name: "sm",    value: "0 1px 3px rgba(0,0,0,0.12)" },
      { name: "md",    value: "0 4px 12px rgba(0,0,0,0.15)" },
      { name: "lg",    value: "0 8px 24px rgba(0,0,0,0.20)" },
      { name: "xl",    value: "0 16px 48px rgba(0,0,0,0.25)" },
      { name: "pop",   value: "4px 4px 0 0 currentColor" },
      { name: "neon",  value: "0 0 16px rgba(34,229,255,0.5)" },
    ],
    render: (token) => (
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 shrink-0 rounded-lg bg-card border border-border"
          style={{ boxShadow: token.value }}
        />
        <div>
          <div className="text-xs font-semibold">{token.name}</div>
          <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">{token.value}</div>
        </div>
      </div>
    ),
  },
  {
    id: "motion",
    label: "Motion",
    tokens: [
      /* Widen spring presets so hover demos read clearly; tweens need type: "tween" or FM defaults to spring. */
      { name: "soft",   ease: { type: "spring", stiffness: 72, damping: 18, mass: 1.15 } },
      { name: "snap",   ease: { type: "spring", stiffness: 520, damping: 36 } },
      /* Enough bounce to read vs snap/soft, but damping high enough that x overshoot stays inside the track */
      { name: "bouncy", ease: { type: "spring", stiffness: 300, damping: 14 } },
      { name: "ease-out", ease: { type: "tween", ease: "easeOut", duration: 0.55 } },
      { name: "ease-in-out", ease: { type: "tween", ease: [0.65, 0, 0.35, 1], duration: 0.65 } },
    ],
    render: (token) => <MotionToken token={token} />,
  },
];

/* w-32 (128px) − left-1 (4px) − dot (16px); leave slack for spring overshoot */
const MOTION_TRAVEL = 86;

function MotionToken({ token }) {
  const [playing, setPlaying] = useState(false);
  const prefersReduced = useReducedMotion();
  const x = useMotionValue(0);
  /* Springs can undershoot past 0 on the way back; clamp so the knob never crosses the left gutter */
  const xDraw = useTransform(x, (v) => Math.max(0, v));

  const transition = useMemo(() => {
    const e = token.ease;
    if (e.type === "tween") return e;
    if (e.type === "spring") return e;
    return { type: "tween", ease: "easeOut", duration: 0.4 };
  }, [token]);

  useEffect(() => {
    if (prefersReduced) {
      x.set(playing ? MOTION_TRAVEL : 0);
      return;
    }
    const ctrl = animate(x, playing ? MOTION_TRAVEL : 0, transition);
    return () => ctrl.stop();
  }, [playing, prefersReduced, transition, x]);

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-6 w-32 shrink-0 overflow-hidden rounded-full bg-muted [contain:paint]"
        onMouseEnter={() => setPlaying(true)}
        onMouseLeave={() => setPlaying(false)}
      >
        <motion.div
          className="absolute left-1 top-1 h-4 w-4 rounded-full bg-primary"
          style={{ x: xDraw }}
        />
      </div>
      <span className="text-xs font-semibold">{token.name}</span>
      <span className="text-[10px] text-muted-foreground">(hover to play)</span>
    </div>
  );
}

export function DesignSystemTokensView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState("colors");

  return (
    <DemoSection
      eyebrow="design tokens"
      heading="The system behind the site"
      description="Color, spacing, radius, shadow, and motion: the token stack behind most modern UIs."
    >
      <div className="space-y-2">
        {CATEGORIES.map((cat) => {
          const isOpen = open === cat.id;
          return (
            <div
              key={cat.id}
              className={cn(
                "overflow-hidden rounded-2xl border transition-colors",
                isOpen
                  ? isDark ? "border-primary/40" : "border-foreground"
                  : "border-border"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : cat.id)}
                className={cn(
                  "flex w-full items-center justify-between px-5 py-4 text-left transition-colors",
                  isOpen
                    ? isDark ? "bg-primary/5" : "bg-accent/20"
                    : "bg-card/60 hover:bg-muted/40"
                )}
              >
                <span className="font-semibold">{cat.label}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={prefersReduced ? {} : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                      {cat.tokens.map((token) => (
                        <div key={token.name}>{cat.render(token)}</div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </DemoSection>
  );
}
