import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Youtube,
  Github,
  BookOpen,
  Code2,
  ExternalLink,
  Calendar,
  Tag,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CARD_HOVER_SHADOW,
  CARD_SHADOW,
  FAQ_STRIPE,
  LIGHT_SURFACE_CARD,
  popBy,
  tagChipLightClass,
} from "@/lib/popColors";
import { spring } from "@/components/motion/MotionPrimitives";

function isHttpsUrl(src) {
  if (!src || typeof src !== "string") return false;
  try {
    const u = new URL(src.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

const FALLBACK_COVER_GRADIENT = [
  "bg-gradient-to-br from-pop-pink/70 via-pop-cyan/30 to-pop-purple/60",
  "bg-gradient-to-br from-pop-cyan/65 via-pop-lime/25 to-pop-purple/55",
  "bg-gradient-to-br from-pop-purple/70 via-pop-pink/20 to-pop-lime/50",
  "bg-gradient-to-br from-pop-lime/55 via-pop-cyan/35 to-primary/35",
  "bg-gradient-to-br from-primary/40 via-pop-pink/30 to-pop-cyan/45",
];

/** @param {{ source?: string }} */
function SourceBadgePresentation({ source }) {
  const s = String(source || "other").toLowerCase();
  const map = {
    "dev.to": {
      cls: "bg-slate-800 text-white ring-slate-600",
      Icon: Code2,
      label: "dev.to",
    },
    medium: {
      cls: "bg-neutral-900 text-white ring-neutral-700",
      Icon: BookOpen,
      label: "Medium",
    },
    hashnode: {
      cls: "bg-indigo-900/95 text-white ring-indigo-600",
      Icon: ExternalLink,
      label: "Hashnode",
    },
    youtube: {
      cls: "bg-red-600 text-white ring-red-500",
      Icon: Youtube,
      label: "YouTube",
    },
    github: {
      cls: "bg-zinc-800 text-white ring-zinc-600",
      Icon: Github,
      label: "GitHub",
    },
    personal: {
      cls: "bg-violet-700 text-white ring-violet-500",
      Icon: ExternalLink,
      label: "Site",
    },
    other: {
      cls: "bg-muted text-foreground ring-border",
      Icon: ExternalLink,
      label: "Link",
    },
  };
  const cfg = map[s] || map.other;
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 shadow-sm",
        cfg.cls,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {cfg.label}
    </span>
  );
}

const shellClass = (isDark) =>
  cn(
    "group block h-auto overflow-hidden rounded-2xl text-left outline-none ring-offset-4 ring-offset-background transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary",
    isDark
      ? "border border-border bg-card/70 backdrop-blur-sm shadow-presence-rest hover:border-primary/35"
      : cn(LIGHT_SURFACE_CARD, "transition-colors"),
  );

/**
 * Unified blog list card (internal route vs external link).
 * @param {object} props
 * @param {object} props.post
 * @param {number} props.index
 * @param {boolean} [props.featured]
 * @param {boolean} props.isDark
 * @param {boolean} [props.compact]
 * @param {string} [props.className]
 */
export function BlogCard({ post, index, featured = false, isDark, compact = false, className }) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const kind = post.kind ?? "internal";
  const external = kind === "external";
  const coverValid = isHttpsUrl(post.cover_image);
  /** True when we're actually rendering an image hero (omit if URL bad or img onError). */
  const showHeroImage = coverValid && !heroImgFailed;
  /** Title in body vs only in gradient header (avoid duplicate when gradient holds title). */
  const titleInBody = compact || (!compact && showHeroImage);
  const stripe = popBy(index, FAQ_STRIPE);
  const gradFallback = popBy(index, FALLBACK_COVER_GRADIENT);
  const hoverShadowRing = cn(popBy(index, CARD_SHADOW), popBy(index, CARD_HOVER_SHADOW));

  const hrefInternal = `/blog/${post.slug}`;
  const hrefExternal = post.url ?? "#";
  const aria =
    external && typeof hrefExternal === "string" && hrefExternal.startsWith("http")
      ? `Opens external article: ${post.title}`
      : `Read post: ${post.title}`;

  const dateLabel = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const readingLabel =
    post.reading_time != null && String(post.reading_time).trim()
      ? String(post.reading_time)
      : null;

  const tags = (post.tags || []).slice(0, 3);

  /** Bottom-zone darkening for WCAG-safe white title over bright gradients (featured strip only). */
  const featuredHeroContrastOverlay =
    featured && !compact ? (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 40%, hsl(0 0% 0% / 0.35) 75%, hsl(0 0% 0% / 0.55) 100%)",
        }}
      />
    ) : null;

  const BadgesCorner = (
    <div className="absolute right-3 top-3 z-[2] flex flex-wrap justify-end gap-1">
      {external ? (
        <SourceBadgePresentation source={post.source} />
      ) : (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
            isDark ? "bg-primary/25 text-primary" : "bg-primary text-primary-foreground shadow-sm",
          )}
        >
          Written by me
        </span>
      )}
    </div>
  );


  let coverSlot;
  if (compact) {
    coverSlot = (
      <div className="relative h-[5.25rem] w-[7.5rem] shrink-0 overflow-hidden rounded-xl bg-muted/40 md:h-[6rem] md:w-[8.75rem]">
        {showHeroImage ? (
          <img
            src={post.cover_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setHeroImgFailed(true)}
          />
        ) : (
          <div className={cn("relative flex h-full w-full items-center justify-center", gradFallback)}>
            <div className={cn("h-8 w-1 rounded-full opacity-95", stripe)} aria-hidden />
          </div>
        )}
        {BadgesCorner}
      </div>
    );
  } else {
    coverSlot = (
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-muted/30",
          showHeroImage ? "h-32 sm:h-36 md:h-40" : "min-h-[10rem] sm:min-h-[11rem] md:min-h-[12rem]",
        )}
      >
        {showHeroImage ? (
          <>
            <img
              src={post.cover_image}
              alt=""
              loading="lazy"
              className="absolute inset-0 z-0 h-full w-full object-cover"
              onError={() => setHeroImgFailed(true)}
            />
            {featuredHeroContrastOverlay}
          </>
        ) : (
          <>
            <div className={cn("absolute inset-0 z-0", gradFallback, "ring-1 ring-inset ring-foreground/10")} />
            {featuredHeroContrastOverlay}
            <div className="absolute inset-0 z-[2] flex flex-col justify-between px-4 pb-4 pt-11 sm:px-5 sm:pb-5 sm:pt-12">
              <div className={cn("h-10 w-1 shrink-0 rounded-full opacity-95 shadow-sm", stripe)} aria-hidden />
              <h3 className="line-clamp-4 text-balance text-lg font-bold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.55)] md:text-xl lg:text-[1.35rem]">
                {post.title}
              </h3>
            </div>
          </>
        )}
        {BadgesCorner}
      </div>
    );
  }

  const textBlock = (
    <div
      className={cn(
        "flex flex-col",
        compact ? "min-w-0 gap-2 py-2 pr-2 md:py-3" : "gap-3 p-4",
      )}
    >
      {titleInBody && (
        <h3
          className={cn(
            featured ? "md:text-2xl" : "md:text-xl",
            "break-words font-bold leading-snug",
            compact ? "text-base md:text-lg" : "text-lg",
            isDark && "text-neon",
          )}
        >
          {post.title}
        </h3>
      )}

      {post.excerpt ? (
        <p
          className={cn(
            "break-words text-sm leading-relaxed text-muted-foreground",
            featured && "md:text-base",
          )}
        >
          {post.excerpt}
        </p>
      ) : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground",
        )}
      >
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" aria-hidden />
          {dateLabel}
        </span>
        {readingLabel ? (
          <>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="tabular-nums">{readingLabel}</span>
          </>
        ) : null}
        {external && post.author ? (
          <>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden /> {post.author}
            </span>
          </>
        ) : null}
      </div>

      {tags.length > 0 ? (
        <div className={cn("flex flex-wrap gap-1.5", compact ? "pt-2" : "pt-2")}>
          {tags.map((t, ti) => (
            <span
              key={`${post.slug}-${t}-${ti}`}
              className={cn(
                "inline-flex max-w-[11rem] items-center truncate rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest",
                isDark
                  ? "bg-muted text-primary"
                  : cn(tagChipLightClass(t, ti)),
              )}
            >
              <Tag className="mr-1 h-2.5 w-2.5 shrink-0 opacity-70" aria-hidden /> {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const cardInner = cn(
    shellClass(isDark),
    hoverShadowRing,
    compact ? "flex flex-row items-start gap-3 md:gap-5" : "flex flex-col",
    className,
  );

  const inner = (
    <>
      {coverSlot}
      {textBlock}
    </>
  );

  const wrap =
    external ? (
      <a
        href={hrefExternal}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={aria}
        className={cardInner}
      >
        {inner}
      </a>
    ) : (
      <Link to={hrefInternal} aria-label={aria} className={cardInner}>
        {inner}
      </Link>
    );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
      whileHover={{ y: -2 }}
      transition={spring.snap}
      className="w-full self-start"
    >
      {wrap}
    </motion.div>
  );
}
