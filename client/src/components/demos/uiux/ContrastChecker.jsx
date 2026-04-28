import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, X } from "lucide-react";
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

const BADGE_POPUPS = {
  "AA Normal": {
    what:
      "**WCAG AA** is the level most teams and laws aim for. For **normal-sized** text (typical paragraphs, nav links, form labels), you need at least **4.5:1** contrast between text and background.",
    site:
      "On a real site, that decides whether body copy and small UI text feel crisp or mushy. Too little contrast tires eyes, hurts readability on phones in sunlight, and can fail accessibility audits or legal checks.",
    plain:
      "Picture regular-size words on a screen like lettering on a toolbox or a warning sticker: if the letters and the background are too close in color, you squint. This rule means normal paragraphs and small labels need enough difference so most people can read them straight away — bright shop or not.",
  },
  "AA Large": {
    what:
      "**AA** allows **3:1** for **large** text — roughly **24px+** regular weight or **18px+** bold. Headlines and big buttons often qualify, because bigger type is easier to parse.",
    site:
      "You can use slightly softer color pairs for hero titles or big CTAs and still meet AA, but only if the type really is large by the spec. Misjudging that leaves blocks of text harder to read than you expect.",
    plain:
      "Huge text is like a sign on the side of a truck — you can still make it out from farther away even if the colors aren’t wildly different. So the bar is a bit lower, but only when the words are actually big (headlines, big buttons), not when someone zooms out or shrinks the page.",
  },
  "AAA Normal": {
    what:
      "**AAA** is stricter than AA. **Normal** text must hit **7:1** — a high bar for foreground/background separation.",
    site:
      "Sites that commit to AAA normal text prioritize maximum legibility (long-form reading, education, inclusive design). You will need bolder color separation, which steers your whole palette.",
    plain:
      "This is the fussier standard — think safety signage where you really can’t afford someone to misread a line. Small body copy has to jump off the background more than usual. It’s for when you want reading the site to feel effortless, especially for folks with weaker eyesight.",
  },
  "AAA Large": {
    what:
      "For **AAA**, **large** text must reach **4.5:1** — the same ratio AA requires for normal text, so large type still has to pop clearly off the background.",
    site:
      "Even headings under AAA need strong contrast. That affects marketing layouts and brand colors: washed-out hero text on a photo or pastel background often will not pass without extra treatment.",
    plain:
      "Even big titles don’t get a free ride. It’s like white paint on a dirty bumper — if the letters don’t stand out clean against what’s behind them, people strain. Hero banners and chunky headings still need strong color separation so nobody fights to read them.",
  },
};

function PopupBody({ what, site, plain }) {
  return (
    <>
      <p className="text-xs font-medium leading-relaxed text-foreground">{formatBold(what)}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{formatBold(site)}</p>
      <div className="mt-3 rounded-lg border border-border bg-muted/50 px-2.5 py-2.5 dark:bg-muted/30">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          Plain English
        </div>
        <p className="text-xs leading-relaxed text-foreground/95">{plain}</p>
      </div>
    </>
  );
}

/** Renders **word** segments as bold. */
function formatBold(s) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

function Badge({ pass, label, isOpen, onToggleInfo }) {
  const data = BADGE_POPUPS[label];
  const panelId = `contrast-badge-help-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="relative inline-flex align-top">
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          pass ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
        )}
      >
        {pass ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
        <span>{label}</span>
        {data && (
          <button
            type="button"
            className={cn(
              "-mr-0.5 ml-0.5 inline-flex shrink-0 rounded-full p-0.5 outline-none ring-offset-2 transition-colors",
              "hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-primary",
              pass ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
              isOpen && "bg-foreground/15"
            )}
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={`Learn what ${label} means`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo();
            }}
          >
            <Info className="h-3 w-3 opacity-80" strokeWidth={2.5} aria-hidden />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && data && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${label} explained`}
            /* Tailwind -translate-x-1/2 is overwritten by motion's transform (y/scale). x: "-50%" is merged. */
            initial={{ opacity: 0, y: 6, scale: 0.96, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 6, scale: 0.96, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={cn(
              "absolute bottom-full left-1/2 z-50 mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border p-3 text-left shadow-xl",
              "border-border bg-card text-card-foreground"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            <PopupBody what={data.what} site={data.site} plain={data.plain} />
            <p className="mt-2 border-t border-border pt-2 text-[10px] text-muted-foreground">
              From WCAG 2.1 contrast rules (simplified). Click away or press Esc to close.
            </p>
            <div
              className={cn(
                "absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-border bg-card",
                "border-t-0 border-l-0"
              )}
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContrastChecker() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#1a1a2e");
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
  const [openBadge, setOpenBadge] = useState(null);
  const badgesWrapRef = useRef(null);

  useEffect(() => {
    if (!openBadge) return;
    const onKey = (e) => e.key === "Escape" && setOpenBadge(null);
    const onPointer = (e) => {
      if (badgesWrapRef.current && !badgesWrapRef.current.contains(e.target)) {
        setOpenBadge(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [openBadge]);

  const ratio = contrastRatio(fg, bg);
  const ratioDisplay = ratio.toFixed(2);

  const aaLarge  = ratio >= 3;
  const aaNormal = ratio >= 4.5;
  const aaaLarge  = ratio >= 4.5;
  const aaaNormal = ratio >= 7;

  const reset = () => {
    setFg("#ffffff");
    setBg("#1a1a2e");
    setText("The quick brown fox jumps over the lazy dog.");
    setOpenBadge(null);
  };

  return (
    <DemoSection
      eyebrow="accessibility"
      heading="Contrast checker"
      description="Pick two colors and see the WCAG contrast ratio live — AA and AAA for both normal and large text."
      onReset={reset}
    >
      <div className={cn(
        "rounded-2xl p-6",
        isDark ? "border border-border bg-card/70 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
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
          <div className="flex flex-col justify-center gap-4 overflow-visible">
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
            <div ref={badgesWrapRef} className="flex flex-wrap justify-center gap-2 pt-1">
              <Badge
                pass={aaNormal}
                label="AA Normal"
                isOpen={openBadge === "AA Normal"}
                onToggleInfo={() => setOpenBadge((v) => (v === "AA Normal" ? null : "AA Normal"))}
              />
              <Badge
                pass={aaLarge}
                label="AA Large"
                isOpen={openBadge === "AA Large"}
                onToggleInfo={() => setOpenBadge((v) => (v === "AA Large" ? null : "AA Large"))}
              />
              <Badge
                pass={aaaNormal}
                label="AAA Normal"
                isOpen={openBadge === "AAA Normal"}
                onToggleInfo={() => setOpenBadge((v) => (v === "AAA Normal" ? null : "AAA Normal"))}
              />
              <Badge
                pass={aaaLarge}
                label="AAA Large"
                isOpen={openBadge === "AAA Large"}
                onToggleInfo={() => setOpenBadge((v) => (v === "AAA Large" ? null : "AAA Large"))}
              />
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
