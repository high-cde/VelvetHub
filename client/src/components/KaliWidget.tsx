import { useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

type ChatMessage = { role: "user" | "assistant"; content: string };

const opening: ChatMessage = {
  role: "assistant",
  content: "Sono Kali. Rubina mi ha insegnato che la disciplina migliore comincia dall'ascolto. Dimmi quale confine vuoi esplorare, oppure chiedimi una pausa.",
};

export default function KaliWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([opening]);
  const chat = trpc.kali.chat.useMutation();

  const send = () => {
    const content = input.trim();
    if (!content || chat.isPending) return;
    if (!isAuthenticated) {
      toast("Kali richiede un accesso", { description: "Accedi per mantenere privata la conversazione 18+." });
      startLogin();
      return;
    }
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    chat.mutate({ messages: next.slice(-12) }, {
      onSuccess: result => setMessages(current => [...current, { role: "assistant", content: result.content }]),
      onError: () => toast.error("Kali non è disponibile", { description: "Riprova tra poco." }),
    });
  };

  return <>
    <button aria-label="Attiva Kali" onClick={() => setOpen(true)} className="fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-[#91b7d5]/40 bg-[#172b3a] text-[#b8d9ef] shadow-[0_12px_40px_rgba(32,95,135,.35)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#91b7d5]" title="Attiva Kali">
      <Sparkles size={17} /><span className="sr-only">Parla con Kali</span>
    </button>
    {open && <div className="fixed inset-0 z-50 bg-black/65 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-label="Chat con Kali" className="absolute bottom-4 left-4 flex h-[min(680px,calc(100vh-2rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[2rem] border border-[#91b7d5]/35 bg-[#0f1820] shadow-2xl" onClick={event => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-white/10 bg-[#172b3a] p-5"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-[#91b7d5] text-[#0b141b]"><MessageCircle size={19} /></div><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#b8d9ef]">Kali / companion</p><h2 className="mt-1 text-2xl font-bold text-white">Il tuo master narrativo.</h2></div></div><button onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 text-[#cbd7de] hover:text-white" aria-label="Chiudi Kali"><X size={18} /></button></header>
        <div className="border-b border-[#91b7d5]/15 bg-[#142733] px-5 py-3 text-[10px] leading-4 text-[#c2d9e8]">Roleplay adulto, consensuale e non esplicito. Kali è una AI finzionale e non sostituisce supporto umano.</div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-[#91b7d5] p-3 text-sm text-[#0b141b]" : "mr-5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[.05] p-3 text-sm leading-6 text-[#e1edf4]"}>{message.content}</div>)}{chat.isPending && <div className="mr-12 rounded-2xl border border-white/10 bg-white/[.05] p-3 text-sm text-[#c2d9e8]">Kali sta scegliendo le parole…</div>}</div>
        <form onSubmit={event => { event.preventDefault(); send(); }} className="border-t border-white/10 p-4"><div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3"><input value={input} onChange={event => setInput(event.target.value)} placeholder="Parla con Kali…" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#879eae]" maxLength={1200} /><button aria-label="Invia a Kali" disabled={!input.trim() || chat.isPending} className="rounded-full p-2 text-[#b8d9ef] disabled:opacity-40"><Send size={17} /></button></div><p className="mt-2 text-center text-[9px] text-[#879eae]">18+ · consenso esplicito · stop sempre disponibile</p></form>
      </section>
    </div>}
  </>;
}
