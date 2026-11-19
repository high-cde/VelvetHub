import { Link } from "wouter";
import VelvetNav from "@/components/VelvetNav";

export default function NotFound() {
  return (
    <div className="velvet-shell min-h-screen">
      <VelvetNav />
      <main className="container grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <p className="section-kicker">Errore 404</p>
          <h1 className="display-font mt-4 text-6xl text-white md:text-7xl">Questa porta <em className="text-[#e2a0bd]">non si apre.</em></h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#b9aaba]">La pagina che cerchi non esiste o è stata spostata. Torna in sala o prova un'altra porta.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-full bg-[#d7b46a] px-6 py-3 text-sm font-bold text-black">Torna alla home</Link>
            <Link href="/gioco" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">Gioca a Vic Velluto</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
