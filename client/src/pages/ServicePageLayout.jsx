import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ServicePageLayout({
  eyebrow,
  title,
  tagline,
  tags = [],
  children,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative overflow-hidden pt-28 md:pt-36">
      {/* Backdrop (differs per theme) */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-cyber-grid bg-grid-32 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute right-10 top-32 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />
            <div className="absolute left-1/3 bottom-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
          </>
        )}
      </div>

      <section className="container relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> back to services
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-6 max-w-3xl"
        >
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {eyebrow}
          </div>
          <h1
            className={cn(
              "text-4xl md:text-6xl font-extrabold tracking-tight",
              isDark && "text-neon"
            )}
          >
            {title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{tagline}</p>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} variant={isDark ? "default" : "outline"}>
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant={isDark ? "default" : "pop"} asChild>
              <a
                href="mailto:brantsimpson100@gmail.com"
                className="inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" /> Start a project
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/#contact">Other ways to reach me</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="container relative z-10 pb-28 md:pb-32">{children}</section>
    </div>
  );
}
