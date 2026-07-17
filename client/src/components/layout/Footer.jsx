import { Github, Linkedin, Mail, Award, Terminal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FooterFastApiLogo, FooterReactLogo } from "@/components/layout/BrandStack";
import { FOOTER_SOCIAL_LINKS } from "@/data/contactLinks";
import { LogoDiscord, LogoFacebook, LogoInstagram, LogoSnapchat } from "@/components/social/SocialBrandLogos";

const SOCIAL_BRAND_LOGOS = {
  instagram: LogoInstagram,
  discord: LogoDiscord,
  snapchat: LogoSnapchat,
  facebook: LogoFacebook,
};

/** First column: home section anchors (4). */
const FOOTER_NAV_LEFT = [
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Credentials", href: "/#credentials" },
  { label: "Experience", href: "/#experience" },
];

/** Second column: Contact plus pages (4). */
const FOOTER_NAV_RIGHT = [
  { label: "Contact", href: "/#contact" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Now", href: "/now" },
];

const NAV_HEADING_STYLE =
  "mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary";

export function Footer() {
const buildStamp =
    typeof __BUILD_DATE__ !== "undefined"
      ? new Date(__BUILD_DATE__).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "local dev";

  return (
    <footer className="relative border-t border-border dark:border-primary/[0.18] dark:shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.12)]">
      <div className="container py-14">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "bg-primary/10 text-primary ring-1 ring-primary/40"
                )}
              >
                <Terminal className="h-4 w-4" />
              </span>
              <span className="font-mono text-sm font-bold">
                brant<span className="text-primary">.</span>simpson
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Software development and cybersecurity, built from Ohio,
              shipped everywhere.
            </p>
          </div>

          <nav aria-labelledby="footer-nav-heading">
            <p id="footer-nav-heading" className={NAV_HEADING_STYLE}>
              Navigate
            </p>
            <div className="grid grid-cols-2 gap-x-8 text-sm md:gap-x-10 lg:gap-x-12">
              <ul className="space-y-2">
                {FOOTER_NAV_LEFT.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {FOOTER_NAV_RIGHT.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div role="group" aria-labelledby="footer-elsewhere-heading">
            <p id="footer-elsewhere-heading" className={NAV_HEADING_STYLE}>
              Elsewhere
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> brant@brantsimpson.com
              </a>
              <a
                href="https://github.com/Brant-100"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" /> github.com/Brant-100
              </a>
              <a
                href="https://www.linkedin.com/in/brant-simpson-2b5b1b331/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="https://www.credly.com/users/brant-simpson/badges"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Award className="h-4 w-4" /> Credly badges
              </a>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {FOOTER_SOCIAL_LINKS.map((link) => {
                  const Logo = SOCIAL_BRAND_LOGOS[link.brandKey];
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {Logo ? (
                        <Logo className="h-[1.15rem] w-[1.15rem]" />
                      ) : null}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <span className="font-mono">
            © {new Date().getFullYear()} Brant Simpson. All rights reserved.
          </span>
          <span
            className="font-mono inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground"
            aria-label={`Built with React and FastAPI. Build date ${buildStamp}.`}
          >
            <span aria-hidden="true" className="inline-flex items-center gap-2">
              <span className="text-muted-foreground/90">Built with</span>
              <span className="inline-flex items-center gap-1">
                <FooterReactLogo className="h-4 w-4 shrink-0" />
                <span className="text-muted-foreground/55">+</span>
                <FooterFastApiLogo className="h-4 w-4 shrink-0" />
              </span>
              <span className="text-muted-foreground/70">·</span>
              <span className="text-primary/60">{buildStamp}</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
