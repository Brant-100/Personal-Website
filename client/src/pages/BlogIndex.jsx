import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Reveal, spring, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export function BlogIndex() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/posts`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.07, 0.05)}
      className="relative pt-32 pb-24 md:pt-40 md:pb-32"
    >
      {/* Backdrop */}
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
            {isDark ? "// writing" : "writing —"}
          </span>
        </Reveal>
        <Reveal className="mb-4">
          <h1 className={cn("text-5xl font-extrabold tracking-tight md:text-7xl", isDark && "text-neon")}>
            Blog
          </h1>
        </Reveal>
        <Reveal className="mb-16 max-w-2xl text-muted-foreground text-lg">
          Technical write-ups, security research notes, and retrospectives. One well-written post says more than ten credential badges.
        </Reveal>

        {loading ? (
          <Reveal>
            <div className={cn("font-mono text-sm", isDark ? "text-primary" : "text-primary")}>
              {isDark ? "// loading posts..." : "loading..."}
            </div>
          </Reveal>
        ) : posts.length === 0 ? (
          <Reveal>
            <div className={cn(
              "rounded-2xl p-8 text-center",
              isDark ? "border border-border bg-card/70" : "border-2 border-foreground bg-card shadow-pop"
            )}>
              <p className="text-muted-foreground">
                Posts are being written. Check back soon — the Nexus Phase 1 retrospective is up first.
              </p>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} isDark={isDark} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function PostCard({ post, isDark }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      whileHover={{ y: -3 }}
      transition={spring.snap}
    >
      <Link
        to={`/blog/${post.slug}`}
        className={cn(
          "group flex flex-col gap-4 rounded-2xl p-6 transition-all sm:flex-row sm:items-start sm:justify-between",
          isDark
            ? "border border-border bg-card/70 backdrop-blur hover:border-primary/50 hover:shadow-neon-cyan"
            : "border-2 border-foreground bg-card shadow-pop hover:shadow-pop-primary"
        )}
      >
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            {post.date && (
              <span className={cn(
                "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest",
                isDark ? "text-primary" : "text-muted-foreground"
              )}>
                <Calendar className="h-2.5 w-2.5" />
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            )}
            {(post.tags || []).map((t) => (
              <span key={t} className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                isDark ? "bg-muted text-primary" : "bg-accent/40 text-foreground"
              )}>
                <Tag className="h-2 w-2" />
                {t}
              </span>
            ))}
          </div>
          <h2 className={cn("text-xl font-bold leading-snug", isDark && "text-neon")}>{post.title}</h2>
          {post.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
          )}
        </div>
        <ArrowRight className={cn(
          "mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1",
          isDark ? "text-primary" : "text-foreground/50"
        )} />
      </Link>
    </motion.div>
  );
}
