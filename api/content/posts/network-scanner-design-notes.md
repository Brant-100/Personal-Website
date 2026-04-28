---
title: "Building a Multithreaded Network Scanner in Python: Design Notes"
date: "2026-01-20"
tags: ["python", "networking", "recon", "network-scanner"]
excerpt: "Why threading over asyncio, how banner grabbing actually works, and what I learned building a recon tool from raw sockets."
---

# Building a Multithreaded Network Scanner in Python: Design Notes

> **Status:** Draft. Fill in with your actual design process and lessons.

## Why build one instead of using nmap?

[Write the same answer as Nexus: building it was the point. Understanding every component of the recon pipeline is directly relevant to knowing what defenders see.]

## Architecture overview

The scanner has four modules:

- `discovery.py`: CIDR ping sweep (host discovery)
- `core.py`: multithreaded TCP connect port scanning
- `banner.py`: service banner grabbing
- `report.py`: text and JSON output

[Write about why each piece is separate. What would you refactor now?]

## Threading vs asyncio: the real tradeoff

[Write a technically honest explanation of why you chose ThreadPoolExecutor over asyncio for this use case. TCP connect() blocks at the OS level. The GIL doesn't matter here because the work is I/O bound and the threads mostly wait. asyncio would have been cleaner but required more care around socket event loops in the CLI context.]

## How banner grabbing actually works

[Write about the protocol specific behavior: SSH sends a banner immediately on connection. HTTP requires you to send a request before the server responds. Some services (MySQL, FTP) send on connect; others require a probe. How did you handle this?]

## The test suite

[Write about the four tests: closed port, open port, sorted results, empty input. Why those four? What race conditions did the tests catch? What would you add?]

## What defenders see

[For each module, write a sentence about what a blue team analyst would see in their logs when this tool runs against their network.]

## Roadmap

- Extract to standalone repo (Brant-100/network-scanner)
- UDP probe support
- OS fingerprinting via TTL + window size heuristics

---

*Only use this against networks you own or are explicitly authorized to test.*
