import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

/**
 * @param {unknown} data
 * @returns {string | null}
 */
function assertionBadgeImageUrl(data) {
  if (!data || typeof data !== "object") return null;
  const badge = /** @type {Record<string, unknown>} */ (data).badge;
  if (!badge || typeof badge !== "object") return null;
  const b = /** @type {Record<string, unknown>} */ (badge);
  if (typeof b.image_url === "string") return b.image_url;
  const img = b.image;
  if (typeof img === "string") return img;
  if (img && typeof img === "object" && /** @type {Record<string, unknown>} */ (img).id != null) {
    return String(/** @type {Record<string, unknown>} */ (img).id);
  }
  return null;
}

/**
 * @param {{ imageSrc: string; width: number; fetchPriority?: 'high' | 'low' | 'auto' }} props
 */
function BadgeImageBlock({ imageSrc, width, fetchPriority = "auto" }) {
  return (
    <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-2 overflow-x-auto">
      <div className="leading-none">
        <img
          src={imageSrc}
          alt=""
          className="mx-auto block h-auto max-w-full bg-transparent object-contain"
          style={{ maxWidth: width }}
          loading={fetchPriority === "high" ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={fetchPriority}
        />
      </div>
      <p className="m-0 max-w-[12rem] text-center font-sans text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-foreground/70 dark:text-foreground/90">
        Verified on Credly
      </p>
    </div>
  );
}

/**
 * Credly official iframe embed shows a white page shell. Prefer CDN artwork (transparent PNG).
 * When `imageUrl` is set (from API/fallback data), the badge paints immediately with no extra hop.
 * Otherwise fetch Open Badges via your API, then fall back to iframe.
 *
 * https://www.credly.com
 *
 * @param {{ badgeId: string; imageUrl?: string | null; width?: number; height?: number; host?: string }} props
 */
export function CredlyBadgeEmbed({
  badgeId,
  imageUrl: imageUrlProp = null,
  width = 150,
  height = 270,
  host = "https://www.credly.com",
}) {
  const base = host.replace(/\/+$/, "");
  const iframeSrc = `${base}/embedded_badge/${encodeURIComponent(badgeId)}`;

  const propUrl = imageUrlProp != null ? String(imageUrlProp).trim() : "";

  const [phase, setPhase] = useState(/** @type {'loading' | 'image' | 'iframe'} */ ("loading"));
  const [imageSrc, setImageSrc] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (propUrl) return;

    const apiBase = BASE_URL.replace(/\/+$/, "");
    if (!apiBase || !badgeId) {
      setPhase("iframe");
      return;
    }

    const ctrl = new AbortController();
    setPhase("loading");
    setImageSrc(null);

    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/credly/badges/${encodeURIComponent(badgeId)}/assertion`, {
          signal: ctrl.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const url = assertionBadgeImageUrl(json);
        if (url) {
          setImageSrc(url);
          setPhase("image");
        } else {
          setPhase("iframe");
        }
      } catch {
        setPhase("iframe");
      }
    })();

    return () => ctrl.abort();
  }, [badgeId, propUrl]);

  if (propUrl) {
    return <BadgeImageBlock imageSrc={propUrl} width={width} fetchPriority="high" />;
  }

  if (phase === "loading") {
    const sq = Math.min(width, Math.round(height * 0.45));
    return (
      <div
        className="mx-auto max-w-full animate-pulse rounded-lg bg-muted/25"
        style={{ width: sq, height: sq }}
        aria-hidden
      />
    );
  }

  if (phase === "image" && imageSrc) {
    return <BadgeImageBlock imageSrc={imageSrc} width={width} />;
  }

  return (
    <div className="mx-auto flex max-w-full justify-center overflow-x-auto">
      <iframe
        title="View my verified achievement on Credly."
        name="acclaim-badge"
        id={`embedded-badge-${badgeId}`}
        src={iframeSrc}
        width={width}
        height={height}
        className="block max-w-full border-0 bg-transparent"
        style={{ width, height }}
        scrolling="no"
        allowTransparency
        frameBorder={0}
      />
    </div>
  );
}
