# Velvet Bot — Discord, Facebook Page e WhatsApp

Questa cartella contiene adapter reali basati sulle API ufficiali, ma **non attivi di default**. Il bot non deve essere avviato in produzione senza credenziali, allowlist, revisione dei permessi e policy pubblicate.

## Canali supportati

| Canale | API | Stato iniziale |
|---|---|---|
| Discord | Bot REST API v10 | Predisposto; usa l’invito pubblico <https://discord.gg/ZDPtFppTKW> e configura il server nel secret runtime |
| Facebook | Graph API Page feed | Predisposto; richiede Page ID e Page Access Token |
| WhatsApp | WhatsApp Cloud API | Predisposto; richiede numero business, token e consenso del destinatario |

Il bot applica una policy minima: solo adulti, nessun minore, nessuna coercizione o sfruttamento, nessun doxxing o incontro non verificato, niente media sessuali espliciti, niente promesse crypto o pagamenti automatici. I messaggi vengono limitati e ripuliti; in produzione va aggiunta una coda con moderazione, audit log, opt-out e gestione reclami.

## Configurazione

Copia `.env.example` in un ambiente segreto. Non committare token. Il token Discord deve avere solo i permessi necessari nei canali allowlist; Facebook e WhatsApp devono usare app e pagine di proprietà o amministrate dall’operatore.

```bash
BOT_SELF_TEST=1 node integrations/velvet-bot.mjs
```

La modalità senza credenziali stampa `prepared_disabled`; questo è intenzionale. L’automazione non dichiara mai una connessione attiva quando il provider non ha restituito una risposta verificata.

## Limiti di pubblicazione

La pagina Facebook fornita dall’utente resta un link editoriale nel gioco finché non viene verificato l’accesso Page API. WhatsApp non deve essere usato per messaggi promozionali senza opt-in e template approvati. Discord deve avere canali 18+, age-gate e moderazione. Per una radio lo-fi 24/7 usare solo audio originale o con licenza; il client può mostrare un player verso uno stream che l’operatore configura, ma non include musica di terzi.
