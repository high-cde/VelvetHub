#!/bin/bash
cd /home/xdosdev/velvet-repo/backend
npm install
pm2 delete ourvelvet-backend 2>/dev/null || true
pm2 start server.js --name "ourvelvet-backend"
pm2 save
echo "=== ✅ BACKEND AVVIATO CON SUCCESSO TRAMITE PM2 ==="
