/* Velvet Salon: a quiet, tactile navigation rail with clear escape routes and compact mobile choreography. */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AudioLines, Bell, BookOpen, Compass, Crown, Gift, LogIn, LogOut, Menu, MessageCircle, Radio, ShieldCheck, ShoppingBag, Sparkles, Users, WalletCards, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useVelvet } from "@/contexts/VelvetContext";

const links = [
  { href: "/discover", label: "Scopri", icon: Compass },
  { href: "/studio", label: "Creator studio", icon: Crown },
  { href: "/inbox", label: "Messaggi", icon: MessageCircle },
  { href: "/community", label: "Community", icon: Users },
  { href: "/earnings", label: "Guadagni", icon: WalletCards },
  { href: "/podcasts", label: "Podcast", icon: AudioLines },
  { href: "/writing", label: "Scrittura", icon: BookOpen },
  { href: "/rewards", label: "VIP & Affiliazione", icon: Gift },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/safety", label: "Sicurezza", icon: ShieldCheck },
  { href: "/live", label: "Live Hub", icon: Radio },
  { href: "/ourvelvet", label: "OurVelvet", icon: Sparkles },
];

export default function VelvetNav({ compact = false }: { compact?: boolean }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { profile } = useVelvet();
  const { user, isAuthenticated, logout, previewMode } = useAuth();
  const signIn = () => { if (previewMode) { window.location.href = `${import.meta.env.BASE_URL}accesso/`; return; } window.location.href = getLoginUrl("signIn"); };
  const signUp = () => { if (previewMode) { window.location.href = `${import.meta.env.BASE_URL}accesso/`; return; } window.location.href = getLoginUrl("signUp"); };
  const signOut = async () => { await logout(); toast("Sessione chiusa", { description: "Puoi tornare quando vuoi." }); };
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08060b]/90 backdrop-blur-xl">
      <div className="container flex min-h-[76px] items-center justify-between gap-5">
        <Link href="/" onClick={() => setOpen(false)} className="group flex shrink-0 items-center gap-3 text-white no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d7b46a] p-2 shadow-[0_0_28px_rgba(232,162,187,.2)] transition-transform duration-200 group-hover:rotate-6">
            <span aria-hidden="true" className="display-font text-2xl text-[#0b0908]">V</span>
          </span>
          <span className="leading-none"><span className="display-font text-[26px]">Red Velvet</span><span className="ml-1.5 text-[10px] font-extrabold uppercase tracking-[.28em] text-[#d7b46a]">Club</span></span>
        </Link>
        {!compact && <nav className="hidden items-center gap-6 text-[13px] font-semibold text-[#b9afba] lg:flex" aria-label="Navigazione principale">
          {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-2 hover:text-white ${location === href ? "text-[#f1d58f]" : ""}`}><Icon size={15} />{label}</Link>)}
          <Link href="/settings" className={`text-[#b9afba] hover:text-white ${location === "/settings" ? "text-[#f1d58f]" : ""}`}>Account</Link>
        </nav>}
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Apri notifiche" onClick={() => toast("Nessuna nuova notifica", { description: "Ti avviseremo quando ci sarà qualcosa da vedere." })} className="hidden h-10 w-10 place-items-center rounded-full border border-white/10 text-[#b9afba] hover:border-white/20 hover:text-white sm:grid"><Bell size={16} /></button>
          {isAuthenticated ? <div className="hidden items-center gap-2 sm:flex"><Link href="/settings" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ded2dc] hover:border-[#d7b46a]/40"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d7b46a] text-[10px] text-[#09070d]">{(user?.name ?? profile.displayName).slice(0, 1)}</span>{user?.name ?? profile.displayName}</Link><button type="button" onClick={signOut} aria-label="Esci" className="rounded-full border border-white/10 p-2 text-[#b9afba] hover:text-white"><LogOut size={15} /></button></div> : <div className="hidden items-center gap-2 sm:flex"><button type="button" onClick={signUp} className="rounded-full border border-[#d7b46a]/40 px-4 py-2.5 text-xs font-extrabold text-[#d7b46a] hover:bg-[#d7b46a]/10">Registrati</button><button type="button" onClick={signIn} className="flex items-center gap-2 rounded-full bg-[#d7b46a] px-4 py-2.5 text-xs font-extrabold text-[#09070d] hover:bg-[#f1d58f]"><LogIn size={15} /> Accedi</button></div>}
          <button type="button" aria-label={open ? "Chiudi menu" : "Apri menu"} onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[#f2e7ee] hover:border-white/25 lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      {open && <div className="border-t border-white/10 bg-[#0d0812] px-4 pb-5 pt-3 lg:hidden"><nav className="container flex flex-col gap-1" aria-label="Navigazione mobile">
        {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${location === href ? "bg-[#6f5220]/30 text-[#f1d58f]" : "text-[#c0b3bf] hover:bg-white/5 hover:text-white"}`}><Icon size={17} />{label}</Link>)}
        <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#c0b3bf] hover:bg-white/5 hover:text-white">Account</Link>
        {!isAuthenticated ? <div className="mt-2 grid gap-2"><button type="button" onClick={() => { signUp(); setOpen(false); }} className="flex items-center justify-center gap-2 rounded-xl border border-[#d7b46a]/40 px-4 py-3 text-sm font-extrabold text-[#d7b46a]">Registrati</button><button type="button" onClick={() => { signIn(); setOpen(false); }} className="flex items-center justify-center gap-2 rounded-xl bg-[#d7b46a] px-4 py-3 text-sm font-extrabold text-[#09070d]"><LogIn size={15} /> Accedi</button></div> : <button type="button" onClick={() => { signOut(); setOpen(false); }} className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-extrabold text-white"><LogOut size={15} /> Esci</button>}
      </nav></div>}
    </header>
  );
}
