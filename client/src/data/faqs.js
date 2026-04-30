/**
 * FAQ data for the homepage global section and each service page.
 */

export const GLOBAL_FAQS = [
  {
    id: "location",
    question: "Do you work with clients outside the US?",
    answer:
      "US based clients only. My schedule is flexible, but my work is currently limited to US clients.",
  },
  {
    id: "communication",
    question: "How do we communicate during the project?",
    answer:
      "Calls and texts by default. Once we kick off, we'll figure out what works best for you, whether that's a quick weekly check in, text updates, or something else. I'd rather over communicate than let you wonder what's happening.",
  },
  {
    id: "payments",
    question: "How do payments work?",
    answer:
      "Payment is via Zelle. Deposit and milestone splits depend on scope; we agree on what makes sense before work starts. I'm very flexible on payment structure; if you have a preference, we'll talk it through.",
  },
  {
    id: "ownership",
    question: "Do I own the code when it's done?",
    answer:
      "Yes. On final payment, you receive full ownership of everything I build specifically for you. I keep the right to show the finished work in my portfolio.",
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
      "Every project includes 30 days of post launch support for bug fixes (14 days for WordPress). After that, ongoing work is billed hourly and/or a small monthly retainer.",
  },
];

export const WEB_DEV_FAQS = [
  {
    id: "stack",
    question: "What tech stack do you build on?",
    answer:
      "React + Vite + Tailwind by default. For backends I use FastAPI (Python). I deploy on Vercel, but we can discuss what works best for your site. If you have a specific stack requirement, tell me upfront and I'll walk you through whether it's the right fit. I'm always ready to learn new tools and gain new experiences.",
  },
  {
    id: "timeline",
    question: "How long does a typical site take?",
    answer:
      "Small marketing site (3 to 7 pages): 1 to 3 weeks. Medium site with custom features or a CMS: 3 to 6 weeks. Web app with backend and user auth: 6 to 10 weeks. These timelines are development only; add 1 to 2 weeks for discovery, design review, and feedback cycles before we start building. I'll keep you updated if the schedule shifts.",
  },
  {
    id: "design",
    question: "Do I need to provide designs, or do you design too?",
    answer:
      "Either works. If you have Figma files or brand guidelines, I'll build from those. If you don't, I can handle the design as part of the project, but that means I'll come back to you for feedback to make sure you love the design before we move into development.",
  },
  {
    id: "mobile",
    question: "Will my site work on mobile?",
    answer:
      "Yes. Every site I build is mobile-compatible and tested on real phones, not just devtools. This is non-negotiable: over half of web traffic is mobile in 2026.",
  },
  {
    id: "seo",
    question: "Will my site rank on Google?",
    answer:
      "I build your site to load fast and be easy for Google to understand. That gives you the best shot at ranking. But I'm not a marketing strategist. If you need someone to figure out which keywords to target and write the content strategy, that's a separate specialist role.",
  },
  {
    id: "cms",
    question: "Can I edit the content myself after launch?",
    answer:
      "Yes. During 30 days of post-launch support, I'll go in and make small changes and tweaks to your website to get it exactly how you like it. After that, you can edit whatever you want on your site. You can also reach out to me anytime after the 30-day window to discuss changes and what those would cost.",
  },
  {
    id: "analytics",
    question: "Do you set up analytics?",
    answer:
      "We can discuss that in discovery and figure out what works best for your site. Different analytics tools have different tradeoffs, and I'll walk you through the options.",
  },
];

export const UI_UX_FAQS = [
  {
    id: "deliverables",
    question: "What do I actually get?",
    answer:
      "A Figma file with hi-fi mockups for every screen we agreed on, a small component library showing the design tokens I used (colors, spacing, typography), and a handoff walkthrough so you or your developer can actually use what I made. If we discussed light and dark variants, you get those too.",
  },
  {
    id: "revisions",
    question: "How many revision rounds do I get?",
    answer:
      "One round of structured revisions is included. Additional rounds are $100 each. Most projects only need the one because we line up direction during the discovery call before I start designing, so we're not guessing.",
  },
  {
    id: "code",
    question: "Will you also build the site or just design it?",
    answer:
      "Design only by default. If you want the build too, that's my Web Development service and gets its own quote. If you want both, I coordinate the two phases so nothing gets lost in handoff.",
  },
  {
    id: "design-system",
    question: "Can you build a full design system?",
    answer:
      "Yes, but it's a bigger scope than a single-site design project. Design systems get quoted individually based on how many components, states, and platforms you need it to cover.",
  },
  {
    id: "branding",
    question: "Do you do logos or branding?",
    answer:
      "Logo work only as part of a larger design project. I'm not a standalone brand designer. For UI work I can pull together a cohesive visual identity (type, color, spacing, motion) that fits with whatever brand you already have.",
  },
];

