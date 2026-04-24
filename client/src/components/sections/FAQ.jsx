import { motion } from "framer-motion";
import { FAQAccordion } from "@/components/demos/shared/FAQAccordion";
import { GLOBAL_FAQS } from "@/data/faqs";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * FAQ section, usable on the homepage (uses GLOBAL_FAQS by default)
 * or on any service page by passing custom `faqs`.
 *
 * @param {Array}   faqs     — defaults to GLOBAL_FAQS
 * @param {string}  title    — section heading
 * @param {string}  eyebrow  — small label above the heading
 */
export function FAQ({
  faqs = GLOBAL_FAQS,
  title = "Common questions",
  eyebrow = "FAQ",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="faq" className="container py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-3xl"
      >
        <div
          className={cn(
            "mb-3 font-mono text-xs uppercase tracking-[0.3em]",
            isDark ? "text-primary" : "text-primary"
          )}
        >
          {eyebrow}
        </div>
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mb-10 text-lg text-muted-foreground">
          What people usually want to know before we talk. Don&apos;t see your
          question?{" "}
          <a
            href="#contact"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Send it through the contact form
          </a>{" "}
          — I&apos;ll answer directly.
        </p>

        <FAQAccordion items={faqs} />
      </motion.div>
    </section>
  );
}
