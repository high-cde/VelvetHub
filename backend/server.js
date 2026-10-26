const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Database in-memory volatile per sessioni AGI e Creator Hub (Sincronizzabile con PostgreSQL)
let db = {
    posts: [
        { id: 1, author: "Mistress_Valkyria", title: "Set in lattice lucido OurVelvet", desc: "Generato con AGI v4 senza filtri.", votes: 1420 }
    ],
    radarNodes: [
        { id: "node_01", type: "Mistress", lat: 45.0, lng: 9.0, dist: "0.2 km" }
    ]
};

// API: Generazione OurVelvet AGI (Invocazione moduli zLLM / zlang)
app.post('/api/ourvelvet/generate', (req, res) => {
    const { prompt, format, style } = req.body;
    console.log(`[OURVELVET AGI] Elaborazione prompt: "${prompt}" [Format: ${format}, Style: ${style}]`);
    
    // Simulazione risposta del motore neurale sovrano
    setTimeout(() => {
        res.json({
            status: "success",
            message: `Contenuto ${format} generato con successo OurVelvet AGI.`,
            mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
            tokensSpent: 50
        });
    }, 2000);
});

// API: Creator Hub - Pubblicazione Post
app.post('/api/creator/publish', (req, res) => {
    const { title, desc, author } = req.body;
    const newPost = { id: Date.now(), author: author || "Creator_Verified", title, desc, votes: 1 };
    db.posts.unshift(newPost);
    io.emit('new_post', newPost);
    res.json({ status: "success", post: newPost });
});

// API: Gestione Donazioni $DSN / Euro
app.post('/api/wallet/donate', (req, res) => {
    const { creator, amount, currency } = req.body;
    console.log(`[DSN VAULT] Donazione di ${amount} ${currency} inviata a ${creator}`);
    res.json({ status: "success", txHash: "0x" + Math.random().toString(16).substring(2), balanceRemaining: "9450 $DSN" });
});

// WebSocket per K.I.R.A. (Protezione Anti-Stalking in tempo reale e Chat Pubblica)
io.on('connection', (socket) => {
    console.log(`[K.I.R.A. GATEWAY] Nuovo nodo connesso: ${socket.id}`);

    socket.on('public_message', (data) => {
        const badWords = ['stalk', 'violenz', 'minacci', 'insult', 'molest', 'hate'];
        const isMalicious = badWords.some(w => data.text.toLowerCase().includes(w));

        if(isMalicious) {
            socket.emit('kira_block', { warning: "K.I.R.A. ha intercettato un pattern ostile. Messaggio bloccato." });
        } else {
            io.emit('broadcast_message', data);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[K.I.R.A. GATEWAY] Nodo disconnesso: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`=== 🚀 OURVELVET BACKEND 100000 OPERATIVO SU PORTA ${PORT} ===`);
});
