import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Palette, Cpu, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CARD_SHADOW, CARD_HOVER_SHADOW, popBy } from "@/lib/popColors";

const SERVICES = [
  {
    id: "web",
    num: "01",
    label: "Web Development",
    tagline: "Fast, accessible, beautifully animated sites and apps.",
    href: "/services/web-development",
    Icon: Code2,
    bullets: [
      "React + Vite + Tailwind + Framer Motion",
      "Performance first — Lighthouse scores that matter",
      "Fully accessible (WCAG) out of the box",
      "Deployed on Vercel or your own infra",
    ],
    accent: { dark: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30" },
  },
  {
    id: "uiux",
    num: "02",
    label: "UI / UX Design",
    tagline: "Interfaces with a point of view — type, color, motion, systems.",
    href: "/services/ui-ux-design",
    Icon: Palette,
    bullets: [
      "Design token systems that scale",
      "Accessible color and contrast (WCAG AA/AAA)",
      "Type scales, motion curves, component libraries",
      "Handoff ready or implemented by me",
    ],
    accent: { dark: "text-secondary", bg: "bg-secondary/10", ring: "ring-secondary/30" },
  },
  {
    id: "software",
    num: "03",
    label: "Custom Software",
    tagline: "APIs, automations, CLIs, and internal tools that get the job done.",
    href: "/services/custom-software-solutions",
    Icon: Cpu,
    bullets: [
      "FastAPI backends with typed schemas",
      "Python automation scripts and ETL pipelines",
      "Webhook systems, integrations, background workers",
      "CLIs, internal tools, data reporting",
    ],
    accent: { dark: "text-accent", bg: "bg-accent/10", ring: "ring-accent/30" },
  },
];

export function ServicesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative pt-28 md:pt-36">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-cyber-grid bg-grid-32 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-10 top-32 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
          </>
        )}
      </div>

      <div className="container relative z-10 pb-28 md:pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <div className="mb-3">
            {!isDark && <span className="section-accent-bar bg-pop-cyan" aria-hidden />}
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              freelance services
            </div>
          </div>
          <h1
            className={cn(
              "font-mono text-4xl font-extrabold tracking-tight md:text-5xl text-foreground",
              isDark && "text-neon"
            )}
          >
            What I build
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            I work independently with founders, teams, and agencies on focused projects.
            Each service has its own interactive demo page so you can see the work before reaching out.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="mt-16 space-y-6">
          {SERVICES.map((svc, i) => {
            const Icon = svc.Icon;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 140, damping: 20 }}
              >
                <Link
                  to={svc.href}
                  className={cn(
                    "group block rounded-2xl border p-6 transition-all sm:p-8",
                    isDark
                      ? "border-border bg-card/60 backdrop-blur hover:border-primary/40 hover:bg-card/80"
                      : cn(
                          "border border-border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5",
                          popBy(i, CARD_SHADOW),
                          popBy(i, CARD_HOVER_SHADOW)
                        )
                  )}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors",
                        isDark
                          ? `${svc.accent.bg} ${svc.accent.dark} ${svc.accent.ring}`
                          : cn(
                              svc.id === "web" && "bg-primary/18 text-primary ring-primary/35",
                              svc.id === "uiux" && "bg-secondary/18 text-secondary ring-secondary/35",
                              svc.id === "software" && "bg-pop-purple/22 text-pop-purple ring-pop-purple/40"
                            )
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span
                          className={cn(
                            "font-mono text-[11px]",
                            isDark ? "text-muted-foreground/60" : "text-foreground/45"
                          )}
                        >
                          {svc.num}
                        </span>
                        <h2 className="text-xl font-extrabold leading-tight tracking-tight">
                          {svc.label}
                        </h2>
                      </div>
                      <p
                        className={cn(
                          "mt-1.5 text-sm font-semibold",
                          isDark ? "text-muted-foreground" : "text-foreground/75"
                        )}
                      >
                        {svc.tagline}
                      </p>

                      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                        {svc.bullets.map((b) => (
                          <li
                            key={b}
                            className={cn(
                              "flex items-start gap-2 text-xs font-semibold",
                              isDark ? "text-muted-foreground" : "text-foreground/78"
                            )}
                          >
                            <span
                              className={cn(
                                "mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full",
                                isDark
                                  ? svc.accent.dark.replace("text-", "bg-")
                                  : svc.id === "web"
                                    ? "bg-primary"
                                    : svc.id === "uiux"
                                      ? "bg-secondary"
                                      : "bg-pop-purple"
                              )}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      className={cn(
                        "hidden h-5 w-5 shrink-0 self-center transition-transform group-hover:translate-x-1 sm:block",
                        isDark ? "text-muted-foreground" : "text-foreground/50"
                      )}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className={cn(
            "mt-12 rounded-2xl border p-7 sm:p-9",
            isDark ? "border-border bg-card/50 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
          )}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Not sure which fits?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Most projects touch more than one area. Reach out and we can figure out scope together.
              </p>
            </div>
            <Button
              size="lg"
              variant={isDark ? "default" : "pop"}
              asChild
              className="shrink-0"
            >
              <Link to="/#contact" className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Get in touch
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
