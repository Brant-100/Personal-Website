import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Cog, Database, Play, Square, Terminal } from "lucide-react";
import { ServicePageLayout } from "@/pages/ServicePageLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function CustomSoftwareDemo() {
  return (
    <ServicePageLayout
      eyebrow="03 — service / custom software"
      title="Custom Software Solutions"
      tagline="Bespoke tooling, APIs, automations, and internal platforms — from FastAPI services to CLIs and ETL jobs."
      tags={["Python", "FastAPI", "CLI tools", "automation", "APIs", "integrations"]}
    >
      <CapabilityGrid />
      <div className="mt-16">
        <FakeApiDemo />
      </div>
      <div className="mt-16">
        <PipelineDemo />
      </div>
    </ServicePageLayout>
  );
}

function CapabilityGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const items = [
    { icon: Cog, title: "Automations", body: "Replace repetitive manual work with Python scripts, schedulers, and webhooks." },
    { icon: Cpu, title: "APIs & Services", body: "FastAPI backends with typed schemas, OpenAPI docs, and container-ready deploys." },
    { icon: Database, title: "Data tooling", body: "ETL jobs, reporting pipelines, CLIs that stitch systems together cleanly." },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 140, damping: 18 }}
          >
            <Card
              className={cn(
                "h-full transition-all",
                isDark
                  ? "bg-card/70 backdrop-blur hover:border-primary/50 hover:shadow-neon-cyan"
                  : "border-2 border-foreground shadow-pop"
              )}
            >
              <CardHeader>
                <div
                  className={cn(
                    "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
                    isDark
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : i === 0
                      ? "bg-primary text-primary-foreground"
                      : i === 1
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-base">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- Fake API demo: tap endpoints, see response ---------- */

const ENDPOINTS = [
  {
    id: "port-scan",
    method: "POST",
    path: "/api/v1/recon/port-scan",
    body: { target: "10.0.0.5", ports: "1-1024", threads: 128 },
    response: {
      target: "10.0.0.5",
      scanned_ports: 1024,
      open: [
        { port: 22,   service: "ssh",   banner: "OpenSSH_9.2" },
        { port: 80,   service: "http",  banner: "nginx/1.25" },
        { port: 443,  service: "https", banner: "nginx/1.25" },
      ],
      elapsed_ms: 2847,
    },
  },
  {
    id: "ingest-webhook",
    method: "POST",
    path: "/api/v1/automation/ingest",
    body: { source: "stripe", event: "invoice.paid", id: "evt_abc123" },
    response: {
      queued: true,
      job_id: "bg_82fe11",
      eta_ms: 80,
    },
  },
  {
    id: "user-report",
    method: "GET",
    path: "/api/v1/reports/users?since=2026-01-01",
    response: {
      since: "2026-01-01",
      total: 1284,
      new_this_week: 47,
      top_countries: ["US", "DE", "JP"],
    },
  },
];

function FakeApiDemo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeId, setActiveId] = useState(ENDPOINTS[0].id);
  const active = ENDPOINTS.find((e) => e.id === activeId);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Try a mock API</h2>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          {ENDPOINTS.map((e) => {
            const isActive = e.id === activeId;
            return (
              <button
                key={e.id}
                onClick={() => setActiveId(e.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                  isActive
                    ? isDark
                      ? "border border-primary/50 bg-primary/10 shadow-neon-cyan"
                      : "border-2 border-foreground bg-accent/40 shadow-pop"
                    : "border border-border bg-card/60 hover:border-primary/40"
                )}
              >
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider",
                    e.method === "GET"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-primary/20 text-primary"
                  )}
                >
                  {e.method}
                </span>
                <span className="truncate font-mono text-xs">{e.path}</span>
              </button>
            );
          })}
        </div>

        <motion.pre
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "overflow-x-auto rounded-2xl p-5 font-mono text-xs leading-6",
            isDark
              ? "border border-border bg-card/70 backdrop-blur"
              : "border-2 border-foreground bg-card shadow-pop"
          )}
        >
          <span className="text-muted-foreground">
            {`# ${active.method} ${active.path}`}
          </span>
          {"\n"}
          {active.body && (
            <>
              <span className="text-muted-foreground">{"# request\n"}</span>
              {JSON.stringify(active.body, null, 2)}
              {"\n\n"}
            </>
          )}
          <span className="text-muted-foreground">{"# 200 OK\n"}</span>
          <span className={isDark ? "text-accent" : "text-foreground"}>
            {JSON.stringify(active.response, null, 2)}
          </span>
        </motion.pre>
      </div>
    </div>
  );
}

/* ---------- Mini pipeline demo: start/stop a live-scrolling job log ---------- */

const LOG_LINES = [
  "[boot] pipeline.start — run_id=run_9f81a2",
  "[fetch] GET https://api.vendor.example/v2/orders?since=2026-04-20",
  "[fetch] 200 OK · 318 records in 412ms",
  "[transform] normalizing currencies → USD",
  "[transform] dropping duplicate order_ids (4)",
  "[validate] schema ok · 0 rejected",
  "[enrich] joining customers.csv (rows=12,984)",
  "[persist] writing to postgres://prod/orders",
  "[persist] committed 314 rows in 173ms",
  "[notify] slack → #ops-etl",
  "[done] pipeline ok · elapsed 2.4s",
];

function PipelineDemo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState([]);
  const timer = useRef(null);

  const start = () => {
    if (running) return;
    setLines([]);
    setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      setLines((prev) => [...prev, LOG_LINES[i]]);
      i += 1;
      if (i >= LOG_LINES.length) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 380);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
  };

  useEffect(() => () => timer.current && clearInterval(timer.current), []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            live demo
          </div>
          <h2 className="mt-1 text-2xl font-bold">Run a sample ETL pipeline</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={start}
            disabled={running}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              running
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : isDark
                ? "bg-primary text-primary-foreground shadow-neon-cyan hover:brightness-110"
                : "border-2 border-foreground bg-accent text-accent-foreground shadow-pop"
            )}
          >
            <Play className="h-4 w-4" />
            Run
          </button>
          <button
            onClick={stop}
            disabled={!running}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
              "border-border text-foreground hover:border-primary hover:text-primary",
              !running && "opacity-50"
            )}
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        </div>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          isDark
            ? "border border-border bg-card/80 backdrop-blur"
            : "border-2 border-foreground bg-card shadow-pop"
        )}
      >
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">
            pipeline.log
          </span>
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
              running
                ? "bg-accent/30 text-accent"
                : "bg-muted text-muted-foreground"
            )}
          >
            {running ? "● running" : "idle"}
          </span>
        </div>
        <div className="h-64 overflow-y-auto p-5 font-mono text-xs leading-6">
          {lines.length === 0 && (
            <span className="text-muted-foreground">
              Press <span className="text-primary">Run</span> to stream the log…
            </span>
          )}
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={cn(
                l.startsWith("[done]") && "text-accent",
                l.startsWith("[boot]") && "text-primary"
              )}
            >
              {l}
            </motion.div>
          ))}
          {running && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block terminal-cursor"
            />
          )}
        </div>
      </div>
    </div>
  );
}
