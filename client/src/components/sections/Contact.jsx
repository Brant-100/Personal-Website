import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LIGHT_SURFACE_CARD } from "@/lib/popColors";
import { HOMEPAGE_CONTACT_LINKS } from "@/data/contactLinks";
import { LogoDiscord, LogoFacebook, LogoInstagram, LogoSnapchat } from "@/components/social/SocialBrandLogos";

const SOCIAL_BRAND_LOGOS = {
  instagram: LogoInstagram,
  discord: LogoDiscord,
  snapchat: LogoSnapchat,
  facebook: LogoFacebook,
};
import { ContactForm } from "@/components/forms/ContactForm";
import { FAQ } from "@/components/sections/FAQ";

export function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Section id="contact" className="container">
      <Reveal className="mb-4">
        {!isDark && <span className="section-accent-bar bg-pop-pink" aria-hidden />}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 05" : "05 ·"} contact
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {isDark ? (
            <>
              <span className="heading-face">Let&apos;s </span>
              <span className="text-neon">connect</span>
              <span className="heading-face">.</span>
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
        <p className={cn("mt-4 text-lg", isDark ? "text-foreground/75" : "text-muted-foreground")}>
          The fastest way to reach me. I reply within 48 hours.
        </p>
      </Reveal>

      {/* Contact form */}
      <Reveal className="mb-10">
        <ContactForm />
      </Reveal>

      <FAQ embedded />

      {/* Contact cards */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 md:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {HOMEPAGE_CONTACT_LINKS.map((link, i) => (
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

function contactIconTileClass(link, isDark) {
  if (link.brandKey) {
    return isDark ? "bg-muted/45 ring-1 ring-white/12 shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.06)]" : "bg-white ring-1 ring-border shadow-sm";
  }
  if (isDark) return "bg-primary/10 ring-1 ring-primary/30";
  switch (link.tile) {
    case "instagram":
      return "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white shadow-sm";
    case "discord":
      return "bg-[#5865F2] text-white";
    case "snapchat":
      return "bg-[#FFFC00] text-neutral-900";
    case "facebook":
      return "bg-[#0866FF] text-white";
    default:
      break;
  }
  if (link.lightBg === "bg-foreground") return "bg-foreground text-background";
  if (link.lightBg === "bg-primary") return "bg-primary text-primary-foreground";
  if (link.lightBg === "bg-secondary") return "bg-secondary text-secondary-foreground";
  return "bg-accent text-accent-foreground";
}

export function ContactCard({ link, index, isDark }) {
  const Icon = link.icon;
  const BrandLogo = link.brandKey ? SOCIAL_BRAND_LOGOS[link.brandKey] : null;
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
          ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300 hover:border-primary/50 hover:shadow-neon-cyan"
          : LIGHT_SURFACE_CARD
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            contactIconTileClass(link, isDark)
          )}
        >
          {BrandLogo ? (
            <BrandLogo className="h-[1.85rem] w-[1.85rem] shrink-0 drop-shadow-[0_1px_1px_rgb(0_0_0/0.12)] dark:drop-shadow-none" />
          ) : (
            <Icon className={cn("h-6 w-6", isDark && link.darkColor)} />
          )}
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
      {isDark && (
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-15 transition-opacity group-hover:opacity-30",
          "bg-primary"
        )}
      />
      )}
    </motion.a>
  );
}
