'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, ShieldAlert, BarChart3, Radio } from 'lucide-react';
import { LivePulse } from '@/components/dashboard/live-pulse';
import { SecurityDossier } from '@/components/dashboard/security-dossier';
import { MarketMetrics } from '@/components/dashboard/market-metrics';

const fetchAnalysis = async () => {
  const { data } = await axios.get('/api/v1/analyze');
  return data.data;
};

export default function Dashboard() {
  const [selectedToken, setSelectedToken] = useState<any>(null);

  const { data: listings, isLoading, isError } = useQuery({
    queryKey: ['tokenAnalysis'],
    queryFn: fetchAnalysis,
    refetchInterval: 15000, 
  });

  if (listings?.length > 0 && !selectedToken) {
    setSelectedToken(listings[0]);
  }

  const currentTokenData = listings?.find((t: any) => t.address === selectedToken?.address) || selectedToken;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 relative">
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
      
      <div className="flex flex-col h-full relative z-10 p-4 space-y-4 max-w-[1920px] mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 glass-panel rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center neon-border-emerald">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase flex items-center">
              Sentinel<span className="text-emerald-400/50 mx-1">/</span><span className="text-zinc-500 font-light tracking-wide">Pro</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-1.5 bg-black/40 rounded-full border border-white/5 shadow-inner">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400/90 text-xs font-bold tracking-widest uppercase">Secured Link</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-400 font-mono text-xs">AWAITING_PULSE_15s</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          
          {/* Left Column: Live Pulse */}
          <div className="col-span-3 h-full glass-panel rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center space-x-2 bg-black/20 backdrop-blur-md">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]">Live Pulse</h2>
            </div>
            <LivePulse 
              listings={listings || []} 
              isLoading={isLoading} 
              selected={currentTokenData} 
              onSelect={setSelectedToken} 
            />
          </div>

          {/* Center Column: Security Dossier */}
          <div className="col-span-6 h-full glass-panel rounded-2xl flex flex-col relative overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center space-x-2 bg-black/20 backdrop-blur-md z-20">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]">Security Dossier</h2>
            </div>
            <SecurityDossier token={currentTokenData} isLoading={isLoading} />
          </div>

          {/* Right Column: Market Metrics */}
          <div className="col-span-3 h-full glass-panel rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center space-x-2 bg-black/20 backdrop-blur-md">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]">Market Edge</h2>
            </div>
            <MarketMetrics token={currentTokenData} isLoading={isLoading} />
          </div>

        </div>
      </div>
    </div>
  );
}
