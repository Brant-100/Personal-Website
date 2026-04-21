import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="container flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        404 — off the grid
      </div>
      <h1
        className={cn(
          "mt-4 text-5xl md:text-7xl font-extrabold tracking-tight",
          isDark && "text-neon"
        )}
      >
        Page not found.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        That route doesn&apos;t exist. It might have moved, or you may have
        followed a broken link.
      </p>
      <div className="mt-8">
        <Button size="lg" variant={isDark ? "default" : "pop"} asChild>
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
