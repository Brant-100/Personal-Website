/*
 * Five-color rotation palette for the light theme.
 *
 * Tailwind's JIT scans these literal strings and compiles the matching
 * utility classes. Keep entries as full string literals; never build
 * them with template strings, or the JIT will not see them.
 *
 * Rotation order (as specified by the brief):
 *   pop-pink -> pop-cyan -> pop-purple -> pop-lime -> primary
 */

/* Tinted washes behind rotated accent ink */
export const CHIP_BG = [
  "bg-pop-pink/34",
  "bg-pop-cyan/34",
  "bg-pop-purple/34",
  "bg-pop-lime/34",
  "bg-primary/26",
];

export const CHIP_TEXT = [
  "text-pop-pink",
  "text-pop-cyan",
  "text-pop-purple",
  "text-pop-lime",
  "text-primary",
];

export const CHIP_RING = [
  "ring-pop-pink/55",
  "ring-pop-cyan/55",
  "ring-pop-purple/55",
  "ring-pop-lime/55",
  "ring-primary/55",
];

/**
 * Vertical accent stripes for FAQ / list rails (opaque bg).
 * Order matches CHIP_* rotation; index with popBy(i, FAQ_STRIPE).
 */
export const FAQ_STRIPE = [
  "bg-pop-pink",
  "bg-pop-cyan",
  "bg-pop-purple",
  "bg-pop-lime",
  "bg-primary",
];

export const CARD_SHADOW = [
  "shadow-soft-pink",
  "shadow-soft-cyan",
  "shadow-soft-purple",
  "shadow-soft-orange",
  "shadow-soft-blue",
];

export const CARD_HOVER_SHADOW = [
  "hover:shadow-soft-pink",
  "hover:shadow-soft-cyan",
  "hover:shadow-soft-purple",
  "hover:shadow-soft-orange",
  "hover:shadow-soft-blue",
];

/** Pure helper: pick the entry at `i mod arr.length`. */
export function popBy(i, arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const idx = ((i % arr.length) + arr.length) % arr.length;
  return arr[idx];
}

/** Unified light-mode card shell (surface treatment only). Use on light branches (`!isDark`). */
export const LIGHT_SURFACE_CARD =
  "rounded-2xl border border-border bg-card/75 backdrop-blur-sm shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.12)]";

/** Pop hue indices into CHIP_LIGHT_TECH_STACK / CHIP_LIGHT_TAG_OUTLINE (length 6). */
export function popHueIndexFromLabel(label, fallbackIndex = 0) {
  const s = String(label || "").toLowerCase();
  if (/python|fastapi|django|pytest|socket|sqlite|wal|jwt|aes|bash|\bcli\b|c\+\+|\bc#\b/.test(s))
    return 1;
  if (/react|next|tailwind|vite|framer|vue|svelte|webpack/.test(s)) return 0;
  if (/docker|kubernetes|prisma|postgres|redis|nginx|\bsql\b|mongodb/.test(s)) return 2;
  if (/typescript|\bts\b|node\.?js|eslint|pnpm|yarn/.test(s)) return 5;
  if (/security|cyber|offensive|mitre|\bred\b|malware|networking|\bnmap\b/.test(s)) return 4;
  if (/html|css|javascript|jquery|\bui\b|ux|design|figma/.test(s)) return 0;
  return ((fallbackIndex % 6) + 6) % 6;
}

/**
 * STACK chips: saturated filled pills (light theme).
 * Full literal strings for Tailwind JIT.
 */
export const CHIP_LIGHT_TECH_STACK = [
  "inline-flex items-center rounded-full border-0 bg-pop-pink px-3 py-1 font-mono text-xs font-semibold text-white shadow-none",
  "inline-flex items-center rounded-full border-0 bg-pop-cyan px-3 py-1 font-mono text-xs font-semibold text-white shadow-none",
  "inline-flex items-center rounded-full border-0 bg-pop-purple px-3 py-1 font-mono text-xs font-semibold text-white shadow-none",
  "inline-flex items-center rounded-full border-0 bg-pop-lime px-3 py-1 font-mono text-xs font-semibold text-white shadow-none",
  "inline-flex items-center rounded-full border-0 bg-primary px-3 py-1 font-mono text-xs font-semibold text-primary-foreground shadow-none",
  "inline-flex items-center rounded-full border-0 bg-secondary px-3 py-1 font-mono text-xs font-semibold text-secondary-foreground shadow-none",
];

/**
 * TAG chips: outlined rings (light theme).
 */
export const CHIP_LIGHT_TAG_OUTLINE = [
  "inline-flex items-center rounded-full bg-transparent px-3 py-1 font-mono text-xs text-pop-pink ring-2 ring-pop-pink",
  "inline-flex items-center rounded-full bg-transparent px-3 py-1 font-mono text-xs text-pop-cyan ring-2 ring-pop-cyan",
  "inline-flex items-center rounded-full bg-transparent px-3 py-1 font-mono text-xs text-pop-purple ring-2 ring-pop-purple",
  "inline-flex items-center rounded-full bg-transparent px-3 py-1 font-mono text-xs text-pop-lime ring-2 ring-pop-lime",
  "inline-flex items-center rounded-full bg-transparent px-3 py-1 font-mono text-xs text-primary ring-2 ring-primary",
  "inline-flex items-center rounded-full bg-transparent px-3 py-1 font-mono text-xs text-secondary ring-2 ring-secondary",
];

export function stackChipLightClass(label, ti = 0) {
  const idx = popHueIndexFromLabel(label, ti);
  return popBy(idx, CHIP_LIGHT_TECH_STACK) || "";
}

export function tagChipLightClass(label, ti = 0) {
  const idx = popHueIndexFromLabel(label, ti);
  return popBy(idx, CHIP_LIGHT_TAG_OUTLINE) || "";
}

/** @deprecated Prefer stackChipLightClass(label, ti) */
export function techChipLightClassName(ti) {
  return stackChipLightClass("", ti);
}
