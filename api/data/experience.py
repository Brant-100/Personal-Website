"""Experience timeline entries (most recent first).

NOTE: Items marked [PLACEHOLDER] need real outcomes filled in.
See AFTER_ACTION_REPORT.md for instructions.
"""

EXPERIENCE = [
    {
        "id": "bpa-web-team",
        "title": "Web Application Team Member",
        "org": "Business Professionals of America (BPA)",
        "period": "2025 to present",
        "summary": (
            "Shipped Health Hive as our Business Professionals of America competitive web application "
            "entry: a Django based team wellness platform where groups log activities, collaborate on "
            "goals, and stay accountable with reminders and progress analytics. Contributed across "
            "templates and UX polish, coordinated delivery through Agile sprints, and integrated features "
            "with the team's data model and workflows."
        ),
        "tags": ["django", "ux", "teamwork", "competition"],
    },
    {
        "id": "nexus-saas",
        "title": "Sole Developer — Project Nexus",
        "org": "Independent",
        "period": "2026",
        "summary": (
            "Designed and built Project Nexus from scratch as a self directed SaaS project: "
            "a modular command and control framework with a FastAPI operator server, AES-GCM "
            "encrypted implant comms, and a tamper evident JSONL audit log. Every component — "
            "crypto, beacon scheduling, task queue, sandbox detection — was built without "
            "off the shelf C2 frameworks to ensure full understanding of the stack."
        ),
        "tags": ["python", "fastapi", "security", "solo"],
    },
    {
        "id": "bpa-skillswap",
        "title": "Web Application Team Member — SkillSwap",
        "org": "Business Professionals of America (BPA)",
        "period": "2026",
        "summary": (
            "Co developed SkillSwap as a BPA competitive web application entry: a peer to peer "
            "learning platform where students offer skills, book sessions, and earn trust through "
            "ratings and community reviews. Built on Next.js 15, React 19, TypeScript, Prisma, "
            "and PostgreSQL with Google and GitHub OAuth via NextAuth.js. Integrated an OpenAI layer "
            "for resume based skill extraction and session recommendations, designed to degrade "
            "gracefully when the API is unavailable. Contributed to full stack feature development "
            "and collaborated through Agile sprints to deliver a polished, mobile first product "
            "under competition deadlines."
        ),
        "tags": ["next.js", "full-stack", "ai", "competition"],
    },
]
