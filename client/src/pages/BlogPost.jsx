import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { tagChipLightClass } from "@/lib/popColors";
import {
  loadFallbackBlogPost,
  getMergedFallbackPostsMeta,
  getExternalRedirectUrl,
} from "@/lib/blogFallback";
import { BlogCard } from "@/components/blog/BlogCard";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8765" : "");

/**
 * @param {string} currentSlug
 * @param {string[]|undefined} currentTags
 * @param {object[]} allPosts
 */
function pickRelatedPosts(currentSlug, currentTags, allPosts) {
  const lower = (t) => String(t || "").toLowerCase();
  const cur = new Set((currentTags || []).map(lower));
  const internals = allPosts.filter(
    (p) => p.slug !== currentSlug && (p.kind ?? "internal") === "internal",
  );
  const scored = internals.map((p) => {
    let s = 0;
    for (const t of p.tags || []) {
      if (cur.has(lower(t))) s += 1;
    }
    return { p, s };
  });
  scored.sort((a, b) => {
    if (b.s !== a.s) return b.s - a.s;
    return (b.p.date || "").localeCompare(a.p.date || "");
  });
  return scored.slice(0, 3).map((x) => x.p);
}

export function BlogPost() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const redirectRef = { didRedirect: false };

    async function load() {
      setLoading(true);
      setPost(null);
      try {
        const res = await fetch(`${BASE_URL}/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          const body = data?.content;
          const kind = data?.kind ?? "internal";
          if (
            typeof body === "string" &&
            body.length > 0 &&
            kind === "internal"
          ) {
            if (!cancelled) setPost(data);
            return;
          }
        }
      } catch {
        /* offline / CORS / invalid JSON (e.g. SPA HTML with 200) */
      }

      const immediateExternal = getExternalRedirectUrl(slug);
      if (immediateExternal) {
        redirectRef.didRedirect = true;
        window.location.assign(immediateExternal);
        return;
      }

      const fb = await loadFallbackBlogPost(slug);
      if (fb && !cancelled) {
        setPost(fb);
        return;
      }

      let list = [];
      try {
        const lr = await fetch(`${BASE_URL}/api/posts`);
        if (lr.ok) list = await lr.json();
      } catch {
        /* use merged fallback */
      }
      if (!Array.isArray(list) || list.length === 0) {
        list = getMergedFallbackPostsMeta();
      }
      const ext = list.find((p) => p.slug === slug && p.kind === "external");
      if (ext?.url) {
        redirectRef.didRedirect = true;
        window.location.assign(ext.url);
        return;
      }
      if (!cancelled) setPost(null);
    }

    load().finally(() => {
      if (!cancelled && !redirectRef.didRedirect) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug || loading || !post) return;
    if ((post.kind ?? "internal") !== "internal") return;
    let cancelled = false;

    async function relate() {
      let list = [];
      try {
        const r = await fetch(`${BASE_URL}/api/posts`);
        if (r.ok) list = await r.json();
      } catch {
        /* */
      }
      if (!Array.isArray(list) || list.length === 0) list = getMergedFallbackPostsMeta();
      const picked = pickRelatedPosts(slug, post.tags || [], list);
      if (!cancelled) setRelated(picked);
    }

    relate();
    return () => {
      cancelled = true;
    };
  }, [slug, loading, post]);

  if (loading) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center py-24">
        <div className={cn("font-mono text-sm text-primary")}>
          {isDark ? "// loading..." : "loading..."}
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">post not found</div>
        <h1 className="mt-4 text-4xl font-extrabold">Post not found.</h1>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/blog">Back to blog</Link>
        </Button>
      </section>
    );
  }

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
        <Reveal className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className={isDark ? "text-primary" : "text-foreground"}>{post.title}</span>
        </Reveal>

        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-4 flex flex-wrap items-center gap-3">
            {post.date && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest",
                  isDark ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Calendar className="h-2.5 w-2.5" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {(post.tags || []).map((t, ti) => (
              <span
                key={t}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                  isDark ? "bg-muted text-primary" : cn(tagChipLightClass(t, ti), "gap-1 font-medium uppercase"),
                )}
              >
                <Tag className="h-2 w-2" />
                {t}
              </span>
            ))}
          </Reveal>

          <Reveal>
            <h1 className={cn("text-4xl font-extrabold tracking-tight md:text-6xl", isDark && "text-neon")}>
              {post.title}
            </h1>
          </Reveal>

          {post.excerpt && (
            <Reveal>
              <p className="mt-4 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
            </Reveal>
          )}

          <Reveal>
            <div
              className={cn(
                "mt-12 rounded-2xl p-8",
                isDark
                  ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300"
                  : "border border-border bg-card/80 backdrop-blur-sm shadow-soft",
              )}
            >
              <div
                className={cn(
                  "prose max-w-none",
                  isDark
                    ? [
                        "prose-invert",
                        "prose-headings:font-mono prose-headings:text-foreground",
                        "prose-h1:text-neon prose-h2:text-neon",
                        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                        "prose-code:text-accent prose-code:bg-muted/50 prose-code:rounded prose-code:px-1 prose-code:text-sm",
                        "prose-pre:bg-muted/60 prose-pre:border prose-pre:border-border",
                        "prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground",
                        "prose-strong:text-foreground",
                        "prose-hr:border-border",
                        "prose-img:mx-auto prose-img:my-8 prose-img:max-w-full prose-img:rounded-xl prose-img:border prose-img:border-border/70 prose-img:shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.15)]",
                        "prose-table:text-sm prose-th:font-mono prose-td:align-top",
                      ].join(" ")
                    : [
                        "prose-headings:font-display prose-headings:text-foreground",
                        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                        "prose-code:bg-muted/60 prose-code:rounded prose-code:px-1 prose-code:text-sm",
                        "prose-pre:bg-muted/60 prose-pre:border-2 prose-pre:border-foreground",
                        "prose-blockquote:border-primary",
                        "prose-strong:text-foreground",
                        "prose-img:mx-auto prose-img:my-8 prose-img:max-w-full prose-img:rounded-xl prose-img:border-2 prose-img:border-foreground/10 prose-img:shadow-soft",
                        "prose-table:text-sm prose-th:font-mono prose-td:align-top",
                      ].join(" "),
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>
            </div>
          </Reveal>

          {related.length > 0 ? (
            <Reveal className="mt-16">
              <h2 className={cn("mb-6 font-mono text-sm uppercase tracking-[0.2em]", isDark ? "text-primary" : "text-foreground")}>
                Related
              </h2>
              <div className="grid gap-4 items-start md:grid-cols-1">
                {related.map((rp, ri) => (
                  <BlogCard key={rp.slug} post={rp} index={ri} compact isDark={isDark} />
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal className="mt-12">
            <Button variant={isDark ? "default" : "pop"} asChild>
              <Link to="/blog" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> All Posts
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </motion.div>
  );
}
