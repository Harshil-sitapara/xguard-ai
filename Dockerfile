FROM python:3.11-slim

ARG KAFKA_VERSION=3.8.1
ARG SCALA_VERSION=2.13

WORKDIR /app

# Install Python deps, Java runtime, and tini for multi-process signal handling.
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    gcc \
    openjdk-17-jre-headless \
    procps \
    tini \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install a local single-node Kafka broker in KRaft mode.
RUN wget -q "https://archive.apache.org/dist/kafka/${KAFKA_VERSION}/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz" -O /tmp/kafka.tgz \
    && tar -xzf /tmp/kafka.tgz -C /opt \
    && ln -s "/opt/kafka_${SCALA_VERSION}-${KAFKA_VERSION}" /opt/kafka \
    && rm /tmp/kafka.tgz

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
