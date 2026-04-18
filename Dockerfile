FROM apache/kafka:3.8.1

WORKDIR /app

USER root

# Add Python and tini on top of the official Kafka image.
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    gcc \
    procps \
    python3 \
    python3-pip \
    tini \
    && rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/python3 /usr/local/bin/python \
    && ln -sf /usr/bin/pip3 /usr/local/bin/pip

# Copy requirements first (for better caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML models and preprocessor artifacts
COPY ml/models /app/models

# Copy backend application code and runtime scripts
COPY backend/app /app/app
COPY space /app/space

RUN chmod +x /app/space/start-space.sh

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=7860 \
    KAFKA_BOOTSTRAP_SERVERS=127.0.0.1:9092

# Expose port (HF Spaces uses 7860 by default)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:7860/api/v1/health || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/app/space/start-space.sh"]
