import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Award, ArrowUpRight, Send, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8765" : "");

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

  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "", website: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = cn(
    "w-full rounded-xl px-4 py-3 text-sm transition-all outline-none",
    isDark
      ? "border border-border bg-card/60 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
      : "border-2 border-foreground bg-card text-foreground placeholder:text-muted-foreground/60 focus:border-primary shadow-pop"
  );

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
          Open to contract work, technical conversations, and mentorship. I usually reply within 48 hours.
        </p>
      </Reveal>

      {/* Contact form */}
      <Reveal className="mb-14">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative rounded-2xl p-6 md:p-8",
            isDark
              ? "border border-border bg-card/70 backdrop-blur"
              : "border-2 border-foreground bg-card shadow-pop"
          )}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={cn("mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em]", isDark ? "text-primary" : "text-muted-foreground")}>
                Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={cn("mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em]", isDark ? "text-primary" : "text-muted-foreground")}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5">
            <label className={cn("mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em]", isDark ? "text-primary" : "text-muted-foreground")}>
              Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="What are you working on?"
              className={cn(inputClass, "resize-none")}
            />
          </div>

          {/* Honeypot (hidden from real users; bots fill it) */}
          <input
            name="website"
            type="text"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            aria-hidden="true"
            className="absolute -left-[9999px] opacity-0 pointer-events-none"
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <motion.button
              type="submit"
              disabled={status === "sending" || status === "success"}
              whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              transition={spring.snap}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all",
                isDark
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  : "border-2 border-foreground bg-primary text-primary-foreground shadow-pop hover:bg-primary/90 disabled:opacity-60"
              )}
            >
              {status === "sending" ? (
                <>Sending…</>
              ) : status === "success" ? (
                <><CheckCircle className="h-4 w-4" /> Sent!</>
              ) : (
                <><Send className="h-4 w-4" /> Send message</>
              )}
            </motion.button>

            {/* Resume download */}
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

            {status === "error" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                Something went wrong. Try emailing directly.
              </span>
            )}
          </div>
        </form>
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
