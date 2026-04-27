import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Lock,
  Eye,
  Calendar,
  ChevronRight,
  Lightbulb,
  Map,
  Cpu,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/** Inline fallback for when API is offline */
import { FALLBACK as PROJECT_FALLBACK } from "@/lib/projectFallback";

export function ProjectDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(
      `${import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8765" : "")}/api/projects/${id}`,
      { signal: ctrl.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => {
        const fallback = PROJECT_FALLBACK.find((p) => p.id === id);
        setProject(fallback || null);
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [id]);

  if (loading) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center py-24">
        <div className={cn("font-mono text-sm", isDark ? "text-primary" : "text-primary")}>
          {isDark ? "// loading..." : "loading..."}
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">404 · project not found</div>
        <h1 className="mt-4 text-4xl font-extrabold">Project not found.</h1>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/#projects">Back to projects</Link>
        </Button>
      </section>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.07, 0.05)}
      className="relative"
    >
      {/* Hero band */}
      <div
        className={cn(
          "relative overflow-hidden pb-16 pt-32 md:pt-40",
          isDark
            ? "bg-gradient-to-br from-background via-background to-primary/5"
            : "bg-gradient-to-br from-background via-background to-primary/10"
        )}
      >
        {isDark && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)/0.05) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)/0.05) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <Reveal className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/#projects" className="hover:text-foreground transition-colors">Projects</Link>
            <ChevronRight className="h-3 w-3" />
            <span className={isDark ? "text-primary" : "text-foreground"}>{project.title}</span>
          </Reveal>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              {/* Status / year row */}
              <Reveal className="mb-4 flex flex-wrap items-center gap-3">
                {project.status === "private" ? (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs",
                    isDark
                      ? "border border-primary/30 bg-primary/10 text-primary"
                      : "border-2 border-foreground bg-card text-foreground"
                  )}>
                    <Lock className="h-3 w-3" /> private repo
                  </span>
                ) : project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-colors",
                      isDark
                        ? "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        : "border-2 border-foreground hover:bg-muted"
                    )}
                  >
                    <Github className="h-3 w-3" /> view source
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-colors",
                      isDark
                        ? "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        : "border-2 border-foreground hover:bg-muted"
                    )}
                  >
                    <ExternalLink className="h-3 w-3" /> live site
                  </a>
                )}
                {project.year && (
                  <Badge variant={isDark ? "default" : "accent"}>{project.year}</Badge>
                )}
                {project.last_updated && (
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px]",
                    isDark ? "bg-muted/60 text-muted-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Calendar className="h-2.5 w-2.5" />
                    Updated {project.last_updated}
                  </span>
                )}
              </Reveal>

              <Reveal>
                <h1
                  className={cn(
                    "text-5xl font-extrabold tracking-tight md:text-7xl",
                    isDark ? "text-neon text-foreground" : "text-foreground"
                  )}
                >
                  {project.title}
                </h1>
              </Reveal>
              <Reveal>
                <p className={cn(
                  "mt-4 text-xl leading-relaxed",
                  isDark ? "text-primary" : "text-primary"
                )}>
                  {project.tagline}
                </p>
              </Reveal>
              <Reveal>
                <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </Reveal>

              {/* Visibility note */}
              {project.visibility_note && (
                <Reveal className={cn(
                  "mt-6 flex items-start gap-2 rounded-lg p-4 text-sm leading-relaxed",
                  isDark
                    ? "border border-primary/20 bg-primary/5 text-primary"
                    : "border-2 border-foreground bg-muted/60 text-muted-foreground"
                )}>
                  <Eye className="mt-0.5 h-4 w-4 shrink-0" />
                  {project.visibility_note}
                </Reveal>
              )}
            </div>

            {/* Tech stack sidebar */}
            <Reveal className="lg:min-w-[200px]">
              <div className={cn(
                "rounded-2xl p-5",
                isDark
                  ? "border border-border bg-card/85"
                  : "border-2 border-foreground bg-card shadow-pop"
              )}>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((t) => (
                    <span
                      key={t}
                      className={cn(
                        "rounded-md px-2 py-1 font-mono text-xs",
                        isDark ? "bg-muted text-primary" : "bg-accent/40 text-foreground"
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {(project.tags || []).length > 0 && (
                  <>
                    <div className="mt-4 mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <span key={t} className="text-[10px] uppercase tracking-widest text-muted-foreground">#{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container py-16">
        <div className="mx-auto max-w-4xl space-y-16 overflow-anchor-none">

          {/* Problem */}
          {project.problem && (
            <Reveal>
              <SectionBlock isDark={isDark} title="The problem" icon={<AlertTriangle className="h-4 w-4" />}>
                <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
              </SectionBlock>
            </Reveal>
          )}

          {/* Constraints */}
          {(project.constraints || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Constraints">
                <ul className="space-y-2">
                  {project.constraints.map((c) => (
                    <li key={c.slice(0, 40)} className={cn(
                      "text-sm text-muted-foreground border-l-2 pl-3",
                      isDark ? "border-secondary/50" : "border-foreground/30"
                    )}>{c}</li>
                  ))}
                </ul>
              </SectionBlock>
            </Reveal>
          )}

          {/* Features */}
          {(project.features || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="What it does">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f.slice(0, 48)} className={cn(
                      "rounded-lg p-3 text-sm",
                      isDark
                        ? "border border-border bg-card/60 text-foreground/90"
                        : "border border-border bg-card text-foreground/90"
                    )}>
                      {f}
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            </Reveal>
          )}

          {/* Architecture diagram */}
          {project.architecture_diagram_url && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Architecture" icon={<Cpu className="h-4 w-4" />}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl bg-muted/20",
                    isDark ? "border border-border" : "border-2 border-foreground shadow-pop"
                  )}
                >
                  <img
                    src={project.architecture_diagram_url}
                    alt={`${project.title} architecture diagram`}
                    className="h-auto w-full object-contain"
                    width={1200}
                    height={630}
                    decoding="async"
                    loading="lazy"
                  />
                </div>
              </SectionBlock>
            </Reveal>
          )}

          {/* Screenshots */}
          {(project.screenshots || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Screenshots">
                <div className="grid gap-6">
                  {project.screenshots.map((s) => (
                    <figure key={s.url}>
                      <div className={cn(
                        "overflow-hidden rounded-2xl bg-muted/20",
                        isDark ? "border border-border" : "border-2 border-foreground shadow-pop"
                      )}>
                        <img
                          src={s.url}
                          alt={s.caption}
                          className="h-auto w-full object-contain"
                          width={1200}
                          height={630}
                          decoding="async"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (img.dataset.fallbackDone) return;
                            img.dataset.fallbackDone = "1";
                            if (s.url.endsWith(".png")) img.src = s.url.replace(/\.png$/i, ".svg");
                            else if (s.url.endsWith(".svg")) img.src = s.url.replace(/\.svg$/i, ".png");
                          }}
                        />
                      </div>
                      {s.caption && (
                        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                          {s.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </SectionBlock>
            </Reveal>
          )}

          {/* MITRE ATT&CK */}
          {(project.mitre_techniques || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title={`MITRE ATT&CK: ${project.mitre_techniques.length} techniques mapped`}>
                <div className="flex flex-wrap gap-2">
                  {project.mitre_techniques.map((t) => (
                    <a
                      key={t}
                      href={`https://attack.mitre.org/techniques/${t.replace(".", "/")}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                        isDark
                          ? "border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
                          : "border border-foreground bg-card hover:bg-muted"
                      )}
                    >
                      {t}
                    </a>
                  ))}
                </div>
                <p className={cn(
                  "mt-4 text-xs",
                  isDark ? "text-muted-foreground" : "text-muted-foreground"
                )}>
                  All techniques are mapped against systems owned or explicitly authorized for testing. These mappings are used for detection engineering: understanding attacker TTPs to build better defenses.
                </p>
              </SectionBlock>
            </Reveal>
          )}

          {/* Technical decisions */}
          {(project.technical_decisions || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Key technical decisions">
                <div className="space-y-6">
                  {project.technical_decisions.map((d) => (
                    <div
                      key={d.decision.slice(0, 40)}
                      className={cn(
                        "rounded-2xl p-5",
                        isDark
                          ? "border border-border bg-card/70"
                          : "border-2 border-foreground bg-card shadow-pop"
                      )}
                    >
                      <div className={cn("mb-1 font-semibold", isDark && "text-neon")}>{d.decision}</div>
                      <div className="mb-2 text-sm text-muted-foreground leading-relaxed">
                        <span className={cn("font-mono text-[10px] uppercase tracking-widest mr-2", isDark ? "text-primary" : "text-foreground/60")}>
                          why:
                        </span>
                        {d.why}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        <span className={cn("font-mono text-[10px] uppercase tracking-widest mr-2", isDark ? "text-secondary" : "text-foreground/60")}>
                          tradeoffs:
                        </span>
                        {d.tradeoffs}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            </Reveal>
          )}

          {/* Lessons learned */}
          {(project.lessons_learned || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Lessons learned" icon={<Lightbulb className="h-4 w-4" />}>
                <ul className="space-y-3">
                  {project.lessons_learned.map((l) => (
                    <li key={l.slice(0, 48)} className={cn(
                      "rounded-lg p-3 text-sm leading-relaxed",
                      isDark
                        ? "border border-secondary/20 bg-secondary/5 text-foreground/90"
                        : "border border-foreground/20 bg-muted/60 text-foreground/90"
                    )}>
                      {l}
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            </Reveal>
          )}

          {/* Roadmap */}
          {(project.roadmap || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Roadmap" icon={<Map className="h-4 w-4" />}>
                <ul className="space-y-2">
                  {project.roadmap.map((r) => (
                    <li key={r.slice(0, 48)} className={cn(
                      "flex items-start gap-3 text-sm text-muted-foreground",
                    )}>
                      <span className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        isDark ? "bg-primary" : "bg-foreground"
                      )} />
                      {r}
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            </Reveal>
          )}

          {/* Back CTA */}
          <Reveal className="pt-4">
            <Button variant={isDark ? "default" : "pop"} asChild>
              <Link to="/#projects" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> All Projects
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </motion.div>
  );
}

function SectionBlock({ isDark, title, icon, children }) {
  return (
    <div>
      <h2
        className={cn(
          "mb-6 flex items-center gap-2 text-2xl font-extrabold tracking-tight",
          isDark && "text-neon"
        )}
      >
        {icon && (
          <span className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isDark ? "bg-primary/10 text-primary" : "bg-foreground text-background"
          )}>
            {icon}
          </span>
        )}
        {title}
      </h2>
      {children}
    </div>
  );
}
