/**
 * Toggle headshot zones (homepage About + `/about`). Set `true` when your photo is ready
 * and add JSON-LD `image` back in `client/index.html` (see comment below).
 */
export const SHOW_HEADSHOT = false;

/**
 * Headshot asset for the personal site (`client/public/`).
 *
 * Swap the file **and/or** this constant when your real photo is ready (WebP or PNG ≥ ~400×400 works well).
 * Current value is the placeholder monogram at `public/brant-avatar.svg`.
 *
 * **Used when `SHOW_HEADSHOT` is true:** `import { HEADSHOT_PUBLIC_PATH }`
 * - `components/sections/About.jsx` (homepage)
 * - `pages/AboutPage.jsx` (full about page)
 *
 * **Manual same-path updates (URLs must stay in sync):**
 * - `client/index.html`: JSON-LD `"image"`; add/update when `SHOW_HEADSHOT` is true (absolute URL).
 *
 * **Optional / separate art:** `og-image.png`, `twitter:image`; branded share cards;
 * regenerate those only if you want your face on link previews too.
 */

export const HEADSHOT_PUBLIC_PATH = "/brant-avatar.svg";
