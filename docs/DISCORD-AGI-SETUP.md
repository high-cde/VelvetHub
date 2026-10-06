# Collegare Kali e Rubina a Discord

Questa guida attiva il bot solo quando l’operatore ha configurato i segreti. **Non incollare token Discord, Meta o API in GitHub, chat o file pubblici.**

## 1. Crea il bot Discord

1. Apri [Discord Developer Portal](https://discord.com/developers/applications).
2. Crea una Application, poi aggiungi un Bot.
3. Genera un token nuovo e salvalo in un secret manager come `DISCORD_BOT_TOKEN`.
4. Abilita solo gli intent necessari. Per i messaggi testuali servono normalmente `Guilds` e, se si leggono messaggi, `Message Content Intent`.
5. Invita il bot nel server con OAuth2 URL Generator usando scope `bot` e `applications.commands`.
6. Concedi permessi minimi: vedere canali, inviare messaggi, usare comandi, leggere cronologia solo nei canali allowlist.

Usa questo invito pubblico per entrare nel server: <https://discord.gg/ZDPtFppTKW>.

## 2. Prepara i canali

Crea almeno:

- `#regole-18-plus`: age gate, privacy, consenso e divieto di contenuti espliciti;
- `#rubina`: canale per la companion Rubina;
- `#kali`: canale per la companion Kali;
- `#segnalazioni`: moderazione e sicurezza;
- `#annunci-bot`: solo comunicazioni approvate.

Imposta un ruolo adulto verificato secondo le regole e gli strumenti disponibili nella tua giurisdizione. Il bot non deve presumere l’età dalla sola dichiarazione in chat.

## 3. Configura le companion

Nel backend VelvetHub sono già presenti due endpoint protetti:

- `trpc.rubina.chat` — Rubina, mistress narrativa, autorevole e consensuale;
- `trpc.kali.chat` — Kali, master narrativo e slave di Rubina nella fiction, disciplinato e rispettoso.

Per portarli in Discord occorre aggiungere un adapter Gateway/Interactions che:

1. riceva `/rubina` o `/kali`;
2. controlli il canale allowlist e il ruolo adulto;
3. inoltri il testo al backend autenticato, mai direttamente con chiavi LLM nel bot;
4. risponda in ephemeral quando contiene dati di sicurezza;
5. registri audit minimo, opt-out e report;
6. limiti rate, lunghezza e contenuti secondo la stessa policy del sito.

L’adapter REST già presente (`integrations/velvet-bot.mjs`) può inviare messaggi, ma **non dichiara ancora attivo il Gateway conversazionale**: per questo serve un processo persistente con gestione WebSocket, slash commands, moderazione e secret runtime.

## 4. Variabili runtime

```env
DISCORD_BOT_TOKEN=nel_secret_manager
DISCORD_GUILD_ID=id_copiato_dal_portale_discord
DISCORD_INVITE_URL=https://discord.gg/ZDPtFppTKW
VELVET_BACKEND_URL=https://tuo-backend.example
```

`DISCORD_GUILD_ID` è una configurazione privata del bot, non va mostrata nelle card pubbliche. Se il token è stato mai condiviso, revocalo e generane uno nuovo.

## 5. Cosa non attivare

- niente DM automatici senza opt-in;
- niente contenuti sessuali espliciti, minori, coercizione, ricatti, doxxing o incontri reali;
- niente richieste di wallet, seed phrase, denaro o dati sensibili;
- niente payout `$DSN` automatici: i rewards del gioco restano punti/milestone non-custodial finché non esiste un contratto verificato, policy e claim manuale;
- niente impersonificazione di persone reali: Kali e Rubina restano companion AI dichiarate.
