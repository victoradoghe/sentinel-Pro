'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface LivePulseProps {
  listings: any[];
  isLoading: boolean;
  selected: any;
  onSelect: (token: any) => void;
}

export function LivePulse({ listings, isLoading, selected, onSelect }: LivePulseProps) {
  if (isLoading && (!listings || listings.length === 0)) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 w-full rounded-xl bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Rug': return 'border-red-500 bg-red-500/20 text-red-400 glow-red';
      case 'High': return 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
      case 'Medium': return 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]';
      case 'Low': return 'border-emerald-500 bg-emerald-500/20 text-emerald-400 neon-border-emerald';
      default: return 'border-zinc-500 bg-zinc-500/20 text-zinc-400';
    }
  };

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="py-4 space-y-3">
        {listings?.map((token) => {
          const isSelected = selected?.address === token.address;
          const riskLevel = token.analysis?.riskLevel || 'Unknown';
          const score = token.analysis?.score || 0;

          return (
            <button
              key={token.address}
              onClick={() => onSelect(token)}
              className={cn(
                "w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                isSelected 
                  ? "bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]" 
                  : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
              )}
            >
              {/* Highlight bar for active item */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              )}
              
              <div className="flex items-center justify-between mb-3 relative z-10 gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 truncate">
                  {token.logoURI ? (
                    <img src={token.logoURI} alt={token.symbol} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 shadow-lg bg-black shrink-0" />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-white shadow-lg shrink-0">
                      {token.symbol?.slice(0,2)}
                    </div>
                  )}
                  <span className={cn(
                    "font-bold truncate text-base sm:text-lg tracking-tight",
                    isSelected ? "text-white" : "text-zinc-300 group-hover:text-white transition-colors"
                  )}>
                    {token.symbol}
                  </span>
                </div>
                <Badge variant="outline" className={cn("text-[8px] sm:text-[10px] uppercase font-black px-1.5 sm:px-2 py-0.5 tracking-wider backdrop-blur-md shrink-0", getRiskColor(riskLevel))}>
                  {riskLevel}
                </Badge>
              </div>
              <div className="flex justify-between items-end text-[10px] sm:text-xs relative z-10">
                <span className="text-zinc-500 font-mono tracking-wider truncate max-w-[100px] sm:max-w-none">{token.address.slice(0, 4)}...{token.address.slice(-4)}</span>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-0.5">Trust Score</span>
                   <span className={cn(
                     "font-mono font-bold text-xs sm:text-sm",
                     isSelected ? "neon-text-emerald text-emerald-400" : "text-zinc-300"
                   )}>
                     {score}/100
                   </span>
                </div>
              </div>
            </button>
          );
        })}
        {listings?.length === 0 && (
          <div className="text-center py-12 text-sm font-mono text-zinc-600 flex flex-col items-center">
            <Activity className="w-8 h-8 mb-4 opacity-20" />
            NO RADAR TARGETS
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
