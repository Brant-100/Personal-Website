import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * /now: a single paragraph updated monthly.
 * Inspired by nownownow.com. No database needed; just edit this file.
 * Last updated: April 2026
 */
export function Now() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
              Last updated: April 2026 · Ohio · EST
            </p>
          </Reveal>

          <div className="space-y-8">
            <Reveal>
              <NowSection isDark={isDark} title="Building">
                <p className="text-muted-foreground leading-relaxed">
                  Deep in <strong className={isDark ? "text-foreground" : "text-foreground"}>Project Nexus Phase 2</strong>, adding a web based operator dashboard and process injection support. The core beacon and task handler infrastructure from Phase 1 is stable; Phase 2 is about operator UX and extending the technique coverage.
                </p>
              </NowSection>
            </Reveal>

            <Reveal>
              <NowSection isDark={isDark} title="Studying">
                <p className="text-muted-foreground leading-relaxed">
                  Security+ is done (SY0-701). Currently in the EDPT preparation pipeline for the 1B4X1 track. Side reading: <em>The Web Application Hacker&apos;s Handbook</em> and malware analysis fundamentals.
                </p>
              </NowSection>
            </Reveal>

            <Reveal>
              <NowSection isDark={isDark} title="Available for">
                <p className="text-muted-foreground leading-relaxed">
                  Contract web and software development work while pre enlistment. React + FastAPI + Tailwind. If you&apos;re building something and need a developer who also thinks about the security layer, let&apos;s talk.
                </p>
              </NowSection>
            </Reveal>

            <Reveal>
              <NowSection isDark={isDark} title="Writing">
                <p className="text-muted-foreground leading-relaxed">
                  Working on the Nexus Phase 1 retrospective, the &ldquo;why I built a C2 from scratch instead of using Cobalt Strike&rdquo; post. It&apos;s the most important piece of writing I can publish right now because it explains the deliberate constraint that makes the project meaningful.
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

function NowSection({ isDark, title, children }) {
  return (
    <div>
      <h2 className={cn(
        "mb-3 font-mono text-xs uppercase tracking-[0.3em]",
        isDark ? "text-primary" : "text-foreground/60"
      )}>
        {isDark ? `// ${title.toLowerCase()}` : `${title} ·`}
      </h2>
      {children}
    </div>
  );
}
