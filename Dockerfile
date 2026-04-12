FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML models (must exist)
COPY ml/models /app/models

# Copy backend application code
COPY backend/app /app/app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Expose port (HF Spaces uses 7860 by default)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:7860/api/v1/health || exit 1

# Run FastAPI app on port 7860 for HF Spaces
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
