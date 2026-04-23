import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Trash2, ChevronUp, ChevronDown, X, Copy, Check, Zap, ArrowRight } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const TRIGGERS = [
  { id: "stripe_payment",  label: "New Stripe Payment",    icon: "💳" },
  { id: "slack_message",   label: "Slack Message",          icon: "💬" },
  { id: "form_submit",     label: "Form Submission",        icon: "📋" },
  { id: "schedule_cron",   label: "Scheduled (Cron)",       icon: "🕐" },
  { id: "github_pr",       label: "GitHub PR Opened",       icon: "🔀" },
];

const ACTIONS = [
  { id: "send_email",      label: "Send Email",             icon: "📧" },
  { id: "post_slack",      label: "Post to Slack",          icon: "💬" },
  { id: "write_db",        label: "Write to Database",      icon: "🗄️" },
  { id: "call_api",        label: "Call External API",      icon: "🔌" },
  { id: "send_sms",        label: "Send SMS (Twilio)",      icon: "📱" },
  { id: "create_notion",   label: "Create Notion Page",     icon: "📝" },
  { id: "gpt_summarize",   label: "Summarize with GPT",     icon: "🤖" },
];

function buildCode(trigger, actions) {
  if (!trigger || actions.length === 0) return "# Add a trigger and at least one action to generate code.";

  const triggerMap = {
    stripe_payment: `@app.post("/webhooks/stripe")\nasync def handle_stripe(payload: dict):\n    if payload["type"] != "payment_intent.succeeded":\n        return\n    amount = payload["data"]["object"]["amount"]\n    customer = payload["data"]["object"]["customer"]`,
    slack_message:  `@app.post("/webhooks/slack")\nasync def handle_slack(event: dict):\n    text = event.get("event", {}).get("text", "")\n    user = event.get("event", {}).get("user", "")`,
    form_submit:    `@app.post("/api/form")\nasync def handle_form(data: FormPayload):\n    name = data.name\n    email = data.email\n    message = data.message`,
    schedule_cron:  `# Run with: 0 9 * * 1-5 (weekdays at 9am)\nasync def scheduled_job():\n    logger.info("Running scheduled automation...")`,
    github_pr:      `@app.post("/webhooks/github")\nasync def handle_pr(payload: dict):\n    pr = payload.get("pull_request", {})\n    title = pr.get("title", "")\n    author = pr.get("user", {}).get("login", "")`,
  };

  const actionMap = {
    send_email:    `\n    # Send email\n    await resend.Emails.send({\n        "from": "hello@yourdomain.com",\n        "to": customer_email,\n        "subject": "Thanks for your order!",\n    })`,
    post_slack:    `\n    # Post to Slack\n    await httpx.post(SLACK_WEBHOOK, json={\n        "text": f"New event triggered by {user}",\n    })`,
    write_db:      `\n    # Write to database\n    async with db.begin():\n        await db.execute(\n            insert(events_table).values(data=payload)\n        )`,
    call_api:      `\n    # Call external API\n    async with httpx.AsyncClient() as client:\n        resp = await client.post(EXTERNAL_API, json={"data": payload})\n        resp.raise_for_status()`,
    send_sms:      `\n    # Send SMS\n    client.messages.create(\n        body="Your automation fired!",\n        from_=TWILIO_NUMBER,\n        to=user_phone,\n    )`,
    create_notion: `\n    # Create Notion page\n    await notion.pages.create({\n        "parent": {"database_id": DB_ID},\n        "properties": {"Name": {"title": [{"text": {"content": title}}]}},\n    })`,
    gpt_summarize: `\n    # Summarize with GPT\n    resp = await openai.chat.completions.create(\n        model="gpt-4o",\n        messages=[{"role": "user", "content": f"Summarize: {payload}"}],\n    )\n    summary = resp.choices[0].message.content`,
  };

  const header = `from fastapi import FastAPI\nimport httpx\nfrom openai import AsyncOpenAI\n\napp = FastAPI()\n\n`;
  const triggerCode = triggerMap[trigger] || `async def automation():`;
  const actionCode = actions.map((a) => actionMap[a] || `\n    # ${a}`).join("");

  return `${header}${triggerCode}${actionCode}\n\n    return {"ok": True}`;
}

