import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * CaseStudySnapshot — one per service page.
 * @param {{ problem, approach, outcome, metric, label, accent }} props
 */
export function CaseStudySnapshot({ problem, approach, outcome, metric, label, accent }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="mt-16">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">case study</div>
        <h2 className="text-2xl font-bold">{label}</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className={cn(
          "overflow-hidden rounded-2xl",
          isDark
            ? "border border-border bg-card/70 backdrop-blur"
            : "border-2 border-foreground bg-card shadow-pop"
        )}
      >
        {/* Metric hero */}
        <div
          className="flex items-center justify-center px-6 py-10"
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${accent}15 0%, transparent 70%)`
              : `linear-gradient(135deg, ${accent}10 0%, transparent 70%)`,
          }}
        >
          <div className="text-center">
            <div
              className="text-5xl font-extrabold tracking-tight md:text-6xl"
              style={{ color: accent }}
            >
              {metric.value}
            </div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">{metric.label}</div>
          </div>
        </div>

        {/* Three-column breakdown */}
        <div className="grid divide-y border-t border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { label: "Problem", text: problem },
            { label: "Approach", text: approach },
            { label: "Outcome", text: outcome },
          ].map((col) => (
            <div key={col.label} className="px-6 py-5">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                {col.label}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{col.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Per-page variants ─── */

export function WebCaseStudy() {
  return (
    <CaseStudySnapshot
      label="Redesign that converted"
      problem="A regional business had a template site with 3.2% conversion, slow load times, and no mobile layout to speak of."
      approach="Full redesign in Figma, rebuilt in React + Tailwind with lazy routes and image optimization. Shipped in 4 weeks."
      outcome="Page load dropped from 5.8s to 0.9s. Conversion rate doubled to 6.7% in the first month post-launch."
      metric={{ value: "2×", label: "conversion rate" }}
      accent="#22E5FF"
    />
  );
}

export function UIUXCaseStudy() {
  return (
    <CaseStudySnapshot
      label="Design system that scaled"
      problem="A startup had 4 devs, 3 inconsistent button styles, no color system, and every new feature took a week just for the UI."
      approach="Built a token-based design system in Figma + Tailwind with 30 components, dark/light modes, and written usage guidelines."
      outcome="New feature UI time dropped from 5–7 days to under 1 day. Designers and devs work from the same source of truth."
      metric={{ value: "6×", label: "faster UI iteration" }}
      accent="#B678FF"
    />
  );
}

export function SoftwareCaseStudy() {
  return (
    <CaseStudySnapshot
      label="Automation that freed a team"
      problem="A small ops team spent 12+ hours a week manually pulling reports, reformatting data, and emailing CSV files."
      approach="Built a Python pipeline: daily cron job, Postgres queries, Pandas transforms, and auto-email via Resend with styled HTML tables."
      outcome="The 12-hour manual process takes 4 minutes to run and requires zero human input. The team now focuses on analysis, not data wrangling."
      metric={{ value: "12 hrs", label: "saved per week" }}
      accent="#3BF475"
    />
  );
}
