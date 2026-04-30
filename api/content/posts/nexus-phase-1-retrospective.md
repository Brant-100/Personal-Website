---
title: "Project Nexus Phase 1 Retrospective"
date: "2026-04-22"
tags: ["nexus", "security", "c2", "retrospective"]
excerpt: "What I built, every design decision I made, and what I'd change. The story of building a command and control framework from scratch at 17."
cover_image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80"
reading_time: "12 min"
---

# Project Nexus Phase 1 Retrospective

> **Status:** Draft. Fill in with real phase 1 details.

## What I set out to build

[Write a paragraph about the original goals: what Nexus was supposed to be at the start of Phase 1 vs. what it became.]

## The "from scratch" constraint

The deliberate constraint: no Cobalt Strike, no Metasploit, no Sliver. Every component had to be something I could stand in front of and explain from first principles. Here's why that mattered.

[Explain: the constraint was a learning mechanism. The goal wasn't to reinvent the wheel, it was to understand the wheel well enough to know when the commercial tools would fail you, and why.]

## What I actually shipped

- FastAPI operator server with JWT auth
- WAL mode SQLite + JSONL hash chain for log integrity
- AES-GCM implant communications
- Jittered beacon intervals
- Sandbox detection heuristics
- 17 task handlers
- 18 MITRE ATT&CK techniques mapped
- GitHub Actions CI
- Docker Compose deployment

## The decisions I'd make differently

[For each major architectural decision, write: what I chose, what I was thinking, and what I'd change in hindsight.]

### AES-GCM key negotiation

[...]

### SQLite WAL + JSONL hash chain

[...]

### FastAPI as the operator interface

[...]

## What Phase 1 taught me about defenders

[This is the most important section. Write about what building offense taught you about how to detect it. Each technique you implemented: what would a blue team analyst see? What logs would it leave?]

## What's next in Phase 2

- Web based operator dashboard
- Process injection (T1055)
- Encrypted key/value store for implant config
- Dedicated nexus.brantsimpson.com when ready

---

*All techniques shown are implemented against systems I own. MITRE technique IDs are used for detection engineering research.*
