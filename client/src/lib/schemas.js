import { z } from "zod";

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  service: z.enum([
    "web-development",
    "ui-ux-design",
    "custom-software",
    "wordpress",
    "other",
    "general",
  ]),
  budget: z
    .enum(["under-500", "500-1500", "1500-3500", "3500-plus", "not-sure"])
    .optional()
    .or(z.literal("")),
  timeline: z
    .enum(["asap", "1-month", "1-3-months", "flexible", "just-exploring"])
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Give me a little more detail: what are you building?")
    .max(2000, "Message is too long. Send the rest over email if needed."),
  website: z.string().max(0).optional(),
  turnstileToken: z.string().min(1, "Please complete the verification"),
});

export const inquiryServiceLabels = {
  "web-development": "Web Development",
  "ui-ux-design": "UI / UX Design",
  "custom-software": "Custom Software",
  wordpress: "WordPress Site",
  other: "Something else",
  general: "General question",
};

export const budgetLabels = {
  "under-500": "Under $500",
  "500-1500": "$500 to $1,500",
  "1500-3500": "$1,500 to $3,500",
  "3500-plus": "$3,500+",
  "not-sure": "Not sure yet",
};

export const timelineLabels = {
  asap: "ASAP",
  "1-month": "Within 1 month",
  "1-3-months": "1 to 3 months out",
  flexible: "Flexible",
  "just-exploring": "Just exploring",
};
