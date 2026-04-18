# Backend Deployment to HuggingFace Spaces - Manual Steps

Due to binary file constraints on HuggingFace, use these manual steps to deploy the backend security updates.

## Option 1: Fresh Clone on HuggingFace Space (Recommended)

1. **SSH into your HuggingFace Space terminal**
   - Go to https://huggingface.co/spaces/harshil0303/xguard-ids-backend
   - Click "Files" → "Settings" → "Persistent storage" → Enable it
   - Open "App" → "Terminal"

2. **Pull latest backend code**
   ```bash
   cd /tmp
   git clone https://github.com/Harshil-sitapara/xguard-ai.git ids-latest
   cd ids-latest/backend
   ```

3. **Install dependencies with security updates**
   ```bash
   pip install -r requirements.txt
   # This includes: slowapi>=0.1.9 for rate limiting
   ```

4. **Update .env with security settings**
   ```bash
   cat > /home/user/app/secrets.py << 'EOF'
   import os
   
   # ── API Security ─────────────────────────────────────────
   API_SECRET_KEY = os.getenv("API_SECRET_KEY", "dev_secret_change_in_production")
   API_PUBLIC_KEY = os.getenv("API_PUBLIC_KEY", "dev_public_key_for_frontend")
   
   # ── Rate Limiting ─────────────────────────────────────────
   RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
   RATE_LIMIT_PREDICT = os.getenv("RATE_LIMIT_PREDICT", "30/minute")
   RATE_LIMIT_EXPLAIN = os.getenv("RATE_LIMIT_EXPLAIN", "20/minute")
   RATE_LIMIT_ALERTS = os.getenv("RATE_LIMIT_ALERTS", "50/minute")
   RATE_LIMIT_DEFAULT = os.getenv("RATE_LIMIT_DEFAULT", "100/minute")
   EOF
   ```

5. **Restart HuggingFace Space**
   - Click "Settings" → "Restart space"
   - Wait 2-3 minutes for deployment

6. **Verify Security Features**
   ```bash
   curl -X GET https://huggingface.co/spaces/harshil0303/xguard-ids-backend/api/v1/alerts \
     -H "X-API-Key: your-public-key"
   
   # Should see rate limit headers in response:
   # X-RateLimit-Limit: 50
   # X-RateLimit-Remaining: 49
   ```

---

## Option 2: Docker Build Method

If you have Docker configured on the Space:

1. **Add security updates to Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   COPY backend/requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY backend/ .
   COPY ml/models/ ml/models/  # Optional: copy pre-trained models
   
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
   ```

2. **Push updated Dockerfile to HuggingFace**
   ```bash
   git add backend/Dockerfile
   git commit -m "update: enable rate limiting in Dockerfile"
   git push huggingface main  # Or push to new branch
   ```

---

## Security Config on HuggingFace

Add these environment variables in **Space Settings → Variables**:

| Variable | Value | Purpose |
|----------|-------|---------|
| `API_SECRET_KEY` | Your 64-char hex string | Admin token (backend only) |
| `API_PUBLIC_KEY` | Your 64-char hex string | Public token (frontend) |
| `RATE_LIMIT_ENABLED` | `true` | Enable rate limiting |
| `RATE_LIMIT_PREDICT` | `30/minute` | Predictions per minute |
| `RATE_LIMIT_EXPLAIN` | `20/minute` | Explanations per minute |
| `RATE_LIMIT_ALERTS` | `50/minute` | Alerts fetches per minute |
| `CORS_ORIGINS` | Your Vercel URL | Frontend origin |

---

## Test Rate Limiting on HuggingFace

```bash
# Test single prediction (should work - 1st request)
for i in {1..31}; do
  curl -X GET "https://huggingface.co/spaces/harshil0303/xguard-ids-backend/api/v1/alerts?page=1" \
    -H "X-API-Key: public-key" -s -o /dev/null -w "Request $i: %{http_code}\n"
done

# After 50 requests: should see 429 Too Many Requests
```

---

## GitHub → HuggingFace Sync

To avoid binary file issues in future:

1. **GitHub remains source of truth**
   - All changes pushed to: `https://github.com/Harshil-sitapara/xguard-ai`
   - Security updates committed with full history

2. **HuggingFace Space pulls selectively**
   - SSH into Space terminal
   - `git clone` specific branch when needed
   - Or sync just the `backend/` and `frontend/` directories

3. **Store Models Outside Git**
   - Models in `.gitignore` (already configured)
   - Use HuggingFace Model Hub or persistent storage
   - Reference via environment variable paths

---

## Troubleshooting

### Rate Limiting Not Working
- Verify `slowapi` installed: `pip list | grep slowapi`
- Check `.env` has `RATE_LIMIT_ENABLED=true`
- Restart Space

### 403 Forbidden Errors
- Verify `X-API-Key` header matches `API_PUBLIC_KEY` or `API_SECRET_KEY`
- Check key is set in HuggingFace Space variables

### 429 Too Many Requests
- Normal behavior when limit exceeded
- Wait 1 minute or adjust limits in `.env`

---

## Next: GitHub Actions Auto-Deploy

Consider setting up GitHub Actions to sync to HuggingFace:

```yaml
name: Deploy to HuggingFace
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - 'docs/SECURITY.md'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to HuggingFace Space
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git remote add huggingface https://${{ secrets.HF_TOKEN }}@huggingface.co/spaces/harshil0303/xguard-ids-backend
          git push huggingface HEAD:main --force
```

This requires: HF API token in GitHub secrets as `HF_TOKEN`.
