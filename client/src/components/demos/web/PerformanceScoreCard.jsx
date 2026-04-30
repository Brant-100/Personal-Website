import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";

const SCORES = [
  { label: "Performance",     value: 100, color: "#22E5FF", detail: "Vite code-splitting, lazy routes, tree-shaken deps." },
  { label: "Accessibility",   value: 100, color: "#3BF475", detail: "Semantic HTML, ARIA labels, focus rings, skip links." },
  { label: "Best Practices",  value: 100, color: "#B678FF", detail: "HTTPS, no mixed content, modern image formats." },
  { label: "SEO",             value: 100, color: "#FFD028", detail: "Meta tags, sitemap, structured data, clean URLs." },
];

const SIZE = 80;
const STROKE = 7;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function Gauge({ label, value, color, detail, animate: shouldAnimate }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (!shouldAnimate) { setCount(value); return; }
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, shouldAnimate]);

  const dashOffset = CIRC - (count / 100) * CIRC;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            style={{ filter: isDark ? `drop-shadow(0 0 4px ${color})` : "none" }}
            transition={{ duration: 0.05 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold leading-none">{count}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-1 text-xs text-muted-foreground max-w-[140px]">{detail}</div>
      </div>
    </div>
  );
}

export function PerformanceScoreCard() {
  const prefersReduced = useReducedMotion();

  return (
    <DemoSection
      eyebrow="lighthouse scores"
      heading="Measurably fast"
      description="Every site I ship targets green across the board, not just on paper."
    >
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {SCORES.map((s) => (
          <Gauge key={s.label} {...s} animate={!prefersReduced} />
        ))}
      </div>
    </DemoSection>
  );
}
