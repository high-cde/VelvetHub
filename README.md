# VelvetHub / Red Velvet Live Club

VelvetHub è un club digitale 18+ in italiano per live room, podcast, scrittura, community e gioco narrativo. Il tono è adulto, elegante e consensuale: niente contenuti sessuali espliciti, niente minori, niente coercizione, niente sfruttamento e niente organizzazione di incontri reali.

## Moduli principali

- **Live Club**: room, chat, creator, safety report, podcast e community.
- **Radar della Carne / VR.Crew**: gioco 3D integrato in `/radar`, con Rubina Mistress e Kali Master come guide AI finzionali, quattro missioni, ruoli ludici, limiti, safeword, aftercare e inventario cosmetico avatar non esplicito.
- **Rewards**: DSN Credits e milestone interne sono separati da token e pagamenti. Il contratto/token $DSN può essere consultato solo dal link esterno verificato; nessun claim, wallet signing o airdrop è automatico.
- **Integrazioni**: Discord server `940846207222317057`, pagina Facebook, WhatsApp Cloud API e provider stream sono predisposti ma non dichiarati attivi senza credenziali, allowlist, opt-in e verifica del provider.

## Avvio

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
BOT_SELF_TEST=1 node integrations-velvet-bot.mjs
```

Il gioco già compilato è servito da `client/public/radar/` e si apre da `http://localhost:3000/radar`. Per la radio lo-fi H24 configurare solo audio originale o licenziato dall’operatore: il repository non incorpora musica commerciale né simula una live radio.

## Sicurezza e pubblicazione

Prima di attivare bot Discord/Facebook/WhatsApp, live video, directory locali o advertising adulto servono credenziali ufficiali, policy dei provider, age verification, consenso, moderazione, audit log, opt-out e revisione GDPR/legale. Il bot si avvia in modalità disabilitata senza segreti e blocca richieste con minori, coercizione, sfruttamento, doxxing, incontri non verificati, media espliciti, pagamenti o promesse crypto.

Il workflow e la configurazione di pubblicazione devono essere impostati sul repository pubblico corretto. Non eseguire commit di token o file `.env`.