export const CUSTOM_SOFTWARE_FAQS = [
  {
    id: "what-counts",
    question: "What counts as 'custom software'?",
    answer:
      "Anything that isn't a public-facing website. APIs, CLIs, automation scripts, internal tools, data pipelines, integrations between SaaS tools you already use. If you find yourself doing the same thing manually more than a few times a week, there's probably a custom software solution for it.",
  },
  {
    id: "languages",
    question: "What languages and frameworks do you use?",
    answer:
      "Python first for backend work: FastAPI for APIs, plain Python or Click for CLIs. JavaScript or TypeScript when the target is Node or a browser extension. Docker for anything that needs to run reliably across different environments. If you have a specific language requirement, tell me upfront and we'll discuss whether it's the right fit.",
  },
  {
    id: "hosting",
    question: "Where will my software run?",
    answer:
      "Whatever makes sense for the project. Railway, Render, or Fly.io for simple apps. DigitalOcean or AWS for more involved setups. On-premise or your own cloud account if you prefer control. I'll lay out the options in the proposal with cost estimates so you can make an informed call.",
  },
  {
    id: "security",
    question: "Is my data secure?",
    answer:
      "Security is built into how I work, not bolted on at the end. Parameterized queries, secrets in environment variables (never in code), input validation at every boundary, HTTPS everywhere, least-privilege access by default. For anything handling sensitive data, I'll walk you through the threat model before we start.",
  },
  {
    id: "maintenance",
    question: "What happens if something breaks after handoff?",
    answer:
      "30 days of bug-fix support is included: if the software doesn't do what we agreed it would, I fix it. After that, reach out anytime and we'll discuss what changes or fixes would cost.",
  },
  {
    id: "integration",
    question: "Can you integrate with Stripe / Slack / Gmail / Airtable / other APIs?",
    answer:
      "Most likely yes: most SaaS tools have well-documented APIs and I've worked with a fair number of them. Tell me the specific tool during discovery and I'll confirm feasibility before we scope it.",
  },
  {
    id: "ai",
    question: "Do you build AI-powered features?",
    answer:
      "Yes, using OpenAI, Anthropic, or open-source models depending on what fits. I'll be straight with you about what AI can and can't do reliably. It's a tool, not magic, and I'd rather talk you out of a feature that won't work well than ship one that disappoints. We'll also talk through the costs that come with AI (API usage, scaling, and what you'll pay over time) before we commit to anything that depends on it.",
  },
];

export const WORDPRESS_FAQS = [
  {
    id: "why-wordpress",
    question: "Why WordPress instead of a custom site?",
    answer:
      "Speed and simplicity. WordPress gets you a professional site faster and for less money than a fully custom build. It's the right call if you need to get online quickly or don't need anything highly custom or interactive. If you need something unique, complex, or built to scale, that's when a custom React build makes more sense. We'll figure out which fits your situation during discovery.",
  },
  {
    id: "themes",
    question: "Do I have to pick a template?",
    answer:
      "No. I start from a clean, modern theme and customize it to match your brand: colors, fonts, layout, the whole thing. You won't end up with something that looks like a stock template. By the time we're done it'll feel like yours.",
  },
  {
    id: "ecommerce",
    question: "Can you add an online store?",
    answer:
      "Yes, via WooCommerce. It works well for most small to medium stores. If you have a large inventory, complex shipping rules, or subscription products, we'll talk through whether WooCommerce is still the right fit or if something else makes more sense.",
  },
  {
    id: "hosting",
    question: "What about hosting?",
    answer:
      "Hosting is handled through me. I set everything up, keep it running, and manage all updates for $50/month. If you want minor tweaks handled anytime without an extra fee, I offer a $75/month plan that covers hosting, maintenance, and small changes on demand. Anything major (new pages, new features, big redesigns) gets its own quote regardless of which plan you're on.",
  },
  {
    id: "editing",
    question: "Can I really edit the site myself?",
    answer:
      "Yes. During the 30-day post-launch support window I'll go in and make small changes and tweaks to get everything exactly how you like it. After that, reach out anytime and we'll discuss what changes would cost, or consider the $75/month plan if you want ongoing tweaks without the extra fees.",
  },
  {
    id: "maintenance",
    question: "Does WordPress need maintenance?",
    answer:
      "It does. WordPress, your theme, and your plugins all push updates regularly and you want to stay current for security reasons. That's all handled through the $50/month hosting plan. If you want minor tweaks covered too, the $75/month plan has you sorted. Either way you're not dealing with it yourself.",
  },
  {
    id: "speed",
    question: "Will my WordPress site be slow?",
    answer:
      "Not if it's built right. I use lightweight themes, optimized images, caching, and a CDN so your site loads fast. I'll show you the Lighthouse scores at handoff so you can see exactly where it stands.",
  },
  {
    id: "migration",
    question: "Can you move my existing site to WordPress?",
    answer:
      "Usually yes. I'll look at what you have, migrate your content and images, rebuild the pages in WordPress, and set up redirects so your SEO doesn't take a hit. How complex the migration is depends on what you're starting from; I'll give you an honest assessment before we scope it.",
  },
];
