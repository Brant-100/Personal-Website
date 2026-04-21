"""Seed data for portfolio projects."""

PROJECTS = [
    {
        "id": "skillswap",
        "title": "SkillSwap",
        "tagline": "Student talent exchange — peer-to-peer learning sessions in a safe, structured platform.",
        "description": (
            "SkillSwap is a comprehensive peer-to-peer learning web platform that helps "
            "students share skills and book learning sessions in a safe, structured environment. "
            "It addresses expensive traditional tutoring and the difficulty of finding "
            "like-minded peers on campus."
        ),
        "features": [
            "Peer learning: students offer specific skills and book sessions with each other",
            "AI resume scanner for instant skill extraction, skill matcher for learning paths, and session idea generator",
            "5-star rating and review system for community trust and quality",
            "Gamification: badges, points, and tracked learning streaks",
        ],
        "tech": [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Next.js API routes",
            "Prisma ORM",
            "PostgreSQL",
            "NextAuth.js",
            "Google OAuth",
            "GitHub OAuth",
            "OpenAI API (GPT-5-nano)",
        ],
        "tags": ["edtech", "peer-learning", "ai", "full-stack"],
        "status": "public",
        "year": "2025",
        "repo_url": None,
        "live_url": None,
        "accent_theme": "skillswap",
    },
    {
        "id": "healthhive",
        "title": "HealthHive",
        "tagline": "Team-centric wellness tracker — group accountability inspired by the hive.",
        "description": (
            "HealthHive is a team-focused wellness application that turns individual health "
            "into a collaborative journey. Inspired by how bees work together, the platform "
            "helps groups build habits, stay motivated, and see progress over time."
        ),
        "features": [
            "Activity tracking: log and monitor physical activities and health data",
            "Team collaboration: manage groups and track wellness together",
            "Custom wellness reminders (hydration, exercise, and more)",
            "Progress analytics with visual trends and team performance insights",
        ],
        "tech": [
            "Django 5.1.4",
            "MVT architecture",
            "HTML5",
            "CSS3",
            "JavaScript",
            "SQLite",
            "Agile",
            "Trello",
        ],
        "tags": ["wellness", "django", "teams", "analytics"],
        "status": "public",
        "year": "2025",
        "repo_url": None,
        "live_url": None,
        "accent_theme": "healthhive",
    },
    {
        "id": "network-scanner",
        "title": "Network Scanner",
        "tagline": "Multithreaded Python recon toolkit — host discovery, port scanning, banner grabs.",
        "description": (
            "TCP network scanner for the reconnaissance phase. Host discovery via "
            "CIDR ping sweep, multithreaded TCP connect port scanning, service "
            "banner grabbing, and text/JSON reporting — all wrapped behind a clean "
            "argparse CLI."
        ),
        "features": [],
        "tech": ["Python", "asyncio", "sockets", "argparse", "pytest"],
        "tags": ["offensive-security", "recon", "cli"],
        "status": "public",
        "year": "2025",
        "repo_url": "https://github.com/Brant-100/Personal-Website/tree/main/projects/network-scanner",
        "live_url": None,
        "accent_theme": "cyber",
    },
    {
        "id": "project-nexus",
        "title": "Project Nexus",
        "tagline": "Custom C2 framework for offensive operations.",
        "description": (
            "A modular command-and-control framework built for red-team engagements. "
            "Encrypted implant comms (AES-GCM), an operator dashboard, and a "
            "containerized deployment pipeline for fast, reproducible infra."
        ),
        "features": [],
        "tech": ["Python", "FastAPI", "Docker", "AES-GCM"],
        "tags": ["offensive-security", "infrastructure", "red-team"],
        "status": "private",
        "year": "2026",
        "repo_url": None,
        "live_url": None,
        "accent_theme": "cyber",
    },
]
