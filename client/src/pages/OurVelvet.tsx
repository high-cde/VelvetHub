import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, AudioLines, Bot, Check, Compass, LockKeyhole, MessageCircle, Plus, Search, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import VelvetNav from "@/components/VelvetNav";
import { useVelvet } from "@/contexts/VelvetContext";

const characters = [
  { name: "Rubina", role: "Mistress · companion AI", tone: "Voce elegante, ferma e attenta ai confini.", accent: "from-[#8f315e] to-[#2a1027]", mark: "R" },
  { name: "Kali", role: "Master · companion AI", tone: "Disciplina calma, umorismo asciutto e aftercare.", accent: "from-[#443275] to-[#151025]", mark: "K" },
  { name: "Nera June", role: "Narratrice · audio fiction", tone: "Diari sonori, misteri urbani e ritmo lento.", accent: "from-[#75604a] to-[#20151c]", mark: "N" },
  { name: "Milo Noir", role: "Game host · fiction", tone: "Sfide sociali, bluff e missioni leggere.", accent: "from-[#28525b] to-[#101b22]", mark: "M" },
];

const topics = ["slow burn", "dark academia", "mystery", "dominance narrativa", "aftercare", "anime noir", "romance", "worldbuilding"];
const archetypes = ["Confidente", "Narratrice noir", "Game host", "Mentor creativa"];
const tones = ["Calma e calda", "Ironica e brillante", "Elegante e intensa", "Sussurrata e cinematica"];
const boundaries = ["Niente contenuti espliciti", "Stop immediato su richiesta", "Nessun dato personale", "Nessun incontro reale"];
type CompanionConfig = { version: 1; companionName: string; archetype: string; tone: string; memory: string; selectedBoundaries: string[] };

