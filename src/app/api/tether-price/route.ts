import { NextResponse } from 'next/server'

// Cache the price for 5 minutes to avoid hitting APIs too frequently
let cachedPrice: { price: number; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchFromWallex(): Promise<number | null> {
  try {
    const res = await fetch('https://api.wallex.ir/v1/markets', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const stats = data?.result?.symbols?.USDTTMN?.stats
    // Use ask price (what you'd pay to buy) as the conversion rate
    const price = parseFloat(stats?.askPrice || stats?.bidPrice || '0')
    return price > 0 ? price : null
  } catch {
    return null
  }
}

async function fetchFromNobitex(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.nobitex.ir/market/stats?srcCurrency=usdt&dstCurrency=rls',
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      },
    )
    if (!res.ok) return null
    const data = await res.json()
    // Nobitex returns rls (Rial), convert to Toman by dividing by 10
    const stats = data?.stats?.['usdt-rls']
    const latest = parseFloat(stats?.latest || '0')
    return latest > 0 ? latest / 10 : null
  } catch {
    return null
  }
}

export async function GET() {
  // Return cached price if still fresh
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_TTL) {
    return NextResponse.json({
      ok: true,
      price: cachedPrice.price,
      cached: true,
      timestamp: cachedPrice.timestamp,
    })
  }

  // Try multiple APIs in parallel for reliability
  const [wallexPrice, nobitexPrice] = await Promise.allSettled([
    fetchFromWallex(),
    fetchFromNobitex(),
  ])

  const wallex = wallexPrice.status === 'fulfilled' ? wallexPrice.value : null
  const nobitex = nobitexPrice.status === 'fulfilled' ? nobitexPrice.value : null

  // Use Wallex first (more reliable for TMN), fall back to Nobitex
  let price: number | null = wallex ?? nobitex

  // If both APIs return a price, use the average for a more stable rate
  if (wallex && nobitex) {
    price = Math.round((wallex + nobitex) / 2)
  }

  // If no API worked, use a fallback price (160,000 Toman as of recent)
  if (!price || price <= 0) {
    price = 160000
  }

  // Cache the result
  cachedPrice = { price, timestamp: Date.now() }

  return NextResponse.json({
    ok: true,
    price,
    source: wallex && nobitex ? 'average' : wallex ? 'wallex' : nobitex ? 'nobitex' : 'fallback',
    cached: false,
    timestamp: cachedPrice.timestamp,
  })
}
