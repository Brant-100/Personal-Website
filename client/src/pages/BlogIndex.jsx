import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, ListFilter, Search } from "lucide-react";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LIGHT_SURFACE_CARD } from "@/lib/popColors";
import {
  getMergedFallbackPostsMeta,
} from "@/lib/blogFallback";
import { BlogCard } from "@/components/blog/BlogCard";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8765" : "");

/** Stable filter id when a tag's name is literally "all" (reserved filter keyword). */
const TAG_ALL_SENTINEL = "topic:name-all";

function tagFilterId(raw) {
  const n = String(raw || "").trim().toLowerCase();
  if (!n) return null;
  return n === "all" ? TAG_ALL_SENTINEL : `topic:${n}`;
}

/** One active filter at a time: all | scope | topic id. */
function applyBlogFilter(posts, key) {
  if (key === "all") return posts;
  if (key === "internal")
    return posts.filter((p) => (p.kind ?? "internal") === "internal");
  if (key === "external") return posts.filter((p) => p.kind === "external");
  if (key.startsWith("topic:"))
    return posts.filter((p) =>
      (p.tags || []).some((t) => tagFilterId(t) === key),
    );
  return posts;
}

/** Narrow posts by title / excerpt (substring, case-insensitive). */
function applyTitleSearch(posts, rawQuery) {
  const q = String(rawQuery || "").trim().toLowerCase();
  if (!q) return posts;
  return posts.filter((p) => {
    const title = String(p.title || "").toLowerCase();
    const excerpt = String(p.excerpt || "").toLowerCase();
    return title.includes(q) || excerpt.includes(q);
  });
}

