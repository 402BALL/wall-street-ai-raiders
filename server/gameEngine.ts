import { EventEmitter } from 'events'
import { getAIDecision, AI_PERSONALITIES } from './aiService'

// Types
export type GameMode = 'classic' | 'modern' | 'crypto'

export interface GameDate {
  year: number
  month: number
}

export interface Company {
  id: string
  name: string
  ticker: string
  sector: string
  stockPrice: number
  previousPrice: number
  marketCap: number
  peRatio: number
  dividendYield: number
  volatility: number
  description: string
  headquarters: string
  priceHistory: PriceCandle[]
  tradeMarkers: TradeMarker[]
  isListed: boolean
}

export interface PriceCandle {
  date: GameDate
  open: number
  high: number
  low: number
  close: number
}

export interface TradeMarker {
  date: GameDate
  type: 'buy' | 'sell'
  playerId: string
  playerColor: string
  shares: number
  price: number
}

export interface AIPlayer {
  id: string
  name: string
  provider: 'claude' | 'gpt' | 'grok' | 'deepseek'
  cash: number
  netWorth: number
  portfolio: {
    stocks: { companyId: string; shares: number; avgPurchasePrice: number }[]
  }
  thinking: string
  lastAction: string
  isActive: boolean
  color: string
  avatar: string
}

export interface NewsHeadline {
  id: string
  headline: string
  description?: string
  date: GameDate
  category: string
  impact: 'positive' | 'negative' | 'neutral'
  relatedCompany?: string
  isCritical?: boolean
}

export interface GameState {
  gameMode: GameMode
  marketName: string
  currentDate: GameDate
  turnNumber: number
  totalTurns: number
  marketIndex: number
  marketChange: number
  players: AIPlayer[]
  companies: Company[]
  news: NewsHeadline[]
  breakingNews: NewsHeadline | null
  currentEvent: any | null
  winner: AIPlayer | null
  isRunning: boolean
}

// AI Player configs
const AI_CONFIGS = {
  claude: { name: 'CLAUDE 4 OPUS', avatar: '🟠', color: '#ff6b35' },
  gpt: { name: 'GPT-5 TURBO', avatar: '🟢', color: '#10a37f' },
  grok: { name: 'GROK 4', avatar: '⚪', color: '#1da1f2' },
  deepseek: { name: 'DEEPSEEK V3', avatar: '🟣', color: '#800080' }
}

// Game mode configurations
const GAME_MODE_CONFIGS = {
  classic: {
    startYear: 1985,
    endYear: 2010,
    marketName: 'NYSE Classic'
  },
  modern: {
    startYear: 2010,
    endYear: 2026,
    marketName: 'NASDAQ Modern'
  },
  crypto: {
    startYear: 2009,
    endYear: 2026,
    marketName: 'Crypto Market'
  }
}

export class GameEngine extends EventEmitter {
  private state: GameState
  private gameLoopInterval: NodeJS.Timeout | null = null
  private readonly TURN_INTERVAL_MS = 30000 // 30 seconds = 1 month

  constructor() {
    super()
    this.state = this.createInitialState('classic')
  }

  private createInitialState(mode: GameMode): GameState {
    const config = GAME_MODE_CONFIGS[mode]
    const totalMonths = (config.endYear - config.startYear) * 12
    
    return {
      gameMode: mode,
      marketName: config.marketName,
      currentDate: { year: config.startYear, month: 1 },
      turnNumber: 0,
      totalTurns: totalMonths,
      marketIndex: 1000,
      marketChange: 0,
      players: this.createPlayers(),
      companies: this.generateCompanies(mode),
      news: [],
      breakingNews: null,
      currentEvent: null,
      winner: null,
      isRunning: false
    }
  }

