import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Lock, Sparkles, Activity, Eye, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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

/** Per-project visual language, tuned for site light/dark, not generic inversion. */
const ACCENT = {
  skillswap: {
    Icon: Sparkles,
    iconWrapDark:
      "bg-gradient-to-br from-violet-500/25 to-cyan-500/20 text-cyan-200 ring-1 ring-violet-400/40",
    iconWrapLight:
      "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md",
    cardDark:
      "border-violet-500/30 hover:border-cyan-400/55 hover:shadow-[0_0_36px_-10px_rgba(34,211,238,0.35)]",
    cardLight:
      "border-violet-600/90 shadow-[6px_6px_0_0_rgb(124,58,237)] hover:shadow-[4px_4px_0_0_rgb(6,182,212)]",
    titleDark:
      "text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200",
    titleLight:
      "text-transparent bg-clip-text bg-gradient-to-r from-violet-800 via-fuchsia-700 to-cyan-700",
    meshDark: "from-violet-500/20 via-fuchsia-500/10 to-cyan-500/15",
    meshLight: "from-violet-400/25 via-fuchsia-300/20 to-cyan-300/20",
    bulletDark: "border-l-2 border-cyan-400/60 pl-3",
    bulletLight: "border-l-2 border-violet-600 pl-3",
  },
  healthhive: {
    Icon: Activity,
    iconWrapDark:
      "bg-gradient-to-br from-amber-500/25 to-emerald-500/20 text-amber-100 ring-1 ring-amber-400/35",
    iconWrapLight:
      "bg-gradient-to-br from-amber-500 to-emerald-700 text-white shadow-md",
    cardDark:
      "border-amber-500/35 hover:border-emerald-400/50 hover:shadow-[0_0_36px_-10px_rgba(52,211,153,0.35)]",
    cardLight:
      "border-amber-700 shadow-[6px_6px_0_0_rgb(180,83,9)] hover:shadow-[4px_4px_0_0_rgb(5,150,105)]",
    titleDark:
      "text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-lime-300",
    titleLight:
      "text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-orange-700 to-emerald-800",
    meshDark: "from-amber-500/20 via-yellow-500/10 to-emerald-500/15",
    meshLight: "from-amber-300/30 via-yellow-200/25 to-emerald-300/25",
    bulletDark: "border-l-2 border-emerald-400/60 pl-3",
    bulletLight: "border-l-2 border-amber-700 pl-3",
  },
  cyber: {
    Icon: null,
    iconWrapDark: "",
    iconWrapLight: "",
    cardDark: "hover:border-primary/50 hover:shadow-neon-cyan",
    cardLight: "hover:shadow-pop-primary",
    titleDark: "text-neon",
    titleLight: "",
    meshDark: "from-primary/25 via-transparent to-secondary/20",
    meshLight: "from-primary/15 via-transparent to-secondary/15",
    bulletDark: "border-l-2 border-primary/50 pl-3",
    bulletLight: "border-l-2 border-foreground/30 pl-3",
  },
  default: {
    Icon: null,
    iconWrapDark: "",
    iconWrapLight: "",
    cardDark: "hover:border-primary/50 hover:shadow-neon-cyan",
    cardLight: "hover:shadow-pop-primary",
    titleDark: "text-neon",
    titleLight: "",
    meshDark: "from-primary/25 via-transparent to-secondary/20",
    meshLight: "from-primary/15 via-transparent to-secondary/15",
    bulletDark: "border-l-2 border-primary/50 pl-3",
    bulletLight: "border-l-2 border-foreground/30 pl-3",
  },
};

function getAccent(themeKey) {
  return ACCENT[themeKey] || ACCENT.default;
}

function yearBadgeVariant(accentKey, isDark) {
  if (accentKey === "healthhive") return "accent";
  if (accentKey === "skillswap") return isDark ? "default" : "secondary";
  return isDark ? "default" : "accent";
}

const FILTER_TAGS = [
  { id: "all", label: "All" },
  { id: "offensive-security", label: "Security" },
  { id: "web", label: "Web" },
  { id: "full-stack", label: "Full-Stack" },
];

