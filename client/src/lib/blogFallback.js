/**
 * When the FastAPI backend is unavailable (static preview / misconfigured API URL),
 * the blog index falls back to merged internal + external metadata; posts load from
 * `/blog/posts/<slug>.md` for internal slugs that have bundled markdown.
 *
 * Keep internal metadata aligned with `client/public/blog/posts/*.md` frontmatter for listed slugs.
 * Curated external rows mirror `api/data/external_posts.py` (same slugs/URLs for offline UX).
 *
 * @typedef {{ slug: string; title: string; date?: string; tags?: string[]; excerpt?: string; kind?: string; url?: string; source?: string; author?: string; cover_image?: string; reading_time?: string }} BlogPostMetaLike
 */

export const BLOG_FALLBACK_POSTS_META = [
  {
    kind: "internal",
    slug: "project-nexus-architecture-deep-dive",
    title: "Project Nexus: Architecture and Engineering Deep Dive",
    date: "2026-04-29",
    tags: ["nexus", "c2", "architecture", "purple-team", "mitre"],
    excerpt:
      "A formal technical whitepaper: modular C2, containerized lab topology, AES-GCM beaconing, ELK-sidecar telemetry, Sigma and MITRE-aligned detection, and a phased capability roadmap.",
  },
];

/** Curated externals (mirror of `api/data/external_posts.py` for offline list + redirect). */
export const BLOG_FALLBACK_EXTERNAL = [
  {
    kind: "external",
    slug: "owasp-sql-injection-prevention",
    title: "SQL injection prevention (OWASP Cheat Sheet)",
    excerpt: "Parameterized queries, prepared statements, and defense-in-depth patterns for safe database access.",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
    source: "other",
    author: "OWASP Cheat Sheet Series",
    date: "2024-01-10",
    tags: ["web-security", "sqli", "owasp"],
    cover_image: null,
    reading_time: "15 min read",
  },
  {
    kind: "external",
    slug: "krebsonsecurity-home",
    title: "Krebs on Security — investigative reporting",
    excerpt:
      "Long-form context on criminal infrastructure, breaches, and how attacks become headlines.",
    url: "https://krebsonsecurity.com/",
    source: "other",
    author: "Brian Krebs",
    tags: ["ransomware", "threat-intel", "journalism"],
  },
  {
    kind: "external",
    slug: "google-project-zero-blog",
    title: "Project Zero — vulnerability research",
    excerpt: "Google Project Zero: in-depth writeups on real-world attack surface and defensive lessons.",
    url: "https://googleprojectzero.blogspot.com/",
    source: "github",
    author: "Google Project Zero",
    date: "2023-12-01",
    tags: ["project-zero", "ios", "reverse-engineering"],
  },
  {
    kind: "external",
    slug: "testdriven-fastapi-docker-traefik-postgresql",
    title: "FastAPI, Docker, Traefik, and Postgres (full stack tutorial)",
    excerpt:
      "End-to-end API layout with containers and persistence—useful for shipping services responsibly.",
    url: "https://testdriven.io/blog/fastapi-docker-traefik/",
    source: "medium",
    author: "Michael Herman",
    date: "2021-04-19",
    tags: ["python", "fastapi", "docker"],
    reading_time: "~60 min read",
  },
  {
    kind: "external",
    slug: "daniel-miessler-strategy-vs-tactics",
    title: "Cybersecurity articles and frameworks (Daniel Miessler)",
    excerpt:
      "Index of writing on security programs, mental models, and practice—including how strategy and tactics connect to frameworks like MITRE.",
    url: "https://danielmiessler.com/blog/cybersecurity",
    source: "personal",
    author: "Daniel Miessler",
    date: "2019-06-12",
    tags: ["strategy", "mitre", "blue-team"],
  },
  {
    kind: "external",
    slug: "fastapi-official-first-steps",
    title: "FastAPI first steps (official documentation)",
    excerpt: "Path operations, dependency injection, and OpenAPI defaults when building APIs.",
    url: "https://fastapi.tiangolo.com/tutorial/first-steps/",
    source: "other",
    author: "Sebastián Ramírez",
    date: "2025-08-01",
    tags: ["fastapi", "python", "openapi"],
    reading_time: "15 min read",
  },
];

/**
 * Matches API merge + sort: newest date first; stable tie-breaker by slug ascending (Python stable sort).
 * @param {BlogPostMetaLike[]} internal
 * @param {BlogPostMetaLike[]} external
 */
export function mergeFallbackPostMetas(internal, external) {
  const posts = [...internal, ...external].map((p) => ({
    ...p,
    kind: p.kind ?? "internal",
  }));
  posts.sort((a, b) => a.slug.toLowerCase().localeCompare(b.slug.toLowerCase()));
  posts.sort((a, b) => (b.date || "0000-01-01").localeCompare(a.date || "0000-01-01"));
  return posts;
}

/** @returns {BlogPostMetaLike[]} */
export function getMergedFallbackPostsMeta() {
  return mergeFallbackPostMetas(BLOG_FALLBACK_POSTS_META, BLOG_FALLBACK_EXTERNAL);
}

/**
 * HTTPS URL for a curated external slug (bundled mirror of `external_posts.py`).
 * Used so `/blog/:slug` can redirect without a second network round-trip.
 * @param {string} slug
 * @returns {string | null}
 */
export function getExternalRedirectUrl(slug) {
  if (!slug || typeof slug !== "string") return null;
  const hit = BLOG_FALLBACK_EXTERNAL.find((p) => p.slug === slug);
  const u = hit?.url;
  return typeof u === "string" && /^https?:\/\//i.test(u) ? u : null;
}

/**
 * @param {string} raw
 * @returns {{ title: string; date: string; tags: string[], excerpt: string, content: string } | null}
 */
export function parseMarkdownWithFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const fmBlock = match[1];
  const content = match[2];
  /** @type {Record<string, unknown>} */
  const meta = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    try {
      if (key === "tags") {
        meta.tags = JSON.parse(val);
      } else {
        meta[key] = JSON.parse(val);
      }
    } catch {
      meta[key] = val;
    }
  }
  return {
    title: /** @type {string} */ (meta.title),
    date: /** @type {string} */ (meta.date),
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    excerpt: /** @type {string} */ (meta.excerpt),
    content,
  };
}

/**
 * Load bundled markdown from `/blog/posts/<slug>.md` (see `client/public/blog/posts/`).
 * @param {string} slug
 */
export async function loadFallbackBlogPost(slug) {
  const res = await fetch(`/blog/posts/${slug}.md`);
  if (!res.ok) return null;
  const raw = await res.text();
  const parsed = parseMarkdownWithFrontmatter(raw);
  if (!parsed) return null;
  return {
    slug,
    title: parsed.title,
    date: parsed.date,
    tags: parsed.tags,
    excerpt: parsed.excerpt,
    content: parsed.content,
    kind: "internal",
  };
}
