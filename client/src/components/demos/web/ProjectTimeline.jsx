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
    duration: "~1 week",
    summary: "Clarify goals and what success looks like.",
    detail:
      "We talk through what you need, who it’s for, and what has to be on the site. You get a short written summary to approve before anything is designed.",
  },
  {
    id: "design",
    label: "Design",
    icon: Paintbrush,
    duration: "~1–2 weeks",
    summary: "Layouts first, then full visuals you can react to.",
    detail:
      "Simple layouts come first so we can agree on structure. Then you see polished screens with real colours and type. Nothing is built until you sign off on the look.",
  },
  {
    id: "build",
    label: "Build",
    icon: Code2,
    duration: "~2–4 weeks",
    summary: "The approved design becomes your real site.",
    detail:
      "I build the site from what you approved and share a private preview link so you can watch it take shape. Quick check-ins keep surprises out of the process.",
  },
  {
    id: "polish",
    label: "Polish",
    icon: Sparkles,
    duration: "~1 week",
    summary: "Speed, phones, and the little things.",
    detail:
      "Final pass on load time, how it feels on mobile, readability, and wording tweaks. This is when we tighten everything before go-live.",
  },
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    duration: "~1 week",
    summary: "Go live on your domain and hand off cleanly.",
    detail:
      "Point your domain, flip the site on, and make sure the basics are secure and backed up. You get a short walkthrough so you know what you have and where things live.",
  },
  {
    id: "support",
    label: "Support",
    icon: LifeBuoy,
    duration: "~30 days",
    summary: "Small fixes after launch, included.",
    detail:
      "For about a month after launch I handle bugs and small adjustments at no extra charge. If you want ongoing help after that, we can work that out separately.",
  },
];

export function ProjectTimeline() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState("discovery");

  const toggle = (id) => setActive((prev) => (prev === id ? null : id));
  return (
    <DemoSection
      eyebrow="process"
      heading="How a project flows"
      description="Typical order of steps for a website project. Tap a phase for a bit more detail."
    >
      {/* Horizontal timeline (desktop) */}
      <div className="hidden lg:block">
        <div className="relative flex items-start gap-0">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-5 h-px bg-border" />

          {PHASES.map((phase) => {
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
                <span className="text-[9px] text-muted-foreground/70">{phase.duration}</span>
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
                    : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
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
                    <div className="font-semibold">{phase.label} <span className="text-xs font-normal text-muted-foreground">· {phase.duration} <span className="italic">(estimate)</span></span></div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{phase.detail}</p>
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
                      : "border border-border bg-accent/30"
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
                <span className="shrink-0 text-[10px] text-muted-foreground">{phase.duration}</span>
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
                    <div className="space-y-2 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                      <p>{phase.detail}</p>
                      <p className="text-xs italic text-muted-foreground/90">{phase.duration} — estimate only; your schedule may differ.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground/80">About these dates:</span> They’re ballpark estimates for a standard site, not a fixed contract calendar. Real timelines depend on scope, how quickly feedback comes back, and how many revision rounds you need. We’ll agree on milestones for your project before work starts.
      </p>
    </DemoSection>
  );
}
