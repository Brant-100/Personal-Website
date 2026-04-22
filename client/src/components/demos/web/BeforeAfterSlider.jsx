import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

function FauxSiteBefore() {
  return (
    <div className="h-full w-full bg-gray-100 p-4 font-sans text-gray-800 dark:bg-zinc-900 dark:text-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-300 dark:bg-zinc-700 px-3 py-2 text-xs">
        <span className="font-bold uppercase tracking-widest text-gray-500">MY COMPANY</span>
        <div className="flex gap-3 text-gray-400 text-[10px]">
          <span>Home</span><span>About</span><span>Contact</span>
        </div>
      </div>
      <div className="mt-4 bg-gray-200 dark:bg-zinc-800 p-6 text-center">
        <div className="text-base font-bold uppercase text-gray-500 tracking-widest">WELCOME TO MY WEBSITE</div>
        <div className="mt-2 text-[10px] text-gray-400">We provide services and solutions for your needs.</div>
        <div className="mt-3 inline-block bg-blue-500 px-4 py-1 text-[10px] text-white uppercase tracking-wider">Click Here</div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["Service 1","Service 2","Service 3"].map((s) => (
          <div key={s} className="bg-gray-200 dark:bg-zinc-800 p-2 text-center text-[9px] text-gray-500">
            <div className="mx-auto mb-1 h-6 w-6 bg-gray-300 dark:bg-zinc-700" />
            {s}
          </div>
        ))}
      </div>
      <div className="mt-3 bg-gray-200 dark:bg-zinc-800 p-2 text-[9px] text-gray-400">
        Copyright © 2019 My Company. All rights reserved.
      </div>
    </div>
  );
}

function FauxSiteAfter({ isDark }) {
  return (
    <div className={cn(
      "h-full w-full overflow-hidden font-sans",
      isDark ? "bg-[#070B14] text-white" : "bg-white text-gray-900"
    )}>
      <div className={cn(
        "flex items-center justify-between px-4 py-2.5",
        isDark ? "bg-[#0D1220]" : "bg-white border-b border-gray-100"
      )}>
        <span className={cn("font-bold text-xs tracking-tight", isDark ? "text-cyan-400" : "text-indigo-600")}>
          yourco.
        </span>
        <div className="flex gap-3 text-[10px] text-gray-400">
          <span>Work</span><span>Services</span><span>Contact</span>
        </div>
      </div>
      <div className={cn("px-4 pt-5 pb-4", isDark ? "bg-[#070B14]" : "bg-gradient-to-br from-indigo-50 to-white")}>
        <div className={cn("text-[10px] font-mono uppercase tracking-[0.2em] mb-1", isDark ? "text-cyan-400" : "text-indigo-400")}>
          available now
        </div>
        <div className="text-base font-extrabold leading-tight">
          Products built<br />
          <span className={isDark ? "text-cyan-400" : "text-indigo-600"}>to convert.</span>
        </div>
        <div className="mt-2 text-[9px] text-gray-400 max-w-[180px]">
          Bold design. Clean code. Shipped fast.
        </div>
        <div className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-bold",
          isDark ? "bg-cyan-400 text-black" : "bg-indigo-600 text-white"
        )}>
          Start a project →
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 px-4">
        {[
          { label: "Speed", color: isDark ? "bg-cyan-400/20 border-cyan-400/30" : "bg-indigo-100 border-indigo-200" },
          { label: "Design", color: isDark ? "bg-purple-400/20 border-purple-400/30" : "bg-violet-100 border-violet-200" },
          { label: "Scale",  color: isDark ? "bg-green-400/20 border-green-400/30"  : "bg-emerald-100 border-emerald-200" },
        ].map((c) => (
          <div key={c.label} className={cn("rounded-lg border p-2 text-center text-[9px] font-semibold", c.color)}>
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BeforeAfterSlider() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const containerRef = useRef(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const updatePct = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPct(clamp(raw, 2, 98));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePct(e.clientX);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    updatePct(e.clientX);
  };

  const onPointerUp = () => { dragging.current = false; };

  const reset = () => setPct(50);

  return (
    <DemoSection
      eyebrow="before / after"
      heading="Drag to compare"
      description="Drag the handle to see the difference between a tired template and a site built to convert."
      onReset={reset}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative select-none overflow-hidden rounded-2xl border",
          isDark ? "border-border" : "border-2 border-foreground shadow-pop"
        )}
        style={{ height: 320, cursor: "col-resize" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Before layer (full width, behind) */}
        <div className="absolute inset-0">
          <FauxSiteBefore />
        </div>

        {/* After layer (clipped) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        >
          <FauxSiteAfter isDark={isDark} />
        </div>

        {/* Divider line */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white/80 shadow-lg"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        />

        {/* Handle */}
        <motion.div
          className={cn(
            "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full shadow-xl",
            isDark ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
          )}
          style={{ left: `${pct}%` }}
          animate={prefersReduced ? {} : { scale: dragging.current ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        >
          <GripVertical className="h-4 w-4" />
        </motion.div>

        {/* Labels */}
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          Before
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          After
        </div>
      </div>
    </DemoSection>
  );
}
