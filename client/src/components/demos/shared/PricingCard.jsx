import { motion } from "framer-motion";
import { Check, X, ArrowDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * PricingCard: engagement card with starting price + request-a-quote CTA.
 * @param {{ startsAt, engagementType, includes, excludes, note }} props
 */
export function PricingCard({ startsAt, engagementType, includes = [], excludes = [], note }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const scrollToForm = () => {
    const el = document.getElementById("inquiry");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mt-16">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">pricing</div>
        <h2 className="text-2xl font-bold">How this works</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="grid gap-4 md:grid-cols-[1fr_auto]"
      >
        {/* Main card */}
        <div className={cn(
          "rounded-2xl",
          isDark
            ? "border border-border bg-card/70 backdrop-blur"
            : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
        )}>
          {/* Header */}
          <div className={cn(
            "px-6 py-5 border-b border-border",
            isDark ? "bg-primary/5" : "bg-accent/10"
          )}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
              {engagementType}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold">{startsAt}</span>
              <span className="mb-1 text-sm text-muted-foreground">starting</span>
            </div>
            {note && (
              <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>
            )}
          </div>

          {/* Includes / Excludes */}
          <div className="grid gap-0 px-6 py-5 sm:grid-cols-2 sm:gap-8">
            <div>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">
                What&apos;s included
              </div>
              <ul className="space-y-2">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {excludes.length > 0 && (
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Not included
                </div>
                <ul className="space-y-2">
                  {excludes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CTA sidebar */}
        <div className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-2xl px-8 py-8 text-center",
          isDark
            ? "border border-primary/40 bg-primary/5"
            : "border border-border bg-foreground text-background shadow-soft"
        )}>
          <div className={cn("text-base font-bold", !isDark && "text-background")}>
            Not sure what you need?
          </div>
          <p className={cn("text-sm max-w-[180px]", isDark ? "text-muted-foreground" : "text-background/70")}>
            Tell me what you&apos;re building and I&apos;ll send you a custom estimate.
          </p>
          <motion.button
            onClick={scrollToForm}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold",
              isDark
                ? "bg-primary text-primary-foreground shadow-neon-cyan"
                : "bg-background text-foreground border border-background/20"
            )}
          >
            Request a quote <ArrowDown className="h-4 w-4" />
          </motion.button>
          <span className={cn("font-mono text-[10px]", isDark ? "text-muted-foreground" : "text-background/50")}>
            reply within 48h
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Per-page variants ─── */

export function WebPricingCard() {
  return (
    <PricingCard
      startsAt="$800"
      engagementType="Project-based"
      includes={[
        "Requirements & discovery call",
        "Figma wireframes + mockups",
        "React / Vite / Tailwind build",
        "Mobile-responsive, accessible",
        "Vercel or Netlify deploy",
        "30 days post-launch support",
        "Full source code ownership",
      ]}
      excludes={[
        "Copywriting / content",
        "Custom backend / database (quoted separately)",
        "Ongoing maintenance after 30 days",
      ]}
      note="Most sites land in the $800 to $2,500 range. Larger apps or e-commerce quoted after a call."
    />
  );
}

export function UIUXPricingCard() {
  return (
    <PricingCard
      startsAt="$400"
      engagementType="Project-based"
      includes={[
        "Discovery + requirements session",
        "Wireframes (lo-fi)",
        "High-fidelity Figma mockups",
        "Light/dark mode variants",
        "Component library / token doc",
        "Handoff-ready design file",
        "One round of revisions",
      ]}
      excludes={[
        "Front-end implementation (quoted separately)",
        "User research / usability testing",
        "Motion / prototype animations beyond basics",
      ]}
      note="Scope-dependent: component library audits and full design systems are quoted individually."
    />
  );
}

export function SoftwarePricingCard() {
  return (
    <PricingCard
      startsAt="$600"
      engagementType="Project-based or hourly"
      includes={[
        "Requirements & architecture session",
        "FastAPI / Python implementation",
        "Unit tests + OpenAPI docs",
        "Container-ready deploy config",
        "Handover walkthrough call",
        "30 days bug-fix support",
        "Full source code ownership",
      ]}
      excludes={[
        "Infrastructure / cloud costs",
        "Third-party API subscriptions",
        "Ongoing feature development",
      ]}
      note="Small scripts from $200. Hourly rate available for long-running projects or retainer work."
    />
  );
}
