# Backend Security Implementation

This document describes the security barriers and rate limiting implemented in the XGuard-AI backend to protect the API from abuse and unauthorized access.

## Overview

The backend now implements **three layers of security**:
1. **Token Scopes** - Different permission levels for different tokens
2. **Rate Limiting** - Request throttling per IP address
3. **CORS Restrictions** - Only allow requests from authorized domains

## Token System

### Token Types

| Token | Purpose | Permissions | Visibility |
|-------|---------|-------------|------------|
| **Admin Token** (`api_secret_key`) | Backend operations | All endpoints (predict, explain, alerts) | Secret - Backend only |
| **Public Token** (`api_public_key`) | Frontend access | Limited (predict + alerts only) | Public - Can be exposed in browser |

### Token Scopes

```python
ADMIN      # Full API access (backend only)
PREDICT    # Can call /predict endpoint
EXPLAIN    # Can call /explain endpoint  
ALERTS     # Can call /alerts endpoint
PUBLIC     # Combined predict + alerts (frontend)
```

### How to Use

**Frontend (.env.local):**
```dotenv
NEXT_PUBLIC_API_TOKEN=<your-public-key>
```

**Backend (.env):**
```dotenv
API_SECRET_KEY=<your-admin-key>
API_PUBLIC_KEY=<your-public-key>
```

## Rate Limiting

Rate limits prevent brute force attacks and API abuse by limiting requests per IP address.

### Current Limits

| Endpoint | Limit | Purpose |
|----------|-------|---------|
| `POST /api/v1/predict` | 30/minute | Single predictions |
| `POST /api/v1/predict/batch` | 10/minute | Batch predictions |
| `GET /api/v1/explain/{id}` | 20/minute | SHAP explanations |
| `GET /api/v1/alerts` | 50/minute | Alert history |
| Other endpoints | 100/minute | Default limit |

### Configuration

Edit `.env` to customize limits:

```dotenv
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PREDICT=30/minute
RATE_LIMIT_EXPLAIN=20/minute
RATE_LIMIT_ALERTS=50/minute
RATE_LIMIT_DEFAULT=100/minute
```

### Rate Limit Exceeded Response

When a client exceeds the limit, they receive:

```json
{
  "detail": "429 Too Many Requests: rate limit exceeded"
}
```

Status code: `HTTP 429`

## CORS (Cross-Origin Resource Sharing)

CORS restricts which domains can call your API.

### Configuration

Edit `.env`:

```dotenv
CORS_ORIGINS=http://localhost:3000,https://frontend-xxx.vercel.app
```

This allows requests from:
- `http://localhost:3000` (local dev)
- `https://frontend-xxx.vercel.app` (Vercel frontend)

## Implementation Details

### Security Dependencies

```
slowapi>=0.1.9        # Rate limiting library
fastapi>=0.111.0      # Already included
```

### Modified Files

1. **backend/app/core/config.py**
   - Added rate limit settings
   - Added public key setting

2. **backend/app/core/security.py**
   - Added `TokenScope` enum
   - Added `VerifiedToken` class
   - Updated `verify_api_key()` to support multiple tokens
   - Added `require_scope()` dependency

3. **backend/app/core/rate_limiter.py** (NEW)
   - Instantiated `slowapi.Limiter`

4. **backend/app/main.py**
   - Imported slowapi
   - Added rate limiter middleware
   - Added exception handler for rate limit errors

5. **backend/app/api/v1/routes/**
   - Updated `predict.py` - Added `@limiter.limit()` decorators
   - Updated `explain.py` - Added `@limiter.limit()` decorators
   - Updated `alerts.py` - Added `@limiter.limit()` decorators

## Security Best Practices

### For Production Deployment

1. **Generate Strong Keys**
   ```bash
   openssl rand -hex 32
   ```

2. **Set Unique Tokens**
   - Admin key: Use for backend operations only
   - Public key: Use for frontend requests (lower permissions)

3. **Update CORS Origins**
   ```dotenv
   CORS_ORIGINS=https://your-domain.com
   ```

4. **Monitor Rate Limits**
   - Watch backend logs for `429` responses
   - Adjust rate limits if needed

5. **Rotate Keys Regularly**
   - Change `API_SECRET_KEY` every 90 days
   - Use CI/CD secrets management

### Security Features by Endpoint

| Endpoint | Auth | Rate Limit | CORS | Scope |
|----------|------|-----------|------|-------|
| `/api/v1/health` | None | 100/min | ✓ | N/A |
| `POST /api/v1/predict` | Required | 30/min | ✓ | PREDICT |
| `GET /api/v1/explain/{id}` | Required | 20/min | ✓ | EXPLAIN |
| `GET /api/v1/alerts` | Required | 50/min | ✓ | ALERTS |

## Testing

### Test Rate Limiting

```bash
# Should succeed (1st request)
curl -X POST http://localhost:8000/api/v1/predict \
  -H "X-API-Key: your-public-key" \
  -H "Content-Type: application/json" \
  -d '{"features": {}, "source_ip": "127.0.0.1", "destination_ip": "127.0.0.1"}'

# After 30+ requests in 1 minute: 429 Too Many Requests
```

### Test Token Scopes

```bash
# Using public key (works)
curl -X GET http://localhost:8000/api/v1/alerts \
  -H "X-API-Key: public-key"

# Using admin key (also works)
curl -X GET http://localhost:8000/api/v1/alerts \
  -H "X-API-Key: admin-key"

# Using invalid key: 403 Forbidden
curl -X GET http://localhost:8000/api/v1/alerts \
  -H "X-API-Key: invalid"
```

## Monitoring & Logging

Enable security logging:

```dotenv
LOG_LEVEL=INFO
```

Logs show:
- Failed authentication attempts
- Rate limit violations
- Token scope violations

## Future Enhancements

- IP whitelisting per token
- JWT token support
- OAuth2 integration
- Request signing/HMAC
- DDoS protection
- API key rotation automation
