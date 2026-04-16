"""Rate limiting configuration for FastAPI endpoints"""
from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

# Create limiter instance (using client IP as key)
limiter = Limiter(key_func=get_remote_address)
