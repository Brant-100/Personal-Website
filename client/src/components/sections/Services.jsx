import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code2, Palette, Cpu, ArrowUpRight, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, Reveal, spring } from "@/components/motion/MotionPrimitives";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CARD_SHADOW, CARD_HOVER_SHADOW, popBy } from "@/lib/popColors";

const SERVICE_ROUTES = {
  "web-development": "/services/web-development",
  "ui-ux-design": "/services/ui-ux-design",
  "custom-software-solutions": "/services/custom-software-solutions",
};

const ICONS = {
  web: Code2,
  "web-development": Code2,
  design: Palette,
  "ui-ux": Palette,
  "ui-ux-design": Palette,
  software: Cpu,
  "custom-software": Cpu,
  "custom-software-solutions": Cpu,
};

const FALLBACK = [
  {
    id: "web-development",
    title: "Web Development",
    blurb:
      "Fast, accessible, beautifully animated websites and web apps, built with React, Vite, and Tailwind.",
    icon: "web",
    bullets: ["Marketing sites", "Dashboards & portals", "Framer Motion animations"],
  },
  {
    id: "ui-ux-design",
    title: "UI / UX Design",
    blurb:
      "Interface design with a point of view: bold typography, considered motion, and accessible color.",
    icon: "design",
    bullets: ["Design systems", "Product UX audits", "Prototyping"],
  },
  {
    id: "custom-software-solutions",
    title: "Custom Software Solutions",
    blurb:
      "Bespoke tooling, APIs, and internal platforms, from Python services to full stack apps.",
    icon: "software",
    bullets: ["FastAPI / Python services", "Automation & integrations", "CLI tooling"],
  },
];

export function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    const ctrl = new AbortController();
    api.services({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) setItems(data);
    });
    return () => ctrl.abort();
  }, []);

  return (
    <Section id="services" className="container">
      <Reveal className="mb-4 flex items-center gap-2">
        {!isDark && <span className="section-accent-bar bg-pop-cyan" aria-hidden />}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 01" : "01 ·"} services
        </span>
      </Reveal>

      <Reveal className="mb-4 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {isDark ? (
            <>
              <span className="text-neon">Freelance</span>
              <span className="heading-face">{" "}work for teams</span>
              <br />
              <span className="heading-face">that want to </span>
              <span className="text-accent">ship</span>
              <span className="heading-face">.</span>
            </>
          ) : (
            <>
              Freelance work for teams
              <br />
              that want to{" "}
              <span className="relative inline-block text-primary">
                ship
                <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
              </span>
              .
            </>
          )}
        </h2>
      </Reveal>

      <Reveal className={cn("mb-12 max-w-2xl leading-relaxed", isDark ? "text-foreground/78" : "text-muted-foreground")}>
        Got something you want built? Let&apos;s make it happen.
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((svc, idx) => (
          <ServiceCard key={svc.id || svc.title} service={svc} index={idx} isDark={isDark} />
        ))}
      </div>
    </Section>
  );
}

function ServiceCard({ service, index, isDark }) {
  const Icon = ICONS[service.icon] || Sparkles;
  const route = SERVICE_ROUTES[service.id];

  // Light mode: frosted cards + soft colored shadows; featured card uses gradient border.
  // Dark mode: matte card with glowing border ring on hover.
  const CardWrapper = route ? Link : "div";
  const wrapperProps = route ? { to: route } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ ...spring.soft, delay: index * 0.08 }}
      whileHover={{ y: -6, rotate: isDark ? 0 : -1 }}
      className="group"
    >
    <CardWrapper {...wrapperProps} className="block h-full">
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-all",
          route && "cursor-pointer",
          isDark
            ? "bg-card/60 backdrop-blur border-border shadow-presence-rest transition-shadow duration-300 hover:border-primary/60 hover:shadow-neon-cyan"
            : cn(
                index === 0 ? "gradient-border-card" : "border border-border bg-card/80 backdrop-blur-sm",
                popBy(index, CARD_SHADOW),
                popBy(index, CARD_HOVER_SHADOW)
              )
        )}
      >
        {/* Decorative top bar */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1",
            index === 0 && "bg-primary",
            index === 1 && "bg-secondary",
            index === 2 && "bg-accent"
          )}
        />

        <CardHeader className="pb-4">
          <div
            className={cn(
              "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl",
              isDark
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : index === 0
                ? "bg-primary text-primary-foreground"
                : index === 1
                ? "bg-secondary text-secondary-foreground"
                : "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className={cn("flex items-center justify-between text-2xl", isDark && "heading-face")}>
            {service.title}
            <ArrowUpRight
              className={cn(
                "h-5 w-5 transition-transform",
                "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                isDark ? "text-primary" : "text-foreground/50"
              )}
            />
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {service.blurb}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="space-y-2">
            {(service.bullets || []).map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    isDark ? "bg-primary" : "bg-foreground"
                  )}
                />
                {b}
              </li>
            ))}
          </ul>

          {service.tags && (
            <div className="mt-6 flex flex-wrap gap-2">
              {service.tags.map((t) => (
                <Badge key={t} variant={isDark ? "default" : "outline"}>
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {/* subtle hover sheen (dark mode only) */}
        {isDark && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          </div>
        )}

        {route && (
          <div
            className={cn(
              "absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors",
              isDark ? "text-primary" : "text-foreground/60 group-hover:text-primary"
            )}
          >
            view demo →
          </div>
        )}
      </Card>
    </CardWrapper>
    </motion.div>
  );
}
