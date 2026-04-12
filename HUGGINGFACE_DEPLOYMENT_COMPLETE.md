# XGuard AI IDS - Complete Deployment Guide (Hugging Face Spaces)

## Deploy FREE on Hugging Face Spaces (No Credit Card, Always Running)

---

## Table of Contents

1. [Overview & What You Get](#overview--what-you-get)
2. [Why Hugging Face Spaces](#why-hugging-face-spaces)
3. [Prerequisites](#prerequisites)
4. [Step 1: Prepare Your Code](#step-1-prepare-your-code)
5. [Step 2: Create Hugging Face Account](#step-2-create-hugging-face-account)
6. [Step 3: Set Up Backend Space](#step-3-set-up-backend-space)
7. [Step 4: Set Up Frontend Space](#step-4-set-up-frontend-space)
8. [Step 5: Configure Database (Supabase)](#step-5-configure-database-supabase)
9. [Step 6: Configure Kafka (Upstash)](#step-6-configure-kafka-upstash)
10. [Step 7: Connect Services](#step-7-connect-services)
11. [Step 8: Deploy & Verify](#step-8-deploy--verify)
12. [Monitoring & Management](#monitoring--management)
13. [Troubleshooting](#troubleshooting)

---

## Overview & What You Get

### Your Free Deployment Stack

```
┌──────────────────────────────────────────────────────┐
│              XGuard AI IDS Live Deployment            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Frontend (Next.js)         Backend (FastAPI)        │
│  ↓                          ↓                        │
│  ┌─────────────────────────────────────────┐        │
│  │  Hugging Face Spaces (Always Running)    │        │
│  │  ├─ Space 1: Next.js Frontend            │        │
│  │  └─ Space 2: FastAPI Backend             │        │
│  └──────────────┬──────────────────────┬────┘        │
│                 │                      │             │
│  ┌────────┐ ┌──▼──────────┐ ┌────────▼────┐        │
│  │ Supabase│ │ Upstash     │ │ ML Models   │        │
│  │ Post SQL│ │ Kafka       │ │ (XGBoost)   │        │
│  │ (FREE)  │ │ (FREE!)     │ │ Pre-loaded  │        │
│  └────────┘ └─────────────┘ └─────────────┘        │
│                                                      │
│  Everything on: HUGGING FACE SPACES                 │
│  Duration: Forever FREE                             │
│  Resources: 16 GB RAM, CPU shared                    │
│  Cost: $0/month (truly free!)                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### What's Included

| Component | Cost | Status | Notes |
|-----------|------|--------|-------|
| Frontend Space | $0 | ✓ FREE | Always running |
| Backend Space | $0 | ✓ FREE | Always running |
| PostgreSQL (Supabase) | $0 | ✓ FREE | 500MB storage |
| Kafka (Upstash) | $0 | ✓ FREE! | Perfect for IDS |
| SSL/TLS | $0 | ✓ Auto | Provided by HF |
| Bandwidth | Unlimited | ✓ FREE | No limits |
| **TOTAL** | **$0** | **✓ Forever** | **No card needed** |

---

## Why Hugging Face Spaces

### Advantages Over Alternatives

```
Feature              HF Spaces    Render    Railway
────────────────────────────────────────────────────
Cost                 $0           $0        $5/mo
Credit Card Needed   NO ✓         NO ✓      NO ✓
Always Running       YES ✓        NO (15min) YES
Docker Support       YES ✓        YES       YES
Persistent Storage   YES ✓        YES       YES
Duration             Forever      Forever   12 months
Community            Active ✓     Good      Good
────────────────────────────────────────────────────
BEST FOR YOUR IDS    ✓✓✓ BEST     Good      Good*
```

---

## Prerequisites

### What You Need

- [ ] GitHub account with code pushed
- [ ] Hugging Face account (free, no card needed)
- [ ] XGuard AI IDS code ready (backend/, frontend/, ml/)
- [ ] ML models trained (`ml/scripts/run_pipeline.py --step all`)
- [ ] `backend/requirements.txt` and `frontend/package.json` ready
- [ ] Dockerfile for backend (or we'll create one)

### Estimated Time

| Task | Duration |
|------|----------|
| Create HF account | 3 minutes |
| Prepare backend Dockerfile | 5 minutes |
| Deploy backend Space | 10 minutes |
| Deploy frontend Space | 10 minutes |
| Setup Supabase database | 5 minutes |
| Setup Upstash Kafka | 3 minutes |
| Connect services | 5 minutes |
| Test live system | 5 minutes |
| **Total** | **~50 minutes** |

---

## Step 1: Prepare Your Code

### 1.1 Create Backend Dockerfile

Create [backend/Dockerfile](backend/Dockerfile):

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML models
COPY ml/models /app/models

# Copy app code
COPY backend/app /app/app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Run app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 1.2 Create Frontend Dockerfile

Create [frontend/Dockerfile](frontend/Dockerfile):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Build project
COPY frontend . 
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built assets
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "start"]
```

### 1.3 Push to GitHub

```bash
# Add Dockerfiles to git
git add backend/Dockerfile frontend/Dockerfile

# Commit
git commit -m "Add Dockerfiles for Hugging Face Spaces deployment"

# Push
git push origin main
```

---

## Step 2: Create Hugging Face Account

### 2.1 Sign Up (No Credit Card!)

1. Go to **https://huggingface.co**
2. Click **Sign Up**
3. Choose: **Sign up with GitHub** (easiest)
   - Authorize HF app
   - Fill in profile
4. **✓ Done! No credit card asked**

### 2.2 Verify Account

1. Check email for verification link
2. Click to verify
3. Go to **https://huggingface.co/settings/profile**
4. Verify you're logged in

---

## Step 3: Set Up Backend Space

### 3.1 Create Backend Space

1. Go to **https://huggingface.co/spaces**
2. Click **Create new Space**
3. Configuration:
   ```
   Space name:         xguard-ids-backend
   License:            Apache 2.0
   Space SDK:          Docker
   Private/Public:     Public (or Private if you prefer)
   Visibility:         Restricted or Public
   ```
4. Click **Create Space**

### 3.2 Connect Your Repository

Once the space is created:

1. You'll see a panel with deployment options
2. Choose: **Docker** (already selected)
3. Copy the SSH or HTTPS URL they provide
4. In your local project:
   ```bash
   # Add HF remote
   git remote add huggingface https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend
   ```

### 3.3 Push Backend Code

```bash
# Method 1: Using Docker (Recommended)
1. HF will auto-build from Dockerfile
2. Push your repo to GitHub first
3. Connect GitHub repo in HF Space settings

# Method 2: Direct Git Push (Alternative)
git push huggingface main
```

### 3.4 Configure Backend Environment Variables

In HF Space settings:

1. Go to Space → **Settings** → **Secrets and variables**
2. Add these environment variables:
   ```
   DATABASE_URL=postgresql://... (from Supabase)
   API_SECRET_KEY=your-secret-key
   KAFKA_BOOTSTRAP_SERVERS=xxxxx.upstash.io:9092
   KAFKA_USERNAME=from-upstash
   KAFKA_PASSWORD=from-upstash
   BEST_MODEL_TYPE=xgboost
   ENVIRONMENT=production
   LOG_LEVEL=info
   ```

### 3.5 Wait for Deployment

- HF will build Docker image (~5-10 mins)
- Deploy to space
- You'll see: ✅ **Space Running**
- Access at: `https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend`

---

## Step 4: Set Up Frontend Space

### 4.1 Create Frontend Space

1. Go to **https://huggingface.co/spaces**
2. Click **Create new Space**
3. Configuration:
   ```
   Space name:         xguard-ids-frontend
   License:            Apache 2.0
   Space SDK:          Docker
   Private/Public:     Public
   ```
4. Click **Create Space**

### 4.2 Push Frontend Code

```bash
# Add remote
git remote add huggingface-frontend https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-frontend

# Push
git push huggingface-frontend main
```

### 4.3 Configure Frontend Environment Variables

In Frontend Space settings:

1. **Settings** → **Secrets and variables**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend
   NODE_ENV=production
   ```

### 4.4 Wait for Deployment

- Build takes ~8-10 minutes
- HF provides public URL once ready

---

## Step 5: Configure Database (Supabase)

### Why Supabase?

- ✓ 500 MB free PostgreSQL
- ✓ Perfect for your needs
- ✓ No card required
- ✓ Easy integration

### 5.1 Create Supabase Account

1. Go to **https://supabase.com**
2. Click **Start your project**
3. Sign up with GitHub (easiest)
4. **✓ No credit card needed**

### 5.2 Create PostgreSQL Database

1. **New Project** → Choose:
   ```
   Project name:   xguard-ids
   Database name:  postgres
   Region:         Singapore or India (closest)
   Password:       (auto-generated, save it!)
   ```
2. Click **Create new project**
3. Wait ~2 minutes for database to initialize

### 5.3 Get Connection String

1. Go to **Settings** → **Database**
2. Find **Connection String** section
3. Select **Postgres** language
4. Copy the entire connection string:
   ```
   postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

### 5.4 Use in Backend

Update backend Space environment variables with:
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

---

## Step 6: Configure Kafka (Upstash)

### 6.1 Create Upstash Account

1. Go to **https://upstash.com**
2. Sign up with GitHub
3. **✓ No card needed**

### 6.2 Create Kafka Cluster

1. **Console** → **Kafka**
2. Click **Create Cluster**
3. Configuration:
   ```
   Cluster name:   xguard-kafka
   Region:         us-east-1 (or closest)
   Type:           Free
   ```
4. Click **Create**

### 6.3 Create Kafka Topic

1. Click your cluster
2. **Topics** → **Create Topic**
3. Settings:
   ```
   Topic name:     network-traffic
   Partitions:     1
   ```
4. Click **Create**

### 6.4 Get Connection Details

1. Go to cluster details
2. Find **Connection String (SASL_SSL)**:
   ```
   kafka+ssl://USERNAME:PASSWORD@xxxxx.upstash.io:9092
   ```
3. Extract and add to backend Space vars:
   ```
   KAFKA_BOOTSTRAP_SERVERS=xxxxx.upstash.io:9092
   KAFKA_USERNAME=USERNAME
   KAFKA_PASSWORD=PASSWORD
   ```

---

## Step 7: Connect Services

### 7.1 Update Frontend API Endpoint

In frontend Space environment variables:

```
NEXT_PUBLIC_API_URL=https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend
```

Replace `YOUR_USERNAME` with your actual Hugging Face username.

### 7.2 Restart Spaces

1. Go to Backend Space → **Settings** → **Restart Space**
2. Go to Frontend Space → **Settings** → **Restart Space**
3. Wait for both to fully restart (~5 minutes)

### 7.3 Verify Connection

```bash
# Test backend health
curl "https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend/api/v1/health"

# Should return:
{"status": "ok"}
```

---

## Step 8: Deploy & Verify

### 8.1 Check Space Status

**Backend Space:**
- Go to: https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend
- Status should be: ✅ **Running**
- Click **View** to see logs

**Frontend Space:**
- Go to: https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-frontend
- Status should be: ✅ **Running**
- Click **View** to access dashboard

### 8.2 Test Backend API

```bash
# Get API key from backend logs or .env
API_KEY="your-secret-key"

# Test health endpoint
curl -H "X-API-Key: $API_KEY" \
  https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend/api/v1/health

# Response should be:
{"status": "ok"}
```

### 8.3 Test Prediction

```bash
# Make a prediction
curl -X POST \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "Flow_Duration": 1000,
      "Total_Fwd_Packets": 10,
      "Total_Bwd_Packets": 8,
      "Fwd_Packet_Length": 50,
      "Bwd_Packet_Length": 60
    }
  }' \
  https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend/api/v1/predict

# Response:
{
  "prediction_id": "uuid",
  "label": "BENIGN",
  "confidence": 0.95,
  "shap_values": [...]
}
```

### 8.4 Access Frontend

1. Go to: https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-frontend
2. You should see:
   - Dashboard with live alerts
   - Attack chart
   - SHAP explanations
   - All stats updating in real-time

**✅ Your IDS is now LIVE!** 🎉

---

## Monitoring & Management

### Viewing Logs

**Backend:**
1. Go to Space
2. Click **Logs** tab
3. Real-time logs show API activity
4. Search for errors

**Frontend:**
1. Go to Space
2. Click **Logs** tab
3. Check for connection errors

### Restarting Spaces

```
If something isn't working:

1. Go to Space Settings
2. Click "Restart Space"
3. Wait ~2-3 minutes for restart
4. Check logs for errors
```

### Updating Code

```bash
# Make changes locally

# Push to GitHub
git push origin main

# HF auto-builds and deploys (if connected via GitHub)
# Or manually trigger rebuild in Space settings
```

## Storage & Resources

- **Total RAM**: 16 GB for all Spaces
- **Storage**: Shared 50 GB
- **Boot time**: ~30 seconds per Space
- **Persistent**: Data survives restart

---

## Troubleshooting

### Issue: "Build failed"

**Cause**: Docker build error

**Solution**:
1. Check build logs in Space
2. Verify Dockerfile syntax
3. Check requirements.txt is valid
4. Ensure all dependencies exist

---

### Issue: "Service unavailable"

**Cause**: Space crashed or restarting

**Solution**:
1. Check Space status (should show Running)
2. Restart Space: Settings → Restart
3. Check logs for errors
4. Increase timeout if API is slow

---

### Issue: Frontend can't reach backend

**Cause**: API URL is wrong

**Solution**:
1. Check NEXT_PUBLIC_API_URL env var
2. Should be full URL to backend Space
3. Restart frontend Space
4. Check browser console for errors

---

### Issue: Database connection error

**Cause**: Connection string incorrect

**Solution**:
1. Verify Supabase credentials
2. Check DATABASE_URL is correct
3. Ensure `?sslmode=require` is included
4. Restart backend Space

---

### Issue: "Out of memory"

**Cause**: ML models too large

**Solution**:
1. HF Spaces have 16GB RAM (plenty!)
2. Check if multiple Spaces running
3. Restart Space to clear cache
4. Monitor memory usage in logs

---

## Cost Summary

```
Service              Monthly Cost    Annual Cost
─────────────────────────────────────────────────
Hugging Face Spaces  $0              $0
Supabase PostgreSQL  $0 (free tier)  $0
Upstash Kafka        $0 (free tier)  $0
─────────────────────────────────────────────────
TOTAL               $0/MONTH        $0/YEAR

No card required. Completely free. Forever.
```

---

## Your Deployment URLs

### After Deployment:

```
Backend API:
https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-backend

Frontend Dashboard:
https://huggingface.co/spaces/YOUR_USERNAME/xguard-ids-frontend

Supabase Database:
https://app.supabase.com/project/YOUR_PROJECT_ID/editor/1

Upstash Kafka:
https://console.upstash.io/kafka
```

---

## Success Checklist

```
✅ Deployment Complete
├─ [ ] HF account created (no card!)
├─ [ ] Backend Space deployed (✅ running)
├─ [ ] Frontend Space deployed (✅ running)
├─ [ ] Supabase database connected
├─ [ ] Upstash Kafka configured
├─ [ ] Environment variables set
└─ [ ] Services can communicate

✅ Functionality Working
├─ [ ] Backend /api/v1/health returns 200
├─ [ ] Frontend loads in browser
├─ [ ] API predictions work
├─ [ ] Database stores predictions
├─ [ ] Kafka topic working
└─ [ ] SHAP explanations display

✅ Monitoring Ready
├─ [ ] Can see logs in HF dashboard
├─ [ ] Can restart Spaces if needed
├─ [ ] Know how to update code
└─ [ ] Understand storage limits
```

---

## Next Steps

### Immediate (Day 1)
- [ ] Verify all services running
- [ ] Test with sample predictions
- [ ] Check logs for errors
- [ ] Confirm database saving data

### Short-term (Week 1)
- [ ] Monitor performance
- [ ] Test with real network traffic
- [ ] Verify SHAP explanations
- [ ] Check response times

### Medium-term (Month 1)
- [ ] Optimize inference time
- [ ] Add monitoring alerts (optional)
- [ ] Set up automated traffic simulation
- [ ] Plan model retraining schedule

### Long-term (Month 3+)
- [ ] Consider upgrading storage
- [ ] Monitor Supabase usage
- [ ] Plan scaling strategy
- [ ] Document learnings

---

## Important Notes

- **Always Running**: Unlike Render, Spaces don't spin down
- **Free Tier**: Completely free with no time limits
- **Storage**: Limited to 50GB total (plenty for IDS)
- **RAM**: 16GB shared across all your Spaces
- **Updates**: Push to GitHub and HF auto-deploys
- **Backups**: HF auto-saves Spaces regularly

---

## Support & Resources

| Need | Resource |
|------|----------|
| HF Spaces Docs | https://huggingface.co/docs/hub/spaces |
| Supabase Help | https://supabase.com/docs |
| Upstash Docs | https://upstash.com/docs/kafka |
| FastAPI Guide | https://fastapi.tiangolo.com |
| Next.js Deploy | https://nextjs.org/docs/deployment |

---

## Summary

```
🎯 YOUR DEPLOYMENT STACK (TRULY FREE!)

┌────────────────────────────────────────┐
│   XGuard AI IDS on Hugging Face Spaces  │
├────────────────────────────────────────┤
│   Frontend (Next.js)                    │
│   ↓                                     │
│   Backend (FastAPI) + ML Models         │
│   ↓                                     │
│   PostgreSQL (Supabase) + Kafka         │
│                                        │
│   Status: LIVE & PRODUCTION READY 🚀    │
│   Cost: $0/month forever                │
│   Card Needed: NO ✓                     │
│   Always Running: YES ✓                 │
│                                        │
└────────────────────────────────────────┘

TIME TO DEPLOYMENT: ~50 minutes
COST: $0/month (truly, forever)
QUALITY: Production-grade, always on
HASSLE: Minimal (no card, no limits)
```

---

**You're all set! Deploy your IDS on Hugging Face Spaces RIGHT NOW!** 🚀

No credit card. No costs. Ever. Completely free!

---

**Created**: April 12, 2026  
**Last Updated**: April 12, 2026  
**Status**: Ready for deployment  
**Maintained by**: XGuard AI Team
