'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, Fingerprint, Coins, Users, TrendingUp, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrustVerdict } from '@/lib/trust-score';

interface SecurityDossierProps {
  token: any;
  isLoading: boolean;
}

export function SecurityDossier({ token, isLoading }: SecurityDossierProps) {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (token) {
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, [token?.address]);

  if (isLoading && !token) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 font-mono text-sm relative z-10">
        <Cpu className="w-12 h-12 mb-6 opacity-20 animate-pulse" />
        <p className="tracking-widest">ESTABLISHING LINK...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/20 font-mono text-sm relative z-10">
        <Activity className="w-12 h-12 mb-4 opacity-50" />
        <p className="tracking-[0.3em]">AWAITING TARGET</p>
      </div>
    );
  }

  const analysis: TrustVerdict = token.analysis || { score: 0, riskLevel: 'Unknown', verdict: 'No data' };
  const raw = token.rawMetrics;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative z-10 scrollbar-none">
      
      {/* Cybernetic Scan Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden rounded-bl-xl rounded-br-xl"
          >
            <div className="absolute inset-0 bg-grid-white opacity-5" />
            
            <div className="w-full max-w-[280px] sm:w-72 relative z-10 space-y-3 px-4">
              <div className="flex justify-between items-end">
                <span className="text-emerald-500 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold">Protocol Active</span>
                <span className="text-zinc-500 font-mono text-[10px] tracking-widest animate-pulse">ANALYZING</span>
              </div>
              
              {/* Sleek Loader Line */}
              <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                 <motion.div 
                   className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 2, ease: "easeInOut" }}
                 />
              </div>

              <div className="flex justify-between items-start pt-1">
                 <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Aggregating On-Chain Metrics</span>
                 <motion.span 
                   animate={{ opacity: [1, 0, 1] }} 
                   transition={{ duration: 0.8, repeat: Infinity }}
                   className="text-emerald-500 font-mono text-xs font-black"
                 >_</motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isScanning ? 0 : 1, y: isScanning ? 20 : 0 }}
        transition={{ delay: isScanning ? 0 : 0.2, duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between relative group gap-6 text-center sm:text-left">
          <div className="absolute -inset-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">{token.symbol}</h1>
            <h2 className="text-sm font-mono text-zinc-400 tracking-widest mt-1 uppercase">{token.name}</h2>
            <div className="mt-4 inline-flex border border-white/10 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 items-center space-x-3 shadow-inner max-w-full">
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest hidden xs:block">Contract</span>
               <span className="text-[10px] sm:text-xs font-mono text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.5)] truncate max-w-[150px] sm:max-w-none">{token.address}</span>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end relative">
            <div className="absolute -inset-4 rounded-full blur-2xl opacity-20" style={{ backgroundColor: getScoreColor(analysis.score) }} />
            <div className="text-5xl sm:text-6xl md:text-7xl font-black tabular-nums tracking-tighter" style={{ color: getScoreColor(analysis.score), textShadow: `0 0 30px ${getScoreColor(analysis.score)}40` }}>
              {analysis.score}
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black mt-2">Trust Score</div>
          </div>
        </div>

        {/* Verdict Box */}
        <div className={cn(
          "p-4 sm:p-5 rounded-2xl border flex items-center space-x-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
          getVerdictBoxClass(analysis.riskLevel)
        )}>
           <div className={cn("p-2 sm:p-3 rounded-full bg-black/40 border shrink-0", getVerdictIconBorder(analysis.riskLevel))}>
             {analysis.riskLevel === 'Low' ? <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />}
           </div>
           <div>
             <div className="font-black uppercase tracking-widest text-[10px] sm:text-sm mb-1">{analysis.riskLevel} Risk</div>
             <div className="text-xs sm:text-sm font-mono opacity-80">{analysis.verdict}</div>
           </div>
        </div>

        {/* Gauges & Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <MetricCard 
            title="Authority Controls" 
            icon={<ShieldAlert className="w-5 h-5 text-purple-400" />}
            value={(!raw?.security?.mintable && !raw?.security?.freezable) ? 'Renounced' : 'Retained'}
            alert={raw?.security?.mintable || raw?.security?.freezable}
            description="Mint & Freeze powers."
            glow="rgba(168,85,247,0.15)"
          />

           <MetricCard 
            title="Liquidity Density" 
            icon={<Coins className="w-5 h-5 text-emerald-400" />}
            value={raw?.market?.liquidity && raw?.market?.marketcap ? `${((raw.market.liquidity / raw.market.marketcap) * 100).toFixed(2)}%` : 'N/A'}
            alert={raw?.market?.liquidity && raw?.market?.marketcap && (raw.market.liquidity / raw.market.marketcap) < 0.05}
            description="Ratio of LP to Market Cap."
            glow="rgba(52,211,153,0.15)"
          />

           <MetricCard 
            title="Top 10 Holders" 
            icon={<Users className="w-5 h-5 text-amber-400" />}
            value={raw?.security?.top10HolderPercent ? `${(raw.security.top10HolderPercent * 100).toFixed(1)}%` : 'N/A'}
            alert={raw?.security?.top10HolderPercent > 0.3}
            description="Supply concentration."
            glow="rgba(251,191,36,0.15)"
          />

          <MetricCard 
            title="Volume Momentum" 
            icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
            value={raw?.market?.v30mUSD && raw?.market?.v1hUSD ? `${(raw.market.v30mUSD / (raw.market.v1hUSD / 2)).toFixed(2)}x` : 'N/A'}
            description="30m vs Average 1h Volume"
            glow="rgba(96,165,250,0.15)"
          />

        </div>

      </motion.div>
    </div>
  );
}

function MetricCard({ title, icon, value, description, alert, glow }: any) {
  return (
    <div className={cn(
      "p-4 sm:p-5 rounded-2xl border bg-black/40 flex flex-col relative overflow-hidden group hover:bg-black/60 transition-colors",
      alert ? "border-rose-500/50 shadow-[0_0_20px_rgba(225,29,72,0.1)] text-rose-200" : "border-white/10"
    )}>
      {/* Subtle hover glow tied to the icon color */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
           style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 70%)` }} />
           
      <div className="flex items-center space-x-3 mb-4 opacity-70 relative z-10 w-full">
        {icon}
        <span className="text-[10px] uppercase font-black tracking-[0.2em]">{title}</span>
      </div>
      <div className={cn("text-2xl sm:text-3xl font-black font-mono tracking-tighter mb-1 relative z-10", alert ? "text-rose-400" : "text-white")}>{value}</div>
      <div className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wide relative z-10">{description}</div>
      
      {/* Bottom accent line */}
      <div className={cn("absolute bottom-0 left-0 h-0.5 w-1/3 transition-all duration-300 group-hover:w-full", alert ? "bg-rose-500" : "bg-white/10")} />
    </div>
  );
}

function getScoreColor(score: number) {
  if (score <= 15) return '#f43f5e'; // rose-500
  if (score <= 50) return '#f97316'; // orange-500
  if (score <= 80) return '#eab308'; // yellow-500
  return '#34d399'; // emerald-400
}

function getVerdictBoxClass(risk: string) {
  switch (risk) {
    case 'Rug': return 'border-rose-500/50 bg-rose-950/40 text-rose-300 shadow-[0_0_30px_rgba(225,29,72,0.15)]';
    case 'High': return 'border-orange-500/50 bg-orange-950/40 text-orange-300 shadow-[0_0_30px_rgba(249,115,22,0.15)]';
    case 'Medium': return 'border-yellow-500/50 bg-yellow-950/40 text-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.15)]';
    case 'Low': return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)] neon-border-emerald';
    default: return 'border-zinc-800 bg-zinc-900/50 text-zinc-400';
  }
}

function getVerdictIconBorder(risk: string) {
   switch (risk) {
    case 'Rug': return 'border-rose-500/50';
    case 'High': return 'border-orange-500/50';
    case 'Medium': return 'border-yellow-500/50';
    case 'Low': return 'border-emerald-500/50';
    default: return 'border-zinc-800';
  }
}

// Dummy Activity icon to prevent compile errors since we deleted the original import
function Activity(props: any) {
  return <TrendingUp {...props} />;
}
