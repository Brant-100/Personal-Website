---
title: "CTF Walkthrough: [Machine Name] (TryHackMe / HackTheBox)"
date: "2026-04-01"
tags: ["ctf", "walkthrough", "offensive-security"]
excerpt: "A step-by-step walkthrough of [machine name]: reconnaissance, initial access, privilege escalation, and lessons learned."
---

# CTF Walkthrough: [Machine Name]

> **Status:** Draft. Replace [Machine Name] with the actual box you're writing up. TryHackMe rooms or retired HackTheBox boxes are ideal.

**Platform:** TryHackMe / HackTheBox  
**Difficulty:** Easy / Medium  
**OS:** Linux / Windows  
**Date:** [Date]

---

## Reconnaissance

### Initial nmap scan

```
nmap -sC -sV -oN initial.nmap [target-ip]
```

[Paste nmap output. Write about what you noticed and what you prioritized.]

### Web enumeration

[If there was a web server: what did you find with gobuster/ffuf/dirsearch? What stood out?]

## Initial Access

[Write about how you got your first shell. What vulnerability? What was the exact exploit path? Be specific. Include the commands.]

## Privilege Escalation

[Write about how you went from initial shell to root/Administrator. What enumeration did you run? What did you find? What was the privesc vector?]

## Flags

```
user.txt: [hash]
root.txt: [hash]
```

## What I learned

[This is the most important section. Write about what this box taught you: specific techniques, specific tools, specific concepts. What would you do differently next time?]

## Detection notes

[For each technique you used, write one sentence about what a defender would see. This is the blue team perspective that makes write-ups valuable beyond just "I solved the box."]

---

*Note: All CTF work is on authorized platforms against deliberately vulnerable machines.*
