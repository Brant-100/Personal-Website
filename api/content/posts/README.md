# Internal blog posts (markdown)

Markdown files in this directory are served as **on-site** posts (`kind: internal`) through the FastAPI `/api/posts` endpoints.

## Workflow

1. Add `{slug}.md` here (`slug` is the URL segment — no subdirectory).
2. Start the file with **YAML frontmatter** between `---` delimiters.
3. Reload the API; `GET /api/posts` includes metadata from all `.md` files merged with curated externals (`api/data/external_posts.py`).
4. `GET /api/posts/{slug}` returns full detail **only** for files that exist here. External curated rows never return JSON bodies.

## Frontmatter keys

| Key | Required | Notes |
| --- | --- | --- |
| `title` | recommended | Fallback: filename slug. |
| `date` | recommended | ISO date string (`"2026-04-22"`). Used for sorting. |
| `tags` | optional | YAML list of strings. |
| `excerpt` | optional | Short blurb on the blog index cards. |
| `cover_image` | optional | HTTPS URL shown on cards when valid. |
| `reading_time` | optional | Free string (`"12 min"`). Shown when set; cards show `"—"` if omitted. |

## Example block

```yaml
---
title: "Example Phase 2 Notes"
date: "2026-05-01"
tags: ["nexus", "engineering"]
excerpt: "Short summary for listings."
cover_image: "https://example.com/cover.webp"
reading_time: "15 min"
---

# Heading

Body Markdown goes here.

```
