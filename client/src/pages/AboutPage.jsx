import { MapPin, Shield, Code2, Server, Globe, Database, Terminal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { Credentials } from "@/components/sections/Credentials";
import { ContactForm } from "@/components/forms/ContactForm";
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
  { name: "Cybersecurity", icon: Shield,   category: "security" },
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
      <div className="container relative z-10">
        <div className="mx-auto max-w-6xl">
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
                className="space-y-7 text-base md:text-lg"
              >
                <Reveal>
                  <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                    <p>
                      I&apos;m Brant Simpson, a software developer and security builder based in{" "}
                      <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden /> Ohio
                      </span>
                      . I build web apps and security tooling for teams that want accessible interfaces and someone who
                      plans for what happens after deploy. Available for contract web and software work.
                    </p>
                  </div>
                </Reveal>

                <Reveal>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Main focus: Project Nexus—a custom C2 framework built from scratch. Expanding operator tooling and
                    MITRE-aligned coverage so defensive thinking tracks real implant and C2 behavior.
                  </p>
                </Reveal>

                <Reveal>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    I&apos;m pre-enlistment and targeting the USAF 1B4X1 Cyber Warfare Operations career field. That track is why I build offensive tooling, map everything to MITRE, and take detection seriously.
                  </p>
                </Reveal>
              </motion.div>

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
                      width="260"
                      height="260"
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
                  "rounded-2xl p-6",
                  isDark
                    ? "border border-border bg-card/70 backdrop-blur"
                    : "border-2 border-foreground bg-card shadow-pop"
                )}>
                  <div className="mb-4">
                    <div className={cn("font-mono text-[11px] uppercase tracking-[0.25em]", isDark ? "text-primary" : "text-muted-foreground")}>
                      Stack
                    </div>
                    <p className={cn(
                      "mt-2 text-sm leading-snug font-sans normal-case tracking-normal",
                      isDark ? "text-muted-foreground" : "text-muted-foreground"
                    )}>
                      Some tools I use—not an exhaustive list.
                    </p>
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
                            "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                            isDark
                              ? "bg-muted/60 text-foreground/90"
                              : "bg-muted/80 text-foreground/90"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 shrink-0", isDark ? "text-primary" : "text-foreground/60")} />
                          {s.name}
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              </Reveal>
            </div>
          </div>

          <Credentials embedded />

          <section
            id="about-contact"
            aria-labelledby="about-contact-heading"
            className="mt-16 scroll-mt-24 pt-4 md:mt-24 md:pt-8"
          >
            <Reveal className="mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {isDark ? "// say hello" : "say hello ·"}
              </span>
            </Reveal>
            <div className="mb-10 max-w-3xl">
              <h2
                id="about-contact-heading"
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
              >
                {isDark ? (
                  <>
                    Say <span className="text-neon">hello</span>.
                  </>
                ) : (
                  <>
                    Say{" "}
                    <span className="relative inline-block text-primary">
                      hello
                      <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
                    </span>
                    .
                  </>
                )}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                If anything above fits what you&apos;re looking for, use the form—I read every message myself and usually
                reply within 48 hours.
              </p>
            </div>
            <Reveal>
              <div className="w-full">
                <ContactForm defaultService="general" />
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
