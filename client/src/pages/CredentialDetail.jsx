import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ExternalLink,
  Download,
  FileText,
  ShieldCheck,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, staggerContainer } from "@/components/motion/MotionPrimitives";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CHIP_BG, CHIP_RING, popBy } from "@/lib/popColors";
import { CREDENTIAL_ICON_MAP } from "@/lib/credentialIcons";
import { FALLBACK as CREDENTIAL_FALLBACK } from "@/lib/credentialFallback";
import { CertificatePdfView } from "@/components/credentials/CertificatePdfView";
import { CredlyBadgeEmbed } from "@/components/credentials/CredlyBadgeEmbed";
import { BASE_URL as API_BASE_URL } from "@/lib/api";

/** @param {string | undefined} url */
function credlyBadgeUuidFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(
    /\/badges\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/i,
  );
  return m ? m[1] : null;
}

/** @param {unknown} json */
function parseOpenBadgesPayload(json) {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON");
  }
  const o = /** @type {Record<string, unknown>} */ (json);
  const issuedOn = /** @type {string | undefined} */ (o.issuedOn || o.issuanceDate);

  const recipient = /** @type {Record<string, unknown> | undefined} */ (
    o.recipient && typeof o.recipient === "object" ? o.recipient : undefined
  );
  let identity = recipient?.identity != null ? String(recipient.identity) : "";
  const hashed =
    recipient?.hashed === true || /^sha256\$|^sha512\$/i.test(identity) || identity.includes("$");

  let badge = o.badge;
  if (typeof badge === "string") {
    badge = undefined;
  }
  const badgeObj = badge && typeof badge === "object" ? /** @type {Record<string, unknown>} */ (badge) : {};
  const badgeName = /** @type {string} */ (badgeObj.name || "—");

  const issuerRaw = badgeObj.issuer;
  let issuerName = "—";
  if (issuerRaw && typeof issuerRaw === "object") {
    const iname = /** @type {Record<string, unknown>} */ (issuerRaw).name;
    if (iname != null) issuerName = String(iname);
  }

  const assertionId = String(o.id || o.uid || o.uuid || "—");

  let recipientDisplay = "—";
  if (hashed || identity.includes("$")) {
    recipientDisplay = "Verified (hashed identity)";
  } else if (identity.includes("@")) {
    const domain = identity.split("@")[1];
    recipientDisplay = domain ? `***@${domain}` : "***";
  } else if (identity) {
    recipientDisplay = identity.length > 12 ? `${identity.slice(0, 10)}…` : identity;
  }

  return {
    issuedOn: issuedOn || "—",
    badgeName,
    issuerName,
    assertionId,
    recipientDisplay,
  };
}

