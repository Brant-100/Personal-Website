import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { cn } from "@/lib/utils";
import { HOMEPAGE_CONTACT_LINKS } from "@/data/contactLinks";
import { LogoDiscord, LogoFacebook, LogoInstagram, LogoSnapchat } from "@/components/social/SocialBrandLogos";
import { ContactForm } from "@/components/forms/ContactForm";
import { BookCallButton } from "@/components/BookCallButton";

const SOCIAL_BRAND_LOGOS = {
  instagram: LogoInstagram,
  discord: LogoDiscord,
  snapchat: LogoSnapchat,
  facebook: LogoFacebook,
};

export function Contact() {
  return (
    <Section id="contact" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {"// 05"} contact
        </span>
      </Reveal>
      <Reveal className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <>
            <span className="heading-face">Let&apos;s </span>
            <span className="text-neon">connect</span>
            <span className="heading-face">.</span>
          </>
        </h2>
        <p className={cn("mt-4 text-lg", "text-foreground/75")}>
          The fastest way to reach me. I reply within 48 hours.
        </p>
      </Reveal>

      <Reveal className="mb-10">
        <ContactForm />
      </Reveal>

      <Reveal className="mb-10">
        <BookCallButton variant="default" />
      </Reveal>

      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 md:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {HOMEPAGE_CONTACT_LINKS.map((link) => (
          <ContactCard key={link.id} link={link} />
        ))}
      </motion.div>
    </Section>
  );
}

function contactIconTileClass(link) {
  if (link.brandKey) {
    return "bg-muted/45 ring-1 ring-white/12 shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.06)]";
  }
  return "bg-primary/10 ring-1 ring-primary/30";
}

export function ContactCard({ link }) {
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
      whileHover={{ y: -6, rotate: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snap}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300 hover:border-primary/50 hover:shadow-neon-cyan"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            contactIconTileClass(link)
          )}
        >
          {BrandLogo ? (
            <BrandLogo className="h-[1.85rem] w-[1.85rem] shrink-0 drop-shadow-none" />
          ) : (
            <Icon className={cn("h-6 w-6", link.darkColor)} />
          )}
        </div>
        <ArrowUpRight
          className={cn(
            "h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
            "text-primary"
          )}
        />
      </div>

      <div className="mt-6">
        <div
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.25em]",
            "text-primary"
          )}
        >
          {link.label}
        </div>
        <div
          className={cn(
            "mt-1 break-all text-base font-semibold leading-snug",
            "text-neon"
          )}
        >
          {link.handle}
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-15 transition-opacity group-hover:opacity-30",
          "bg-primary"
        )}
      />
    </motion.a>
  );
}
