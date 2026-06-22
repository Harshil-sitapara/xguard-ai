#!/usr/bin/env bash
set -euo pipefail

KAFKA_HOME="${KAFKA_HOME:-/opt/kafka}"
KAFKA_BOOTSTRAP="${KAFKA_BOOTSTRAP_SERVERS:-127.0.0.1:9092}"
KAFKA_HOST="${KAFKA_HOST:-127.0.0.1}"
KAFKA_PORT="${KAFKA_PORT:-9092}"
KAFKA_CONTROLLER_PORT="${KAFKA_CONTROLLER_PORT:-9093}"
KAFKA_NODE_ID="${KAFKA_NODE_ID:-1}"
KAFKA_DATA_DIR="${KAFKA_DATA_DIR:-/tmp/kraft-combined-logs}"
KAFKA_HEAP_OPTS="${KAFKA_HEAP_OPTS:--Xms256m -Xmx256m}"
KAFKA_TOPIC_TRAFFIC="${KAFKA_TOPIC_TRAFFIC:-network-traffic}"
KAFKA_TOPIC_ALERTS="${KAFKA_TOPIC_ALERTS:-ids-alerts}"

APP_PID=""
KAFKA_PID=""

cleanup() {
  for pid in "$APP_PID" "$KAFKA_PID"; do
    if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
    fi
  done
  wait || true
}

trap cleanup SIGTERM SIGINT

mkdir -p "${KAFKA_DATA_DIR}"

KAFKA_CONFIG="/tmp/kafka-kraft.properties"
cat > "${KAFKA_CONFIG}" <<EOF
process.roles=broker,controller
node.id=${KAFKA_NODE_ID}
controller.quorum.voters=${KAFKA_NODE_ID}@${KAFKA_HOST}:${KAFKA_CONTROLLER_PORT}
listeners=PLAINTEXT://${KAFKA_HOST}:${KAFKA_PORT},CONTROLLER://${KAFKA_HOST}:${KAFKA_CONTROLLER_PORT}
advertised.listeners=PLAINTEXT://${KAFKA_HOST}:${KAFKA_PORT}
listener.security.protocol.map=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT
controller.listener.names=CONTROLLER
inter.broker.listener.name=PLAINTEXT
log.dirs=${KAFKA_DATA_DIR}
num.partitions=1
offsets.topic.replication.factor=1
offsets.topic.num.partitions=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
group.initial.rebalance.delay.ms=0
auto.create.topics.enable=true
delete.topic.enable=true
EOF

if [[ ! -f "${KAFKA_DATA_DIR}/meta.properties" ]]; then
  CLUSTER_ID="$("${KAFKA_HOME}/bin/kafka-storage.sh" random-uuid)"
  "${KAFKA_HOME}/bin/kafka-storage.sh" format -t "${CLUSTER_ID}" -c "${KAFKA_CONFIG}"
fi

export KAFKA_HEAP_OPTS
"${KAFKA_HOME}/bin/kafka-server-start.sh" "${KAFKA_CONFIG}" &
KAFKA_PID=$!

READY="false"
for _ in $(seq 1 60); do
  if ! kill -0 "${KAFKA_PID}" 2>/dev/null; then
    echo "Kafka exited before becoming ready"
    wait "${KAFKA_PID}" || true
    exit 1
  fi

  if "${KAFKA_HOME}/bin/kafka-topics.sh" --bootstrap-server "${KAFKA_BOOTSTRAP}" --list >/dev/null 2>&1; then
    READY="true"
    break
  fi

  sleep 2
done

if [[ "${READY}" != "true" ]]; then
  echo "Kafka did not become ready in time"
  exit 1
fi

"${KAFKA_HOME}/bin/kafka-topics.sh" \
  --bootstrap-server "${KAFKA_BOOTSTRAP}" \
  --create \
  --if-not-exists \
  --topic "${KAFKA_TOPIC_TRAFFIC}" \
  --partitions 1 \
  --replication-factor 1

"${KAFKA_HOME}/bin/kafka-topics.sh" \
  --bootstrap-server "${KAFKA_BOOTSTRAP}" \
  --create \
  --if-not-exists \
  --topic "${KAFKA_TOPIC_ALERTS}" \
  --partitions 1 \
  --replication-factor 1

uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-7860}" &
APP_PID=$!

wait -n "${APP_PID}" "${KAFKA_PID}"
status=$?
cleanup
exit "${status}"
