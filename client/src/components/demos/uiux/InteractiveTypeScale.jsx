import { useState } from "react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/** Named steps use the same ratios as common musical intervals—reused in typography to space type sizes. */
const RATIO_PRESETS = [
  {
    value: 1.125,
    name: "Minor Second",
    blurb:
      "The smallest step here: each tier only nudges larger, so hierarchy feels subtle and tight—like a tiny half-step between notes.",
  },
  {
    value: 1.2,
    name: "Major Second",
    blurb:
      "Still gentle jumps. Good when you want clear levels without headlines exploding—common for UI-heavy, text-dense layouts.",
  },
  {
    value: 1.25,
    name: "Major Third",
    blurb:
      "A familiar “one-fourth bigger each step” rhythm (×1.25). Balanced contrast: headings stand out without feeling theatrical.",
  },
  {
    value: 1.333,
    name: "Perfect Fourth",
    blurb:
      "Based on the 4:3 interval—wider steps, so display type pulls away from body copy more dramatically.",
  },
  {
    value: 1.414,
    name: "Augmented Fourth",
    blurb:
      "Roughly √2: two steps ≈ double the size. Bold hierarchy; the musical name is the tritone—the “devil’s interval.”",
  },
  {
    value: 1.5,
    name: "Perfect Fifth",
    blurb:
      "Strong, poster-like gaps between tiers. Great when you want hero display type to feel unmistakably above everything else.",
  },
  {
    value: 1.618,
    name: "Golden Ratio",
    blurb:
      "φ ≈ 1.618—the proportion famous in art and nature. Each step scales by phi; many people find the rhythm naturally pleasing.",
  },
];

const PRESET_MATCH_EPS = 0.015;

const BASE = 16;

const TIERS = [
  { label: "caption", n: -1, weight: "font-normal", sample: "Caption — supporting notes and fine print" },
  { label: "body",    n: 0,  weight: "font-normal", sample: "Body — the primary reading text for paragraphs" },
  { label: "h3",      n: 1,  weight: "font-semibold", sample: "Heading 3 — section subheadings" },
  { label: "h2",      n: 2,  weight: "font-bold",     sample: "Heading 2 — major page sections" },
  { label: "h1",      n: 3,  weight: "font-extrabold", sample: "Heading 1 — primary page title" },
  { label: "display", n: 4,  weight: "font-extrabold tracking-tight", sample: "Display" },
];

function getNearestPreset(val) {
  return RATIO_PRESETS.reduce((prev, curr) =>
    Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev
  );
}

function getRatioName(val) {
  const nearest = getNearestPreset(val);
  if (Math.abs(nearest.value - val) < PRESET_MATCH_EPS) return nearest.name;
  return `Custom (${val.toFixed(3)})`;
}

export function InteractiveTypeScale() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [ratio, setRatio] = useState(1.333);

  const reset = () => setRatio(1.333);

  return (
    <DemoSection
      eyebrow="typography"
      heading="Interactive type scale"
      description="Drag the slider to see how changing the scale ratio affects every tier of text."
      onReset={reset}
    >
      <div className={cn(
        "rounded-2xl p-6",
        isDark ? "border border-border bg-card/70 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
      )}>
        {/* Slider */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="range"
              min={1.125}
              max={1.618}
              step={0.001}
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>1.125</span>
              <span>1.618</span>
            </div>
          </div>
          <div className="text-right sm:min-w-[9rem]">
            <div className="font-mono text-lg font-bold">{ratio.toFixed(3)}</div>
            <div className="text-neon-subtle text-xs font-semibold text-primary">{getRatioName(ratio)}</div>
          </div>
        </div>

        {/* Scale tiers */}
        <div className="space-y-4">
          {TIERS.map((tier) => {
            const size = BASE * Math.pow(ratio, tier.n);
            const fontPx = Math.min(size, 72);
            return (
              <div
                key={tier.label}
                className="flex items-baseline gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">
                  <div>{tier.label}</div>
                  <div className="text-primary">{size.toFixed(1)}px</div>
                </div>
                <div
                  className={cn(
                    "min-w-0 flex-1 leading-tight transition-[font-size] duration-150 ease-out",
                    tier.weight
                  )}
                  style={{ fontSize: `${fontPx}px` }}
                >
                  {tier.sample}
                </div>
              </div>
            );
          })}
        </div>

        <details
          className={cn(
            "mt-8 rounded-lg border px-3 py-2 text-left",
            isDark ? "border-border bg-background/40" : "border-border bg-muted/30"
          )}
        >
          <summary className="cursor-pointer select-none text-xs font-medium text-foreground">
            What do these scale names mean?
          </summary>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Typographers borrow labels from music: the ratio between two notes is the same multiplier you use between type
            sizes (caption → body → heading → display). The number is what you multiply by at each step up the scale.
          </p>
          <dl className="mt-3 space-y-2.5 border-t border-border/50 pt-3">
            {RATIO_PRESETS.map((p) => (
              <div key={p.name}>
                <dt className="text-[11px] font-semibold text-foreground">
                  <span className="font-mono text-primary">{p.value}</span>
                  <span className="mx-1.5 text-muted-foreground">·</span>
                  {p.name}
                </dt>
                <dd className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{p.blurb}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </DemoSection>
  );
}
