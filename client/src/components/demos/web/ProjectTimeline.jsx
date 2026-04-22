import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Paintbrush, Code2, Sparkles, Rocket, LifeBuoy } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const PHASES = [
  {
    id: "discovery",
    label: "Discovery",
    icon: Search,
    duration: "Week 1",
    summary: "We align on goals before a single pixel is drawn.",
    detail:
      "Kick-off call, requirements doc, sitemap draft, tech-stack decision. Deliverable: a one-page brief you approve before work starts. No surprises downstream.",
  },
  {
    id: "design",
    label: "Design",
    icon: Paintbrush,
    duration: "Weeks 1–2",
    summary: "Wireframes → high-fidelity mockups, all in Figma.",
    detail:
      "Lo-fi wireframes first for layout feedback, then full colour/type/motion mockups. You see and approve every screen before I write a line of code.",
  },
  {
    id: "build",
    label: "Build",
    icon: Code2,
    duration: "Weeks 2–4",
    summary: "Clean, tested, component-driven code.",
    detail:
      "React + Vite + Tailwind + Framer Motion. Components are documented, accessibility-checked, and staged on a preview URL so you can watch progress in real time.",
  },
  {
    id: "polish",
    label: "Polish",
    icon: Sparkles,
    duration: "Week 4",
    summary: "Animations, edge cases, cross-device QA.",
    detail:
      "Performance audit, Lighthouse green pass, touch-target checks, reduced-motion support, final copy review. This is where good becomes great.",
  },
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    duration: "Week 5",
    summary: "Deploy, domain, handover docs.",
    detail:
      "Vercel / Netlify deploy with CI, custom domain, env vars locked down. You get a written handover doc and a 30-minute walkthrough call so you own what you paid for.",
  },
  {
    id: "support",
    label: "Support",
    icon: LifeBuoy,
    duration: "30 days",
    summary: "Bug fixes and small tweaks, on me.",
    detail:
      "30 days post-launch I'm available for bugs and minor adjustments at no extra charge. After that, flexible hourly or retainer options available.",
  },
];

export function ProjectTimeline() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState("discovery");

  const toggle = (id) => setActive((prev) => (prev === id ? null : id));
  const reset = () => setActive("discovery");

  return (
    <DemoSection
      eyebrow="process"
      heading="How a project flows"
      description="Click any phase to see what happens — and what you get at the end of it."
      onReset={reset}
    >
      {/* Horizontal timeline (desktop) */}
      <div className="hidden lg:block">
        <div className="relative flex items-start gap-0">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-5 h-px bg-border" />

          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            const isActive = active === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => toggle(phase.id)}
                aria-expanded={isActive}
                aria-controls={`phase-panel-${phase.id}`}
                className="group relative flex flex-1 flex-col items-center gap-2 px-2 pt-0 text-center"
              >
                <motion.div
                  animate={prefersReduced ? {} : { scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isActive
                      ? isDark
                        ? "border-primary bg-primary text-primary-foreground shadow-neon-cyan"
                        : "border-foreground bg-foreground text-background"
                      : isDark
                      ? "border-border bg-card/80 text-muted-foreground group-hover:border-primary/60 group-hover:text-primary"
                      : "border-border bg-card text-muted-foreground group-hover:border-foreground group-hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span className={cn("text-xs font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {phase.label}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/60">{phase.duration}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded panel */}
        <AnimatePresence mode="wait">
          {active && (() => {
            const phase = PHASES.find((p) => p.id === active);
            const Icon = phase.icon;
            return (
              <motion.div
                key={active}
                id={`phase-panel-${active}`}
                initial={prefersReduced ? {} : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className={cn(
                  "mt-4 rounded-2xl p-5",
                  isDark
                    ? "border border-primary/30 bg-primary/5 backdrop-blur"
                    : "border-2 border-foreground bg-card shadow-pop"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    isDark ? "bg-primary/10 text-primary" : "bg-foreground text-background"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{phase.label} <span className="font-mono text-xs text-muted-foreground">· {phase.duration}</span></div>
                    <div className="mt-1 text-sm text-muted-foreground">{phase.detail}</div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* Vertical stacked (mobile) */}
      <div className="space-y-2 lg:hidden">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          const isActive = active === phase.id;
          return (
            <div key={phase.id}>
              <button
                onClick={() => toggle(phase.id)}
                aria-expanded={isActive}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                  isActive
                    ? isDark
                      ? "border border-primary/40 bg-primary/10"
                      : "border-2 border-foreground bg-accent/30"
                    : "border border-border bg-card/60 hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isActive
                    ? isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{phase.label}</div>
                  <div className="truncate text-xs text-muted-foreground">{phase.summary}</div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{phase.duration}</span>
              </button>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={prefersReduced ? {} : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={prefersReduced ? {} : { opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-3 text-sm text-muted-foreground">{phase.detail}</div>
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
