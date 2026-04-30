import { motion } from "framer-motion";
import { FAQAccordion } from "@/components/demos/shared/FAQAccordion";
import { GLOBAL_FAQS } from "@/data/faqs";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * FAQ section, usable on the homepage (uses GLOBAL_FAQS by default)
 * or on any service page by passing custom `faqs`.
 *
 * @param {Array}   faqs     defaults to GLOBAL_FAQS
 * @param {string}  title    section heading
 * @param {string}  eyebrow  small label above the heading
 */
export function FAQ({
  faqs = GLOBAL_FAQS,
  title = "Common questions",
  eyebrow = "FAQ",
  /** When true, omit outer `container` and reduce vertical padding (e.g. nested under contact). */
  embedded = false,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const outerClass = embedded
    ? "w-full pt-10 md:pt-14"
    : "container py-14 md:py-20";

  const Tag = embedded ? "div" : "section";

  return (
    <Tag id="faq" className={outerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-2">
          {!isDark && <span className="section-accent-bar bg-secondary" aria-hidden />}
          <div
            className={cn(
              "font-mono text-xs uppercase tracking-[0.3em]",
              isDark ? "text-primary" : "text-primary"
            )}
          >
            {eyebrow}
          </div>
        </div>
        <h2 className={cn("mb-4 text-3xl font-extrabold tracking-tight md:text-4xl", isDark && "heading-face")}>
          {title}
        </h2>
        <p
          className={cn(
            "mb-6 text-lg leading-relaxed",
            isDark ? "text-muted-foreground" : "text-foreground/80"
          )}
        >
          What people usually want to know before we talk. Don&apos;t see your
          question?{" "}
          <a
            href="#contact"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Send it through the contact form
          </a>
          , and I&apos;ll answer directly.
        </p>

        <FAQAccordion items={faqs} />
      </motion.div>
    </Tag>
  );
}
