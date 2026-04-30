import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, Trash2, Zap } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const EVENT_TEMPLATES = [
  {
    id: "user.created",
    label: "user.created",
    method: "POST",
    path: "/webhooks/users",
    statusColor: "text-green-500",
    payload: {
      id: "usr_9k2m1x",
      email: "alice@example.com",
      name: "Alice Chen",
      plan: "pro",
      created_at: "2026-04-22T14:30:00Z",
    },
  },
  {
    id: "payment.succeeded",
    label: "payment.succeeded",
    method: "POST",
    path: "/webhooks/stripe",
    statusColor: "text-green-500",
    payload: {
      id: "evt_3Nm9qA",
      amount: 4900,
      currency: "usd",
      customer: "cus_PqR7s2",
      invoice: "in_1Nk2mA",
      status: "succeeded",
    },
  },
  {
    id: "invoice.failed",
    label: "invoice.failed",
    method: "POST",
    path: "/webhooks/stripe",
    statusColor: "text-destructive",
    payload: {
      id: "evt_4Xp1bB",
      amount: 9900,
      currency: "usd",
      customer: "cus_MnK3r9",
      failure_code: "card_declined",
      attempt: 2,
    },
  },
  {
    id: "scan.completed",
    label: "scan.completed",
    method: "POST",
    path: "/webhooks/nexus",
    statusColor: "text-primary",
    payload: {
      job_id: "scan_77fa2",
      target: "10.0.0.0/24",
      open_ports: [22, 80, 443, 5432],
      elapsed_ms: 3840,
      status: "completed",
    },
  },
  {
    id: "deploy.succeeded",
    label: "deploy.succeeded",
    method: "POST",
    path: "/webhooks/github",
    statusColor: "text-green-500",
    payload: {
      repo: "acme/api",
      ref: "refs/heads/main",
      commit: "a4f2c91",
      environment: "production",
      url: "https://api.acme.app",
      duration_s: 48,
    },
  },
  {
    id: "integration.synced",
    label: "integration.synced",
    method: "POST",
    path: "/webhooks/integrations",
    statusColor: "text-secondary",
    payload: {
      connector: "salesforce",
      run_id: "sync_9c4e21",
      records_upserted: 1842,
      conflicts: 0,
      finished_at: "2026-04-22T15:02:11Z",
    },
  },
  {
    id: "alert.triggered",
    label: "alert.triggered",
    method: "POST",
    path: "/webhooks/pagerduty",
    statusColor: "text-accent",
    payload: {
      incident_key: "pd_8k2m",
      severity: "critical",
      service: "api-prod",
      summary: "Error rate > 5% for 3m",
      dedup_key: "err_rate_us_east",
    },
  },
];

function makeEvent(template) {
  return {
    ...template,
    uid: `${template.id}-${Date.now()}`,
    ts: new Date().toISOString(),
    status: 200,
    headers: {
      "content-type": "application/json",
      "x-webhook-signature": `sha256=${Math.random().toString(36).slice(2, 18)}`,
      "x-delivery-id": Math.random().toString(36).slice(2, 12),
    },
  };
}

export function WebhookInspector() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [events, setEvents] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const trigger = (template) => {
    const delay = 100 + Math.random() * 400;
    setTimeout(() => {
      setEvents((prev) => [makeEvent(template), ...prev].slice(0, 20));
    }, delay);
  };

  const clear = () => { setEvents([]); setExpanded(null); };

  return (
    <DemoSection
      eyebrow="webhook inspector"
      heading="Watch webhooks arrive live"
      description="Click a trigger to fire a simulated event. Expand any row to see headers and payload."
      onReset={clear}
    >
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        {/* Triggers */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Trigger an event
          </div>
          {EVENT_TEMPLATES.map((t) => (
            <motion.button
              key={t.id}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              onClick={() => trigger(t)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors",
                isDark
                  ? "border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5"
                  : "border-border bg-card hover:border-foreground"
              )}
            >
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{t.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Event list */}
        <div className={cn(
          "overflow-hidden rounded-2xl",
          isDark ? "border border-border bg-card/70 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
        )}>
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-mono text-xs text-muted-foreground">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </span>
            {events.length > 0 && (
              <button
                onClick={clear}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <div className="h-80 overflow-y-auto">
            {events.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-xs text-muted-foreground">
                  No events yet; trigger one →
                </span>
              </div>
            )}

            <AnimatePresence initial={false}>
              {events.map((ev) => (
                <motion.div
                  key={ev.uid}
                  initial={prefersReduced ? {} : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? {} : { opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                >
                  <button
                    onClick={() => setExpanded((p) => (p === ev.uid ? null : ev.uid))}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border/50 px-4 py-2.5 text-left transition-colors last:border-0",
                      expanded === ev.uid
                        ? isDark ? "bg-primary/5" : "bg-accent/10"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <span className={cn("font-mono text-[10px] font-bold rounded px-1.5 py-0.5 bg-primary/10", "text-primary")}>
                      {ev.method}
                    </span>
                    <span className="flex-1 truncate font-mono text-xs">{ev.label}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {ev.ts.split("T")[1].slice(0, 8)}
                    </span>
                    <span className={cn("shrink-0 font-mono text-[10px] font-bold", ev.statusColor)}>
                      {ev.status}
                    </span>
                    <motion.div
                      animate={{ rotate: expanded === ev.uid ? 180 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expanded === ev.uid && (
                      <motion.div
                        initial={prefersReduced ? {} : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="overflow-hidden"
                      >
                        <div className="border-b border-border/50 bg-muted/20 px-4 py-3 font-mono text-xs">
                          <div className="mb-2 text-muted-foreground">{"// headers"}</div>
                          {Object.entries(ev.headers).map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <span className="text-primary shrink-0">{k}:</span>
                              <span className="truncate text-foreground/70">{v}</span>
                            </div>
                          ))}
                          <div className="mt-3 mb-1 text-muted-foreground">{"// payload"}</div>
                          <pre className="whitespace-pre-wrap text-foreground/80">
                            {JSON.stringify(ev.payload, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
