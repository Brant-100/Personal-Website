# Curated external links merged into GET /api/posts (kind="external").
#
# How to add a row:
#   1. Append a dict to EXTERNAL_POSTS with keys: id, title, excerpt, url, source,
#      date (ISO), tags (list), and optionally author, cover_image, reading_time.
#   2. `id` becomes the public slug (used only in the list API; there is no /api/posts/{id} body).
#   3. Deploy the API; no other code changes.
#
# See also: api/content/posts/README.md for internal markdown posts.

from typing import Any, Dict, List

# source: dev.to | medium | hashnode | github | personal | other

EXTERNAL_POSTS: List[Dict[str, Any]] = [
    {
        "id": "owasp-sql-injection-prevention",
        "title": "SQL injection prevention (OWASP Cheat Sheet)",
        "excerpt": "Parameterized queries, prepared statements, and defense-in-depth patterns for safe database access.",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
        "source": "other",
        "author": "OWASP Cheat Sheet Series",
        "date": "2024-01-10",
        "tags": ["web-security", "sqli", "owasp"],
        "cover_image": None,
        "reading_time": "15 min read",
    },
    {
        "id": "krebsonsecurity-home",
        "title": "Krebs on Security: investigative reporting",
        "excerpt": "Long-form context on criminal infrastructure, breaches, and how attacks become headlines.",
        "url": "https://krebsonsecurity.com/",
        "source": "other",
        "author": "Brian Krebs",
        "tags": ["ransomware", "threat-intel", "journalism"],
        "cover_image": None,
    },
    {
        "id": "google-project-zero-blog",
        "title": "Project Zero: vulnerability research",
        "excerpt": "Google Project Zero: in-depth writeups on real-world attack surface and defensive lessons.",
        "url": "https://googleprojectzero.blogspot.com/",
        "source": "github",
        "author": "Google Project Zero",
        "date": "2023-12-01",
        "tags": ["project-zero", "ios", "reverse-engineering"],
        "cover_image": None,
    },
    {
        "id": "testdriven-fastapi-docker-traefik-postgresql",
        "title": "FastAPI, Docker, Traefik, and Postgres (full stack tutorial)",
        "excerpt": "End-to-end API layout with containers and persistence, useful for shipping services responsibly.",
        "url": "https://testdriven.io/blog/fastapi-docker-traefik/",
        "source": "medium",
        "author": "Michael Herman",
        "date": "2021-04-19",
        "tags": ["python", "fastapi", "docker"],
        "cover_image": None,
        "reading_time": "~60 min read",
    },
    {
        "id": "daniel-miessler-strategy-vs-tactics",
        "title": "Cybersecurity articles and frameworks (Daniel Miessler)",
        "excerpt": "Index of writing on security programs, mental models, and practice, including how strategy and tactics connect to frameworks like MITRE.",
        "url": "https://danielmiessler.com/blog/cybersecurity",
        "source": "personal",
        "author": "Daniel Miessler",
        "date": "2019-06-12",
        "tags": ["strategy", "mitre", "blue-team"],
        "cover_image": None,
    },
    {
        "id": "fastapi-official-first-steps",
        "title": "FastAPI first steps (official documentation)",
        "excerpt": "Path operations, dependency injection, and OpenAPI defaults when building APIs.",
        "url": "https://fastapi.tiangolo.com/tutorial/first-steps/",
        "source": "other",
        "author": "Sebastián Ramírez",
        "date": "2025-08-01",
        "tags": ["fastapi", "python", "openapi"],
        "cover_image": None,
        "reading_time": "15 min read",
    },
]
