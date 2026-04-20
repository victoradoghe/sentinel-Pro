import { NextResponse } from 'next/server';
import { getNewListings, getTokenSecurity, getMarketData } from '@/lib/birdeye';
import { calculateTrustScore, AnalyzeData } from '@/lib/trust-score';

// Local counter for Qualification Tracker
let apiCallCounter = 0;

export async function GET() {
  try {
    // Qualification Tracker Increment
    apiCallCounter++;
    console.log(`[Qualification Tracker] API Call #${apiCallCounter}`);
    if (apiCallCounter >= 50) {
      console.log('🌟 BOUNTY QUALIFIED 🌟');
    }

    // 1. Discovery: Get new listings
    const listings = await getNewListings();
    
    // Deduplicate by address to prevent React duplicate key errors
    const uniqueListings = Array.from(new Map(listings.map((item: any) => [item.address, item])).values());

    // Safety check just in case Birdeye returns empty or fails
    if (!uniqueListings || uniqueListings.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 2 & 3. Security and Market Data for top 3 listings to respect rate limits
    // We fetch sequentially instead of Promise.all to avoid 429 Too Many Requests
    const analyzedListings = [];
    const topListings = uniqueListings.slice(0, 3); // Limit to top 3 to keep response times < 5s

    for (const listing of topListings) {
      const address = listing.address;
      
      // Fetch security data and pause 
      const securityData = await getTokenSecurity(address);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
      // Fetch market data and pause
      const marketData = await getMarketData(address);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

      const rawData: AnalyzeData = {
        security: {
          mintTx: securityData?.mintTx,
          mintable: securityData?.mintable,
          freezable: securityData?.freezable,
          top10HolderPercent: securityData?.top10HolderPercent,
        },
        market: {
          liquidity: marketData?.liquidity,
          marketcap: marketData?.marketcap,
          v30mUSD: marketData?.v30mUSD,
          v1hUSD: marketData?.v1hUSD,
          price: marketData?.price,
        }
      };

      const trustVerdict = calculateTrustScore(rawData);

      analyzedListings.push({
        address,
        name: listing.name,
        symbol: listing.symbol,
        decimals: listing.decimals,
        logoURI: listing.logoURI,
        liquidity: listing.liquidity,
        time: listing.time,
        analysis: trustVerdict,
        rawMetrics: rawData
      });
    }

    return NextResponse.json({ data: analyzedListings });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching analysis data.' },
      { status: 500 }
    );
  }
}
