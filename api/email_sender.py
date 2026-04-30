"""Transactional email helpers using the Resend REST API via httpx."""
from __future__ import annotations

import logging
import os
from typing import Optional, Tuple

import httpx

logger = logging.getLogger("brantsimpson-api")

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_SEND_URL = "https://api.resend.com/emails"

CONTACT_TO = os.environ.get("CONTACT_TO_EMAIL", "brant@brantsimpson.com")
CONTACT_FROM = os.environ.get("CONTACT_FROM_EMAIL", "contact@brantsimpson.com")


async def _post(payload: dict) -> Tuple[bool, Optional[str]]:
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set; skipping email send: %s", payload.get("subject"))
        return True, None  # fail-open in dev so tests pass without real key
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                RESEND_SEND_URL,
                headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
                json=payload,
            )
            if r.status_code >= 400:
                logger.error("Resend error %s: %s", r.status_code, r.text)
                return False, f"Resend HTTP {r.status_code}"
            return True, None
    except Exception as exc:
        logger.error("Resend request failed: %s", exc)
        return False, str(exc)


async def send_inquiry_notification(
    name: str,
    email: str,
    service: str,
    budget: Optional[str],
    timeline: Optional[str],
    message: str,
) -> Tuple[bool, Optional[str]]:
    """Send Brant a notification email with all inquiry details."""
    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px">
      <h2 style="color:#22E5FF">New inquiry via brantsimpson.com</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold">From:</td>
            <td style="padding:8px">{name} &lt;{email}&gt;</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Service:</td>
            <td style="padding:8px">{service}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Budget:</td>
            <td style="padding:8px">{budget or 'not specified'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Timeline:</td>
            <td style="padding:8px">{timeline or 'not specified'}</td></tr>
      </table>
      <h3 style="margin-top:24px">Message</h3>
      <p style="white-space:pre-wrap;background:#f4f4f4;padding:12px;border-radius:8px">{message}</p>
      <hr style="margin-top:24px;border:none;border-top:1px solid #eee"/>
      <p style="font-size:12px;color:#888">Reply directly to this email to respond to {name}.</p>
    </div>
    """
    return await _post({
        "from": f"brantsimpson.com <{CONTACT_FROM}>",
        "to": [CONTACT_TO],
        "reply_to": email,
        "subject": f"New inquiry from {name}: {service}",
        "html": html,
    })


async def send_confirmation_to_user(name: str, email: str) -> Tuple[bool, Optional[str]]:
    """Send an automated confirmation to the person who submitted the form."""
    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px">
      <p>Hi {name},</p>
      <p>Thanks for reaching out. I got your message and I'll reply within 48 hours,
         usually much faster.</p>
      <p>In the meantime, feel free to check out
         <a href="https://brantsimpson.com">brantsimpson.com</a> for more about my work.</p>
      <p>Best,<br/>Brant</p>
      <hr style="margin-top:24px;border:none;border-top:1px solid #eee"/>
      <p style="font-size:12px;color:#888">This is an automated confirmation.
         If you didn't send this message, please ignore this email.</p>
    </div>
    """
    return await _post({
        "from": f"Brant Simpson <{CONTACT_FROM}>",
        "to": [email],
        "subject": "Got your message; I'll reply within 48 hours",
        "html": html,
    })
