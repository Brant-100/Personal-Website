/**
 * FAQ data for the homepage global section and each service page.
 *
 * Items flagged `needs_review: true` have draft answers and should be
 * replaced with Brant's real voice in a follow-up pass.
 *
 * In dev mode you can surface unfinalised answers with:
 *   {faq.needs_review && import.meta.env.DEV && <span>[review]</span>}
 */

export const GLOBAL_FAQS = [
  {
    id: "location",
    question: "Do you work with clients outside the US?",
    answer:
      "US-based clients only. My schedule is flexible, but my work is currently limited to US clients by choice.",
  },
  {
    id: "age",
    question: "I see you're young — can I trust you with my project?",
    answer:
      "Fair question. I'm 17, and I know that's unusual for a freelancer. What it also means: I have time to obsess over your project, I'm hungry to do great work, and my portfolio is evidence that I can actually deliver. Judge me on the work — check my projects, read the code on GitHub, try the live demos. If the work holds up, the age shouldn't matter.",
  },
  {
    id: "schedule",
    question: "What happens if you get busy with school or have scheduling conflicts?",
    answer:
      "Before any project starts, I give you a realistic timeline based on my actual availability. If something comes up that could affect the schedule, you'll hear about it from me the same day — not the day a milestone slips. I plan buffer into every project so small delays don't cascade.",
  },
  {
    id: "communication",
    question: "How do we communicate during the project?",
    answer:
      "Calls and texts by default. Once we kick off, we'll figure out what cadence works best for you — whether that's a quick weekly check-in, async text updates, or something else. I'd rather over-communicate than let you wonder what's happening.",
  },
  {
    id: "payments",
    question: "How do payments work?",
    answer:
      "Stripe invoice as the default (credit card, ACH, also accepts most digital wallets) or Zelle for smaller jobs. For projects under $500, full payment upfront. $500–$2,000: 50% deposit to start, 50% on delivery. Over $2,000: 50% deposit, 25% at midpoint, 25% on final delivery. Everything gets a proper invoice for your records.",
  },
  {
    id: "ownership",
    question: "Do I own the code when it's done?",
    answer:
      "Yes. On final payment, you receive full ownership of everything I build specifically for you — source code, design files, credentials, and deployment access. The only thing I keep is the right to show the finished work in my portfolio (unless we've agreed otherwise in writing).",
  },
  {
    id: "existing-code",
    question: "Can you work with my existing codebase or only new builds?",
    answer:
      "Both. I'll look at your existing project, get a feel for its conventions, and either add features or rebuild pieces as needed. If a codebase is in rough shape I'll tell you up front what I think the right fix is and we can decide together.",
  },
  {
    id: "support",
    question: "What happens after launch?",
    answer:
      "Every project includes 30 days of post-launch support for bug fixes (14 days for WordPress). After that, ongoing work is billed hourly or as a small monthly retainer if you want a predictable arrangement. You're never locked in.",
  },
  {
    id: "contract",
    question: "Do we sign a contract?",
    answer:
      "Yes. Every project gets a simple written agreement covering scope, timeline, deliverables, payment terms, and IP transfer. It protects both of us and keeps expectations clear. Usually one or two pages.",
  },
  {
    id: "clearance",
    question: "You mention a security track — does that affect how you work with clients?",
    answer:
      "Only in that I keep my work to US clients and maintain clean professional boundaries. For web and software work, you get a normal freelance engagement with normal deliverables.",
  },
];

