/*
 * Five-color rotation palette for the light theme.
 *
 * Tailwind's JIT scans these literal strings and compiles the matching
 * utility classes. Keep entries as full string literals — never build
 * them with template strings — or the JIT will not see them.
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
 * Order matches CHIP_* rotation — index with popBy(i, FAQ_STRIPE).
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

/**
 * Light-theme project/stack pills: saturated fill + white label.
 */
export const CHIP_LIGHT_TECH_PILL = [
  "rounded-full border-0 bg-pop-pink text-white font-semibold shadow-none",
  "rounded-full border-0 bg-pop-cyan text-white font-semibold shadow-none",
  "rounded-full border-0 bg-pop-purple text-white font-semibold shadow-none",
  "rounded-full border-0 bg-pop-lime text-white font-semibold shadow-none",
  "rounded-full border-0 bg-primary text-primary-foreground font-semibold shadow-none",
];

export function techChipLightClassName(ti) {
  return popBy(ti, CHIP_LIGHT_TECH_PILL) || "";
}
