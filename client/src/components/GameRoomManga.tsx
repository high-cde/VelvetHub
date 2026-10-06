import { useEffect, useMemo, useState } from "react";
import { Heart, LockKeyhole, RotateCcw, Sparkles, Stars } from "lucide-react";
import { useVelvet } from "@/contexts/VelvetContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

const scenes = [
  { title: "La soglia", text: "Rubina ti aspetta sotto il cuore al neon. Non chiede obbedienza: chiede presenza.", choices: [{ label: "Entro con calma", points: 2, reply: "Bene. La calma è una forma di potere." }, { label: "Chiedo le regole", points: 3, reply: "Prima regola: puoi fermarti. Seconda: scegli con intenzione." }] },
  { title: "Il patto", text: "Una carta cremisi appare sul tavolo. Dice: ‘guida, ma lascia sempre una porta aperta’.", choices: [{ label: "Accetto il patto", points: 3, reply: "Il patto è sigillato: comando e cura possono stare nella stessa stanza." }, { label: "Propongo un limite", points: 4, reply: "Ottima scelta. Un limite dichiarato rende il gioco più interessante." }] },
  { title: "Il cuore di rubino", text: "La stanza si illumina. Rubina sorride: il premio non è vincere, è sapere cosa vuoi.", choices: [{ label: "Resto nel mood", points: 2, reply: "Allora resta. Il prossimo capitolo si apre quando sei pronto." }, { label: "Chiudo la scena", points: 4, reply: "Scena chiusa. Hai mantenuto il controllo: questo è il vero finale." }] },
];

