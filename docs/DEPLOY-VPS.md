# Deploy di VelvetHub su VPS (accanto a x-zdos)

Il server Express serve sia `/api` sia il client buildato. GitHub Pages non basta: serve questo processo Node.

## 1. Prerequisiti (Debian/Ubuntu)
```bash
# Node 22 + pnpm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash - && sudo apt install -y nodejs git
sudo npm i -g pnpm
sudo apt install -y mariadb-server   # oppure usa un MySQL già presente
sudo useradd -r -m -s /bin/bash velvethub
```

## 2. Database dedicato
```sql
CREATE DATABASE velvethub CHARACTER SET utf8mb4;
CREATE USER 'velvethub'@'127.0.0.1' IDENTIFIED BY 'PASSWORD';
GRANT ALL ON velvethub.* TO 'velvethub'@'127.0.0.1';
```

## 3. Codice e configurazione
```bash
sudo git clone https://github.com/high-cde/VelvetHub /opt/velvethub
sudo chown -R velvethub: /opt/velvethub
sudo -u velvethub cp /opt/velvethub/.env.production.example /opt/velvethub/.env
sudo -u velvethub chmod 600 /opt/velvethub/.env
# modifica .env: DATABASE_URL, JWT_SECRET (openssl rand -hex 48), PORT (libera, diversa da x-zdos)
```

## 4. Prima build e servizio
```bash
cd /opt/velvethub
sudo -u velvethub bash -c 'pnpm install --frozen-lockfile && set -a && . ./.env && set +a && pnpm db:push && pnpm build'
sudo cp deploy/velvethub.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now velvethub
```
Se cambi `PORT`, aggiorna anche il reverse proxy.

## 5. HTTPS con reverse proxy
I cookie di sessione sono `Secure` su HTTPS (`server/_core/cookies.ts`), quindi il proxy deve inoltrare `X-Forwarded-Proto`.
- **Caddy**: usa `deploy/Caddyfile` (HTTPS automatico).
- **nginx**: usa `deploy/nginx.conf`, poi `sudo certbot --nginx -d velvet.example.com`.

Usa un (sotto)dominio dedicato; x-zdos resta sul suo host/porta/database.

Nota: la migrazione `0005` aggiunge un indice UNIQUE su `users.email`. Su un database esistente con email duplicate fallisce: rimuovi i duplicati prima di `pnpm db:push`.

## 6. Aggiornamenti
```bash
sudo -u velvethub /opt/velvethub/deploy/deploy.sh
```
Lo script usa `sudo systemctl`: concedi a `velvethub` solo quel comando via sudoers, ad es. `velvethub ALL=NOPASSWD: /bin/systemctl restart velvethub, /bin/systemctl status velvethub`.

## Fusione con x-zdos (livello 2, non ancora implementata)
Serve prima capire come x-zdos autentica gli utenti. Opzioni: SSO con `JWT_SECRET` e cookie condivisi su un dominio padre, stesso dominio con percorsi diversi nel proxy, database condiviso.
