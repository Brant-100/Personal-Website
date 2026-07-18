import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Mail, Github, Linkedin, Award,
  FolderOpen, Clock, FileText, User,
  Briefcase, Star, Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, RESUME_PDF } from "@/lib/contact";

const SECTION_ANCHORS = [
  { id: "about", label: "Go to About", icon: User },
  { id: "services", label: "Go to Services", icon: Briefcase },
  { id: "projects", label: "Go to Projects", icon: FolderOpen },
  { id: "credentials", label: "Go to Credentials", icon: Star },
  { id: "experience", label: "Go to Experience", icon: Clock },
  { id: "contact", label: "Go to Contact", icon: Mail },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const run = (fn) => {
    fn();
    close();
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL).catch(() => {});
  };

  const itemClass = cn(
    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
    "data-[selected='true']:bg-primary/10 data-[selected='true']:text-primary",
    "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
  );

  const groupHeading = cn(
    "mb-1 px-3 pt-3 font-mono text-[10px] uppercase tracking-[0.25em]",
    "text-primary/60"
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
          />

          <motion.div
            key="palette"
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className={cn(
              "fixed left-1/2 top-[20vh] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl",
              "border border-border bg-card/95 backdrop-blur shadow-neon-cyan"
            )}
          >
            <Command
              label="Command palette"
              className="w-full"
              value={query}
              onValueChange={setQuery}
            >
              <div className={cn(
                "flex items-center gap-3 border-b px-4 py-3",
                "border-border"
              )}>
                <Search className={cn("h-4 w-4 shrink-0", "text-primary")} />
                <Command.Input
                  placeholder="Search commands…"
                  className={cn(
                    "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60",
                    "text-foreground"
                  )}
                  autoFocus
                />
                <kbd className={cn(
                  "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                  "border border-border bg-muted text-muted-foreground"
                )}>
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-80 overflow-y-auto py-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results.
                </Command.Empty>

                <Command.Group heading="">
                  <div className={groupHeading}>Navigate</div>
                  {SECTION_ANCHORS.map(({ id, label, icon: Icon }) => (
                    <Command.Item
                      key={id}
                      value={label}
                      onSelect={() => run(() => scrollTo(id))}
                      className={itemClass}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      {label}
                    </Command.Item>
                  ))}
                  <Command.Item
                    value="Go to Blog"
                    onSelect={() => run(() => navigate("/blog"))}
                    className={itemClass}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    Go to Blog
                  </Command.Item>
                  <Command.Item
                    value="Go to Now"
                    onSelect={() => run(() => navigate("/now"))}
                    className={itemClass}
                  >
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    Go to /now
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="">
                  <div className={groupHeading}>Actions</div>
                  <Command.Item
                    value="Copy email address"
                    onSelect={() => run(copyEmail)}
                    className={itemClass}
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    Copy email address
                  </Command.Item>
                  <Command.Item
                    value="Download resume PDF"
                    onSelect={() => run(() => {
                      const a = document.createElement("a");
                      a.href = RESUME_PDF;
                      a.download = "Brant_Simpson_Resume.pdf";
                      a.click();
                    })}
                    className={itemClass}
                  >
                    <Download className="h-4 w-4 shrink-0 text-primary" />
                    Download resume
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="">
                  <div className={groupHeading}>Links</div>
                  {[
                    { label: "GitHub", href: "https://github.com/Brant-100", icon: Github },
                    { label: "LinkedIn", href: "https://www.linkedin.com/in/brant-simpson-2b5b1b331/", icon: Linkedin },
                    { label: "Credly badges", href: "https://www.credly.com/users/brant-simpson/badges", icon: Award },
                  ].map(({ label, href, icon: Icon }) => (
                    <Command.Item
                      key={href}
                      value={label}
                      onSelect={() => run(() => window.open(href, "_blank", "noreferrer"))}
                      className={itemClass}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="">
                  <div className={groupHeading}>Keyboard shortcuts</div>
                  {[
                    ["g p", "Jump to Projects"],
                    ["g c", "Jump to Contact"],
                    ["g b", "Jump to Blog"],
                    ["⌘K / Ctrl+K", "Open command palette"],
                  ].map(([keys, desc]) => (
                    <div key={keys} className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground">
                      <span>{desc}</span>
                      <kbd className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-[10px]",
                        "border border-border bg-muted"
                      )}>{keys}</kbd>
                    </div>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
