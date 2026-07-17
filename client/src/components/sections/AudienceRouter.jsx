import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { cn } from "@/lib/utils";
import { BOOKING_URL, RESUME_PDF } from "@/lib/contact";

const CARDS = [
  {
    id: "employers",
    tag: "// employers",
    title: "Hiring for a team?",
    body: "Projects with technical decisions and tradeoffs, MITRE coverage, Security+, resume.",
    accent: "primary",
    actions: [
      { label: "View projects →", href: "/projects", primary: true },
      { label: "Resume", href: RESUME_PDF, download: true, primary: false },
    ],
  },
  {
    id: "clients",
    tag: "// clients",
    title: "Need something built?",
    body: "Web, UI/UX, and custom software services — live demos, pricing, and a discovery call.",
    accent: "secondary",
    actions: [
      { label: "See services →", href: "/services", primary: true },
      { label: "Book a call", href: BOOKING_URL, external: true, primary: false },
    ],
  },
];

export function AudienceRouter() {
  return (
    <section className="container pb-8 md:pb-12">
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-5 md:grid-cols-2"
      >
        {CARDS.map((card) => (
          <AudienceCard key={card.id} card={card} />
        ))}
      </motion.div>
    </section>
  );
}

function AudienceCard({ card }) {
  const isEmployers = card.accent === "primary";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      className={cn(
        "rounded-2xl border bg-card/85 p-7 shadow-presence-rest backdrop-blur",
        isEmployers
          ? "border-primary/35 shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
          : "border-secondary/35 shadow-[0_0_20px_hsl(var(--secondary)/0.1)]"
      )}
    >
      <Reveal>
        <div
          className={cn(
            "font-mono text-xs uppercase tracking-[0.2em]",
            isEmployers ? "text-primary" : "text-secondary"
          )}
        >
          {card.tag}
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">{card.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {card.actions.map((action) => {
            if (action.download) {
              return (
                <Button
                  key={action.label}
                  size="sm"
                  variant="outline"
                  asChild
                  className="font-mono text-xs"
                >
                  <a href={action.href} download className="inline-flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    {action.label}
                  </a>
                </Button>
              );
            }

            const isExternal = action.href.startsWith("http");
            const inner = (
              <>
                {action.label}
                {action.primary && <ArrowRight className="h-3.5 w-3.5" />}
              </>
            );

            if (action.primary) {
              return (
                <Button
                  key={action.label}
                  size="sm"
                  variant={isEmployers ? "default" : "secondary"}
                  asChild
                  className="font-mono text-xs"
                >
                  {isExternal ? (
                    <a href={action.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
                      {inner}
                    </a>
                  ) : (
                    <Link to={action.href} className="inline-flex items-center gap-1.5">
                      {inner}
                    </Link>
                  )}
                </Button>
              );
            }

            return (
              <Button
                key={action.label}
                size="sm"
                variant="outline"
                asChild
                className="font-mono text-xs"
              >
                {isExternal ? (
                  <a href={action.href} target="_blank" rel="noreferrer">
                    {action.label}
                  </a>
                ) : (
                  <Link to={action.href}>{action.label}</Link>
                )}
              </Button>
            );
          })}
        </div>
      </Reveal>
    </motion.div>
  );
}
