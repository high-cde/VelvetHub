import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Compass, PlusSquare, Sparkles, FolderHeart, 
  Save, Pause, Square, Shield, Key, Zap, Lock, Eye, Flame, Anchor,
  Terminal, Activity, Lightbulb, Gamepad2, Coins, BarChart,
  HeartPulse, Fingerprint, Database, VolumeX, Volume2
} from 'lucide-react';

export default function VelvetDreamApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('crea'); 
  const [gameState, setGameState] = useState('playing');
  const [walletAddress, setWalletAddress] = useState('');
  const [hueEnabled, setHueEnabled] = useState(false);
  const [bpm, setBpm] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  useEffect(() => {
    if (audioEnabled && gameState !== 'stopped') {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (oscRef.current) oscRef.current.disconnect();
      
      oscRef.current = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      
      if (gameState === 'aftercare') {
        oscRef.current.type = 'sine';
        oscRef.current.frequency.setValueAtTime(432, audioCtxRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
      } else if (gameState === 'paused') {
        oscRef.current.type = 'triangle';
        oscRef.current.frequency.setValueAtTime(200, audioCtxRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
      } else {
        oscRef.current.type = 'square';
        oscRef.current.frequency.setValueAtTime(65, audioCtxRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.02, audioCtxRef.current.currentTime);
      }

      oscRef.current.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      oscRef.current.start();
    } else if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
    }
    return () => { if (oscRef.current) { oscRef.current.disconnect(); } };
  }, [gameState, audioEnabled]);

  const connectBiometrics = () => {
    alert("In attesa di connessione Web Bluetooth con Heart Rate Monitor...");
    setBpm(85);
    setInterval(() => setBpm(prev => prev ? prev + Math.floor(Math.random() * 5 - 1) : 85), 3000);
  };

  useEffect(() => {
    if (bpm && bpm > 130 && gameState === 'playing') {
      console.log("[Z-PULSE OVERRIDE] BPM critici. Passaggio forzato a Soft Dom.");
      setGameState('paused');
    }
  }, [bpm, gameState]);

  const saveToIPFS = () => {
    const fakeHash = 'Qm' + Array.from({length: 44}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    setIpfsHash(fakeHash);
    alert('Stato criptato e ancorato su IPFS.\nHash: ' + fakeHash);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Errore Web3", error);
      }
    } else {
      alert("Integrazione TMA (Telegram) o MetaMask richiesta.");
    }
  };

  const handleSafeword = (type) => {
    if (type === 'yellow') {
      setGameState('paused');
    } else if (type === 'red') {
      setGameState('aftercare');
      setIpfsHash(null);
      if (hueEnabled) console.log("[HUE API] Luci: Bianco Freddo 100%");
      alert("Drop-Switch On-Chain attivato. Transazione killSession() inviata. Log bruciati.");
    }
  };

  const signMultiSig = () => {
    if (!walletAddress) return alert("Connetti il wallet prima di firmare il patto.");
    alert("Firma 1/2 acquisita. In attesa della firma del partner/sistema per il TPE.");
  };

  const AftercareView = () => (
    <div className="p-6 bg-[#16121a] rounded-2xl border border-red-900/50 m-4 text-center mt-12 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
      <BarChart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Drop-Switch Attivato</h2>
      <p className="text-gray-400 text-sm mb-6">Contratto terminato on-chain. Defaticamento a 432Hz.</p>
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="bg-[#0b090c] p-3 rounded-xl border border-[#2e212b]">
          <span className="text-xs text-gray-500 block">Ultimi BPM</span>
          <span className="text-red-400 font-bold">{bpm || '--'}</span>
        </div>
        <div className="bg-[#0b090c] p-3 rounded-xl border border-[#2e212b]">
          <span className="text-xs text-gray-500 block">Black Book IPFS</span>
          <span className="text-red-500 font-bold">BURNED</span>
        </div>
      </div>
      <button onClick={() => setGameState('playing')} className="mt-6 w-full py-3 bg-[#2e212b] rounded-xl text-white font-bold hover:bg-[#3d2d3a]">Nuova Istanza</button>
    </div>
  );

  const EnhancedCreator = () => (
    <div className="p-4 pb-32">
      <div className="bg-gradient-to-r from-[#2a1122] to-[#16121a] p-4 rounded-2xl border border-pink-500/30 mb-4 flex justify-between items-center">
        <div>
          <h4 className="text-white font-bold text-sm flex items-center gap-2"><Coins className="w-4 h-4 text-pink-500"/> $DSN</h4>
          <p className="text-xs text-gray-400">{walletAddress ? walletAddress.substring(0,6) + '...' : 'Wallet non connesso'}</p>
        </div>
        <button onClick={connectWallet} className="px-3 py-1.5 bg-pink-500 rounded-lg text-white text-xs font-bold shadow-[0_0_10px_rgba(236,72,153,0.5)]">
          {walletAddress ? 'Connesso' : 'Connetti Web3'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={connectBiometrics} className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#16121a] border border-[#2e212b] hover:border-pink-500/50">
          <HeartPulse className={`w-6 h-6 mb-1 ${bpm ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
          <span className="text-xs text-gray-400">Z-Pulse {bpm ? bpm + ' BPM' : 'Off'}</span>
        </button>
        <button onClick={() => setAudioEnabled(!audioEnabled)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#16121a] border border-[#2e212b] hover:border-pink-500/50">
          {audioEnabled ? <Volume2 className="w-6 h-6 mb-1 text-pink-500" /> : <VolumeX className="w-6 h-6 mb-1 text-gray-500" />}
          <span className="text-xs text-gray-400">Synth Binaurale</span>
        </button>
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Patto della Soglia</h3>
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#16121a] border border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
          <div className="flex items-center">
            <Key className="w-8 h-8 p-1.5 rounded-lg bg-[#1f1824] text-pink-500 mr-3" />
            <div>
              <span className="text-white font-medium text-sm block">Master / Slave (TPE)</span>
              <span className="text-xs text-gray-400">Richiede Multi-Sig</span>
            </div>
          </div>
          <button onClick={signMultiSig} className="px-3 py-2 bg-[#2e212b] rounded-lg text-pink-500 hover:bg-pink-500 hover:text-white transition">
            <Fingerprint className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b090c] text-white font-sans relative overflow-x-hidden">
      <header className="sticky top-0 bg-[#0b090c]/90 backdrop-blur-md z-30 border-b border-[#2e212b] p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-2 text-gray-300 hover:text-white"><Menu size={26} /></button>
          <span className="font-bold text-lg tracking-tight">Velvet<span className="text-pink-500">Hub</span></span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#16121a] p-1 rounded-lg border border-[#2e212b]">
          <button onClick={saveToIPFS} title="Salva su IPFS" className="p-1.5 rounded-md text-gray-400 hover:text-white transition"><Database size={18} /></button>
          <div className="w-px h-5 bg-[#2e212b]"></div>
          <button onClick={() => handleSafeword('yellow')} className="p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition"><Pause size={18} /></button>
          <button onClick={() => handleSafeword('red')} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 transition"><Square size={18} /></button>
        </div>
      </header>

      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}
      <div className={`fixed inset-y-0 left-0 w-80 bg-[#16121a] border-r border-[#2e212b] transform transition-transform duration-300 z-50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#2e212b]">
          <h2 className="text-xl font-bold">ZDOS <span className="text-pink-500">System</span></h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="p-2 space-y-1">
          <div onClick={() => {setActiveTab('crea'); setIsMenuOpen(false);}} className="flex items-center gap-4 p-3 text-white cursor-pointer hover:bg-[#2e212b] rounded-xl"><PlusSquare/> Creator</div>
          <div className="my-2 border-t border-[#2e212b]"></div>
          <div className="flex items-center justify-between p-3 text-gray-400 rounded-xl">
            <div className="flex items-center gap-4"><Lightbulb/> Bridge ESP32/Hue</div>
            <input type="checkbox" checked={hueEnabled} onChange={() => setHueEnabled(!hueEnabled)} className="accent-pink-500 w-4 h-4" />
          </div>
        </nav>
      </div>

      <main className="w-full max-w-2xl mx-auto">
        {gameState === 'aftercare' ? <AftercareView /> : (
          <>
            {activeTab === 'crea' && <EnhancedCreator />}
          </>
        )}
      </main>
    </div>
  );
}
