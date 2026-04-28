import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/lib/api";
import {
  inquirySchema,
  inquiryServiceLabels,
  budgetLabels,
  timelineLabels,
} from "@/lib/schemas";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

/** Explicit option colors so native dropdown lists stay readable (esp. Windows + dark theme). */
const optionStyle = {
  backgroundColor: "hsl(var(--card))",
  color: "hsl(var(--card-foreground))",
};

/**
 * Shared contact/inquiry form used everywhere on the site.
 *
 * @param {string}  defaultService — pre-selects the service dropdown
 * @param {boolean} compact        — hides budget + timeline (for tighter layouts)
 */
export function ContactForm({ defaultService = "general", compact = false }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      service: defaultService,
      name: "",
      email: "",
      budget: "",
      timeline: "",
      message: "",
      website: "",
      turnstileToken: "",
    },
    mode: "onBlur",
  });

  const turnstileToken = watch("turnstileToken");

  const onSubmit = async (data) => {
    setStatus("submitting");
    setErrorMessage(null);
    // Strip empty optional strings so backend Literal validation doesn't reject them.
    const payload = { ...data };
    if (!payload.budget) delete payload.budget;
    if (!payload.timeline) delete payload.timeline;
    try {
      const res = await fetch(`${BASE_URL}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl p-8 text-center",
          isDark
            ? "border border-primary/40 bg-primary/5 shadow-neon-cyan"
            : "border border-border bg-accent/25 backdrop-blur-sm shadow-soft"
        )}
      >
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">Got it.</h3>
        <p className="mt-2 text-muted-foreground">
          I&apos;ll reply within 48 hours, usually much faster. Check your inbox for
          a confirmation email.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn(
        "space-y-4 rounded-2xl p-6 md:p-8",
        isDark
          ? "border border-border bg-card/70 backdrop-blur shadow-presence-rest transition-shadow duration-300"
          : "gradient-border-card shadow-soft"
      )}
    >
      {/* Honeypot — visually hidden from real users */}
      <div
        style={{ position: "absolute", left: "-9999px", top: "-9999px", visibility: "hidden" }}
        aria-hidden="true"
      >
        <label>
          Your website (leave blank)
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Your name" error={errors.name?.message} isDark={isDark}>
          <input
            type="text"
            autoComplete="name"
            placeholder="First Last"
            {...register("name")}
            className={inputCls(isDark)}
          />
        </Field>
        <Field label="Email" error={errors.email?.message} isDark={isDark}>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className={inputCls(isDark)}
          />
        </Field>
      </div>

      <Field label="What do you need?" error={errors.service?.message} isDark={isDark}>
        <select {...register("service")} className={selectCls(isDark)}>
          {Object.entries(inquiryServiceLabels).map(([value, label]) => (
            <option key={value} value={value} style={optionStyle}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      {!compact && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Budget (optional)" isDark={isDark}>
            <select {...register("budget")} className={selectCls(isDark)}>
              <option value="" style={optionStyle}>
                Select a range
              </option>
              {Object.entries(budgetLabels).map(([value, label]) => (
                <option key={value} value={value} style={optionStyle}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Timeline (optional)" isDark={isDark}>
            <select {...register("timeline")} className={selectCls(isDark)}>
              <option value="" style={optionStyle}>
                Select a timeline
              </option>
              {Object.entries(timelineLabels).map(([value, label]) => (
                <option key={value} value={value} style={optionStyle}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      <Field
        label="What are you building?"
        error={errors.message?.message}
        isDark={isDark}
      >
        <textarea
          rows={5}
          placeholder="Tell me about your project — what it does, who it's for, any constraints."
          {...register("message")}
          className={cn(inputCls(isDark), "resize-y")}
        />
      </Field>

      {/* Turnstile */}
      {TURNSTILE_SITE_KEY ? (
        <div>
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setValue("turnstileToken", token, { shouldValidate: true })}
            onError={() => setValue("turnstileToken", "", { shouldValidate: false })}
            onExpire={() => setValue("turnstileToken", "", { shouldValidate: false })}
            options={{ theme: isDark ? "dark" : "light" }}
          />
          {errors.turnstileToken?.message && (
            <p className="mt-1 text-xs text-destructive">
              {errors.turnstileToken.message}
            </p>
          )}
        </div>
      ) : (
        /* Dev-only bypass: set a non-empty token so the form isn't stuck */
        <input type="hidden" value="dev-bypass" {...register("turnstileToken")} />
      )}

      <AnimatePresence>
        {status === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="font-mono text-xs text-muted-foreground">
          Reply within 48h · US clients only
        </p>
        <Button
          type="submit"
          size="lg"
          variant={isDark ? "default" : "pop"}
          disabled={isSubmitting || (TURNSTILE_SITE_KEY && !turnstileToken)}
          className="inline-flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send inquiry
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, isDark, children }) {
  return (
    <label className="block space-y-1.5">
      <span
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.2em]",
          isDark ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function inputCls(isDark) {
  return cn(
    "block w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors",
    "placeholder:text-muted-foreground/50",
    isDark
      ? "border-border focus:border-primary"
      : "border border-border bg-background/80 backdrop-blur-sm focus:border-primary"
  );
}

function selectCls(isDark) {
  return cn(
    "block w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors",
    "text-foreground",
    isDark
      ? "border-border bg-card focus:border-primary [color-scheme:dark]"
      : "border border-border bg-card/70 backdrop-blur-sm focus:border-primary [color-scheme:light]"
  );
}
