import { Quote } from "lucide-react";
import { Section, Reveal } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LIGHT_SURFACE_CARD } from "@/lib/popColors";

// TODO: replace with a real testimonial before launch
const PLACEHOLDER_TESTIMONIALS = [
  {
    id: "placeholder-1",
    quote:
      "[Replace with a real client quote — what problem you solved, how you communicated, and what shipped.]",
    name: "Client Name",
    role: "Role, Company",
  },
];

export function Testimonials() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const testimonial = PLACEHOLDER_TESTIMONIALS[0];

  return (
    <Section id="testimonials" className="container">
      <Reveal className="mb-4">
        {!isDark && <span className="section-accent-bar bg-pop-pink" aria-hidden />}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isDark ? "// 04" : "04 ·"} testimonials
        </span>
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {isDark ? (
            <>
              <span className="heading-face">What </span>
              <span className="text-neon">clients</span>
              <span className="heading-face"> say.</span>
            </>
          ) : (
            <>
              What{" "}
              <span className="relative inline-block text-primary">
                clients
                <span className="absolute inset-x-0 -bottom-1 h-2 bg-accent/70 -z-10" />
              </span>{" "}
              say.
            </>
          )}
        </h2>
      </Reveal>

      <Reveal>
        <figure
          className={cn(
            "relative max-w-3xl rounded-2xl border p-8 md:p-10",
            isDark
              ? "border-primary/20 bg-card/40 shadow-presence-rest"
              : cn(LIGHT_SURFACE_CARD, "border-foreground/10")
          )}
        >
          <Quote
            className={cn(
              "absolute top-6 right-6 h-8 w-8 opacity-20",
              isDark ? "text-primary" : "text-secondary"
            )}
            aria-hidden
          />
          <blockquote className="text-lg md:text-xl leading-relaxed text-foreground/90 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">{testimonial.name}</span>
            <span className="text-sm text-muted-foreground">{testimonial.role}</span>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}
