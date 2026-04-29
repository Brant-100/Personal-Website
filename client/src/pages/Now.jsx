import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LIGHT_SURFACE_CARD } from "@/lib/popColors";

/**
 * /now: a single paragraph updated monthly.
 * Inspired by nownownow.com. No database needed; just edit this file.
 * Keep `lastUpdated` in sync whenever the sections below change.
 */
export function Now() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // REMINDER: Update this date when the content below changes.
  // A stale /now page is worse than no /now page.
  const lastUpdated = "April 2026";

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.07, 0.05)}
      className="relative pt-32 pb-24 md:pt-40 md:pb-32"
    >
      {isDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)/0.04) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)/0.04) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {isDark ? "// now" : "now ·"}
            </span>
          </Reveal>
          <Reveal>
            <h1 className={cn("mb-2 text-5xl font-extrabold tracking-tight", isDark && "text-neon")}>
              What I&apos;m doing now
            </h1>
          </Reveal>
          <Reveal>
            <p className="mb-12 font-mono text-xs text-muted-foreground">
              Last updated: {lastUpdated} · Ohio · EST
            </p>
          </Reveal>

          <div className="space-y-8">
            <Reveal>
              <NowSection isDark={isDark} title="Building">
                <p className="text-muted-foreground leading-relaxed">
                  Deep in Project Nexus Phase 2, adding a web based operator dashboard and process injection support. The core beacon and task handler infrastructure from Phase 1 is stable; Phase 2 is about operator UX and extending the technique coverage.
                </p>
              </NowSection>
            </Reveal>

            <Reveal>
              <NowSection isDark={isDark} title="Studying">
                <p className="text-muted-foreground leading-relaxed">
                  Currently in the EDPT preparation pipeline (the Air Force cyber aptitude test) for the 1B4X1 Cyber Warfare Operations track.
                </p>
              </NowSection>
            </Reveal>

            <Reveal>
              <NowSection isDark={isDark} title="Available for">
                <p className="text-muted-foreground leading-relaxed">
                  Web, software development, cybersecurity work and more. If you&apos;re building something and need a developer who also thinks about the bigger picture, let&apos;s talk.
                </p>
              </NowSection>
            </Reveal>

            <Reveal>
              <NowSection isDark={isDark} title="Writing">
                <p className="text-muted-foreground leading-relaxed">
                  I&apos;m actually iterating on the blog page—working toward something more modular and scalable so posts, routing, and data sources stay easy to extend as content grows.
                </p>
              </NowSection>
            </Reveal>
          </div>

          <Reveal className="mt-12 flex flex-wrap items-center gap-4">
            <Button variant={isDark ? "default" : "pop"} asChild>
              <Link to="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Home
              </Link>
            </Button>
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
              )}
            >
              What is a /now page? <ExternalLink className="h-3 w-3" />
            </a>
          </Reveal>
        </div>
      </div>
    </motion.div>
  );
}

/** Dark /now sections: bordered panels that sit cleanly on the grid backdrop (not the light pop-card wash). */
const DARK_SURFACE_CARD =
  "rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-presence-rest ring-1 ring-inset ring-primary/10";

function NowSection({ isDark, title, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 md:p-8",
        isDark ? DARK_SURFACE_CARD : LIGHT_SURFACE_CARD,
      )}
    >
      <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
        {isDark ? `// ${title.toLowerCase()}` : `${title} ·`}
      </h2>
      {children}
    </div>
  );
}
