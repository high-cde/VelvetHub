import { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

type ChatMessage = { role: "user" | "assistant"; content: string };

const opening: ChatMessage = {
  role: "assistant",
  content: "Sono Rubina. Entra con presenza: dimmi cosa vuoi esplorare stasera — atmosfera, gioco, disciplina o una conversazione lenta. Qui il consenso è il mio primo comando.",
};

export default function RubinaWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([opening]);
  const chat = trpc.rubina.chat.useMutation();

  const send = () => {
    const content = input.trim();
    if (!content || chat.isPending) return;
    if (!isAuthenticated) {
      toast("Rubina richiede un accesso", { description: "Accedi per parlare con la companion 18+ e mantenere la conversazione privata." });
      startLogin();
      return;
    }
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    chat.mutate({ messages: next.slice(-12) }, {
      onSuccess: (result) => setMessages(current => [...current, { role: "assistant", content: result.content }]),
      onError: () => toast.error("Rubina non è disponibile", { description: "Riprova tra poco." }),
    });
  };

  return <>
    <button aria-label="Attiva Rubina" onClick={() => setOpen(true)} className="rubina-heart fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center text-white shadow-[0_12px_40px_rgba(199,35,92,.45)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#f2a1c0]" title="Attiva Rubina">
      <span className="absolute inset-0 grid place-items-center"><Sparkles size={17} /></span>
      <span className="sr-only">Parla con Rubina</span>
    </button>
    {open && <div className="fixed inset-0 z-50 bg-black/65 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-label="Chat con Rubina" className="rubina-panel absolute bottom-4 right-4 flex h-[min(680px,calc(100vh-2rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[2rem] border border-[#e25c93]/35 bg-[#160b16] shadow-2xl" onClick={event => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-white/10 bg-cover bg-center p-5" style={{ backgroundImage: "linear-gradient(90deg, rgba(58,16,44,.92), rgba(26,13,27,.72)), url('/assets/rubina-editorial.jpg')" }}>
          <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#ff7ba9] via-[#c52567] to-[#5b092f] text-white shadow-[inset_-5px_-5px_10px_rgba(0,0,0,.35)]"><Sparkles size={19} /></div><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f2a1c0]">Rubina / companion</p><h2 className="display-font mt-1 text-2xl text-white">La tua mistress.</h2></div></div>
          <button onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 text-[#cdbdcc] hover:text-white" aria-label="Chiudi Rubina"><X size={18} /></button>
        </header>
        <div className="border-b border-[#e25c93]/15 bg-[#260e21]/70 px-5 py-3 text-[10px] leading-4 text-[#d8b8cc]">Roleplay adulto, consensuale e non esplicito. Puoi dire stop in qualsiasi momento. Rubina non sostituisce supporto medico, psicologico o umano.</div>
        <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-[#d7b46a] p-3 text-sm text-[#170c11]" : "mr-5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[.05] p-3 text-sm leading-6 text-[#eadbe6]"}>{message.content}</div>)}{chat.isPending && <div className="mr-12 rounded-2xl border border-white/10 bg-white/[.05] p-3 text-sm text-[#d8b8cc]">Rubina sta scegliendo le parole…</div>}</div>
        <form onSubmit={event => { event.preventDefault(); send(); }} className="border-t border-white/10 p-4"><div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3"><input value={input} onChange={event => setInput(event.target.value)} placeholder="Parlami, se hai il coraggio…" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#8e7187]" maxLength={1200} /><button aria-label="Invia a Rubina" disabled={!input.trim() || chat.isPending} className="rounded-full p-2 text-[#f2a1c0] disabled:opacity-40"><Send size={17} /></button></div><p className="mt-2 text-center text-[9px] text-[#8d7186]">18+ · consenso esplicito · niente minacce, coercizione o contenuti sessuali espliciti</p></form>
      </section>
    </div>}
  </>;
}
