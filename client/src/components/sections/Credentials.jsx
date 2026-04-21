import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Network, Globe, BadgeCheck } from "lucide-react";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  security: ShieldCheck,
  management: Award,
  network: Network,
  web: Globe,
  cybersecurity: ShieldCheck,
  default: BadgeCheck,
};

const FALLBACK = [
  { id: "sec-plus", name: "CompTIA Security+", issuer: "CompTIA", category: "security" },
  { id: "lssbb", name: "Lean Six Sigma Black Belt", issuer: "CSSC", category: "management" },
  { id: "itsp-cyber", name: "IT Specialist — Cybersecurity", issuer: "Certiport", category: "cybersecurity" },
  { id: "itsp-net", name: "IT Specialist — Network Security", issuer: "Certiport", category: "network" },
  { id: "itsp-web", name: "IT Specialist — HTML & CSS", issuer: "Certiport", category: "web" },
];

export function Credentials() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    const ctrl = new AbortController();
    api.credentials({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) setItems(data);
    });
    return () => ctrl.abort();
  }, []);

  return (
    <Section id="credentials" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 03" : "03 —"} credentials vault
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Certifications & badges
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Verified credentials across offensive security, networking, and process engineering.
        </p>
      </Reveal>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((cred, i) => (
          <CredentialTile key={cred.id || cred.name} cred={cred} index={i} isDark={isDark} />
        ))}
      </motion.div>
    </Section>
  );
}

function CredentialTile({ cred, index, isDark }) {
  const Icon = ICON_MAP[cred.category] || ICON_MAP.default;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      whileHover={{ y: -4, rotate: isDark ? 0 : index % 2 === 0 ? 1.5 : -1.5 }}
      transition={spring.snap}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        isDark
          ? "border border-border bg-card/70 backdrop-blur hover:border-primary/50 hover:shadow-neon-cyan"
          : "border-2 border-foreground bg-card shadow-pop"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            isDark
              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
              : index % 3 === 0
              ? "bg-primary text-primary-foreground"
              : index % 3 === 1
              ? "bg-secondary text-secondary-foreground"
              : "bg-accent text-accent-foreground"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {cred.issuer || "Credential"}
          </div>
          <div className={cn("mt-1 text-base font-semibold leading-snug", isDark && "text-neon")}>
            {cred.name}
          </div>
          {cred.year && (
            <div className="mt-2 text-xs text-muted-foreground">Earned {cred.year}</div>
          )}
        </div>
      </div>

      {/* Corner accent */}
      <div
        className={cn(
          "absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20",
          isDark ? "bg-primary" : index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-secondary" : "bg-accent"
        )}
      />
    </motion.div>
  );
}
