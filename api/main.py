"""FastAPI entrypoint for brantsimpson.com.

Serves JSON data for the portfolio frontend:
    - GET  /api/health
    - GET  /api/projects
    - GET  /api/projects/{id}
    - GET  /api/services
    - GET  /api/credentials
    - GET  /api/experience
    - GET  /api/posts
    - GET  /api/posts/{slug}
    - POST /api/contact
    - POST /api/inquiry

Run locally:
    uvicorn main:app --reload --host 127.0.0.1 --port 8765
"""
from __future__ import annotations

import logging
import os
import pathlib
from typing import Any, Dict, List, Optional

import frontmatter as fm
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from schemas import InquiryIn, InquiryOut
from turnstile import verify_turnstile_token
from email_sender import send_inquiry_notification, send_confirmation_to_user

logger = logging.getLogger("brantsimpson-api")

from data import CREDENTIALS, EXPERIENCE, PROJECTS, SERVICES

POSTS_DIR = pathlib.Path(__file__).parent / "content" / "posts"


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class TechnicalDecision(BaseModel):
    decision: str
    why: str
    tradeoffs: str


class Screenshot(BaseModel):
    url: str
    caption: str


class Project(BaseModel):
    id: str
    sort_order: int = 99
    title: str
    tagline: str
    description: str
    problem: Optional[str] = None
    constraints: List[str] = Field(default_factory=list)
    features: List[str] = Field(default_factory=list)
    tech: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    status: str = "public"
    year: Optional[str] = None
    last_updated: Optional[str] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    # Frontend maps this to card chrome: skillswap | healthhive | cyber | default
    accent_theme: str = "default"
    architecture_diagram_url: Optional[str] = None
    screenshots: List[Screenshot] = Field(default_factory=list)
    demo_video_url: Optional[str] = None
    mitre_techniques: List[str] = Field(default_factory=list)
    visibility_note: Optional[str] = None
    technical_decisions: List[TechnicalDecision] = Field(default_factory=list)
    lessons_learned: List[str] = Field(default_factory=list)
    roadmap: List[str] = Field(default_factory=list)


class Service(BaseModel):
    id: str
    title: str
    blurb: str
    icon: str
    bullets: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)


class Credential(BaseModel):
    id: str
    name: str
    issuer: str
    category: str
    year: Optional[str] = None
    url: Optional[str] = None
    subtitle: Optional[str] = None
    group: Optional[str] = None


class ExperienceEntry(BaseModel):
    id: str
    title: str
    org: str
    period: str
    summary: str
    tags: List[str] = Field(default_factory=list)


class Health(BaseModel):
    status: str = "ok"
    service: str = "brantsimpson-api"
    version: str = "0.1.0"


class PostMeta(BaseModel):
    slug: str
    title: str
    date: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    excerpt: Optional[str] = None


class PostDetail(PostMeta):
    content: str


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str
    website: str = ""  # honeypot field


class ContactResponse(BaseModel):
    ok: bool
    message: str



# ---------------------------------------------------------------------------
# App + CORS
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="brantsimpson.com API",
    description="Portfolio data service for brantsimpson.com",
    version="0.1.0",
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many submissions. Please try again in an hour."},
    )


# Local dev (Vite :5173 / preview :4173). \*.vercel.app is allowed by regex for preview deploys.
# Production custom domain is listed here so CORS works even if Railway env is mis-set; add
# more origins via CORS_EXTRA_ORIGINS (comma-separated) on the host.
_DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
_SITE_ORIGINS = [
    "https://brantsimpson.com",
    "https://www.brantsimpson.com",
]

_extra = os.environ.get("CORS_EXTRA_ORIGINS", "")
_extra_origins = [o.strip() for o in _extra.split(",") if o.strip()]
ALLOWED_ORIGINS = list(
    dict.fromkeys([*_DEV_ORIGINS, *_SITE_ORIGINS, *_extra_origins])
)

# Localhost + any Vercel deployment host (production, preview, branch deploys).
_CORS_ORIGIN_REGEX = (
    r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"
    r"|^https://[a-zA-Z0-9][-a-zA-Z0-9.]*\.vercel\.app$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=_CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health", response_model=Health, tags=["meta"])
def health() -> Health:
    return Health()


@app.get("/api/projects", response_model=List[Project], tags=["portfolio"])
def get_projects() -> List[Project]:
    items = [Project(**p) for p in PROJECTS]
    items.sort(key=lambda p: p.sort_order)
    return items


@app.get("/api/projects/{project_id}", response_model=Project, tags=["portfolio"])
def get_project(project_id: str) -> Project:
    for p in PROJECTS:
        if p["id"] == project_id:
            return Project(**p)
    raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")


@app.get("/api/services", response_model=List[Service], tags=["portfolio"])
def get_services() -> List[Service]:
    return [Service(**s) for s in SERVICES]


