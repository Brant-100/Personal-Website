import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items = [] }) {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(null);

  return (
    <div className={cn("space-y-2")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.id ?? i}
            className={cn(
              "flex overflow-hidden rounded-2xl transition-all duration-200",
              "flex-col rounded-2xl border shadow-presence-rest bg-card/40 backdrop-blur-sm",
              isOpen ? "border-primary/40" : "border-border"
            )}
          >
            <div className="min-w-0 flex-1">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors",
                  isOpen && "bg-primary/5",
                  !isOpen && "bg-card/60 hover:bg-muted/40"
                )}
              >
                <span className={cn("font-semibold leading-snug", "text-foreground/93")}>
                  {item.question ?? item.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "shrink-0 rounded-full border p-0.5",
                    "border-transparent text-muted-foreground"
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
                        "border-border text-muted-foreground"
                      )}
                    >
                      {item.answer ?? item.a}
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
