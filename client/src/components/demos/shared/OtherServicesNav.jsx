import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Palette, Cpu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const ALL_SERVICES = [
  {
    id: "web",
    label: "Web Development",
    description: "Fast, accessible, beautifully animated sites and apps.",
    href: "/services/web-development",
    Icon: Code2,
  },
  {
    id: "uiux",
    label: "UI / UX Design",
    description: "Bold typography, accessible color, scalable design systems.",
    href: "/services/ui-ux-design",
    Icon: Palette,
  },
  {
    id: "software",
    label: "Custom Software",
    description: "APIs, automations, CLIs, and internal tools that get the job done.",
    href: "/services/custom-software-solutions",
    Icon: Cpu,
  },
];

export function OtherServicesNav({ current }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const others = ALL_SERVICES.filter((s) => s.id !== current);

  return (
    <div className="mt-16">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">also offering</div>
        <h2 className="text-2xl font-bold">Other services</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {others.map((svc, i) => {
          const Icon = svc.Icon;
          return (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 160, damping: 20 }}
            >
              <Link
                to={svc.href}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border p-5 transition-all",
                  isDark
                    ? "border-border bg-card/60 hover:border-primary/50 hover:shadow-neon-cyan hover:bg-primary/5"
                    : "border-2 border-foreground bg-card shadow-pop hover:translate-y-[-2px]"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isDark
                    ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "bg-foreground text-background"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{svc.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{svc.description}</div>
                </div>
                <ArrowRight className={cn(
                  "mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1",
                  "text-muted-foreground"
                )} />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
