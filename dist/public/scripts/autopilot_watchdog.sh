#!/usr/bin/env bash
while true; do
  curl -sf http://127.0.0.1:4188/api/catalog >/dev/null || pm2 restart velvet-ai-dir-api
  systemctl is-active --quiet nginx || systemctl restart nginx
  python3 /opt/velvet-ai-dir/generate_xzdos_map.py >/dev/null 2>&1 || true
  sleep 60
done
