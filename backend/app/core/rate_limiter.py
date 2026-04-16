"""Rate limiting configuration for FastAPI endpoints"""
from __future__ import annotations

try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    
    # Create limiter instance (using client IP as key)
    limiter = Limiter(key_func=get_remote_address)
    RATE_LIMIT_AVAILABLE = True
except ImportError:
    # Fallback if slowapi not installed
    class DummyLimiter:
        def limit(self, rate: str):
            """No-op decorator if slowapi unavailable"""
            def decorator(func):
                return func
            return decorator
    
    limiter = DummyLimiter()
    RATE_LIMIT_AVAILABLE = False

