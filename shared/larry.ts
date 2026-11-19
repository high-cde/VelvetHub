export type Choice = { label: string; text: string; points: number; setFlag?: string };
export type Use = { item: string; text: string; points?: number; gives?: string; setFlag?: string; consume?: boolean };
export type Hotspot = {
  id: string;
  name: string;
  icon: string;
  look: string;
  take?: string;
  needsFlag?: string;
  hiddenUntil?: string;
  talk?: { intro: string; choices: Choice[]; doneText: string; doneFlag: string };
  uses?: Use[];
};
export type Room = { id: string; name: string; description: string; exits: { label: string; to: string; needsFlag?: string; locked?: string }[]; hotspots: Hotspot[] };
export type Level = { id: number; title: string; mirrors: string; intro: string; goalFlag: string; outro: string; start: string; rooms: Room[] };

export type GameState = {
  level: number;
  room: string;
  inventory: string[];
  flags: string[];
  taken: string[];
  score: number;
  log: string[];
  finished: boolean;
};

export const ITEMS: Record<string, string> = {
  busta: "Busta color prugna",
  sigillo: "Sigillo di velluto",
  gettoni: "Gettoni Velvet",
  guanti: "Guanti di seta",
  penna: "Penna stilografica",
  regolamento: "Regolamento firmato",
  microfono: "Microfono d'ambra",
  racconto: "Racconto sentimentale",
  chiave: "Chiave del caveau",
  lanterna: "Lanterna d'ambra",
};

const ask = (intro: string, good: string, goodText: string, goodFlag: string, doneText: string): Hotspot["talk"] => ({
  intro,
  doneFlag: goodFlag,
  doneText,
  choices: [
    { label: good, text: goodText, points: 15, setFlag: goodFlag },
    { label: "Insistere dopo un «no»", text: "Ti guarda con calma: «Ho detto di no. Riprova quando saprai ascoltare.» Perdi punti e fascino.", points: -10 },
    { label: "Fare il galante a tutti i costi", text: "La battuta è così ridicola che anche tu ridi di te. Nulla di fatto.", points: -3 },
  ],
});

