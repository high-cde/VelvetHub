# Deploy VelvetHub

## Obiettivo
Portare online il repository GitHub `high-cde/VelvetHub` come applicazione full-stack funzionante, preservando il client React/Vite, il server Express/tRPC, l’autenticazione email/password, il database Drizzle/MySQL e gli asset esistenti.

## Implementazione
- **Frontend:** `client/`, compilato da Vite in `dist/public`.
- **Backend:** `server/`, bundle Express in `dist/index.js`, con API tRPC sotto `/api/trpc`.
- **Persistenza:** schema e migrazioni in `drizzle/`, con database MySQL gestito.
- **Runtime:** Dockerfile Node 22 con pnpm 10.4.1, `NODE_ENV=production` e porta `PORT`.
- **Sessioni:** `JWT_SECRET` protetto nel progetto; cookie HTTPS con `SameSite=None` già previsto dal codice.
- **Routing:** fallback SPA Express e `client/public/manus-routes.json` sincronizzato con le pagine Wouter.
- **Health check:** `GET /healthz` pubblico e non autenticato.

## Direzione visiva
- **Movimento:** “Neon da Camera”, una lettura dark-digital dell’editoriale notturno.
- **Principi:** contrasto controllato, energia concentrata, texture vellutata e gerarchie funzionali.
- **Colore:** fondo quasi nero per profondità; verde lime elettrico come accento distintivo e segnale d’azione.
- **Layout:** composizione a fasce e pannelli sovrapposti, evitando una griglia centrale uniforme.
- **Motivi:** bordi luminosi sottili, superfici scure stratificate, micro-accenti lime.
- **Interazione:** stati hover/focus brevi e leggibili, con feedback cromatico senza decorazione superflua.
- **Animazione:** transizioni rapide e morbide, micro-movimenti solo per indicare stato e direzione.
- **Tipografia:** Space Grotesk per la voce digitale e le gerarchie; mantenere la tipografia già presente nel codice quando non è necessario intervenire.
- **Essenza:** un club digitale intimo per creator e membri consenzienti, distinto dalla combinazione di community, live e rituale editoriale.
- **Voce:** diretta, calda, adulta; esempio: “Entra nel radar.” / “La tua stanza, alle tue regole.”
- **Marchio:** wordmark VelvetHub con segno a nastro/lume, senza sostituire la struttura funzionale esistente.
- **Colore proprietario:** lime elettrico `#B6FF4A`.

## Struttura
- `client/`: interfaccia React, pagine e asset pubblici.
- `server/`: Express, autenticazione, tRPC, storage e integrazioni.
- `shared/`: contratti e costanti condivisi.
- `drizzle/`: schema e migrazioni del database.
- `Dockerfile`: build e avvio di produzione.
