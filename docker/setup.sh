#!/bin/bash
# ================================================================
# Sports-day production setup script (Proxmox VM)
#
# Usage:
#   chmod +x docker/setup.sh
#   ./docker/setup.sh your-domain.example.com admin@example.com
# ================================================================

set -euo pipefail

DOMAIN=${1:?"Usage: $0 <domain> [email]"}
EMAIL=${2:-"admin@${DOMAIN}"}

# .env から DATA_DIR を読み込み
source .env 2>/dev/null || true
DATA_DIR="${DATA_DIR:-./data}"

echo "================================"
echo " Sports-day setup"
echo " Domain:   ${DOMAIN}"
echo " Email:    ${EMAIL}"
echo " Data dir: ${DATA_DIR}"
echo "================================"

# ── 1. Check .env files exist ────────────────────────
if [ ! -f .env ]; then
  echo "[ERROR] .env not found. Copy and edit docker/.env.example first:"
  echo "  cp docker/.env.example .env"
  exit 1
fi

for app in admin panel form; do
  if [ ! -f "apps/${app}/.env.production" ]; then
    echo "[ERROR] apps/${app}/.env.production not found. Copy and edit:"
    echo "  cp apps/${app}/.env.production.example apps/${app}/.env.production"
    exit 1
  fi
done

# ── 2. Create data directories ──────────────────────
echo "[*] Creating data directories at ${DATA_DIR} ..."
mkdir -p "${DATA_DIR}/mysql"
mkdir -p "${DATA_DIR}/rustfs"
mkdir -p "${DATA_DIR}/ssl"
mkdir -p "${DATA_DIR}/certbot-webroot"
mkdir -p "${DATA_DIR}/backups"

# ── 3. Generate self-signed cert (temp, for initial nginx startup) ─
if [ ! -f "${DATA_DIR}/ssl/fullchain.pem" ]; then
  echo "[*] Generating temporary self-signed certificate..."
  openssl req -x509 -nodes -days 7 -newkey rsa:2048 \
    -keyout "${DATA_DIR}/ssl/privkey.pem" \
    -out "${DATA_DIR}/ssl/fullchain.pem" \
    -subj "/CN=${DOMAIN}"
fi

# ── 4. Start nginx for ACME challenge ────────────────
echo "[*] Starting nginx for ACME challenge..."
docker compose up -d nginx
sleep 3

# ── 5. Get real cert from Let's Encrypt ──────────────
echo "[*] Requesting Let's Encrypt certificate..."
docker compose --profile setup run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}"

# certbot saves to ${DATA_DIR}/ssl/live/${DOMAIN}/
# nginx needs the cert at ${DATA_DIR}/ssl/fullchain.pem
echo "[*] Linking Let's Encrypt certificate..."
ln -sf "live/${DOMAIN}/fullchain.pem" "${DATA_DIR}/ssl/fullchain.pem"
ln -sf "live/${DOMAIN}/privkey.pem"   "${DATA_DIR}/ssl/privkey.pem"

docker compose restart nginx

# ── 6. Start all services ────────────────────────────
echo "[*] Starting all services..."
docker compose up -d

echo "[*] Waiting for services to be ready..."
sleep 10

# ── 7. Create storage bucket ─────────────────────────
echo "[*] Creating storage bucket..."
docker compose exec rustfs sh -c \
  'mkdir -p /data/${STORAGE_BUCKET:-sportsday}' 2>/dev/null || true

# ── 8. Run DB migration ──────────────────────────────
echo "[*] Running database migrations..."
docker compose --profile setup run --rm migrate

echo ""
echo "========================================================"
echo " Setup complete!"
echo ""
echo " Verify: https://${DOMAIN}"
echo "         https://${DOMAIN}/admin/"
echo "         https://${DOMAIN}/form/"
echo ""
echo " Data stored at: ${DATA_DIR}"
echo "   ${DATA_DIR}/mysql/      - MySQL data"
echo "   ${DATA_DIR}/rustfs/     - Object storage"
echo "   ${DATA_DIR}/backups/    - DB backups (30min interval)"
echo "   ${DATA_DIR}/ssl/        - SSL certificates"
echo ""
echo " Next steps:"
echo "   1. (optional) Seed DB:"
echo "      docker compose --profile setup run --rm seed"
echo ""
echo "   2. Register crontab (crontab -e):"
echo "      */30 * * * * cd $(pwd) && docker compose --profile tools run --rm backup /backup/backup.sh >> /var/log/sportsday-backup.log 2>&1"
echo "      0 0 1 * * cd $(pwd) && docker compose --profile setup run --rm certbot renew && docker compose restart nginx"
echo "========================================================"
