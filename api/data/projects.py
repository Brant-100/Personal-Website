"""Seed data for portfolio projects.

sort_order controls display order on the frontend (1 = first).
mitre_techniques uses ATT&CK technique IDs (e.g. T1059.001).
"""

PROJECTS = [
    # ------------------------------------------------------------------ #
    # 1. Project Nexus (centerpiece, private C2 framework)                #
    # ------------------------------------------------------------------ #
    {
        "id": "project-nexus",
        "sort_order": 1,
        "title": "Project Nexus",
        "tagline": "Custom C2 framework built from scratch. Every component explainable under pressure.",
        "description": (
            "A modular, full-stack command-and-control framework built deliberately without "
            "off-the-shelf frameworks (no Cobalt Strike, no Metasploit) so every layer can be "
            "explained, modified, and defended against. AES-GCM encrypted implant comms, "
            "WAL-mode SQLite with a JSONL hash chain for operator logs, containerized deployment, "
            "and 18 MITRE ATT&CK techniques mapped across 17 task handlers."
        ),
        "problem": (
            "Existing C2 frameworks abstract away the details that matter most for learning: "
            "encryption negotiation, beacon scheduling, sandbox detection, OPSEC-conscious "
            "staging. The goal was to build one where I could stand in front of any component "
            "and answer 'why does this work this way?'"
        ),
        "constraints": [
            "No existing C2 frameworks: build from primitive socket and crypto operations",
            "Operator-safe logging: append-only JSONL hash chain, no plaintext secrets on disk",
            "Portable: single Docker Compose up from a clean host",
            "All techniques explicitly mapped to MITRE ATT&CK before implementation",
        ],
        "features": [
            "FastAPI operator server with JWT-authenticated REST interface",
            "WAL-mode SQLite persistence + append-only JSONL hash chain for log integrity",
            "AES-GCM implant communications (per-session key negotiation)",
            "Jittered beacon intervals with proxy-aware transport",
            "Sandbox detection heuristics (timing, environment, artifact checks)",
            "Priority task queue with configurable concurrency",
            "Rate limiting and per-implant session tracking",
            "17 task handlers covering execution, persistence, enumeration, exfiltration",
            "18 MITRE ATT&CK techniques mapped across the kill chain",
            "GitHub Actions CI pipeline (lint + test on every push)",
            "Containerized deployment via Docker Compose",
        ],
        "tech": ["Python", "FastAPI", "SQLite (WAL)", "AES-GCM", "Docker", "JWT", "pytest", "GitHub Actions"],
        "tags": ["offensive-cyber", "infrastructure", "red-team", "python"],
        "status": "private",
        "year": "2026",
        "last_updated": "April 2026",
        "accent_theme": "cyber",
        "repo_url": None,
        "live_url": None,
        "architecture_diagram_url": "/projects/project-nexus/architecture.svg",
        "screenshots": [
            {"url": "/projects/project-nexus/screenshot-1.svg", "caption": "Operator console, active session view"},
        ],
        "demo_video_url": None,
        "mitre_techniques": [
            "T1059.001",  # PowerShell
            "T1071.001",  # Web Protocols (C2 comms)
            "T1132.001",  # Standard Encoding
            "T1573.001",  # Symmetric Cryptography (AES-GCM)
            "T1027",      # Obfuscated Files / Encoding
            "T1082",      # System Information Discovery
            "T1083",      # File and Directory Discovery
            "T1057",      # Process Discovery
            "T1016",      # System Network Configuration Discovery
            "T1033",      # System Owner / User Discovery
            "T1105",      # Ingress Tool Transfer
            "T1041",      # Exfiltration Over C2 Channel
            "T1070.004",  # File Deletion
            "T1053.005",  # Scheduled Task
            "T1547.001",  # Registry Run Keys / Startup Folder
            "T1036",      # Masquerading
            "T1497",      # Virtualization / Sandbox Evasion
            "T1055",      # Process Injection (planned)
        ],
        "visibility_note": "Source private for OPSEC; full technical walkthrough available on request.",
        "technical_decisions": [
            {
                "decision": "AES-GCM for implant comms instead of TLS",
                "why": "Gives full control over the handshake, key derivation, and IV management without relying on the OS TLS stack, which many EDRs hook.",
                "tradeoffs": "More implementation surface to audit; no free certificate validation.",
            },
            {
                "decision": "WAL-mode SQLite + JSONL hash chain",
                "why": "WAL gives concurrent read performance for the operator dashboard. The hash chain means any tampered log entry is detectable.",
                "tradeoffs": "More complex recovery path than a plain SQLite journal; JSONL files grow unbounded without rotation.",
            },
            {
                "decision": "FastAPI over Flask for the operator server",
                "why": "Auto-generated OpenAPI docs for the operator API, async request handling, and Pydantic validation on every route make the server easier to reason about.",
                "tradeoffs": "Heavier dependency tree than Flask; async context requires discipline to avoid blocking the event loop.",
            },
        ],
        "lessons_learned": [
            "Beacon jitter matters far more than sleep duration for evading time-based detections.",
            "Sandbox detection via timing is unreliable on modern hypervisors; artifact-based checks are more durable.",
            "Operator UX (clear session state, typed commands, error messages) is as important as implant capability.",
        ],
        "roadmap": [
            "Process injection module (T1055)",
            "Encrypted key/value store for implant config",
            "Web-based operator dashboard (React front-end)",
            "Dedicated nexus.brantsimpson.com site when phase 2 ships",
        ],
    },

    # ------------------------------------------------------------------ #
    # 2. Network Scanner (multithreaded Python recon toolkit)            #
    # ------------------------------------------------------------------ #
    {
        "id": "network-scanner",
        "sort_order": 2,
        "title": "Network Scanner",
        "tagline": "Multithreaded Python recon toolkit: host discovery, port scan, banner grabs.",
        "description": (
            "TCP network scanner for the reconnaissance phase. Host discovery via "
            "CIDR ping sweep, multithreaded TCP connect port scanning, service "
            "banner grabbing, and text/JSON reporting, all wrapped behind a clean "
            "argparse CLI. Built to understand every layer of the recon pipeline, "
            "not to wrap nmap."
        ),
        "problem": (
            "Most recon tools are black boxes. Building one from raw sockets forced "
            "a deep understanding of TCP connect semantics, threading models, timeout "
            "behavior, and the structure of service banners, all directly applicable "
            "to understanding what defenders see."
        ),
        "constraints": [
            "Standard library only (no scapy, no nmap bindings)",
            "Must handle /16 CIDR ranges without exhausting thread count",
            "Output compatible with both human-readable text and JSON ingestion",
            "Full pytest coverage for core scan logic",
        ],
        "features": [
            "CIDR ping sweep for host discovery (system ping, cross-platform)",
            "Multithreaded TCP connect port scanning with configurable thread pool",
            "Service banner grabbing with per-port timeout",
            "Text and JSON report output (--json flag)",
            "argparse CLI with discover / scan / banner subcommands",
            "pytest test suite: closed port, open port, sorted results, empty input",
        ],
        "tech": ["Python", "socket", "threading", "argparse", "subprocess", "pytest"],
        "tags": ["recon", "cli", "python", "networking"],
        "status": "public",
        "year": "2026",
        "last_updated": "April 2026",
        "accent_theme": "cyber",
        "repo_url": "https://github.com/Brant-100/Personal-Website/tree/main/projects/network-scanner",
        "live_url": None,
        "architecture_diagram_url": "/projects/network-scanner/architecture.svg",
        "screenshots": [
            {"url": "/projects/network-scanner/screenshot-1.svg", "caption": "CLI scan output, port scan with banner grabs"},
        ],
        "demo_video_url": None,
        "mitre_techniques": [
            "T1046",   # Network Service Scanning
            "T1595.001",  # Active Scanning: Scanning IP Blocks
        ],
        "visibility_note": None,
        "technical_decisions": [
            {
                "decision": "threading.ThreadPoolExecutor over asyncio",
                "why": "TCP connect scans are I/O-bound but also block on the OS connect() call. A thread pool maps naturally to this pattern and avoids asyncio's complexity for a CLI tool.",
                "tradeoffs": "Higher memory overhead per worker than async tasks; GIL is not a bottleneck here since the work is I/O-bound.",
            },
            {
                "decision": "System ping for host discovery instead of raw ICMP",
                "why": "Raw ICMP requires elevated privileges on most OSes. Shelling out to ping works for authorized recon on a LAN without requiring root.",
                "tradeoffs": "Slower than raw ICMP; behavior differs between Windows and Linux ping flags.",
            },
        ],
        "lessons_learned": [
            "TCP connect scan latency is dominated by refused connections, not accepted ones; set timeouts aggressively.",
            "Banner grabbing requires per-protocol delays; SSH sends a banner immediately, HTTP needs a probe first.",
            "Writing tests before refactoring the thread pool caught two race conditions in result ordering.",
        ],
        "roadmap": [
            "Extract to standalone Brant-100/network-scanner repo",
            "Add UDP probe support",
            "OS fingerprinting via TTL and window size heuristics",
            "CI badge once extracted",
        ],
    },

    # ------------------------------------------------------------------ #
    # 3. SkillSwap (peer-to-peer learning platform)                      #
    # ------------------------------------------------------------------ #
    {
        "id": "skillswap",
        "sort_order": 3,
        "title": "SkillSwap",
        "tagline": "Student talent exchange and peer-to-peer learning in a structured platform.",
        "description": (
            "Peer-to-peer learning web platform for sharing skills and booking sessions safely. "
            "Addresses expensive traditional tutoring and the difficulty of finding "
            "like-minded peers on campus."
        ),
        "problem": (
            "Campus tutoring is expensive and one-directional. SkillSwap turns every student "
            "into both a teacher and a learner, with an AI layer that matches skills and "
            "surfaces session ideas from resume data."
        ),
        "constraints": [
            "OAuth-only auth (no passwords stored) for safety on a student platform",
            "AI features must degrade gracefully when the OpenAI API is unavailable",
            "Mobile-first layout for students on phones between classes",
        ],
        "features": [
            "Peer learning: students offer specific skills and book sessions with each other",
            "AI resume scanner for instant skill extraction",
            "Skill matcher and session idea generator via OpenAI",
            "5-star rating and review system for community trust",
            "Gamification: badges, points, and tracked learning streaks",
        ],
        "tech": ["Next.js 15", "React 19", "TypeScript", "Prisma", "PostgreSQL", "NextAuth.js", "Google OAuth", "GitHub OAuth", "OpenAI"],
        "tags": ["edtech", "ai", "full-stack", "web"],
        "status": "public",
        "year": "2026",
        "last_updated": "April 2026",
        "accent_theme": "skillswap",
        "repo_url": None,
        "live_url": None,
        "architecture_diagram_url": "/projects/skillswap/architecture.svg",
        "screenshots": [
            {"url": "/projects/skillswap/screenshot-1.svg", "caption": "Session booking flow, skill match view"},
        ],
        "demo_video_url": None,
        "mitre_techniques": [],
        "visibility_note": None,
        "technical_decisions": [
            {
                "decision": "Prisma ORM over raw SQL",
                "why": "Type-safe queries eliminate an entire class of runtime errors in the booking and session data models.",
                "tradeoffs": "Prisma's migration tooling adds friction for rapid schema iteration.",
            },
        ],
        "lessons_learned": [
            "AI feature graceful degradation needs to be designed in from day one, not retrofitted.",
            "Gamification points need a reset/decay mechanism or engagement collapses after initial novelty.",
        ],
        "roadmap": [
            "Video session integration (Whereby / Daily.co embed)",
            "Verified skill badges via quiz flow",
            "Mobile app wrapper (React Native)",
        ],
    },

    # ------------------------------------------------------------------ #
    # 4. HealthHive (team wellness tracker)                              #
    # ------------------------------------------------------------------ #
    {
        "id": "healthhive",
        "sort_order": 4,
        "title": "HealthHive",
        "tagline": "Team wellness tracker with group accountability inspired by the hive.",
        "description": (
            "Team-centric wellness application that turns individual health tracking "
            "into a collaborative journey. Inspired by how bees work together, the platform "
            "helps groups build habits, stay motivated, and see progress over time."
        ),
        "problem": (
            "Individual wellness apps have high drop-off rates because they rely solely on "
            "self-motivation. Team accountability significantly improves habit retention; "
            "HealthHive makes the group's progress visible to every member."
        ),
        "constraints": [
            "Django MVT architecture: no separate frontend SPA to keep deployment simple",
            "SQLite for portability (school server constraints)",
            "Agile sprint structure for team collaboration with Trello",
        ],
        "features": [
            "Activity tracking: log and monitor physical activities and health data",
            "Team collaboration: manage groups and track wellness together",
            "Custom wellness reminders (hydration, exercise, and more)",
            "Progress analytics with visual trends and team performance insights",
        ],
        "tech": ["Django 5.1", "HTML5", "CSS3", "JavaScript", "SQLite", "Agile", "Trello"],
        "tags": ["wellness", "django", "teams", "web"],
        "status": "public",
        "year": "2025",
        "last_updated": "2025",
        "accent_theme": "healthhive",
        "repo_url": None,
        "live_url": None,
        "architecture_diagram_url": "/projects/healthhive/architecture.svg",
        "screenshots": [
            {"url": "/projects/healthhive/screenshot-1.svg", "caption": "Team dashboard, group activity feed"},
        ],
        "demo_video_url": None,
        "mitre_techniques": [],
        "visibility_note": None,
        "technical_decisions": [
            {
                "decision": "Django MVT over a React SPA",
                "why": "Simpler deployment for a school-hosted project; Django's built-in auth and ORM reduced scope so the team could focus on features.",
                "tradeoffs": "Page-reload UX; adding real-time features later would require significant rework.",
            },
        ],
        "lessons_learned": [
            "Team projects need a clear data model contract agreed on in week one; we refactored our activity schema twice.",
            "Django signals are powerful for reminders but hard to test; prefer explicit service layer calls.",
        ],
        "roadmap": [
            "REST API backend for a potential mobile app",
            "Streak freeze mechanic to reduce dropout",
            "Weekly digest email with team highlights",
        ],
    },
]
