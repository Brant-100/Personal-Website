import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Lock, Sparkles, Activity } from "lucide-react";
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

/** Per-project visual language — tuned for site light/dark, not generic inversion. */
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

/** Mirrors `api/data/projects.py` so all four projects show even when the API is offline. */
const FALLBACK = [
  {
    id: "skillswap",
    title: "SkillSwap",
    tagline: "Student talent exchange — peer-to-peer learning in a structured platform.",
    description:
      "Peer-to-peer learning web platform for sharing skills and booking sessions safely.",
    features: [
      "Peer learning sessions",
      "AI resume scanner, skill matcher, session ideas",
      "Ratings & reviews",
      "Badges, points, streaks",
    ],
    tech: ["Next.js 15", "React 19", "TypeScript", "Prisma", "PostgreSQL", "NextAuth.js", "OpenAI"],
    tags: ["edtech", "ai"],
    status: "public",
    year: "2026",
    accent_theme: "skillswap",
    repo_url: null,
    live_url: null,
  },
  {
    id: "healthhive",
    title: "HealthHive",
    tagline: "Team wellness tracker — group accountability inspired by the hive.",
    description:
      "Team-centric wellness app for activity logging, reminders, and group progress.",
    features: [
      "Activity tracking",
      "Team collaboration",
      "Wellness reminders",
      "Progress analytics",
    ],
    tech: ["Django 5.1", "HTML5", "CSS3", "JavaScript", "SQLite"],
    tags: ["wellness", "django"],
    status: "public",
    year: "2025",
    accent_theme: "healthhive",
    repo_url: null,
    live_url: null,
  },
  {
    id: "network-scanner",
    title: "Network Scanner",
    tagline: "Multithreaded Python recon — host discovery, port scan, banner grabs.",
    description:
      "TCP network scanner: CIDR ping sweep, threaded connect scans, banner grabbing, argparse CLI.",
    features: [],
    tech: ["Python", "asyncio", "sockets", "argparse", "pytest"],
    tags: ["offensive-security", "recon", "cli"],
    status: "public",
    year: "2026",
    accent_theme: "cyber",
    repo_url:
      "https://github.com/Brant-100/Personal-Website/tree/main/projects/network-scanner",
    live_url: null,
  },
  {
    id: "project-nexus",
    title: "Project Nexus",
    tagline: "Custom C2 framework for offensive operations.",
    description:
      "Modular C2 with AES-GCM implant comms, operator dashboard, and containerized deployment.",
    features: [],
    tech: ["Python", "FastAPI", "Docker", "AES-GCM"],
    tags: ["offensive-security", "infrastructure", "red-team"],
    status: "private",
    year: "2026",
    accent_theme: "cyber",
    repo_url: null,
    live_url: null,
  },
];

export function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    const ctrl = new AbortController();
    api.projects({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) {
        setItems(data);
      }
      /* If fetch failed (API down), keep FALLBACK — already includes Nexus + scanner. */
    });
    return () => ctrl.abort();
  }, []);

  return (
    <Section id="projects" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 02" : "02 —"} selected work
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Projects & operations
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Product engineering, wellness tooling, and security-focused builds — each with its own visual identity.
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <ProjectCard key={p.id || p.title} project={p} index={i} isDark={isDark} />
        ))}
      </div>
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...spring.soft, delay: index * 0.08 }}
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
                    "ring-1 ring-accent/50 bg-accent/30 text-accent-foreground shadow-[0_0_18px_-4px_hsl(var(--accent)/0.65),0_0_36px_-10px_hsl(var(--accent)/0.28)]"
                )}
              >
                {project.year || "2026"}
              </Badge>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              {project.status === "private" ? (
                <>
                  <Lock className="h-3 w-3" /> private
                </>
              ) : (
                project.repo_url && (
                  <a href={project.repo_url} aria-label="Repository" className="rounded-md p-1 hover:bg-muted">
                    <Github className="h-4 w-4 hover:text-primary" />
                  </a>
                )
              )}
              {project.live_url && (
                <a href={project.live_url} aria-label="Live" className="rounded-md p-1 hover:bg-muted">
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
              {(project.features || []).map((line) => (
                <li
                  key={line.slice(0, 48)}
                  className={cn(isDark ? a.bulletDark : a.bulletLight)}
                >
                  {line}
                </li>
              ))}
            </ul>
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
            <div className="flex flex-wrap gap-1.5">
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
        </CardContent>

        {/* Cyber-style sheen — SkillSwap / HealthHive get their own mesh above; cyber keeps neon wash */}
        {isDark && (accentKey === "cyber" || accentKey === "default") && (
          <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 blur-2xl" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
