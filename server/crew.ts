import { MAX_PLAYERS, SAFEWORD_DEFAULT, STARTING_SIGILLI, isSafeText, scenarios, shops, streets } from "../shared/crew";

export type CrewMember = { userId: number; name: string; role: string; streetId: string; joinedAt: number; inventory: string[] };
export type CrewMessage = { id: number; userId: number | null; name: string; body: string; kind: "chat" | "system"; at: number };
export type CrewSession = {
  id: string;
  scenarioId: string;
  hostId: number;
  safeword: string;
  paused: boolean;
  pausedBy: string | null;
  members: CrewMember[];
  messages: CrewMessage[];
  nextMessageId: number;
  createdAt: number;
};

const MAX_MESSAGES = 200;
const sessions = new Map<string, CrewSession>();
const wallets = new Map<number, number>();
let counter = 0;

export class CrewError extends Error {
  constructor(public code: "NOT_FOUND" | "BAD_REQUEST" | "FORBIDDEN", message: string) { super(message); }
}

export function resetCrew() { sessions.clear(); wallets.clear(); counter = 0; }

export function getWallet(userId: number) {
  if (!wallets.has(userId)) wallets.set(userId, STARTING_SIGILLI);
  return wallets.get(userId)!;
}

function system(s: CrewSession, body: string) {
  s.messages.push({ id: s.nextMessageId++, userId: null, name: "Sistema", body, kind: "system", at: Date.now() });
  if (s.messages.length > MAX_MESSAGES) s.messages.splice(0, s.messages.length - MAX_MESSAGES);
}

function need(id: string) {
  const s = sessions.get(id);
  if (!s) throw new CrewError("NOT_FOUND", "Sessione non trovata");
  return s;
}

function memberOf(s: CrewSession, userId: number) {
  const m = s.members.find(x => x.userId === userId);
  if (!m) throw new CrewError("FORBIDDEN", "Non fai parte della sessione");
  return m;
}

export function summarize(s: CrewSession) {
  const sc = scenarios.find(x => x.id === s.scenarioId)!;
  return { id: s.id, scenarioId: s.scenarioId, title: sc.title, players: s.members.length, max: MAX_PLAYERS, paused: s.paused, createdAt: s.createdAt };
}

export function listSessions() {
  return Array.from(sessions.values()).map(summarize);
}

export function createSession(userId: number, name: string, scenarioId: string, role: string, safeword?: string) {
  const sc = scenarios.find(x => x.id === scenarioId);
  if (!sc) throw new CrewError("BAD_REQUEST", "Scenario sconosciuto");
  const id = `crew-${++counter}`;
  const s: CrewSession = { id, scenarioId, hostId: userId, safeword: (safeword?.trim() || SAFEWORD_DEFAULT).toUpperCase(), paused: false, pausedBy: null, members: [], messages: [], nextMessageId: 1, createdAt: Date.now() };
  sessions.set(id, s);
  addMember(s, userId, name, role, sc.streetId);
  return s;
}

function addMember(s: CrewSession, userId: number, name: string, role: string, streetId: string) {
  s.members.push({ userId, name, role, streetId, joinedAt: Date.now(), inventory: [] });
  system(s, `${name} è entrato/a. Ricordate: la pausa è sempre disponibile.`);
}

export function joinSession(id: string, userId: number, name: string, role: string) {
  const s = need(id);
  if (s.members.some(m => m.userId === userId)) return s;
  if (s.members.length >= MAX_PLAYERS) throw new CrewError("BAD_REQUEST", "Sessione piena");
  const sc = scenarios.find(x => x.id === s.scenarioId)!;
  addMember(s, userId, name, role, sc.streetId);
  return s;
}

export function leaveSession(id: string, userId: number) {
  const s = need(id);
  const m = memberOf(s, userId);
  s.members = s.members.filter(x => x.userId !== userId);
  system(s, `${m.name} è uscito/a.`);
  if (s.members.length === 0) sessions.delete(id);
  else if (s.hostId === userId) s.hostId = s.members[0].userId;
}

export function postMessage(id: string, userId: number, body: string) {
  const s = need(id);
  const m = memberOf(s, userId);
  const text = body.trim();
  if (!text) throw new CrewError("BAD_REQUEST", "Messaggio vuoto");
  if (text.toUpperCase() === s.safeword) {
    s.paused = true;
    s.pausedBy = m.name;
    system(s, `${m.name} ha usato la safeword. Sessione in pausa: nessuna spiegazione dovuta.`);
    return s;
  }
  if (s.paused) throw new CrewError("FORBIDDEN", "Sessione in pausa");
  if (!isSafeText(text)) throw new CrewError("BAD_REQUEST", "Messaggio non consentito: la piattaforma è solo per adulti.");
  s.messages.push({ id: s.nextMessageId++, userId, name: m.name, body: text.slice(0, 500), kind: "chat", at: Date.now() });
  if (s.messages.length > MAX_MESSAGES) s.messages.splice(0, s.messages.length - MAX_MESSAGES);
  return s;
}

export function setPaused(id: string, userId: number, paused: boolean) {
  const s = need(id);
  const m = memberOf(s, userId);
  if (!paused && s.hostId !== userId) throw new CrewError("FORBIDDEN", "Solo l'host può riprendere");
  s.paused = paused;
  s.pausedBy = paused ? m.name : null;
  system(s, paused ? `${m.name} ha messo in pausa.` : `${m.name} ha ripreso la sessione.`);
  return s;
}

export function moveTo(id: string, userId: number, streetId: string) {
  const s = need(id);
  const m = memberOf(s, userId);
  const street = streets.find(x => x.id === streetId);
  if (!street) throw new CrewError("BAD_REQUEST", "Strada sconosciuta");
  m.streetId = streetId;
  system(s, `${m.name} è andato/a in ${street.name}.`);
  return s;
}

export function buyItem(id: string, userId: number, shopId: string, itemId: string) {
  const s = need(id);
  const m = memberOf(s, userId);
  const shop = shops.find(x => x.id === shopId);
  const item = shop?.items.find(x => x.id === itemId);
  if (!shop || !item) throw new CrewError("BAD_REQUEST", "Articolo sconosciuto");
  if (shop.streetId !== m.streetId) throw new CrewError("BAD_REQUEST", "Il negozio non è in questa strada");
  const balance = getWallet(userId);
  if (balance < item.price) throw new CrewError("BAD_REQUEST", "Sigilli insufficienti");
  wallets.set(userId, balance - item.price);
  m.inventory.push(item.id);
  system(s, `${m.name} ha acquistato ${item.name} da ${shop.name}.`);
  return { session: s, balance: balance - item.price };
}

export function view(id: string, userId: number, afterId = 0) {
  const s = need(id);
  memberOf(s, userId);
  return {
    id: s.id,
    scenarioId: s.scenarioId,
    hostId: s.hostId,
    paused: s.paused,
    pausedBy: s.pausedBy,
    members: s.members.map(({ userId: u, name, role, streetId, inventory }) => ({ userId: u, name, role, streetId, inventory })),
    messages: s.messages.filter(x => x.id > afterId),
    balance: getWallet(userId),
  };
}
