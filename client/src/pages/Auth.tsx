import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/_core/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { loginSchema, signupSchema, type SignupInput } from "@shared/authSchemas";
import { useVelvet } from "@/contexts/VelvetContext";
import { canConfirmAdult, canEnterMemberArea } from "@shared/access";
import VelvetNav from "@/components/VelvetNav";
import VelvetRail from "@/components/VelvetRail";

function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const utils = trpc.useUtils();
  const form = useForm<SignupInput>({ resolver: zodResolver(mode === "signup" ? signupSchema : loginSchema), defaultValues: { email: "", password: "" } });
  const onSuccess = async () => {
    toast.success(mode === "signup" ? "Account creato. Benvenuto in Velvet!" : "Accesso effettuato.");
    await utils.auth.me.invalidate();
  };
  const onError = (error: { message: string }) => toast.error(error.message);
  const signup = trpc.auth.signup.useMutation({ onSuccess, onError });
  const login = trpc.auth.login.useMutation({ onSuccess, onError });
  const pending = signup.isPending || login.isPending;
  const submit = form.handleSubmit(values => (mode === "signup" ? signup : login).mutate(values));
  const switchMode = () => { setMode(mode === "login" ? "signup" : "login"); form.clearErrors(); };
  const errors = form.formState.errors;
  return <form onSubmit={submit} noValidate className="mt-9 w-full max-w-md space-y-4"><div><Input type="email" autoComplete="email" placeholder="Email" aria-invalid={Boolean(errors.email)} {...form.register("email")} />{errors.email && <p role="alert" className="mt-1 text-xs text-red-300">{errors.email.message}</p>}</div><div><Input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="Password" aria-invalid={Boolean(errors.password)} {...form.register("password")} />{errors.password && <p role="alert" className="mt-1 text-xs text-red-300">{errors.password.message}</p>}</div><Button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-[#d7b46a] px-6 font-extrabold text-[#0b0908] hover:bg-[#f1d58f]">{pending ? "Attendi…" : mode === "signup" ? "Crea account" : "Accedi"}<ArrowRight size={17} /></Button><button type="button" onClick={switchMode} className="text-sm font-bold text-[#d7b46a] hover:underline">{mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}</button></form>;
}

export function AuthScreen() {
  const { isAuthenticated } = useAuth();
  return <div className="velvet-shell min-h-screen"><VelvetNav compact /><main className="container grid min-h-[calc(100vh-76px)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr]"><section className="max-w-xl"><VelvetRail label="Accesso / 01"><p className="section-kicker">Spazio riservato</p><h1 className="display-font mt-4 text-6xl leading-[.96] text-white md:text-7xl">Entra nel lato più <span className="text-[#d7b46a]">intenzionale</span> di Velvet.</h1></VelvetRail><p className="mt-7 max-w-lg text-lg leading-8 text-[#c8bdc8]">Registrati o accedi con il tuo account per esplorare gli spazi membri, salvare i tuoi riferimenti e gestire la tua privacy.</p>{isAuthenticated ? <div className="mt-9 flex flex-wrap items-center gap-3"><span className="flex items-center gap-2 text-sm font-bold text-[#d7b46a]"><Check size={16} /> Sessione attiva</span><Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-[#efe5ec] hover:bg-white/10">Torna alla home</Link></div> : <><AuthForm /><Link href="/" className="mt-4 inline-block rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-[#efe5ec] hover:bg-white/10">Torna alla home</Link></>}<div className="mt-8 rounded-3xl border border-[#d7b46a]/20 bg-[#190e22] p-5"><p className="section-kicker">Red Velvet Identify · 18+</p><p className="mt-2 text-sm leading-6 text-[#c8bdc8]">Profilo narrativo per scegliere un ruolo, limiti e preferenze. Non è una verifica dell’identità reale e non abilita automaticamente pagamenti.</p><div className="mt-4 flex flex-wrap gap-2"><a href="https://discord.com/login" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-extrabold text-white">Apri Discord</a><a href="https://github.com/login" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-extrabold text-white">Apri GitHub</a><span className="rounded-full border border-[#d7b46a]/25 px-4 py-2 text-xs font-extrabold text-[#f1d58f]">OAuth provider: da configurare</span></div></div><div className="mt-10 grid gap-3 text-sm text-[#bdb1bc] sm:grid-cols-2"><span className="flex items-center gap-2"><LockKeyhole size={16} className="text-[#d7b46a]" /> Sessione protetta</span><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#d7b46a]" /> Privacy leggibile</span></div></section><div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#d7b46a]/30 bg-[#120e0b] shadow-[0_30px_100px_rgba(0,0,0,.45)]"><img src="/manus-storage/velvet-members_c5d42225.jpg" alt="Ritratto editoriale di una persona adulta in un salone Art Déco" className="absolute inset-0 h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b0908] via-transparent to-[#0b0908]/20" /><div className="absolute bottom-0 left-0 right-0 p-7"><p className="section-kicker">Velvet membership</p><p className="display-font mt-2 text-4xl text-white">Un invito, non un rumore.</p></div></div></main></div>;
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