export const LEVELS: Level[] = [
  {
    id: 1, title: "Il Live Club", mirrors: "/live", goalFlag: "l1_done", start: "strada",
    intro: "Vic Velluto, aspirante seduttore dal talento nullo, vuole entrare nel Live Club. Gli serve un invito, un po' di dignità e il permesso di chi incontra.",
    outro: "Rubina ti consegna un Sigillo di velluto: il Live Club ti ha accolto.",
    rooms: [
      { id: "strada", name: "Via del Velluto", description: "Neon prugna, una fila di gente elegante e un cestino che brilla.", exits: [{ label: "Entra nell'Anticamera", to: "anticamera" }], hotspots: [
        { id: "cestino", name: "Cestino", icon: "🗑️", look: "Una busta color prugna spunta dai rifiuti.", take: "busta" },
        { id: "cartello", name: "Cartello 18+", icon: "🔞", look: "«Solo adulti. Il consenso è il biglietto d'ingresso.»" },
      ] },
      { id: "anticamera", name: "Anticamera", description: "Velluto, una lampada ambrata e Kali, la custode, con le braccia incrociate.", exits: [{ label: "Torna in strada", to: "strada" }, { label: "Sala Live", to: "sala", needsFlag: "kali_ok", locked: "Kali ti blocca il passo." }], hotspots: [
        { id: "kali", name: "Kali", icon: "💂", look: "Una custode che ha visto mille Vic e non si è convinta di nessuno.", uses: [{ item: "busta", text: "Kali legge l'invito, annuisce e apre la tenda.", points: 10, setFlag: "kali_ok", consume: true }] },
      ] },
      { id: "sala", name: "Sala Live", description: "Un palco, luci morbide e Rubina che chiacchiera con gli ospiti.", exits: [{ label: "Anticamera", to: "anticamera" }], hotspots: [
        { id: "rubina", name: "Rubina", icon: "🌹", look: "La guida AI finzionale del club.", talk: ask("Rubina sorride: «Ti va di fare due chiacchiere?»", "Chiedere: «Ti va di parlare con me?»", "Rubina: «Volentieri. Chiedere è già un ottimo inizio.»", "l1_done", "Rubina ti ha già dato il sigillo.") },
      ] },
    ],
  },
  {
    id: 2, title: "Lo Store", mirrors: "/store", goalFlag: "l2_done", start: "vetrina",
    intro: "Per fare colpo ci vuole stile. Vic entra nello Store con pochi gettoni e un cestino di scuse.",
    outro: "Compri i guanti di seta e Mara ti regala un Sigillo per la cortesia.",
    rooms: [
      { id: "vetrina", name: "Vetrina", description: "Manichini di velluto e prezzi che spaventano.", exits: [{ label: "Magazzino", to: "magazzino" }, { label: "Cassa", to: "cassa" }], hotspots: [
        { id: "manichino", name: "Manichino", icon: "🧥", look: "Indossa guanti di seta in saldo: 5 gettoni." },
      ] },
      { id: "magazzino", name: "Magazzino", description: "Scatoloni, polvere e un registratore di cassa rotto.", exits: [{ label: "Vetrina", to: "vetrina" }], hotspots: [
        { id: "cassetto", name: "Cassetto", icon: "🗄️", look: "Dentro tintinnano dei gettoni Velvet.", take: "gettoni" },
      ] },
      { id: "cassa", name: "Cassa", description: "Mara, la commessa, ti osserva sopra gli occhiali.", exits: [{ label: "Vetrina", to: "vetrina" }], hotspots: [
        { id: "mara", name: "Mara", icon: "🧾", look: "Gentile solo con chi è gentile.", uses: [{ item: "gettoni", text: "Mara incassa e ti porge i guanti di seta.", points: 10, gives: "guanti", consume: true }] },
        { id: "mara2", name: "Chiacchiera con Mara", icon: "💬", look: "Mara aspetta la tua mossa.", needsFlag: "has_guanti", talk: ask("Mara: «Ti vanno bene?»", "Ringraziare e salutare con garbo", "Mara: «Sei raro, Vic. Ecco un sigillo.»", "l2_done", "Hai già il sigillo.") },
      ] },
    ],
  },
  {
    id: 3, title: "La Community", mirrors: "/community", goalFlag: "l3_done", start: "piazza",
    intro: "La Community ha regole. Vic deve firmarle prima di poter parlare con qualcuno.",
    outro: "Teo ti accoglie nel gruppo e ti dà un Sigillo.",
    rooms: [
      { id: "piazza", name: "Piazza Ambra", description: "Tavolini, musica e una bacheca piena di avvisi.", exits: [{ label: "Caffè", to: "caffe" }], hotspots: [
        { id: "penna", name: "Penna", icon: "🖊️", look: "Una stilografica dimenticata su un tavolo.", take: "penna" },
        { id: "bacheca", name: "Bacheca", icon: "📌", look: "Regolamento: rispetto, consenso, niente molestie. Va firmato.", uses: [{ item: "penna", text: "Firmi il regolamento con una calligrafia terribile.", points: 10, gives: "regolamento", consume: false }] },
      ] },
      { id: "caffe", name: "Caffè", description: "Teo gestisce il tavolo dei nuovi arrivati.", exits: [{ label: "Piazza", to: "piazza" }], hotspots: [
        { id: "teo", name: "Teo", icon: "☕", look: "Accoglie solo chi ha firmato le regole.", needsFlag: "has_regolamento", talk: ask("Teo: «Sei dei nostri?»", "Mostrare il regolamento e chiedere di sederti", "Teo: «Benvenuto. Il posto è tuo.»", "l3_done", "Hai già il sigillo.") },
      ] },
    ],
  },
  {
    id: 4, title: "Studio, Podcast e Scrittura", mirrors: "/podcasts", goalFlag: "l4_done", start: "redazione",
    intro: "Vic vuole raccontare la sua storia. Serve un microfono, un racconto e un po' di umiltà.",
    outro: "Bea pubblica la tua puntata e ti consegna un Sigillo.",
    rooms: [
      { id: "redazione", name: "Redazione", description: "Fogli ovunque e una macchina da scrivere che ti guarda male.", exits: [{ label: "Cabina", to: "cabina" }], hotspots: [
        { id: "scrivania", name: "Scrivania", icon: "📝", look: "Un racconto sentimentale incompiuto.", take: "racconto" },
        { id: "bea", name: "Bea", icon: "🎧", look: "La produttrice. Vuole un racconto e una registrazione.", needsFlag: "has_racconto", uses: [{ item: "microfono", text: "Bea ascolta, sorride e dice che il racconto è tenero.", points: 10, setFlag: "bea_ok" }] },
        { id: "bea2", name: "Parla con Bea", icon: "💬", look: "Bea è pronta.", needsFlag: "bea_ok", talk: ask("Bea: «Pubblichiamo?»", "Chiedere il suo parere sinceramente", "Bea: «Sì. E grazie per aver chiesto.»", "l4_done", "Puntata pubblicata.") },
      ] },
      { id: "cabina", name: "Cabina di registrazione", description: "Pannelli fonoassorbenti e un microfono d'ambra.", exits: [{ label: "Redazione", to: "redazione" }], hotspots: [
        { id: "mic", name: "Microfono", icon: "🎙️", look: "Un microfono d'ambra.", take: "microfono" },
      ] },
    ],
  },
  {
    id: 5, title: "Il Caveau dei Sigilli", mirrors: "/rewards", goalFlag: "l5_done", start: "ingresso",
    intro: "Ultima porta: il Caveau dei Sigilli, dove si impara che fermarsi è una forza.",
    outro: "Rubina e Kali ti nominano Cavaliere del Velluto: fine della prova, inizio della serata.",
    rooms: [
      { id: "ingresso", name: "Ingresso del Caveau", description: "Una porta massiccia e un lume spento.", exits: [{ label: "Sala sicurezza", to: "sicurezza" }, { label: "Terrazza", to: "terrazza", needsFlag: "caveau_open", locked: "Il caveau è chiuso." }], hotspots: [
        { id: "porta", name: "Porta del caveau", icon: "🚪", look: "Serve una chiave.", uses: [{ item: "chiave", text: "Il caveau si apre con un clic soddisfacente.", points: 10, setFlag: "caveau_open" }] },
      ] },
      { id: "sicurezza", name: "Sala sicurezza", description: "Monitor, pulsanti e un manuale sulla safeword.", exits: [{ label: "Ingresso", to: "ingresso" }], hotspots: [
        { id: "manuale", name: "Manuale", icon: "📖", look: "«Una safeword ferma tutto, sempre, senza spiegazioni.»" },
        { id: "armadietto", name: "Armadietto", icon: "🔑", look: "Dentro c'è la chiave del caveau.", take: "chiave" },
      ] },
      { id: "terrazza", name: "Terrazza", description: "Luci della città e due guide che aspettano.", exits: [{ label: "Ingresso", to: "ingresso" }], hotspots: [
        { id: "guide", name: "Rubina e Kali", icon: "🌹", look: "Sorridono come chi sa il finale.", talk: { intro: "Rubina: «Cosa fai se qualcuno dice stop?»", doneFlag: "l5_done", doneText: "Prova superata.", choices: [
          { label: "Mi fermo subito e chiedo come sta", text: "Kali: «Esatto. Prova superata.»", points: 25, setFlag: "l5_done" },
          { label: "Provo a convincerlo", text: "Rubina scuote la testa: «No. Riprova.»", points: -10 },
          { label: "Ignoro e continuo", text: "Kali ti ferma subito: «Questa non è una scelta.»", points: -15 },
        ] } },
      ] },
    ],
  },
];

