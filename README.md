

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

## Deploy

Il sito statico viene pubblicato su GitHub Pages (https://high-cde.github.io/VelvetHub/) **solo** dalla build CI: i file `index.html`, `404.html` e le cartelle di route non sono più versionati nella root.

1. Abilita **Settings → Pages → Source: GitHub Actions**.
2. Il workflow `.github/workflows/pages.yml` esegue typecheck, test e build, copia `index.html` in ogni route statica (+ `404.html` come fallback SPA) e pubblica `dist/public` con `actions/deploy-pages`. `/radar/` è la build statica separata inclusa da `client/public/radar`.
3. Variabili opzionali di build (`VITE_*`, es. `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`) possono essere impostate come variabili d'ambiente del workflow.
4. Senza backend (o senza `VITE_OAUTH_PORTAL_URL`/`VITE_APP_ID`) il client entra in modalità **anteprima**: nessun redirect OAuth, nessuno spinner infinito (timeout 4s), age-gate 18+ e accesso anteprima.
5. Le funzioni live e l'autenticazione richiedono il server Express (`server/_core/index.ts`) ospitato separatamente.
