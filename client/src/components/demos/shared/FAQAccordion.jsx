import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export const DEFAULT_FAQ = [
  {
    q: "How long will it take?",
    a: "Most projects land in 3–5 weeks from kick-off to launch. Simple sites can ship faster; larger apps with complex backend work take longer. I'll give you a realistic estimate after our first call — no fluff.",
  },
  {
    q: "What if I need changes after launch?",
    a: "The first 30 days are covered — bugs and minor tweaks are on me. After that I offer flexible hourly rates or a monthly retainer if you want ongoing support. Either way, you'll never be left hanging.",
  },
  {
    q: "Do you work with existing codebases or only new projects?",
    a: "Both. I'm comfortable jumping into an existing repo, getting oriented, and shipping improvements — whether that's refactoring a messy component, wiring up a new feature, or adding tests to code that doesn't have any.",
  },
  {
    q: "Do I own the code?",
    a: "Yes — fully. On project completion you own every line. I deliver the full source, remove myself from any shared accounts, and you take it wherever you want. No lock-in.",
  },
  {
    q: "How do we communicate during the project?",
    a: "However works for you. Most clients prefer a shared Slack or Discord channel for async updates plus a brief weekly check-in call. I send a written progress update every few days so you always know where things stand.",
  },
];

export function FAQAccordion({ items = DEFAULT_FAQ }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-16">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">faq</div>
        <h2 className="text-2xl font-bold">Common questions</h2>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={cn(
                "overflow-hidden rounded-2xl border transition-colors",
                isOpen
                  ? isDark ? "border-primary/40" : "border-foreground"
                  : "border-border"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors",
                  isOpen
                    ? isDark ? "bg-primary/5" : "bg-accent/20"
                    : "bg-card/60 hover:bg-muted/40"
                )}
              >
                <span className="font-medium">{item.q}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="shrink-0"
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
                    <p className="px-5 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
