import { assetPath } from "./site-path";
/* Velvet Salon: curated local data keeps the static experience usable while preserving privacy-first language. */

export type Creator = {
  id: string;
  handle: string;
  name: string;
  category: string;
  location: string;
  bio: string;
  initials: string;
  accent: string;
  image?: string;
  verified: boolean;
  availability: string;
  tags: string[];
  saved?: boolean;
};

export type Space = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  category: string;
  image: string;
  gradient: string;
};

export const assetUrls = {
  hero: assetPath("assets/red-velvet-hero-luxe.jpg"),
  editorial: assetPath("assets/rubina-editorial.jpg"),
  detail: assetPath("assets/red-velvet-room-after-dark.jpg"),
  card: assetPath("assets/red-velvet-garden-ritual.jpg"),
  mark: assetPath("assets/velvet-mark.svg"),
};

export const creators: Creator[] = [
  {
    id: "c1",
    handle: "marta.rossi",
    name: "Marta Rossi",
    category: "Fotografia analogica",
    location: "Milano · online",
    bio: "Ritratti quieti, camere d'albergo e un archivio di luce naturale. Condivido il dietro le quinte con calma, senza inseguire il rumore.",
    initials: "MR",
    accent: "from-[#551b6b] to-[#250c3c]",
    image: assetUrls.editorial,
    verified: true,
    availability: "Risponde oggi",
    tags: ["Ritratto", "Journal", "Analogico"],
    saved: true,
  },
  {
    id: "c2",
    handle: "luca.ferretti",
    name: "Luca Ferretti",
    category: "Sound design",
    location: "Roma · studio",
    bio: "Paesaggi sonori per immagini, brand e stanze che chiedono un'atmosfera precisa. Qui trovi appunti, prove e sessioni private.",
    initials: "LF",
    accent: "from-[#526579] to-[#202733]",
    image: assetUrls.detail,
    verified: true,
    availability: "Nuovo spazio",
    tags: ["Audio", "Processo", "Studio"],
  },
  {
    id: "c3",
    handle: "bea.neri",
    name: "Bea Neri",
    category: "Styling & set design",
    location: "Torino · online",
    bio: "Materiali, tavole colore e piccoli rituali per costruire un set che abbia una voce. Condivido il percorso, non solo il risultato.",
    initials: "BN",
    accent: "from-[#916058] to-[#33222a]",
    image: assetUrls.card,
    verified: false,
    availability: "Risponde domani",
    tags: ["Set", "Materiali", "Moodboard"],
  },
  {
    id: "c4",
    handle: "nora.marchi",
    name: "Nora Marchi",
    category: "Writing & research",
    location: "Bologna · online",
    bio: "Raccolgo storie laterali: editoria indipendente, corpi d'archivio e il piacere di fare domande migliori.",
    initials: "NM",
    accent: "from-[#6a6b82] to-[#252438]",
    image: assetUrls.hero,
    verified: true,
    availability: "Disponibile",
    tags: ["Scrittura", "Ricerca", "Letture"],
  },
  {
    id: "c5",
    handle: "samuele.k",
    name: "Samuele K.",
    category: "Motion & 3D",
    location: "Firenze · online",
    bio: "Oggetti che si muovono lentamente. Un laboratorio per esplorare luce, volume e imperfezioni digitali.",
    initials: "SK",
    accent: "from-[#59233f] to-[#30271f]",
    image: assetUrls.detail,
    verified: true,
    availability: "Nuovo spazio",
    tags: ["3D", "Motion", "Lab"],
  },
  {
    id: "c6",
    handle: "elena.v",
    name: "Elena Vieri",
    category: "Ceramica contemporanea",
    location: "Napoli · atelier",
    bio: "Forme lente, smalti opachi e una corrispondenza tra mani e materia. Nel mio spazio: prove, errori e pezzi in serie breve.",
    initials: "EV",
    accent: "from-[#80525b] to-[#332329]",
    image: assetUrls.editorial,
    verified: false,
    availability: "Risponde in 2 giorni",
    tags: ["Materia", "Atelier", "Oggetti"],
  },
];

export const spaces: Space[] = [
  { id: "atelier", eyebrow: "01 / Atelier", title: "Dietro le quinte", description: "Processi, prove e materia prima. Il lavoro prima del risultato.", category: "Processo", image: assetUrls.editorial, gradient: "from-[#5f174f] to-[#120b19]" },
  { id: "journal", eyebrow: "02 / Journal", title: "Voci e visioni", description: "Appunti lunghi, letture e conversazioni fuori dal feed.", category: "Journal", image: assetUrls.detail, gradient: "from-[#354b5c] to-[#151b25]" },
  { id: "after-hours", eyebrow: "03 / After hours", title: "A tempo tuo", description: "Spazi più raccolti per entrare quando vuoi e restare quanto serve.", category: "Premium", image: assetUrls.card, gradient: "from-[#6e193b] to-[#271b22]" },
];

export const conversations = [
  { id: "marta", name: "Marta Rossi", handle: "@marta.rossi", preview: "Ti ho lasciato una nota sul set di ieri.", time: "10:42", unread: true, initials: "MR", accent: "from-[#551b6b] to-[#250c3c]" },
  { id: "nora", name: "Nora Marchi", handle: "@nora.marchi", preview: "Grazie per aver salvato il journal.", time: "Ieri", unread: false, initials: "NM", accent: "from-[#6a6b82] to-[#252438]" },
  { id: "velvet", name: "Velvet Hub", handle: "@velvethub", preview: "La tua privacy è sempre modificabile.", time: "Lun", unread: false, initials: "VH", accent: "from-[#6c1d73] to-[#3d2638]" },
];

export const starterMessages: Record<string, { from: "them" | "me"; text: string; time: string }[]> = {
  marta: [
    { from: "them", text: "Ciao, grazie per essere passata nello spazio. Sto preparando una nuova serie di ritratti in luce d'inverno.", time: "10:38" },
    { from: "me", text: "Mi piace molto il ritmo dell'ultima serie. Quando sarà pronto il prossimo journal?", time: "10:40" },
    { from: "them", text: "Ti ho lasciato una nota sul set di ieri. Arriva prima lì che sul feed.", time: "10:42" },
  ],
  nora: [
    { from: "them", text: "Grazie per aver salvato il journal. Sto mettendo insieme le fonti per il prossimo capitolo.", time: "Ieri" },
  ],
  velvet: [
    { from: "them", text: "La tua privacy è sempre modificabile dalle impostazioni. Se qualcosa non è chiaro, scrivici.", time: "Lun" },
  ],
};

export const safetyPrinciples = [
  { number: "01", title: "Consenso esplicito", text: "Ogni interazione deve essere libera, informata e sempre revocabile. Un silenzio non è un sì." },
  { number: "02", title: "Confini leggibili", text: "Ogni creator decide cosa mostrare, a chi e con quale ritmo. Le preferenze si possono cambiare." },
  { number: "03", title: "Segnalazioni curate", text: "Blocca, segnala o chiedi revisione. Il contesto viene valutato da persone, non da un contatore." },
  { number: "04", title: "Zero tolleranza per minori", text: "Velvet Hub è 18+. Qualsiasi contenuto o comportamento che coinvolga minori è vietato e viene rimosso." },
];

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
