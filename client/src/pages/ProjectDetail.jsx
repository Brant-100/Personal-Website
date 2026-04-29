import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Lock,
  Calendar,
  ChevronRight,
  Lightbulb,
  Cpu,
  AlertTriangle,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LIGHT_SURFACE_CARD, stackChipLightClass, tagChipLightClass, FAQ_STRIPE, popBy } from "@/lib/popColors";

/** Deterministic hue index for rotating pop-colors (badges / tag pills). */
function popHueKey(str) {
  let h = 0;
  const s = str ?? "";
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 7)) >>> 0;
  return h % 5;
}

/** Inline fallback for when API is offline */
import { FALLBACK as PROJECT_FALLBACK } from "@/lib/projectFallback";

export function ProjectDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  // ── Lightbox state — must be declared before any early returns ─────────────
  const [lightboxIdx, setLightboxIdx] = useState(null);

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

  const lightboxOpen = lightboxIdx !== null;
  const screenshots = project?.screenshots || [];
  const allImages = [
    ...(project?.architecture_diagram_url
      ? [{ url: project.architecture_diagram_url, caption: `${project?.title} architecture diagram` }]
      : []),
    ...screenshots,
  ];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevImage = useCallback(() =>
    setLightboxIdx((i) => (i - 1 + allImages.length) % allImages.length), [allImages.length]);
  const nextImage = useCallback(() =>
    setLightboxIdx((i) => (i + 1) % allImages.length), [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);
  // ──────────────────────────────────────────────────────────────────────────

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

  const multiScreenshots = screenshots.length > 1;
  const archLightboxIdx = project.architecture_diagram_url ? 0 : null;
  const screenshotLightboxOffset = project.architecture_diagram_url ? 1 : 0;

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
          "relative pb-16 pt-32 md:pt-40",
          isDark && "bg-gradient-to-br from-background via-background to-primary/5"
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
            <Link
              to="/"
              className={cn(
                "transition-colors hover:text-foreground",
                isDark ? "hover:text-primary" : "font-medium text-foreground/65 hover:text-foreground"
              )}
            >
              Home
            </Link>
            <ChevronRight className={cn("h-3 w-3 shrink-0", !isDark && "text-primary/55")} />
            <Link
              to="/#projects"
              className={cn(
                "transition-colors hover:text-foreground",
                isDark ? "hover:text-primary" : "font-medium text-foreground/65 hover:text-foreground"
              )}
            >
              Projects
            </Link>
            <ChevronRight className={cn("h-3 w-3 shrink-0", !isDark && "text-primary/55")} />
            <span
              className={cn(
                "max-w-[min(100%,14rem)] truncate sm:max-w-none",
                isDark ? "text-primary" : "font-bold text-[hsl(var(--primary-strong))]"
              )}
            >
              {project.title}
            </span>
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
                      : cn(
                          LIGHT_SURFACE_CARD,
                          "!rounded-full font-semibold backdrop-blur-sm"
                        )
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
                        : cn(
                            LIGHT_SURFACE_CARD,
                            "!rounded-full font-semibold backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary/[0.08] hover:text-primary"
                          )
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
                        : cn(
                            LIGHT_SURFACE_CARD,
                            "!rounded-full font-semibold backdrop-blur-sm transition-colors hover:border-secondary hover:bg-secondary/[0.08] hover:text-secondary"
                          )
                    )}
                  >
                    <ExternalLink className="h-3 w-3" /> live site
                  </a>
                )}
                {project.year &&
                  (isDark ? (
                    <Badge variant="default">{project.year}</Badge>
                  ) : (
                    <span className={tagChipLightClass(String(project.year), popHueKey(project.id ?? "yr"))}>
                      {project.year}
                    </span>
                  ))}
                {project.last_updated && (
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] font-semibold",
                    isDark
                      ? "rounded-md bg-muted/60 text-muted-foreground"
                      : cn(tagChipLightClass("updated", popHueKey(project.id ?? "u")), "gap-1 py-0.5 font-semibold")
                  )}>
                    <Calendar className="h-2.5 w-2.5 shrink-0" />
                    Updated {project.last_updated}
                  </span>
                )}
              </Reveal>

              <Reveal>
                <h1
                  className={cn(
                    /* Match dark mode: JetBrains Mono overrides light global Space Grotesk on h1 */
                    "font-mono text-5xl font-extrabold tracking-tight md:text-7xl",
                    isDark ? "text-neon text-foreground" : cn("heading-face text-foreground")
                  )}
                >
                  {project.title}
                </h1>
              </Reveal>
              <Reveal>
                <p className={cn(
                  "mt-4 text-xl leading-relaxed",
                  isDark ? "text-primary" : "font-bold text-[hsl(var(--primary-strong))] shadow-[0_1px_0_hsl(var(--foreground)/0.08)]"
                )}
                >
                  {!isDark && (
                    <span
                      aria-hidden
                      className="-ml-0.5 mr-3 inline-block h-[0.75em] w-1 shrink-0 rounded-full bg-accent shadow-sm ring-2 ring-accent/50"
                    />
                  )}
                  {project.tagline}
                </p>
              </Reveal>
              <Reveal>
                <p className={cn(
                  "mt-4 max-w-xl leading-relaxed",
                  isDark ? "text-muted-foreground" : "font-medium text-foreground/87"
                )}>
                  {project.description}
                </p>
              </Reveal>

            </div>

            {/* Tech stack sidebar */}
            <Reveal className="lg:min-w-[200px]">
              <div className={cn(
                "rounded-2xl p-5 transition-shadow duration-300",
                isDark
                  ? "border border-border bg-card/85 hover:border-primary/35 hover:shadow-presence-rest"
                  : cn(
                      LIGHT_SURFACE_CARD,
                      "backdrop-blur-sm transition-colors hover:border-primary/35"
                    )
              )}>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--primary-strong))]">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((t, ti) => (
                    <span
                      key={t}
                      className={cn(
                        "font-mono text-xs",
                        isDark ? "rounded-md bg-muted px-2 py-1 text-primary" : stackChipLightClass(t, ti)
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {(project.tags || []).length > 0 && (
                  <>
                    <div className="mt-4 mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--primary-strong))]">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((t, ti) => (
                        <span
                          key={t}
                          className={cn(
                            "inline-flex items-center text-[10px] font-bold uppercase tracking-widest",
                            isDark
                              ? "rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-accent ring-1 ring-accent/35"
                              : tagChipLightClass(t, ti)
                          )}
                        >
                          #{t}
                        </span>
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
              <SectionBlock isDark={isDark} lightAnchorSurface title="The problem" icon={<AlertTriangle className="h-4 w-4" />}>
                <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
              </SectionBlock>
            </Reveal>
          )}

          {/* Constraints */}
          {(project.constraints || []).length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} lightAnchorSurface title="Constraints">
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
              <SectionBlock isDark={isDark} lightAnchorSurface title="What it does">
                <ul className="space-y-3">
                  {project.features.map((f, i) => (
                    <li key={f.slice(0, 48)} className="flex gap-3 text-sm leading-relaxed">
                      <span
                        aria-hidden
                        className={cn(
                          "mt-2 h-2 w-2 shrink-0 rounded-full",
                          isDark ? "bg-primary" : popBy(i, FAQ_STRIPE)
                        )}
                      />
                      <span className={cn("text-muted-foreground", isDark && "text-foreground/90")}>{f}</span>
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
                <div className="mx-auto flex w-full max-w-5xl justify-center">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIdx(archLightboxIdx)}
                    onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(archLightboxIdx)}
                    className={cn(
                      "inline-block max-w-full overflow-hidden rounded-2xl",
                      isDark ? "border border-border" : cn(LIGHT_SURFACE_CARD, "backdrop-blur-sm")
                    )}
                    aria-label="Expand architecture diagram"
                  >
                    <img
                      src={project.architecture_diagram_url}
                      alt={`${project.title} architecture diagram`}
                      className="block h-auto w-auto max-w-full max-h-[min(90vh,52rem)]"
                      width={1200}
                      height={630}
                      decoding="async"
                      loading="lazy"
                    />
                  </div>
                </div>
              </SectionBlock>
            </Reveal>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <Reveal>
              <SectionBlock isDark={isDark} title="Screenshots">
                <div
                  className={cn(
                    "grid items-start gap-3",
                    multiScreenshots
                      ? "sm:grid-cols-2 lg:grid-cols-3"
                      : "mx-auto max-w-2xl"
                  )}
                >
                  {screenshots.map((s, i) => (
                    <figure key={s.url} className="flex flex-col">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightboxIdx(screenshotLightboxOffset + i)}
                        onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(screenshotLightboxOffset + i)}
                        aria-label={`Expand screenshot: ${s.caption || s.url}`}
                        className={cn(
                          "overflow-hidden rounded-lg leading-none cursor-pointer",
                          isDark ? "border border-border/60" : "border border-border shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.12)]"
                        )}
                      >
                        <img
                          src={s.url}
                          alt={s.caption}
                          className="block h-auto w-full max-h-48 object-cover object-top transition-opacity hover:opacity-90"
                          width={800}
                          height={450}
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
                        <figcaption className="mt-1.5 text-[11px] leading-snug text-muted-foreground/70">
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
              <SectionBlock
                isDark={isDark}
                lightAnchorSurface
                title={`MITRE ATT&CK: ${project.mitre_techniques.length} techniques mapped`}
              >
                <div className="flex flex-wrap gap-2">
                  {project.mitre_techniques.map((t, ti) => (
                    <a
                      key={t}
                      href={`https://attack.mitre.org/techniques/${t.replace(".", "/")}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "font-mono text-xs transition-opacity",
                        isDark
                          ? "rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-accent ring-transparent hover:bg-accent/20"
                          : cn(tagChipLightClass(t, ti), "hover:opacity-90")
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
                        "rounded-2xl p-5 transition-all duration-300",
                        isDark
                          ? "border border-border bg-card/70"
                          : cn(LIGHT_SURFACE_CARD, "backdrop-blur-sm")
                      )}
                    >
                      <div className={cn("mb-1 font-semibold", isDark && "text-neon")}>{d.decision}</div>
                      <div className={cn("mb-2 text-sm leading-relaxed", isDark ? "text-muted-foreground" : "text-foreground/88")}>
                        <span className={cn("font-mono text-[10px] uppercase tracking-widest mr-2 font-semibold text-primary")}>
                          why:
                        </span>
                        {d.why}
                      </div>
                      <div className={cn("text-sm leading-relaxed", isDark ? "text-muted-foreground" : "text-foreground/82")}>
                        <span className={cn("font-mono text-[10px] uppercase tracking-widest mr-2 font-semibold text-secondary")}>
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
                        : cn(LIGHT_SURFACE_CARD, "!rounded-xl backdrop-blur-sm text-foreground/90")
                    )}>
                      {l}
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

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              src={allImages[lightboxIdx].url}
              alt={allImages[lightboxIdx].caption}
              className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallbackDone) return;
                img.dataset.fallbackDone = "1";
                const url = allImages[lightboxIdx].url;
                if (url.endsWith(".png")) img.src = url.replace(/\.png$/i, ".svg");
                else if (url.endsWith(".svg")) img.src = url.replace(/\.svg$/i, ".png");
              }}
            />

            {/* Next */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Caption + counter */}
            {allImages[lightboxIdx].caption && (
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 px-4 text-center">
                <p className="rounded-full bg-black/50 px-4 py-1.5 text-sm text-white/90">
                  {allImages[lightboxIdx].caption}
                </p>
                {allImages.length > 1 && (
                  <p className="font-mono text-xs text-white/50">
                    {lightboxIdx + 1} / {allImages.length}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function SectionBlock({ isDark, title, icon, children, lightAnchorSurface }) {
  const heading = (
    <h2
      className={cn(
        "mb-6 flex items-center gap-2 text-2xl font-extrabold tracking-tight",
        isDark && "text-neon"
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isDark
              ? "bg-primary/10 text-primary"
              : cn(
                  "border border-border bg-muted/60",
                  lightAnchorSurface ? "text-primary" : "text-[hsl(var(--primary-strong))]"
                )
          )}
        >
          {icon}
        </span>
      )}
      {title}
    </h2>
  );

  if (!isDark && lightAnchorSurface) {
    return (
      <div className={cn(LIGHT_SURFACE_CARD, "p-6 backdrop-blur-sm")}>
        {heading}
        {children}
      </div>
    );
  }

  return (
    <div>
      {heading}
      {children}
    </div>
  );
}