export function initialState(): GameState {
  return { level: 0, room: LEVELS[0].start, inventory: [], flags: [], taken: [], score: 0, log: [LEVELS[0].intro], finished: false };
}

const push = (s: GameState, text: string) => { s.log = [...s.log.slice(-39), text]; };
const has = (s: GameState, f: string) => s.flags.includes(f);

export const currentLevel = (s: GameState) => LEVELS[s.level];
export const currentRoom = (s: GameState) => currentLevel(s).rooms.find(r => r.id === s.room)!;

export function visibleHotspots(s: GameState) {
  return currentRoom(s).hotspots.filter(h => (!h.needsFlag || has(s, h.needsFlag)) && !(h.take && s.taken.includes(h.id)));
}

export type Action =
  | { type: "go"; to: string }
  | { type: "look"; target: string }
  | { type: "take"; target: string }
  | { type: "use"; item: string; target: string }
  | { type: "talk"; target: string; choice?: number }
  | { type: "next" };

function checkGoal(s: GameState) {
  const lv = currentLevel(s);
  if (has(s, lv.goalFlag) && !has(s, `${lv.goalFlag}_scored`)) {
    s.flags.push(`${lv.goalFlag}_scored`);
    s.score += 20;
    if (!s.inventory.includes("sigillo")) s.inventory.push("sigillo");
    push(s, `★ ${lv.outro}`);
  }
}

