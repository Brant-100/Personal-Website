import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section, Reveal, spring } from "@/components/motion/MotionPrimitives";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LIGHT_SURFACE_CARD, tagChipLightClass } from "@/lib/popColors";

/** Mirrors `api/data/experience.py` when the API is offline. */
const FALLBACK = [
  {
    id: "bpa-web-team",
    title: "Web Application Team Member",
    org: "Business Professionals of America (BPA)",
    period: "2025 to present",
    summary:
      "Shipped Health Hive as our Business Professionals of America competitive web application entry: a Django based team wellness platform where groups log activities, collaborate on goals, and stay accountable with reminders and progress analytics. Contributed across templates and UX polish, coordinated delivery through Agile sprints, and integrated features with the team's data model and workflows.",
    tags: ["django", "ux", "teamwork", "competition"],
  },
  {
    id: "nexus-saas",
    title: "Sole Developer — Project Nexus",
    org: "Independent",
    period: "2026",
    summary:
      "Designed and built Project Nexus from scratch as a self directed SaaS project: a modular command and control framework with a FastAPI operator server, AES-GCM encrypted implant comms, and a tamper evident JSONL audit log. Every component — crypto, beacon scheduling, task queue, sandbox detection — was built without off the shelf C2 frameworks to ensure full understanding of the stack.",
    tags: ["python", "fastapi", "security", "solo"],
  },
  {
    id: "bpa-skillswap",
    title: "Web Application Team Member — SkillSwap",
    org: "Business Professionals of America (BPA)",
    period: "2026",
    summary:
      "Co developed SkillSwap as a BPA competitive web application entry: a peer to peer learning platform where students offer skills, book sessions, and earn trust through ratings and community reviews. Built on Next.js 15, React 19, TypeScript, Prisma, and PostgreSQL with Google and GitHub OAuth via NextAuth.js. Integrated an OpenAI layer for resume based skill extraction and session recommendations, designed to degrade gracefully when the API is unavailable.",
    tags: ["next.js", "full-stack", "ai", "competition"],
  },
];

export function Experience() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(FALLBACK);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);

  useEffect(() => {
    const ctrl = new AbortController();
    api.experience({ signal: ctrl.signal, fallback: null }).then((data) => {
      if (Array.isArray(data) && data.length) setItems(data);
    });
    return () => ctrl.abort();
  }, []);

  return (
    <Section id="experience" className="container">
      <Reveal className="mb-4">
        {!isDark && <span className="section-accent-bar bg-primary" aria-hidden />}
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-[0.3em]",
            isDark ? "text-primary" : "text-secondary"
          )}
        >
          {isDark ? "// 04" : "04 ·"} timeline
        </span>
      </Reveal>
      <Reveal className="mb-16 max-w-3xl">
        <h2 className={cn("text-4xl md:text-5xl font-extrabold tracking-tight", isDark && "heading-face")}>
          Experience
        </h2>
        <p className={cn("mt-4 text-lg", isDark ? "text-foreground/75" : "text-muted-foreground")}>
          Teamwork, competitions, and shipped products.
        </p>
      </Reveal>

      <div ref={sectionRef} className="relative mx-auto max-w-4xl">
        <div
          aria-hidden
          className="absolute left-4 md:left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border"
        />
        <motion.div
          aria-hidden
          style={{ scaleY: lineScale, originY: 0 }}
          className={cn(
            "absolute left-4 md:left-1/2 top-0 h-full w-[2px] -translate-x-1/2",
            isDark ? "bg-primary shadow-neon-cyan" : "bg-primary"
          )}
        />

        <div className="space-y-10">
          {items.map((entry, i) => (
            <TimelineEntry
              key={entry.id || entry.title}
              entry={entry}
              index={i}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function TimelineEntry({ entry, index, isDark }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...spring.soft, delay: index * 0.05 }}
      className={cn(
        "relative grid gap-6 md:grid-cols-2 md:gap-12",
        !isLeft && "md:[&>*:first-child]:order-2"
      )}
    >
      <div
        className={cn(
          "absolute left-4 md:left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2",
          isDark
            ? "bg-background border-primary shadow-neon-cyan"
            : "bg-background border-primary/40"
        )}
      >
        <div
          className={cn(
            "absolute inset-1 rounded-full",
            isDark ? "bg-primary" : index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-secondary" : "bg-accent"
          )}
        />
      </div>

      <div
        className={cn(
          "ml-12 md:ml-0 md:px-6",
          isLeft ? "md:text-right" : "md:text-left"
        )}
      >
        <div
          className={cn(
            "inline-block rounded-2xl p-6 text-left",
            isDark
              ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300"
              : cn(
                  LIGHT_SURFACE_CARD,
                  "transition-colors hover:border-primary/35"
                )
          )}
        >
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {entry.period}
          </div>
          <h3 className={cn("mt-2 text-xl font-bold", isDark && "text-neon")}>
            {entry.title}
          </h3>
          <div className="text-sm text-muted-foreground">{entry.org}</div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {entry.summary}
          </p>
          {entry.tags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {entry.tags.map((t, ti) => (
                <span
                  key={t}
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                    isDark
                      ? "bg-muted text-primary"
                      : tagChipLightClass(t, ti)
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block" />
    </motion.div>
  );
}
