import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Network,
  Globe,
  BadgeCheck,
  Cloud,
  Code2,
  BookOpen,
  Sparkles,
  Lightbulb,
} from "lucide-react";
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
  development: Code2,
  ai: Sparkles,
  cloud: Cloud,
  foundations: Lightbulb,
  literacy: BookOpen,
  default: BadgeCheck,
};

const GROUP_ORDER = ["comptia", "it-specialist", "process", "literacy"];
const GROUP_LABELS = {
  comptia: "CompTIA",
  "it-specialist": "Certiport / Pearson VUE (IT Specialist Series)",
  process: "Process Improvement & Management",
  literacy: "Digital Literacy",
};

/** Mirrors `api/data/credentials.py` when the API is offline. */
const FALLBACK = [
  {
    id: "comptia-security-plus-sy0701",
    name: "CompTIA Security+ ce (SY0-701)",
    issuer: "CompTIA",
    category: "security",
    group: "comptia",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-artificial-intelligence",
    name: "IT Specialist – Artificial Intelligence",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "ai",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-cloud-computing",
    name: "IT Specialist – Cloud Computing",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "cloud",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-computational-thinking",
    name: "IT Specialist – Computational Thinking",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "foundations",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-cybersecurity",
    name: "IT Specialist – Cybersecurity",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "cybersecurity",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-databases",
    name: "IT Specialist – Databases",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "development",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-html-css",
    name: "IT Specialist – HTML and CSS",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "web",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-javascript",
    name: "IT Specialist – JavaScript",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "development",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-networking",
    name: "IT Specialist – Networking",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "network",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-network-security",
    name: "IT Specialist – Network Security",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "cybersecurity",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "itsp-python",
    name: "IT Specialist – Python",
    issuer: "Certiport / Pearson VUE (IT Specialist Series)",
    category: "development",
    group: "it-specialist",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "lssbb-includes-belts",
    name: "Lean Six Sigma Black Belt",
    subtitle: "Includes prior White, Yellow, and Green Belts.",
    issuer: "Council for Six Sigma Certification",
    category: "management",
    group: "process",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
  {
    id: "ic3-digital-literacy-gs6-l1",
    name: "IC3 Digital Literacy Certification GS6 Level 1",
    issuer: "Certiport",
    category: "literacy",
    group: "literacy",
    url: "https://www.credly.com/users/brant-simpson/badges",
  },
];

function groupCredentials(items) {
  const map = new Map();
  for (const c of items) {
    const g = c.group || "other";
    if (!map.has(g)) map.set(g, []);
    map.get(g).push(c);
  }
  const ordered = [];
  for (const id of GROUP_ORDER) {
    const list = map.get(id);
    if (list?.length) ordered.push({ id, label: GROUP_LABELS[id], items: list });
    map.delete(id);
  }
  for (const [id, list] of map) {
    if (list.length) ordered.push({ id, label: id, items: list });
  }
  return ordered;
}

export function Credentials({ embedded = false }) {
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

  const grouped = useMemo(() => groupCredentials(items), [items]);

  return (
    <Section
      id="credentials"
      className={cn(
        embedded
          ? "w-full max-w-none px-0 py-16 md:py-24"
          : "container"
      )}
    >
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// credentials" : "credentials ·"} vault
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Certifications & badges
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Verified credentials across security, IT Specialist tracks, process improvement, and digital literacy.
        </p>
      </Reveal>

      <div className="space-y-14">
        {grouped.map((section, sectionIdx) => {
          const tileOffset = grouped
            .slice(0, sectionIdx)
            .reduce((n, s) => n + s.items.length, 0);
          return (
            <div key={section.id}>
              <Reveal className={cn("mb-6", sectionIdx === 0 && "mt-0")}>
                <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {section.label}
                </h3>
              </Reveal>
              <motion.div
                variants={staggerContainer(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.08 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {section.items.map((cred, i) => (
                  <CredentialTile
                    key={cred.id || cred.name}
                    cred={cred}
                    colorIndex={tileOffset + i}
                    isDark={isDark}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function CredentialTile({ cred, colorIndex, isDark }) {
  const Icon = ICON_MAP[cred.category] || ICON_MAP.default;
  const href = cred.url || null;

  const inner = (
    <>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            isDark
              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
              : colorIndex % 3 === 0
              ? "bg-primary text-primary-foreground"
              : colorIndex % 3 === 1
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
          {cred.subtitle && (
            <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {cred.subtitle}
            </div>
          )}
          {cred.year && (
            <div className="mt-2 text-xs text-muted-foreground">Earned {cred.year}</div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20",
          isDark
            ? "bg-primary"
            : colorIndex % 3 === 0
            ? "bg-primary"
            : colorIndex % 3 === 1
            ? "bg-secondary"
            : "bg-accent"
        )}
      />
    </>
  );

  const tileClass = cn(
    "relative block overflow-hidden rounded-2xl p-5 transition-colors",
    isDark
      ? "border border-border bg-card/70 backdrop-blur hover:border-primary/50 hover:shadow-neon-cyan"
      : "border-2 border-foreground bg-card shadow-pop",
    href && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${cred.name}, open on Credly`}
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0, transition: spring.soft },
        }}
        whileHover={{ y: -4, rotate: isDark ? 0 : colorIndex % 2 === 0 ? 1.5 : -1.5 }}
        transition={spring.snap}
        className={tileClass}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      whileHover={{ y: -4, rotate: isDark ? 0 : colorIndex % 2 === 0 ? 1.5 : -1.5 }}
      transition={spring.snap}
      className={tileClass}
    >
      {inner}
    </motion.div>
  );
}
