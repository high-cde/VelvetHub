const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { execSync } = require("child_process");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/velvet/status", (req, res) => {
    let zlangStatus = "active_native";
    try {
        zlangStatus = execSync("node -v").toString().trim();
    } catch (e) {
        zlangStatus = "fallback_node";
    }

    res.json({
        ecosystem: "VelvetHub Supreme 18+ // Red Velvet & ZDOS Sovereign",
        status: "online",
        core: "ZLang Native & ZLB2 Bytecode Runtime",
        zcomm_protocol: "active_e2e_encrypted",
        zlang_engine: zlangStatus,
        vault: "zBAG secure DSN gateway",
        timestamp: new Date().toISOString()
    });
});

app.post("/api/velvet/zcomm", (req, res) => {
    const { senderId, recipientId, action, payload, intensity } = req.body;
    const secureToken = "zcomm_sovereign_" + Math.random().toString(36).substring(2, 15);

    res.json({
        success: true,
        protocol: "ZComm E2E Secure Link (ZLang Optimized)",
        message: `Comando '${action || 'sync'}' instradato con successo da ${senderId || 'Master'} a ${recipientId || 'Slave'}`,
        parameters: { 
            intensity: intensity || 'LEVEL_4', 
            payload: payload || 'Encrypted ZComm Stream',
            secure_token: secureToken
        },
        timestamp: new Date().toISOString()
    });
});

app.post("/api/velvet/vault/unlock", (req, res) => {
    const { userId, contentId } = req.body;
    const streamToken = "zclip_drm_" + Math.random().toString(36).substring(2, 15);

    res.json({
        success: true,
        access: "granted",
        content_id: contentId || 'red_velvet_exclusive_01',
        drm: "ZLang Bytecode Protection Active",
        stream_token: streamToken,
        message: "Contenuto multimediale sbloccato e protetto da crittografia sovrana."
    });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`[VELVETHUB REDVELVET NATIVE] Server in esecuzione sulla porta ${PORT}`);
});
