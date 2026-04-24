"""Pydantic models for the /api/inquiry endpoint."""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

Service = Literal[
    "web-development",
    "ui-ux-design",
    "custom-software",
    "wordpress",
    "other",
    "general",
]

Budget = Literal[
    "under-500",
    "500-1500",
    "1500-3500",
    "3500-plus",
    "not-sure",
]

Timeline = Literal[
    "asap",
    "1-month",
    "1-3-months",
    "flexible",
    "just-exploring",
]


class InquiryIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    service: Service
    budget: Optional[Budget] = None
    timeline: Optional[Timeline] = None
    message: str = Field(min_length=10, max_length=2000)
    website: str = Field(default="", max_length=0)  # honeypot — must stay empty
    turnstileToken: str = Field(min_length=1)

    @field_validator("website")
    @classmethod
    def honeypot_must_be_empty(cls, v: str) -> str:
        if v:
            raise ValueError("honeypot triggered")
        return v


class InquiryOut(BaseModel):
    success: bool
    message: str
