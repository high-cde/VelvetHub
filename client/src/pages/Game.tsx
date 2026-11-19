import { useEffect, useRef, useState } from "react";
import { ChevronRight, Lightbulb, MapPin, RotateCcw, ShieldCheck, Star } from "lucide-react";
import VelvetNav from "@/components/VelvetNav";
import { ITEMS, LEVELS, act, currentLevel, currentRoom, hintFor, initialState, levelProgress, visibleHotspots, type Action, type GameState } from "@shared/larry";

const AGE_KEY = "velvet-crew-adult";
const SAVE_KEY = "velvet-larry-save";

function load(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw) as GameState;
  } catch { /* save corrotto: si riparte */ }
  return initialState();
}

export default function Game() {
  const [adult, setAdult] = useState(() => localStorage.getItem(AGE_KEY) === "1");
  const [state, setState] = useState<GameState>(load);
  const [selected, setSelected] = useState<string | null>(null);
  const [item, setItem] = useState<string | null>(null);
  const [talking, setTalking] = useState<string | null>(null);
  const logEnd = useRef<HTMLDivElement>(null);
  useEffect(() => { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); logEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [state]);

  const dispatch = (a: Action) => setState(s => act(s, a));

  if (!adult) {
    return (
      <main className="velvet-shell min-h-screen"><VelvetNav />
        <section className="mx-auto max-w-xl px-4 py-16 text-center">
          <ShieldCheck className="mx-auto text-[#d7b46a]" size={36} />
          <h1 className="display-font mt-4 text-4xl text-white">Vic Velluto · solo 18+</h1>
          <p className="mt-3 text-sm leading-6 text-[#b9aaba]">Commedia adulta a enigmi, non esplicita: qui vince chi chiede, ascolta e si ferma al primo «no».</p>
          <button onClick={() => { localStorage.setItem(AGE_KEY, "1"); setAdult(true); }} className="mt-6 rounded-full bg-[#d7b46a] px-6 py-3 text-sm font-bold text-black">Ho almeno 18 anni, gioca</button>
        </section>
      </main>
    );
  }

  const level = currentLevel(state);
  const room = currentRoom(state);
  const spots = visibleHotspots(state);
  const spot = spots.find(h => h.id === selected);
  const talk = talking ? spots.find(h => h.id === talking)?.talk : undefined;
  const progress = levelProgress(state);
  const done = state.flags.includes(`${level.goalFlag}_scored`);
  const reset = () => { setState(initialState()); setSelected(null); setTalking(null); setItem(null); };

  return (
    <main className="velvet-shell min-h-screen"><VelvetNav />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <p className="mono text-[10px] font-bold uppercase tracking-[.22em] text-[#d7b46a]">Le disavventure di Vic Velluto · Livello {level.id}/{LEVELS.length}</p>
        <h1 className="display-font mt-2 text-4xl text-white md:text-5xl">{level.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#b9aaba]">
          <span className="flex items-center gap-1"><Star size={14} className="text-[#d7b46a]" /> {state.score} punti</span>
          <a href={`${import.meta.env.BASE_URL}${level.mirrors.replace(/^\//, "")}`} className="underline">Sezione del sito rispecchiata: {level.mirrors}</a>
          <button onClick={() => setState(s => ({ ...s, log: [...s.log.slice(-39), `💡 ${hintFor(s)}`], score: Math.max(0, s.score - 2) }))} className="flex items-center gap-1 text-[#d7b46a]"><Lightbulb size={12} /> Suggerimento (-2)</button>
          <button onClick={reset} className="flex items-center gap-1 text-[#e2a0bd]"><RotateCcw size={12} /> Ricomincia</button>
        </div>

        <div className="mt-3 h-1.5 max-w-sm overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done} aria-label="Progresso del livello"><div className="h-full bg-[#d7b46a] transition-all" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
        {state.finished ? (
          <div className="mt-8 rounded-2xl border border-[#d7b46a]/30 bg-[#d7b46a]/[.06] p-8 text-center">
            <h2 className="display-font text-3xl text-white">Cavaliere del Velluto</h2>
            <p className="mt-2 text-sm text-[#b9aaba]">Hai completato i 5 livelli con {state.score} punti.</p>
            <button onClick={reset} className="mt-5 rounded-full bg-[#d7b46a] px-5 py-2 text-sm font-bold text-black">Gioca di nuovo</button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
            <section>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#2a1230] to-[#0d080f] p-5">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white"><MapPin size={16} /> {room.name}</h2>
                <p className="mt-1 text-sm text-[#b9aaba]">{room.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {spots.map(h => (
                    <button key={h.id} onClick={() => { setSelected(h.id); setTalking(null); }} className={`rounded-xl border px-4 py-3 text-center text-sm ${selected === h.id ? "border-[#d7b46a] text-[#d7b46a]" : "border-white/15 text-white"}`}>
                      <span className="block text-2xl">{h.icon}</span>{h.name}
                    </button>
                  ))}
                </div>
                {spot && (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <button onClick={() => dispatch({ type: "look", target: spot.id })} className="rounded-full border border-white/15 px-3 py-1 text-white">Guarda</button>
                    {spot.take && <button onClick={() => { dispatch({ type: "take", target: spot.id }); setSelected(null); }} className="rounded-full border border-white/15 px-3 py-1 text-white">Prendi</button>}
                    {spot.talk && <button onClick={() => { dispatch({ type: "talk", target: spot.id }); setTalking(spot.id); }} className="rounded-full border border-white/15 px-3 py-1 text-white">Parla</button>}
                    {state.inventory.filter(i => i !== "sigillo").map(i => (
                      <button key={i} onClick={() => dispatch({ type: "use", item: i, target: spot.id })} className="rounded-full border border-[#d7b46a]/40 px-3 py-1 text-[#d7b46a]">Usa {ITEMS[i]}</button>
                    ))}
                  </div>
                )}
                {talk && !state.flags.includes(talk.doneFlag) && (
                  <div className="mt-4 space-y-2">
                    {talk.choices.map((c, i) => (
                      <button key={c.label} onClick={() => { dispatch({ type: "talk", target: talking!, choice: i }); if (c.setFlag) setTalking(null); }} className="block w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-[#e8dce6] hover:border-[#d7b46a]">{c.label}</button>
                    ))}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {room.exits.map(e => <button key={e.to} onClick={() => { dispatch({ type: "go", to: e.to }); setSelected(null); setTalking(null); }} className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white">{e.label} <ChevronRight size={12} /></button>)}
                </div>
              </div>
              {done && <button onClick={() => { dispatch({ type: "next" }); setSelected(null); setTalking(null); }} className="mt-4 rounded-full bg-[#d7b46a] px-6 py-2 text-sm font-bold text-black">{state.level === LEVELS.length - 1 ? "Concludi l'avventura" : "Prossimo livello"}</button>}
            </section>
            <aside className="space-y-4">
              <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                <h3 className="text-sm font-bold text-white">Inventario</h3>
                <p className="mt-2 text-xs text-[#b9aaba]">{state.inventory.length ? state.inventory.map(i => ITEMS[i]).join(" · ") : "Vuoto"}</p>
              </section>
              <section className="h-72 overflow-y-auto rounded-2xl border border-white/10 bg-white/[.03] p-4 text-xs leading-5 text-[#e8dce6]">
                {state.log.map((l, i) => <p key={i} className="mb-2">{l}</p>)}
                <div ref={logEnd} />
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