  private createPlayers(): AIPlayer[] {
    const providers: Array<'claude' | 'gpt' | 'grok' | 'deepseek'> = ['claude', 'gpt', 'grok', 'deepseek']
    
    return providers.map((provider, index) => ({
      id: `player-${index}`,
      name: AI_CONFIGS[provider].name,
      provider,
      cash: 1_000_000_000, // $1 billion
      netWorth: 1_000_000_000,
      portfolio: { stocks: [] },
      thinking: 'Initializing...',
      lastAction: 'Waiting for market open',
      isActive: false,
      color: AI_CONFIGS[provider].color,
      avatar: AI_CONFIGS[provider].avatar
    }))
  }

  private generateCompanies(mode: GameMode): Company[] {
    const companyData = {
      classic: [
        // Technology
        { ticker: 'IBM', name: 'IBM Corporation', sector: 'Technology', price: 125 },
        { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', price: 2.5 },
        { ticker: 'AAPL', name: 'Apple Computer', sector: 'Technology', price: 1.5 },
        { ticker: 'HPQ', name: 'Hewlett-Packard', sector: 'Technology', price: 28 },
        { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 18 },
        { ticker: 'ORCL', name: 'Oracle Corp', sector: 'Technology', price: 12 },
        { ticker: 'CSCO', name: 'Cisco Systems', sector: 'Technology', price: 8 },
        { ticker: 'DELL', name: 'Dell Computer', sector: 'Technology', price: 5 },
        // Industrial
        { ticker: 'GE', name: 'General Electric', sector: 'Industrial', price: 45 },
        { ticker: 'CAT', name: 'Caterpillar Inc', sector: 'Industrial', price: 38 },
        { ticker: 'MMM', name: '3M Company', sector: 'Industrial', price: 52 },
        { ticker: 'HON', name: 'Honeywell Intl', sector: 'Industrial', price: 42 },
        { ticker: 'EMR', name: 'Emerson Electric', sector: 'Industrial', price: 35 },
        { ticker: 'ITW', name: 'Illinois Tool Works', sector: 'Industrial', price: 28 },
        // Consumer
        { ticker: 'KO', name: 'Coca-Cola Company', sector: 'Consumer', price: 35 },
        { ticker: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer', price: 32 },
        { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 42 },
        { ticker: 'MCD', name: 'McDonald\'s Corp', sector: 'Consumer', price: 25 },
        { ticker: 'NKE', name: 'Nike Inc', sector: 'Consumer', price: 8 },
        { ticker: 'CL', name: 'Colgate-Palmolive', sector: 'Consumer', price: 22 },
        // Energy
        { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy', price: 52 },
        { ticker: 'CVX', name: 'Chevron Corp', sector: 'Energy', price: 48 },
        { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', price: 35 },
        { ticker: 'SLB', name: 'Schlumberger Ltd', sector: 'Energy', price: 28 },
        { ticker: 'HAL', name: 'Halliburton Co', sector: 'Energy', price: 22 },
        // Financial
        { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', price: 38 },
        { ticker: 'BAC', name: 'Bank of America', sector: 'Financial', price: 12 },
        { ticker: 'WFC', name: 'Wells Fargo', sector: 'Financial', price: 18 },
        { ticker: 'C', name: 'Citigroup Inc', sector: 'Financial', price: 25 },
        { ticker: 'GS', name: 'Goldman Sachs', sector: 'Financial', price: 85 },
        { ticker: 'MS', name: 'Morgan Stanley', sector: 'Financial', price: 42 },
        { ticker: 'AXP', name: 'American Express', sector: 'Financial', price: 28 },
        // Healthcare
        { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 55 },
        { ticker: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', price: 32 },
        { ticker: 'MRK', name: 'Merck & Co', sector: 'Healthcare', price: 48 },
        { ticker: 'ABT', name: 'Abbott Labs', sector: 'Healthcare', price: 28 },
        { ticker: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', price: 45 },
        { ticker: 'BMY', name: 'Bristol-Myers', sector: 'Healthcare', price: 35 },
        // Retail
        { ticker: 'WMT', name: 'Walmart Inc', sector: 'Retail', price: 28 },
        { ticker: 'HD', name: 'Home Depot', sector: 'Retail', price: 18 },
        { ticker: 'TGT', name: 'Target Corp', sector: 'Retail', price: 22 },
        { ticker: 'KR', name: 'Kroger Co', sector: 'Retail', price: 15 },
        { ticker: 'COST', name: 'Costco Wholesale', sector: 'Retail', price: 25 },
        // Entertainment/Media
        { ticker: 'DIS', name: 'Walt Disney Co', sector: 'Entertainment', price: 32 },
        { ticker: 'TWX', name: 'Time Warner', sector: 'Media', price: 45 },
        { ticker: 'VIA', name: 'Viacom Inc', sector: 'Media', price: 28 },
        // Telecom
        { ticker: 'T', name: 'AT&T Inc', sector: 'Telecom', price: 22 },
        { ticker: 'VZ', name: 'Verizon Comm', sector: 'Telecom', price: 35 },
        // Aerospace
        { ticker: 'BA', name: 'Boeing Company', sector: 'Aerospace', price: 45 },
        { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Aerospace', price: 52 },
        { ticker: 'RTN', name: 'Raytheon Co', sector: 'Aerospace', price: 38 },
        { ticker: 'NOC', name: 'Northrop Grumman', sector: 'Aerospace', price: 42 },
      ],
      modern: [
        // Big Tech
        { ticker: 'AAPL', name: 'Apple Inc', sector: 'Technology', price: 45 },
        { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', price: 28 },
        { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', price: 280 },
        { ticker: 'AMZN', name: 'Amazon.com Inc', sector: 'Technology', price: 85 },
        { ticker: 'META', name: 'Meta Platforms', sector: 'Technology', price: 38 },
        { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', price: 15 },
        { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Automotive', price: 25 },
        // Tech Growth
        { ticker: 'NFLX', name: 'Netflix Inc', sector: 'Entertainment', price: 18 },
        { ticker: 'AMD', name: 'AMD Inc', sector: 'Technology', price: 8 },
        { ticker: 'CRM', name: 'Salesforce Inc', sector: 'Technology', price: 95 },
        { ticker: 'ADBE', name: 'Adobe Inc', sector: 'Technology', price: 85 },
        { ticker: 'NOW', name: 'ServiceNow', sector: 'Technology', price: 120 },
        { ticker: 'SNOW', name: 'Snowflake Inc', sector: 'Technology', price: 110 },
        // Fintech
        { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Fintech', price: 45 },
        { ticker: 'SQ', name: 'Block Inc', sector: 'Fintech', price: 15 },
        { ticker: 'COIN', name: 'Coinbase Global', sector: 'Fintech', price: 250 },
        { ticker: 'AFRM', name: 'Affirm Holdings', sector: 'Fintech', price: 85 },
        { ticker: 'SOFI', name: 'SoFi Technologies', sector: 'Fintech', price: 12 },
        // E-commerce
        { ticker: 'SHOP', name: 'Shopify Inc', sector: 'E-commerce', price: 28 },
        { ticker: 'ETSY', name: 'Etsy Inc', sector: 'E-commerce', price: 55 },
        { ticker: 'EBAY', name: 'eBay Inc', sector: 'E-commerce', price: 28 },
        { ticker: 'WISH', name: 'ContextLogic', sector: 'E-commerce', price: 18 },
        // Gig Economy
        { ticker: 'UBER', name: 'Uber Technologies', sector: 'Technology', price: 28 },
        { ticker: 'LYFT', name: 'Lyft Inc', sector: 'Technology', price: 45 },
        { ticker: 'DASH', name: 'DoorDash Inc', sector: 'Technology', price: 120 },
        { ticker: 'ABNB', name: 'Airbnb Inc', sector: 'Technology', price: 85 },
        // Video/Social
        { ticker: 'ZM', name: 'Zoom Video', sector: 'Technology', price: 35 },
        { ticker: 'SNAP', name: 'Snap Inc', sector: 'Technology', price: 12 },
        { ticker: 'PINS', name: 'Pinterest Inc', sector: 'Technology', price: 18 },
        { ticker: 'TWTR', name: 'Twitter Inc', sector: 'Technology', price: 25 },
        { ticker: 'SPOT', name: 'Spotify Tech', sector: 'Entertainment', price: 95 },
        { ticker: 'ROKU', name: 'Roku Inc', sector: 'Entertainment', price: 45 },
        // Gaming
        { ticker: 'RBLX', name: 'Roblox Corp', sector: 'Gaming', price: 65 },
        { ticker: 'TTWO', name: 'Take-Two Interactive', sector: 'Gaming', price: 85 },
        { ticker: 'EA', name: 'Electronic Arts', sector: 'Gaming', price: 95 },
        { ticker: 'ATVI', name: 'Activision Blizzard', sector: 'Gaming', price: 55 },
        // AI/Cloud
        { ticker: 'PLTR', name: 'Palantir Tech', sector: 'Technology', price: 12 },
        { ticker: 'AI', name: 'C3.ai Inc', sector: 'Technology', price: 45 },
        { ticker: 'PATH', name: 'UiPath Inc', sector: 'Technology', price: 55 },
        // EVs
        { ticker: 'RIVN', name: 'Rivian Automotive', sector: 'Automotive', price: 85 },
        { ticker: 'LCID', name: 'Lucid Group', sector: 'Automotive', price: 25 },
        { ticker: 'NIO', name: 'NIO Inc', sector: 'Automotive', price: 8 },
        { ticker: 'LI', name: 'Li Auto Inc', sector: 'Automotive', price: 15 },
        // Meme Stocks
        { ticker: 'GME', name: 'GameStop Corp', sector: 'Retail', price: 15 },
        { ticker: 'AMC', name: 'AMC Entertainment', sector: 'Entertainment', price: 8 },
        { ticker: 'BB', name: 'BlackBerry Ltd', sector: 'Technology', price: 5 },
        // Traditional
        { ticker: 'DIS', name: 'Walt Disney Co', sector: 'Entertainment', price: 95 },
        { ticker: 'NFLX', name: 'Netflix', sector: 'Entertainment', price: 280 },
        { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', price: 85 },
        { ticker: 'V', name: 'Visa Inc', sector: 'Financial', price: 75 },
        { ticker: 'MA', name: 'Mastercard Inc', sector: 'Financial', price: 185 },
      ],
      crypto: [
        // Layer 1
        { ticker: 'BTC', name: 'Bitcoin', sector: 'Layer 1', price: 0.01 },
        { ticker: 'ETH', name: 'Ethereum', sector: 'Layer 1', price: 0.50 },
        { ticker: 'SOL', name: 'Solana', sector: 'Layer 1', price: 0.50 },
        { ticker: 'ADA', name: 'Cardano', sector: 'Layer 1', price: 0.02 },
        { ticker: 'AVAX', name: 'Avalanche', sector: 'Layer 1', price: 3.50 },
        { ticker: 'DOT', name: 'Polkadot', sector: 'Layer 1', price: 2.50 },
        { ticker: 'ATOM', name: 'Cosmos', sector: 'Layer 1', price: 5.00 },
        { ticker: 'NEAR', name: 'NEAR Protocol', sector: 'Layer 1', price: 1.50 },
        { ticker: 'FTM', name: 'Fantom', sector: 'Layer 1', price: 0.15 },
        { ticker: 'ALGO', name: 'Algorand', sector: 'Layer 1', price: 0.25 },
        // Old School
        { ticker: 'XRP', name: 'Ripple', sector: 'Payments', price: 0.005 },
        { ticker: 'LTC', name: 'Litecoin', sector: 'Payments', price: 0.01 },
        { ticker: 'BCH', name: 'Bitcoin Cash', sector: 'Payments', price: 50 },
        { ticker: 'XLM', name: 'Stellar Lumens', sector: 'Payments', price: 0.01 },
        { ticker: 'XMR', name: 'Monero', sector: 'Privacy', price: 45 },
        { ticker: 'ZEC', name: 'Zcash', sector: 'Privacy', price: 35 },
        // Meme Coins
        { ticker: 'DOGE', name: 'Dogecoin', sector: 'Meme', price: 0.0001 },
        { ticker: 'SHIB', name: 'Shiba Inu', sector: 'Meme', price: 0.000001 },
        { ticker: 'PEPE', name: 'Pepe Coin', sector: 'Meme', price: 0.0000001 },
        { ticker: 'FLOKI', name: 'Floki Inu', sector: 'Meme', price: 0.00001 },
        { ticker: 'BONK', name: 'Bonk', sector: 'Meme', price: 0.0000001 },
        { ticker: 'WIF', name: 'dogwifhat', sector: 'Meme', price: 0.05 },
        // DeFi
        { ticker: 'UNI', name: 'Uniswap', sector: 'DeFi', price: 3.00 },
        { ticker: 'AAVE', name: 'Aave', sector: 'DeFi', price: 85 },
        { ticker: 'MKR', name: 'Maker', sector: 'DeFi', price: 450 },
        { ticker: 'COMP', name: 'Compound', sector: 'DeFi', price: 125 },
        { ticker: 'CRV', name: 'Curve DAO', sector: 'DeFi', price: 1.50 },
        { ticker: 'SNX', name: 'Synthetix', sector: 'DeFi', price: 3.50 },
        { ticker: 'SUSHI', name: 'SushiSwap', sector: 'DeFi', price: 2.00 },
        { ticker: '1INCH', name: '1inch Network', sector: 'DeFi', price: 1.25 },
        // Layer 2
        { ticker: 'MATIC', name: 'Polygon', sector: 'Layer 2', price: 0.01 },
        { ticker: 'ARB', name: 'Arbitrum', sector: 'Layer 2', price: 0.85 },
        { ticker: 'OP', name: 'Optimism', sector: 'Layer 2', price: 0.95 },
        { ticker: 'IMX', name: 'Immutable X', sector: 'Layer 2', price: 0.45 },
        // Oracle/Infra
        { ticker: 'LINK', name: 'Chainlink', sector: 'Oracle', price: 0.15 },
        { ticker: 'GRT', name: 'The Graph', sector: 'Infra', price: 0.12 },
        { ticker: 'FIL', name: 'Filecoin', sector: 'Storage', price: 5.00 },
        { ticker: 'AR', name: 'Arweave', sector: 'Storage', price: 8.50 },
        // Exchange
        { ticker: 'BNB', name: 'Binance Coin', sector: 'Exchange', price: 0.10 },
        { ticker: 'FTT', name: 'FTX Token', sector: 'Exchange', price: 1.00 },
        { ticker: 'CRO', name: 'Cronos', sector: 'Exchange', price: 0.05 },
        { ticker: 'OKB', name: 'OKB', sector: 'Exchange', price: 2.50 },
        // Gaming/NFT
        { ticker: 'AXS', name: 'Axie Infinity', sector: 'Gaming', price: 0.50 },
        { ticker: 'SAND', name: 'The Sandbox', sector: 'Gaming', price: 0.25 },
        { ticker: 'MANA', name: 'Decentraland', sector: 'Gaming', price: 0.35 },
        { ticker: 'ENJ', name: 'Enjin Coin', sector: 'Gaming', price: 0.15 },
        { ticker: 'GALA', name: 'Gala Games', sector: 'Gaming', price: 0.02 },
        { ticker: 'APE', name: 'ApeCoin', sector: 'NFT', price: 4.50 },
      ]
    }

    return companyData[mode].map((c, i) => ({
      id: `company-${i}`,
      name: c.name,
      ticker: c.ticker,
      sector: c.sector,
      stockPrice: c.price,
      previousPrice: c.price,
      marketCap: c.price * 1_000_000_000,
      peRatio: 15 + Math.random() * 20,
      dividendYield: Math.random() * 3,
      volatility: 0.02 + Math.random() * 0.03,
      description: `${c.name} is a leading company in the ${c.sector} sector.`,
      headquarters: 'USA',
      priceHistory: this.generateInitialPriceHistory(c.price),
      tradeMarkers: [],
      isListed: true
    }))
  }

  private generateInitialPriceHistory(basePrice: number): PriceCandle[] {
    const history: PriceCandle[] = []
    let price = basePrice * 0.8 // Start 20% lower
    
    for (let i = 12; i > 0; i--) {
      const volatility = 0.05
      const change = (Math.random() - 0.45) * volatility
      const open = price
      const close = price * (1 + change)
      const high = Math.max(open, close) * (1 + Math.random() * 0.02)
      const low = Math.min(open, close) * (1 - Math.random() * 0.02)
      
      history.push({
        date: { year: 1984, month: 13 - i },
        open,
        high,
        low,
        close
      })
      
      price = close
    }
    
    return history
  }

  // Public methods
  getState(): GameState {
    return { ...this.state }
  }

  isRunning(): boolean {
    return this.state.isRunning
  }

  startGame(mode: GameMode) {
    console.log(`[GameEngine] Starting game in ${mode} mode`)
    
    // Reset state
    this.state = this.createInitialState(mode)
    this.state.isRunning = true
    
    // Emit initial state
    this.emit('stateUpdate', this.getState())
    
    // Generate initial news
    this.generateNews()
    
    // Start game loop
    this.startGameLoop()
  }

  stopGame() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval)
      this.gameLoopInterval = null
    }
    this.state.isRunning = false
    console.log('[GameEngine] Game stopped')
  }

  private startGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval)
    }

    console.log(`[GameEngine] Game loop started (${this.TURN_INTERVAL_MS}ms per turn)`)
    
    this.gameLoopInterval = setInterval(() => {
      this.advanceTurn()
    }, this.TURN_INTERVAL_MS)
  }

  private async advanceTurn() {
    if (!this.state.isRunning) return

    // Advance date
    this.state.currentDate.month++
    if (this.state.currentDate.month > 12) {
      this.state.currentDate.month = 1
      this.state.currentDate.year++
    }
    this.state.turnNumber++

    console.log(`[GameEngine] Turn ${this.state.turnNumber}: ${this.formatDate(this.state.currentDate)}`)

    // Update market
    this.updateMarket()

    // Generate news
    this.generateNews()

    // AI decisions
    await this.processAIDecisions()

    // Update net worth
    this.updateNetWorth()

    // Check for game end
    if (this.state.turnNumber >= this.state.totalTurns) {
      this.endGame()
      return
    }

    // Emit state update
    this.emit('stateUpdate', this.getState())
  }

  private updateMarket() {
    // Random market movement
    const marketVolatility = 0.02
    const marketTrend = (Math.random() - 0.48) * marketVolatility
    
    this.state.marketChange = marketTrend * 100
    this.state.marketIndex *= (1 + marketTrend)

    // Update each company
    this.state.companies = this.state.companies.map(company => {
      const companyVolatility = company.volatility || 0.03
      const priceChange = marketTrend + (Math.random() - 0.5) * companyVolatility
      
      const previousPrice = company.stockPrice
      const newPrice = Math.max(0.01, company.stockPrice * (1 + priceChange))
      
      // Add to price history
      const candle: PriceCandle = {
        date: { ...this.state.currentDate },
        open: previousPrice,
        high: Math.max(previousPrice, newPrice) * (1 + Math.random() * 0.01),
        low: Math.min(previousPrice, newPrice) * (1 - Math.random() * 0.01),
        close: newPrice
      }
      
      return {
        ...company,
        previousPrice,
        stockPrice: newPrice,
        marketCap: newPrice * 1_000_000_000,
        priceHistory: [...company.priceHistory.slice(-100), candle]
      }
    })
  }

  private generateNews() {
    const newsTemplates = [
      { headline: 'Markets show mixed signals amid economic uncertainty', category: 'market', impact: 'neutral' as const },
      { headline: 'Federal Reserve considers policy adjustment', category: 'economy', impact: 'neutral' as const },
      { headline: 'Tech sector leads market rally', category: 'market', impact: 'positive' as const },
      { headline: 'Energy prices surge on supply concerns', category: 'economy', impact: 'negative' as const },
      { headline: 'Consumer confidence reaches new highs', category: 'economy', impact: 'positive' as const },
      { headline: 'Global trade tensions ease', category: 'politics', impact: 'positive' as const },
      { headline: 'Inflation data sparks market volatility', category: 'economy', impact: 'negative' as const },
    ]

    // Random chance of news
    if (Math.random() < 0.7) {
      const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)]
      const news: NewsHeadline = {
        id: `news-${Date.now()}`,
        headline: template.headline,
        description: 'Market analysts are closely watching developments...',
        date: { ...this.state.currentDate },
        category: template.category,
        impact: template.impact,
        isCritical: Math.random() < 0.1
      }

      this.state.news = [news, ...this.state.news.slice(0, 49)]
      this.emit('newsUpdate', news)

      if (news.isCritical) {
        this.state.breakingNews = news
        this.emit('breakingNews', news)
        
        // Clear breaking news after 5 seconds
        setTimeout(() => {
          this.state.breakingNews = null
          this.emit('stateUpdate', this.getState())
        }, 5000)
      }
    }
  }

  private async processAIDecisions() {
    for (const player of this.state.players) {
      player.isActive = true
      this.emit('stateUpdate', this.getState())

      try {
        // Build context for AI
        const context = this.buildAIContext(player)
        
        // Get AI decision
        const decision = await getAIDecision(
          player.provider,
          player.name,
          AI_PERSONALITIES[player.provider],
          context
        )

        // Update player thinking
        player.thinking = decision.thinking
        player.lastAction = decision.action

        // Execute trade
        this.executeTrade(player, decision.action)

      } catch (error) {
        console.error(`[GameEngine] AI error for ${player.name}:`, error)
        player.thinking = 'Error processing decision'
        player.lastAction = 'HOLD'
      }

      player.isActive = false
    }
  }

  private buildAIContext(player: AIPlayer) {
    const portfolio = player.portfolio.stocks.map(s => {
      const company = this.state.companies.find(c => c.id === s.companyId)
      return {
        ticker: company?.ticker || 'UNKNOWN',
        shares: s.shares,
        avgPrice: s.avgPurchasePrice,
        currentPrice: company?.stockPrice || 0
      }
    })

    const sortedCompanies = [...this.state.companies].sort((a, b) => {
      const aChange = (a.stockPrice - a.previousPrice) / a.previousPrice
      const bChange = (b.stockPrice - b.previousPrice) / b.previousPrice
      return bChange - aChange
    })

    return {
      currentDate: this.state.currentDate,
      marketIndex: this.state.marketIndex,
      marketChange: this.state.marketChange,
      cash: player.cash,
      netWorth: player.netWorth,
      portfolio,
      topGainers: sortedCompanies.slice(0, 5).map(c => ({
        ticker: c.ticker,
        price: c.stockPrice,
        change: ((c.stockPrice - c.previousPrice) / c.previousPrice) * 100
      })),
      topLosers: sortedCompanies.slice(-5).reverse().map(c => ({
        ticker: c.ticker,
        price: c.stockPrice,
        change: ((c.stockPrice - c.previousPrice) / c.previousPrice) * 100
      })),
      recentNews: this.state.news.slice(0, 5).map(n => n.headline),
      currentEvent: this.state.currentEvent?.name || null
    }
  }

  private executeTrade(player: AIPlayer, action: string) {
    const parts = action.split(' ')
    const actionType = parts[0]?.toUpperCase()

    if (actionType === 'BUY' && parts.length >= 3) {
      const ticker = parts[1]
      const shares = parseInt(parts[2]) || 100

      const company = this.state.companies.find(c => c.ticker === ticker)
      if (!company) return

      const cost = company.stockPrice * shares
      if (cost > player.cash) return

      // Execute buy
      player.cash -= cost
      const existingPosition = player.portfolio.stocks.find(s => s.companyId === company.id)
      
      if (existingPosition) {
        const totalShares = existingPosition.shares + shares
        const totalCost = existingPosition.avgPurchasePrice * existingPosition.shares + cost
        existingPosition.avgPurchasePrice = totalCost / totalShares
        existingPosition.shares = totalShares
      } else {
        player.portfolio.stocks.push({
          companyId: company.id,
          shares,
          avgPurchasePrice: company.stockPrice
        })
      }

      // Add trade marker
      company.tradeMarkers.push({
        date: { ...this.state.currentDate },
        type: 'buy',
        playerId: player.id,
        playerColor: player.color,
        shares,
        price: company.stockPrice
      })

      this.emit('tradeExecuted', {
        player: player.name,
        type: 'BUY',
        ticker,
        shares,
        price: company.stockPrice
      })

    } else if (actionType === 'SELL' && parts.length >= 3) {
      const ticker = parts[1]
      const shares = parseInt(parts[2]) || 100

      const company = this.state.companies.find(c => c.ticker === ticker)
      if (!company) return

      const position = player.portfolio.stocks.find(s => s.companyId === company.id)
      if (!position || position.shares < shares) return

      // Execute sell
      const proceeds = company.stockPrice * shares
      player.cash += proceeds
      position.shares -= shares

      if (position.shares === 0) {
        player.portfolio.stocks = player.portfolio.stocks.filter(s => s.companyId !== company.id)
      }

      // Add trade marker
      company.tradeMarkers.push({
        date: { ...this.state.currentDate },
        type: 'sell',
        playerId: player.id,
        playerColor: player.color,
        shares,
        price: company.stockPrice
      })

      this.emit('tradeExecuted', {
        player: player.name,
        type: 'SELL',
        ticker,
        shares,
        price: company.stockPrice
      })
    }
  }

  private updateNetWorth() {
    for (const player of this.state.players) {
      let stockValue = 0
      for (const position of player.portfolio.stocks) {
        const company = this.state.companies.find(c => c.id === position.companyId)
        if (company) {
          stockValue += company.stockPrice * position.shares
        }
      }
      player.netWorth = player.cash + stockValue
    }
  }

  private endGame() {
    this.state.isRunning = false
    
    // Determine winner
    const sortedPlayers = [...this.state.players].sort((a, b) => b.netWorth - a.netWorth)
    this.state.winner = sortedPlayers[0]

    console.log(`[GameEngine] Game ended! Winner: ${this.state.winner.name}`)
    
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval)
      this.gameLoopInterval = null
    }

    this.emit('gameEnded', {
      winner: this.state.winner,
      finalStandings: sortedPlayers
    })
    
    // Auto-restart after 30 seconds
    console.log('[GameEngine] Restarting game in 30 seconds...')
    setTimeout(() => {
      this.startGame(this.state.gameMode)
    }, 30000)
  }

  private formatDate(date: GameDate): string {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${months[date.month - 1]} ${date.year}`
  }
}