export const WEB_DEV_FAQS = [
  {
    id: "stack",
    question: "What tech stack do you build on?",
    answer:
      "React + Vite + Tailwind + Framer Motion by default. For backends I use FastAPI (Python) or Node/Express depending on what the project needs. Deployed on Vercel or Netlify. If you have a specific stack requirement, tell me up front and I'll let you know honestly if I can match it.",
    needs_review: true,
  },
  {
    id: "timeline",
    question: "How long does a typical site take?",
    answer:
      "Small marketing site (3–7 pages): 1–3 weeks. Medium site with custom features or a CMS: 3–6 weeks. Web app with backend and user auth: 6–10 weeks. Every project gets a realistic timeline in the proposal before we start, based on your actual scope.",
    needs_review: true,
  },
  {
    id: "design",
    question: "Do I need to provide designs, or do you design too?",
    answer:
      "Either works. If you have Figma files or brand guidelines, I'll build from those. If you don't, I can handle the design as part of the project. Whatever makes the end result best.",
    needs_review: true,
  },
  {
    id: "mobile",
    question: "Will my site work on mobile?",
    answer:
      "Always. Every site I build is mobile-first and tested on real phones, not just devtools. This is non-negotiable — over half of web traffic is mobile in 2026.",
    needs_review: true,
  },
  {
    id: "seo",
    question: "Will my site rank on Google?",
    answer:
      "I build with technical SEO in mind — fast load times, semantic HTML, meta tags, Open Graph, sitemap.xml, structured data. What I don't do is keyword research or ongoing content strategy — that's a specialist job.",
    needs_review: true,
  },
  {
    id: "cms",
    question: "Can I edit the content myself after launch?",
    answer:
      "Yes — we'll talk about what you want to be able to edit during discovery. For content-heavy sites I usually recommend either a headless CMS (Sanity, Contentful) or a hand-rolled admin panel if it's small.",
    needs_review: true,
  },
  {
    id: "analytics",
    question: "Do you set up analytics?",
    answer:
      "I install privacy-friendly analytics (Plausible or Umami) by default — no cookie banner required. If you want Google Analytics specifically, I'll set that up too, with the consent banner it requires.",
    needs_review: true,
  },
];

export const UI_UX_FAQS = [
  {
    id: "deliverables",
    question: "What do I actually get?",
    answer:
      "A Figma file with hi-fi mockups for every screen we scoped, a small component library with the design tokens I used (colors, spacing, typography), light and dark variants if we discussed them, and a handoff walkthrough so you or your developer can actually use what I made.",
    needs_review: true,
  },
  {
    id: "revisions",
    question: "How many revision rounds do I get?",
    answer:
      "One round of structured revisions is included. Additional rounds are $100 each. Most projects only need the included round because we align on direction during the discovery session up front.",
    needs_review: true,
  },
  {
    id: "code",
    question: "Will you also build the site or just design it?",
    answer:
      "Design only by default. If you want the build too, that's a separate service and gets its own quote. Clients frequently hire me for both and I coordinate the two phases so nothing gets lost in handoff.",
    needs_review: true,
  },
  {
    id: "design-system",
    question: "Can you build a full design system?",
    answer:
      "Yes, but it's a larger scope than a single-site design project. Design systems get quoted individually based on the number of components, states, platforms, and documentation you need.",
    needs_review: true,
  },
  {
    id: "branding",
    question: "Do you do logos or branding?",
    answer:
      "Logo work only as part of a larger design engagement — I'm not a standalone brand designer. For UI work I can create a cohesive visual identity (type, color, spacing, motion) that fits with your existing brand.",
    needs_review: true,
  },
];

