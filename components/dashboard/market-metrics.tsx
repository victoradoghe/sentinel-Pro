'use client';

import { Activity, DollarSign, Droplets, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MarketMetricsProps {
  token: any;
  isLoading: boolean;
}

export function MarketMetrics({ token, isLoading }: MarketMetricsProps) {
  if (isLoading && !token) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-6 relative z-10 w-full h-full">
        <div className="animate-pulse space-y-6 w-full">
          <div className="h-24 bg-white/5 border border-white/5 rounded-2xl w-full"></div>
          <div className="h-24 bg-white/5 border border-white/5 rounded-2xl w-full"></div>
          <div className="h-32 bg-white/5 border border-white/5 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  if (!token) return <div className="flex-1 flex items-center justify-center text-white/20 font-mono text-sm tracking-widest relative z-10">NO MARKET DATA</div>;

  const raw = token.rawMetrics?.market || {};
  
  const mcap = raw.marketcap ? formatCurrency(raw.marketcap) : 'N/A';
  const price = raw.price ? `$${raw.price.toFixed(6)}` : 'N/A';
  const liq = raw.liquidity ? formatCurrency(raw.liquidity) : 'N/A';
  
  const v30m = raw.v30mUSD || 0;
  const v1h = raw.v1hUSD || 0;
  
  const volumeRatio = v1h > 0 ? (v30m / (v1h / 2)) * 100 : 0; 

  const progressProps = {
    className: "h-2 bg-black/60 shadow-inner rounded-full overflow-hidden border border-white/5",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none relative z-10"
    >
      {/* Price & MCAP */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center space-x-3 text-emerald-400/70 mb-4 relative z-10">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Trading Values</span>
        </div>
        <div className="flex justify-between items-end relative z-10">
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Price</div>
            <div className="text-2xl font-black font-mono text-white tracking-tighter">{price}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Market Cap</div>
            <div className="text-xl font-bold font-mono text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.3)]">{mcap}</div>
          </div>
        </div>
      </div>

      {/* Liquidity Pool */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center space-x-3 text-cyan-400/70 mb-4 relative z-10">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80">Pool Analytics</span>
        </div>
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div className="text-3xl font-black font-mono text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.3)] tracking-tighter">{liq}</div>
          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Total Liq</div>
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-[10px] text-zinc-400 uppercase font-black tracking-widest">
            <span>Utilization vs Cap</span>
            <span className="text-cyan-400">{raw.marketcap && raw.liquidity ? ((raw.liquidity / raw.marketcap) * 100).toFixed(2) : 0}%</span>
          </div>
          <Progress 
            value={raw.marketcap && raw.liquidity ? Math.min(100, (raw.liquidity / raw.marketcap) * 100) : 0} 
            {...progressProps}
            indicatorClassName="bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" 
          />
        </div>
      </div>

      {/* Volume Velocity */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center space-x-3 text-purple-400/70 mb-5 relative z-10">
          <Activity className="w-5 h-5 text-purple-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/80">Volume Velocity</span>
        </div>
        
        <div className="space-y-5 relative z-10">
          <div className="bg-black/50 rounded-xl border border-white/5 p-3">
            <div className="flex justify-between text-xs mb-2 border-b border-white/5 pb-2">
              <span className="text-zinc-500 font-bold tracking-widest uppercase text-[10px]">30M Volume</span>
              <span className="font-mono font-bold text-white tracking-tight">{formatCurrency(v30m)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500 font-bold tracking-widest uppercase text-[10px]">1H Avg (30m)</span>
              <span className="font-mono font-bold text-zinc-300 tracking-tight">{formatCurrency(v1h / 2)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-zinc-400 uppercase font-black tracking-widest">
              <span className="flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5 inline text-purple-400"/> <span>Velocity Shift</span></span>
              <span className="text-purple-400">{volumeRatio.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(100, volumeRatio)} 
              {...progressProps}
              indicatorClassName="bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" 
            />
          </div>
        </div>
      </div>

    </motion.div>
  );
}

function formatCurrency(value: number) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}
