import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Map, MessageCircle, Pause, Play, Send, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import { toast } from "sonner";
import VelvetNav from "@/components/VelvetNav";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/routers";

const AGE_KEY = "velvet-crew-adult";

export default function Crew() {
  const utils = trpc.useUtils();
  const world = trpc.crew.world.useQuery();
  const sessions = trpc.crew.sessions.useQuery(undefined, { refetchInterval: 5000 });
  const [adult, setAdult] = useState(() => typeof localStorage !== "undefined" && localStorage.getItem(AGE_KEY) === "1");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState("anticamera");
  const [role, setRole] = useState("Ospite");
  const [safeword, setSafeword] = useState("");
  const [text, setText] = useState("");
  const [blocked, setBlocked] = useState<number[]>([]);
  const state = trpc.crew.state.useQuery({ id: sessionId ?? "" }, { enabled: !!sessionId, refetchInterval: 2000, retry: false });
  const fail = (e: { message: string }) => toast.error(e.message);
  const refresh = () => utils.crew.state.invalidate();
  const create = trpc.crew.create.useMutation({ onSuccess: r => setSessionId(r.id), onError: fail });
  const join = trpc.crew.join.useMutation({ onSuccess: r => setSessionId(r.id), onError: fail });
  const leave = trpc.crew.leave.useMutation({ onSuccess: () => { setSessionId(null); utils.crew.sessions.invalidate(); }, onError: fail });
  const say = trpc.crew.say.useMutation({ onSuccess: () => { setText(""); refresh(); }, onError: fail });
  const pause = trpc.crew.pause.useMutation({ onSuccess: refresh, onError: fail });
  const move = trpc.crew.move.useMutation({ onSuccess: refresh, onError: fail });
  const buy = trpc.crew.buy.useMutation({ onSuccess: () => { toast.success("Acquisto completato"); refresh(); }, onError: fail });
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [state.data?.messages.length]);

  const scenario = world.data?.scenarios.find(s => s.id === (state.data?.scenarioId ?? scenarioId));
  const confirmAge = () => { localStorage.setItem(AGE_KEY, "1"); setAdult(true); };

  if (!adult) {
    return (
      <main className="velvet-shell min-h-screen"><VelvetNav />
        <section className="mx-auto max-w-xl px-4 py-16 text-center">
          <ShieldCheck className="mx-auto text-[#d7b46a]" size={36} />
          <h1 className="display-font mt-4 text-4xl text-white">VR Crew · solo 18+</h1>
          <p className="mt-3 text-sm leading-6 text-[#b9aaba]">Fiction adulta basata sul consenso. Nessun contenuto esplicito, nessun incontro reale. Puoi fermare tutto con la safeword o con Pausa.</p>
          <button onClick={confirmAge} className="mt-6 rounded-full bg-[#d7b46a] px-6 py-3 text-sm font-bold text-black">Ho almeno 18 anni, entra</button>
          <p className="mt-3"><Link href="/safety" className="text-xs text-[#d7b46a] underline">Regole di sicurezza</Link></p>
        </section>
      </main>
    );
  }

  const d = state.data;
  return (
    <main className="velvet-shell min-h-screen"><VelvetNav />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <p className="mono text-[10px] font-bold uppercase tracking-[.22em] text-[#d7b46a]">VR Crew · sessioni live</p>
        <h1 className="display-font mt-2 text-4xl text-white md:text-5xl">Strade, negozi e <em className="text-[#e2a0bd]">sessioni.</em></h1>

        {!sessionId || !d ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <h2 className="text-lg font-bold text-white">Crea una sessione</h2>
              <div className="mt-4 grid gap-3">
                {world.data?.scenarios.map(s => (
                  <label key={s.id} className={`cursor-pointer rounded-xl border p-3 ${scenarioId === s.id ? "border-[#d7b46a]" : "border-white/10"}`}>
                    <input type="radio" className="sr-only" checked={scenarioId === s.id} onChange={() => { setScenarioId(s.id); setRole(s.roles[0]); }} />
                    <p className="text-sm font-bold text-white">{s.title} <span className="text-[10px] uppercase text-[#d7b46a]">{s.intensity}</span></p>
                    <p className="text-xs text-[#b9aaba]">{s.summary}</p>
                  </label>
                ))}
              </div>
              {scenario && <select value={role} onChange={e => setRole(e.target.value)} className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 p-2 text-sm text-white">{scenario.roles.map(r => <option key={r}>{r}</option>)}</select>}
              <input value={safeword} onChange={e => setSafeword(e.target.value)} placeholder="Safeword (default ROSSO)" className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 p-2 text-sm text-white" />
              <button disabled={create.isPending} onClick={() => create.mutate({ adult: true, scenarioId, role, safeword: safeword || undefined })} className="mt-4 rounded-full bg-[#d7b46a] px-5 py-2 text-sm font-bold text-black">Crea e entra</button>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Users size={18} /> Sessioni aperte</h2>
              {sessions.data?.length ? sessions.data.map(s => (
                <div key={s.id} className="mt-3 flex items-center justify-between rounded-xl border border-white/10 p-3">
                  <div><p className="text-sm font-bold text-white">{s.title}</p><p className="text-xs text-[#b9aaba]">{s.players}/{s.max} giocatori{s.paused ? " · in pausa" : ""}</p></div>
                  <button onClick={() => join.mutate({ adult: true, id: s.id, role: "Ospite" })} className="rounded-full border border-[#d7b46a]/50 px-4 py-1 text-xs font-bold text-[#d7b46a]">Unisciti</button>
                </div>
              )) : <p className="mt-3 text-sm text-[#b9aaba]">Nessuna sessione. Creane una e invita altri adulti.</p>}
              <h3 className="mt-6 flex items-center gap-2 text-sm font-bold text-white"><Map size={16} /> Le strade</h3>
              <ul className="mt-2 space-y-1 text-xs text-[#b9aaba]">{world.data?.streets.map(s => <li key={s.id}><b className="text-white">{s.name}</b> — {s.description}</li>)}</ul>
            </section>
          </div>
        ) : (
          <SessionView d={d} world={world.data} blocked={blocked} setBlocked={setBlocked}
            text={text} setText={setText} say={() => say.mutate({ id: sessionId, body: text })}
            onPause={p => pause.mutate({ id: sessionId, paused: p })} onMove={streetId => move.mutate({ id: sessionId, streetId })}
            onBuy={(shopId, itemId) => buy.mutate({ id: sessionId, shopId, itemId })} onLeave={() => leave.mutate({ id: sessionId })} endRef={endRef} />
        )}
      </div>
    </main>
  );
}

