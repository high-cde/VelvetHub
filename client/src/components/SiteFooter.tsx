import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container flex flex-col gap-4 text-xs text-[#8f7f8f] md:flex-row md:items-center md:justify-between">
        <p>© Red Velvet Club · Solo adulti 18+ · Contenuti di fiction basati sul consenso.</p>
        <nav aria-label="Link utili" className="flex flex-wrap gap-4 font-bold text-[#b9aaba]">
          <Link href="/gioco" className="hover:text-white">Gioca</Link>
          <Link href="/radar" className="hover:text-white">Radar 3D</Link>
          <Link href="/safety" className="hover:text-white">Sicurezza</Link>
          <Link href="/policy" className="hover:text-white">Privacy e termini</Link>
        </nav>
      </div>
    </footer>
  );
}
