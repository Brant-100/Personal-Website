import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/* Left → right = request path; below API = async worker path; Postgres/S3 branch off the API */
const NODES = {
  client: {
    id: "client", label: "Client", sub: "React + Vite",
    x: 48, y: 152,
    color: { dark: "#22E5FF", light: "#FA6B1F" },
    detail: "The React frontend — built with Vite, Tailwind, and Framer Motion. Served as static files via CDN so initial load is instant anywhere in the world.",
  },
  cdn: {
    id: "cdn", label: "CDN", sub: "Vercel Edge",
    x: 232, y: 152,
    color: { dark: "#B678FF", light: "#1F6BFA" },
    detail: "A global edge network (Vercel / Cloudflare) caches static assets and routes API traffic. Zero-latency asset delivery and automatic HTTPS.",
  },
  api: {
    id: "api", label: "FastAPI", sub: "Python 3.12",
    x: 416, y: 152,
    color: { dark: "#3BF475", light: "#0F766E" },
    detail: "The FastAPI backend handles all dynamic requests: auth, data, webhooks. Pydantic schemas enforce type safety; uvicorn + gunicorn serve under load.",
  },
  postgres: {
    id: "postgres", label: "Postgres", sub: "Primary DB",
    x: 648, y: 56,
    color: { dark: "#22E5FF", light: "#1F6BFA" },
    detail: "PostgreSQL is the source of truth for all structured data. Connection pooling via PgBouncer keeps connections efficient under concurrent load.",
  },
  s3: {
    id: "s3", label: "S3", sub: "Object Storage",
    x: 648, y: 248,
    color: { dark: "#B678FF", light: "#7AB7D9" },
    detail: "S3-compatible object storage (AWS S3 or Cloudflare R2) holds uploads, exports, and generated reports. Pre-signed URLs keep files private until accessed.",
  },
  redis: {
    id: "redis", label: "Redis", sub: "Cache + Queue",
    x: 416, y: 288,
    color: { dark: "#FF3D7F", light: "#FA6B1F" },
    detail: "Redis acts as both an in-memory cache (hot data, session tokens) and a job queue. Background workers pull tasks from Redis so the API stays non-blocking.",
  },
  worker: {
    id: "worker", label: "Worker", sub: "Background Jobs",
    x: 416, y: 396,
    color: { dark: "#FFD028", light: "#C26B3B" },
    detail: "Python worker processes handle long-running tasks: ETL jobs, email sends, scan pipelines. They pull from the Redis queue and report completion back to the API.",
  },
};

const EDGES = [
  { from: "client",   to: "cdn" },
  { from: "cdn",      to: "api" },
  { from: "api",      to: "postgres" },
  { from: "api",      to: "redis" },
  { from: "api",      to: "s3" },
  { from: "redis",    to: "worker" },
  { from: "worker",   to: "postgres" },
];

const W = 812;
const H = 480;
const NW = 112;
const NH = 56;

function nodeCenter(n) {
  return { cx: n.x + NW / 2, cy: n.y + NH / 2 };
}

export function ArchitectureDiagramViewer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState(null);

  const selectedNode = selected ? NODES[selected] : null;
  const nodeColor = (n) => isDark ? n.color.dark : n.color.light;

  return (
    <DemoSection
      eyebrow="architecture"
      heading="How the pieces fit together"
      description="Request flow runs left to right; the stack under the API is cache, queue, and workers."
    >
      <div className={cn(
        "overflow-hidden rounded-2xl",
        isDark ? "border border-border bg-card/70 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
      )}>
        <div className="grid lg:grid-cols-[minmax(0,1.35fr)_min(100%,280px)] lg:divide-x lg:divide-border">
          {/* Diagram */}
          <div className="min-h-[min(52vh,28rem)] overflow-x-auto p-4 sm:p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              User request → edge → API → data
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              className="mx-auto block h-auto w-full max-h-[min(58vh,34rem)]"
              style={{ minWidth: 500 }}
            >
            {/* Edges — static lines; highlight when a connected node is selected */}
            {EDGES.map((e) => {
              const from = NODES[e.from];
              const to = NODES[e.to];
              const f = nodeCenter(from);
              const t = nodeCenter(to);
              const isHighlighted = selected === e.from || selected === e.to;
              const isAsync =
                ["redis", "worker"].includes(e.from) || ["redis", "worker"].includes(e.to);
              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                  stroke={isHighlighted
                    ? (isDark ? "#22E5FF" : "#FA6B1F")
                    : (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)")
                  }
                  strokeWidth={isHighlighted ? 2.5 : 1.25}
                  strokeDasharray={isAsync ? "6 5" : undefined}
                />
              );
            })}

            {/* Nodes */}
            {Object.values(NODES).map((node) => {
              const isSelected = selected === node.id;
              const color = nodeColor(node);
              return (
                <g
                  key={node.id}
                  onClick={() => setSelected(isSelected ? null : node.id)}
                  style={{ cursor: "pointer" }}
                >
                  <motion.rect
                    x={node.x} y={node.y}
                    width={NW} height={NH}
                    rx={10}
                    fill={isDark ? "rgba(13,18,32,0.9)" : "rgba(255,255,255,0.95)"}
                    stroke={isSelected ? color : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")}
                    strokeWidth={isSelected ? 2 : 1}
                    animate={!prefersReduced ? {
                      filter: isSelected ? `drop-shadow(0 0 8px ${color}80)` : "none"
                    } : {}}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={node.x + NW / 2} y={node.y + 22}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight="600"
                    fill={isSelected ? color : (isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)")}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + NW / 2} y={node.y + 42}
                    textAnchor="middle"
                    fontSize={11}
                    fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
            </svg>
          </div>

          {/* Details — beside the diagram on large screens; no full-width bottom bar */}
          <div
            className={cn(
              "flex flex-col border-t p-4 sm:p-5 lg:border-t-0",
              isDark ? "bg-card/40 lg:bg-transparent" : "bg-muted/20 lg:bg-transparent"
            )}
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Details
            </div>
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={prefersReduced ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReduced ? {} : { opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="font-semibold leading-snug"
                      style={{ color: nodeColor(selectedNode) }}
                    >
                      {selectedNode.label}
                      <div className="mt-0.5 font-mono text-xs font-normal text-muted-foreground">
                        {selectedNode.sub}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Clear selection"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedNode.detail}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 text-sm leading-relaxed text-muted-foreground"
                >
                  Select a box in the diagram. Lines to Postgres and S3 are the live request path; dashed lines are the background job path.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
