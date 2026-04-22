import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const NODES = {
  client: {
    id: "client", label: "Client", sub: "React + Vite",
    x: 60, y: 160,
    color: { dark: "#22E5FF", light: "#FA6B1F" },
    detail: "The React frontend — built with Vite, Tailwind, and Framer Motion. Served as static files via CDN so initial load is instant anywhere in the world.",
  },
  cdn: {
    id: "cdn", label: "CDN", sub: "Vercel Edge",
    x: 200, y: 80,
    color: { dark: "#B678FF", light: "#1F6BFA" },
    detail: "A global edge network (Vercel / Cloudflare) caches static assets and routes API traffic. Zero-latency asset delivery and automatic HTTPS.",
  },
  api: {
    id: "api", label: "FastAPI", sub: "Python 3.12",
    x: 340, y: 160,
    color: { dark: "#3BF475", light: "#0F766E" },
    detail: "The FastAPI backend handles all dynamic requests: auth, data, webhooks. Pydantic schemas enforce type safety; uvicorn + gunicorn serve under load.",
  },
  postgres: {
    id: "postgres", label: "Postgres", sub: "Primary DB",
    x: 480, y: 80,
    color: { dark: "#22E5FF", light: "#1F6BFA" },
    detail: "PostgreSQL is the source of truth for all structured data. Connection pooling via PgBouncer keeps connections efficient under concurrent load.",
  },
  redis: {
    id: "redis", label: "Redis", sub: "Cache + Queue",
    x: 480, y: 240,
    color: { dark: "#FF3D7F", light: "#FA6B1F" },
    detail: "Redis acts as both an in-memory cache (hot data, session tokens) and a job queue. Background workers pull tasks from Redis so the API stays non-blocking.",
  },
  s3: {
    id: "s3", label: "S3", sub: "Object Storage",
    x: 620, y: 160,
    color: { dark: "#B678FF", light: "#7AB7D9" },
    detail: "S3-compatible object storage (AWS S3 or Cloudflare R2) holds uploads, exports, and generated reports. Pre-signed URLs keep files private until accessed.",
  },
  worker: {
    id: "worker", label: "Worker", sub: "Background Jobs",
    x: 340, y: 300,
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

const W = 700;
const H = 380;
const NW = 90;
const NH = 44;

function nodeCenter(n) {
  return { cx: n.x + NW / 2, cy: n.y + NH / 2 };
}

export function ArchitectureDiagramViewer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const selectedNode = selected ? NODES[selected] : null;
  const nodeColor = (n) => isDark ? n.color.dark : n.color.light;

  return (
    <DemoSection
      eyebrow="architecture"
      heading="How the pieces fit together"
      description="Click any node to learn what it does and why it's there."
      onReset={() => setSelected(null)}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        isDark ? "border border-border bg-card/70 backdrop-blur" : "border-2 border-foreground bg-card shadow-pop"
      )}>
        {/* SVG diagram */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ minWidth: 480 }}
            className="block"
          >
            {/* Edges */}
            {EDGES.map((e) => {
              const from = NODES[e.from];
              const to = NODES[e.to];
              const f = nodeCenter(from);
              const t = nodeCenter(to);
              const isHighlighted = selected === e.from || selected === e.to;
              return (
                <motion.line
                  key={`${e.from}-${e.to}`}
                  x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                  stroke={isHighlighted
                    ? (isDark ? "#22E5FF" : "#FA6B1F")
                    : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)")
                  }
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted && !prefersReduced ? "6 3" : undefined}
                  animate={isHighlighted && !prefersReduced ? { strokeDashoffset: [0, -18] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
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
                    rx={8}
                    fill={isDark ? "rgba(13,18,32,0.9)" : "rgba(255,255,255,0.95)"}
                    stroke={isSelected ? color : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")}
                    strokeWidth={isSelected ? 2 : 1}
                    animate={!prefersReduced ? {
                      filter: isSelected ? `drop-shadow(0 0 8px ${color}80)` : "none"
                    } : {}}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={node.x + NW / 2} y={node.y + 16}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="600"
                    fill={isSelected ? color : (isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)")}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + NW / 2} y={node.y + 30}
                    textAnchor="middle"
                    fontSize={9}
                    fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? {} : { opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={cn(
                "border-t px-5 py-4",
                isDark ? "border-border bg-card/50" : "border-border bg-muted/30"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className="mb-1 font-semibold"
                    style={{ color: nodeColor(selectedNode) }}
                  >
                    {selectedNode.label}
                    <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                      {selectedNode.sub}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    {selectedNode.detail}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DemoSection>
  );
}
