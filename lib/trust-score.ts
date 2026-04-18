export type AnalyzeData = {
  security: {
    mintTx?: string;
    mintable?: boolean;
    freezable?: boolean;
    top10HolderPercent?: number;
    ownerBalance?: number;
    creatorBalance?: number;
    ownerAddress?: string | null;
    creatorAddress?: string | null;
  };
  market: {
    liquidity?: number;
    marketcap?: number;
    v30mUSD?: number;
    v1hUSD?: number;
    price?: number;
  };
};

export type TrustVerdict = {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Rug';
  verdict: string;
};

export function calculateTrustScore(data: AnalyzeData): TrustVerdict {
  let score = 0;
  const metrics = {
    authority: 40,
    liquidity: 30,
    holders: 20,
    momentum: 10,
  };

  // 1. Authority Check (40%)
  // If 'mint_authority' or 'freeze_authority' is NOT null/false, the score cannot exceed 15/100 total
  const hasMintAuthority = data.security?.mintable === true;
  const hasFreezeAuthority = data.security?.freezable === true;
  
  let authorityScore = 0;
  if (!hasMintAuthority && !hasFreezeAuthority) {
    authorityScore = metrics.authority;
  } else {
    // Cannot exceed 15/100 later, we will cap the total score.
    authorityScore = 0;
  }

  // 2. Liquidity Density (30%)
  // Score = (Liquidity / MarketCap) * 100.
  // < 5% is Extreme Risk, > 10% is Healthy.
  let liquidityScore = 0;
  const liquidity = data.market?.liquidity || 0;
  const marketcap = data.market?.marketcap || 0;
  if (marketcap > 0 && liquidity > 0) {
    const density = (liquidity / marketcap) * 100;
    if (density >= 10) {
      liquidityScore = metrics.liquidity;
    } else if (density >= 5) {
      liquidityScore = (density / 10) * metrics.liquidity; // Partial score
    } else {
      liquidityScore = 0; // Extreme risk
    }
  }

  // 3. Holder Concentration (20%)
  // Score = 100 - Top10HolderPercent. Penalty increases exponentially if Top 10 > 30%.
  let holderScore = 0;
  const top10 = (data.security?.top10HolderPercent || 0) * 100; // Assuming it comes as a decimal or percentage. Let's assume it's 0-1.
  const normalizedTop10 = top10 > 1 ? top10 : top10 * 100; // Handle if format is 0.5 vs 50
  
  if (normalizedTop10 <= 30) {
    holderScore = metrics.holders;
  } else {
    const penalty = Math.pow((normalizedTop10 - 30) / 70, 2) * metrics.holders;
    holderScore = Math.max(0, metrics.holders - penalty);
  }

  // 4. Volume Momentum (10%)
  // Weighted for 30m/1h volume trends
  let momentumScore = 0;
  const v30m = data.market?.v30mUSD || 0;
  const v1h = data.market?.v1hUSD || 0;
  
  if (v30m > 0 && v1h > 0) {
    const trend = v30m / (v1h / 2); // comparing latest 30m to average 30m of the hour
    if (trend >= 1) momentumScore = metrics.momentum;
    else if (trend >= 0.5) momentumScore = metrics.momentum * 0.5;
  }

  // Calculate Initial Total Score
  score = authorityScore + liquidityScore + holderScore + momentumScore;

  // Apply Authority Cap if triggered
  if (hasMintAuthority || hasFreezeAuthority) {
    score = Math.min(score, 15);
  }

  // Round Score
  score = Math.round(score);

  // Verdict Logic
  let riskLevel: TrustVerdict['riskLevel'] = 'Low';
  let verdict = 'Healthy Token Profile';

  if (score <= 15) {
    riskLevel = 'Rug';
    verdict = 'EXTREME RISK: Authority compromised or zero liquidity.';
  } else if (score <= 50) {
    riskLevel = 'High';
    verdict = 'HIGH RISK: Poor liquidity or centralized supply.';
  } else if (score <= 80) {
    riskLevel = 'Medium';
    verdict = 'MODERATE RISK: Proceed with caution.';
  } else {
    riskLevel = 'Low';
    verdict = 'SAFE: Strong metrics and renounced authorities.';
  }

  return { score, riskLevel, verdict };
}
