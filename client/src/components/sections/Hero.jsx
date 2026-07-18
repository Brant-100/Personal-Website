import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Terminal, Sparkles, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCallButton } from "@/components/BookCallButton";
import { Badge } from "@/components/ui/badge";
import { AnimatedHeadline, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { cn } from "@/lib/utils";
import { RESUME_PDF } from "@/lib/contact";

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <ThemeBackdrop />

      <div className="container relative z-10 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.08, 0.1)}
          className="max-w-2xl"
        >
          <Reveal className="mb-6">
            <Badge
              variant="default"
              className="gap-2 px-3 py-1 text-[11px] uppercase tracking-[0.22em]"
            >
              <Sparkles className="h-3 w-3" />
              {"// online // available for work"}
            </Badge>
          </Reveal>

          <AnimatedHeadline
            text="Brant Simpson"
            className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight text-neon text-foreground"
          />

          <AnimatedHeadline
            text="builds things that matter"
            className="mt-3 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-primary"
            wordClassName="text-neon"
          />

          <Reveal className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground">
            <span className="text-foreground/90">
              Software developer &amp; security engineer — now taking freelance web and software work.
            </span>
          </Reveal>

          <Reveal className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-xs text-accent">
              <Zap className="h-3 w-3 text-accent" />
              <span>now building:</span>
              <span className="text-foreground">Nexus Phase 2 · EDPT</span>
            </div>
          </Reveal>

          <Reveal className="mt-7 flex flex-wrap items-center gap-4">
            <BookCallButton size="lg" variant="default" />
            <Button size="lg" variant="outline" asChild>
              <a href="#projects" className="inline-flex items-center gap-2">
                View Work <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={RESUME_PDF} download className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Button>
          </Reveal>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.soft, delay: prefersReduced ? 0 : 0.25 }}
          className="relative"
        >
          <TerminalCard prefersReduced={prefersReduced} />
        </motion.div>
      </div>
    </section>
  );
}

function TerminalCard({ prefersReduced = false }) {
  const lines = [
    { prompt: "~$", text: "whoami" },
    { prompt: ">", text: "brant.simpson", accent: true },
    { prompt: "~$", text: "pytest --cov nexus/" },
    { prompt: ">", text: "214 passed · 91% coverage", accent: true },
    { prompt: "~$", text: "git log --oneline -1" },
    { prompt: ">", text: "feat: AES-GCM session handshake", muted: true },
    { prompt: "~$", text: "./deploy --prod" },
    { prompt: ">", text: "✓ live in 34s", accent: true },
    { prompt: "~$", text: "" },
  ];

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur shadow-neon-cyan">
        <div className="flex items-center gap-2 border-b border-border/80 bg-background/60 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/80" />
          <span className="h-3 w-3 rounded-full bg-accent/80" />
          <span className="h-3 w-3 rounded-full bg-primary/80" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">
            brant@nexus : ~/ship
          </span>
          <Terminal className="ml-auto h-4 w-4 text-primary" />
        </div>

        <div className="relative p-5 font-mono text-sm leading-7">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: prefersReduced ? 1 : 0, x: prefersReduced ? 0 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: prefersReduced ? 0 : 0.4 + i * 0.12, ...spring.soft }}
              className={cn(
                "flex gap-2",
                l.accent ? "text-accent" : l.muted ? "text-muted-foreground" : "text-foreground/90"
              )}
            >
              <span className="text-primary">{l.prompt}</span>
              <span className={cn(i === lines.length - 1 && "terminal-cursor")}>
                {l.text}
              </span>
            </motion.div>
          ))}

          {!prefersReduced && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 animate-scanline" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-primary" />
      <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-primary" />
    </div>
  );
}

function ThemeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-grid-32 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-10 top-20 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
    </div>
  );
}
