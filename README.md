# VelvetHub
## Red Velvet Live Club · Velvet Radar VR.Crew · OurVelvet

> **Un club digitale adulto, narrativo e consent-first.**
> Atmosfera dark-room, companion fiction, gioco 3D e community: intensità editoriale senza contenuti sessuali espliciti.

[![Validate VelvetHub](https://github.com/high-cde/VelvetHub/actions/workflows/pages.yml/badge.svg)](https://github.com/high-cde/VelvetHub/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-d7b46a.svg)](LICENSE)

VelvetHub è un’esperienza web in italiano per persone adulte: un luogo per esplorare storie, voci, podcast, live room e mondi condivisi costruiti attorno a **consenso, confini leggibili, privacy e possibilità di interrompere sempre**.

Il repository contiene tre anime collegate:

- **Red Velvet Live Club** — hub editoriale e community.
- **Velvet Radar / VR.Crew** — browser game 3D narrativo con missioni, ruoli ludici, aftercare e inventario cosmetico non esplicito.
- **OurVelvet** — atelier per creare companion fiction personalizzate con tono, memoria e confini configurabili.

---

## Indice

- [Esperienza](#esperienza)
- [Moduli](#moduli)
- [OurVelvet Companion Lab](#ourvelvet-companion-lab)
- [Radar della Carne / VR.Crew](#radar-della-carne--vrcrew)
- [Rewards e DSN](#rewards-e-dsn)
- [Integrazioni](#integrazioni)
- [Sicurezza e policy](#sicurezza-e-policy)
- [Sviluppo locale](#sviluppo-locale)
- [Qualità e workflow](#qualità-e-workflow)
- [Struttura del repository](#struttura-del-repository)
- [Android, PC e VR](#android-pc-e-vr)
- [Pubblicazione](#pubblicazione)
- [Roadmap](#roadmap)

---

## Esperienza

VelvetHub usa un linguaggio sensuale **solo in senso atmosferico e letterario**: luci basse, radio lo-fi, mistero, rituali narrativi e dialoghi consapevoli. Non è una piattaforma per pornografia, incontri sessuali o transazioni erotiche.

Ogni spazio è progettato con:

- age gate 18+;
- consenso esplicito e revocabile;
- safeword e stop immediato;
- aftercare e strumenti di pausa;
- privacy by design;
- segnalazione e moderazione;
- divieto di minori, coercizione, sfruttamento, doxxing e contenuti espliciti.

Le companion **Rubina** e **Kali** sono personaggi AI finzionali. Non impersonano persone reali e non devono essere presentate come esseri umani, professionisti o autorità.

---

## Moduli

| Modulo | Funzione | Stato |
|---|---|---|
| **Live Club** | Room, podcast, community, creator e safety hub | UI e flussi predisposti |
| **Velvet Radar** | Gioco 3D browser con missioni e scelte | Build integrata in `/radar/` |
| **OurVelvet** | Creazione di companion fiction personalizzate | Studio interattivo disponibile nel codice |
| **Rewards** | Milestone e DSN Credits dimostrativi | Non-custodial, nessun payout automatico |
| **Discord bridge** | Stato companion e adapter bot | Safe mode finché non vengono configurati segreti |
| **Facebook / WhatsApp / streaming** | Connettori predisposti | Non attivi senza credenziali, consenso e policy |

---

## OurVelvet Companion Lab

OurVelvet è lo studio creativo per costruire una companion narrativa in pochi passaggi:

- nome personalizzato;
- archetipo: confidente, narratrice noir, game host o mentor creativa;
- tono: caldo, ironico, elegante o cinematografico;
- modalità memoria trasparente;
- confini predefiniti selezionabili;
- preview live della voce e del perimetro scelto;
- salvataggio locale nel browser;
- **Esporta JSON** e **Importa JSON**.

Il formato esportato è versionato e contiene solo la configurazione creativa:

```json
{
  "version": 1,
  "companionName": "Luce Velvet",
  "archetype": "Confidente",
  "tone": "Calma e calda",
  "memory": "Solo preferenze che scelgo io",
  "selectedBoundaries": [
    "Niente contenuti espliciti",
    "Stop immediato su richiesta",
    "Nessun dato personale",
    "Nessun incontro reale"
  ]
}
```

Il file JSON **non contiene** token, chiavi API, wallet, conversazioni o dati dell’account. L’import valida versione, campi ammessi e confini conosciuti prima di aggiornare la preview.

---

## Radar della Carne / VR.Crew

Un’avventura narrativa 3D in browser con atmosfera anime-noir adulta, mai grafica o pornografica.

Include:

- missioni a scelta multipla;
- ruoli ludici Master, Mistress e Slave;
- limiti personali e safeword;
- aftercare e pausa immediata;
- Rubina Mistress e Kali Master come guide fiction;
- inventario cosmetico avatar: accessori, texture e capi fashion non espliciti;
- leaderboard dei Sigilli senza premi finanziari automatici;
- sezione VR.Crew predisposta per WebXR.

Il multiplayer, il voice layer e le integrazioni esterne restano **disattivati o predisposti** finché non esistono autenticazione, moderazione, allowlist, policy del provider e revisione legale adeguate.

---

## Rewards e DSN

La sezione Rewards usa milestone e crediti interni come meccanica di gioco. Il riferimento esterno al token Polygon `$DSN` è esclusivamente informativo:

<https://dexscreener.com/polygon/0x04c3be465e530b0a7617b197a91fcd990154027f>

VelvetHub non:

- custodisce fondi;
- firma transazioni;
- esegue claim o airdrop;
- promette rendimenti;
- esegue pagamenti automatici;
- collega wallet senza consenso esplicito.

Qualsiasi futura distribuzione dovrà essere non-custodial, verificabile, conforme alle policy del provider e sottoposta a revisione tecnica e legale.

---

## Integrazioni

### Discord

L’adapter in `integrations/velvet-bot.mjs` parte in safe mode senza segreti. Rubina e Kali possono essere collegate solo dopo aver configurato:

1. bot application e token nel secret store;
2. allowlist del server e dei canali;
3. permessi minimi necessari;
4. moderazione, log e opt-out;
5. verifica dell’età e regole della community.

Guida operativa: [docs/DISCORD-AGI-SETUP.md](docs/DISCORD-AGI-SETUP.md).

### Facebook, WhatsApp e streaming

Gli adapter sono predisposti, ma non vengono dichiarati attivi senza:

- credenziali ufficiali;
- OAuth configurato;
- webhook verificati;
- consenso alla pubblicazione;
- rate limit e audit log;
- policy della piattaforma rispettate.

**Non inserire mai token nel codice, nel README o nei commit.**

---

## Sicurezza e policy

VelvetHub è 18+ e consent-first. Sono vietati:

- minori o age ambiguity;
- coercizione, ricatto o sfruttamento;
- doxxing e raccolta invasiva di dati;
- media sessuali espliciti;
- incontri reali non verificati;
- promozione di servizi illegali;
- promesse finanziarie o crypto ingannevoli;
- impersonificazione di persone reali;
- automatismi che pubblicano o contattano utenti senza opt-in.

Per i flussi reali servono privacy notice, retention policy, strumenti di report, moderazione umana e revisione GDPR. Le companion devono ricordare di essere AI quando il contesto lo richiede e non devono incoraggiare dipendenza, isolamento o sostituzione delle relazioni umane.

---

## Sviluppo locale

Requisiti:

- Node.js 22+
- pnpm 10+
- Git

```bash
git clone https://github.com/high-cde/VelvetHub.git
cd VelvetHub
pnpm install --frozen-lockfile
pnpm dev
```

Comandi di qualità:

```bash
pnpm check       # TypeScript
pnpm test        # suite Vitest
pnpm bot:self-test
pnpm build       # client Vite + server bundle
```

Per la preview di produzione:

```bash
pnpm build
pnpm start
```

Il gioco già compilato è servito da `client/public/radar/` e viene aperto da `/radar/` nella build statica.

---

## Qualità e workflow

Il workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) è stato reso deterministico e senza deploy concorrente:

1. installa con lockfile bloccato;
2. esegue typecheck;
3. esegue la suite test;
4. esegue il safe-mode self-test del bot;
5. crea la build di produzione;
6. materializza le route statiche;
7. normalizza i percorsi asset per il sottopercorso `/VelvetHub/`;
8. carica un artefatto ispezionabile per 7 giorni.

Il deploy GitHub Pages legacy è separato dal workflow di validazione, così una collisione tra deploy automatici non può trasformare un controllo del codice in un run fallito.

Prima di aprire una pull request:

```bash
pnpm check && pnpm test && pnpm bot:self-test && pnpm build && git diff --check
```

---

## Struttura del repository

```text
client/                 App React, pagine e componenti UI
  public/radar/         Build giocabile incorporata
  src/pages/            Home, Rewards, OurVelvet, Safety e route
  src/components/       Navigazione, companion e room
server/                 API Express/tRPC e contratti backend
integrations/           Adapter bot in safe mode
docs/                   Guide operative e policy
game/                   Materiali e configurazioni del Radar
assets/                 Asset statici per la pubblicazione
radar/                  Entry point statico del gioco
ourvelvet/              Entry point statico OurVelvet
.github/workflows/      Validazione e artefatti Pages
```

---

## Android, PC e VR

### Android

Apri il sito in Chrome, usa il menu **⋮ → Aggiungi a schermata Home** e accedi al Radar dalla navigazione VelvetHub. Per audio e WebXR usa un dispositivo e un browser compatibili.

### PC

Chrome, Edge e Firefox sono supportati per l’esperienza browser. Il gioco resta utilizzabile senza visore.

### VR

La modalità VR richiede supporto WebXR, browser compatibile e visore configurato. VR.Crew è una sezione sperimentale: non va interpretata come spazio di incontri fisici.

---

## Pubblicazione

Il repository è predisposto per GitHub Pages sotto il progetto `VelvetHub`. La sorgente Pages legacy può richiedere propagazione dopo un push; il workflow di validazione non esegue deploy concorrenti.

URL di riferimento:

- Repository: <https://github.com/high-cde/VelvetHub>
- Sito: <https://high-cde.github.io/VelvetHub/>
- Radar: <https://high-cde.github.io/VelvetHub/radar/>
- OurVelvet: <https://high-cde.github.io/VelvetHub/ourvelvet/>

Se un browser mantiene una vecchia pagina nera o 404, apri una scheda in incognito o svuota la cache degli asset. Verifica sempre il workflow prima di considerare un deploy concluso.

---

## Roadmap

- [x] Hub editoriale e navigazione mobile.
- [x] Radar 3D integrato.
- [x] Companion Lab OurVelvet.
- [x] Import/export JSON locale.
- [x] Safe-mode bot e documentazione Discord.
- [x] CI di typecheck, test, bot self-test e build.
- [ ] OAuth Discord/Facebook con credenziali reali e consenso.
- [ ] Moderazione real-time e audit log di produzione.
- [ ] Voice e streaming solo con provider approvati.
- [ ] WebXR avanzato e multiplayer authoritative server.
- [ ] Eventuale claim on-chain non-custodial dopo audit dedicato.

---

## Licenza e responsabilità

Il software è distribuito secondo la licenza presente nel repository. I contenuti demo sono fiction e non costituiscono consulenza, promessa finanziaria, invito a incontri o autorizzazione a usare servizi di terzi.

**Intensità narrativa, confini chiari, controllo sempre nelle mani dell’utente.**
