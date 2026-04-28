import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CARD_SHADOW, CARD_HOVER_SHADOW, popBy } from "@/lib/popColors";
import { CREDENTIAL_ICON_MAP } from "@/lib/credentialIcons";
import { FALLBACK as CREDENTIAL_FALLBACK } from "@/lib/credentialFallback";

const MotionLink = motion(Link);

const GROUP_ORDER = ["comptia", "it-specialist", "process", "literacy"];
const GROUP_LABELS = {
  comptia: "CompTIA",
  "it-specialist": "Certiport / Pearson VUE (IT Specialist Series)",
  process: "Process Improvement & Management",
  literacy: "Digital Literacy",
};

/** Mirrors `api/data/credentials.py` when the API is offline. */
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
  const [items, setItems] = useState(CREDENTIAL_FALLBACK);

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
      className={cn(embedded ? "w-full max-w-none px-0 py-16 md:py-24" : "container")}
    >
      <Reveal className="mb-4">
        {!isDark && <span className="section-accent-bar bg-pop-lime" aria-hidden />}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// credentials" : "credentials ·"} vault
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Certifications & badges</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Verified credentials across security, IT Specialist tracks, process improvement, and digital literacy.
        </p>
      </Reveal>

      <div className="space-y-14">
        {grouped.map((section, sectionIdx) => {
          const tileOffset = grouped.slice(0, sectionIdx).reduce((n, s) => n + s.items.length, 0);
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
                  <CredentialTile key={cred.id || cred.name} cred={cred} colorIndex={tileOffset + i} isDark={isDark} />
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
  const Icon = CREDENTIAL_ICON_MAP[cred.category] || CREDENTIAL_ICON_MAP.default;
  const to = `/credentials/${cred.id}`;

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
          <div className={cn("mt-1 text-base font-semibold leading-snug", isDark && "text-neon")}>{cred.name}</div>
          {cred.subtitle && (
            <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{cred.subtitle}</div>
          )}
          {cred.year && <div className="mt-2 text-xs text-muted-foreground">Earned {cred.year}</div>}
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
      ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300 hover:border-primary/50 hover:shadow-neon-cyan"
      : cn(
          "border border-border bg-card/80 backdrop-blur-sm",
          popBy(colorIndex, CARD_SHADOW),
          popBy(colorIndex, CARD_HOVER_SHADOW)
        ),
    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  );

  return (
    <MotionLink
      to={to}
      aria-label={`${cred.name} — view details`}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      whileHover={{ y: -4, rotate: isDark ? 0 : colorIndex % 2 === 0 ? 1.5 : -1.5 }}
      transition={spring.snap}
      className={tileClass}
    >
      {inner}
    </MotionLink>
  );
}