export function AutomationRecipeBuilder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [trigger, setTrigger] = useState(null);
  const [actions, setActions] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const addAction = (id) => {
    if (!actions.includes(id)) setActions((a) => [...a, id]);
  };
  const removeAction = (id) => setActions((a) => a.filter((x) => x !== id));
  const moveUp = (i) => { if (i === 0) return; const a = [...actions]; [a[i-1], a[i]] = [a[i], a[i-1]]; setActions(a); };
  const moveDown = (i) => { if (i === actions.length - 1) return; const a = [...actions]; [a[i], a[i+1]] = [a[i+1], a[i]]; setActions(a); };
  const reset = () => { setTrigger(null); setActions([]); setShowCode(false); };

  const copy = async () => {
    await navigator.clipboard.writeText(buildCode(trigger, actions));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const code = buildCode(trigger, actions);
  const canGenerate = trigger && actions.length > 0;

  return (
    <DemoSection
      eyebrow="automation builder"
      heading="Build an automation, visually"
      description="Pick a trigger, chain some actions, then generate the Python code."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: pickers */}
        <div className="space-y-5">
          {/* Trigger picker */}
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">1. Trigger</div>
            <div className="space-y-1.5">
              {TRIGGERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrigger(trigger === t.id ? null : t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                    trigger === t.id
                      ? isDark ? "border-primary/60 bg-primary/10 text-foreground" : "border-2 border-foreground bg-accent/30"
                      : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  )}
                >
                  <span>{t.icon}</span>
                  <span className="font-medium">{t.label}</span>
                  {trigger === t.id && <Zap className="ml-auto h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action picker */}
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">2. Add actions</div>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((a) => {
                const added = actions.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => added ? removeAction(a.id) : addAction(a.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      added
                        ? isDark ? "border-primary/60 bg-primary/10 text-primary" : "border-foreground bg-foreground/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    )}
                  >
                    {a.icon} {a.label}
                    {added ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: recipe canvas */}
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">3. Your recipe</div>
          <div className={cn(
            "min-h-[200px] rounded-2xl border p-4",
            isDark ? "border-border bg-card/60" : "border-2 border-foreground bg-card shadow-pop"
          )}>
            {!trigger && actions.length === 0 && (
              <div className="flex h-full min-h-[160px] items-center justify-center text-xs text-muted-foreground">
                Pick a trigger and some actions →
              </div>
            )}
            {trigger && (
              <div className="space-y-2">
                {/* Trigger node */}
                <div className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3",
                  isDark ? "border-primary/40 bg-primary/5" : "border-foreground/40 bg-accent/20"
                )}>
                  <Zap className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest">trigger</div>
                    <div className="text-sm font-semibold">
                      {TRIGGERS.find((t) => t.id === trigger)?.icon}{" "}
                      {TRIGGERS.find((t) => t.id === trigger)?.label}
                    </div>
                  </div>
                </div>

                {/* Action nodes */}
                <AnimatePresence initial={false}>
                  {actions.map((aId, i) => {
                    const action = ACTIONS.find((a) => a.id === aId);
                    return (
                      <motion.div
                        key={aId}
                        initial={prefersReduced ? {} : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className="flex items-center gap-2"
                      >
                        <div className={cn(
                          "flex flex-1 items-center gap-3 rounded-xl border px-4 py-2.5",
                          isDark ? "border-border bg-card/80" : "border-border bg-card"
                        )}>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium flex-1">{action?.icon} {action?.label}</span>
                          <div className="flex gap-0.5">
                            <button onClick={() => moveUp(i)} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={i === 0}>
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button onClick={() => moveDown(i)} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={i === actions.length - 1}>
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            <button onClick={() => removeAction(aId)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Generate button */}
          <button
            onClick={() => setShowCode(!showCode)}
            disabled={!canGenerate}
            className={cn(
              "mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
              canGenerate
                ? isDark
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-neon-cyan"
                  : "border-2 border-foreground bg-accent text-accent-foreground shadow-pop"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            {showCode ? "Hide code" : "Generate Python code →"}
          </button>
        </div>
      </div>

      {/* Code output */}
      <AnimatePresence>
        {showCode && canGenerate && (
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={cn(
              "mt-4 overflow-hidden rounded-2xl",
              isDark ? "border border-border bg-card/70" : "border-2 border-foreground bg-card shadow-pop"
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
              <span className="font-mono text-xs text-muted-foreground">generated python · fastapi</span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "copied!" : "copy"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCode(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  aria-label="Close code panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-foreground/80">
              {code}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoSection>
  );
}
