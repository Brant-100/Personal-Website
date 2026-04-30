import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  {
    name: "Stripe",
    category: "Payments",
    color: "#6772E5",
    useCase: "Charge customers, manage subscriptions, handle webhooks for payment events.",
    snippet: `import stripe\nstripe.api_key = os.getenv("STRIPE_SK")\n\nsession = stripe.checkout.Session.create(\n  payment_method_types=["card"],\n  line_items=[{"price": price_id, "quantity": 1}],\n  mode="subscription",\n  success_url=SUCCESS_URL,\n)`,
  },
  {
    name: "Twilio",
    category: "Comms",
    color: "#F22F46",
    useCase: "Send SMS alerts, verification codes, and voice calls from Python.",
    snippet: `from twilio.rest import Client\n\nclient = Client(ACCOUNT_SID, AUTH_TOKEN)\nmessage = client.messages.create(\n  body="Your code is 482910",\n  from_="+15551234567",\n  to=user.phone,\n)`,
  },
  {
    name: "Slack",
    category: "Comms",
    color: "#4A154B",
    useCase: "Post notifications, build slash commands, and respond to events from your app.",
    snippet: `import httpx\n\nawait httpx.post(\n  SLACK_WEBHOOK,\n  json={\n    "text": f":white_check_mark: Deploy succeeded",\n    "blocks": build_blocks(run),\n  },\n)`,
  },
  {
    name: "Discord",
    category: "Comms",
    color: "#5865F2",
    useCase: "Send rich embeds to channels, build bots, monitor alerts in community servers.",
    snippet: `import httpx\n\nawait httpx.post(DISCORD_WEBHOOK, json={\n  "embeds": [{\n    "title": "New order",\n    "description": f"Order #{order.id}",\n    "color": 0x22E5FF,\n  }]\n})`,
  },
  {
    name: "GitHub",
    category: "Productivity",
    color: "#171515",
    useCase: "Automate PR reviews, trigger deployments, post status checks from CI.",
    snippet: `from github import Github\n\ng = Github(GITHUB_TOKEN)\nrepo = g.get_repo("org/repo")\npr = repo.get_pull(pr_number)\npr.create_review(body=review, event="APPROVE")`,
  },
  {
    name: "Notion",
    category: "Productivity",
    color: "#000000",
    useCase: "Push structured data into Notion databases as your CMS or internal wiki.",
    snippet: `import httpx\n\nawait httpx.post(\n  f"https://api.notion.com/v1/pages",\n  headers={"Authorization": f"Bearer {NOTION_TOKEN}"},\n  json={\n    "parent": {"database_id": DB_ID},\n    "properties": {"Name": {"title": [{"text": {"content": title}}]}},\n  },\n)`,
  },
  {
    name: "OpenAI",
    category: "AI",
    color: "#10A37F",
    useCase: "Add GPT-4 text generation, embeddings for semantic search, or structured output.",
    snippet: `from openai import AsyncOpenAI\n\nclient = AsyncOpenAI()\nresponse = await client.chat.completions.create(\n  model="gpt-4o",\n  messages=[{"role": "user", "content": prompt}],\n  response_format={"type": "json_object"},\n)`,
  },
  {
    name: "Anthropic",
    category: "AI",
    color: "#C2703A",
    useCase: "Claude models for long-context analysis, document summarization, and reasoning.",
    snippet: `import anthropic\n\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n  model="claude-opus-4-5",\n  max_tokens=1024,\n  messages=[{"role": "user", "content": prompt}],\n)`,
  },
  {
    name: "Google Sheets",
    category: "Productivity",
    color: "#0F9D58",
    useCase: "Read and write spreadsheet data, great for non-technical stakeholder reporting.",
    snippet: `from googleapiclient.discovery import build\n\nservice = build("sheets", "v4", credentials=creds)\nservice.spreadsheets().values().append(\n  spreadsheetId=SHEET_ID,\n  range="Sheet1!A1",\n  body={"values": [row]},\n).execute()`,
  },
  {
    name: "Resend",
    category: "Comms",
    color: "#000000",
    useCase: "Transactional email with React templates (clean API, great deliverability).",
    snippet: `import resend\n\nresend.api_key = RESEND_KEY\nresend.Emails.send({\n  "from": "hello@yourdomain.com",\n  "to": user.email,\n  "subject": "Welcome!",\n  "html": render_template("welcome.html"),\n})`,
  },
];

const CATEGORIES = ["All", ...new Set(INTEGRATIONS.map((i) => i.category))];

export function IntegrationCatalog() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const visible = filter === "All" ? INTEGRATIONS : INTEGRATIONS.filter((i) => i.category === filter);
  const active = selected ? INTEGRATIONS.find((i) => i.name === selected) : null;

  const copy = async () => {
    if (!active) return;
    await navigator.clipboard.writeText(active.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <DemoSection
      eyebrow="integrations"
      heading="Services I connect to"
      description="APIs and platforms that tend to surface in the builds I ship; not a vendor list, just recurring touchpoints."
    >
      {/* Filter tabs: low-key grouping, not the main story */}
      <div className="mb-4 flex flex-wrap gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              filter === cat
                ? isDark
                  ? "bg-primary/20 text-primary"
                  : "bg-foreground/10 text-foreground"
                : "text-muted-foreground/80 hover:bg-muted/40 hover:text-muted-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {visible.map((intg) => (
            <motion.button
              key={intg.name}
              layout
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={() => setSelected(selected === intg.name ? null : intg.name)}
              className={cn(
                "rounded-2xl border p-4 text-center transition-all",
                selected === intg.name
                  ? isDark ? "border-primary/40 bg-primary/5" : "border-foreground/40 bg-accent/10"
                  : isDark
                    ? "border-border/80 bg-card/40 hover:border-border hover:bg-card/60"
                    : "border-border bg-card/80 hover:border-foreground/25"
              )}
            >
              <div
                className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm"
                style={{ background: intg.color === "#000000" || intg.color === "#171515" ? (isDark ? "#2a2a2a" : "#1a1a1a") : intg.color }}
              >
                {intg.name.slice(0, 2)}
              </div>
              <div className="text-xs font-semibold">{intg.name}</div>
              <div className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground/55">
                {intg.category}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.name}
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={cn(
              "mt-4 overflow-hidden rounded-2xl",
              isDark ? "border border-border bg-card/60 backdrop-blur" : "border border-foreground/20 bg-card"
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <span className="font-semibold">{active.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{active.category}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={copy} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "copied!" : "copy"}
                </button>
                <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="px-5 py-3 text-sm text-muted-foreground border-b border-border/50">
              {active.useCase}
            </div>
            <pre className="whitespace-pre-wrap break-words p-5 font-mono text-xs leading-6 text-foreground/80 [overflow-wrap:anywhere]">
              {active.snippet}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoSection>
  );
}