export default function OurVelvet() {
  const { adultConfirmed } = useVelvet();
  const [query, setQuery] = useState("");
  const [companionName, setCompanionName] = useState("Luce Velvet");
  const [archetype, setArchetype] = useState(archetypes[0]);
  const [tone, setTone] = useState(tones[0]);
  const [memory, setMemory] = useState("Solo preferenze che scelgo io");
  const [selectedBoundaries, setSelectedBoundaries] = useState(boundaries);
  const [saved, setSaved] = useState(false);
  const [fileMessage, setFileMessage] = useState("");
  const importInput = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => characters.filter((item) => `${item.name} ${item.role} ${item.tone}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggleBoundary = (boundary: string) => setSelectedBoundaries((current) => current.includes(boundary) ? current.filter((item) => item !== boundary) : [...current, boundary]);
  const saveCompanion = () => {
    if (!adultConfirmed) return;
    localStorage.setItem("ourvelvet-companion-draft", JSON.stringify({ version: 1, companionName, archetype, tone, memory, selectedBoundaries } satisfies CompanionConfig));
    setSaved(true);
  };
  const exportCompanion = () => {
    const config: CompanionConfig = { version: 1, companionName: companionName.trim() || "Senza nome", archetype, tone, memory, selectedBoundaries };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(config.companionName || "ourvelvet-companion").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ourvelvet-companion"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFileMessage("Configurazione esportata.");
  };
  const importCompanion = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<CompanionConfig>;
      const validName = typeof parsed.companionName === "string" && parsed.companionName.trim().length > 0 && parsed.companionName.length <= 40;
      const validBoundaries = Array.isArray(parsed.selectedBoundaries) && parsed.selectedBoundaries.every((item): item is string => typeof item === "string" && boundaries.includes(item));
      if (parsed.version !== 1 || !validName || !archetypes.includes(parsed.archetype ?? "") || !tones.includes(parsed.tone ?? "") || typeof parsed.memory !== "string" || !validBoundaries) throw new Error("invalid");
      const config: CompanionConfig = { version: 1, companionName: parsed.companionName!.trim(), archetype: parsed.archetype!, tone: parsed.tone!, memory: parsed.memory, selectedBoundaries: parsed.selectedBoundaries! };
      setCompanionName(config.companionName);
      setArchetype(config.archetype);
      setTone(config.tone);
      setMemory(config.memory);
      setSelectedBoundaries(config.selectedBoundaries);
      setSaved(false);
      setFileMessage("Configurazione importata e pronta per l’anteprima.");
    } catch {
      setFileMessage("File non valido: usa un JSON esportato da OurVelvet.");
    }
  };

  return <div className="velvet-shell min-h-screen">
    <VelvetNav />
    <main>
      <section className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
        <div>
          <p className="section-kicker flex items-center gap-2"><Sparkles size={14} className="text-[#d7b46a]" /> OurVelvet / studio companion 18+</p>
          <h1 className="display-font mt-5 max-w-4xl text-6xl leading-[.92] text-white md:text-8xl">Immagina una voce.<br /><span className="text-[#e2a0bd]">Scegli il ritmo.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#b9aaba] md:text-lg">Un atelier di roleplay narrativo, companion AI e mondi condivisi. Costruisci atmosfere, non dipendenze: ogni scena è adulta, non esplicita, consensuale e interrompibile.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#explore" className="pressable inline-flex items-center gap-2 rounded-full bg-[#d7b46a] px-5 py-3 text-sm font-extrabold text-[#100b0c]">Esplora le voci <ArrowRight size={17} /></a><Link href="/studio" className="pressable inline-flex items-center gap-2 rounded-full border border-[#e2a0bd]/40 bg-[#e2a0bd]/10 px-5 py-3 text-sm font-extrabold text-[#f0bed2]"><WandSparkles size={16} /> Crea una companion</Link></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold text-[#948796]"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#d7b46a]" /> Confini leggibili</span><span className="flex items-center gap-2"><LockKeyhole size={14} className="text-[#d7b46a]" /> Privacy by design</span><span className="flex items-center gap-2"><MessageCircle size={15} className="text-[#d7b46a]" /> Stop sempre disponibile</span></div>
        </div>
        <div className="grain relative overflow-hidden rounded-[2rem] border border-[#d7b46a]/25 bg-[#17101d] p-6 shadow-[0_30px_110px_rgba(0,0,0,.5)]"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#8c3e72]/25 blur-3xl" /><div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#d7b46a]/10 blur-3xl" /><div className="relative flex items-center justify-between"><p className="section-kicker">OurVelvet / 001</p><span className="rounded-full border border-[#93e5b0]/30 bg-[#93e5b0]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#93e5b0]">Beta editoriale</span></div><div className="relative mt-8 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#63304f] via-[#241527] to-[#100b12] p-6"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#d7b46a] text-[#100b0c]"><Bot size={21} /></span><span className="mono text-[10px] text-[#c9b7c8]">VOICE / CONSENT</span></div><p className="display-font mt-20 text-4xl text-white">Una stanza che<br /><span className="text-[#f0c0d5]">sa ascoltare.</span></p><p className="mt-4 max-w-sm text-sm leading-6 text-[#c8b7c4]">Prompt brevi, memoria trasparente, possibilità di pausa e un registro delle preferenze che resta tuo.</p></div></div>
      </section>

      {!adultConfirmed && <section className="container"><div className="rounded-3xl border border-[#d7b46a]/25 bg-[#d7b46a]/10 p-6 md:flex md:items-center md:justify-between md:gap-6"><div><p className="section-kicker">Spazio riservato 18+</p><h2 className="display-font mt-2 text-3xl text-white">Prima il confine, poi la fantasia.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#c7b6c4]">Conferma età e regole di sicurezza per entrare nelle aree narrative. Non è una verifica legale dell’identità.</p></div><Link href="/accesso" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#d7b46a] px-5 py-3 text-sm font-extrabold text-[#100b0c] md:mt-0">Conferma e accedi <ArrowRight size={16} /></Link></div></section>}

      <section id="explore" className="container py-16 md:py-20"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-kicker">Explore / voci curate</p><h2 className="display-font mt-3 text-5xl text-white md:text-6xl">Trova il tuo<br /><span className="text-[#e2a0bd]">punto di ingresso.</span></h2></div><label className="flex h-12 w-full max-w-sm items-center gap-3 rounded-full border border-white/10 bg-white/[.04] px-4 text-[#a99aa8]"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca una voce…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#817381]" /></label></div><div className="mt-8 flex flex-wrap gap-2">{topics.map((topic) => <button key={topic} type="button" onClick={() => setQuery(topic)} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-[11px] font-bold text-[#b9aaba] transition hover:border-[#d7b46a]/45 hover:text-[#f0d18a]">{topic}</button>)}</div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((character) => <article key={character.name} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] transition hover:-translate-y-1 hover:border-[#d7b46a]/40"><div className={`relative flex min-h-48 items-end bg-gradient-to-br ${character.accent} p-5`}><div className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/15 text-2xl text-[#f3d6e2]">{character.mark}</div><div><p className="section-kicker text-[#f0d18a]">{character.role}</p><h3 className="display-font mt-2 text-3xl text-white">{character.name}</h3></div></div><div className="p-5"><p className="text-sm leading-6 text-[#b9aaba]">{character.tone}</p><button type="button" disabled={!adultConfirmed} className="mt-5 flex w-full items-center justify-between rounded-full border border-white/10 px-4 py-2.5 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45">Apri profilo <ArrowRight size={15} /></button></div></article>)}</div></section>

      <section id="create" className="container py-16 md:py-20"><div className="mb-8 max-w-3xl"><p className="section-kicker flex items-center gap-2"><WandSparkles size={14} className="text-[#e2a0bd]" /> Create / companion lab</p><h2 className="display-font mt-3 text-5xl text-white md:text-6xl">Costruisci una voce<br /><span className="text-[#e2a0bd]">che rispetta il tuo ritmo.</span></h2><p className="mt-4 text-sm leading-7 text-[#b9aaba]">Configura una bozza direttamente nel browser. Il salvataggio è locale sul tuo dispositivo: nessun prompt privato viene inviato da questa schermata.</p></div><div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><div className="rounded-3xl border border-white/10 bg-[#17101d] p-6 md:p-8"><div className="grid gap-5 md:grid-cols-2"><label className="md:col-span-2"><span className="section-kicker">Nome della companion</span><input value={companionName} onChange={(event) => { setCompanionName(event.target.value); setSaved(false); }} maxLength={40} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none focus:border-[#d7b46a]/60" /></label><label><span className="section-kicker">Archetipo</span><select value={archetype} onChange={(event) => { setArchetype(event.target.value); setSaved(false); }} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#211427] px-4 text-sm text-white outline-none">{archetypes.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="section-kicker">Tono</span><select value={tone} onChange={(event) => { setTone(event.target.value); setSaved(false); }} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#211427] px-4 text-sm text-white outline-none">{tones.map((item) => <option key={item}>{item}</option>)}</select></label><label className="md:col-span-2"><span className="section-kicker">Memoria</span><select value={memory} onChange={(event) => { setMemory(event.target.value); setSaved(false); }} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#211427] px-4 text-sm text-white outline-none"><option>Solo preferenze che scelgo io</option><option>Solo questa sessione</option><option>Preferenze salvate e modificabili</option></select></label></div><div className="mt-6"><p className="section-kicker">Confini predefiniti</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{boundaries.map((boundary) => <button key={boundary} type="button" onClick={() => { toggleBoundary(boundary); setSaved(false); }} className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-xs font-bold transition ${selectedBoundaries.includes(boundary) ? "border-[#93e5b0]/40 bg-[#93e5b0]/10 text-[#c8f0d5]" : "border-white/10 bg-white/[.03] text-[#9f909f]"}`}><span className="grid h-5 w-5 place-items-center rounded-full border border-current">{selectedBoundaries.includes(boundary) && <Check size={12} />}</span>{boundary}</button>)}</div></div><div className="mt-7 flex flex-wrap gap-2"><button type="button" onClick={saveCompanion} disabled={!adultConfirmed} className="inline-flex items-center gap-2 rounded-full bg-[#d7b46a] px-5 py-3 text-sm font-extrabold text-[#100b0c] disabled:cursor-not-allowed disabled:opacity-45"><LockKeyhole size={15} /> {saved ? "Bozza salvata sul dispositivo" : "Salva la mia bozza"}</button><button type="button" onClick={exportCompanion} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs font-extrabold text-white hover:border-[#d7b46a]/50">Esporta JSON</button><button type="button" onClick={() => importInput.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs font-extrabold text-white hover:border-[#d7b46a]/50">Importa JSON</button><input ref={importInput} type="file" accept="application/json,.json" onChange={importCompanion} className="hidden" /></div>{fileMessage && <p className="mt-3 text-xs text-[#93e5b0]">{fileMessage}</p>}{!adultConfirmed && <p className="mt-3 text-xs text-[#e4b66b]">Conferma età e regole per abilitare il salvataggio.</p>}</div><aside className="rounded-3xl border border-[#e2a0bd]/25 bg-gradient-to-br from-[#3a1835] via-[#191020] to-[#100b12] p-6 md:p-8"><div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e2a0bd] text-[#25101d]"><Bot size={21} /></span><span className="mono text-[10px] uppercase tracking-[.15em] text-[#c9b7c8]">Preview / live</span></div><p className="display-font mt-20 text-4xl text-white">{companionName || "Senza nome"}</p><p className="mt-2 text-sm font-bold text-[#f0c0d5]">{archetype} · {tone}</p><p className="mt-6 text-sm leading-7 text-[#c8b7c4]">“Sono qui per accompagnarti con attenzione. Possiamo rallentare, cambiare tono o fermarci in qualsiasi momento.”</p><div className="mt-8 border-t border-white/10 pt-5"><p className="section-kicker">Memoria selezionata</p><p className="mt-2 text-sm text-white">{memory}</p><p className="mt-4 section-kicker">Confini attivi · {selectedBoundaries.length}</p><div className="mt-2 flex flex-wrap gap-2">{selectedBoundaries.map((boundary) => <span key={boundary} className="rounded-full border border-[#93e5b0]/25 bg-[#93e5b0]/10 px-2.5 py-1 text-[10px] text-[#c8f0d5]">{boundary}</span>)}</div></div></aside></div></section>

      <section className="container grid gap-4 pb-16 md:grid-cols-3 md:pb-24"><article className="rounded-3xl border border-white/10 bg-[#17101d] p-6"><Compass className="text-[#d7b46a]" size={21} /><h3 className="display-font mt-5 text-3xl text-white">Explore</h3><p className="mt-3 text-sm leading-6 text-[#b9aaba]">Filtri per tono, ritmo e formato: chat, audio fiction, missioni e mondi condivisi.</p><Link href="/discover" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#f0d18a]">Apri Discover <ArrowRight size={14} /></Link></article><article className="rounded-3xl border border-white/10 bg-[#17101d] p-6"><Plus className="text-[#e2a0bd]" size={21} /><h3 className="display-font mt-5 text-3xl text-white">Create</h3><p className="mt-3 text-sm leading-6 text-[#b9aaba]">Crea una persona fiction con tono, limiti, memoria e regole chiare. Nessuna impersonificazione di persone reali.</p><a href="#create" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#f0d18a]">Apri il Lab <ArrowRight size={14} /></a></article><article className="rounded-3xl border border-white/10 bg-[#17101d] p-6"><AudioLines className="text-[#93e5b0]" size={21} /><h3 className="display-font mt-5 text-3xl text-white">Voice & care</h3><p className="mt-3 text-sm leading-6 text-[#b9aaba]">Podcast, aftercare e strumenti di pausa per mantenere l’esperienza intensa ma responsabile.</p><Link href="/safety" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#f0d18a]">Leggi Safety <ArrowRight size={14} /></Link></article></section>

      <footer className="border-t border-white/10 py-8"><div className="container flex flex-col justify-between gap-3 text-[10px] uppercase tracking-[.12em] text-[#796b78] sm:flex-row"><span>© 2026 OurVelvet · VelvetHub</span><span className="flex flex-wrap gap-4"><Link href="/policy" className="hover:text-[#d7b46a]">Policy</Link><Link href="/safety" className="hover:text-[#d7b46a]">Sicurezza</Link><span>18+ · consent-first · no explicit sexual content</span></span></div></footer>
    </main>
  </div>;
}
