import { MapPin, Mail, Shield, Sigma, Code2, Server, Globe, Database, Terminal, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { Credentials } from "@/components/sections/Credentials";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const SKILLS = [
  { name: "Python",             icon: Terminal, category: "backend"  },
  { name: "React",              icon: Code2,    category: "frontend" },
  { name: "FastAPI",            icon: Server,   category: "backend"  },
  { name: "Tailwind CSS",       icon: Globe,    category: "frontend" },
  { name: "TypeScript",         icon: Code2,    category: "frontend" },
  { name: "Docker",             icon: Server,   category: "infra"    },
  { name: "SQL / SQLite",       icon: Database, category: "backend"  },
  { name: "Offensive Security", icon: Shield,   category: "security" },
];

export function AboutPage() {
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
        <div className="mx-auto max-w-5xl">
          {/* Back link */}
          <Reveal className="mb-10">
            <Link
              to="/"
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                isDark ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Reveal>

          <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
            {/* Left column: full narrative */}
            <div>
              <Reveal className="mb-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  {isDark ? "// about" : "about ·"}
                </span>
              </Reveal>

              <Reveal className="mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  {isDark ? (
                    <>Who I <span className="text-neon">am</span>.</>
                  ) : (
                    <>
                      Who I{" "}
                      <span className="relative inline-block text-primary">
                        am
                        <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
                      </span>
                      .
                    </>
                  )}
                </h1>
              </Reveal>

              <motion.div
                variants={staggerContainer(0.08, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-6 max-w-2xl"
              >
                <Reveal>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    I&apos;m Brant Simpson, a software developer and security builder based in{" "}
                    <span className={cn("inline-flex items-center gap-1 font-medium", isDark ? "text-foreground" : "text-foreground")}>
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Ohio
                    </span>.
                    I build production web applications and security tooling for clients and teams that need both
                    crisp, accessible front-ends and a developer who thinks about what happens after the app is deployed.
                    Currently available for contract web and software work.
                  </p>
                </Reveal>

                <Reveal>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    My main technical focus right now is{" "}
                    <strong className={isDark ? "text-foreground" : "text-foreground"}>Project Nexus</strong>, a custom
                    command-and-control framework I built from first principles rather than wrapping an existing tool.
                    Nexus has 18 MITRE ATT&CK techniques mapped, a full FastAPI operator server,
                    AES-GCM encrypted implant comms, and a GitHub Actions CI pipeline, all written from scratch.
                    Understanding how offensive tooling works is, in my view, the only reliable path to building
                    meaningful defenses against it.
                  </p>
                </Reveal>

                <Reveal>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    I&apos;m pre-enlistment, ASVAB-qualified, and targeting the USAF{" "}
                    <strong className={isDark ? "text-foreground" : "text-foreground"}>1B4X1 Cyber Warfare Operations</strong>{" "}
                    career field. Security+ is done; EDPT is pending. That track shapes why I build what I build.
                  </p>
                </Reveal>
              </motion.div>

              {/* Six Sigma callout */}
              <Reveal className="mt-10">
                <div className={cn(
                  "relative overflow-hidden rounded-2xl p-6",
                  isDark
                    ? "border border-secondary/30 bg-secondary/5"
                    : "border-2 border-foreground bg-card shadow-pop"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      isDark
                        ? "bg-secondary/20 text-secondary ring-1 ring-secondary/30"
                        : "bg-foreground text-background"
                    )}>
                      <Sigma className="h-6 w-6" />
                    </div>
                    <div>
                      <div className={cn("font-mono text-[10px] uppercase tracking-[0.25em] mb-1", isDark ? "text-secondary" : "text-muted-foreground")}>
                        Lean Six Sigma Black Belt
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Earned at 17 (includes White, Yellow, and Green Belts). DMAIC maps cleanly onto debugging,
                        incident response, and feature planning: define the problem precisely, measure what&apos;s actually
                        happening, analyze root causes before touching code, improve systematically, and control for
                        regression. I apply it constantly; it&apos;s the reason I write post-mortems after every project phase.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Ethics statement */}
              <Reveal className="mt-6">
                <div className={cn(
                  "flex items-start gap-3 rounded-lg p-4 text-sm leading-relaxed",
                  isDark
                    ? "border border-accent/20 bg-accent/5 text-accent"
                    : "border border-foreground/20 bg-muted/60 text-muted-foreground"
                )}>
                  <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    All offensive work shown on this site is against systems I own or am explicitly authorized to test.
                  </span>
                </div>
              </Reveal>

              {/* Open to */}
              <Reveal className="mt-10">
                <div className={cn("font-mono text-[10px] uppercase tracking-[0.25em] mb-4", isDark ? "text-primary" : "text-muted-foreground")}>
                  Open to
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Contract web development",
                    "Custom software projects",
                    "Technical mentorship",
                    "Conversations with operators in the field",
                  ].map((item) => (
                    <span
                      key={item}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm",
                        isDark
                          ? "border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                          : "border-2 border-foreground bg-card text-foreground"
                      )}
                    >
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* Contact nudge */}
              <Reveal className="mt-8">
                <a
                  href="/#contact"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                    isDark ? "text-primary hover:text-primary/80" : "text-primary hover:underline"
                  )}
                >
                  <Mail className="h-4 w-4" />
                  Get in touch →
                </a>
              </Reveal>
            </div>

            {/* Right column: avatar + skills */}
            <div className="space-y-8">
              <Reveal>
                <div className="flex justify-center lg:justify-start">
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl",
                    isDark
                      ? "p-1 ring-2 ring-primary/40 bg-card/70"
                      : "border-4 border-foreground shadow-pop p-1 bg-card"
                  )}>
                    <img
                      src="/brant-avatar.svg"
                      alt="Brant Simpson"
                      width="220"
                      height="220"
                      className="rounded-xl"
                    />
                    {isDark && (
                      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className={cn(
                  "rounded-2xl p-5",
                  isDark
                    ? "border border-border bg-card/70 backdrop-blur"
                    : "border-2 border-foreground bg-card shadow-pop"
                )}>
                  <div className={cn("mb-4 font-mono text-[10px] uppercase tracking-[0.25em]", isDark ? "text-primary" : "text-muted-foreground")}>
                    Stack
                  </div>
                  <motion.ul
                    variants={staggerContainer(0.06, 0.05)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {SKILLS.map((s) => {
                      const Icon = s.icon;
                      return (
                        <motion.li
                          key={s.name}
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show:   { opacity: 1, y: 0 },
                          }}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
                            isDark
                              ? "bg-muted/60 text-foreground/90"
                              : "bg-muted/80 text-foreground/90"
                          )}
                        >
                          <Icon className={cn("h-3.5 w-3.5 shrink-0", isDark ? "text-primary" : "text-foreground/60")} />
                          {s.name}
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Full credentials vault */}
        <div id="credentials" className="mt-4">
          <Credentials />
        </div>
      </div>
    </motion.div>
  );
}
