import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Cog, Database, Play, Square, Terminal } from "lucide-react";
import { ServicePageLayout } from "@/pages/ServicePageLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CliTerminalEmulator } from "@/components/demos/software/CliTerminalEmulator";
import { WebhookInspector } from "@/components/demos/software/WebhookInspector";
import { ArchitectureDiagramViewer } from "@/components/demos/software/ArchitectureDiagramViewer";
import { IntegrationCatalog } from "@/components/demos/software/IntegrationCatalog";
import { AutomationRecipeBuilder } from "@/components/demos/software/AutomationRecipeBuilder";
import { SoftwareCaseStudy } from "@/components/demos/shared/CaseStudySnapshot";
import { SoftwarePricingCard } from "@/components/demos/shared/PricingCard";
import { FAQAccordion } from "@/components/demos/shared/FAQAccordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { CUSTOM_SOFTWARE_FAQS } from "@/data/faqs";
import { OtherServicesNav } from "@/components/demos/shared/OtherServicesNav";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function CustomSoftwareDemo() {
  return (
    <ServicePageLayout
      eyebrow="03 · service / custom software"
      title="Custom Software Solutions"
      tagline="Bespoke tooling, APIs, automations, and internal platforms, from FastAPI services to CLIs and ETL jobs."
      tags={["Python", "FastAPI", "CLI tools", "automation", "APIs", "integrations"]}
    >
      <CapabilityGrid />
      <div className="mt-16">
        <FakeApiDemo />
      </div>
      <CliTerminalEmulator />
      <ArchitectureDiagramViewer />
      <WebhookInspector />
      <IntegrationCatalog />
      <AutomationRecipeBuilder />
      <div className="mt-16">
        <PipelineDemo />
      </div>
      <SoftwareCaseStudy />
      <SoftwarePricingCard />
      <section id="inquiry" className="mt-16 scroll-mt-20">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">start a project</div>
          <h2 className="text-2xl font-bold">Let&apos;s build something</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Tell me what you&apos;re working on. I&apos;ll get back to you within 48 hours.
          </p>
        </div>
        <ContactForm defaultService="custom-software" />
      </section>
      <div className="mt-16">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">faq</div>
          <h2 className="text-2xl font-bold">Custom software questions</h2>
        </div>
        <FAQAccordion items={CUSTOM_SOFTWARE_FAQS} />
      </div>
      <OtherServicesNav current="software" />
    </ServicePageLayout>
  );
}

function CapabilityGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const items = [
    { icon: Cog, title: "Automations", body: "Replace repetitive manual work with Python scripts, schedulers, and webhooks." },
    { icon: Cpu, title: "APIs & Services", body: "FastAPI backends with typed schemas, OpenAPI docs, and container ready deploys." },
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
                  : "border border-border shadow-soft"
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
        { port: 22,  service: "ssh",   banner: "OpenSSH_9.2" },
        { port: 80,  service: "http",  banner: "nginx/1.25" },
        { port: 443, service: "https", banner: "nginx/1.25" },
      ],
      elapsed_ms: 2847,
    },
  },
  {
    id: "ingest-webhook",
    method: "POST",
    path: "/api/v1/automation/ingest",
    body: { source: "stripe", event: "invoice.paid", id: "evt_abc123" },
    response: { queued: true, job_id: "bg_82fe11", eta_ms: 80 },
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
                      : "border border-border bg-accent/40 backdrop-blur-sm shadow-soft"
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
              : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
          )}
        >
          <span className="text-muted-foreground">{`# ${active.method} ${active.path}`}</span>
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

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** String or builder — builders run per line so ms / counts vary each run */
const PIPELINE_STEPS = [
  "[boot] pipeline.start, run_id=run_9f81a2",
  "[fetch] GET https://api.vendor.example/v2/orders?since=2026-04-20",
  () =>
    `[fetch] 200 OK · ${randInt(285, 352)} records in ${randInt(260, 620)}ms`,
  "[transform] normalizing currencies → USD",
  "[transform] dropping duplicate order_ids (4)",
  "[validate] schema ok · 0 rejected",
  () =>
    `[enrich] joining customers.csv (rows=${randInt(11_200, 14_100).toLocaleString("en-US")})`,
  "[persist] writing to postgres://prod/orders",
  () =>
    `[persist] committed ${randInt(286, 336)} rows in ${randInt(64, 420)}ms`,
  "[notify] slack → #ops-etl",
  () => `[done] pipeline ok · elapsed ${(randInt(17, 42) / 10).toFixed(1)}s`,
];

function resolvePipelineLine(step) {
  return typeof step === "function" ? step() : step;
}

function PipelineDemo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState([]);
  const timer = useRef(null);
  const lineIndex = useRef(0);

  const start = () => {
    if (running) return;
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    lineIndex.current = 0;
    setLines([]);
    setRunning(true);
    timer.current = setInterval(() => {
      const i = lineIndex.current;
      if (i >= PIPELINE_STEPS.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setRunning(false);
        return;
      }
      const next = resolvePipelineLine(PIPELINE_STEPS[i]);
      lineIndex.current = i + 1;
      setLines((prev) => [...prev, next]);
      if (i + 1 >= PIPELINE_STEPS.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setRunning(false);
      }
    }, 380);
  };

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setRunning(false);
  };

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">live demo</div>
          <h2 className="mt-1 text-2xl font-bold">Run a sample ETL pipeline</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={start}
            disabled={running}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              running
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : isDark
                ? "bg-primary text-primary-foreground shadow-neon-cyan hover:brightness-110"
                : "border border-border bg-accent text-accent-foreground shadow-soft"
            )}
          >
            <Play className="h-4 w-4" /> Run
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!running}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
              "border-border text-foreground hover:border-primary hover:text-primary",
              !running && "opacity-50"
            )}
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        </div>
      </div>

      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        isDark ? "border border-border bg-card/80 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
      )}>
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">pipeline.log</span>
          <span className={cn(
            "ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
            running ? "bg-accent/30 text-accent" : "bg-muted text-muted-foreground"
          )}>
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
            <div
              key={`${i}-${l.slice(0, 24)}`}
              className={cn(
                l.startsWith("[done]") && "text-accent",
                l.startsWith("[boot]") && "text-primary"
              )}
            >
              {l}
            </div>
          ))}
          {running && (
            <span className="inline-block terminal-cursor" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
