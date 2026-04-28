import { MapPin, Shield, Code2, Server, Globe, Database, Terminal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { Credentials } from "@/components/sections/Credentials";
import { ContactForm } from "@/components/forms/ContactForm";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CHIP_BG, CHIP_RING, CHIP_TEXT, popBy, CARD_SHADOW, CARD_HOVER_SHADOW } from "@/lib/popColors";

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

const avatarSrc = `${import.meta.env.BASE_URL}brant-avatar.svg`.replace(/\/{2,}/g, "/");

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

          <div className="grid gap-14 lg:grid-cols-[1fr_minmax(380px,28rem)] lg:items-start lg:gap-12">
            {/* Left column: full narrative */}
            <div>
              <Reveal className="mb-4">
                {!isDark && <span className="section-accent-bar bg-pop-pink" aria-hidden />}
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  {isDark ? "// about" : "about ·"}
                </span>
              </Reveal>

              <Reveal className="mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  {isDark ? (
                    <>
                      Who I{" "}
                      <span className="relative inline-block text-primary">
                        am
                        <span
                          className="absolute inset-x-0 -bottom-1 h-2 rounded-sm bg-primary/25 -z-10"
                          aria-hidden
                        />
                      </span>
                      .
                    </>
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
                className="space-y-8 text-base md:text-lg"
              >
                <Reveal>
                  <p className="text-muted-foreground leading-[1.75] md:leading-[1.8]">
                    I&apos;m Brant Simpson, a software developer and security builder based in{" "}
                    <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden /> Ohio
                    </span>
                    . I build web apps and security tooling for teams that want accessible interfaces and someone who
                    plans for what happens after deploy. Available for contract web and software work.
                  </p>
                </Reveal>

                <Reveal>
                  <p className="text-muted-foreground leading-[1.75] md:leading-[1.8]">
                    Main focus: Project Nexus—a custom C2 framework built from scratch. Expanding operator tooling and
                    MITRE-aligned coverage so defensive thinking tracks real implant and C2 behavior.
                  </p>
                </Reveal>

                <Reveal>
                  <p className="text-muted-foreground leading-[1.75] md:leading-[1.8]">
                    I&apos;m pre-enlistment and targeting the USAF 1B4X1 Cyber Warfare Operations career field. That track
                    is why I build offensive tooling, map everything to MITRE, and take detection seriously.
                  </p>
                </Reveal>
              </motion.div>

            </div>

            {/* Right column: avatar + skills */}
            <div className="space-y-8 lg:sticky lg:top-28">
              <Reveal>
                <div className="flex justify-center lg:justify-start">
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl",
                    isDark
                      ? "p-1 ring-2 ring-primary/40 bg-card/70"
                      : cn(
                          "border border-border bg-card/80 backdrop-blur-sm p-1",
                          popBy(1, CARD_SHADOW)
                        )
                  )}>
                    <img
                      src={avatarSrc}
                      alt="Brant Simpson"
                      width={260}
                      height={260}
                      className="block h-[260px] w-[260px] rounded-xl object-cover"
                      decoding="async"
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
                    : cn(
                        "border border-border bg-card/80 backdrop-blur-sm",
                        popBy(0, CARD_SHADOW),
                        popBy(0, CARD_HOVER_SHADOW)
                      )
                )}>
                  <div className="mb-4">
                    <div className={cn("font-mono text-[11px] uppercase tracking-[0.25em]", isDark ? "text-primary" : "text-foreground/70")}>
                      Stack
                    </div>
                    <p className={cn(
                      "mt-2 text-sm leading-snug font-sans normal-case tracking-normal",
                      isDark ? "text-muted-foreground" : "text-foreground/78"
                    )}>
                      Some tools I use—not an exhaustive list.
                    </p>
                  </div>
                  <motion.ul
                    variants={staggerContainer(0.06, 0.05)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid min-w-0 grid-cols-2 gap-x-2.5 gap-y-2"
                  >
                    {SKILLS.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <motion.li
                          key={s.name}
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show:   { opacity: 1, y: 0 },
                          }}
                          className={cn(
                            "flex min-h-10 min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-sm leading-snug",
                            isDark
                              ? "bg-muted/60 text-foreground/90"
                              : cn("text-foreground ring-2 shadow-sm", popBy(i, CHIP_BG), popBy(i, CHIP_RING))
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 translate-y-px",
                              isDark ? "text-primary" : popBy(i, CHIP_TEXT)
                            )}
                            aria-hidden
                          />
                          <span className="min-w-0 font-bold">{s.name}</span>
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
              {!isDark && <span className="section-accent-bar bg-pop-pink" aria-hidden />}
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
                    Say{" "}
                    <span className="relative inline-block text-primary">
                      hello
                      <span
                        className="absolute inset-x-0 -bottom-1 h-2 rounded-sm bg-primary/25 -z-10"
                        aria-hidden
                      />
                    </span>
                    .
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
