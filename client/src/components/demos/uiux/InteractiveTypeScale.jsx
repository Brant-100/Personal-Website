import { useState } from "react";
import { motion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const RATIO_NAMES = [
  { value: 1.125, name: "Minor Second" },
  { value: 1.2,   name: "Major Second" },
  { value: 1.25,  name: "Major Third" },
  { value: 1.333, name: "Perfect Fourth" },
  { value: 1.414, name: "Augmented Fourth" },
  { value: 1.5,   name: "Perfect Fifth" },
  { value: 1.618, name: "Golden Ratio" },
];

const BASE = 16;

const TIERS = [
  { label: "caption", n: -1, weight: "font-normal", sample: "Caption — supporting notes and fine print" },
  { label: "body",    n: 0,  weight: "font-normal", sample: "Body — the primary reading text for paragraphs" },
  { label: "h3",      n: 1,  weight: "font-semibold", sample: "Heading 3 — section subheadings" },
  { label: "h2",      n: 2,  weight: "font-bold",     sample: "Heading 2 — major page sections" },
  { label: "h1",      n: 3,  weight: "font-extrabold", sample: "Heading 1 — primary page title" },
  { label: "display", n: 4,  weight: "font-extrabold tracking-tight", sample: "Display" },
];

function getRatioName(val) {
  const nearest = RATIO_NAMES.reduce((prev, curr) =>
    Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev
  );
  if (Math.abs(nearest.value - val) < 0.015) return nearest.name;
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
        isDark ? "border border-border bg-card/70 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
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
          <div className="text-right">
            <div className="font-mono text-lg font-bold">{ratio.toFixed(3)}</div>
            <div className="text-xs text-primary">{getRatioName(ratio)}</div>
          </div>
        </div>

        {/* Scale tiers */}
        <div className="space-y-4">
          {TIERS.map((tier) => {
            const size = BASE * Math.pow(ratio, tier.n);
            return (
              <motion.div
                key={tier.label}
                layout
                className="flex items-baseline gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">
                  <div>{tier.label}</div>
                  <div className="text-primary">{size.toFixed(1)}px</div>
                </div>
                <motion.div
                  animate={{ fontSize: `${Math.min(size, 72)}px` }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  className={cn("leading-tight overflow-hidden whitespace-nowrap", tier.weight)}
                  style={{ fontSize: `${Math.min(size, 72)}px` }}
                >
                  {tier.sample}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DemoSection>
  );
}
