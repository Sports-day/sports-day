#!/bin/bash
# ================================================================
# MySQL backup script (30-minute interval)
#
# Host crontab:
#   */30 * * * * cd /path/to/project && docker compose --profile tools run --rm backup /backup/backup.sh >> /var/log/sportsday-backup.log 2>&1
# ================================================================

set -euo pipefail

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_HOURS=${BACKUP_RETENTION_HOURS:-72}

echo "[$(date)] Starting backup..."

# ── MySQL dump ───────────────────────────────────────
MYSQL_FILE="${BACKUP_DIR}/mysql_${DATE}.sql.gz"

mysqldump \
  -h "${MYSQL_HOST:-mysql}" \
  -u "${MYSQL_USER:-root}" \
  -p"${MYSQL_PASSWORD}" \
  --single-transaction \
  --routines \
  --triggers \
  "${MYSQL_DATABASE:-sportsday}" \
  | gzip > "${MYSQL_FILE}"

echo "[$(date)] MySQL backup: ${MYSQL_FILE} ($(du -h "${MYSQL_FILE}" | cut -f1))"

# ── Cleanup old backups ──────────────────────────────
# 30分間隔 × 144 = 72時間(3日)分を保持
find "${BACKUP_DIR}" -name "mysql_*.sql.gz" -mmin "+$((RETENTION_HOURS * 60))" -delete
echo "[$(date)] Cleaned backups older than ${RETENTION_HOURS} hours"

echo "[$(date)] Backup complete!"
