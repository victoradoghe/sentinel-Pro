import Link from 'next/link';
import { ShieldAlert, Activity, Cpu, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center neon-border-emerald">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tighter text-white uppercase">
            Sentinel<span className="text-emerald-400/50 mx-1">/</span><span className="text-zinc-500 font-light tracking-wide">Pro</span>
          </span>
        </div>
        <Link href="/dashboard">
          <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors backdrop-blur-md">
            Enter App
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12 text-center">
        
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Birdeye API Integration Active
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white uppercase mb-6 drop-shadow-2xl max-w-5xl leading-[0.9]">
          The Ultimate <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Agentic Security
          </span> <br/>
          Dashboard
        </h1>
        
        <p className="text-zinc-400 max-w-2xl text-sm sm:text-lg font-mono tracking-wide mb-12">
          Harness real-time Birdeye Data to detect Solana Rug-pulls, track early Meme-coins, and intercept high-risk contracts autonomously.
        </p>

        <Link href="/dashboard">
          <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-emerald-500 rounded-lg font-black uppercase tracking-[0.2em] text-emerald-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center space-x-3">
             <span>Launch War Room</span>
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

      </main>

      {/* Features Grid */}
      <div className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-12">
          
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <Activity className="w-6 h-6 text-emerald-400" />
             </div>
             <h3 className="text-white font-bold tracking-widest uppercase text-sm">Live Token Radar</h3>
             <p className="text-zinc-500 text-xs font-mono leading-relaxed">Streams brand new token listings from the Solana blockchain milliseconds after liquidity is added.</p>
          </div>

          <div className="space-y-4">
             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <ShieldAlert className="w-6 h-6 text-rose-400" />
             </div>
             <h3 className="text-white font-bold tracking-widest uppercase text-sm">Risk Interception</h3>
             <p className="text-zinc-500 text-xs font-mono leading-relaxed">Deep-scans smart contracts to detect un-renounced mint authorities, freeze capabilities, and holder concentration risks.</p>
          </div>

          <div className="space-y-4">
             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <Cpu className="w-6 h-6 text-purple-400" />
             </div>
             <h3 className="text-white font-bold tracking-widest uppercase text-sm">Algorithmic Trust Score</h3>
             <p className="text-zinc-500 text-xs font-mono leading-relaxed">Evaluates liquidity density and trading momentum via a strict 100-point formulaic matrix to classify token safety.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
