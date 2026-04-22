# After Action Report — brantsimpson.com Portfolio Sweep v0.2.0

**Date:** April 22, 2026  
**Branch:** `develop`  
**Commits:** 15 atomic commits  
**Build status:** ✅ `npm run build` succeeds  
**Test status:** ✅ 12/12 API tests pass (`pytest api/tests -q`)

---

## What was done

### Commit 1 — `fix: readme typo + strip trailing #credly URL fragment`
**Files:** `README.md`, `Contact.jsx`, `Footer.jsx`  
**What:** Fixed "profeshional" typo in README L3. Removed `#credly` fragment from Credly hrefs in Contact and Footer — it's a no-op URL fragment that reads as a sloppy detail on a security portfolio.

---

### Commit 2 — `feat(projects): extend schema + populate Nexus and Network Scanner detail`
**Files:** `api/main.py`, `api/data/projects.py`  
**What:** Extended the `Project` Pydantic model with 12 new fields: `sort_order`, `last_updated`, `problem`, `constraints`, `architecture_diagram_url`, `screenshots`, `demo_video_url`, `mitre_techniques`, `visibility_note`, `technical_decisions` (list of `{decision, why, tradeoffs}`), `lessons_learned`, `roadmap`. Added `GET /api/projects/{id}` endpoint. Populated all four projects with rich data. Project Nexus has 18 MITRE ATT&CK technique IDs, full technical decisions with tradeoffs, and a visibility note explaining why source is private.  
**Why:** The site needs to tell a coherent technical story per project — a card with a one-liner isn't enough for a security audience evaluating whether you understand what you built.

---

### Commit 3 — `feat(projects): filter pills, MITRE badges, visibility note, last-updated, sort by sort_order`
**Files:** `Projects.jsx`  
**What:** Filter pill row (All / Security / Web / Full-Stack) using `AnimatePresence` for smooth transitions. Sort by `sort_order` before render. MITRE ATT&CK badges on cards linked to attack.mitre.org. Visibility note block for private projects. Last-updated timestamp. "View details" CTA linking to `/projects/:id`.  
**Tools:** Framer Motion `AnimatePresence`, `motion.div` with `mode="popLayout"`.

---

### Commit 4 — `feat(projects): detail pages at /projects/:id, BackToTop, Blog+Now stubs, placeholder assets`
**Files:** `ProjectDetail.jsx`, `projectFallback.js`, `BackToTop.jsx`, `BlogIndex.jsx`, `BlogPost.jsx`, `Now.jsx`, `App.jsx`, `/public/projects/*/`  
**What:** Full `ProjectDetail` page with: Breadcrumb, status/year/last-updated header, project title + tagline + description, visibility note, tech stack sidebar, Problem, Constraints, Features grid, Architecture SVG, Screenshots, MITRE ATT&CK technique grid, Technical Decisions (with why + tradeoffs), Lessons Learned, Roadmap. Theme-correct in both palettes. Placeholder SVG assets for all four projects (architecture diagrams and terminal/UI screenshots). `BackToTop` button. Stub `BlogIndex`, `BlogPost`, `Now` pages wired into `App.jsx` routing.  
**Why:** A project card alone is not enough for a 1B4X1 panel or a serious technical recruiter. The detail page lets Nexus carry its full story.

---

### Commit 5 — `feat(about): About section with narrative, ethics, Six Sigma, skills, open-to, avatar placeholder`
**Files:** `About.jsx`, `HomePage.jsx`, `Navbar.jsx`, `Footer.jsx`, `brant-avatar.svg`  
**What:** Three-paragraph narrative: who/what/why. Six Sigma Black Belt → DMAIC engineering callout. Skills self-assessment grid with Framer Motion animated progress bars. "Open to" chip row. Ohio · EST location. Ethics statement. Monogram avatar placeholder (replace with headshot). Added `#about` to Navbar and Footer.  
**Why:** The site previously had no "who is this person" section. Three unconnected signals (offensive security operator, available for hire, web dev services) read as unfocused without a bridge. About ties them together.

---

