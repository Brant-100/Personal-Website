import { motion } from "framer-motion";
import { Check, X, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PricingCard: engagement card with starting price + request-a-quote CTA.
 * @param {{ startsAt, engagementType, includes, excludes, note }} props
 */
export function PricingCard({ startsAt, engagementType, includes = [], excludes = [], note }) {
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
          "border border-border bg-card/70 backdrop-blur"
        )}>
          {/* Header */}
          <div className={cn(
            "px-6 py-5 border-b border-border",
            "bg-primary/5"
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
          "border border-primary/40 bg-primary/5"
        )}>
          <div className={cn("text-base font-bold", !"text-background")}>
            Not sure what you need?
          </div>
          <p className={cn("text-sm max-w-[180px]", "text-muted-foreground")}>
            Tell me what you&apos;re building and I&apos;ll send you a custom estimate.
          </p>
          <motion.button
            onClick={scrollToForm}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold",
              "bg-primary text-primary-foreground shadow-neon-cyan"
            )}
          >
            Request a quote <ArrowDown className="h-4 w-4" />
          </motion.button>
          <span className={cn("font-mono text-[10px]", "text-muted-foreground")}>
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
      startsAt="$1,200"
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
      note="Most projects start at $1,200. Final quote depends on scope discussed during discovery."
    />
  );
}

export function UIUXPricingCard() {
  return (
    <PricingCard
      startsAt="$500"
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
      note="Most projects start at $500. Final quote depends on scope discussed during discovery."
    />
  );
}

export function SoftwarePricingCard() {
  return (
    <PricingCard
      startsAt="$1,000"
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
      note="Most projects start at $1,000. Final quote depends on scope discussed during discovery."
    />
  );
}
