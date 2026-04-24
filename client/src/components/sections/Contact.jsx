import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Award, ArrowUpRight, Download } from "lucide-react";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";
import { ContactForm } from "@/components/forms/ContactForm";


export const CONTACT_LINKS = [
  {
    id: "email",
    label: "Email",
    handle: CONTACT_EMAIL,
    href: CONTACT_HREF,
    icon: Mail,
    darkColor: "text-primary",
    lightBg: "bg-primary",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "@Brant-100",
    href: "https://github.com/Brant-100",
    icon: Github,
    darkColor: "text-accent",
    lightBg: "bg-foreground",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "brant-simpson",
    href: "https://www.linkedin.com/in/brant-simpson-2b5b1b331/",
    icon: Linkedin,
    darkColor: "text-secondary",
    lightBg: "bg-secondary",
  },
  {
    id: "credly",
    label: "Credly",
    handle: "brant-simpson",
    href: "https://www.credly.com/users/brant-simpson/badges",
    icon: Award,
    darkColor: "text-pop-pink",
    lightBg: "bg-accent",
  },
];

export function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Section id="contact" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 05" : "05 ·"} contact
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {isDark ? (
            <>
              Let&apos;s <span className="text-neon">connect</span>.
            </>
          ) : (
            <>
              Let&apos;s{" "}
              <span className="relative inline-block text-primary">
                connect
                <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
              </span>
              .
            </>
          )}
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          The fastest way to reach me — I reply within 48 hours.
        </p>
      </Reveal>

      {/* Contact form */}
      <Reveal className="mb-10">
        <ContactForm />
      </Reveal>

      {/* Resume download */}
      <Reveal className="mb-14">
        <a
          href="/Brant_Simpson_Resume.pdf"
          download
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all",
            isDark
              ? "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              : "border-2 border-foreground text-foreground hover:bg-muted"
          )}
        >
          <Download className="h-4 w-4" /> Download Resume
        </a>
      </Reveal>

      {/* Contact cards */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CONTACT_LINKS.map((link, i) => (
          <ContactCard key={link.id} link={link} index={i} isDark={isDark} />
        ))}
      </motion.div>

      <Reveal className="mt-6">
        <p className="text-center text-sm text-muted-foreground">
          I usually reply within 48 hours.
        </p>
      </Reveal>
    </Section>
  );
}

function ContactCard({ link, index, isDark }) {
  const Icon = link.icon;
  const external = link.href.startsWith("http");

  return (
    <motion.a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={`${link.label}: ${link.handle}`}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      whileHover={{ y: -6, rotate: isDark ? 0 : index % 2 === 0 ? -1.5 : 1.5 }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snap}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDark
          ? "border border-border bg-card/70 backdrop-blur hover:border-primary/50 hover:shadow-neon-cyan"
          : "border-2 border-foreground bg-card shadow-pop hover:shadow-pop-primary"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            isDark
              ? "bg-primary/10 ring-1 ring-primary/30"
              : link.lightBg === "bg-foreground"
              ? "bg-foreground text-background"
              : link.lightBg === "bg-primary"
              ? "bg-primary text-primary-foreground"
              : link.lightBg === "bg-secondary"
              ? "bg-secondary text-secondary-foreground"
              : "bg-accent text-accent-foreground"
          )}
        >
          <Icon className={cn("h-6 w-6", isDark && link.darkColor)} />
        </div>
        <ArrowUpRight
          className={cn(
            "h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
            isDark ? "text-primary" : "text-foreground/50"
          )}
        />
      </div>

      <div className="mt-6">
        <div
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.25em]",
            isDark ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.label}
        </div>
        <div
          className={cn(
            "mt-1 break-all text-base font-semibold leading-snug",
            isDark && "text-neon"
          )}
        >
          {link.handle}
        </div>
      </div>

      {/* Decorative corner accent */}
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-15 transition-opacity group-hover:opacity-30",
          isDark
            ? "bg-primary"
            : link.lightBg === "bg-foreground"
            ? "bg-foreground"
            : link.lightBg === "bg-primary"
            ? "bg-primary"
            : link.lightBg === "bg-secondary"
            ? "bg-secondary"
            : "bg-accent"
        )}
      />
    </motion.a>
  );
}