### Commit 6 — `feat(hero): now-building chip, resume CTA, useReducedMotion on stagger and scanline`
**Files:** `Hero.jsx`, `Brant_Simpson_Resume.pdf`  
**What:** "now building:" chip with Zap icon: `Project Nexus Phase 2 · EDPT pending`. "Download Resume" button (third CTA). Applied `useReducedMotion()` from framer-motion to: initial y-offsets on columns, terminal card scale, terminal line stagger delays, and scanline animation visibility.  
**Why:** Accessibility. `prefers-reduced-motion` is a browser/OS signal that some users depend on. A portfolio that ignores it is a bad look on a site claiming attention to detail. Resume download is a direct hiring signal.

---

### Commit 7 — `feat(contact): form + honeypot + /api/contact endpoint; blog post seed files; update requirements`
**Files:** `Contact.jsx`, `contact.js`, `api/main.py`, `api/requirements.txt`, `api/content/posts/*.md`  
**What:** Contact form with name, email, message, honeypot hidden field. `POST /api/contact` in FastAPI: validates with Pydantic `EmailStr`, discards honeypot-filled submissions, forwards via Resend API if `RESEND_API_KEY` env var is present, otherwise logs and returns success. `client/src/lib/contact.js` — single `CONTACT_EMAIL` constant. "I usually reply within 48 hours." trust line. Resume download in form footer. Six blog post stub files seeded.  
**Tools:** `httpx` for async Resend API calls (optional). `pydantic[email]` for email validation.

---

### Commit 8 — `feat(footer): build-date stamp via Vite define + built-with note`
**Files:** `vite.config.js`, `Footer.jsx`  
**What:** Added `define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString()) }` to Vite config. Footer note becomes `built with React + FastAPI · deployed on Vercel · <date>` in dark mode, `built with React + FastAPI · deployed on Vercel` in light mode.  
**Why:** Lets you see at a glance whether the deployed version is stale.

---

### Commit 9 — `feat(experience): outcome-oriented BPA and hackathon entries; fix section numbering`
**Files:** `api/data/experience.py`, `Experience.jsx`, `Credentials.jsx`  
**What:** BPA entry rewritten to focus on component shipped, sprint ownership, and placement result (placeholder). Kent Hack Enough rewritten with role, project, outcome placeholders. Section numbers updated: Credentials 03→04, Experience 04→05, Contact stays 06.

---

### Commit 10 — `feat(seo): OG/Twitter meta, JSON-LD Person schema, robots.txt, sitemap.xml, favicon fallbacks`
**Files:** `client/index.html`, `og-image.svg`, `robots.txt`, `sitemap.xml`, `apple-touch-icon.svg`  
**What:** Full Open Graph suite. Twitter/X `summary_large_image` card. `theme-color` meta. Canonical URL. JSON-LD `Person` schema with all social links. Placeholder OG image (SVG; see note below). `robots.txt`, `sitemap.xml` (12 URLs). `apple-touch-icon.svg` placeholder.  
**Why:** Without OG tags the site shares as a blank card on every platform.

---

### Commit 11 — `feat(security): CSP, HSTS, X-Frame, Referrer-Policy, Permissions-Policy headers; SECURITY.md`
**Files:** `vercel.json`, `SECURITY.md`  
**What:** Full security header suite in `vercel.json`. CSP allows: self, Google Fonts, Vercel analytics/speed insights, and the portfolio API origin. HSTS with 2-year max-age, `includeSubDomains`, and `preload`. `SECURITY.md` responsible disclosure policy.  
**Why:** A security portfolio site that fails a basic headers scan is a credibility problem.

---

### Commit 12 — `feat(blog): react-markdown rendering, Blog+Now in Navbar/Footer`
**Files:** `BlogPost.jsx`, `Navbar.jsx`, `Footer.jsx`, `package.json`  
**What:** Upgraded `BlogPost.jsx` from raw `<pre>` rendering to `ReactMarkdown` with `remarkGfm` (tables, strikethrough, task lists). Full Tailwind prose styling in both themes. Blog and /now links added to Navbar (desktop) and Footer.  
**Tools:** `react-markdown` v9, `remark-gfm`.

---