@app.get("/api/credentials", response_model=List[Credential], tags=["portfolio"])
def get_credentials() -> List[Credential]:
    return [Credential(**c) for c in CREDENTIALS]


@app.get("/api/experience", response_model=List[ExperienceEntry], tags=["portfolio"])
def get_experience() -> List[ExperienceEntry]:
    return [ExperienceEntry(**e) for e in EXPERIENCE]


def _load_post(path: pathlib.Path) -> PostDetail:
    """Parse a markdown file with YAML frontmatter into PostDetail."""
    post = fm.load(str(path))
    slug = path.stem
    return PostDetail(
        slug=slug,
        title=post.metadata.get("title", slug),
        date=str(post.metadata.get("date", "")) or None,
        tags=post.metadata.get("tags", []),
        excerpt=post.metadata.get("excerpt"),
        content=post.content,
    )


@app.get("/api/posts", response_model=List[PostMeta], tags=["blog"])
def get_posts() -> List[PostMeta]:
    if not POSTS_DIR.exists():
        return []
    posts: List[PostDetail] = []
    for md_file in POSTS_DIR.glob("*.md"):
        try:
            posts.append(_load_post(md_file))
        except Exception as exc:
            logger.warning("Could not parse %s: %s", md_file, exc)
    posts.sort(key=lambda p: p.date or "", reverse=True)
    return posts


@app.get("/api/posts/{slug}", response_model=PostDetail, tags=["blog"])
def get_post(slug: str) -> PostDetail:
    md_file = POSTS_DIR / f"{slug}.md"
    if not md_file.exists():
        raise HTTPException(status_code=404, detail=f"Post '{slug}' not found")
    return _load_post(md_file)


@app.post("/api/contact", response_model=ContactResponse, tags=["contact"])
async def contact(req: ContactRequest) -> ContactResponse:
    # Discard honeypot-filled submissions silently
    if req.website:
        return ContactResponse(ok=True, message="Message received.")

    resend_key = os.environ.get("RESEND_API_KEY")
    to_email = os.environ.get("CONTACT_TO_EMAIL", "brant@brantsimpson.com")
    from_email = os.environ.get("CONTACT_FROM_EMAIL", "contact@brantsimpson.com")

    if resend_key:
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    "https://api.resend.com/emails",
                    headers={"Authorization": f"Bearer {resend_key}"},
                    json={
                        "from": f"Portfolio Contact <{from_email}>",
                        "to": [to_email],
                        "subject": f"Portfolio contact from {req.name}",
                        "text": f"From: {req.name} <{req.email}>\n\n{req.message}",
                        "reply_to": req.email,
                    },
                    timeout=10.0,
                )
                if r.status_code >= 400:
                    logger.error("Resend error %s: %s", r.status_code, r.text)
        except Exception as exc:
            logger.error("Resend send failed: %s", exc)
    else:
        logger.info(
            "Contact form (no RESEND_API_KEY); from=%s <%s> msg=%s",
            req.name,
            req.email,
            req.message[:120],
        )

    return ContactResponse(ok=True, message="Message received. I usually reply within 48 hours.")


@app.post("/api/inquiry", response_model=InquiryOut, tags=["contact"])
@limiter.limit("5/hour")
async def inquiry(request: Request, data: InquiryIn) -> InquiryOut:
    # Honeypot is enforced by InquiryIn.honeypot_must_be_empty validator (422 on fill).
    # Verify Turnstile token server-side.
    client_ip = request.client.host if request.client else None
    if not await verify_turnstile_token(data.turnstileToken, client_ip):
        raise HTTPException(
            status_code=400,
            detail="Verification failed. Please refresh the page and try again.",
        )

    # Notify Brant.
    ok, err = await send_inquiry_notification(
        name=data.name,
        email=data.email,
        service=data.service,
        budget=data.budget,
        timeline=data.timeline,
        message=data.message,
    )
    if not ok:
        logger.error("inquiry: notification send failed: %s", err)
        raise HTTPException(
            status_code=500,
            detail="Couldn't send your message right now. Please email me directly at brant@brantsimpson.com.",
        )

    # Best-effort confirmation to submitter — don't fail the request if this errors.
    ok2, err2 = await send_confirmation_to_user(data.name, data.email)
    if not ok2:
        logger.warning("inquiry: confirmation send failed: %s", err2)

    return InquiryOut(success=True, message="Inquiry received.")


@app.get("/", include_in_schema=False)
def root() -> Dict[str, Any]:
    return {
        "service": "brantsimpson-api",
        "docs": "/docs",
        "endpoints": [
            "/api/health",
            "/api/projects",
            "/api/projects/{id}",
            "/api/services",
            "/api/credentials",
            "/api/experience",
            "/api/posts",
            "/api/posts/{slug}",
            "/api/contact",
            "/api/inquiry",
        ],
    }
