import { Github, Mail, Terminal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer id="contact" className="relative border-t border-border">
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
              Software development and offensive cyber operations — built from Ohio,
              shipped everywhere.
            </p>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Navigate
            </div>
            <ul className="space-y-2 text-sm">
              {["Services", "Projects", "Credentials", "Experience"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Contact
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:brant@brantsimpson.com"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> brant@brantsimpson.com
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" /> github
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
            {isDark ? "// status: online" : "built with curiosity + caffeine"}
          </span>
        </div>
      </div>
    </footer>
  );
}