export default function GameRoomManga() {
  const { adultConfirmed } = useVelvet();
  const [started, setStarted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [reply, setReply] = useState("");
  const [rewardState, setRewardState] = useState<"idle" | "pending" | "claimed">("idle");
  const [discountCode, setDiscountCode] = useState("RUBY10");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [rewardLevel, setRewardLevel] = useState("velvet");
  const [dsnAwarded, setDsnAwarded] = useState(500);
  const rewardMutation = trpc.rewards.rubyLoungeComplete.useMutation();
  const scene = scenes[sceneIndex];
  const complete = sceneIndex >= scenes.length;
  const badge = useMemo(() => score >= 9 ? "Cuore indomabile" : score >= 6 ? "Presenza cremisi" : "Primo invito", [score]);

  useEffect(() => {
    if (!complete || rewardState !== "idle") return;
    setRewardState("pending");
    rewardMutation.mutate({ score }, { onSuccess: result => { setDiscountCode(result.discountCode); setDiscountPercent(result.discountPercent); setRewardLevel(result.rewardLevel); setDsnAwarded(result.dsnAwarded); setRewardState("claimed"); }, onError: () => setRewardState("idle") });
  }, [complete, rewardMutation, rewardState, score]);

  const choose = (points: number, nextReply: string) => {
    setScore(current => current + points);
    setReply(nextReply);
    window.setTimeout(() => { setReply(""); setSceneIndex(current => current + 1); }, 850);
  };

  const reset = () => { setStarted(false); setSceneIndex(0); setScore(0); setReply(""); setRewardState("idle"); setDiscountCode("RUBY10"); setDiscountPercent(10); setRewardLevel("velvet"); setDsnAwarded(500); };

  return <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#e25c93]/35 bg-[#100813]">
    <div className="grid md:grid-cols-[1.15fr_.85fr]">
      <div className="min-h-[300px] bg-cover bg-center p-6 md:min-h-[390px] md:p-8" style={{ backgroundImage: "linear-gradient(90deg, rgba(16,8,19,.84), rgba(16,8,19,.35)), url('/manus-storage/rubina-manga-arena_9bb20e80.jpg')" }}>
        <div className="flex items-center justify-between"><span className="rounded-full border border-[#f08db4]/30 bg-[#55122f]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#f4b3cc]">18+ / manga night</span><span className="flex items-center gap-1 text-[10px] text-[#f0d18a]"><Heart size={12} fill="currentColor" /> {score} pts</span></div>
        <div className="mt-24 max-w-sm md:mt-32"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f0d18a]">Ruby Lounge</p><h3 className="display-font mt-3 text-4xl text-white">Il patto di Rubina</h3><p className="mt-3 text-sm leading-6 text-[#eadbe6]">Visual novel interattiva: scegli il ritmo, definisci i confini, conquista il prossimo capitolo.</p></div>
      </div>
      <div className="flex flex-col justify-between p-6 md:p-8">
        {!adultConfirmed ? <div className="flex h-full flex-col justify-center"><LockKeyhole className="text-[#d7b46a]" size={24} /><h4 className="mt-4 text-xl font-extrabold text-white">Esperienza riservata 18+</h4><p className="mt-2 text-sm leading-6 text-[#b9aaba]">Conferma età e regole del club per entrare nel Ruby Lounge.</p><Link href="/accesso" className="mt-5 inline-flex w-fit rounded-full bg-[#d7b46a] px-4 py-2.5 text-xs font-extrabold text-[#100b0c]">Conferma e accedi</Link></div> : !started ? <div className="flex h-full flex-col justify-center"><Sparkles className="text-[#f08db4]" size={24} /><h4 className="mt-4 text-2xl font-extrabold text-white">Una scena, tre soglie.</h4><p className="mt-3 text-sm leading-6 text-[#b9aaba]">Niente nudità, niente contenuto esplicito: solo atmosfera adulta, dialogo e scelte consapevoli.</p><div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px]"><span className="rounded-xl border border-white/10 p-2 text-[#caa9b8]">Velvet<br/><strong>500 DSN · 10%</strong></span><span className="rounded-xl border border-[#d7b46a]/30 p-2 text-[#e6c77f]">Crimson<br/><strong>800 DSN · 15%</strong></span><span className="rounded-xl border border-[#f08db4]/30 p-2 text-[#f3a9c2]">Ruby<br/><strong>1200 DSN · 20%</strong></span></div><button onClick={() => setStarted(true)} className="mt-6 rounded-full bg-[#e2a0bd] px-5 py-3 text-xs font-extrabold text-[#1b0f1a]">Inizia il gioco <Stars size={14} className="ml-1 inline" /></button></div> : complete ? <div className="flex h-full flex-col justify-center"><Heart className="text-[#f08db4]" fill="currentColor" size={25} /><p className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#d7b46a]">Livello {rewardLevel} · capitolo completato</p><h4 className="mt-2 text-2xl font-extrabold text-white">{badge}</h4><p className="mt-3 text-sm leading-6 text-[#b9aaba]">Rubina annuisce. Hai giocato con intensità e hai mantenuto il comando più importante: la tua scelta.</p><div className="mt-5 rounded-2xl border border-[#d7b46a]/25 bg-[#d7b46a]/10 p-4 text-xs leading-5 text-[#f0d18a]">{rewardState === "pending" ? "Salvataggio ricompensa…" : <>Badge sbloccato · +{dsnAwarded} DSN · <strong className="text-white">codice {discountCode}</strong> · {discountPercent}% sul negozio Shopify, una volta per cliente</>}</div><button onClick={reset} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold text-white"><RotateCcw size={14} /> Rigioca</button></div> : <div><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d7b46a]">Scena {sceneIndex + 1} / {scenes.length}</p><span className="text-[10px] text-[#907b8b]">scegli tu</span></div><h4 className="mt-5 text-2xl font-extrabold text-white">{scene.title}</h4><p className="mt-3 text-sm leading-7 text-[#cdbdca]">{scene.text}</p>{reply ? <div className="mt-7 rounded-2xl border border-[#f08db4]/25 bg-[#f08db4]/10 p-4 text-sm leading-6 text-[#f5c7d8]">{reply}</div> : <div className="mt-7 grid gap-3">{scene.choices.map(choice => <button key={choice.label} onClick={() => choose(choice.points, choice.reply)} className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-left text-sm font-bold text-white transition hover:border-[#d7b46a]/60 hover:bg-[#d7b46a]/10">{choice.label}<span className="mt-1 block text-[10px] font-normal text-[#9f8798]">Scelta consensuale · +{choice.points} pts</span></button>)}</div>}<p className="mt-6 text-[9px] leading-4 text-[#806b7c]">Puoi chiudere il gioco in ogni momento. Rubina non esercita controllo reale su di te.</p></div>}
      </div>
    </div>
  </div>;
}
