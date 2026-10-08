import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useVelvet } from "@/contexts/VelvetContext";
import { canConfirmAdult, canEnterMemberArea } from "@shared/access";
import VelvetNav from "@/components/VelvetNav";
import VelvetRail from "@/components/VelvetRail";

export function AuthScreen() {
  const { isAuthenticated, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const login = trpc.auth.login.useMutation();
  const register = trpc.auth.register.useMutation();
  const pending = login.isPending || register.isPending;
  const oauthEnabled = Boolean(import.meta.env.VITE_OAUTH_PORTAL_URL);
  const start = () => { setBusy(true); window.location.href = getLoginUrl("signIn"); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login.mutateAsync({ email: form.email, password: form.password });
      else await register.mutateAsync(form);
      await utils.auth.me.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    }
  };
  const field = "h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-[#9f929e]";
  return <div className="velvet-shell min-h-screen"><VelvetNav compact /><main className="container grid min-h-[calc(100vh-76px)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr]"><section className="max-w-xl"><VelvetRail label="Accesso / 01"><p className="section-kicker">Spazio riservato</p><h1 className="display-font mt-4 text-6xl leading-[.96] text-white md:text-7xl">Entra nel lato più <span className="text-[#d7b46a]">intenzionale</span> di Velvet.</h1></VelvetRail><p className="mt-7 max-w-lg text-lg leading-8 text-[#c8bdc8]">Registrati o accedi con il tuo account per esplorare gli spazi membri, salvare i tuoi riferimenti e gestire la tua privacy.</p><form onSubmit={submit} className="mt-9 grid max-w-md gap-3">{mode === "register" && <input className={field} placeholder="Nome" autoComplete="name" required minLength={2} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}<input className={field} type="email" placeholder="Email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><input className={field} type="password" placeholder="Password (min. 8 caratteri)" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<Button type="submit" disabled={pending || loading || isAuthenticated} className="h-12 rounded-full bg-[#d7b46a] px-6 font-extrabold text-[#0b0908] hover:bg-[#f1d58f]">{isAuthenticated ? "Sessione attiva" : pending ? "Attendi…" : mode === "login" ? "Accedi" : "Registrati"}<ArrowRight size={17} /></Button><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-[#efe5ec] hover:bg-white/10">{mode === "login" ? "Crea un account" : "Ho già un account"}</button>{oauthEnabled && <button type="button" onClick={start} disabled={busy} className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-[#efe5ec] hover:bg-white/10">Altro accesso</button>}<Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-[#efe5ec] hover:bg-white/10">Torna alla home</Link></div></form><div className="mt-8 rounded-3xl border border-[#d7b46a]/20 bg-[#190e22] p-5"><p className="section-kicker">Red Velvet Identify · 18+</p><p className="mt-2 text-sm leading-6 text-[#c8bdc8]">Profilo narrativo per scegliere un ruolo, limiti e preferenze. Non è una verifica dell’identità reale e non abilita automaticamente pagamenti.</p><div className="mt-4 flex flex-wrap gap-2"><a href="https://discord.com/login" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-extrabold text-white">Apri Discord</a><a href="https://github.com/login" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-extrabold text-white">Apri GitHub</a></div></div><div className="mt-10 grid gap-3 text-sm text-[#bdb1bc] sm:grid-cols-2"><span className="flex items-center gap-2"><LockKeyhole size={16} className="text-[#d7b46a]" /> Sessione protetta</span><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#d7b46a]" /> Privacy leggibile</span></div></section><div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#d7b46a]/30 bg-[#120e0b] shadow-[0_30px_100px_rgba(0,0,0,.45)]"><img src="/manus-storage/velvet-members_c5d42225.jpg" alt="Ritratto editoriale di una persona adulta in un salone Art Déco" className="absolute inset-0 h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b0908] via-transparent to-[#0b0908]/20" /><div className="absolute bottom-0 left-0 right-0 p-7"><p className="section-kicker">Velvet membership</p><p className="display-font mt-2 text-4xl text-white">Un invito, non un rumore.</p></div></div></main></div>;
}

export function MemberGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { adultConfirmed, confirmAdult } = useVelvet();
  const [isAdult, setIsAdult] = useState(adultConfirmed);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  if (loading) return <div className="velvet-shell grid min-h-screen place-items-center text-[#d7b46a]">Caricamento sessione…</div>;
  if (!user) return <AuthScreen />;
  if (!canEnterMemberArea(Boolean(user), adultConfirmed)) return <div className="velvet-shell min-h-screen"><VelvetNav compact /><main className="container flex min-h-[calc(100vh-76px)] items-center justify-center py-12"><section className="glass w-full max-w-xl rounded-[2rem] p-8 md:p-10"><div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-[#d7b46a] text-[#0b0908]"><ShieldCheck size={22} /></div><p className="section-kicker">Prima di entrare</p><h1 className="display-font mt-3 text-5xl text-white">Un confine chiaro.</h1><p className="mt-5 leading-7 text-[#c8bdc8]">I contenuti riservati sono accessibili solo a persone adulte. Prima di continuare, conferma l’età e prendi visione dell’informativa essenziale sulla privacy.</p><div className="mt-7 space-y-4 rounded-2xl border border-white/10 bg-white/[.035] p-5 text-sm leading-6 text-[#d7cbd5]"><p className="flex gap-3"><Check className="mt-1 shrink-0 text-[#d7b46a]" size={17} />Dichiaro di avere almeno 18 anni e di utilizzare il servizio in modo legale e responsabile.</p><p className="flex gap-3"><Check className="mt-1 shrink-0 text-[#d7b46a]" size={17} />Comprendo che consenso, rispetto e possibilità di revoca valgono per ogni interazione.</p><p className="flex gap-3"><Check className="mt-1 shrink-0 text-[#d7b46a]" size={17} />I dati di sessione servono per autenticazione e sicurezza; non vendiamo dati personali.</p></div><label className="mt-6 flex items-start gap-3 text-sm text-[#ded2dc]"><Checkbox checked={isAdult} onCheckedChange={(value) => setIsAdult(value === true)} /> <span>Confermo di avere almeno 18 anni.</span></label><label className="mt-4 flex items-start gap-3 text-sm text-[#ded2dc]"><Checkbox checked={acceptsPrivacy} onCheckedChange={(value) => setAcceptsPrivacy(value === true)} /> <span>Ho letto e accetto l’informativa essenziale sulla privacy e le regole di sicurezza.</span></label><Button disabled={!canConfirmAdult(isAdult, acceptsPrivacy)} onClick={confirmAdult} className="mt-7 w-full rounded-full bg-[#d7b46a] py-6 font-extrabold text-[#0b0908] hover:bg-[#f1d58f]">Conferma e accedi <ArrowRight size={17} /></Button><p className="mt-5 flex items-center gap-2 text-xs text-[#9f929e]"><Sparkles size={14} className="text-[#d7b46a]" /> Puoi modificare le preferenze di privacy dal tuo account.</p></section></main></div>;
  return <>{children}</>;
}
