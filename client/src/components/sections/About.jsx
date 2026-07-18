import { MapPin, ArrowRight, GraduationCap, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, Reveal } from "@/components/motion/MotionPrimitives";
import { cn } from "@/lib/utils";
import { HEADSHOT_PUBLIC_PATH, SHOW_HEADSHOT } from "@/lib/headshot";
export function About() {
return (
    <Section id="about" className="container">
      <Reveal className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {"// 00"} about
        </span>
      </Reveal>

      <div
        className={cn(
          "grid gap-12 items-center",
          SHOW_HEADSHOT && "lg:grid-cols-[1fr_320px]"
        )}
      >
        {/* Left: short personal bio */}
        <div>
          <Reveal className="mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <>
                <span className="heading-face">Who I </span>
                <span className="text-neon">am</span>
                <span className="heading-face">.</span>
              </>
            </h2>
          </Reveal>

          <div className="space-y-4 max-w-xl">
            <Reveal>
              <p className="text-lg md:text-xl font-medium leading-snug">
                I&apos;m a software developer based in{" "}
                <span className={cn("inline-flex items-center gap-1", "text-primary")}>
                  <MapPin className="h-4 w-4" />Ohio
                </span>{" "}
                who builds software that solves real problems and takes pride in the quality of what I ship.
              </p>
            </Reveal>

            <Reveal>
              <p className="text-base text-muted-foreground leading-relaxed">
                I graduated from MCCTC&apos;s Software Engineering program in May 2026, and I&apos;m excited
                to start new projects and work with people.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <Link
              to="/about"
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                "text-primary hover:text-primary/80"
              )}
            >
              More about me <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {SHOW_HEADSHOT && (
          <Reveal>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">

                {/* Decorative background blob */}
                <div className={cn(
                  "absolute -inset-4 rounded-3xl blur-2xl opacity-40",
                  "bg-primary/30"
                )} />

                
                  <>
                    <div className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-primary" />
                    <div className="absolute -right-2 -bottom-2 h-5 w-5 border-r-2 border-b-2 border-primary" />
                  </>
                

                {/* Image frame */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl",
                    "ring-2 ring-primary/40 bg-card/70 shadow-presence-rest transition-shadow duration-300 p-4"
                  )}
                >
                  <img
                    src={HEADSHOT_PUBLIC_PATH}
                    alt="Brant Simpson"
                    width="260"
                    height="260"
                    className="block rounded-xl"
                  />
                  
                    <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                  
                </div>

                {/* Floating badge: school */}
                <div className={cn(
                  "absolute -left-6 bottom-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
                  "bg-card/90 ring-1 ring-border text-foreground shadow-lg"
                )}>
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  MCCTC · &apos;26
                </div>

                {/* Floating badge: role */}
                <div className={cn(
                  "absolute -right-6 top-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
                  "bg-card/90 ring-1 ring-border text-foreground shadow-lg"
                )}>
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  Software Eng.
                </div>

              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
