import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section, Reveal, spring } from "@/components/motion/MotionPrimitives";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const FALLBACK = [
  {
    id: "bpa-web",
    title: "Web Application Team Lead",
    org: "BPA (Business Professionals of America)",
    period: "2025 — Present",
    summary:
      "Led a team building the official web application entry, driving architecture, delegation, and final shipping pass.",
    tags: ["leadership", "react", "ux"],
  },
  {
    id: "khe",
    title: "Hackathon Participant",
    org: "Kent Hack Enough",
    period: "2025",
    summary:
      "Shipped a full-stack prototype in 36 hours with a small team. Focused on rapid iteration and tight UX polish.",
    tags: ["hackathon", "full-stack"],
  },
  {
    id: "ocri-ctf",
    title: "Competitor — Statewide CTF",
    org: "Ohio Cyber Reserve Institute",
    period: "2025",
    summary:
      "Represented team in a statewide capture-the-flag — focus on web exploitation, forensics, and network analysis.",
    tags: ["ctf", "offensive-security"],
  },
  {
    id: "cac",
    title: "Entrant — Congressional App Challenge",
    org: "U.S. House of Representatives",
    period: "2024",
    summary:
      "Designed and submitted an original app to the Congressional App Challenge for the local district.",
    tags: ["product", "civic-tech"],
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
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 04" : "04 —"} timeline
        </span>
      </Reveal>
      <Reveal className="mb-16 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Experience
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Leadership, competition, and shipped products.
        </p>
      </Reveal>

      <div ref={sectionRef} className="relative mx-auto max-w-4xl">
        {/* Center vertical line (desktop) / left line (mobile) */}
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
      {/* Node on the line */}
      <div
        className={cn(
          "absolute left-4 md:left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2",
          isDark
            ? "bg-background border-primary shadow-neon-cyan"
            : "bg-background border-foreground"
        )}
      >
        <div
          className={cn(
            "absolute inset-1 rounded-full",
            isDark ? "bg-primary" : index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-secondary" : "bg-accent"
          )}
        />
      </div>

      {/* Card */}
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
              ? "border border-border bg-card/70 backdrop-blur"
              : "border-2 border-foreground bg-card shadow-pop"
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
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest",
                    isDark
                      ? "bg-muted text-primary"
                      : "bg-accent/40 text-foreground"
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for the other side */}
      <div className="hidden md:block" />
    </motion.div>
  );
}