### Commit 13 — `feat(ux): command palette (Ctrl+K), g-p/g-c/g-b/t shortcuts, print stylesheet, humans.txt`
**Files:** `CommandPalette.jsx`, `useKeyboardShortcuts.js`, `App.jsx`, `index.css`, `humans.txt`, `package.json`  
**What:** `CommandPalette` built on `cmdk` — opens with ⌘K / Ctrl+K. All commands documented in the palette itself (the only UI a developer needs to discover shortcuts). `useKeyboardShortcuts` — `g p`, `g c`, `g b`, `t` with 800ms timeout for the `g` prefix sequence. `BackToTop` mounted in App. Print stylesheet hides nav/animations, renders clean content. `humans.txt`.  
**Tools:** `cmdk` v1, Framer Motion `AnimatePresence` for palette entrance.

---

### Commit 14 — `chore: eslint + prettier configs, ruff + pyproject.toml, API tests, GitHub Actions CI, README badge`
**Files:** `.eslintrc.cjs`, `.prettierrc`, `pyproject.toml`, `tests/test_main.py`, `.github/workflows/ci.yml`, `README.md`  
**What:** ESLint config (react + react-hooks + react-refresh). Prettier config (100 col, no semi change, es5 trailing commas). Ruff pyproject.toml (line-length 100, py311, E/F/W/I/UP). 12 async integration tests covering every API endpoint. GitHub Actions CI with parallel `client-build` and `api-test` jobs. CI badge on README.  
**Tools:** `pytest-asyncio` + `httpx.ASGITransport` for in-process API testing (no server needed).

---

### Commit 15 — `docs: CHANGELOG.md, Network Scanner README extraction guide, AFTER_ACTION_REPORT.md`
**Files:** `CHANGELOG.md`, `projects/network-scanner/README.md`, `AFTER_ACTION_REPORT.md`  
**What:** Full CHANGELOG seeded with v0.2.0. Network Scanner README updated with CI badge placeholder and `git subtree` extraction instructions. This report.

---

## Theme parity confirmation

Every new component — About, ProjectDetail, BlogIndex, BlogPost, Now, CommandPalette, BackToTop — branches on `useTheme()` / `isDark` and renders correctly in both:

- **Cyber-dark**: `bg-card/70 backdrop-blur`, neon cyan accents, `text-neon`, mono font headings, `hover:shadow-neon-cyan`, scanline suppressed with `prefersReduced`.
- **Pop-light**: `border-2 border-foreground`, `shadow-pop`, chunky pill cards, warm off-white backgrounds, Space Grotesk headings, highlight underline spans on h2s.

---

## What YOU need to do

These items are out of repo scope — they require actions on your part.

### Priority 1 — Launch blockers

1. **Buy `brantsimpson.com`** (if not already done)  
   Recommended: Cloudflare Registrar (no markup on registration, automatic DNSSEC).  
   DNS: point to Vercel once registered.

2. **Deploy to Vercel from the `main` branch** (merge `develop` → `main` first)  
   - Connect the `Brant-100/Personal-Website` repo in Vercel dashboard.
   - Output directory: `client/dist` (already in `vercel.json`).
   - Environment variable to set: `VITE_API_BASE_URL=https://api.brantsimpson.com` (or Railway URL).

3. **Deploy the FastAPI API** (Railway, Render, or Fly.io)  
   - `cd api && uvicorn main:app --host 0.0.0.0 --port 8000`
   - Set `CORS_EXTRA_ORIGINS` to your Vercel domain if it's not `brantsimpson.com`.
   - Optional: set `RESEND_API_KEY` for real contact form email forwarding.

### Priority 2 — Replace placeholder assets

| File | What to replace it with |
|------|------------------------|
| `client/public/brant-avatar.svg` | Professional headshot (400×400 minimum, PNG or WebP). Rename to `brant-avatar.png` and update the `<img src>` in `About.jsx`. |
| `client/public/og-image.svg` | A real 1200×630 PNG. Design it to match the SVG placeholder layout (dark gradient, your name, role, site URL). Tools: Figma, Canva, or Excalidraw export. Rename to `og-image.png` and update `client/index.html`. |
| `client/public/Brant_Simpson_Resume.pdf` | Your actual resume PDF. Keep the filename. |
| `client/public/projects/project-nexus/architecture.svg` | Excalidraw or draw.io architecture diagram exported as SVG/PNG. |
| `client/public/projects/project-nexus/screenshot-1.svg` | Real operator console screenshot (redact any real IPs or sensitive data). |
| `client/public/projects/network-scanner/architecture.svg` | Architecture diagram. |
| `client/public/projects/network-scanner/screenshot-1.svg` | Real terminal output capture. |
| `client/public/projects/skillswap/` | Real SkillSwap screenshots. |
| `client/public/projects/healthhive/` | Real HealthHive screenshots. |

