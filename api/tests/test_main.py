"""API integration tests using httpx AsyncClient.

Tests every public endpoint. Run with:
    cd api
    pytest tests/ -q
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from main import app  # noqa: E402


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["service"] == "brantsimpson-api"


@pytest.mark.asyncio
async def test_projects_list(client):
    r = await client.get("/api/projects")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    # First item should be Project Nexus (sort_order: 1)
    ids = [p["id"] for p in data]
    assert "project-nexus" in ids
    assert "network-scanner" in ids
    # sorted by sort_order
    assert data[0]["id"] == "project-nexus"


@pytest.mark.asyncio
async def test_project_detail_nexus(client):
    r = await client.get("/api/projects/project-nexus")
    assert r.status_code == 200
    p = r.json()
    assert p["id"] == "project-nexus"
    assert len(p["mitre_techniques"]) >= 18
    assert p["visibility_note"] is not None
    assert len(p["technical_decisions"]) >= 1


@pytest.mark.asyncio
async def test_project_detail_not_found(client):
    r = await client.get("/api/projects/does-not-exist")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_services(client):
    r = await client.get("/api/services")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 3


@pytest.mark.asyncio
async def test_credentials(client):
    r = await client.get("/api/credentials")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # At minimum: Security+, LSSBB, IC3, and IT Specialist series
    assert len(data) >= 12
    names = [c["name"] for c in data]
    assert any("Security+" in n for n in names)
    assert any("Six Sigma" in n for n in names)


@pytest.mark.asyncio
async def test_experience(client):
    r = await client.get("/api/experience")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 3


@pytest.mark.asyncio
async def test_posts_list(client):
    r = await client.get("/api/posts")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # We seeded 6 posts
    assert len(data) >= 6
    slugs = [p["slug"] for p in data]
    assert "nexus-phase-1-retrospective" in slugs
    assert "why-i-built-c2-from-scratch" in slugs


@pytest.mark.asyncio
async def test_post_detail(client):
    r = await client.get("/api/posts/nexus-phase-1-retrospective")
    assert r.status_code == 200
    p = r.json()
    assert p["slug"] == "nexus-phase-1-retrospective"
    assert p["title"] is not None
    assert isinstance(p["content"], str)
    assert len(p["content"]) > 0


@pytest.mark.asyncio
async def test_post_not_found(client):
    r = await client.get("/api/posts/no-such-post")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_contact_success(client):
    r = await client.post("/api/contact", json={
        "name": "Test User",
        "email": "test@example.com",
        "message": "Hello from the test suite.",
        "website": "",  # empty honeypot = real user
    })
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True


@pytest.mark.asyncio
async def test_contact_honeypot(client):
    """Submissions with website filled in are silently discarded."""
    r = await client.post("/api/contact", json={
        "name": "Bot",
        "email": "bot@spam.com",
        "message": "Buy cheap watches",
        "website": "https://spam.example.com",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True  # silently accepted, not forwarded


# ---------------------------------------------------------------------------
# /api/inquiry tests
# ---------------------------------------------------------------------------

_VALID_INQUIRY = {
    "name": "Test User",
    "email": "test@example.com",
    "service": "web-development",
    "budget": "500-1500",
    "timeline": "1-month",
    "message": "This is a test inquiry message with enough characters.",
    "website": "",
    "turnstileToken": "bypass-token",
}


@pytest.fixture(autouse=False)
def bypass_turnstile(monkeypatch):
    """Make verify_turnstile_token always return True for unit tests."""
    import turnstile
    monkeypatch.setattr(turnstile, "_BYPASS", True)


@pytest.mark.asyncio
async def test_inquiry_success(client, bypass_turnstile):
    r = await client.post("/api/inquiry", json=_VALID_INQUIRY)
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True


@pytest.mark.asyncio
async def test_inquiry_missing_name(client, bypass_turnstile):
    payload = {**_VALID_INQUIRY, "name": "X"}  # too short (min_length=2 is fine, use 1 char)
    payload["name"] = "A"
    r = await client.post("/api/inquiry", json=payload)
    # Pydantic min_length=2 → 422
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_inquiry_invalid_email(client, bypass_turnstile):
    payload = {**_VALID_INQUIRY, "email": "not-an-email"}
    r = await client.post("/api/inquiry", json=payload)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_inquiry_message_too_short(client, bypass_turnstile):
    payload = {**_VALID_INQUIRY, "message": "short"}
    r = await client.post("/api/inquiry", json=payload)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_inquiry_honeypot_filled(client, bypass_turnstile):
    """A filled honeypot field causes a 422 (validator rejects it)."""
    payload = {**_VALID_INQUIRY, "website": "https://spam.example.com"}
    r = await client.post("/api/inquiry", json=payload)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_inquiry_bad_turnstile(client, monkeypatch):
    """A failed Turnstile verification returns 400."""
    import turnstile
    monkeypatch.setattr(turnstile, "_BYPASS", False)
    monkeypatch.setattr("turnstile.TURNSTILE_SECRET_KEY", "fake-key")

    async def _always_false(token, remote_ip=None):
        return False

    monkeypatch.setattr(turnstile, "verify_turnstile_token", _always_false)

    r = await client.post("/api/inquiry", json=_VALID_INQUIRY)
    assert r.status_code == 400
    assert "erification" in r.json()["detail"]


@pytest.mark.asyncio
async def test_inquiry_rate_limit(client, bypass_turnstile):
    """After enough submissions from the same IP the limiter must return 429.

    We don't assume the counter starts at zero (other tests may have already
    consumed some of the 5/hour quota), so we just send enough requests to
    exhaust the limit and verify we eventually receive 429.
    """
    statuses = []
    for _ in range(7):
        r = await client.post("/api/inquiry", json=_VALID_INQUIRY)
        statuses.append(r.status_code)

    assert 429 in statuses, f"Expected a 429 somewhere in {statuses}"
