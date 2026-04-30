import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { DemoSection } from "@/components/demos/shared/DemoSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const FILES = {
  "readme.md":  "# brant.simpson: custom software\nFastAPI services, CLIs, automation, data pipelines.",
  "config.yml": "version: 1\nhost: 0.0.0.0\nport: 8000\ndebug: false",
  "api.py":     "from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/health')\ndef health():\n    return {'ok': True}",
};

const COMMANDS = {
  help: () => [
    "available commands:",
    "  help        : show this message",
    "  whoami      : who's running this?",
    "  ls          : list files",
    "  cat <file>  : read a file",
    "  curl <url>  : fake HTTP request",
    "  scan <host> : port scan demo",
    "  deploy      : deploy sequence",
    "  clear       : clear terminal",
  ],

  whoami: () => [
    "brant simpson",
    "software engineer · cybersecurity · ohio",
    "available for projects; brantsimpson.com",
  ],

  ls: () => Object.keys(FILES).map((f) => `  ${f}`),

  cat: (args) => {
    const file = args[0];
    if (!file) return ["usage: cat <filename>", `available: ${Object.keys(FILES).join(", ")}`];
    const content = FILES[file];
    if (!content) return [`cat: ${file}: no such file`];
    return content.split("\n");
  },

  curl: (args) => {
    const url = args[0] || "https://api.example.com/v1/data";
    return [
      `> GET ${url}`,
      "> Host: api.example.com",
      "> Accept: application/json",
      "",
      "< HTTP/1.1 200 OK",
      "< Content-Type: application/json",
      "",
      JSON.stringify({ status: "ok", data: { id: "abc123", timestamp: new Date().toISOString() } }, null, 2),
    ];
  },
};

const SCAN_HOST_LINES = (host) => [
  `starting scan on ${host}...`,
  "22/tcp   open  ssh     OpenSSH 9.2",
  "80/tcp   open  http    nginx/1.25",
  "443/tcp  open  https   nginx/1.25",
  "3306/tcp closed mysql",
  "5432/tcp open  postgres",
  `scan complete: 4 open ports on ${host}`,
];

const DEPLOY_LINES = [
  "[git]    pulling latest main...",
  "[git]    HEAD is now at a4f2c91",
  "[build]  vite build --mode production",
  "[build]  ✓ 42 modules transformed",
  "[build]  dist/index.html  1.2 kB",
  "[build]  dist/assets/index-Cm9A3.js  184 kB",
  "[deploy] uploading to CDN...",
  "[deploy] invalidating cache...",
  "[done]   deployed in 8.4s at https://yourapp.vercel.app",
];

function useTerminal() {
  const [lines, setLines] = useState([{ type: "output", text: 'type "help" to see available commands.' }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [, setHistIdx] = useState(-1);
  const pendingLines = useRef([]);
  const streaming = useRef(false);

  const appendLine = (type, text) => {
    setLines((prev) => [...prev, { type, text, id: Math.random() }]);
  };

  const streamLines = useCallback((newLines) => {
    if (streaming.current) {
      pendingLines.current.push(...newLines);
      return;
    }
    const all = [...newLines];
    streaming.current = true;
    let i = 0;
    const tick = () => {
      if (i >= all.length) {
        streaming.current = false;
        if (pendingLines.current.length) {
          const next = pendingLines.current.splice(0);
          streamLines(next);
        }
        return;
      }
      appendLine("output", all[i]);
      i++;
      setTimeout(tick, 60);
    };
    tick();
  }, []);

  const run = useCallback(async (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    appendLine("input", `$ ${trimmed}`);
    setHistory((h) => [trimmed, ...h]);
    setHistIdx(-1);

    const [cmd, ...args] = trimmed.split(/\s+/);

    if (cmd === "clear") { setLines([]); return; }

    if (cmd === "scan") {
      const host = args[0] || "10.0.0.1";
      const scanLines = SCAN_HOST_LINES(host);
      appendLine("output", `scanning ${host}...`);
      let i = 0;
      const tick = () => {
        if (i >= scanLines.length) return;
        appendLine(i === scanLines.length - 1 ? "success" : "output", scanLines[i]);
        i++;
        setTimeout(tick, 300);
      };
      setTimeout(tick, 400);
      return;
    }

    if (cmd === "deploy") {
      streamLines(DEPLOY_LINES.map((l) => l));
      return;
    }

    const fn = COMMANDS[cmd];
    if (fn) {
      streamLines(fn(args));
    } else {
      appendLine("error", `command not found: ${cmd}  (try "help")`);
    }
  }, [streamLines]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.min(i + 1, history.length - 1);
        setInput(history[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.max(i - 1, -1);
        setInput(next === -1 ? "" : history[next] ?? "");
        return next;
      });
    }
  };

  return { lines, input, setInput, onKeyDown, run, reset: () => setLines([{ type: "output", text: 'type "help" to see available commands.' }]) };
}

export function CliTerminalEmulator() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { lines, input, setInput, onKeyDown, reset } = useTerminal();
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  /* scrollIntoView() walks ancestors and can scroll the whole page; only scroll this panel */
  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <DemoSection
      eyebrow="cli demo"
      heading="Interactive terminal"
      description='Try the commands: type "help" to start, "scan 10.0.0.5" or "deploy" for the full experience.'
      onReset={reset}
    >
      <div
        className={cn(
          "overflow-hidden rounded-2xl",
          isDark ? "border border-border bg-card/80 backdrop-blur" : "border border-border bg-card/80 backdrop-blur-sm shadow-soft"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-accent/80" />
          <span className="h-3 w-3 rounded-full bg-primary/70" />
          <Terminal className="ml-3 h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">brant@nexus:~$</span>
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          className="h-72 overflow-y-auto p-4 font-mono text-xs leading-6"
        >
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.div
                key={line.id ?? line.text}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  line.type === "input"   && "text-primary",
                  line.type === "error"   && "text-destructive",
                  line.type === "success" && (isDark ? "text-accent" : "text-green-600"),
                  line.type === "output"  && "text-foreground/80",
                )}
              >
                {line.text || "\u00a0"}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input row */}
        <div className={cn(
          "flex items-center gap-2 border-t border-border px-4 py-2",
          isDark ? "bg-background/40" : "bg-muted/30"
        )}>
          <span className="font-mono text-xs text-primary shrink-0">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent font-mono text-base md:text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
            placeholder="type a command..."
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </DemoSection>
  );
}