export function CredentialDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cred, setCred] = useState(/** @type {Record<string, unknown> | null} */ (null));
  const [loading, setLoading] = useState(true);

  const belts = useMemo(() => {
    const b = cred?.belts;
    return Array.isArray(b) ? b : [];
  }, [cred]);

  const [beltIdx, setBeltIdx] = useState(0);

  useEffect(() => {
    setBeltIdx(0);
  }, [id]);

  useEffect(() => {
    if (belts.length && beltIdx >= belts.length) setBeltIdx(0);
  }, [belts, beltIdx]);

  useEffect(() => {
    const ctrl = new AbortController();
    const base =
      import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8765" : "");

    (async () => {
      try {
        const res = await fetch(`${base.replace(/\/+$/, "")}/api/credentials/${encodeURIComponent(id || "")}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCred(data);
      } catch {
        const fallback = CREDENTIAL_FALLBACK.find((c) => c.id === id);
        setCred(fallback ? { ...fallback } : null);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id]);

  const activeBelt = belts[beltIdx] && typeof belts[beltIdx] === "object" ? belts[beltIdx] : null;
  /** @type {Record<string, unknown> | null} */
  const activeBeltObj = activeBelt && typeof activeBelt === "object" ? /** @type {Record<string, unknown>} */ (activeBelt) : null;

  const pdfUrl = useMemo(() => {
    const top = cred?.pdf_url != null && String(cred.pdf_url).trim() !== "" ? String(cred.pdf_url) : "";
    if (belts.length > 0 && !top) {
      const beltPdf = activeBeltObj?.pdf_url != null ? String(activeBeltObj.pdf_url) : "";
      return beltPdf;
    }
    return top;
  }, [cred?.pdf_url, belts.length, activeBeltObj?.pdf_url]);

  const credlyEmbedBadgeId = useMemo(() => {
    const top =
      cred?.credly_embed_badge_id != null && String(cred.credly_embed_badge_id).trim() !== ""
        ? String(cred.credly_embed_badge_id).trim()
        : "";
    if (belts.length > 0 && !top) {
      const beltEmbed =
        activeBeltObj?.credly_embed_badge_id != null ? String(activeBeltObj.credly_embed_badge_id).trim() : "";
      return beltEmbed;
    }
    return top;
  }, [cred?.credly_embed_badge_id, belts.length, activeBeltObj?.credly_embed_badge_id]);

  const credlyBadgeImageUrl = useMemo(() => {
    const top =
      cred?.credly_badge_image_url != null && String(cred.credly_badge_image_url).trim() !== ""
        ? String(cred.credly_badge_image_url).trim()
        : "";
    if (belts.length > 0 && !top) {
      const beltImg =
        activeBeltObj?.credly_badge_image_url != null ? String(activeBeltObj.credly_badge_image_url).trim() : "";
      return beltImg;
    }
    return top;
  }, [cred?.credly_badge_image_url, belts.length, activeBeltObj?.credly_badge_image_url]);

  const openbadgesUrlForFetch = useMemo(() => {
    const top = cred?.openbadges_url != null ? String(cred.openbadges_url) : "";
    const beltUrl = activeBeltObj?.openbadges_url != null ? String(activeBeltObj.openbadges_url) : "";
    return beltUrl || top || "";
  }, [cred, activeBeltObj]);

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyFailed, setVerifyFailed] = useState(false);
  const [verifyParsed, setVerifyParsed] = useState(/** @type {ReturnType<typeof parseOpenBadgesPayload> | null} */ (null));

  const runVerify = useCallback(async () => {
    const url = openbadgesUrlForFetch;
    if (!url) return;
    setVerifyLoading(true);
    setVerifyFailed(false);
    setVerifyParsed(null);
    try {
      const base = API_BASE_URL.replace(/\/+$/, "");
      const embedId =
        credlyEmbedBadgeId && /^[a-f0-9-]{36}$/i.test(credlyEmbedBadgeId) ? credlyEmbedBadgeId : "";
      const uuid = embedId || credlyBadgeUuidFromUrl(url) || "";
      const fetchUrl =
        base && uuid ? `${base}/api/credly/badges/${uuid}/assertion` : url;
      const res = await fetch(fetchUrl, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setVerifyParsed(parseOpenBadgesPayload(json));
    } catch {
      setVerifyFailed(true);
      setVerifyParsed(null);
    } finally {
      setVerifyLoading(false);
    }
  }, [openbadgesUrlForFetch, credlyEmbedBadgeId]);

  useEffect(() => {
    if (verifyOpen && openbadgesUrlForFetch) {
      runVerify();
    }
  }, [verifyOpen, openbadgesUrlForFetch, runVerify]);

  const credlyProfileUrl = cred?.url != null ? String(cred.url) : "https://www.credly.com/users/brant-simpson/badges";
  /** Same destination as Credly public share: /badges/{uuid}/public_url when we have an embed id. */
  const credlyOutUrl = useMemo(() => {
    const id = credlyEmbedBadgeId.trim();
    if (id && /^[a-f0-9-]{36}$/i.test(id)) {
      return `https://www.credly.com/badges/${id}/public_url`;
    }
    return credlyProfileUrl;
  }, [credlyEmbedBadgeId, credlyProfileUrl]);

  const credName = cred?.name != null ? String(cred.name) : "";
  const issuer = cred?.issuer != null ? String(cred.issuer) : "";
  const issueDate = cred?.issue_date != null ? String(cred.issue_date) : "";
  const expiresDate = cred?.expires_date != null ? String(cred.expires_date) : "";
  const description = cred?.description != null ? String(cred.description) : "";
  const skills = Array.isArray(cred?.skills) ? /** @type {string[]} */ (cred.skills) : [];
  const credlyBadgeUrl = cred?.credly_badge_url != null ? String(cred.credly_badge_url) : "";
  const verifyIssuerUrl = cred?.verify_url != null ? String(cred.verify_url) : "";
  const credentialIdTop = cred?.credential_id != null ? String(cred.credential_id) : "";
  const category = cred?.category != null ? String(cred.category) : "default";
  const Icon = CREDENTIAL_ICON_MAP[category] || CREDENTIAL_ICON_MAP.default;

  if (loading) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center py-24">
        <div className={cn("font-mono text-sm", isDark ? "text-primary" : "text-primary")}>
          {isDark ? "// loading..." : "loading..."}
        </div>
      </section>
    );
  }

  if (!cred || !id) {
    return (
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">404 · credential not found</div>
        <h1 className="mt-4 text-4xl font-extrabold">Credential not found.</h1>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/about#credentials">Back to Credentials Vault</Link>
        </Button>
      </section>
    );
  }

  const showInlineVerify = Boolean(openbadgesUrlForFetch);
  const showCredlyHeroBadge = Boolean(credlyEmbedBadgeId || credlyBadgeUrl);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.07, 0.05)}
      className="relative"
    >
      <div
        className={cn(
          "relative overflow-hidden pb-16 pt-32 md:pt-40",
          isDark ? "bg-gradient-to-br from-background via-background to-primary/5" : "bg-gradient-to-br from-background via-background to-primary/10"
        )}
      >
        {isDark && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)/0.05) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)/0.05) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}

        <div className="container relative z-10">
          <Reveal className="mb-6">
            <Link
              to="/about#credentials"
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                isDark ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Credentials Vault
            </Link>
          </Reveal>

          <Reveal className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/about#credentials" className="hover:text-foreground transition-colors">
              Credentials
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className={isDark ? "text-primary" : "text-foreground"}>{credName}</span>
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal className="flex flex-wrap items-center gap-2">
              {issueDate && (
                <Badge variant={isDark ? "default" : "accent"} className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Issued {issueDate}
                </Badge>
              )}
              {expiresDate && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px]",
                    isDark ? "bg-muted/60 text-muted-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  Expires {expiresDate}
                </span>
              )}
            </Reveal>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              <div className="flex min-w-0 flex-1 flex-col">
                <div
                  className={cn(
                    "flex flex-col items-center gap-6 text-center md:items-start md:text-left",
                    showCredlyHeroBadge &&
                      "md:grid md:max-w-5xl md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[auto_auto] md:gap-x-3 md:gap-y-2 lg:gap-x-5"
                  )}
                >
                  <Reveal className={cn("order-1 min-w-0 max-w-2xl md:order-none md:w-full", showCredlyHeroBadge && "md:col-start-1 md:row-start-1")}>
                    <h1
                      className={cn(
                        "text-5xl font-extrabold tracking-tight md:text-6xl",
                        isDark ? "text-neon text-foreground" : "text-foreground"
                      )}
                    >
                      {credName}
                    </h1>
                  </Reveal>
                  <Reveal className={cn("order-3 min-w-0 max-w-2xl md:order-none md:w-full", showCredlyHeroBadge && "md:col-start-1 md:row-start-2")}>
                    <p
                      className={cn(
                        "mt-3 text-lg md:text-xl",
                        !showCredlyHeroBadge && "md:mt-4",
                        isDark ? "text-primary" : "text-primary"
                      )}
                    >
                      {issuer}
                    </p>
                  </Reveal>

                  {showCredlyHeroBadge && (
                    <Reveal className="order-2 shrink-0 md:order-none md:col-start-2 md:row-start-1 md:self-start md:justify-self-center md:pt-1 lg:justify-self-start">
                      <div className="flex justify-center md:block">
                        {credlyEmbedBadgeId ? (
                          <CredlyBadgeEmbed
                            key={credlyEmbedBadgeId}
                            badgeId={credlyEmbedBadgeId}
                            imageUrl={credlyBadgeImageUrl || undefined}
                            width={158}
                            height={284}
                          />
                        ) : (
                          <img
                            src={credlyBadgeUrl}
                            alt={`${credName} badge`}
                            width={180}
                            height={180}
                            className="mx-auto block max-h-[300px] w-auto max-w-[158px] object-contain"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </Reveal>
                  )}
                </div>
              </div>

              <Reveal className="shrink-0 lg:min-w-[200px]">
                <div
                  className={cn(
                    "rounded-2xl p-5",
                    isDark ? "border border-border bg-card/85" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
                  )}
                >
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Category</div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        isDark ? "bg-primary/10 text-primary" : "bg-foreground text-background"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium capitalize">{category}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="mx-auto max-w-4xl space-y-14">
          {description && (
            <Reveal>
              <SectionBlock isDark={isDark} title="About this credential" icon={<FileText className="h-4 w-4" />}>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </SectionBlock>
            </Reveal>
          )}

        {skills.length > 0 && (
          <Reveal>
            <SectionBlock isDark={isDark} title="Skills validated">
              <div className="flex flex-wrap gap-2">
                {skills.map((s, si) => (
                  <span
                    key={s}
                    className={cn(
                      "rounded-md px-2 py-1 font-mono text-xs",
                      isDark ? "bg-muted/60 text-primary" : cn("font-medium text-foreground ring-2 shadow-sm", popBy(si, CHIP_BG), popBy(si, CHIP_RING))
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </SectionBlock>
          </Reveal>
        )}

        {belts.length > 1 && (
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {belts.map((b, i) => {
                const bo = b && typeof b === "object" ? /** @type {Record<string, unknown>} */ (b) : {};
                const label = bo.name != null ? String(bo.name) : `Belt ${i + 1}`;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setBeltIdx(i)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      beltIdx === i
                        ? isDark
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground text-background"
                        : isDark
                          ? "border border-border bg-card/60 text-muted-foreground hover:border-primary/40"
                          : "border border-border bg-card/80 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {pdfUrl ? (
          <Reveal>
            <SectionBlock isDark={isDark} title="Certificate (PDF)" icon={<FileText className="h-4 w-4" />}>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant={isDark ? "default" : "pop"}>
                  <a href={pdfUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={pdfUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </a>
                </Button>
              </div>
              <div
                className={cn(
                  "mt-4 rounded-2xl overflow-hidden",
                  isDark ? "border border-border" : "border border-border shadow-soft"
                )}
              >
                <CertificatePdfView key={pdfUrl} pdfUrl={pdfUrl} isDark={isDark} />
              </div>
            </SectionBlock>
          </Reveal>
        ) : (
          <Reveal>
            <SectionBlock isDark={isDark} title="Certificate (PDF)">
              <p className="text-sm text-muted-foreground">
                No PDF is linked for this credential yet (e.g. pending upload for IT Specialist – JavaScript).
              </p>
            </SectionBlock>
          </Reveal>
        )}

        <Reveal>
          <SectionBlock isDark={isDark} title="Verification" icon={<ShieldCheck className="h-4 w-4" />}>
            {belts.length > 1 && (
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                {belts.map((b) => {
                  const bo = b && typeof b === "object" ? /** @type {Record<string, unknown>} */ (b) : {};
                  const n = bo.name != null ? String(bo.name) : "";
                  const d = bo.issue_date != null ? String(bo.issue_date) : "";
                  const cid = bo.credential_id != null ? String(bo.credential_id) : "";
                  return (
                    <li
                      key={n + cid}
                      className={cn(
                        "rounded-lg border-l-2 py-1 pl-3",
                        isDark ? "border-secondary/50" : "border-foreground/30"
                      )}
                    >
                      <span className="font-medium text-foreground">{n}</span>
                      {d && <span className="mx-2">· {d}</span>}
                      {cid && <span className="font-mono text-xs">· {cid}</span>}
                    </li>
                  );
                })}
              </ul>
            )}

            {belts.length <= 1 && credentialIdTop && (
              <p className="mb-4 text-sm text-muted-foreground">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">Cert ID:</span>{" "}
                <span className="font-mono">{credentialIdTop}</span>
              </p>
            )}

            {verifyIssuerUrl && (
              <p className="mb-4">
                <a
                  href={verifyIssuerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "text-sm font-medium underline-offset-4 hover:underline",
                    isDark ? "text-primary" : "text-primary"
                  )}
                >
                  Verify on issuer site
                </a>
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {showInlineVerify && (
                <Button type="button" variant={isDark ? "default" : "pop"} onClick={() => setVerifyOpen((v) => !v)}>
                  <BadgeCheck className="h-4 w-4 mr-2" />
                  {verifyOpen ? "Hide live verification" : "Verify here"}
                </Button>
              )}
              <Button
                asChild
                variant={showInlineVerify ? "outline" : isDark ? "default" : "pop"}
              >
                <a href={credlyOutUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify on Credly
                </a>
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {verifyOpen && showInlineVerify && (
                <motion.div
                  key="verify"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "mt-6 rounded-2xl p-5",
                      isDark ? "border border-border bg-card/70" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
                    )}
                  >
                    {verifyLoading && (
                      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching OpenBadges assertion…
                      </div>
                    )}
                    {!verifyLoading && verifyFailed && (
                      <div className="space-y-3 text-sm">
                        <p className="text-muted-foreground">
                          Live verification unavailable — view on Credly for authoritative verification.
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <a href={credlyOutUrl} target="_blank" rel="noreferrer">
                            View on Credly
                          </a>
                        </Button>
                      </div>
                    )}
                    {!verifyLoading && !verifyFailed && verifyParsed && (
                      <ul className="space-y-2 text-sm">
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Badge</span>
                          <div className="font-medium">{verifyParsed.badgeName}</div>
                        </li>
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Issuer</span>
                          <div>{verifyParsed.issuerName}</div>
                        </li>
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Issued</span>
                          <div>{verifyParsed.issuedOn}</div>
                        </li>
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Assertion</span>
                          <div className="break-all font-mono text-xs">{verifyParsed.assertionId}</div>
                        </li>
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Recipient</span>
                          <div>{verifyParsed.recipientDisplay}</div>
                        </li>
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionBlock>
        </Reveal>

        <Reveal className="pt-4">
          <Button variant={isDark ? "default" : "pop"} asChild>
            <Link to="/about#credentials" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Credentials Vault
            </Link>
          </Button>
        </Reveal>
        </div>
      </div>
    </motion.div>
  );
}

function SectionBlock({ isDark, title, icon, children }) {
  return (
    <div>
      <h2 className={cn("mb-6 flex items-center gap-2 text-2xl font-extrabold tracking-tight", isDark && "text-neon")}>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isDark ? "bg-primary/10 text-primary" : "bg-foreground text-background"
            )}
          >
            {icon}
          </span>
        )}
        {title}
      </h2>
      {children}
    </div>
  );
}
