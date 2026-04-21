"""Seed data for portfolio projects."""

PROJECTS = [
    {
        "id": "project-nexus",
        "title": "Project Nexus",
        "tagline": "Custom C2 framework for offensive operations.",
        "description": (
            "A modular command-and-control framework built for red-team engagements. "
            "Encrypted implant comms (AES-GCM), an operator dashboard, and a "
            "containerized deployment pipeline for fast, reproducible infra."
        ),
        "tech": ["Python", "FastAPI", "Docker", "AES-GCM"],
        "tags": ["offensive-security", "infrastructure", "red-team"],
        "status": "private",
        "year": "2026",
        "repo_url": None,
        "live_url": None,
    },
]