### Priority 3 — Content updates

4. **Cloudflare Email Routing for `brant@brantsimpson.com`**  
   Once set up, change one line in `client/src/lib/contact.js`:
   ```js
   export const CONTACT_EMAIL = "brant@brantsimpson.com";
   ```

5. **Credly badge URLs**  
   In `api/data/credentials.py`, update each credential's `url` field to its individual Credly badge page URL (not the profile page). The profile URL is there now as a placeholder.

6. **BPA and Kent Hack Enough real outcomes**  
   In `api/data/experience.py`, replace all `[PLACEHOLDER: ...]` text with real numbers/outcomes. The structure is already correct.

7. **Blog posts — fill in the prose**  
   In `api/content/posts/`, all six stub files have frontmatter + section headings. Fill in the paragraphs. The most important post to publish first:  
   `why-i-built-c2-from-scratch.md` — this is the clearest statement of your technical philosophy.

### Priority 4 — OPSEC audit before go-live

8. **Review Project Nexus visibility**  
   The detail page shows the 18 MITRE technique IDs, the architecture diagram placeholder, and the technical decisions. Review each item and confirm nothing reveals operational details you don't want public. The `visibility_note` is already set to explain source is private.

9. **Confirm the API is not leaking internal data**  
   Run `GET /api/projects/project-nexus` against the deployed API and review the JSON response carefully. None of the current data contains sensitive information, but confirm before going live.

10. **Harden CSP after deployment**  
    Once deployed, test the CSP header at [observatory.mozilla.org](https://observatory.mozilla.org) and [securityheaders.com](https://securityheaders.com). If you add analytics (Step 12 below), update the `connect-src` directive in `vercel.json`.

### Priority 5 — Growth

11. **Extract Network Scanner to standalone repo**  
    See `projects/network-scanner/README.md` for `git subtree` instructions.  
    Repo name: `Brant-100/network-scanner`. Pin it on your GitHub profile.

12. **Analytics** (optional — defer until after launch)  
    Recommended: [Plausible](https://plausible.io) or [Umami](https://umami.is) (both privacy-respecting, no GDPR cookies).  
    Add the script tag to `client/index.html` and update the CSP `connect-src` directive.

13. **Update GitHub profile README and LinkedIn banner**  
    Add the portfolio URL and the "now building" chip to your GitHub profile README.

---

## Technical notes

### `__BUILD_DATE__` global

The Footer displays the build date. This is injected by Vite at build time via `vite.config.js`:
```js
define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString()) }
```
In local dev it shows "local dev". After every Vercel build it will show the actual deploy date.

### Contact form email forwarding

The `/api/contact` endpoint checks for `RESEND_API_KEY` at runtime. Without it, submissions are logged server-side but not emailed. Set the env var on your API host to enable forwarding:
```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=brant@brantsimpson.com  # optional, defaults to gmail
```

### Running tests locally

```bash
# API tests
cd api
pip install -r requirements.txt
pytest tests/ -q

# Frontend build + lint
cd client
npm ci
npm run build
npm run lint
```

### Adding a new blog post

1. Create `api/content/posts/<slug>.md` with frontmatter:
   ```markdown
   ---
   title: "Post Title"
   date: "2026-05-01"
   tags: ["tag1", "tag2"]
   excerpt: "One sentence summary."
   ---
   
   # Post Title
   
   Your content here.
   ```
2. Add the URL to `client/public/sitemap.xml`.
3. Commit and redeploy.

---

*This report was generated by the AI assistant after completing the full portfolio sweep. All decisions documented above can be revisited — nothing is irreversible.*
