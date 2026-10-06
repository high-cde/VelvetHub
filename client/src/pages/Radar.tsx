import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Radar() {
  return (
    <main className="velvet-shell min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mono text-[10px] font-bold uppercase tracking-[.22em] text-[#d7b46a]">VelvetHub / esperienza collegata</p>
            <h1 className="display-font mt-2 text-4xl text-white md:text-6xl">Radar della <em className="text-[#e2a0bd]">Carne.</em></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b9aaba]">Una stanza 3D adulta, non esplicita e basata sul consenso. Il gioco è confinato alla fiction: nessun invito, incontro o autorizzazione reale.</p>
          </div>
          <a href="/" className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-[#d7cbd5] hover:border-[#d7b46a]/60 hover:text-white">Torna al Live Club</a>
        </div>
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d7b46a]/20 bg-[#d7b46a]/[.06] p-4"><ShieldCheck size={18} className="text-[#d7b46a]" /><p className="mt-3 text-xs font-bold text-white">Age-gate 18+</p><p className="mt-1 text-[11px] leading-5 text-[#aa9aaa]">Limiti, safeword e pausa sicura in ogni capitolo.</p></div>
          <div className="rounded-2xl border border-[#e2a0bd]/20 bg-[#e2a0bd]/[.06] p-4"><Sparkles size={18} className="text-[#e2a0bd]" /><p className="mt-3 text-xs font-bold text-white">VR.Crew</p><p className="mt-1 text-[11px] leading-5 text-[#aa9aaa]">Inventario cosmetico avatar adulto e non esplicito.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><ArrowUpRight size={18} className="text-[#d7b46a]" /><p className="mt-3 text-xs font-bold text-white">Social predisposti</p><p className="mt-1 text-[11px] leading-5 text-[#aa9aaa]">Discord, Facebook, WhatsApp e $DSN restano verificabili e separati.</p></div>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-[#d7b46a]/25 bg-[#0d080f] shadow-[0_30px_110px_rgba(0,0,0,.45)]">
          <iframe title="Velvet Radar VR.Crew" src="/radar/index.html" className="h-[78vh] min-h-[640px] w-full border-0" allow="fullscreen" />
        </div>
        <p className="mt-4 text-center text-[10px] leading-5 text-[#806e80]">Le guide Rubina e Kali sono personaggi AI finzionali. Il bot multipiattaforma e gli stream live non sono attivi senza credenziali, opt-in, moderazione e policy.</p>
      </div>
    </main>
  );
}
