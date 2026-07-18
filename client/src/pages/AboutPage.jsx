import { MapPin, Shield, Code2, Server, Globe, Database, Terminal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { Credentials } from "@/components/sections/Credentials";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactCard } from "@/components/sections/Contact";
import { CONTACT_LINKS } from "@/data/contactLinks";
import { HEADSHOT_PUBLIC_PATH, SHOW_HEADSHOT } from "@/lib/headshot";
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

const HOW_I_WORK_STEPS = [
  {
    title: "Discovery call",
    body: "A 20-minute call to understand your project, your constraints, and what you actually need. No pressure, no pitch.",
  },
  {
    title: "Proposal",
    body: "A written scope, timeline, and price within 48 hours. You know exactly what you're paying for before anything starts.",
  },
  {
    title: "Build",
    body: "Weekly check-ins and staging previews at every milestone. You see progress as it happens, with no surprise scope creep.",
  },
  {
    title: "Handoff",
    body: "Code, credentials, and a walkthrough so you're never left guessing. It's all yours on final payment.",
  },
  {
    title: "30 days of support",
    body: "Bug fixes included for 30 days after launch. Ongoing work is quoted separately, and you're never locked in.",
  },
];

export function AboutPage() {
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
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Reveal>

          <div className="grid gap-14 lg:grid-cols-[1fr_minmax(380px,28rem)] lg:items-start lg:gap-12">
            {/* Left column: full narrative */}
            <div>
              <Reveal className="mb-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  {"// about"}
                </span>
              </Reveal>

              <Reveal className="mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
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
              </motion.div>

            </div>

            {/* Right column: avatar (optional) + skills */}
            <div className="space-y-8 lg:sticky lg:top-28">
              {SHOW_HEADSHOT && (
                <Reveal>
                  <div className="flex justify-center lg:justify-start">
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-2xl",
                        "bg-card/70 p-4 ring-2 ring-primary/40"
                      )}
                    >
                      <img
                        src={HEADSHOT_PUBLIC_PATH}
                        alt="Brant Simpson"
                        width={260}
                        height={260}
                        className="block h-[260px] w-[260px] rounded-xl"
                        decoding="async"
                      />
                      
                        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                      
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal>
                <div
                  className={cn(
                    "rounded-2xl p-6",
                    "border border-border bg-card/70 backdrop-blur"
                  )}
                >
                  <div className="mb-4">
                    <div className={cn("font-mono text-[11px] uppercase tracking-[0.25em]", "text-primary")}>
                      Stack
                    </div>
                    <p className={cn(
                      "mt-2 text-sm leading-snug font-sans normal-case tracking-normal",
                      "text-muted-foreground"
                    )}>
                      Some tools I use, not an exhaustive list.
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
                            "flex min-h-10 min-w-0 items-center gap-2 text-sm leading-snug",
                            "rounded-lg bg-muted/60 px-2.5 py-2 text-foreground/90"
                          )}
                        >
                          <>
                            <Icon className="h-4 w-4 shrink-0 translate-y-px text-primary" aria-hidden />
                            <span className="min-w-0 font-bold">{s.name}</span>
                          </>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              </Reveal>
            </div>
          </div>

          <section
            id="how-i-work"
            aria-labelledby="how-i-work-heading"
            className="mt-16 scroll-mt-24 md:mt-24"
          >
            <Reveal className="mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {"// process"}
              </span>
            </Reveal>
            <Reveal className="mb-8 max-w-3xl">
              <h2
                id="how-i-work-heading"
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
              >
                <>
                  How I{" "}
                  <span className="relative inline-block text-primary">
                    work
                    <span
                      className="absolute inset-x-0 -bottom-1 h-2 rounded-sm bg-primary/25 -z-10"
                      aria-hidden
                    />
                  </span>
                </>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                No mystery. Here&apos;s exactly how a project goes from first call to launch.
              </p>
            </Reveal>

            <motion.ol
              variants={staggerContainer(0.08, 0.06)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {HOW_I_WORK_STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className={cn(
                    "list-none rounded-2xl p-6",
                    "border border-border bg-card/75 backdrop-blur-sm shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.12)]"
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold",
                      "bg-primary/10 text-primary ring-1 ring-primary/30"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </motion.li>
              ))}
            </motion.ol>
          </section>

          <Credentials embedded />

          <section
            id="about-social"
            aria-labelledby="about-social-heading"
            className="mt-16 scroll-mt-24 md:mt-24"
          >
            <Reveal className="mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {"// social"}
              </span>
            </Reveal>
            <Reveal className="mb-8 max-w-3xl">
              <h2
                id="about-social-heading"
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
              >
                <>
                  Around the{" "}
                  <span className="relative inline-block text-primary">
                    web
                    <span
                      className="absolute inset-x-0 -bottom-1 h-2 rounded-sm bg-primary/25 -z-10"
                      aria-hidden
                    />
                  </span>
                </>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Email and public profiles: tap a card to open the link.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CONTACT_LINKS.map((link) => (
                <ContactCard key={link.id} link={link} />
              ))}
            </div>
          </section>

          <section
            id="about-contact"
            aria-labelledby="about-contact-heading"
            className="mt-14 scroll-mt-24 pt-4 md:mt-20 md:pt-8"
          >
            <Reveal className="mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {"// say hello"}
              </span>
            </Reveal>
            <div className="mb-10 max-w-3xl">
              <h2
                id="about-contact-heading"
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
              >
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
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                If anything above fits what you&apos;re looking for, use the form; I read every message myself and usually
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
