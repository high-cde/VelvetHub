const http = require("http");
const fs = require("fs");

const PORT = 4188;
const CATALOG_PATH = "/opt/velvet-ai-dir/catalog.json";
const CLAIMS_LOG = "/var/lib/velvet-hub/ai_directory_claims.jsonl";
const ADMIN_KEY = process.env.VELVET_DIR_ADMIN_KEY || "velvet-supreme-2026";

function sendJson(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-velvet-key"
  });
  res.end(JSON.stringify(obj));
}

function readClaims(limit = 20) {
  if (!fs.existsSync(CLAIMS_LOG)) return [];
  const lines = fs.readFileSync(CLAIMS_LOG, "utf8").trim().split("\n").filter(Boolean);
  return lines.slice(-limit).reverse().map(l => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  if (req.url.startsWith("/api/catalog") && req.method === "GET") {
    try {
      const cat = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
      const recent = readClaims(10);
      return sendJson(res, 200, { ...cat, totalClaims: fs.existsSync(CLAIMS_LOG) ? fs.readFileSync(CLAIMS_LOG, "utf8").trim().split("\n").filter(Boolean).length : 0, recentClaims: recent });
    } catch (e) {
      return sendJson(res, 500, { ok: false, error: e.message });
    }
  }


  if (req.url.startsWith("/api/autopilot") && req.method === "POST") {
    let body = "";
    req.on("data", c => (body += c));
    req.on("end", async () => {
      const data = JSON.parse(body || "{}");
      const action = String(data.action || "tg_promo");
      const msg = "👑⚡ RUBINA MISTRESS × ZARA LSD (18+ · ROSSO): Super Command Deck & AI Directory attivi su https://ourvelvet.online/ai-directory/ | Deck: https://ourvelvet.online/command-deck/ | Swap $OV: https://swap.x-zdos.it/?ref=6C61wDacAtx3QHQYVw17fnm5GEaEAnc1XienNJKn2bsD";
      for (const target of ["TG-CHANNEL", "TG-GROUP"]) {
        fetch("http://127.0.0.1:4199/bus/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target, text: msg, source: "super-deck-" + action })
        }).catch(() => {});
      }
      return sendJson(res, 200, { ok: true, executed: action, dispatched: ["TG-CHANNEL", "TG-GROUP"], deck: "https://ourvelvet.online/command-deck/" });
    });
    return;
  }

  if (req.url.startsWith("/api/claims") && req.method === "GET") {
    return sendJson(res, 200, { ok: true, claims: readClaims(25) });
  }

  if (req.url.startsWith("/api/tools/add") && req.method === "POST") {
    let body = "";
    req.on("data", c => (body += c));
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        const key = req.headers["x-velvet-key"] || data.adminKey || "";
        if (key !== ADMIN_KEY) return sendJson(res, 403, { ok: false, error: "Chiave admin non valida." });
        if (!data.name || !data.launch_url) return sendJson(res, 400, { ok: false, error: "name e launch_url obbligatori." });

        const cat = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
        const newItem = {
          id: String(data.id || `tool-${Date.now().toString(36)}`),
          category: String(data.category || "Generatori AI (Img & Video)"),
          badge: String(data.badge || "PARTNER · 18+"),
          name: String(data.name),
          desc: String(data.desc || "Modulo 18+ integrato in Velvet City. Consenso esplicito · Safeword ROSSO."),
          reward_ov: Number(data.reward_ov || 35),
          launch_url: String(data.launch_url)
        };
        cat.items.unshift(newItem);
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(cat, null, 2));
        return sendJson(res, 200, { ok: true, item: newItem });
      } catch (e) {
        return sendJson(res, 400, { ok: false, error: e.message });
      }
    });
    return;
  }

  if (req.url.startsWith("/api/claim") && req.method === "POST") {
    let body = "";
    req.on("data", c => (body += c));
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        if (!data.adultConfirmed) {
          return sendJson(res, 400, { ok: false, error: "Conferma 18+, consenso esplicito e safeword ROSSO obbligatori." });
        }
        const entry = {
          ts: new Date().toISOString(),
          itemId: String(data.itemId || "unknown"),
          itemName: String(data.itemName || ""),
          rewardOv: Number(data.rewardOv || 0),
          wallet: String(data.wallet || "UNSET"),
          handle: String(data.handle || "anon"),
          source: String(data.source || "web-app"),
          safeword: "ROSSO",
          ref: "6C61wDacAtx3QHQYVw17fnm5GEaEAnc1XienNJKn2bsD"
        };
        fs.appendFileSync(CLAIMS_LOG, JSON.stringify(entry) + "\n");

        fetch("http://127.0.0.1:4199/bus/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: "TG-GROUP",
            source: "ai-directory-v2",
            text: `🏆 $OV CLAIM (${entry.source} · 18+ · ROSSO): ${entry.itemName || entry.itemId} (+${entry.rewardOv} $OV) | Handle: ${entry.handle} | Wallet: ${entry.wallet}`
          })
        }).catch(() => {});

        return sendJson(res, 200, { ok: true, claim: entry });
      } catch (e) {
        return sendJson(res, 400, { ok: false, error: e.message });
      }
    });
    return;
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[VELVET-AI-DIR-API v2] Listening on 127.0.0.1:${PORT}`);
});
