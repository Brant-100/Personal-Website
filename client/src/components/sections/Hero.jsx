import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Terminal, Shield, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/useTheme";
import { AnimatedHeadline, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { cn } from "@/lib/utils";

const ROLES = [
  { label: "Software Development", icon: Code2 },
  { label: "Offensive Cyber Operations", icon: Shield },
];

export function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, []);
  const activeRole = ROLES[roleIdx];
  const ActiveIcon = activeRole.icon;

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Theme-specific backdrop flair */}
      <ThemeBackdrop isDark={isDark} />

      <div className="container relative z-10 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        {/* Left column — headline + CTAs */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.08, 0.1)}
          className="max-w-2xl"
        >
          <Reveal className="mb-6">
            <Badge
              variant={isDark ? "default" : "accent"}
              className="gap-2 px-3 py-1 text-[11px] uppercase tracking-[0.22em]"
            >
              <Sparkles className="h-3 w-3" />
              {isDark ? "// online // available for work" : "available for hire — 2026"}
            </Badge>
          </Reveal>

          <AnimatedHeadline
            text="Brant Simpson"
            className={cn(
              "text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight",
              isDark ? "text-neon text-foreground" : "text-foreground"
            )}
          />

          <AnimatedHeadline
            text="builds things & breaks things."
            className={cn(
              "mt-3 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight",
              isDark ? "text-primary" : "text-primary"
            )}
            wordClassName={isDark ? "text-neon" : ""}
          />

          <Reveal className="mt-8 flex items-center gap-3 text-lg md:text-xl text-muted-foreground">
            <span className="text-foreground/80">Focused on</span>
            <span className="relative inline-flex min-w-[17ch] items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeRole.label}
                  initial={{ y: 18, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -18, opacity: 0, filter: "blur(6px)" }}
                  transition={spring.snap}
                  className={cn(
                    "inline-flex items-center gap-2 font-semibold",
                    isDark ? "text-accent" : "text-secondary"
                  )}
                >
                  <ActiveIcon className="h-5 w-5" />
                  {activeRole.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </Reveal>

          <Reveal className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Full-stack engineer and offensive security operator. I design crisp product
            experiences, ship production software, and red-team the systems behind them.
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" variant={isDark ? "default" : "pop"} asChild>
              <a href="#projects" className="inline-flex items-center gap-2">
                View Work <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact" className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Get in touch
              </a>
            </Button>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-foreground/60">stack::</span>
            {["React", "FastAPI", "Python", "Docker", "Tailwind", "Framer Motion"].map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-muted/60 px-2 py-1"
              >
                {t}
              </span>
            ))}
          </Reveal>
        </motion.div>

        {/* Right column — theme-dependent visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.soft, delay: 0.25 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={spring.snap}
              >
                <TerminalCard />
              </motion.div>
            ) : (
              <motion.div
                key="popart"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={spring.snap}
              >
                <PopArtCard />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* Theme-dependent right-side visuals                          */
/* ============================================================ */

function TerminalCard() {
  const lines = [
    { prompt: "~$", text: "whoami" },
    { prompt: ">", text: "brant.simpson", accent: true },
    { prompt: "~$", text: "nmap -sS -Pn target.local" },
    { prompt: ">", text: "22/tcp  open  ssh" },
    { prompt: ">", text: "443/tcp open  https" },
    { prompt: "~$", text: "./nexus --deploy implant.enc" },
    { prompt: ">", text: "[+] AES-GCM handshake OK", accent: true },
    { prompt: "~$", text: "" },
  ];

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur shadow-neon-cyan">
        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-border/80 bg-background/60 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/80" />
          <span className="h-3 w-3 rounded-full bg-accent/80" />
          <span className="h-3 w-3 rounded-full bg-primary/80" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">
            brant@nexus : ~/ops
          </span>
          <Terminal className="ml-auto h-4 w-4 text-primary" />
        </div>

        <div className="relative p-5 font-mono text-sm leading-7">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12, ...spring.soft }}
              className={cn(
                "flex gap-2",
                l.accent ? "text-accent" : "text-foreground/90"
              )}
            >
              <span className="text-primary">{l.prompt}</span>
              <span className={cn(i === lines.length - 1 && "terminal-cursor")}>
                {l.text}
              </span>
            </motion.div>
          ))}

          {/* scanline sheen */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 animate-scanline" />
          </div>
        </div>
      </div>

      {/* corner ticks */}
      <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-primary" />
      <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-primary" />
    </div>
  );
}

function PopArtCard() {
  return (
    <div className="relative">
      {/* big colorful blobs */}
      <motion.div
        className="absolute -left-10 -top-6 h-40 w-40 rounded-full bg-pop-pink/80 blur-0 mix-blend-multiply"
        animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-secondary/80 mix-blend-multiply"
        animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 bottom-0 h-24 w-24 -translate-x-1/2 rounded-full bg-accent/90 mix-blend-multiply"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        whileHover={{ rotate: -2, y: -4 }}
        transition={spring.snap}
        className="relative rounded-3xl border-2 border-foreground bg-card p-8 shadow-pop"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-accent px-3 py-1 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" /> now building
        </div>
        <h3 className="text-3xl font-extrabold leading-tight">
          Products that <span className="text-primary">pop</span>,
          <br />
          systems that <span className="text-secondary">hold</span>.
        </h3>
        <p className="mt-4 text-sm text-muted-foreground">
          Shipping bold, accessible interfaces for startups & teams —
          then stress-testing the infra behind them.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Ship", color: "bg-primary" },
            { label: "Design", color: "bg-secondary" },
            { label: "Secure", color: "bg-accent" },
          ].map((b) => (
            <div
              key={b.label}
              className={cn(
                "flex h-16 items-center justify-center rounded-xl border-2 border-foreground font-bold text-background",
                b.color
              )}
            >
              {b.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================ */
/* Page-wide theme backdrop behind the hero                     */
/* ============================================================ */
function ThemeBackdrop({ isDark }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-cyber-grid bg-grid-32 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
          <div className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-10 top-20 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
        </>
      ) : (
        <>
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
          {/* playful dotted pattern */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </>
      )}
    </div>
  );
}
