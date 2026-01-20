// Historical stock price data generator based on real market patterns
// Data structured as OHLC (Open, High, Low, Close, Volume)

export interface OHLC {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Real historical base prices for companies circa 1985-1995
// Adjusted for splits and historical accuracy
const HISTORICAL_BASE_PRICES: Record<string, { price1985: number; price1995: number; volatility: number; avgVolume: number }> = {
  // Technology
  'IBM': { price1985: 124.00, price1995: 91.00, volatility: 0.025, avgVolume: 5_000_000 },
  'DEC': { price1985: 95.00, price1995: 45.00, volatility: 0.035, avgVolume: 1_500_000 },
  'HWP': { price1985: 18.00, price1995: 42.00, volatility: 0.030, avgVolume: 2_000_000 },
  'AAPL': { price1985: 2.50, price1995: 8.50, volatility: 0.055, avgVolume: 3_000_000 },
  'MSFT': { price1985: 0.50, price1995: 10.00, volatility: 0.045, avgVolume: 8_000_000 },
  'INTC': { price1985: 3.50, price1995: 15.00, volatility: 0.040, avgVolume: 6_000_000 },
  
  // Finance
  'CCI': { price1985: 42.00, price1995: 52.00, volatility: 0.030, avgVolume: 2_500_000 },
  'BAC': { price1985: 12.00, price1995: 25.00, volatility: 0.028, avgVolume: 4_000_000 },
  'CMB': { price1985: 38.00, price1995: 48.00, volatility: 0.025, avgVolume: 1_800_000 },
  'MER': { price1985: 18.00, price1995: 42.00, volatility: 0.035, avgVolume: 2_200_000 },
  'DBL': { price1985: 45.00, price1995: 0.00, volatility: 0.060, avgVolume: 800_000 }, // Went bankrupt 1990
  
  // Healthcare
  'JNJ': { price1985: 8.00, price1995: 34.00, volatility: 0.020, avgVolume: 3_500_000 },
  'PFE': { price1985: 5.00, price1995: 18.00, volatility: 0.025, avgVolume: 4_500_000 },
  'MRK': { price1985: 12.00, price1995: 48.00, volatility: 0.022, avgVolume: 4_000_000 },
  'LLY': { price1985: 10.00, price1995: 35.00, volatility: 0.024, avgVolume: 2_000_000 },
  
  // Energy
  'XON': { price1985: 25.00, price1995: 38.00, volatility: 0.028, avgVolume: 5_500_000 },
  'MOB': { price1985: 28.00, price1995: 45.00, volatility: 0.030, avgVolume: 3_200_000 },
  'CHV': { price1985: 22.00, price1995: 35.00, volatility: 0.030, avgVolume: 2_800_000 },
  'TX': { price1985: 32.00, price1995: 42.00, volatility: 0.032, avgVolume: 2_000_000 },
  
  // Consumer
  'PG': { price1985: 12.00, price1995: 35.00, volatility: 0.018, avgVolume: 3_000_000 },
  'KO': { price1985: 5.00, price1995: 28.00, volatility: 0.020, avgVolume: 5_000_000 },
  'PEP': { price1985: 6.00, price1995: 25.00, volatility: 0.022, avgVolume: 3_500_000 },
  'MO': { price1985: 8.00, price1995: 42.00, volatility: 0.025, avgVolume: 6_000_000 },
  
  // Industrial
  'GE': { price1985: 10.00, price1995: 32.00, volatility: 0.022, avgVolume: 7_000_000 },
  'BA': { price1985: 22.00, price1995: 45.00, volatility: 0.035, avgVolume: 2_500_000 },
  'CAT': { price1985: 18.00, price1995: 28.00, volatility: 0.038, avgVolume: 1_500_000 },
  'MMM': { price1985: 25.00, price1995: 55.00, volatility: 0.020, avgVolume: 1_800_000 },
  
  // Telecom
  'T': { price1985: 19.00, price1995: 32.00, volatility: 0.020, avgVolume: 8_000_000 },
  'GTE': { price1985: 22.00, price1995: 35.00, volatility: 0.022, avgVolume: 2_500_000 },
  'MCIC': { price1985: 3.00, price1995: 22.00, volatility: 0.050, avgVolume: 5_000_000 },
  
  // Media
  'CCB': { price1985: 85.00, price1995: 285.00, volatility: 0.030, avgVolume: 500_000 },
  'CBS': { price1985: 95.00, price1995: 45.00, volatility: 0.032, avgVolume: 800_000 },
  'DIS': { price1985: 12.00, price1995: 28.00, volatility: 0.035, avgVolume: 4_000_000 },
  
  // Retail
  'WMT': { price1985: 1.50, price1995: 12.00, volatility: 0.040, avgVolume: 6_000_000 },
  'S': { price1985: 32.00, price1995: 25.00, volatility: 0.025, avgVolume: 2_500_000 },
  'KM': { price1985: 28.00, price1995: 15.00, volatility: 0.028, avgVolume: 2_000_000 },
  'HD': { price1985: 0.50, price1995: 22.00, volatility: 0.055, avgVolume: 3_500_000 },
  
  // Defense
  'LK': { price1985: 28.00, price1995: 72.00, volatility: 0.030, avgVolume: 1_200_000 },
  'GD': { price1985: 42.00, price1995: 48.00, volatility: 0.032, avgVolume: 900_000 },
  'RTN': { price1985: 25.00, price1995: 42.00, volatility: 0.028, avgVolume: 1_000_000 },
  
  // Transportation
  'UAL': { price1985: 45.00, price1995: 125.00, volatility: 0.045, avgVolume: 1_500_000 },
  'AMR': { price1985: 18.00, price1995: 65.00, volatility: 0.042, avgVolume: 2_000_000 },
  'FDX': { price1985: 15.00, price1995: 42.00, volatility: 0.040, avgVolume: 1_200_000 },
  
  // Utilities
  'PCG': { price1985: 18.00, price1995: 25.00, volatility: 0.015, avgVolume: 1_800_000 },
  'SO': { price1985: 12.00, price1995: 22.00, volatility: 0.014, avgVolume: 2_200_000 },
  
  // Real Estate
  'RSE': { price1985: 15.00, price1995: 28.00, volatility: 0.028, avgVolume: 400_000 },
  
  // Materials
  'DOW': { price1985: 28.00, price1995: 42.00, volatility: 0.032, avgVolume: 1_500_000 },
  'DD': { price1985: 22.00, price1995: 38.00, volatility: 0.028, avgVolume: 2_000_000 },
  
  // Agriculture
  'ADM': { price1985: 8.00, price1995: 22.00, volatility: 0.030, avgVolume: 1_200_000 },
  'DE': { price1985: 15.00, price1995: 32.00, volatility: 0.035, avgVolume: 1_000_000 },
}

// Historical market events that affect stock prices
interface MarketEvent {
  date: string  // 'YYYY-MM'
  name: string
  sectorImpact: Record<string, number> // sector -> multiplier
  marketImpact: number
}

const MARKET_EVENTS: MarketEvent[] = [
  // 1985
  { date: '1985-09', name: 'Plaza Accord', sectorImpact: { 'Industrial': 1.05, 'Technology': 1.03 }, marketImpact: 1.02 },
  
  // 1986
  { date: '1986-01', name: 'Oil Price Crash', sectorImpact: { 'Energy': 0.75, 'Transportation': 1.08, 'Consumer': 1.03 }, marketImpact: 1.00 },
  { date: '1986-04', name: 'Chernobyl Disaster', sectorImpact: { 'Utilities': 0.92 }, marketImpact: 0.99 },
  
  // 1987
  { date: '1987-10', name: 'Black Monday Crash', sectorImpact: { 'Finance': 0.70, 'Technology': 0.72, 'Industrial': 0.75 }, marketImpact: 0.78 },
  { date: '1987-11', name: 'Post-Crash Recovery', sectorImpact: {}, marketImpact: 1.08 },
  
  // 1988
  { date: '1988-07', name: 'Drought Crisis', sectorImpact: { 'Agriculture': 1.15, 'Consumer': 0.97 }, marketImpact: 0.99 },
  
  // 1989
  { date: '1989-10', name: 'Friday 13th Mini-Crash', sectorImpact: { 'Finance': 0.94 }, marketImpact: 0.96 },
  { date: '1989-11', name: 'Berlin Wall Falls', sectorImpact: { 'Defense': 0.90, 'Industrial': 1.05 }, marketImpact: 1.03 },
  
  // 1990
  { date: '1990-02', name: 'Drexel Burnham Bankruptcy', sectorImpact: { 'Finance': 0.88 }, marketImpact: 0.97 },
  { date: '1990-08', name: 'Gulf War Begins', sectorImpact: { 'Energy': 1.25, 'Defense': 1.15, 'Transportation': 0.85 }, marketImpact: 0.92 },
  { date: '1990-10', name: 'Recession Fears', sectorImpact: { 'Consumer': 0.92, 'Retail': 0.88 }, marketImpact: 0.90 },
  
  // 1991
  { date: '1991-01', name: 'Desert Storm Victory', sectorImpact: { 'Energy': 0.85, 'Defense': 0.95 }, marketImpact: 1.08 },
  { date: '1991-12', name: 'Soviet Union Collapse', sectorImpact: { 'Defense': 0.88, 'Energy': 0.95 }, marketImpact: 1.02 },
  
  // 1992
  { date: '1992-09', name: 'Black Wednesday', sectorImpact: { 'Finance': 0.96 }, marketImpact: 0.98 },
  
  // 1993
  { date: '1993-02', name: 'WTC Bombing', sectorImpact: { 'Real Estate': 0.95, 'Finance': 0.97 }, marketImpact: 0.99 },
  { date: '1993-11', name: 'NAFTA Signed', sectorImpact: { 'Industrial': 1.05, 'Retail': 1.03 }, marketImpact: 1.02 },
  
  // 1994
  { date: '1994-02', name: 'Fed Rate Hike', sectorImpact: { 'Real Estate': 0.92, 'Utilities': 0.94 }, marketImpact: 0.96 },
  { date: '1994-12', name: 'Mexican Peso Crisis', sectorImpact: { 'Finance': 0.94 }, marketImpact: 0.97 },
  
  // 1995
  { date: '1995-02', name: 'Barings Bank Collapse', sectorImpact: { 'Finance': 0.94 }, marketImpact: 0.98 },
  { date: '1995-08', name: 'Windows 95 Launch', sectorImpact: { 'Technology': 1.15 }, marketImpact: 1.02 },
  { date: '1995-12', name: 'Internet Boom Begins', sectorImpact: { 'Technology': 1.12, 'Telecom': 1.08 }, marketImpact: 1.03 },
]

// Generate realistic OHLC data for a stock
export function generateHistoricalOHLC(
  ticker: string,
  startDate: { year: number; month: number },
  endDate: { year: number; month: number }
): OHLC[] {
  const data: OHLC[] = []
  const baseData = HISTORICAL_BASE_PRICES[ticker]
  
  if (!baseData) {
    // Generate generic data for unknown tickers
    return generateGenericOHLC(ticker, startDate, endDate)
  }

  // Calculate how many trading days
  const startTimestamp = new Date(startDate.year, startDate.month - 1, 1).getTime()
  const endTimestamp = new Date(endDate.year, endDate.month - 1, 28).getTime()
  const totalDays = Math.floor((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24))
  const tradingDays = Math.floor(totalDays * 0.71) // Roughly 252 trading days per 365

  // Calculate price trajectory
  const totalYears = (endDate.year - startDate.year) + (endDate.month - startDate.month) / 12
  const yearsFrom1985 = startDate.year - 1985 + startDate.month / 12
  const startPrice = interpolatePrice(baseData.price1985, baseData.price1995, yearsFrom1985 / 10)
  const endPrice = interpolatePrice(baseData.price1985, baseData.price1995, (yearsFrom1985 + totalYears) / 10)
  
  // Daily return needed to get from start to end (compounded)
  const dailyTrend = Math.pow(endPrice / startPrice, 1 / tradingDays) - 1

  let currentPrice = startPrice
  let currentDate = new Date(startDate.year, startDate.month - 1, 1)

  for (let day = 0; day < tradingDays; day++) {
    // Skip weekends
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Check for market events
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    const event = MARKET_EVENTS.find(e => e.date === dateStr)
    let eventMultiplier = 1.0
    
    if (event && currentDate.getDate() >= 15 && currentDate.getDate() <= 20) {
      // Apply event impact in the middle of the month
      const sector = getSectorForTicker(ticker)
      eventMultiplier = event.sectorImpact[sector] || event.marketImpact
    }

    // Generate daily movement with realistic patterns
    const volatility = baseData.volatility * eventMultiplier
    const randomReturn = generateRandomReturn(volatility)
    const trendReturn = dailyTrend
    
    // Combine trend and random movement
    const dailyReturn = (trendReturn + randomReturn) * eventMultiplier

    // Generate OHLC
    const open = currentPrice
    const close = open * (1 + dailyReturn)
    
    // High and Low based on intraday volatility
    const intradayVol = volatility * 0.5
    const high = Math.max(open, close) * (1 + Math.random() * intradayVol)
    const low = Math.min(open, close) * (1 - Math.random() * intradayVol)
    
    // Volume with some randomness
    const volumeMultiplier = 0.5 + Math.random() * 1.5
    const eventVolumeBoost = event ? 2.5 : 1.0
    const volume = Math.round(baseData.avgVolume * volumeMultiplier * eventVolumeBoost)

    data.push({
      date: formatDate(currentDate),
      open: roundPrice(open),
      high: roundPrice(high),
      low: roundPrice(low),
      close: roundPrice(close),
      volume
    })

    currentPrice = close
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

function generateGenericOHLC(
  ticker: string,
  startDate: { year: number; month: number },
  endDate: { year: number; month: number }
): OHLC[] {
  const data: OHLC[] = []
  const hash = simpleHash(ticker)
  const basePrice = 20 + (hash % 100)
  const volatility = 0.02 + (hash % 50) / 1000
  const avgVolume = 500_000 + (hash % 2_000_000)

  const startTimestamp = new Date(startDate.year, startDate.month - 1, 1).getTime()
  const endTimestamp = new Date(endDate.year, endDate.month - 1, 28).getTime()
  const totalDays = Math.floor((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24))
  const tradingDays = Math.floor(totalDays * 0.71)

  let currentPrice = basePrice
  let currentDate = new Date(startDate.year, startDate.month - 1, 1)

  for (let day = 0; day < tradingDays; day++) {
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const randomReturn = generateRandomReturn(volatility)
    const open = currentPrice
    const close = open * (1 + randomReturn)
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
    const volume = Math.round(avgVolume * (0.5 + Math.random() * 1.5))

    data.push({
      date: formatDate(currentDate),
      open: roundPrice(open),
      high: roundPrice(high),
      low: roundPrice(low),
      close: roundPrice(close),
      volume
    })

    currentPrice = close
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

// Helper functions
function interpolatePrice(price1985: number, price1995: number, progress: number): number {
  // Use exponential interpolation for more realistic price growth
  if (price1995 === 0) return price1985 * Math.pow(0.1, progress) // Company went bankrupt
  return price1985 * Math.pow(price1995 / price1985, Math.min(1, progress))
}

function generateRandomReturn(volatility: number): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z * volatility
}

function roundPrice(price: number): number {
  // Round to nearest 1/8 for historical accuracy (pre-decimalization)
  return Math.round(price * 8) / 8
}

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function getSectorForTicker(ticker: string): string {
  const sectorMap: Record<string, string> = {
    'IBM': 'Technology', 'DEC': 'Technology', 'HWP': 'Technology', 'AAPL': 'Technology', 'MSFT': 'Technology', 'INTC': 'Technology',
    'CCI': 'Finance', 'BAC': 'Finance', 'CMB': 'Finance', 'MER': 'Finance', 'DBL': 'Finance',
    'JNJ': 'Healthcare', 'PFE': 'Healthcare', 'MRK': 'Healthcare', 'LLY': 'Healthcare',
    'XON': 'Energy', 'MOB': 'Energy', 'CHV': 'Energy', 'TX': 'Energy',
    'PG': 'Consumer', 'KO': 'Consumer', 'PEP': 'Consumer', 'MO': 'Consumer',
    'GE': 'Industrial', 'BA': 'Industrial', 'CAT': 'Industrial', 'MMM': 'Industrial',
    'T': 'Telecom', 'GTE': 'Telecom', 'MCIC': 'Telecom',
    'CCB': 'Media', 'CBS': 'Media', 'DIS': 'Media',
    'WMT': 'Retail', 'S': 'Retail', 'KM': 'Retail', 'HD': 'Retail',
    'LK': 'Defense', 'GD': 'Defense', 'RTN': 'Defense',
    'UAL': 'Transportation', 'AMR': 'Transportation', 'FDX': 'Transportation',
    'PCG': 'Utilities', 'SO': 'Utilities',
    'RSE': 'Real Estate',
    'DOW': 'Materials', 'DD': 'Materials',
    'ADM': 'Agriculture', 'DE': 'Agriculture',
  }
  return sectorMap[ticker] || 'Industrial'
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Export for use in components
export { HISTORICAL_BASE_PRICES, MARKET_EVENTS }

