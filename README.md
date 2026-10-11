# VelvetHub

Live club 18+ basato sul consenso, con community, store, podcast, scrittura e due giochi nel browser.

## Come usarlo

### Online (consigliato)
Apri <https://high-cde.github.io/VelvetHub/>. Non serve installare nulla.

| Pagina | Cosa trovi |
|---|---|
| `/` | Home con i collegamenti a tutto |
| `/gioco` | **Le disavventure di Vic Velluto**, avventura comica a enigmi in 5 livelli |
| `/radar` | **Velvet Radar: VR.Crew**, stanza 3D con Rubina e Kali |
| `/live`, `/store`, `/community`, `/podcasts`, `/rewards` | Sezioni del club (alcune richiedono l'accesso) |

### Giocare a Vic Velluto
1. Apri `/gioco` e conferma di avere almeno 18 anni.
2. Clicca un elemento della scena, poi scegli **Guarda**, **Prendi**, **Parla** o **Usa** (con un oggetto dell'inventario).
3. Usa i pulsanti in fondo alla scena per spostarti tra le stanze. Alcune uscite si sbloccano solo dopo aver risolto un enigma.
4. Nei dialoghi vince chi chiede e ascolta: insistere dopo un «no» toglie punti.
5. Completa l'obiettivo per ottenere il Sigillo e premi **Prossimo livello**. I livelli rispecchiano le sezioni del sito: Live Club, Store, Community, Podcast/Scrittura, Caveau dei Sigilli.
6. I progressi si salvano nel browser; **Ricomincia** azzera la partita.

I Sigilli sono punti di gioco locali: non sono denaro, token né promesse finanziarie.

### Sviluppo in locale
Requisiti: Node 22 e pnpm.

```bash
pnpm install
pnpm dev        # server + client in sviluppo
pnpm check      # typecheck
pnpm test       # test
pnpm build      # build di produzione
```

### Pubblicazione
Il sito è statico su GitHub Pages: le pagine nella radice del repository sono generate dalla build (`pnpm build` con `GITHUB_ACTIONS=true`, poi copia delle route come in `.github/workflows/pages.yml`). Dopo ogni modifica al client va rigenerata la build e fatto `git push origin main`.

### Funzioni che richiedono un server
Sessioni multiplayer VR Crew (`/crew`, chat live, strade e negozi), login, LiveKit e database non funzionano su Pages: servono hosting con backend e variabili d'ambiente (`DATABASE_URL`, credenziali LiveKit, ecc.). Il codice è già nel repository (`server/crew.ts`, `client/src/pages/Crew.tsx`); le sessioni sono in memoria e si perdono al riavvio.

## Storia del primo livello del Radar

### L’Anticamera: il patto della soglia

Il primo livello di **Velvet Radar: VR.Crew** è un prologo narrativo completo, non una semplice schermata tutorial. La persona giocante riceve una busta color prugna con il sigillo `V.R.` e una frase: **«Entra soltanto con ciò che sei disposto a dichiarare.»**

La busta apre una stanza virtuale fatta di velluto scuro, una lampada ambrata e quattro porte ancora spente. Rubina e Kali non impongono una prova: accompagnano una scelta. La domanda dell’Anticamera è semplice e seria: **quale parte della tua esperienza deve restare intoccabile?**

Il capitolo si sviluppa in cinque movimenti:

1. **La busta senza mittente** — Il mistero introduce la fiction senza creare obblighi o promesse reali.
2. **La stanza che ascolta** — Rubina, guida AI finzionale, chiede di nominare un confine prima di proseguire.
3. **Il patto provvisorio** — Kali chiarisce che Master, Mistress e Slave sono ruoli ludici modificabili, non identità o autorizzazioni reali.
4. **Il primo segnale** — Il limite e la safeword diventano segnali narrativi di cura; la porta successiva si illumina soltanto come metafora della chiarezza.
5. **Aftercare: la luce accesa** — La scena termina con una pausa e con il promemoria che tornare a sé è parte del rito.

### Obiettivo del livello

Per chiudere il primo capitolo bisogna superare l’age-gate 18+, scegliere un ruolo ludico, dichiarare un limite, impostare una safeword, aprire il dossier e raccogliere il primo Sigillo di Velluto. Il Sigillo è un punto locale di gioco: non è token, denaro, claim o promessa finanziaria.

Il livello non premia la sottomissione né l’obbedienza. Riconosce invece la capacità di mantenere una via d’uscita, cambiare idea e concludere la scena con maggiore chiarezza. **Pausa sicura** resta sempre disponibile e interrompere non annulla il percorso.

La storia è integrata nel client Three.js del Radar e viene distribuita anche nella build `/radar/` di VelvetHub.

## Qualità del codice

ESLint (flat config in `eslint.config.js`) copre i file TypeScript/React di `client/`, `server/` e `shared/`.

```bash
pnpm lint      # analisi locale
pnpm lint:ci   # usato in CI: fallisce con errori o con più di 100 warning
pnpm check     # typecheck
pnpm test
```

Regole: `@eslint/js` + `typescript-eslint` recommended, `react-hooks` sul client. Le variabili inutilizzate con prefisso `_` sono ignorate e i blocchi `catch {}` vuoti sono consentiti.

## Deploy

Il sito statico viene pubblicato su GitHub Pages (https://high-cde.github.io/VelvetHub/) **solo** dalla build CI: i file `index.html`, `404.html` e le cartelle di route non sono più versionati nella root.

1. Abilita **Settings → Pages → Source: GitHub Actions**.
2. Il workflow `.github/workflows/pages.yml` esegue lint, typecheck, test e build, copia `index.html` in ogni route statica (+ `404.html` come fallback SPA) e pubblica `dist/public` con `actions/deploy-pages`. `/radar/` è la build statica separata inclusa da `client/public/radar`.
3. Variabili opzionali di build (`VITE_*`, es. `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`) possono essere impostate come variabili d'ambiente del workflow.
4. Senza backend (o senza `VITE_OAUTH_PORTAL_URL`/`VITE_APP_ID`) il client entra in modalità **anteprima**: nessun redirect OAuth, nessuno spinner infinito (timeout 4s), age-gate 18+ e accesso anteprima.
5. Le funzioni live e l'autenticazione richiedono il server Express (`server/_core/index.ts`) ospitato separatamente.
