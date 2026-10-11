#!/usr/bin/env bash
# Installazione automatica di VelvetHub su VPS Debian/Ubuntu. Eseguire come root:
#   DOMAIN=velvet.tuodominio.it bash install.sh
# Convive con altre app (es. x-zdos): usa porta interna 3100 e un sito Caddy/nginx dedicato.
set -euo pipefail
: "${DOMAIN:?Imposta DOMAIN=velvet.tuodominio.it}"
REPO="${REPO:-https://github.com/high-cde/VelvetHub.git}"
APP=/opt/velvethub
PORT="${PORT:-3100}"

apt-get update
apt-get install -y git curl mariadb-server openssl
command -v node >/dev/null || { curl -fsSL https://deb.nodesource.com/setup_22.x | bash -; apt-get install -y nodejs; }
corepack enable
systemctl enable --now mariadb

id velvethub >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash velvethub
[ -d "$APP/.git" ] || git clone "$REPO" "$APP"
chown -R velvethub:velvethub "$APP"

if [ ! -f "$APP/.env" ]; then
  DBPASS=$(openssl rand -hex 16)
  mysql -e "CREATE DATABASE IF NOT EXISTS velvethub CHARACTER SET utf8mb4; CREATE USER IF NOT EXISTS 'velvethub'@'127.0.0.1' IDENTIFIED BY '$DBPASS'; ALTER USER 'velvethub'@'127.0.0.1' IDENTIFIED BY '$DBPASS'; GRANT ALL ON velvethub.* TO 'velvethub'@'127.0.0.1'; FLUSH PRIVILEGES;"
  cat > "$APP/.env" <<EOF
NODE_ENV=production
PORT=$PORT
DATABASE_URL=******127.0.0.1:3306/velvethub
JWT_SECRET=$(openssl rand -hex 48)
CORS_ORIGINS=https://high-cde.github.io
EOF
  chown velvethub:velvethub "$APP/.env"; chmod 600 "$APP/.env"
fi

echo 'velvethub ALL=(root) NOPASSWD: /bin/systemctl restart velvethub, /bin/systemctl --no-pager status velvethub' > /etc/sudoers.d/velvethub
cp "$APP/deploy/velvethub.service" /etc/systemd/system/velvethub.service
systemctl daemon-reload
systemctl enable velvethub
sudo -u velvethub bash "$APP/deploy/deploy.sh"

if command -v caddy >/dev/null; then
  printf '\n%s {\n\tencode gzip\n\treverse_proxy 127.0.0.1:%s\n}\n' "$DOMAIN" "$PORT" >> /etc/caddy/Caddyfile
  systemctl reload caddy
elif command -v nginx >/dev/null; then
  sed "s/velvet.example.com/$DOMAIN/" "$APP/deploy/nginx.conf" > /etc/nginx/sites-available/velvethub
  ln -sf /etc/nginx/sites-available/velvethub /etc/nginx/sites-enabled/velvethub
  nginx -t && systemctl reload nginx
  echo "Per HTTPS: certbot --nginx -d $DOMAIN"
else
  echo "Nessun reverse proxy trovato: installa Caddy o nginx e punta a 127.0.0.1:$PORT"
fi
echo "Fatto: https://$DOMAIN"
