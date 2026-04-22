import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const chan = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function Badge({ pass, label }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
      pass ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
    )}>
      {pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </div>
  );
}

export function ContrastChecker() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#1a1a2e");
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");

  const ratio = contrastRatio(fg, bg);
  const ratioDisplay = ratio.toFixed(2);

  const aaLarge  = ratio >= 3;
  const aaNormal = ratio >= 4.5;
  const aaaLarge  = ratio >= 4.5;
  const aaaNormal = ratio >= 7;

  const reset = () => { setFg("#ffffff"); setBg("#1a1a2e"); setText("The quick brown fox jumps over the lazy dog."); };

  return (
    <DemoSection
      eyebrow="accessibility"
      heading="Contrast checker"
      description="Pick two colors and see the WCAG contrast ratio live — AA and AAA for both normal and large text."
      onReset={reset}
    >
      <div className={cn(
        "rounded-2xl p-6",
        isDark ? "border border-border bg-card/70 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
      )}>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
          {/* Color pickers */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Foreground
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-xl border border-border bg-transparent p-0.5"
                />
                <span className="font-mono text-sm">{fg.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Background
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-xl border border-border bg-transparent p-0.5"
                />
                <span className="font-mono text-sm">{bg.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Ratio + badges */}
          <div className="flex flex-col justify-center gap-4">
            <div className="text-center">
              <motion.div
                key={ratioDisplay}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="text-5xl font-extrabold tabular-nums"
              >
                {ratioDisplay}
              </motion.div>
              <div className="mt-1 text-xs text-muted-foreground">contrast ratio</div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge pass={aaNormal} label="AA Normal" />
              <Badge pass={aaLarge}  label="AA Large" />
              <Badge pass={aaaNormal} label="AAA Normal" />
              <Badge pass={aaaLarge}  label="AAA Large" />
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Preview
            </label>
            <div
              className="rounded-xl p-4"
              style={{ background: bg }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full resize-none bg-transparent text-base md:text-sm leading-relaxed outline-none"
                style={{ color: fg }}
              />
              <div
                className="mt-2 text-xs opacity-80"
                style={{ color: fg }}
              >
                Small text sample — harder to read at low contrast.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
