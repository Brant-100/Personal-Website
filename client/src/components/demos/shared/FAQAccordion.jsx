import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  CARD_HOVER_SHADOW,
  FAQ_STRIPE,
  popBy,
} from "@/lib/popColors";

export function FAQAccordion({ items = [] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(null);

  return (
    <div className={cn(isDark ? "space-y-2" : "space-y-4")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.id ?? i}
            className={cn(
              "flex overflow-hidden rounded-2xl transition-all duration-200",
              !isDark && "gap-0",
              isDark &&
                cn(
                  "flex-col rounded-2xl border shadow-presence-rest bg-card/40 backdrop-blur-sm",
                  isOpen ? "border-primary/40" : "border-border"
                ),
              !isDark &&
                cn(
                  "border border-border bg-card/80 backdrop-blur-sm",
                  isOpen
                    ? "border-primary/35 shadow-soft"
                    : cn("shadow-sm hover:border-primary/55", popBy(i, CARD_HOVER_SHADOW))
                )
            )}
          >
            {!isDark && (
              <div
                aria-hidden
                className={cn(
                  "w-1 shrink-0 self-stretch rounded-none sm:rounded-l-[10px]",
                  popBy(i, FAQ_STRIPE)
                )}
              />
            )}

            <div className="min-w-0 flex-1">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors",
                  isDark && isOpen && "bg-primary/5",
                  isDark && !isOpen && "bg-card/60 hover:bg-muted/40",
                  !isDark && isOpen && "bg-primary/[0.09]",
                  !isDark && !isOpen && "hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "font-semibold leading-snug",
                    isDark && "text-foreground/93",
                    !isDark && (!isOpen ? "text-foreground" : "text-primary")
                  )}
                >
                  {item.question ?? item.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "shrink-0 rounded-full border p-0.5",
                    isDark ? "border-transparent text-muted-foreground" : "border-foreground/25 text-foreground"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
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
                    <p
                      className={cn(
                        "border-t px-5 pb-4 pt-3 text-sm leading-relaxed",
                        isDark ? "border-border text-muted-foreground" : "border-foreground/12 text-foreground/88"
                      )}
                    >
                      {item.answer ?? item.a}
                      {item.needs_review && import.meta.env.DEV && (
                        <span className="ml-2 font-mono text-[10px] text-destructive">[review]</span>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
