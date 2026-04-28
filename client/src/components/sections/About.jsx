import { MapPin, ArrowRight, GraduationCap, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, Reveal } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Section id="about" className="container">
      <Reveal className="mb-4">
        {!isDark && <span className="section-accent-bar bg-pop-pink" aria-hidden />}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 00" : "00 ·"} about
        </span>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px] items-center">
        {/* Left: short personal bio */}
        <div>
          <Reveal className="mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {isDark ? (
                <>
                  <span className="heading-face">Who I </span>
                  <span className="text-neon">am</span>
                  <span className="heading-face">.</span>
                </>
              ) : (
                <>
                  Who I{" "}
                  <span className="relative inline-block text-primary">
                    am
                    <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
                  </span>
                  .
                </>
              )}
            </h2>
          </Reveal>

          <div className="space-y-4 max-w-xl">
            <Reveal>
              <p className="text-lg md:text-xl font-medium leading-snug">
                I&apos;m a 17 year old from{" "}
                <span className={cn("inline-flex items-center gap-1", isDark ? "text-primary" : "text-primary")}>
                  <MapPin className="h-4 w-4" />Ohio
                </span>{" "}
                who builds software that solves real problems and takes pride in the quality of what I ship.
              </p>
            </Reveal>

            <Reveal>
              <p className="text-base text-muted-foreground leading-relaxed">
                I&apos;m finishing up my Software Engineering program at MCCTC, graduating May 2026.
                Outside of school I&apos;m working toward military service and always have
                something on the side — a project, a cert, or something I&apos;m trying to figure out.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <Link
              to="/about"
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                isDark ? "text-primary hover:text-primary/80" : "text-primary hover:underline"
              )}
            >
              More about me <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Right: avatar */}
        <Reveal>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">

              {/* Decorative background blob */}
              <div className={cn(
                "absolute -inset-4 rounded-3xl blur-2xl opacity-40",
                isDark ? "bg-primary/30" : "bg-primary/20"
              )} />

              {/* Corner ticks */}
              <div className={cn("absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2", isDark ? "border-primary" : "border-foreground")} />
              <div className={cn("absolute -right-2 -bottom-2 h-5 w-5 border-r-2 border-b-2", isDark ? "border-primary" : "border-foreground")} />

              {/* Image frame */}
              <div className={cn(
                "relative overflow-hidden rounded-2xl",
                isDark
                  ? "ring-2 ring-primary/40 bg-card/70 shadow-presence-rest transition-shadow duration-300"
                  : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
              )}>
                <img
                  src="/brant-avatar.svg"
                  alt="Brant Simpson"
                  width="260"
                  height="260"
                  className="rounded-2xl block"
                />
                {isDark && (
                  <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                )}
              </div>

              {/* Floating badge — school */}
              <div className={cn(
                "absolute -left-6 bottom-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm",
                isDark
                  ? "bg-card/90 ring-1 ring-border text-foreground"
                  : "bg-card border border-border text-foreground"
              )}>
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                MCCTC · &apos;26
              </div>

              {/* Floating badge — role */}
              <div className={cn(
                "absolute -right-6 top-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm",
                isDark
                  ? "bg-card/90 ring-1 ring-border text-foreground"
                  : "bg-card border border-border text-foreground"
              )}>
                <Code2 className="h-3.5 w-3.5 text-primary" />
                Software Eng.
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
