import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ArrowRight } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const SIZES = ["sm", "md", "lg"];
const VARIANTS = ["solid", "outline", "ghost"];

const DEFAULT = {
  label: "Get started",
  color: "#22E5FF",
  size: "md",
  variant: "solid",
  shadow: true,
  rounded: "xl",
};

const SIZE_MAP = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const ROUNDED_MAP = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const CLASS_PREFIX = "inline-flex items-center gap-2 font-semibold transition-all";

function buildClassName(cfg) {
  const parts = [
    CLASS_PREFIX,
    SIZE_MAP[cfg.size],
    ROUNDED_MAP[cfg.rounded],
  ];

  if (cfg.variant === "solid") {
    parts.push("text-black");
  } else if (cfg.variant === "outline") {
    parts.push("border-2 bg-transparent");
  } else {
    parts.push("bg-transparent");
  }

  // Ghost has no filled box — box-shadow is nearly invisible; drop-shadow follows the glyphs.
  if (cfg.shadow) {
    parts.push(cfg.variant === "ghost" ? "drop-shadow-md" : "shadow-md");
  }

  return parts.join(" ");
}

function buildSnippet(cfg) {
  const cls = buildClassName(cfg);
  const colorParts =
    cfg.variant === "solid"
      ? `background: "${cfg.color}"`
      : `color: "${cfg.color}", borderColor: "${cfg.color}"`;

  const rest =
    cls.startsWith(CLASS_PREFIX) && cls.length > CLASS_PREFIX.length
      ? cls.slice(CLASS_PREFIX.length).trim()
      : cls;

  // Split prefix / tail so toggling shadow only changes the second string — avoids a new wrapped line and layout jump
  const classNameBlock =
    cls.startsWith(CLASS_PREFIX) && rest
      ? `className={
    "${CLASS_PREFIX} " +
    "${rest}"
  }`
      : `className="${cls}"`;

  return `<motion.button
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  ${classNameBlock}
  style={{ ${colorParts} }}
>
  ${cfg.label}
  <ArrowRight className="h-4 w-4" />
</motion.button>`;
}

export function ComponentPlayground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cfg, setCfg] = useState(() => ({ ...DEFAULT }));
  const [copied, setCopied] = useState(false);

  const set = (key, val) => setCfg((p) => ({ ...p, [key]: val }));
  const reset = () => setCfg({ ...DEFAULT });

  const copy = async () => {
    await navigator.clipboard.writeText(buildSnippet(cfg));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const previewStyle =
    cfg.variant === "solid"
      ? { background: cfg.color }
      : { color: cfg.color, borderColor: cfg.color };

  return (
    <DemoSection
      eyebrow="component playground"
      heading="Build a component, live"
      description="Tweak the controls and watch the button update. Copy the generated code when you like what you see."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Controls */}
        <div className={cn(
          "space-y-5 rounded-2xl p-5",
          isDark ? "border border-border bg-card/60 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
        )}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Label</label>
            <input
              value={cfg.label}
              onChange={(e) => set("label", e.target.value)}
              className={cn(
                "w-full rounded-lg border px-3 py-1.5 text-base md:text-sm bg-transparent outline-none",
                "border-border focus:border-primary"
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Accent color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cfg.color}
                onChange={(e) => set("color", e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
              />
              <span className="font-mono text-sm">{cfg.color.toUpperCase()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Variant</label>
            <div className="flex gap-1">
              {VARIANTS.map((v) => (
                <button
                  key={v}
                  onClick={() => set("variant", v)}
                  className={cn(
                    "flex-1 rounded-lg px-2 py-1 text-xs font-medium capitalize transition-colors",
                    cfg.variant === v
                      ? isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Size</label>
            <div className="flex gap-1">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => set("size", s)}
                  className={cn(
                    "flex-1 rounded-lg px-2 py-1 text-xs font-medium uppercase transition-colors",
                    cfg.size === s
                      ? isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Radius</label>
            <div className="flex flex-wrap gap-1">
              {Object.keys(ROUNDED_MAP).map((r) => (
                <button
                  key={r}
                  onClick={() => set("rounded", r)}
                  className={cn(
                    "rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                    cfg.rounded === r
                      ? isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="playground-shadow" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Shadow
            </label>
            <button
              id="playground-shadow"
              type="button"
              role="switch"
              aria-checked={cfg.shadow}
              onClick={() => set("shadow", !cfg.shadow)}
              className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                cfg.shadow ? "bg-primary" : "bg-border"
              )}
            >
              {/* w-9 (36px) − thumb (16px) − inset (4px) → travel 16px; base left-0.5 + translateX */}
              <motion.span
                animate={{ x: cfg.shadow ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-white shadow"
              />
            </button>
          </div>
        </div>

        {/* Preview + code — fixed preview height + fixed code viewport so toggles don’t resize the column */}
        <div className="flex min-h-0 flex-col gap-4">
          {/* Preview box */}
          <div className={cn(
            "flex h-40 shrink-0 items-center justify-center rounded-2xl",
            isDark ? "border border-border bg-card/60 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
          )}>
            <motion.button
              key={JSON.stringify(cfg)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className={buildClassName(cfg)}
              style={previewStyle}
            >
              {cfg.label}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Generated code */}
          <div className={cn(
            "relative flex min-h-0 flex-col overflow-hidden rounded-2xl",
            isDark ? "border border-border bg-card/70" : "border-2 border-foreground bg-card shadow-pop"
          )}>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">generated jsx</span>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "copied!" : "copy"}
              </button>
            </div>
            <pre className="max-h-64 min-h-64 overflow-auto p-4 font-mono text-xs leading-6 text-foreground/80 [overflow-wrap:anywhere]">
              {buildSnippet(cfg)}
            </pre>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
