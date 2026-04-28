import { ShieldCheck, Award, Sigma } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CARD_SHADOW, CARD_HOVER_SHADOW, popBy } from "@/lib/popColors";

const MotionLink = motion(Link);

const HIGHLIGHTS = [
  {
    id: "comptia-security-plus-sy0701",
    name: "CompTIA Security+",
    sub: "SY0-701",
    issuer: "CompTIA",
    icon: ShieldCheck,
  },
  {
    id: "lssbb-includes-belts",
    name: "Lean Six Sigma Black Belt",
    sub: "Incl. White, Yellow, Green Belts",
    issuer: "Council for Six Sigma Certification",
    icon: Sigma,
  },
  {
    id: "itsp-cybersecurity",
    name: "IT Specialist – Cybersecurity",
    sub: "Certiport / Pearson VUE",
    issuer: "IT Specialist Series",
    icon: Award,
  },
];

export function CredentialHighlights() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Section id="credentials" className="container">
      <Reveal className="mb-4">
        {!isDark && <span className="section-accent-bar bg-pop-lime" aria-hidden />}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 03" : "03 ·"} credentials
        </span>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {isDark ? (
              <>
                <span className="heading-face">Featured </span>
                <span className="text-neon">certs</span>
                <span className="heading-face">.</span>
              </>
            ) : (
              <>
                Featured{" "}
                <span className="relative inline-block text-primary">
                  certs
                  <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
                </span>
                .
              </>
            )}
          </h2>
        </Reveal>

        <Reveal>
          <Link
            to="/about#credentials"
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isDark ? "text-primary hover:text-primary/80" : "text-primary hover:underline"
            )}
          >
            See all 13 credentials →
          </Link>
        </Reveal>
      </div>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 sm:grid-cols-3"
      >
        {HIGHLIGHTS.map((cred, i) => {
          const Icon = cred.icon;
          return (
            <MotionLink
              key={cred.id}
              to={`/credentials/${cred.id}`}
              aria-label={`${cred.name} — view details`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: spring.soft },
              }}
              whileHover={{ y: -4, rotate: isDark ? 0 : i % 2 === 0 ? 1.5 : -1.5 }}
              transition={spring.snap}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 block transition-colors",
                isDark
                  ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300 hover:border-primary/50 hover:shadow-neon-cyan"
                  : cn(
                      "border border-border bg-card/80 backdrop-blur-sm",
                      popBy(i, CARD_SHADOW),
                      popBy(i, CARD_HOVER_SHADOW)
                    )
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    isDark
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : i === 0
                        ? "bg-primary text-primary-foreground"
                        : i === 1
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{cred.issuer}</div>
                  <div className={cn("mt-1 text-base font-semibold leading-snug", isDark && "text-neon")}>{cred.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{cred.sub}</div>
                </div>
              </div>

              <div
                className={cn(
                  "absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20",
                  isDark ? "bg-primary" : i === 0 ? "bg-primary" : i === 1 ? "bg-secondary" : "bg-accent"
                )}
              />
            </MotionLink>
          );
        })}
      </motion.div>
    </Section>
  );
}
