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
        "tech": ["Python", "asyncio", "sockets", "argparse", "pytest"],
        "tags": ["offensive-security", "recon", "cli"],
        "status": "public",
        "year": "2025",
        "repo_url": "https://github.com/Brant-100/Personal-Website/tree/main/projects/network-scanner",
        "live_url": None,
    },
]
