import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle, RotateCcw, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/lib/api";

const STATES = { idle: "idle", submitting: "submitting", success: "success", error: "error" };

/**
 * Inline inquiry form that posts to POST /api/inquiry.
 * @param {string} source — the service page identifier (e.g. "web", "uiux", "software")
 */
export function CTAInquiryForm({ source = "general" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const [state, setState] = useState(STATES.idle);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setState(STATES.submitting);
    setErrorMsg("");

    try {
      const res = await fetch(`${BASE_URL}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      if (!res.ok) throw new Error("Server error");
      setState(STATES.success);
    } catch {
      setErrorMsg("Something went wrong — try again or email me directly.");
      setState(STATES.error);
    }
  };

  const reset = () => {
    setForm({ name: "", email: "", message: "" });
    setErrorMsg("");
    setState(STATES.idle);
  };

  const inputCls = cn(
    "w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm outline-none transition-colors",
    "placeholder:text-muted-foreground/50",
    isDark
      ? "border-border focus:border-primary"
      : "border-border focus:border-foreground"
  );

  return (
    <div id="inquiry" className="mt-16 scroll-mt-20">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">start a project</div>
        <h2 className="text-2xl font-bold">Let&apos;s build something</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Tell me what you&apos;re working on. I&apos;ll get back to you within 48 hours.
        </p>
      </div>

      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        isDark
          ? "border border-border bg-card/70 backdrop-blur"
          : "border-2 border-foreground bg-card shadow-pop"
      )}>
        <AnimatePresence mode="wait">
          {state === STATES.success ? (
            <motion.div
              key="success"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center"
            >
              <motion.div
                initial={prefersReduced ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
              >
                <CheckCircle className="h-12 w-12 text-green-500" />
              </motion.div>
              <div className="font-bold text-lg">Got it — I&apos;ll reply within 48 hours.</div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your inquiry landed safely. I&apos;ll reach out to <span className="text-foreground font-medium">{form.email}</span> soon.
              </p>
              <button
                onClick={reset}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Send another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? {} : { opacity: 0 }}
              className="grid gap-4 p-6 md:grid-cols-2"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Brant Simpson"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What are you building?</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell me about your project, what you need help with, your timeline, etc."
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              {errorMsg && (
                <div className="md:col-span-2 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
                  {errorMsg}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={state === STATES.submitting}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
                    state === STATES.submitting
                      ? "cursor-wait opacity-70"
                      : isDark
                      ? "bg-primary text-primary-foreground hover:brightness-110 shadow-neon-cyan"
                      : "border-2 border-foreground bg-foreground text-background hover:bg-foreground/90 shadow-pop"
                  )}
                >
                  {state === STATES.submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send inquiry</>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
