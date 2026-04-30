import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Type, Eye, Check } from "lucide-react";
import { ServicePageLayout } from "@/pages/ServicePageLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContrastChecker } from "@/components/demos/uiux/ContrastChecker";
import { InteractiveTypeScale } from "@/components/demos/uiux/InteractiveTypeScale";
import { DesignSystemTokensView } from "@/components/demos/uiux/DesignSystemTokensView";
import { LayoutSkeletonTransitions } from "@/components/demos/uiux/LayoutSkeletonTransitions";
import { MotionCurvePreview } from "@/components/demos/uiux/MotionCurvePreview";
import { UIUXCaseStudy } from "@/components/demos/shared/CaseStudySnapshot";
import { UIUXPricingCard } from "@/components/demos/shared/PricingCard";
import { FAQAccordion } from "@/components/demos/shared/FAQAccordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { UI_UX_FAQS } from "@/data/faqs";
import { OtherServicesNav } from "@/components/demos/shared/OtherServicesNav";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function UIDesignDemo() {
  return (
    <ServicePageLayout
      eyebrow="02 · service / ui · ux design"
      title="UI / UX Design"
      tagline="Interfaces with a point of view: bold typography, considered motion, accessible color, and scalable design system thinking."
      tags={["design systems", "accessibility", "color theory", "motion", "prototyping"]}
    >
      <PrinciplesGrid />
      <div className="mt-16">
        <PaletteStudio />
      </div>
      <ContrastChecker />
      <InteractiveTypeScale />
      <div className="mt-16">
        <TypographyShowcase />
      </div>
      <DesignSystemTokensView />
      <LayoutSkeletonTransitions />
      <MotionCurvePreview />
      <UIUXCaseStudy />
      <UIUXPricingCard />
      <section id="inquiry" className="mt-16 scroll-mt-20">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">start a project</div>
          <h2 className="text-2xl font-bold">Let&apos;s design something</h2>
          <p className="mt-2 text-left text-sm text-muted-foreground max-w-xl">
            Tell me what you&apos;re working on. I&apos;ll get back to you within 48 hours.
          </p>
        </div>
        <ContactForm defaultService="ui-ux-design" />
      </section>
      <div className="mt-16">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">faq</div>
          <h2 className="text-2xl font-bold">UI / UX design questions</h2>
        </div>
        <FAQAccordion items={UI_UX_FAQS} />
      </div>
      <OtherServicesNav current="uiux" />
    </ServicePageLayout>
  );
}

function PrinciplesGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const items = [
    { icon: Palette, title: "Color with intent", body: "Every hue carries a role: hierarchy, state, emotion. No color used twice for different meaning." },
    { icon: Type, title: "Typography as system", body: "Modular scale, consistent rhythm. Headings earn weight; body breathes." },
    { icon: Eye, title: "Motion with restraint", body: "Animation reinforces structure. Springs feel physical, not decorative." },
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
                  : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
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

const PALETTES = [
  {
    id: "cyber",
    name: "Cyber",
    colors: [
      { name: "slate",   hex: "#070B14" },
      { name: "cyan",    hex: "#22E5FF" },
      { name: "purple",  hex: "#B678FF" },
      { name: "matrix",  hex: "#3BF475" },
      { name: "signal",  hex: "#FF3D7F" },
    ],
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: [
      { name: "paper",   hex: "#FAFAF7" },
      { name: "orange",  hex: "#FA6B1F" },
      { name: "azure",   hex: "#1F6BFA" },
      { name: "sun",     hex: "#FFD028" },
      { name: "ink",     hex: "#0E1322" },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    colors: [
      { name: "bone",    hex: "#F4EFE6" },
      { name: "teal",    hex: "#0F766E" },
      { name: "clay",    hex: "#C26B3B" },
      { name: "cocoa",   hex: "#3E2A1F" },
      { name: "sky",     hex: "#7AB7D9" },
    ],
  },
];

function PaletteStudio() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(PALETTES[0].id);
  const [copied, setCopied] = useState(null);
  const palette = PALETTES.find((p) => p.id === active);

  const copy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1200);
    } catch { /* no-op */ }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Palette studio</h2>
        <div className="flex gap-1 rounded-xl border border-border bg-card/60 p-1 backdrop-blur">
          {PALETTES.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        {palette.colors.map((c, i) => (
          <motion.button
            key={c.hex}
            onClick={() => copy(c.hex)}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 240, damping: 22 }}
            whileHover={{ y: -4 }}
            className={cn(
              "group relative flex aspect-[3/4] flex-col items-start justify-end overflow-hidden rounded-2xl p-4 text-left transition-shadow",
              isDark ? "shadow-lg hover:shadow-neon-cyan" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
            )}
            style={{ background: c.hex }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: contrastText(c.hex) }}
            >
              {c.name}
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: contrastText(c.hex) }}
            >
              {c.hex}
            </span>
            {copied === c.hex && (
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                <Check className="h-3 w-3" /> copied
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        tip: click a chip to copy the hex.
      </p>
    </div>
  );
}

function TypographyShowcase() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Type that carries a voice</h2>
      <div
        className={cn(
          "rounded-2xl p-8 md:p-10",
          isDark
            ? "border border-border bg-card/70 backdrop-blur"
            : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
        )}
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          display / 72
        </div>
        <div className="mt-2 font-display text-5xl md:text-7xl font-extrabold tracking-tight">
          Design sings.
        </div>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          body / 18
        </div>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-foreground/80">
          A typography system is just permissions and constraints:
          permission to be loud where it matters, constraint everywhere else.
          That&apos;s how rhythm happens.
        </p>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          mono / 13
        </div>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs text-foreground/80">
{`const type = {
  display: "Space Grotesk",
  body:    "Inter",
  mono:    "JetBrains Mono",
};`}
        </pre>
      </div>
    </div>
  );
}

function contrastText(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#0E1322" : "#FFFFFF";
}
