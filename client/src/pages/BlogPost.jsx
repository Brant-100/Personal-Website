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
import { CHIP_BG, CHIP_RING, popBy } from "@/lib/popColors";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8765" : "");

export function BlogPost() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/posts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center py-24">
        <div className={cn("font-mono text-sm", isDark ? "text-primary" : "text-primary")}>
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
        {/* Breadcrumb */}
        <Reveal className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className={isDark ? "text-primary" : "text-foreground"}>{post.title}</span>
        </Reveal>

        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-4 flex flex-wrap items-center gap-3">
            {post.date && (
              <span className={cn(
                "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest",
                isDark ? "text-primary" : "text-muted-foreground"
              )}>
                <Calendar className="h-2.5 w-2.5" />
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
            {(post.tags || []).map((t, ti) => (
              <span key={t} className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                isDark ? "bg-muted text-primary" : cn("font-medium text-foreground ring-2 shadow-sm", popBy(ti, CHIP_BG), popBy(ti, CHIP_RING))
              )}>
                <Tag className="h-2 w-2" />{t}
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
              <p className="mt-4 text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </Reveal>
          )}

          <Reveal>
            <div className={cn(
              "mt-12 rounded-2xl p-8",
              isDark
                ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300"
                : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
            )}>
              <div className={cn(
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
                    ].join(" ")
                  : [
                      "prose-headings:font-display prose-headings:text-foreground",
                      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                      "prose-code:bg-muted/60 prose-code:rounded prose-code:px-1 prose-code:text-sm",
                      "prose-pre:bg-muted/60 prose-pre:border-2 prose-pre:border-foreground",
                      "prose-blockquote:border-primary",
                      "prose-strong:text-foreground",
                    ].join(" ")
              )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </Reveal>

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
