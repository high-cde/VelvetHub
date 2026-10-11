import React, { useState } from 'react';
import { 
  Menu, X, Compass, MessageCircle, PlusSquare, Sparkles, FolderHeart, 
  PlaySquare, Users, Headphones, Shield, DollarSign, Gift, User, 
  Settings, Globe, MessageSquare, ChevronRight, Play, Pause, Square, Save, 
  Heart, Zap, Key, Lock, Eye, Flame, Anchor, Star, Link, Mic, Volume2
} from 'lucide-react';

export default function VelvetDreamApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('crea');
  const [gameState, setGameState] = useState('playing');

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 w-80 bg-[#16121a] border-r border-[#2e212b] transform transition-transform duration-300 z-50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-[#2e212b]">
        <h2 className="text-xl font-bold italic tracking-tighter text-white">velvet<span className="text-pink-500">hub</span></h2>
        <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-140px)] p-2">
        <nav className="space-y-1">
          <MenuItem icon={<Compass />} text="Esplora" onClick={() => {setActiveTab('esplora'); setIsMenuOpen(false);}} active={activeTab === 'esplora'} />
          <MenuItem icon={<MessageCircle />} text="Chat" onClick={() => {setActiveTab('chat'); setIsMenuOpen(false);}} active={activeTab === 'chat'} />
          <MenuItem icon={<PlusSquare />} text="Crea" onClick={() => {setActiveTab('crea'); setIsMenuOpen(false);}} active={activeTab === 'crea'} />
          <MenuItem icon={<Sparkles />} text="Genera" onClick={() => {setActiveTab('genera'); setIsMenuOpen(false);}} active={activeTab === 'genera'} />
          <MenuItem icon={<FolderHeart />} text="La mia IA" onClick={() => {setActiveTab('mia-ia'); setIsMenuOpen(false);}} active={activeTab === 'mia-ia'} />
          <div className="my-2 border-t border-[#2e212b]"></div>
          <MenuItem icon={<User />} text="Profilo" onClick={() => {setActiveTab('profilo'); setIsMenuOpen(false);}} active={activeTab === 'profilo'} />
        </nav>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="p-4 space-y-4 pb-24">
      <div className="bg-[#16121a] rounded-2xl border border-[#2e212b] p-4 flex items-center gap-2">
        <DollarSign className="text-pink-500" size={20} />
        <span className="text-white font-bold">55 monete ($DSN)</span>
      </div>
    </div>
  );

  const CreatorView = () => (
    <div className="p-4 pb-32">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Seleziona Dinamica (Relazione)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <CreatorCard id="dom_sub" title="Dom / Sub" icon={<Shield />} active />
        <CreatorCard id="master_slave" title="Master / Slave (TPE)" icon={<Key />} />
        <CreatorCard id="brat_tamer" title="Brat / Tamer" icon={<Zap />} />
      </div>
      <div className="mt-8">
        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:brightness-110">
          Inizia Sessione ($DSN)
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b090c] text-white font-sans relative overflow-x-hidden">
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}
      <Sidebar />
      <header className="sticky top-0 bg-[#0b090c]/90 backdrop-blur-md z-30 border-b border-[#2e212b] p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-gray-300 hover:text-white"><Menu size={26} /></button>
          <span className="font-bold text-lg tracking-tight">Velvet<span className="text-pink-500">Hub</span></span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#16121a] p-1 rounded-lg border border-[#2e212b]">
          <button title="Salva Account" className="p-1.5 rounded-md hover:bg-[#2e212b] text-gray-400 hover:text-white transition"><Save size={18} /></button>
          <div className="w-px h-5 bg-[#2e212b]"></div>
          <button onClick={() => setGameState('paused')} className={`p-1.5 rounded-md transition ${gameState === 'paused' ? 'bg-yellow-500/20 text-yellow-500' : 'hover:bg-yellow-500/10 text-gray-400'}`}><Pause size={18} /></button>
          <button onClick={() => setGameState('stopped')} className={`p-1.5 rounded-md transition ${gameState === 'stopped' ? 'bg-red-500/20 text-red-500' : 'hover:bg-red-500/10 text-gray-400'}`}><Square size={18} /></button>
        </div>
      </header>
      <main className="w-full max-w-2xl mx-auto">
        {activeTab === 'crea' && <CreatorView />}
        {activeTab === 'profilo' && <ProfileView />}
      </main>
    </div>
  );
}

function MenuItem({ icon, text, onClick, active }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 mx-2 rounded-xl cursor-pointer transition ${active ? 'bg-[#2e212b] text-pink-500' : 'text-gray-300 hover:bg-[#2e212b] hover:text-white'}`}>
      <div className={`${active ? 'text-pink-500' : 'text-gray-400'}`}>{icon}</div>
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
}
function CreatorCard({ id, title, icon, active }: any) {
  return (
    <div className={`flex items-center p-3 rounded-xl cursor-pointer transition-all bg-[#16121a] border ${active ? 'border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.3)]' : 'border-[#2e212b] hover:border-pink-500/40'}`}>
      <div className="w-10 h-10 rounded-lg bg-[#1f1824] border border-pink-500/20 flex items-center justify-center mr-3 shrink-0 text-pink-500">{icon}</div>
      <span className="text-white font-medium text-sm leading-tight">{title}</span>
    </div>
  );
}
