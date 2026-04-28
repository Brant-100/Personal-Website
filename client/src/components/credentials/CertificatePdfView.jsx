import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** Same-origin absolute URL helps pdf.js fetch reliably across certs and hosts. */
function resolvePdfFile(url) {
  if (!url) return url;
  if (typeof window === "undefined") return url;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const path = url.startsWith("/") ? url : `/${url}`;
    return new URL(path, window.location.origin).href;
  } catch {
    return url;
  }
}

function PdfPages({ pdfUrl, pageWidth, onLoadSuccess, onLoadError }) {
  const [numPages, setNumPages] = useState(0);
  const file = resolvePdfFile(pdfUrl);

  return (
    <Document
      key={pdfUrl}
      file={file}
      onLoadSuccess={({ numPages: n }) => {
        setNumPages(n);
        onLoadSuccess?.(n);
      }}
      onLoadError={onLoadError}
      loading={
        <div className="py-16 text-center font-mono text-sm text-muted-foreground">Loading certificate…</div>
      }
      error={
        <div className="max-w-md py-8 text-center text-sm text-muted-foreground">
          Preview could not load in the browser. Use <strong>Download PDF</strong> or{" "}
          <strong>Open in new tab</strong> above.
        </div>
      }
    >
      {numPages > 0
        ? Array.from({ length: numPages }, (_, i) => (
            <Page
              key={`${pdfUrl}-p${i + 1}`}
              pageNumber={i + 1}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-3 max-w-full shadow-md last:mb-0 [&_.react-pdf\_\_Page\_\_canvas]:mx-auto [&_.react-pdf\_\_Page\_\_canvas]:h-auto [&_.react-pdf\_\_Page\_\_canvas]:max-w-full [&_.react-pdf\_\_Page\_\_canvas]:block"
            />
          ))
        : null}
    </Document>
  );
}

/**
 * Renders PDF pages with PDF.js (no browser PDF chrome). Click preview to open fullscreen.
 */
export function CertificatePdfView({ pdfUrl, isDark }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(720);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPageWidth, setLightboxPageWidth] = useState(1200);
  const [inlineReady, setInlineReady] = useState(false);

  useEffect(() => {
    setInlineReady(false);
    setLightboxOpen(false);
  }, [pdfUrl]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        if (w > 0) setWidth(w);
      }
    });
    ro.observe(el);
    setWidth(Math.floor(el.clientWidth) || 720);
    return () => ro.disconnect();
  }, [pdfUrl]);

  const pageWidth = Math.max(240, Math.min(width - 32, 920));

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const updateWidth = () => {
      const pad = 56;
      const vw = window.innerWidth - pad;
      const vh = window.innerHeight - 100;
      // Prefer full width up to large screens; keep a sensible max for ultra-wide monitors
      const wByViewport = Math.min(vw, 1600);
      // If cert is very tall, cap width so a typical portrait page fits in viewport height (~1.3 ratio heuristic)
      const wByHeight = Math.floor(vh * 1.35);
      setLightboxPageWidth(Math.max(320, Math.min(wByViewport, wByHeight)));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", updateWidth);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox]);

  return (
    <div ref={containerRef} className="w-full min-w-0">
      <div
        role="button"
        tabIndex={inlineReady ? 0 : -1}
        aria-label={inlineReady ? "Expand certificate to full screen" : undefined}
        onClick={() => inlineReady && setLightboxOpen(true)}
        onKeyDown={(e) => {
          if (!inlineReady) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setLightboxOpen(true);
          }
        }}
        className={cn(
          "flex w-full flex-col items-center gap-3 overflow-x-hidden rounded-xl px-2 py-4 outline-none transition sm:px-4 sm:py-5",
          isDark ? "bg-muted/25" : "bg-muted/20",
          inlineReady &&
            "cursor-pointer hover:ring-2 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <PdfPages
          pdfUrl={pdfUrl}
          pageWidth={pageWidth}
          onLoadSuccess={() => setInlineReady(true)}
          onLoadError={(err) => {
            console.error("[CertificatePdfView] PDF load error:", err);
            setInlineReady(false);
          }}
        />
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="cert-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Certificate full screen preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 pt-16 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-h-[90vh] max-w-[96vw] overflow-y-auto rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-4 px-2 py-2">
                <PdfPages
                  pdfUrl={pdfUrl}
                  pageWidth={lightboxPageWidth}
                  onLoadError={(err) => console.error("[CertificatePdfView] lightbox PDF error:", err)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
