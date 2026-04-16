from __future__ import annotations

from enum import Enum
from typing import Optional

from fastapi import Depends, HTTPException, Request, Security, status
from fastapi.security import APIKeyHeader

from app.core.config import settings

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


class TokenScope(str, Enum):
    """Token permission scopes"""
    ADMIN = "admin"          # Full access (backend only)
    PREDICT = "predict"      # Can call /predict endpoint
    EXPLAIN = "explain"      # Can call /explain endpoint
    ALERTS = "alerts"        # Can call /alerts endpoint
    PUBLIC = "public"        # Limited frontend access (predict + alerts)


class VerifiedToken:
    """Token details after verification"""
    def __init__(self, key: str, scope: TokenScope, origin: Optional[str] = None):
        self.key = key
        self.scope = scope
        self.origin = origin  # Client IP or domain for logging

    def has_permission(self, required_scope: TokenScope) -> bool:
        """Check if token has required permission"""
        # Admin tokens have all permissions
        if self.scope == TokenScope.ADMIN:
            return True
        return self.scope == required_scope


async def verify_api_key(
    request: Request,
    api_key: str | None = Security(_api_key_header),
) -> VerifiedToken:
    """
    Dependency: validates X-API-Key header and returns token info.
    Supports both admin (api_secret_key) and public (api_public_key) tokens.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing API key. Pass X-API-Key header.",
        )

    client_origin = request.client.host if request.client else "unknown"

    # Admin token (full access)
    if api_key == settings.api_secret_key:
        return VerifiedToken(api_key, TokenScope.ADMIN, client_origin)

    # Public token (frontend - limited access)
    if api_key == settings.api_public_key:
        return VerifiedToken(api_key, TokenScope.PUBLIC, client_origin)

    # Invalid token
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid API key.",
    )


def require_scope(required_scope: TokenScope):
    """Dependency to enforce token scope on specific endpoints"""
    async def _check_scope(token: VerifiedToken = Depends(verify_api_key)) -> VerifiedToken:
        if not token.has_permission(required_scope):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This endpoint requires {required_scope.value} scope.",
            )
        return token
    return _check_scope
