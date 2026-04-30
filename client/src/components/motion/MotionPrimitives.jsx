import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------
 * Reusable spring presets
 * --------------------------------------------------------- */
export const spring = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.9 },
  snap: { type: "spring", stiffness: 380, damping: 26 },
  bouncy: { type: "spring", stiffness: 260, damping: 14, mass: 1 },
};

/* -----------------------------------------------------------
 * Variants
 * --------------------------------------------------------- */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring.soft },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: spring.snap },
};

export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const letterStagger = {
  hidden: { opacity: 0, y: "50%", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring.snap,
  },
};

/* -----------------------------------------------------------
 * Section wrapper: whileInView stagger + scroll-based
 * reveal for any page section.
 * --------------------------------------------------------- */
export function Section({
  id,
  className,
  children,
  stagger = 0.09,
  delay = 0,
  ...rest
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(stagger, delay)}
      className={cn("relative py-24 md:py-32", className)}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

/* Reveal a single item with fadeUp */
export function Reveal({ className, as = "div", variants = fadeUp, ...rest }) {
  const Comp = motion[as] || motion.div;
  return <Comp variants={variants} className={className} {...rest} />;
}

/* Split text into words and stagger them in */
export function AnimatedHeadline({ text, className, wordClassName }) {
  const words = text.split(" ");
  return (
    <motion.h1
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.07, 0.05)}
      className={cn("flex flex-wrap gap-x-3 gap-y-1", className)}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span variants={letterStagger} className={cn("inline-block", wordClassName)}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
