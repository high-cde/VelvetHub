# 🌐 MAPPA COMPLETA REINDIRIZZAMENTI & ENDPOINT `x-zdos.it` (VELVET CITY / ZDOS)
**Ultimo aggiornamento automatico:** `2026-11-21 02:16:47` · **VPS:** `vmi3082470` · **Regole 18+:** Consenso esplicito · Safeword `ROSSO`

---

## 🔹 Dominio: `velvet.x-zdos.it`
- **Listen:** `80, [::]:80`
- **Redirect server:** `301 https://$host$request_uri`

## 🔹 Dominio: `velvet.x-zdos.it`
- **Listen:** `443 ssl, [::]:443 ssl`
- **Root statica:** `/var/www/velvethub/dist/public`
- **Redirect server:** `301 /hub/`

| Sub-Path / Route | Destinazione / Regola Nginx |
| :--- | :--- |
| `= /lodge-card.html` | `alias /var/www/ourvelvet/lodge-card.html` |
| `^~ /assets/` | `root /var/www/velvethub/dist/public · try_files $uri @ourvelvet_assets` |
| `@ourvelvet_assets` | `root /var/www/ourvelvet · try_files $uri =404` |
| `^~ /api/solana/` | `proxy_pass http://127.0.0.1:8899` |
| `^~ /api/auth/` | `proxy_pass http://127.0.0.1:8899` |
| `^~ /api/access/` | `proxy_pass http://127.0.0.1:8899` |
| `^~ /api/velvet/` | `proxy_pass http://127.0.0.1:8899` |
| `^~ /api/verify-ov/` | `proxy_pass http://127.0.0.1:8899` |
| `= /badge` | `alias /var/www/velvethub/dist/public/badge.html` |
| `/api/meat-radar/` | `proxy_pass http://127.0.0.1:8899` |
| `/api/bridge/` | `proxy_pass http://127.0.0.1:8899` |
| `/api/global-id/` | `proxy_pass http://127.0.0.1:8899` |
| `= /api/solana-rpc` | `proxy_pass http://127.0.0.1:8899` |
| `= /api/geo/ip-radar` | `proxy_pass http://127.0.0.1:8899` |
| `/api/geo/` | `proxy_pass http://127.0.0.1:8899` |
| `/api/` | `proxy_pass http://127.0.0.1:8000` |
| `= /dashboard.html` | `alias /var/www/ourvelvet/dashboard.html` |
| `= /shop.html` | `alias /var/www/ourvelvet/shop.html` |
| `/api/shop/` | `proxy_pass http://127.0.0.1:8899` |
| `= /invite-gate.html` | `alias /var/www/ourvelvet/invite-gate.html` |
| `= /hub` | `return 301 /hub/` |
| `^~ /hub/assets/` | `alias /root/velvet-hub/client/dist/public/assets/ · try_files $uri =404` |
| `^~ /hub/` | `proxy_pass http://127.0.0.1:3000/` |
| `^~ /ai-directory/api/` | `proxy_pass http://127.0.0.1:4188/api/` |
| `^~ /map/` | `alias /var/www/velvethub/dist/public/map/ · try_files $uri $uri/ /map/index.html` |
| `^~ /command-deck/` | `alias /var/www/velvethub/dist/public/command-deck/ · try_files $uri $uri/ /command-deck/index.html` |
| `^~ /ai-directory/` | `alias /opt/velvet-hub-app/public/ai-directory/ · try_files $uri $uri/ /ai-directory/index.html` |
| `/` | `try_files $uri $uri/ /index.html` |

## 🔹 Dominio: `x-zdos.it www.x-zdos.it`
- **Listen:** `80, [::]:80`
- **Redirect server:** `301 https://$host$request_uri`

## 🔹 Dominio: `x-zdos.it www.x-zdos.it`
- **Listen:** `443 ssl, [::]:443 ssl`
- **Root statica:** `/var/www/x-zdos-portal/current`
- **Redirect server:** `301 /ide/; 301 /discord/verify/; 301 /xcloud/; 301 /zdesk/`

| Sub-Path / Route | Destinazione / Regola Nginx |
| :--- | :--- |
| `= /ide` | `return 301 /ide/` |
| `^~ /ide/` | `alias /var/www/zlang-ide/current/` |
| `= /discord/verify` | `return 301 /discord/verify/` |
| `^~ /discord/verify/` | `alias /var/www/zdiscord/verify/` |
| `^~ /discord/api/` | `proxy_pass http://127.0.0.1:8790` |
| `= /xcloud` | `return 301 /xcloud/` |
| `^~ /xcloud/` | `alias /var/www/xcloud/current/` |
| `= /zdesk` | `return 301 /zdesk/` |
| `/zdesk/` | `proxy_pass http://127.0.0.1:8787/` |
| `/` | `try_files $uri $uri/ =404` |

## 🔹 Dominio: `swap.x-zdos.it`
- **Listen:** `80, [::]:80`
- **Redirect server:** `301 https://$host$request_uri`

## 🔹 Dominio: `swap.x-zdos.it`
- **Listen:** `443 ssl, [::]:443 ssl`
- **Root statica:** `/var/www/zswap`

| Sub-Path / Route | Destinazione / Regola Nginx |
| :--- | :--- |
| `/` | `try_files $uri $uri/ /index.html =404` |

## 🔹 Dominio: `quest.x-zdos.it`
- **Listen:** `80, [::]:80`
- **Redirect server:** `301 https://$host$request_uri`

## 🔹 Dominio: `quest.x-zdos.it`
- **Listen:** `443 ssl, [::]:443 ssl`

| Sub-Path / Route | Destinazione / Regola Nginx |
| :--- | :--- |
| `/` | `proxy_pass http://127.0.0.1:3200` |

## 🔹 Dominio: `zdesk.x-zdos.it`
- **Listen:** `80, [::]:80`
- **Redirect server:** `301 https://$host$request_uri`

## 🔹 Dominio: `zdesk.x-zdos.it`
- **Listen:** `443 ssl, [::]:443 ssl`

| Sub-Path / Route | Destinazione / Regola Nginx |
| :--- | :--- |
| `/` | `proxy_pass http://127.0.0.1:8787` |

## 🔹 Dominio: `app.x-zdos.it`
- **Listen:** `80, [::]:80`
- **Redirect server:** `301 https://$host$request_uri`

## 🔹 Dominio: `app.x-zdos.it`
- **Listen:** `443 ssl, [::]:443 ssl`
- **Root statica:** `/var/www/app.x-zdos.it`

| Sub-Path / Route | Destinazione / Regola Nginx |
| :--- | :--- |
| `/` | `try_files $uri $uri/ /index.html =404` |