export const CUSTOM_SOFTWARE_FAQS = [
  {
    id: "what-counts",
    question: "What counts as 'custom software'?",
    answer:
      "Anything that isn't a public-facing website. APIs, CLIs, automation scripts, internal tools, data pipelines, integrations between two SaaS tools you already use. If you find yourself doing the same thing manually more than a few times a week, there's probably a custom-software solution for it.",
    needs_review: true,
  },
  {
    id: "languages",
    question: "What languages and frameworks do you use?",
    answer:
      "Python-first for backend work — FastAPI for APIs, plain Python or Click for CLIs. JavaScript/TypeScript when the target is Node or a browser extension. Docker for anything that needs to run reliably on different machines.",
    needs_review: true,
  },
  {
    id: "hosting",
    question: "Where will my software run?",
    answer:
      "Whatever makes sense for the project. Railway, Render, or Fly.io for simple apps. DigitalOcean or AWS for more involved setups. On-premise or your own cloud account if you prefer control. I'll lay out options in the proposal with cost estimates.",
    needs_review: true,
  },
  {
    id: "security",
    question: "Is my data secure?",
    answer:
      "Security is part of how I build, not a bolt-on. Parameterized queries, secrets in environment variables (never in code), input validation at every boundary, HTTPS everywhere, least-privilege access by default. For anything handling sensitive data I'll walk you through the threat model before we start.",
    needs_review: true,
  },
  {
    id: "maintenance",
    question: "What happens if something breaks after handoff?",
    answer:
      "30 days of bug-fix support is included — if the software doesn't do what we agreed it would, I fix it. After that, ongoing work is hourly or on a small retainer.",
    needs_review: true,
  },
  {
    id: "integration",
    question: "Can you integrate with Stripe / Slack / Gmail / Airtable / other APIs?",
    answer:
      "Most likely yes — most SaaS tools have well-documented APIs and I've worked with quite a few. Tell me the specific tool during discovery and I'll confirm feasibility before we scope it.",
    needs_review: true,
  },
  {
    id: "ai",
    question: "Do you build AI-powered features?",
    answer:
      "Yes, using OpenAI, Anthropic, or open-source models depending on what fits. I'll be direct about what AI can and can't do reliably — it's a tool, not magic, and I'd rather talk you out of an AI feature that won't work well than ship you one that disappoints.",
    needs_review: true,
  },
];

export const WORDPRESS_FAQS = [
  {
    id: "why-wordpress",
    question: "Why WordPress instead of a custom site?",
    answer:
      "Speed and editability. WordPress is cheaper, faster to launch, and lets you edit content yourself without touching code. Best for small businesses, blogs, marketing sites, and anyone who wants to get online quickly. If you need something unique or highly interactive, a custom React build is a better fit.",
    needs_review: true,
  },
  {
    id: "themes",
    question: "Do I have to pick a template?",
    answer:
      "I start from a clean, modern theme (usually Kadence, Blocksy, or GeneratePress) and customize it to match your brand. You're not stuck with a stock template look — we tune colors, fonts, spacing, and layout until it feels like yours.",
    needs_review: true,
  },
  {
    id: "ecommerce",
    question: "Can you add an online store?",
    answer:
      "Yes, via WooCommerce. Small stores (under ~50 products) fit well with the WordPress tier. Larger stores or stores with complex inventory, subscriptions, or custom checkout flows are quoted separately.",
    needs_review: true,
  },
  {
    id: "hosting",
    question: "What about hosting?",
    answer:
      "I'll recommend a host that fits your budget and traffic — SiteGround, Bluehost, or Cloudways for most small business sites. Hosting costs are yours (typically $5–$20/month). I set up the site on your host so you own the relationship.",
    needs_review: true,
  },
  {
    id: "editing",
    question: "Can I really edit the site myself?",
    answer:
      "Yes — that's WordPress's whole point. I'll give you a walkthrough of the admin panel, show you how to edit pages, upload images, and add posts. If you get stuck later, I can jump in on an hourly basis.",
    needs_review: true,
  },
  {
    id: "maintenance",
    question: "Does WordPress need maintenance?",
    answer:
      "Yes — updates to WordPress itself, themes, and plugins should be applied regularly to keep the site secure. I offer a small monthly maintenance retainer ($50–$100/mo) covering updates, backups, security monitoring, and minor edits.",
    needs_review: true,
  },
  {
    id: "speed",
    question: "Will my WordPress site be slow?",
    answer:
      "No — when built correctly, WordPress can be fast. I use lightweight themes, image optimization, caching, and a CDN. I'll show you the Lighthouse scores at handoff.",
    needs_review: true,
  },
  {
    id: "migration",
    question: "Can you move my existing site to WordPress?",
    answer:
      "Usually yes. I'll audit your current site, migrate content and images, rebuild pages in WordPress, and set up redirects so your SEO doesn't break. Migration complexity depends on the source — I'll quote it after reviewing what you have.",
    needs_review: true,
  },
];