export function act(prev: GameState, a: Action): GameState {
  const s: GameState = { ...prev, inventory: [...prev.inventory], flags: [...prev.flags], taken: [...prev.taken], log: [...prev.log] };
  if (s.finished) return s;
  const lv = currentLevel(s);
  const levelDone = has(s, `${lv.goalFlag}_scored`);

  if (a.type === "next") {
    if (!levelDone) { push(s, "Non hai ancora finito questo livello."); return s; }
    if (s.level === LEVELS.length - 1) { s.finished = true; push(s, "Hai completato tutti e 5 i livelli. Complimenti, Vic."); return s; }
    s.level += 1;
    s.room = LEVELS[s.level].start;
    s.inventory = s.inventory.filter(i => i === "sigillo");
    push(s, `— Livello ${s.level + 1}: ${LEVELS[s.level].title} —`);
    push(s, LEVELS[s.level].intro);
    return s;
  }

  if (a.type === "go") {
    const exit = currentRoom(s).exits.find(e => e.to === a.to);
    if (!exit) return s;
    if (exit.needsFlag && !has(s, exit.needsFlag)) { push(s, exit.locked ?? "Non puoi passare."); return s; }
    s.room = exit.to;
    push(s, currentRoom(s).description);
    return s;
  }

  const spot = visibleHotspots(s).find(h => h.id === a.target);
  if (!spot) return s;

  if (a.type === "look") { push(s, spot.look); return s; }

  if (a.type === "take") {
    if (!spot.take) { push(s, "Non puoi prenderlo."); return s; }
    s.taken.push(spot.id);
    s.inventory.push(spot.take);
    s.flags.push(`has_${spot.take}`);
    s.score += 5;
    push(s, `Hai preso: ${ITEMS[spot.take]}.`);
    return s;
  }

  if (a.type === "use") {
    if (!s.inventory.includes(a.item)) return s;
    const u = spot.uses?.find(x => x.item === a.item);
    if (!u) { push(s, "Non succede nulla."); return s; }
    if (u.setFlag && has(s, u.setFlag)) { push(s, "L'hai già fatto."); return s; }
    if (u.gives) {
      if (s.inventory.includes(u.gives)) { push(s, "L'hai già fatto."); return s; }
      s.inventory.push(u.gives);
      s.flags.push(`has_${u.gives}`);
    }
    if (u.setFlag) s.flags.push(u.setFlag);
    if (u.consume) s.inventory = s.inventory.filter(i => i !== u.item);
    s.score += u.points ?? 0;
    push(s, u.text);
    checkGoal(s);
    return s;
  }

  if (a.type === "talk") {
    const t = spot.talk;
    if (!t) { push(s, "Non ha molto da dire."); return s; }
    if (has(s, t.doneFlag)) { push(s, t.doneText); return s; }
    if (a.choice === undefined) { push(s, t.intro); return s; }
    const c = t.choices[a.choice];
    if (!c) return s;
    s.score += c.points;
    if (c.setFlag) s.flags.push(c.setFlag);
    push(s, c.text);
    checkGoal(s);
    return s;
  }
  return s;
}

const STEPS: Record<number, { flag: string; hint: string }[]> = {
  1: [
    { flag: "has_busta", hint: "In strada c'è qualcosa di interessante nel cestino." },
    { flag: "kali_ok", hint: "Entra nell'Anticamera e mostra l'invito a Kali." },
    { flag: "l1_done", hint: "Vai in Sala Live e parla con Rubina: chiedi, non pretendere." },
  ],
  2: [
    { flag: "has_gettoni", hint: "Nel magazzino c'è un cassetto che tintinna." },
    { flag: "has_guanti", hint: "Porta i gettoni a Mara, alla cassa." },
    { flag: "l2_done", hint: "Parla con Mara e salutala con garbo." },
  ],
  3: [
    { flag: "has_penna", hint: "Una penna è rimasta su un tavolo della piazza." },
    { flag: "has_regolamento", hint: "Firma il regolamento sulla bacheca usando la penna." },
    { flag: "l3_done", hint: "Al Caffè, Teo accoglie chi ha firmato le regole." },
  ],
  4: [
    { flag: "has_racconto", hint: "Sulla scrivania c'è un racconto incompiuto." },
    { flag: "has_microfono", hint: "In cabina di registrazione trovi un microfono." },
    { flag: "bea_ok", hint: "Fai ascoltare il microfono a Bea, in redazione." },
    { flag: "l4_done", hint: "Parla di nuovo con Bea e chiedi il suo parere." },
  ],
  5: [
    { flag: "has_chiave", hint: "Nella sala sicurezza c'è un armadietto con una chiave." },
    { flag: "caveau_open", hint: "Usa la chiave sulla porta del caveau." },
    { flag: "l5_done", hint: "Sulla terrazza, scegli di fermarti subito." },
  ],
};

export function levelProgress(s: GameState) {
  const steps = STEPS[currentLevel(s).id] ?? [];
  const doneCount = steps.filter(x => has(s, x.flag)).length;
  return { done: doneCount, total: steps.length };
}

export function hintFor(s: GameState): string {
  const next = (STEPS[currentLevel(s).id] ?? []).find(x => !has(s, x.flag));
  return next ? next.hint : "Livello completato: premi «Prossimo livello».";
}
