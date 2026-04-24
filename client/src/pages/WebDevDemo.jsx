import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Code2, Zap, Accessibility, Layers, Monitor, Smartphone, Tablet } from "lucide-react";
import { ServicePageLayout } from "@/pages/ServicePageLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BeforeAfterSlider } from "@/components/demos/web/BeforeAfterSlider";
import { PerformanceScoreCard } from "@/components/demos/web/PerformanceScoreCard";
import { ProjectTimeline } from "@/components/demos/web/ProjectTimeline";
import { TechStackGalaxy } from "@/components/demos/web/TechStackGalaxy";
import { ComponentPlayground } from "@/components/demos/web/ComponentPlayground";
import { WebCaseStudy } from "@/components/demos/shared/CaseStudySnapshot";
import { WebPricingCard } from "@/components/demos/shared/PricingCard";
import { FAQAccordion } from "@/components/demos/shared/FAQAccordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { WEB_DEV_FAQS, WORDPRESS_FAQS } from "@/data/faqs";
import { OtherServicesNav } from "@/components/demos/shared/OtherServicesNav";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function WebDevDemo() {
  return (
    <ServicePageLayout
      eyebrow="01 · service / web development"
      title="Web Development"
      tagline="Fast, accessible, beautifully animated websites and web apps, built with React, Vite, Tailwind, and shipped with care."
      tags={["React", "Vite", "Tailwind", "Framer Motion", "shadcn/ui", "accessibility"]}
    >
      <FeatureGrid />
      <BeforeAfterSlider />
      <div className="mt-16">
        <DevicePreview />
      </div>
      <PerformanceScoreCard />
      <div className="mt-16">
        <LiveCodeDemo />
      </div>
      <TechStackGalaxy />
      <ComponentPlayground />
      <ProjectTimeline />
      <WebCaseStudy />
      <WebPricingCard />
      <section id="inquiry" className="mt-16 scroll-mt-20">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">start a project</div>
          <h2 className="text-2xl font-bold">Let&apos;s build something</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Tell me what you&apos;re working on. I&apos;ll get back to you within 48 hours.
          </p>
        </div>
        <ContactForm defaultService="web-development" />
      </section>
      <div className="mt-16">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">faq</div>
          <h2 className="text-2xl font-bold">Web development questions</h2>
        </div>
        <FAQAccordion items={WEB_DEV_FAQS} />
      </div>
      <div className="mt-12">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">
            wordpress track
          </div>
          <h3 className="text-xl font-bold">Thinking WordPress instead?</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            WordPress is one of the ways I deliver web-dev work — fastest path for small sites and
            anyone who wants to edit content themselves.
          </p>
        </div>
        <FAQAccordion items={WORDPRESS_FAQS} />
      </div>
      <OtherServicesNav current="web" />
    </ServicePageLayout>
  );
}

function FeatureGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const items = [
    {
      icon: Zap,
      title: "Lightning-fast",
      body: "Vite + code splitting + tree-shaken animation. Every route chunk stays lean.",
    },
    {
      icon: Accessibility,
      title: "Accessible by default",
      body: "Semantic HTML, focus-visible rings, keyboard navigation, prefers-reduced-motion.",
    },
    {
      icon: Layers,
      title: "Design-system-ready",
      body: "Tokenized Tailwind + shadcn primitives so theming and scale stay effortless.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 140, damping: 18 }}
          >
            <Card
              className={cn(
                "h-full transition-all",
                isDark
                  ? "bg-card/70 backdrop-blur hover:border-primary/50 hover:shadow-neon-cyan"
                  : "border-2 border-foreground shadow-pop"
              )}
            >
              <CardHeader>
                <div
                  className={cn(
                    "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
                    isDark
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : i === 0
                      ? "bg-primary text-primary-foreground"
                      : i === 1
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-base">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function DevicePreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [device, setDevice] = useState("desktop");

  const sizes = {
    desktop: "w-full aspect-[16/10]",
    tablet: "w-[560px] max-w-full aspect-[4/5]",
    mobile: "w-[280px] max-w-full aspect-[9/16]",
  };

  const deviceBtns = [
    { id: "desktop", icon: Monitor, label: "Desktop" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "mobile", icon: Smartphone, label: "Mobile" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Responsive, down to the pixel</h2>
        <div className="flex gap-1 rounded-xl border border-border bg-card/60 p-1 backdrop-blur">
          {deviceBtns.map((b) => {
            const Icon = b.icon;
            const active = device === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setDevice(b.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? isDark
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={active}
              >
                <Icon className="h-3.5 w-3.5" /> {b.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-start justify-center">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={cn(
            "relative overflow-hidden rounded-[22px] border-4",
            isDark ? "border-border bg-muted/40" : "border-foreground bg-background shadow-pop",
            sizes[device]
          )}
        >
          <div className="flex items-center gap-1.5 border-b border-border bg-background/80 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              https://yourproduct.app
            </span>
          </div>
          <div className="p-5">
            <div className="h-4 w-24 rounded bg-foreground/20" />
            <div className="mt-3 h-8 w-3/4 rounded bg-foreground/60" />
            <div className="mt-2 h-3 w-1/2 rounded bg-foreground/20" />
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className={cn("h-16 rounded-lg", isDark ? "bg-primary/30" : "bg-primary")} />
              <div className={cn("h-16 rounded-lg", isDark ? "bg-secondary/30" : "bg-secondary")} />
              <div className={cn("h-16 rounded-lg", isDark ? "bg-accent/30" : "bg-accent")} />
            </div>
            <div className="mt-4 h-24 rounded-lg bg-muted" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LiveCodeDemo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const barPattern = [0.35, 0.85, 0.5, 1, 0.45, 0.92, 0.6];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          component
        </div>
        <h3 className="mt-2 text-2xl font-bold">Hover the button →</h3>
        <p className="mt-3 text-muted-foreground">
          Spring motion, light sweep, and a tiny live meter — no debug flags, just
          feedback you can feel.
        </p>

        <div className="mt-8 flex flex-wrap items-end gap-5">
          <div className="relative">
            {/* Outer pulse ring on hover */}
            <motion.div
              className={cn(
                "pointer-events-none absolute -inset-3 rounded-2xl",
                isDark ? "bg-primary/15" : "bg-primary/10"
              )}
              animate={
                prefersReduced
                  ? {}
                  : hovered
                  ? { scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }
                  : { scale: 1, opacity: 0 }
              }
              transition={
                hovered
                  ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.25 }
              }
            />
            <motion.button
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              whileHover={prefersReduced ? {} : { scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-3 font-semibold transition-shadow",
                isDark
                  ? "bg-primary text-primary-foreground shadow-neon-cyan hover:shadow-[0_0_28px_rgba(34,229,255,0.55)]"
                  : "border-2 border-foreground bg-accent text-accent-foreground shadow-pop hover:shadow-[0_8px_0_0_rgba(0,0,0,0.12)]"
              )}
            >
              <motion.span
                animate={hovered && !prefersReduced ? { rotate: [0, -8, 8, 0] } : {}}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Code2 className="h-4 w-4" />
              </motion.span>
              <span>Try me</span>
              <AnimatePresence>
                {hovered && (
                  <motion.span
                    key="sheen"
                    initial={{ x: "-120%" }}
                    animate={{ x: "220%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/2 bg-white/25 skew-x-[-20deg]"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Live meter — reacts to hover */}
          <div
            className={cn(
              "flex h-14 items-end gap-1 rounded-xl border px-3 py-2",
              isDark
                ? "border-primary/30 bg-card/50 backdrop-blur"
                : "border-foreground/20 bg-muted/40"
            )}
            aria-hidden
          >
            {barPattern.map((amp, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-1.5 rounded-full",
                  isDark ? "bg-primary" : "bg-foreground"
                )}
                initial={false}
                animate={{
                  height: prefersReduced
                    ? 10
                    : hovered
                    ? 8 + amp * 32
                    : 6 + amp * 6,
                }}
                transition={{
                  type: "spring",
                  stiffness: hovered ? 420 : 200,
                  damping: hovered ? 14 : 22,
                  delay: prefersReduced ? 0 : i * 0.03,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          source
        </div>
        <pre
          className={cn(
            "mt-2 overflow-x-auto rounded-2xl border p-5 font-mono text-xs leading-6",
            isDark
              ? "border-border bg-card/70 backdrop-blur"
              : "border-2 border-foreground bg-card shadow-pop"
          )}
        >
{`<motion.button
  whileHover={{ scale: 1.04, y: -3 }}
  whileTap={{ scale: 0.96 }}
  className="rounded-xl px-6 py-3 shadow-neon-cyan"
>
  Try me
</motion.button>`}
        </pre>
      </div>
    </div>
  );
}
