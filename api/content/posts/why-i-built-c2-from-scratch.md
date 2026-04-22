---
title: "Why I Built a C2 Framework From Scratch Instead of Using Cobalt Strike"
date: "2026-04-20"
tags: ["nexus", "security", "c2", "learning"]
excerpt: "The case for building your own offensive tooling: not to avoid detection, but to understand every component well enough to explain it under pressure."
---

# Why I Built a C2 Framework From Scratch Instead of Using Cobalt Strike

> **Status:** Draft. Fill in with your actual reasoning and experience.

## The obvious objection

Cobalt Strike exists. Sliver exists. Metasploit exists. Why spend months building something that already exists?

[Answer this directly. The goal wasn't to build a better C2. The goal was to *understand* C2 at a level that commercial tools hide from you.]

## What you can't learn by using existing tools

[Write about the specific things that only become clear when you implement them yourself: beacon scheduling, why jitter matters, how AES-GCM key negotiation actually works at the socket level, what sandbox detection looks like from the inside.]

## The interrogation test

My mental model for what "understanding" means: I should be able to sit in a room with a security engineer and answer every question they can ask about how my tool works. Not "I used Cobalt Strike and it handled that." I should know the actual mechanism.

[Write about what this test revealed during development. What questions could you not answer? What forced you to go deeper?]

## What I learned about defenses by building the offense

[This is the core argument. Go deep on specific examples: implementing T1497 (sandbox evasion) and what it teaches you about sandbox detection signatures; implementing AES-GCM and what it teaches you about traffic analysis; implementing T1070.004 (file deletion) and what artifacts remain.]

## The tradeoffs

Commercial C2 frameworks are better than Nexus for actual red team engagements: they're mature, supported, and hardened. Nexus was never supposed to compete with them. It was supposed to teach me things they couldn't.

[Write about the specific limitations and what they taught you.]

## Why this matters for 1B4X1

[Brief context: understanding how offensive tools work at a component level is directly applicable to writing signatures, detections, and understanding adversary behavior. This is the dual-use argument.]

---

*All work described here is against systems I own. This post is about learning, not operational use.*
