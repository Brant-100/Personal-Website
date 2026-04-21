import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Lock } from "lucide-react";
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

const FALLBACK = [
  {
    id: "project-nexus",
    title: "Project Nexus",
    tagline: "Custom C2 framework for offensive operations.",
    description:
      "A modular command-and-control framework with encrypted implant comms, operator dashboard, and containerized deployment.",
    tech: ["Python", "FastAPI", "Docker", "AES-GCM"],
    tags: ["offensive-security", "infrastructure", "red-team"],
    status: "private",
    year: "2026",
  },
];

export function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    const ctrl = new AbortController();
    api.projects({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) setItems(data);
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
          A sample of recent builds — from offensive tooling to product engineering.
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
          "relative h-full overflow-hidden transition-all",
          isDark
            ? "bg-card/70 backdrop-blur border-border hover:border-primary/50 hover:shadow-neon-cyan"
            : "border-2 border-foreground shadow-pop hover:shadow-pop-primary"
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={isDark ? "default" : "accent"}>{project.year || "2026"}</Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {project.status === "private" ? (
                <>
                  <Lock className="h-3 w-3" /> private
                </>
              ) : (
                project.repo_url && (
                  <a href={project.repo_url} aria-label="Repository">
                    <Github className="h-4 w-4 hover:text-primary" />
                  </a>
                )
              )}
              {project.live_url && (
                <a href={project.live_url} aria-label="Live">
                  <ExternalLink className="h-4 w-4 hover:text-primary" />
                </a>
              )}
            </div>
          </div>
          <CardTitle
            className={cn(
              "mt-3 text-2xl md:text-3xl",
              isDark && "text-neon"
            )}
          >
            {project.title}
          </CardTitle>
          <CardDescription className="text-base">
            {project.tagline}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack — hover reveal underline animation */}
          <div className="mb-4 flex flex-wrap gap-2">
            {(project.tech || []).map((t) => (
              <span
                key={t}
                className={cn(
                  "relative rounded-md px-2 py-1 font-mono text-xs",
                  isDark
                    ? "bg-muted text-primary"
                    : "bg-accent/40 text-foreground"
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

        {/* dark-mode neon sheen on hover */}
        {isDark && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 blur-2xl" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