type Out = inferRouterOutputs<AppRouter>["crew"];
type Data = Out["state"];
type World = Out["world"];

function SessionView({ d, world, blocked, setBlocked, text, setText, say, onPause, onMove, onBuy, onLeave, endRef }: {
  d: Data; world?: World; blocked: number[]; setBlocked: (b: number[]) => void; text: string; setText: (t: string) => void; say: () => void;
  onPause: (p: boolean) => void; onMove: (s: string) => void; onBuy: (shop: string, item: string) => void; onLeave: () => void; endRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { data: auth } = trpc.auth.me.useQuery();
  const mineStreet = d.members.find(m => m.userId === auth?.id)?.streetId;
  const shopsHere = world?.shops.filter(s => s.streetId === mineStreet) ?? [];
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="flex h-[70vh] flex-col rounded-2xl border border-white/10 bg-white/[.03]">
        <header className="flex items-center justify-between border-b border-white/10 p-3">
          <p className="flex items-center gap-2 text-sm font-bold text-white"><MessageCircle size={16} /> Chat live {d.paused && <span className="text-[#e2a0bd]">· in pausa{d.pausedBy ? ` (${d.pausedBy})` : ""}</span>}</p>
          <div className="flex gap-2">
            {d.paused ? <button onClick={() => onPause(false)} className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs text-white"><Play size={12} /> Riprendi</button>
              : <button onClick={() => onPause(true)} className="flex items-center gap-1 rounded-full bg-[#e2a0bd] px-3 py-1 text-xs font-bold text-black"><Pause size={12} /> Pausa sicura</button>}
            <button onClick={onLeave} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white">Esci</button>
          </div>
        </header>
        <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
          {d.messages.filter(m => m.userId === null || !blocked.includes(m.userId)).map(m => (
            <p key={m.id} className={m.kind === "system" ? "text-xs italic text-[#806e80]" : "text-[#e8dce6]"}>
              {m.kind === "chat" && <b className="text-[#d7b46a]">{m.name}: </b>}{m.body}
            </p>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={e => { e.preventDefault(); if (text.trim()) say(); }} className="flex gap-2 border-t border-white/10 p-3">
          <input value={text} onChange={e => setText(e.target.value)} maxLength={500} disabled={d.paused} placeholder={d.paused ? "Sessione in pausa" : "Scrivi alla crew…"} className="flex-1 rounded-lg border border-white/10 bg-black/40 p-2 text-sm text-white" />
          <button disabled={d.paused} className="rounded-full bg-[#d7b46a] px-4 text-black"><Send size={16} /></button>
        </form>
      </section>
      <aside className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Users size={16} /> Giocatori ({d.members.length})</h3>
          {d.members.map(m => (
            <div key={m.userId} className="mt-2 flex items-center justify-between text-xs text-[#b9aaba]">
              <span><b className="text-white">{m.name}</b> · {m.role} · {world?.streets.find(s => s.id === m.streetId)?.name}</span>
              {m.userId !== auth?.id && <button onClick={() => setBlocked(blocked.includes(m.userId) ? blocked.filter(x => x !== m.userId) : [...blocked, m.userId])} className="text-[#e2a0bd] underline">{blocked.includes(m.userId) ? "Sblocca" : "Blocca"}</button>}
            </div>
          ))}
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Map size={16} /> Strade</h3>
          <div className="mt-2 flex flex-wrap gap-2">{world?.streets.map(s => <button key={s.id} onClick={() => onMove(s.id)} className={`rounded-full border px-3 py-1 text-xs ${mineStreet === s.id ? "border-[#d7b46a] text-[#d7b46a]" : "border-white/15 text-white"}`}>{s.name}</button>)}</div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white"><ShoppingBag size={16} /> Negozi · {d.balance} Sigilli</h3>
          {shopsHere.length === 0 && <p className="mt-2 text-xs text-[#b9aaba]">Nessun negozio in questa strada.</p>}
          {shopsHere.map(s => (
            <div key={s.id} className="mt-3"><p className="text-xs font-bold text-white">{s.name}</p>
              {s.items.map(i => <div key={i.id} className="mt-1 flex items-center justify-between text-xs text-[#b9aaba]"><span>{i.name} · {i.price}</span><button onClick={() => onBuy(s.id, i.id)} className="rounded-full border border-[#d7b46a]/50 px-3 py-0.5 text-[#d7b46a]">Compra</button></div>)}
            </div>
          ))}
          <p className="mt-3 text-[10px] text-[#806e80]">I Sigilli sono punti di gioco locali: non sono denaro né token.</p>
        </section>
      </aside>
    </div>
  );
}
