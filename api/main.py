"""FastAPI entrypoint for brantsimpson.com.

Serves JSON data for the portfolio frontend:
    - GET /api/health
    - GET /api/projects
    - GET /api/services
    - GET /api/credentials
    - GET /api/experience

Run locally:
    uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

import os
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from data import CREDENTIALS, EXPERIENCE, PROJECTS, SERVICES


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class Project(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    features: List[str] = Field(default_factory=list)
    tech: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    status: str = "public"
    year: Optional[str] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    # Frontend maps this to card chrome: skillswap | healthhive | cyber | default
    accent_theme: str = "default"


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


# ---------------------------------------------------------------------------
# App + CORS
# ---------------------------------------------------------------------------
app = FastAPI(
    title="brantsimpson.com API",
    description="Portfolio data service for brantsimpson.com",
    version="0.1.0",
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
    allow_methods=["GET"],
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
    return [Project(**p) for p in PROJECTS]


@app.get("/api/services", response_model=List[Service], tags=["portfolio"])
def get_services() -> List[Service]:
    return [Service(**s) for s in SERVICES]


@app.get("/api/credentials", response_model=List[Credential], tags=["portfolio"])
def get_credentials() -> List[Credential]:
    return [Credential(**c) for c in CREDENTIALS]


@app.get("/api/experience", response_model=List[ExperienceEntry], tags=["portfolio"])
def get_experience() -> List[ExperienceEntry]:
    return [ExperienceEntry(**e) for e in EXPERIENCE]


@app.get("/", include_in_schema=False)
def root() -> dict:
    return {
        "service": "brantsimpson-api",
        "docs": "/docs",
        "endpoints": [
            "/api/health",
            "/api/projects",
            "/api/services",
            "/api/credentials",
            "/api/experience",
        ],
    }
