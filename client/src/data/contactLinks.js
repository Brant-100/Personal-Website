import {
  Mail,
  Github,
  Linkedin,
  Award,
} from "lucide-react";
import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";

/**
 * Public profiles on the homepage Contact block and About page.
 *
 * `brandKey` (optional): full-color Simple Icons–style mark; omit `icon` for those rows.
 * Otherwise use a lucide `icon` and optionally `tile` for light-mode gradients.
 */

export const CONTACT_LINKS = [
  {
    id: "email",
    label: "Email",
    handle: CONTACT_EMAIL,
    href: CONTACT_HREF,
    icon: Mail,
    darkColor: "text-primary",
    lightBg: "bg-primary",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "@Brant-100",
    href: "https://github.com/Brant-100",
    icon: Github,
    darkColor: "text-accent",
    lightBg: "bg-foreground",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "brant-simpson",
    href: "https://www.linkedin.com/in/brant-simpson-2b5b1b331/",
    icon: Linkedin,
    darkColor: "text-secondary",
    lightBg: "bg-secondary",
  },
  {
    id: "credly",
    label: "Credly",
    handle: "brant-simpson",
    href: "https://www.credly.com/users/brant-simpson/badges",
    icon: Award,
    darkColor: "text-pop-pink",
    lightBg: "bg-accent",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@username",
    href: "https://www.instagram.com/",
    brandKey: "instagram",
    darkColor: "text-accent",
    tile: "instagram",
  },
  {
    id: "discord",
    label: "Discord",
    handle: "Invite or username",
    href: "https://discord.com/",
    brandKey: "discord",
    darkColor: "text-secondary",
    tile: "discord",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    handle: "@username",
    href: "https://www.snapchat.com/",
    brandKey: "snapchat",
    darkColor: "text-muted-foreground",
    tile: "snapchat",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Profile name",
    href: "https://www.facebook.com/",
    brandKey: "facebook",
    darkColor: "text-primary",
    tile: "facebook",
  },
];