/** Mirrors `api/data/projects.py` so all four projects show even when the API is offline. */
const FALLBACK = [
  {
    id: "project-nexus",
    sort_order: 1,
    title: "Project Nexus",
    tagline: "Custom C2 framework built from scratch. Every component explainable under pressure.",
    description:
      "A modular, full-stack command-and-control framework built deliberately without off-the-shelf frameworks so every layer can be explained, modified, and defended against.",
    features: [
      "FastAPI operator server with JWT-authenticated REST interface",
      "WAL-mode SQLite + append-only JSONL hash chain for log integrity",
      "AES-GCM implant communications (per-session key negotiation)",
      "Jittered beacon intervals with proxy-aware transport",
      "Sandbox detection heuristics (timing, environment, artifact checks)",
      "17 task handlers, 18 MITRE ATT&CK techniques mapped",
      "GitHub Actions CI pipeline, Docker Compose deployment",
    ],
    tech: ["Python", "FastAPI", "SQLite (WAL)", "AES-GCM", "Docker", "JWT", "pytest"],
    tags: ["offensive-security", "infrastructure", "red-team", "python"],
    status: "private",
    year: "2026",
    last_updated: "April 2026",
    accent_theme: "cyber",
    repo_url: null,
    live_url: null,
    mitre_techniques: [
      "T1059.001","T1071.001","T1132.001","T1573.001","T1027","T1082",
      "T1083","T1057","T1016","T1033","T1105","T1041","T1070.004",
      "T1053.005","T1547.001","T1036","T1497","T1055",
    ],
    visibility_note: "Source private for OPSEC; full technical walkthrough available on request.",
  },
  {
    id: "network-scanner",
    sort_order: 2,
    title: "Network Scanner",
    tagline: "Multithreaded Python recon toolkit: host discovery, port scan, banner grabs.",
    description:
      "TCP network scanner: CIDR ping sweep, multithreaded TCP connect scans, service banner grabbing, argparse CLI, pytest suite.",
    features: [
      "CIDR ping sweep for host discovery (cross-platform)",
      "Multithreaded TCP connect port scanning with configurable thread pool",
      "Service banner grabbing with per-port timeout",
      "Text and JSON report output (--json flag)",
      "argparse CLI with discover / scan / banner subcommands",
      "pytest test suite: closed port, open port, sorted results, empty input",
    ],
    tech: ["Python", "socket", "threading", "argparse", "pytest"],
    tags: ["offensive-security", "recon", "cli", "python"],
    status: "public",
    year: "2026",
    last_updated: "April 2026",
    accent_theme: "cyber",
    repo_url: "https://github.com/Brant-100/Personal-Website/tree/main/projects/network-scanner",
    live_url: null,
    mitre_techniques: ["T1046", "T1595.001"],
    visibility_note: null,
  },
  {
    id: "skillswap",
    sort_order: 3,
    title: "SkillSwap",
    tagline: "Student talent exchange and peer-to-peer learning in a structured platform.",
    description:
      "Peer-to-peer learning web platform for sharing skills and booking sessions safely.",
    features: [
      "Peer learning sessions",
      "AI resume scanner, skill matcher, session ideas",
      "Ratings & reviews",
      "Badges, points, streaks",
    ],
    tech: ["Next.js 15", "React 19", "TypeScript", "Prisma", "PostgreSQL", "NextAuth.js", "OpenAI"],
    tags: ["edtech", "ai", "full-stack", "web"],
    status: "public",
    year: "2026",
    last_updated: "April 2026",
    accent_theme: "skillswap",
    repo_url: null,
    live_url: null,
    mitre_techniques: [],
    visibility_note: null,
  },
  {
    id: "healthhive",
    sort_order: 4,
    title: "HealthHive",
    tagline: "Team wellness tracker with group accountability inspired by the hive.",
    description:
      "Team-centric wellness app for activity logging, reminders, and group progress.",
    features: [
      "Activity tracking",
      "Team collaboration",
      "Wellness reminders",
      "Progress analytics",
    ],
    tech: ["Django 5.1", "HTML5", "CSS3", "JavaScript", "SQLite"],
    tags: ["wellness", "django", "teams", "web"],
    status: "public",
    year: "2025",
    last_updated: "2025",
    accent_theme: "healthhive",
    repo_url: null,
    live_url: null,
    mitre_techniques: [],
    visibility_note: null,
  },
];

