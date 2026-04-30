# Changelog

All notable changes to brantsimpson.com are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [0.2.0] (2026-04-22) · Portfolio Sweep

Fifteen atomic commits on `develop` covering a comprehensive overhaul of the site.

### Added

**Project data & detail**
- Extended `Project` Pydantic model: `sort_order`, `last_updated`, `problem`, `constraints`, `architecture_diagram_url`, `screenshots`, `demo_video_url`, `mitre_techniques`, `visibility_note`, `technical_decisions`, `lessons_learned`, `roadmap`.
- `GET /api/projects/{id}` endpoint for individual project detail pages.
- `ProjectDetail.jsx` page at `/projects/:id` with Overview, Problem, Constraints, Features, Architecture (SVG placeholder), Screenshots, MITRE ATT&CK grid, Technical Decisions, Lessons Learned, Roadmap, Breadcrumb.
- Placeholder SVG architecture diagrams and terminal screenshots for all four projects.
- Shared `client/src/lib/projectFallback.js` for offline-capable fallback.

**Projects UI**
- Filter pills: All / Security / Web / Full-Stack driven by `project.tags`.
- Sort by `sort_order` (Nexus first, HealthHive last).
- MITRE ATT&CK technique badges on cards (linked to attack.mitre.org).
- `visibility_note` display for private projects.
- `last_updated` stamp on cards.
- "View details" CTA linking to `/projects/:id`.

**About section** (`client/src/components/sections/About.jsx`)
- Three-paragraph narrative: who/what I build, current focus (Nexus, security track), quiet 1B4X1 context.
- Six Sigma Black Belt → DMAIC bridge callout block.
- Skills self-assessment grid with animated progress bars (Python, React, FastAPI, Docker, SQL, TypeScript, Tailwind, Cybersecurity).
- "Open to" chip row: contract dev, mentorship, operator conversations.
- Ohio · EST location note.
- Ethics statement: "All security testing and tooling demos are against systems I own or am explicitly authorized to test."
- Placeholder monogram avatar at `client/public/brant-avatar.svg`.
- Added `#about` to Navbar and Footer navigation.

**Hero**
- "now building:" chip: `Project Nexus Phase 2 · EDPT pending`.
- `Download Resume` button (third CTA) → `/Brant_Simpson_Resume.pdf`.
- `useReducedMotion()` applied to stagger delays, scanline animation, and scale transitions.
- Placeholder resume PDF at `client/public/Brant_Simpson_Resume.pdf`.

**Contact form**
- New form above the four cards: name, email, message, honeypot hidden field.
- Theme-correct input styling (dark: `focus:ring-primary`; light: `border-2 border-foreground shadow-pop`).
- `POST /api/contact` FastAPI endpoint: validates, discards honeypot submissions, forwards via Resend if `RESEND_API_KEY` env var is present, otherwise logs and returns success.
- `client/src/lib/contact.js`: single `CONTACT_EMAIL` constant for easy domain-email swap.
- "I usually reply within 48 hours." trust line.
- Resume download CTA in contact form.

**Footer**
- `__BUILD_DATE__` injected via `vite.config.js` `define`.
- Footer note: `built with React + FastAPI · deployed on Vercel · <build date>`.
- Added Blog and /now links.

**Experience**
- BPA entry rewritten with outcome-oriented placeholder: component shipped, sprint lead, placement result placeholder.
- Kent Hack Enough entry rewritten with role, project, and outcome placeholders.
- Section numbering updated to accommodate About (new 00).

**SEO / metadata** (`client/index.html`)
- `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type`, `og:locale`, `og:site_name`.
- `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.
- `theme-color` meta tag.
- `<link rel="canonical">`.
- JSON-LD `Person` schema with `sameAs` social links.
- Placeholder OG image at `client/public/og-image.svg`.
- `client/public/robots.txt`, `client/public/sitemap.xml` (12 URLs).
- `client/public/apple-touch-icon.svg` placeholder.

**Security headers** (`vercel.json`)
- `Content-Security-Policy` (self + Google Fonts + Vercel scripts/insights + API origin).
- `X-Frame-Options: DENY`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` (camera, mic, geolocation, payment, USB, FLoC all off).
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- `X-Content-Type-Options: nosniff`.
- `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
- `SECURITY.md` responsible disclosure policy.

**Blog infrastructure**
- `api/content/posts/`: Markdown posts with YAML frontmatter.
- `GET /api/posts` (list, sorted desc by date), `GET /api/posts/{slug}` (full content).
- `python-frontmatter` added to `api/requirements.txt`.
- `BlogIndex.jsx` at `/blog`, `BlogPost.jsx` at `/blog/:slug`.
- `react-markdown` + `remark-gfm` for Markdown rendering with full prose styling in both themes.
- Six post stubs seeded: Nexus Phase 1 Retrospective, Why I Built a C2 From Scratch, Security+ Notes, CTF Walkthrough, Six Sigma Black Belt at 17, Network Scanner Design Notes.
- Blog and /now links added to Navbar and Footer.

**UX delight**
- `CommandPalette.jsx` (`cmdk`): opens with ⌘K / Ctrl+K. Commands: jump to all sections, toggle theme, copy email, open GitHub/LinkedIn/Credly, download resume, view keyboard shortcuts cheat-sheet.
- `useKeyboardShortcuts.js`: `g p` (projects), `g c` (contact), `g b` (blog), `t` (toggle theme).
- `BackToTop.jsx`: appears after 600px scroll, both theme variants.
- `/now` page (monthly status: building, studying, available for, writing).
- `client/public/humans.txt`.
- Print stylesheet in `client/src/index.css`: hides nav, animations, and renders clean text.

**Code quality + CI**
- `client/.eslintrc.cjs` (eslint + react + react-hooks + react-refresh).
- `client/.prettierrc`.
- `api/pyproject.toml` (ruff: line-length=100, py311 target, E/F/W/I/UP rules).
- `api/tests/test_main.py`: 12 async integration tests: health, projects list, project detail, 404s, services, credentials, experience, posts list, post detail, contact success, contact honeypot.
- `.github/workflows/ci.yml`: parallel jobs: `client-build` (Node 20, npm ci + build + lint) and `api-test` (Python 3.11, pip install + ruff + pytest).
- CI badge on README.

### Changed

- `README.md` L3: `profeshional` → `professional`.
- Credly URLs in `Contact.jsx` and `Footer.jsx`: removed `#credly` fragment.
- `client/src/pages/HomePage.jsx`: inserted `<About />` between `<Hero />` and `<Services />`.
- `api/data/projects.py`: all four projects fully populated with extended schema fields.
- `api/main.py`: extended Pydantic models, `GET /api/projects/{id}`, `POST /api/contact`, `GET /api/posts`, `GET /api/posts/{slug}`.
- `Credentials.jsx` section counter: `03` → `04`.
- `Experience.jsx` section counter: `04` → `05`.

### Fixed

- README typo (see above).
- `#credly` URL fragment on all Credly hrefs.

---

## [0.1.0] (2025) · Initial Portfolio

Initial launch: Hero, Services, Projects (4), Credentials, Experience, Contact, dual theme.
