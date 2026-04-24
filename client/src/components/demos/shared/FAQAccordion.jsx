import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items = [] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.id ?? i}
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
                <span className="font-medium">{item.question ?? item.q}</span>
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
                      {item.answer ?? item.a}
                      {item.needs_review && import.meta.env.DEV && (
                        <span className="ml-2 font-mono text-[10px] text-destructive">[review]</span>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
    </div>
  );
}
