require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const ECOSYSTEM_CONFIG = {
  OV: { name: "OurVelvet", network: "Solana", ca: "2EN6Y1zM4yyt41gE2muzdJSAgRCAZiXqnmkgpbrspump", dex: "https://pump.fun/2EN6Y1zM4yyt41gE2muzdJSAgRCAZiXqnmkgpbrspump" },
  DSN: { name: "DSN NetKali", network: "EVM", ca: "0xfc90516a1f736FaC557e09D8853dB80dA192c296", dex: "https://dexscreener.com/search?q=0xfc90516a1f736FaC557e09D8853dB80dA192c296" }
};

function verifyTelegramInitData(initData) {
  if (!initData || !BOT_TOKEN) return false;
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    const dataCheckString = Array.from(urlParams.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([key, val]) => `${key}=${val}`).join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    return calculatedHash === hash;
  } catch (e) { return false; }
}

app.get('/api/ecosystem/status', (req, res) => {
  res.json({ status: "ONLINE", node: "K.I.R.A. Sovereign Gateway v2.6", tokens: ECOSYSTEM_CONFIG, timestamp: new Date().toISOString() });
});

app.post('/api/agi/generate', (req, res) => {
  const { initData, prompt, format, style } = req.body;
  if (BOT_TOKEN && !verifyTelegramInitData(initData)) return res.status(403).json({ error: "Firma Telegram non valida." });
  if (!prompt) return res.status(400).json({ error: "Prompt mancante." });
  res.json({ status: "success", message: "Task inoltrato al cluster AGI.", taskId: crypto.randomBytes(8).toString('hex'), tokensInvolved: ["$OV", "$DSN"] });
});

app.post('/api/hub/donate', (req, res) => {
  const { initData, tokenSymbol, amount, creator } = req.body;
  if (BOT_TOKEN && !verifyTelegramInitData(initData)) return res.status(403).json({ error: "Firma non valida." });
  res.json({ status: "recorded", message: `Donazione di ${amount} $${tokenSymbol} registrata nel DSN Vault.` });
});

app.listen(PORT, '127.0.0.1', () => console.log(`🚀 VelvetHub Backend attivo su http://127.0.0.1:${PORT}`));
