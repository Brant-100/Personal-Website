import { Github, Linkedin, Mail, Award, Terminal, FileText, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className="relative border-t border-border">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isDark
                    ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                    : "bg-foreground text-background"
                )}
              >
                <Terminal className="h-4 w-4" />
              </span>
              <span className="font-mono text-sm font-bold">
                brant<span className="text-primary">.</span>simpson
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Software development and cybersecurity — built from Ohio,
              shipped everywhere.
            </p>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Navigate
            </div>
            <ul className="space-y-2 text-sm">
              {["About", "Services", "Projects", "Credentials", "Experience", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`/#${l.toLowerCase()}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
              <li>
                <a href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="/now" className="text-muted-foreground transition-colors hover:text-foreground">
                  Now
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Elsewhere
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:brantsimpson100@gmail.com"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> brantsimpson100@gmail.com
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
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <span className="font-mono">
            © {new Date().getFullYear()} Brant Simpson — all rights reserved.
          </span>
          <span className="font-mono">
            {isDark ? (
              <>
                built with React + FastAPI · deployed on Vercel ·{" "}
                <span className="text-primary/60">
                  {typeof __BUILD_DATE__ !== "undefined"
                    ? new Date(__BUILD_DATE__).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "local dev"}
                </span>
              </>
            ) : (
              <>built with React + FastAPI · deployed on Vercel</>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