export function BlogIndex() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKey, setFilterKey] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/posts`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setPosts(arr.length > 0 ? arr : getMergedFallbackPostsMeta());
        setLoading(false);
      })
      .catch(() => {
        setPosts(getMergedFallbackPostsMeta());
        setLoading(false);
      });
  }, []);

  const tagUniverse = useMemo(() => {
    /** @type {Map<string, string>} */
    const map = new Map();
    for (const p of posts) {
      for (const t of p.tags || []) {
        const id = tagFilterId(t);
        if (!id) continue;
        if (!map.has(id)) map.set(id, t.trim());
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [posts]);

  const filtered = useMemo(() => {
    const byFilter = applyBlogFilter(posts, filterKey);
    return applyTitleSearch(byFilter, searchQuery);
  }, [posts, filterKey, searchQuery]);

  const { featured, gridPosts, featuredIndex } = useMemo(() => {
    const internals = filtered.filter((p) => (p.kind ?? "internal") === "internal");
    const sortedInt = [...internals].sort((a, b) =>
      (b.date || "").localeCompare(a.date || ""),
    );
    const fp = sortedInt[0];
    if (!fp) {
      return { featured: null, gridPosts: filtered, featuredIndex: 0 };
    }
    const rest = filtered.filter((p) => p.slug !== fp.slug);
    const fi = filtered.findIndex((p) => p.slug === fp.slug);
    return { featured: fp, gridPosts: rest, featuredIndex: fi >= 0 ? fi : 0 };
  }, [filtered]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.07, 0.05)}
      className="relative pt-32 pb-24 md:pt-40 md:pb-32"
    >
      {isDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)/0.04) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)/0.04) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      <div className="container relative z-10">
        <Reveal className="mb-4">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {isDark ? "// WRITING" : "WRITING ·"}
          </span>
        </Reveal>
        <Reveal className="mb-10">
          <h1 className={cn("text-5xl font-extrabold tracking-tight md:text-7xl", isDark && "text-neon")}>
            Blog
          </h1>
        </Reveal>

        {loading ? (
          <Reveal>
            <div className="font-mono text-sm text-primary">
              {isDark ? "// loading posts..." : "loading..."}
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-x-12">
            <div className="min-w-0">
              {filtered.length === 0 ? (
                <EmptyBlogState isDark={isDark} hasSearch={Boolean(searchQuery.trim())} />
              ) : (
                <motion.div
                  variants={staggerContainer(0.06)}
                  initial="hidden"
                  animate="show"
                  className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 xl:gap-8"
                >
                  {featured ? (
                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                      <BlogCard post={featured} index={featuredIndex} featured isDark={isDark} />
                    </div>
                  ) : null}
                  {gridPosts.map((post, i) => (
                    <BlogCard key={post.slug} post={post} index={(featured ? 3 : 0) + i} isDark={isDark} />
                  ))}
                </motion.div>
              )}
            </div>

            <aside
              className={cn(
                "relative z-50 isolate w-full lg:sticky lg:top-24 lg:self-start",
                isDark
                  ? "rounded-2xl border border-border bg-card/60 p-5 shadow-presence-rest"
                  : cn(LIGHT_SURFACE_CARD, "p-5"),
              )}
              aria-labelledby="blog-post-filter-heading"
            >
              <h2
                id="blog-post-filter-heading"
                className="mb-4 flex items-center gap-2 text-base font-bold tracking-tight text-foreground"
              >
                <ListFilter className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                Filter posts
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="blog-post-search"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Search by name
                </label>
                <div className="relative">
                  <Search
                    className={cn(
                      "pointer-events-none absolute left-3 top-1/2 z-[2] h-4 w-4 -translate-y-1/2 opacity-45",
                      isDark ? "text-muted-foreground" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  <input
                    id="blog-post-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Title or keywords…"
                    autoComplete="off"
                    spellCheck={false}
                    className={cn(
                      "relative z-[1] block w-full rounded-xl border px-3 py-2.5 pl-9 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary",
                      isDark
                        ? "border-border bg-background/90 text-foreground"
                        : "border-border bg-card text-foreground",
                    )}
                    aria-describedby="blog-post-search-hint"
                  />
                </div>
                <span id="blog-post-search-hint" className="sr-only">
                  Matches post titles and descriptions within the current filter.
                </span>
              </div>
              <label htmlFor="blog-post-filter" className="sr-only">
                Choose how to browse posts
              </label>
              <select
                id="blog-post-filter"
                value={filterKey}
                onChange={(e) => setFilterKey(e.target.value)}
                className={cn(
                  "relative z-[1] block w-full cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-medium shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                  isDark
                    ? "border-border bg-background/90 text-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                <optgroup label="Browse">
                  <option value="all">All posts</option>
                  <option value="internal">On this site</option>
                  <option value="external">External links</option>
                </optgroup>
                {tagUniverse.length > 0 ? (
                  <optgroup label="By topic">
                    {tagUniverse.map(([tid, label]) => (
                      <option key={tid} value={tid}>
                        {label}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </aside>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyBlogState({ isDark, hasSearch }) {
  const topics = ["Nexus Phase 2 writeup", "Detection engineering notes", "CTF walkthrough series", "Blue-team lab builds"];
  return (
    <Reveal>
      <div className="max-w-2xl space-y-10">
        <p className="leading-relaxed text-muted-foreground">
          {hasSearch ? (
            <>
              Nothing matches that search within the current filter. Try different keywords, clear the search box, or
              change the filter above.
            </>
          ) : (
            <>
              Nothing matches this filter. Try a different filter option, or check back soon. Long-form pieces on Project
              Nexus, defensive thinking, and hands-on security work are always in the queue.
            </>
          )}
        </p>
        <div
          className={cn(
            "rounded-2xl p-6",
            isDark ? "border border-border bg-card/70 shadow-presence-rest" : LIGHT_SURFACE_CARD,
          )}
        >
          <p className="text-center text-muted-foreground sm:text-left">
            Topics planned next—watch the repo for drafts turning into posts.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {topics.map((t) => (
              <div
                key={t}
                className={cn(
                  "rounded-xl border border-dashed px-4 py-3 text-center font-mono text-xs uppercase tracking-wide text-muted-foreground",
                  isDark ? "border-border/80 bg-muted/30" : "border-border bg-card/50",
                )}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center sm:justify-start">
            <a
              href="https://github.com/Brant-100"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <Github className="h-4 w-4" />
              Follow on GitHub for updates
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
