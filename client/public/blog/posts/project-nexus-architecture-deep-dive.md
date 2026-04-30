---
title: "Project Nexus: Architecture and Engineering Deep Dive"
date: "2026-04-29"
tags: ["nexus", "c2", "architecture", "purple-team", "mitre"]
excerpt: "A formal technical whitepaper: modular C2, containerized lab topology, AES-GCM beaconing, ELK-sidecar telemetry, Sigma and MITRE-aligned detection, and a phased capability roadmap."
---

> **Document type:** Technical whitepaper / architecture documentation  
> **Subject:** Custom command and control (C2) framework and detection telemetry  
>
> Project Nexus is a modular, dual-use C2 framework built to bridge offensive operations and defensive visibility. It is designed for **transparent, lab-based security research**: end-to-end attack lifecycle demonstration **and** the network and log artifacts detection engineering needs. Pairing a containerized offensive stack with a dedicated SIEM pipeline makes Nexus a cohesive **purple-team** ecosystem.

## 1. System architecture

The framework uses a **decoupled, microservices-oriented** layout so components can scale, be swapped, or be extended without breaking the whole workflow. Everything runs **containerized (Docker)** for fast deploys and strict isolation.

![Containerized lab topology: agents, team server, datastore, Zeek sidecar, ELK stack](/blog/nexus-system-architecture.svg)

*Figure 1. Logical lab topology: outbound agents, FastAPI team server, durable state, mirrored Zeek traffic into ELK.*

### 1.1 Team server (C2 backend)

The team server is implemented in **FastAPI (Python)** and intentionally splits two traffic classes:

- **Agent interaction:** Ingress from implants checking in for tasks and exfiltrating results.
- **Operator interaction:** Authenticated API calls from humans or automation managing the campaign.

Keeping these concerns explicit makes policy, auth, and auditing easier to reason about as the surface grows.

### 1.2 Agents (implants)

Agents are **lightweight Python payloads** built for modularity instead of a single static binary. The execution loop is designed to evolve toward **dynamic engines** (living-off-the-land style techniques, in-memory work) to shrink on-disk footprint over time.

Agents run on the target host (or in a lab container) and **only initiate outbound connections** to the team server, matching common operational patterns you want to study in a controlled setting.

### 1.3 Storage and state management

State persists in a **relational database**. **SQLite** suits solo lab usage today; the ORM path is **PostgreSQL-ready** for multi-operator servers, better locking under concurrency, and heavier task queues.

## 2. Cryptographic protocol and network flow

Strong encryption and **non-trivial timing** matter when you are studying how naive IDS and traffic analytics behave.

![Beacon row (jitter) versus operator REST row (authenticated)](/blog/nexus-traffic-flow.svg)

*Figure 2. Two logical channels: implants over HTTP(S) beaconing, operators over authenticated management APIs.*

### 2.1 Beaconing and jitter

Agents do **not** hold a long-lived noisy TCP session. They **beacon** via standard **HTTP/HTTPS POST** to a configurable path (default **`/beacon`**).

**Jitter** randomizes sleep between check-ins so fixed-interval frequency analysis does not get a clean metronome signal. The percentage is tunable to stress different defensive analytics.

### 2.2 Payload encryption

Tasks and exfil data are carried in **JSON** bodies. Confidentiality on the wire uses:

- **AES-GCM-256** with a **pre-shared key** wrapping JSON payloads.
- **Base64** encoding of ciphertext blobs for safe transport through application-layer proxies.

**Important training property:** while payload bodies are protected, **TLS fingerprints, timing, and frame sizes** remain visible on purpose so blue teams can exercise **metadata-driven** detection, not only payload inspection.

## 3. Defensive telemetry and detection engineering

Unlike typical malware projects, Nexus **expects** to be scrutinized. A native observability path proves detections against **real** artifacts from your own lab runs.

![Zeek to Logstash to Elasticsearch to Kibana](/blog/nexus-elk-pipeline.svg)

*Figure 3. Structured network metadata through the ELK pipeline for hunt-friendly storage and dashboards.*

### 3.1 Zeek sidecar and ELK

On a dedicated Docker bridge (**`10.10.0.0/24`** in the reference design), a **Zeek** sidecar sits adjacent to C2 traffic capture points, emitting high-fidelity logs such as **`conn.log`** and **`http.log`**.

- **Logstash** normalizes events.  
- **Elasticsearch** stores time-series data.  
- **Kibana** supports live views of beacon rhythm, connection spikes, and encrypted flow patterns.

### 3.2 Sigma rules and ATT&CK mapping

Operations are traced to **MITRE ATT&CK**. Custom **Sigma** rules target Nexus-specific artifacts so you can regress detections as the framework changes.

| MITRE ID | Technique | Nexus implementation and detection focus |
| --- | --- | --- |
| T1071.001 | Application Layer Protocol | Anomalous POST frequency to beacon URI paths (e.g. `/beacon`). |
| T1573.001 | Symmetric Cryptography | High-entropy Base64 bodies in HTTP flows masking typical text patterns. |
| T1059.003 | Windows Command Shell *(analogous scripting in lab)* | Interpreter process telemetry when Python agents spawn atypical child shells in test hosts. |

Treat the table as exemplar strategy: extend with your own host and EDR telemetry where available.

## 4. Phased capability roadmap

![High-level phased roadmap baseline](/blog/nexus-phase-roadmap.svg)

*Figure 4. Roadmap posture: foundational phases validated before expansion.*

### Completed: Phase 1 and 2 (validation and baseline)

FastAPI backend and Dockerized lab; **AES-GCM** path and starter **Sigma** libraries; threat-informed review of the C2 footprint.

### Phase 3: Integration and infrastructure expansion

- Cloud routing (**DigitalOcean**) behind **WireGuard** to emulate realistic egress and firewall crossings.  
- **Metasploit bridge:** `msf_agent_deploy`-style chaining from initial exploitation into persistent Nexus beacons.  
- **Operator UI:** websocket-driven web GUI for interactive campaign handling.

### Phase 4: Evasion and arsenal integration

PostgreSQL migration; drive **Nmap, Nuclei, Responder, BloodHound** style tooling from Nexus; advanced tradecraft (**polymorphism, in-memory execution**) for EDR stress testing when legally appropriate.

**AI tangent:** optional local **LLM** assist for operator workloads and autonomous SIEM self-test loops (*clearly bounded to lab consent and policy*).

### Phase 5: Commercialization

Maturation toward a commercially viable dual-use platform (LLC posture), rigorous **KYC**, attribution tagging, licensing for authorized red teams, and an **extensibility marketplace** for community modules.

---

*All Nexus work described here is conducted against systems I own or have explicit authorization to test. This document is engineering documentation for learning and defense validation, not a guide to unauthorized access.*
