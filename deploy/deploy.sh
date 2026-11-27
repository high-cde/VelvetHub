#!/usr/bin/env bash
# Eseguire sulla VPS come utente "velvethub" dentro /opt/velvethub.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env ] || { echo "Manca .env (copia .env.production.example)"; exit 1; }
git pull --ff-only
pnpm install --frozen-lockfile
set -a; . ./.env; set +a
pnpm db:push
pnpm build
sudo systemctl restart velvethub
sudo systemctl --no-pager status velvethub | head -5
