import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * Consistent wrapper for every demo section.
 * - eyebrow: small mono label above the heading
 * - heading: h2 text
 * - description: optional subtitle
 * - onReset: if provided, shows a reset button in the top-right
 * - children: the actual demo content
 */
export function DemoSection({ eyebrow, heading, description, onReset, className, children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className={cn("mt-16", className)}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </div>
          )}
          <h2 className="text-2xl font-bold">{heading}</h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              isDark
                ? "border border-border text-muted-foreground hover:text-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}