export function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(FALLBACK);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const ctrl = new AbortController();
    api.projects({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) {
        const sorted = [...data].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));
        setItems(sorted);
      }
    });
    return () => ctrl.abort();
  }, []);

  const sorted = [...items].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));

  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((p) => (p.tags || []).includes(activeFilter));

  return (
    <Section id="projects" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 02" : "02 ·"} selected work
        </span>
      </Reveal>
      <Reveal className="mb-8 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Projects & operations
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Security-focused builds, product engineering, and wellness tooling, each with its own visual identity.
        </p>
      </Reveal>

      {/* Filter pills */}
      <Reveal className="mb-10">
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-[0.18em] transition-all",
                  isDark
                    ? isActive
                      ? "bg-primary text-primary-foreground shadow-neon-cyan"
                      : "border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                    : isActive
                    ? "border-2 border-foreground bg-primary text-primary-foreground shadow-pop"
                    : "border-2 border-foreground bg-card text-foreground hover:bg-primary/10"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={spring.soft}
          className="grid gap-6 md:grid-cols-2"
        >
          {filtered.map((p, i) => (
            <ProjectCard key={p.id || p.title} project={p} index={i} isDark={isDark} />
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

function ProjectCard({ project, index, isDark }) {
  const accentKey = project.accent_theme || "default";
  const a = getAccent(accentKey);
  const Icon = a.Icon;

  const cardBase = isDark
    ? "bg-card/70 backdrop-blur border-border"
    : "border-2 border-foreground bg-card shadow-pop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...spring.soft, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-all duration-300",
          cardBase,
          isDark ? a.cardDark : a.cardLight
        )}
      >
        {/* Theme-specific ambient mesh */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br opacity-60 blur-3xl transition-opacity group-hover:opacity-100",
            isDark ? a.meshDark : a.meshLight
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-gradient-to-tr opacity-40 blur-2xl",
            isDark ? a.meshDark : a.meshLight
          )}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {Icon && (
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    isDark ? a.iconWrapDark : a.iconWrapLight
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              )}
              <Badge
                variant={yearBadgeVariant(accentKey, isDark)}
                className={cn(
                  accentKey === "healthhive" &&
                    isDark &&
                    "font-bold tabular-nums tracking-tight text-lime-50 [text-shadow:0_1px_2px_rgb(0_0_0_/_0.75),0_0_16px_hsl(var(--accent)/0.55)]"
                )}
              >
                {project.year || "2026"}
              </Badge>

              {/* last_updated stamp */}
              {project.last_updated && (
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px]",
                  isDark ? "bg-muted/60 text-muted-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Calendar className="h-2.5 w-2.5" />
                  {project.last_updated}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              {project.status === "private" ? (
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" /> private
                </span>
              ) : (
                project.repo_url && (
                  <a href={project.repo_url} aria-label="Repository" target="_blank" rel="noreferrer" className="rounded-md p-1 hover:bg-muted">
                    <Github className="h-4 w-4 hover:text-primary" />
                  </a>
                )
              )}
              {project.live_url && (
                <a href={project.live_url} aria-label="Live" target="_blank" rel="noreferrer" className="rounded-md p-1 hover:bg-muted">
                  <ExternalLink className="h-4 w-4 hover:text-primary" />
                </a>
              )}
            </div>
          </div>

          <CardTitle
            className={cn(
              "mt-3 text-2xl md:text-3xl font-extrabold tracking-tight",
              isDark ? a.titleDark : a.titleLight || "text-foreground"
            )}
          >
            {project.title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {project.tagline}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {(project.features || []).length > 0 && (
            <ul className="mb-5 space-y-2.5 text-sm text-foreground/90">
              {(project.features || []).slice(0, 5).map((line) => (
                <li
                  key={line.slice(0, 48)}
                  className={cn(isDark ? a.bulletDark : a.bulletLight)}
                >
                  {line}
                </li>
              ))}
            </ul>
          )}

          {/* MITRE ATT&CK badges */}
          {(project.mitre_techniques || []).length > 0 && (
            <div className="mb-4">
              <div className={cn(
                "mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em]",
                isDark ? "text-accent" : "text-muted-foreground"
              )}>
                MITRE ATT&CK
              </div>
              <div className="flex flex-wrap gap-1">
                {(project.mitre_techniques || []).slice(0, 9).map((t) => (
                  <a
                    key={t}
                    href={`https://attack.mitre.org/techniques/${t.replace(".", "/")}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors",
                      isDark
                        ? "bg-accent/15 text-accent hover:bg-accent/30 ring-1 ring-accent/30"
                        : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                    )}
                  >
                    {t}
                  </a>
                ))}
                {(project.mitre_techniques || []).length > 9 && (
                  <span className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px]",
                    isDark ? "text-muted-foreground" : "text-muted-foreground"
                  )}>
                    +{project.mitre_techniques.length - 9} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Visibility note for private projects */}
          {project.visibility_note && (
            <div className={cn(
              "mb-4 flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed",
              isDark
                ? "border border-primary/20 bg-primary/5 text-primary"
                : "border border-foreground/20 bg-muted/60 text-muted-foreground"
            )}>
              <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {project.visibility_note}
            </div>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {(project.tech || []).map((t) => (
              <span
                key={t}
                className={cn(
                  "relative rounded-md px-2 py-1 font-mono text-xs",
                  accentKey === "skillswap" && isDark && "bg-violet-950/80 text-cyan-300 ring-1 ring-violet-500/30",
                  accentKey === "skillswap" && !isDark && "bg-violet-100 text-violet-900 ring-1 ring-violet-300",
                  accentKey === "healthhive" && isDark && "bg-emerald-950/60 text-amber-200 ring-1 ring-emerald-500/30",
                  accentKey === "healthhive" && !isDark && "bg-amber-50 text-emerald-900 ring-1 ring-amber-300",
                  (accentKey === "cyber" || accentKey === "default") &&
                    isDark &&
                    "bg-muted text-primary",
                  (accentKey === "cyber" || accentKey === "default") &&
                    !isDark &&
                    "bg-accent/40 text-foreground"
                )}
              >
                {t}
              </span>
            ))}
          </div>

          {project.tags && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Detail page CTA */}
          <Link
            to={`/projects/${project.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-all",
              isDark
                ? "border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
                : "border-2 border-foreground text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
            )}
          >
            view details <ArrowRight className="h-3 w-3" />
          </Link>
        </CardContent>

        {/* Cyber-style sheen; SkillSwap / HealthHive get their own mesh above */}
        {isDark && (accentKey === "cyber" || accentKey === "default") && (
          <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 blur-2xl" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
