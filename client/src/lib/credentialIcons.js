import {
  ShieldCheck,
  Award,
  Network,
  Globe,
  BadgeCheck,
  Cloud,
  Code2,
  BookOpen,
  Sparkles,
  Lightbulb,
} from "lucide-react";

/** Category → Lucide icon (credentials vault + detail page). */
export const CREDENTIAL_ICON_MAP = {
  security: ShieldCheck,
  management: Award,
  network: Network,
  web: Globe,
  cybersecurity: ShieldCheck,
  development: Code2,
  ai: Sparkles,
  cloud: Cloud,
  foundations: Lightbulb,
  literacy: BookOpen,
  default: BadgeCheck,
};
