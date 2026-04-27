"""Cloudflare Turnstile server-side token verification."""
from __future__ import annotations

import logging
import os

import httpx

logger = logging.getLogger("brantsimpson-api")

TURNSTILE_SECRET_KEY = os.environ.get("TURNSTILE_SECRET_KEY", "")
TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

# During local dev (or tests) without a real secret key, set
# TURNSTILE_BYPASS=1 to skip verification rather than always failing.
_BYPASS = os.environ.get("TURNSTILE_BYPASS", "") == "1"

# Must match client/src/components/forms/ContactForm.jsx when VITE_TURNSTILE_SITE_KEY is unset.
_DEV_PLACEHOLDER_TOKEN = "dev-bypass"


async def verify_turnstile_token(token: str, remote_ip: str | None = None) -> bool:
    """Return True if the Turnstile token is valid.

    Returns False (not raises) on network errors so callers can decide
    whether to fail open or closed.
    """
    if _BYPASS:
        logger.debug("Turnstile verification bypassed (TURNSTILE_BYPASS=1)")
        return True

    if not TURNSTILE_SECRET_KEY:
        # Frontend sends this placeholder when no site key (local Vite dev). Production must set
        # TURNSTILE_SECRET_KEY so real tokens are verified; without a secret, only this placeholder
        # is accepted (misconfigured prod would already reject real widget tokens).
        if token == _DEV_PLACEHOLDER_TOKEN:
            logger.warning(
                "Turnstile: accepting dev placeholder (no TURNSTILE_SECRET_KEY). "
                "Set the secret in production."
            )
            return True
        logger.warning("TURNSTILE_SECRET_KEY not set; rejecting submission")
        return False

    payload: dict = {"secret": TURNSTILE_SECRET_KEY, "response": token}
    if remote_ip:
        payload["remoteip"] = remote_ip

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(TURNSTILE_VERIFY_URL, data=payload)
            resp.raise_for_status()
            data = resp.json()
            return bool(data.get("success"))
    except Exception as exc:
        logger.error("Turnstile verification request failed: %s", exc)
        return False
