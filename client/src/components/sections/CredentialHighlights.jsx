import { ShieldCheck, Award, Sigma } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { cn } from "@/lib/utils";
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
    name: "IT Specialist: Cybersecurity",
    sub: "Certiport / Pearson VUE",
    issuer: "IT Specialist Series",
    icon: Award,
  },
];

export function CredentialHighlights() {
return (
    <Section id="credentials" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {"// 03"} credentials
        </span>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <>
              <span className="heading-face">Featured </span>
              <span className="text-neon">certs</span>
              <span className="heading-face">.</span>
            </>
          </h2>
        </Reveal>

        <Reveal>
          <Link
            to="/about#credentials"
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              "text-primary hover:text-primary/80"
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
              aria-label={`${cred.name}: view details`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: spring.soft },
              }}
              whileHover={{ y: -4, rotate: 0}}
              transition={spring.snap}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 block transition-colors",
                "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300 hover:border-primary/50 hover:shadow-neon-cyan"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    "bg-primary/10 text-primary ring-1 ring-primary/30"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{cred.issuer}</div>
                  <div className={cn("mt-1 text-base font-semibold leading-snug", "text-neon")}>{cred.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{cred.sub}</div>
                </div>
              </div>

              <div
                className={cn(
                  "absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20",
                  "bg-primary"
                )}
              />
            </MotionLink>
          );
        })}
      </motion.div>
    </Section>
  );
}
