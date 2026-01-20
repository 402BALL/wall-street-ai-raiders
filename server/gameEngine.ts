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
    // Prices are roughly accurate for the START of each period
    // Classic: 1985 prices, Modern: 2010 prices, Crypto: 2009-2010 prices
    const companyData = {
      classic: [
        // Technology - 1985 prices (split-adjusted estimates)
        { ticker: 'IBM', name: 'IBM Corporation', sector: 'Technology', price: 120.00 },
        { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', price: 0.10 }, // IPO 1986 at ~$0.10 split-adj
        { ticker: 'AAPL', name: 'Apple Computer', sector: 'Technology', price: 0.50 }, // ~$0.50 split-adjusted 1985
        { ticker: 'HPQ', name: 'Hewlett-Packard', sector: 'Technology', price: 12.00 },
        { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 1.50 }, // split-adjusted
        { ticker: 'ORCL', name: 'Oracle Corp', sector: 'Technology', price: 0.30 }, // IPO 1986
        { ticker: 'CSCO', name: 'Cisco Systems', sector: 'Technology', price: 0.08 }, // IPO 1990
        { ticker: 'DELL', name: 'Dell Computer', sector: 'Technology', price: 0.05 }, // IPO 1988
        { ticker: 'TXN', name: 'Texas Instruments', sector: 'Technology', price: 8.50 },
        { ticker: 'MOT', name: 'Motorola Inc', sector: 'Technology', price: 15.00 },
        // Industrial - 1985 prices
        { ticker: 'GE', name: 'General Electric', sector: 'Industrial', price: 6.50 }, // split-adjusted
        { ticker: 'CAT', name: 'Caterpillar Inc', sector: 'Industrial', price: 12.00 },
        { ticker: 'MMM', name: '3M Company', sector: 'Industrial', price: 18.00 },
        { ticker: 'HON', name: 'Honeywell Intl', sector: 'Industrial', price: 22.00 },
        { ticker: 'EMR', name: 'Emerson Electric', sector: 'Industrial', price: 8.00 },
        { ticker: 'UTX', name: 'United Technologies', sector: 'Industrial', price: 14.00 },
        // Consumer - 1985 prices
        { ticker: 'KO', name: 'Coca-Cola Company', sector: 'Consumer', price: 2.50 }, // split-adjusted
        { ticker: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer', price: 2.00 },
        { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 6.00 },
        { ticker: 'MCD', name: 'McDonald\'s Corp', sector: 'Consumer', price: 3.50 },
        { ticker: 'NKE', name: 'Nike Inc', sector: 'Consumer', price: 0.20 }, // split-adjusted
        { ticker: 'CL', name: 'Colgate-Palmolive', sector: 'Consumer', price: 4.00 },
        { ticker: 'KHC', name: 'Kraft Heinz', sector: 'Consumer', price: 12.00 },
        { ticker: 'MO', name: 'Philip Morris', sector: 'Consumer', price: 3.00 },
        // Energy - 1985 prices
        { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy', price: 8.50 },
        { ticker: 'CVX', name: 'Chevron Corp', sector: 'Energy', price: 7.00 },
        { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', price: 5.50 },
        { ticker: 'SLB', name: 'Schlumberger Ltd', sector: 'Energy', price: 12.00 },
        { ticker: 'OXY', name: 'Occidental Petrol', sector: 'Energy', price: 8.00 },
        // Financial - 1985 prices
        { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', price: 5.00 },
        { ticker: 'BAC', name: 'Bank of America', sector: 'Financial', price: 2.00 },
        { ticker: 'WFC', name: 'Wells Fargo', sector: 'Financial', price: 1.50 },
        { ticker: 'C', name: 'Citigroup Inc', sector: 'Financial', price: 4.00 },
        { ticker: 'AXP', name: 'American Express', sector: 'Financial', price: 6.00 },
        { ticker: 'MER', name: 'Merrill Lynch', sector: 'Financial', price: 8.00 },
        { ticker: 'LEH', name: 'Lehman Brothers', sector: 'Financial', price: 12.00 },
        // Healthcare - 1985 prices
        { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 4.00 },
        { ticker: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', price: 2.50 },
        { ticker: 'MRK', name: 'Merck & Co', sector: 'Healthcare', price: 8.00 },
        { ticker: 'ABT', name: 'Abbott Labs', sector: 'Healthcare', price: 5.00 },
        { ticker: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', price: 6.00 },
        { ticker: 'BMY', name: 'Bristol-Myers', sector: 'Healthcare', price: 7.00 },
        // Retail - 1985 prices
        { ticker: 'WMT', name: 'Walmart Inc', sector: 'Retail', price: 1.50 }, // split-adjusted
        { ticker: 'HD', name: 'Home Depot', sector: 'Retail', price: 0.50 }, // IPO 1981
        { ticker: 'TGT', name: 'Target Corp', sector: 'Retail', price: 5.00 },
        { ticker: 'COST', name: 'Costco Wholesale', sector: 'Retail', price: 5.00 }, // IPO 1985
        { ticker: 'GPS', name: 'Gap Inc', sector: 'Retail', price: 2.00 },
        // Entertainment/Media
        { ticker: 'DIS', name: 'Walt Disney Co', sector: 'Entertainment', price: 3.00 },
        { ticker: 'TWX', name: 'Time Warner', sector: 'Media', price: 15.00 },
        { ticker: 'CBS', name: 'CBS Corporation', sector: 'Media', price: 12.00 },
        // Telecom
        { ticker: 'T', name: 'AT&T Inc', sector: 'Telecom', price: 5.00 },
        // Aerospace
        { ticker: 'BA', name: 'Boeing Company', sector: 'Aerospace', price: 8.00 },
        { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Aerospace', price: 15.00 },
        { ticker: 'GD', name: 'General Dynamics', sector: 'Aerospace', price: 10.00 },
        { ticker: 'NOC', name: 'Northrop Grumman', sector: 'Aerospace', price: 12.00 },
      ],
      modern: [
        // Big Tech - 2010 prices (approximately)
        { ticker: 'AAPL', name: 'Apple Inc', sector: 'Technology', price: 9.00 }, // ~$9 split-adjusted 2010
        { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', price: 28.00 },
        { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', price: 280.00 },
        { ticker: 'AMZN', name: 'Amazon.com Inc', sector: 'Technology', price: 130.00 },
        { ticker: 'META', name: 'Meta Platforms', sector: 'Technology', price: 38.00 }, // IPO 2012
        { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', price: 3.00 }, // split-adjusted
        { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Automotive', price: 4.50 }, // IPO Jun 2010 at ~$17, split-adj ~$4
        { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 20.00 },
        { ticker: 'ORCL', name: 'Oracle Corp', sector: 'Technology', price: 24.00 },
        // Tech Growth - 2010 prices
        { ticker: 'NFLX', name: 'Netflix Inc', sector: 'Entertainment', price: 10.00 }, // split-adjusted
        { ticker: 'AMD', name: 'AMD Inc', sector: 'Technology', price: 8.00 },
        { ticker: 'CRM', name: 'Salesforce Inc', sector: 'Technology', price: 12.00 },
        { ticker: 'ADBE', name: 'Adobe Inc', sector: 'Technology', price: 32.00 },
        { ticker: 'QCOM', name: 'Qualcomm Inc', sector: 'Technology', price: 38.00 },
        { ticker: 'AVGO', name: 'Broadcom Inc', sector: 'Technology', price: 25.00 },
        // Fintech - various IPO dates
        { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Fintech', price: 38.00 }, // IPO 2015
        { ticker: 'SQ', name: 'Block Inc', sector: 'Fintech', price: 9.00 }, // IPO 2015
        { ticker: 'COIN', name: 'Coinbase Global', sector: 'Fintech', price: 250.00 }, // IPO 2021
        { ticker: 'V', name: 'Visa Inc', sector: 'Fintech', price: 20.00 },
        { ticker: 'MA', name: 'Mastercard Inc', sector: 'Fintech', price: 25.00 },
        // E-commerce
        { ticker: 'SHOP', name: 'Shopify Inc', sector: 'E-commerce', price: 28.00 }, // IPO 2015
        { ticker: 'ETSY', name: 'Etsy Inc', sector: 'E-commerce', price: 16.00 }, // IPO 2015
        { ticker: 'EBAY', name: 'eBay Inc', sector: 'E-commerce', price: 24.00 },
        { ticker: 'BABA', name: 'Alibaba Group', sector: 'E-commerce', price: 68.00 }, // IPO 2014
        { ticker: 'JD', name: 'JD.com Inc', sector: 'E-commerce', price: 20.00 },
        // Gig Economy - IPO dates
        { ticker: 'UBER', name: 'Uber Technologies', sector: 'Technology', price: 42.00 }, // IPO 2019
        { ticker: 'LYFT', name: 'Lyft Inc', sector: 'Technology', price: 72.00 }, // IPO 2019
        { ticker: 'DASH', name: 'DoorDash Inc', sector: 'Technology', price: 102.00 }, // IPO 2020
        { ticker: 'ABNB', name: 'Airbnb Inc', sector: 'Technology', price: 68.00 }, // IPO 2020
        // Social/Video
        { ticker: 'ZM', name: 'Zoom Video', sector: 'Technology', price: 36.00 }, // IPO 2019
        { ticker: 'SNAP', name: 'Snap Inc', sector: 'Technology', price: 17.00 }, // IPO 2017
        { ticker: 'PINS', name: 'Pinterest Inc', sector: 'Technology', price: 19.00 }, // IPO 2019
        { ticker: 'TWTR', name: 'Twitter Inc', sector: 'Technology', price: 26.00 }, // IPO 2013
        { ticker: 'SPOT', name: 'Spotify Tech', sector: 'Entertainment', price: 132.00 }, // IPO 2018
        // Gaming
        { ticker: 'RBLX', name: 'Roblox Corp', sector: 'Gaming', price: 45.00 }, // IPO 2021
        { ticker: 'TTWO', name: 'Take-Two Interactive', sector: 'Gaming', price: 10.00 },
        { ticker: 'EA', name: 'Electronic Arts', sector: 'Gaming', price: 16.00 },
        { ticker: 'ATVI', name: 'Activision Blizzard', sector: 'Gaming', price: 11.00 },
        // AI/Cloud - later IPOs
        { ticker: 'PLTR', name: 'Palantir Tech', sector: 'Technology', price: 10.00 }, // IPO 2020
        { ticker: 'SNOW', name: 'Snowflake Inc', sector: 'Technology', price: 120.00 }, // IPO 2020
        // EVs
        { ticker: 'RIVN', name: 'Rivian Automotive', sector: 'Automotive', price: 78.00 }, // IPO 2021
        { ticker: 'LCID', name: 'Lucid Group', sector: 'Automotive', price: 25.00 }, // IPO 2021
        { ticker: 'NIO', name: 'NIO Inc', sector: 'Automotive', price: 6.00 }, // IPO 2018
        // Meme Stocks - 2020 prices before squeeze
        { ticker: 'GME', name: 'GameStop Corp', sector: 'Retail', price: 4.00 },
        { ticker: 'AMC', name: 'AMC Entertainment', sector: 'Entertainment', price: 2.00 },
        { ticker: 'BB', name: 'BlackBerry Ltd', sector: 'Technology', price: 5.00 },
        // Traditional
        { ticker: 'DIS', name: 'Walt Disney Co', sector: 'Entertainment', price: 35.00 },
        { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', price: 42.00 },
        { ticker: 'WMT', name: 'Walmart Inc', sector: 'Retail', price: 55.00 },
        { ticker: 'HD', name: 'Home Depot', sector: 'Retail', price: 30.00 },
      ],
      crypto: [
        // Layer 1 - approximate launch/early prices
        { ticker: 'BTC', name: 'Bitcoin', sector: 'Layer 1', price: 0.003 }, // 2009-2010 basically $0
        { ticker: 'ETH', name: 'Ethereum', sector: 'Layer 1', price: 0.30 }, // ICO 2014 ~$0.30
        { ticker: 'SOL', name: 'Solana', sector: 'Layer 1', price: 0.22 }, // Launch 2020 ~$0.22
        { ticker: 'ADA', name: 'Cardano', sector: 'Layer 1', price: 0.02 }, // ICO 2017 ~$0.02
        { ticker: 'AVAX', name: 'Avalanche', sector: 'Layer 1', price: 4.00 }, // Launch 2020
        { ticker: 'DOT', name: 'Polkadot', sector: 'Layer 1', price: 2.90 }, // Launch 2020
        { ticker: 'ATOM', name: 'Cosmos', sector: 'Layer 1', price: 1.00 }, // ICO 2017
        { ticker: 'NEAR', name: 'NEAR Protocol', sector: 'Layer 1', price: 0.60 },
        { ticker: 'FTM', name: 'Fantom', sector: 'Layer 1', price: 0.02 },
        { ticker: 'ALGO', name: 'Algorand', sector: 'Layer 1', price: 2.40 }, // Launch 2019
        // Old School - early prices
        { ticker: 'XRP', name: 'Ripple', sector: 'Payments', price: 0.005 }, // 2013 launch
        { ticker: 'LTC', name: 'Litecoin', sector: 'Payments', price: 0.05 }, // 2011 launch
        { ticker: 'BCH', name: 'Bitcoin Cash', sector: 'Payments', price: 280.00 }, // Fork 2017
        { ticker: 'XLM', name: 'Stellar Lumens', sector: 'Payments', price: 0.002 }, // 2014
        { ticker: 'XMR', name: 'Monero', sector: 'Privacy', price: 0.50 }, // 2014
        { ticker: 'ETC', name: 'Ethereum Classic', sector: 'Layer 1', price: 0.80 }, // Fork 2016
        // Meme Coins - launch prices
        { ticker: 'DOGE', name: 'Dogecoin', sector: 'Meme', price: 0.0002 }, // 2013
        { ticker: 'SHIB', name: 'Shiba Inu', sector: 'Meme', price: 0.0000000001 }, // 2020
        { ticker: 'PEPE', name: 'Pepe Coin', sector: 'Meme', price: 0.0000001 }, // 2023
        { ticker: 'FLOKI', name: 'Floki Inu', sector: 'Meme', price: 0.00001 }, // 2021
        { ticker: 'BONK', name: 'Bonk', sector: 'Meme', price: 0.0000001 }, // 2022
        { ticker: 'WIF', name: 'dogwifhat', sector: 'Meme', price: 0.005 }, // 2023
        // DeFi - launch prices
        { ticker: 'UNI', name: 'Uniswap', sector: 'DeFi', price: 3.00 }, // 2020
        { ticker: 'AAVE', name: 'Aave', sector: 'DeFi', price: 55.00 }, // 2020
        { ticker: 'MKR', name: 'Maker', sector: 'DeFi', price: 300.00 }, // 2017
        { ticker: 'COMP', name: 'Compound', sector: 'DeFi', price: 60.00 }, // 2020
        { ticker: 'CRV', name: 'Curve DAO', sector: 'DeFi', price: 1.00 }, // 2020
        { ticker: 'SNX', name: 'Synthetix', sector: 'DeFi', price: 0.50 }, // 2018
        { ticker: 'SUSHI', name: 'SushiSwap', sector: 'DeFi', price: 1.20 }, // 2020
        { ticker: 'YFI', name: 'yearn.finance', sector: 'DeFi', price: 3000.00 }, // 2020, started high
        // Layer 2
        { ticker: 'MATIC', name: 'Polygon', sector: 'Layer 2', price: 0.004 }, // 2019
        { ticker: 'ARB', name: 'Arbitrum', sector: 'Layer 2', price: 1.20 }, // 2023
        { ticker: 'OP', name: 'Optimism', sector: 'Layer 2', price: 1.40 }, // 2022
        // Oracle/Infra
        { ticker: 'LINK', name: 'Chainlink', sector: 'Oracle', price: 0.11 }, // ICO 2017
        { ticker: 'GRT', name: 'The Graph', sector: 'Infra', price: 0.03 }, // 2020
        { ticker: 'FIL', name: 'Filecoin', sector: 'Storage', price: 20.00 }, // 2020
        // Exchange - launch prices
        { ticker: 'BNB', name: 'Binance Coin', sector: 'Exchange', price: 0.11 }, // ICO 2017
        { ticker: 'FTT', name: 'FTX Token', sector: 'Exchange', price: 1.00 }, // 2019, will crash to 0
        { ticker: 'CRO', name: 'Cronos', sector: 'Exchange', price: 0.02 }, // 2018
        // Gaming/NFT
        { ticker: 'AXS', name: 'Axie Infinity', sector: 'Gaming', price: 0.15 }, // 2020
        { ticker: 'SAND', name: 'The Sandbox', sector: 'Gaming', price: 0.05 }, // 2020
        { ticker: 'MANA', name: 'Decentraland', sector: 'Gaming', price: 0.02 }, // 2017
        { ticker: 'ENJ', name: 'Enjin Coin', sector: 'Gaming', price: 0.02 }, // 2017
        { ticker: 'GALA', name: 'Gala Games', sector: 'Gaming', price: 0.001 }, // 2020
        { ticker: 'APE', name: 'ApeCoin', sector: 'NFT', price: 8.00 }, // 2022
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
    const { year, month } = this.state.currentDate
    const mode = this.state.gameMode
    
    // Check for historical events
    const historicalEvent = this.getHistoricalEvent(year, month, mode)
    if (historicalEvent) {
      const news: NewsHeadline = {
        id: `news-${Date.now()}-hist`,
        headline: historicalEvent.headline,
        description: historicalEvent.description,
        date: { ...this.state.currentDate },
        category: historicalEvent.category,
        impact: historicalEvent.impact,
        isCritical: historicalEvent.isCritical || false
      }
      
      this.state.news = [news, ...this.state.news.slice(0, 49)]
      this.emit('newsUpdate', news)
      
      // Apply market impact
      if (historicalEvent.marketImpact) {
        this.applyMarketImpact(historicalEvent.marketImpact, historicalEvent.sectors)
      }
      
      if (historicalEvent.isCritical) {
        this.state.breakingNews = news
        this.emit('breakingNews', news)
        setTimeout(() => {
          this.state.breakingNews = null
          this.emit('stateUpdate', this.getState())
        }, 8000)
      }
      return
    }
    
    // Random background news
    const bgNews = this.getRandomBackgroundNews()
    if (Math.random() < 0.6) {
      const news: NewsHeadline = {
        id: `news-${Date.now()}`,
        headline: bgNews.headline,
        description: bgNews.description,
        date: { ...this.state.currentDate },
        category: bgNews.category,
        impact: bgNews.impact,
        isCritical: false
      }
      this.state.news = [news, ...this.state.news.slice(0, 49)]
      this.emit('newsUpdate', news)
    }
  }
  
  private getHistoricalEvent(year: number, month: number, mode: GameMode) {
    // CLASSIC MODE EVENTS (1985-2010)
    const classicEvents: Record<string, any> = {
      '1987-10': { headline: '⚠️ BLACK MONDAY: DOW CRASHES 22.6%', description: 'October 19, 1987 - The largest single-day percentage decline in stock market history. Panic selling triggers circuit breakers worldwide.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.22, sectors: ['all'] },
      '1987-11': { headline: 'Markets stabilize after Black Monday crash', description: 'Federal Reserve injects liquidity to prevent systemic collapse.', category: 'economy', impact: 'neutral' as const, marketImpact: 0.05 },
      '1989-10': { headline: 'Friday the 13th mini-crash hits markets', description: 'Failed UAL leveraged buyout triggers selloff, Dow drops 6.9%.', category: 'market', impact: 'negative' as const, marketImpact: -0.07 },
      '1990-8': { headline: '⚠️ IRAQ INVADES KUWAIT - Oil prices surge', description: 'Gulf War begins. Oil prices double from $17 to $35 per barrel.', category: 'politics', impact: 'negative' as const, isCritical: true, marketImpact: -0.08, sectors: ['Energy'] },
      '1991-1': { headline: 'Operation Desert Storm begins', description: 'US-led coalition launches air campaign against Iraq.', category: 'politics', impact: 'negative' as const, marketImpact: -0.03 },
      '1991-2': { headline: 'Gulf War ends - Markets rally', description: 'Quick victory boosts investor confidence.', category: 'politics', impact: 'positive' as const, marketImpact: 0.06 },
      '1994-2': { headline: 'Fed raises rates unexpectedly', description: 'Bond market massacre begins. Worst bond market year since 1927.', category: 'economy', impact: 'negative' as const, marketImpact: -0.04 },
      '1995-1': { headline: 'Mexican Peso Crisis erupts', description: 'US provides $50B bailout package to prevent default.', category: 'economy', impact: 'negative' as const, marketImpact: -0.03 },
      '1995-8': { headline: 'Netscape IPO ignites dot-com boom', description: 'Browser company surges 108% on first day. Internet mania begins.', category: 'market', impact: 'positive' as const, marketImpact: 0.03, sectors: ['Technology'] },
      '1997-7': { headline: '⚠️ ASIAN FINANCIAL CRISIS BEGINS', description: 'Thai baht collapses. Currency crisis spreads to South Korea, Indonesia.', category: 'economy', impact: 'negative' as const, isCritical: true, marketImpact: -0.06 },
      '1998-8': { headline: '⚠️ RUSSIA DEFAULTS - LTCM COLLAPSE', description: 'Russia defaults on debt. Long-Term Capital Management near collapse threatens global markets.', category: 'economy', impact: 'negative' as const, isCritical: true, marketImpact: -0.12 },
      '1998-10': { headline: 'Fed orchestrates LTCM bailout', description: 'Major banks rescue hedge fund to prevent systemic crisis.', category: 'economy', impact: 'positive' as const, marketImpact: 0.08 },
      '1999-1': { headline: 'Euro currency launched', description: '11 European nations adopt single currency.', category: 'economy', impact: 'neutral' as const },
      '1999-3': { headline: 'Dow crosses 10,000 for first time', description: 'Historic milestone reached amid dot-com euphoria.', category: 'market', impact: 'positive' as const, marketImpact: 0.02 },
      '2000-3': { headline: '⚠️ DOT-COM BUBBLE PEAKS', description: 'NASDAQ hits all-time high of 5,048. Tech valuations reach extreme levels.', category: 'market', impact: 'neutral' as const, isCritical: true, sectors: ['Technology'] },
      '2000-4': { headline: '⚠️ DOT-COM CRASH BEGINS', description: 'NASDAQ plunges 25% in April. Dot-com companies begin collapsing.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.15, sectors: ['Technology'] },
      '2000-11': { headline: 'Contested US election creates uncertainty', description: 'Bush vs Gore recount drama rattles markets.', category: 'politics', impact: 'negative' as const, marketImpact: -0.03 },
      '2001-1': { headline: 'Fed begins emergency rate cuts', description: 'Greenspan slashes rates to combat recession fears.', category: 'economy', impact: 'positive' as const, marketImpact: 0.02 },
      '2001-3': { headline: 'Tech wreck continues - layoffs mount', description: 'Dot-com companies fold as funding dries up.', category: 'market', impact: 'negative' as const, marketImpact: -0.05, sectors: ['Technology'] },
      '2001-9': { headline: '⚠️ 9/11 ATTACKS - MARKETS CLOSED', description: 'September 11, 2001 - Terror attacks on World Trade Center. NYSE closed for 4 days.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.12 },
      '2001-10': { headline: 'Markets reopen - volatility extreme', description: 'Dow drops 14% in first week after reopening.', category: 'market', impact: 'negative' as const, marketImpact: -0.06 },
      '2001-12': { headline: '⚠️ ENRON FILES BANKRUPTCY', description: 'Energy giant collapses in massive accounting fraud scandal.', category: 'company', impact: 'negative' as const, isCritical: true, marketImpact: -0.03 },
      '2002-7': { headline: '⚠️ WORLDCOM FRAUD REVEALED', description: '$11 billion accounting fraud - largest bankruptcy in US history.', category: 'company', impact: 'negative' as const, isCritical: true, marketImpact: -0.05 },
      '2002-10': { headline: 'Bear market bottom reached', description: 'S&P 500 down 49% from peak. Worst bear market since 1930s.', category: 'market', impact: 'neutral' as const },
      '2003-3': { headline: 'Iraq War begins - markets rally', description: 'US invades Iraq. Markets rise on resolution of uncertainty.', category: 'politics', impact: 'positive' as const, marketImpact: 0.05 },
      '2004-8': { headline: 'Google IPO at $85 per share', description: 'Search giant goes public, valued at $27 billion.', category: 'company', impact: 'positive' as const, sectors: ['Technology'] },
      '2005-8': { headline: 'Hurricane Katrina devastates Gulf Coast', description: 'Oil production disrupted. Gas prices spike.', category: 'economy', impact: 'negative' as const, marketImpact: -0.02, sectors: ['Energy'] },
      '2006-6': { headline: 'Housing prices begin to decline', description: 'First signs of subprime mortgage troubles emerge.', category: 'economy', impact: 'negative' as const },
      '2007-2': { headline: 'HSBC warns of subprime losses', description: 'First major bank acknowledges mortgage problems.', category: 'economy', impact: 'negative' as const, marketImpact: -0.02 },
      '2007-8': { headline: '⚠️ CREDIT CRISIS BEGINS', description: 'BNP Paribas freezes funds. Interbank lending seizes up.', category: 'economy', impact: 'negative' as const, isCritical: true, marketImpact: -0.05 },
      '2008-3': { headline: '⚠️ BEAR STEARNS COLLAPSES', description: 'JPMorgan acquires Bear Stearns for $2/share in Fed-backed rescue.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.08, sectors: ['Financial'] },
      '2008-9': { headline: '⚠️ LEHMAN BROTHERS BANKRUPTCY', description: 'September 15 - Lehman files largest bankruptcy in history. Global financial system freezes.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.20, sectors: ['Financial'] },
      '2008-10': { headline: '⚠️ TARP BAILOUT - $700B RESCUE', description: 'Congress approves massive bank bailout after initial failure.', category: 'economy', impact: 'positive' as const, isCritical: true, marketImpact: 0.08 },
      '2008-11': { headline: 'Fed cuts rates to near zero', description: 'Emergency monetary policy as economy craters.', category: 'economy', impact: 'positive' as const, marketImpact: 0.03 },
      '2009-3': { headline: 'Market hits 12-year low', description: 'S&P 500 bottoms at 676. Down 57% from 2007 peak.', category: 'market', impact: 'neutral' as const },
      '2009-4': { headline: 'Recovery begins - banks pass stress tests', description: 'Confidence returns as financial system stabilizes.', category: 'economy', impact: 'positive' as const, marketImpact: 0.08 },
    }
    
    // MODERN MODE EVENTS (2010-2026)  
    const modernEvents: Record<string, any> = {
      '2010-5': { headline: '⚠️ FLASH CRASH - DOW DROPS 1000 POINTS', description: 'May 6 - Markets plunge 9% in minutes before recovering. Algorithmic trading blamed.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.06 },
      '2011-8': { headline: '⚠️ US CREDIT DOWNGRADE - S&P CUTS AAA', description: 'First ever downgrade of US sovereign debt. Markets tumble.', category: 'economy', impact: 'negative' as const, isCritical: true, marketImpact: -0.08 },
      '2011-10': { headline: 'European debt crisis intensifies', description: 'Greek default fears spread to Italy, Spain.', category: 'economy', impact: 'negative' as const, marketImpact: -0.05 },
      '2012-5': { headline: 'Facebook IPO flops', description: 'Social network IPOs at $38, falls to $19 within months.', category: 'company', impact: 'negative' as const, sectors: ['Technology'] },
      '2012-9': { headline: 'Fed launches QE3 - unlimited bond buying', description: 'Draghi says ECB will do "whatever it takes".', category: 'economy', impact: 'positive' as const, marketImpact: 0.05 },
      '2013-5': { headline: 'Taper Tantrum hits markets', description: 'Bernanke hints at reducing QE. Bond yields spike.', category: 'economy', impact: 'negative' as const, marketImpact: -0.04 },
      '2014-10': { headline: 'Oil prices crash begins', description: 'OPEC refuses to cut production. Oil falls from $100 to $50.', category: 'economy', impact: 'negative' as const, marketImpact: -0.03, sectors: ['Energy'] },
      '2015-8': { headline: '⚠️ CHINA DEVALUES YUAN - GLOBAL SELLOFF', description: 'Black Monday - Dow drops 1000 points at open on China fears.', category: 'economy', impact: 'negative' as const, isCritical: true, marketImpact: -0.08 },
      '2016-6': { headline: '⚠️ BREXIT SHOCK - UK VOTES TO LEAVE EU', description: 'Markets crash on unexpected referendum result.', category: 'politics', impact: 'negative' as const, isCritical: true, marketImpact: -0.05 },
      '2016-11': { headline: 'Trump wins election - markets rally', description: 'Surprise victory followed by massive stock rally.', category: 'politics', impact: 'positive' as const, marketImpact: 0.06 },
      '2018-2': { headline: '⚠️ VOLMAGEDDON - VIX SPIKES 115%', description: 'Volatility spike wipes out short-vol products.', category: 'market', impact: 'negative' as const, isCritical: true, marketImpact: -0.08 },
      '2018-12': { headline: 'Fed hikes into weakness - markets tumble', description: 'Worst December since Great Depression.', category: 'economy', impact: 'negative' as const, marketImpact: -0.09 },
      '2019-8': { headline: 'Yield curve inverts - recession fears', description: '10Y-2Y spread goes negative for first time since 2007.', category: 'economy', impact: 'negative' as const, marketImpact: -0.03 },
      '2020-2': { headline: '⚠️ COVID-19 PANDEMIC BEGINS', description: 'Coronavirus spreads globally. Markets begin historic crash.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.12 },
      '2020-3': { headline: '⚠️ FASTEST BEAR MARKET IN HISTORY', description: 'S&P 500 down 34% in 23 trading days. Circuit breakers triggered 4 times.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.20 },
      '2020-4': { headline: 'Fed unleashes unlimited QE', description: 'Powell promises to do "whatever it takes". Markets bottom.', category: 'economy', impact: 'positive' as const, marketImpact: 0.15 },
      '2020-11': { headline: 'Pfizer vaccine 95% effective', description: 'Markets surge on vaccine breakthrough.', category: 'economy', impact: 'positive' as const, marketImpact: 0.08 },
      '2021-1': { headline: '⚠️ GAMESTOP MEME STOCK MANIA', description: 'Reddit army sends GME from $20 to $483. Robinhood halts trading.', category: 'market', impact: 'positive' as const, isCritical: true, sectors: ['Retail'] },
      '2021-4': { headline: 'Coinbase goes public at $380', description: 'Crypto exchange valued at $100 billion.', category: 'company', impact: 'positive' as const, sectors: ['Fintech'] },
      '2021-11': { headline: 'Inflation surges to 6.8%', description: 'Highest inflation in 40 years. Fed calls it "transitory".', category: 'economy', impact: 'negative' as const },
      '2022-1': { headline: 'Fed signals aggressive rate hikes', description: 'Growth stocks crash as rates expected to rise.', category: 'economy', impact: 'negative' as const, marketImpact: -0.08, sectors: ['Technology'] },
      '2022-5': { headline: '⚠️ LUNA/TERRA CRYPTO COLLAPSE', description: '$60 billion algorithmic stablecoin implodes in days.', category: 'crash', impact: 'negative' as const, isCritical: true },
      '2022-11': { headline: '⚠️ FTX COLLAPSES - BANKMAN-FRIED ARRESTED', description: '$32 billion crypto exchange fails in spectacular fraud.', category: 'crash', impact: 'negative' as const, isCritical: true },
      '2023-3': { headline: '⚠️ SILICON VALLEY BANK COLLAPSES', description: 'Largest bank failure since 2008. Regional banks under pressure.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.05, sectors: ['Financial'] },
      '2023-5': { headline: 'AI boom - Nvidia surges 200%+', description: 'ChatGPT sparks AI investment frenzy.', category: 'market', impact: 'positive' as const, marketImpact: 0.06, sectors: ['Technology'] },
      '2024-1': { headline: '⚠️ BITCOIN ETF APPROVED', description: 'SEC approves spot Bitcoin ETFs. Crypto enters mainstream.', category: 'economy', impact: 'positive' as const, isCritical: true },
      '2024-7': { headline: 'Fed signals rate cuts ahead', description: 'Inflation cooling allows pivot to easing.', category: 'economy', impact: 'positive' as const, marketImpact: 0.04 },
      '2025-1': { headline: 'AI Agents reshape industries', description: 'Autonomous AI systems begin replacing human workflows.', category: 'market', impact: 'positive' as const, sectors: ['Technology'] },
    }
    
    // CRYPTO MODE EVENTS (2009-2026)
    const cryptoEvents: Record<string, any> = {
      '2009-1': { headline: 'Bitcoin genesis block mined', description: 'Satoshi Nakamoto mines first Bitcoin block with message about bank bailouts.', category: 'crypto', impact: 'positive' as const },
      '2010-5': { headline: 'First Bitcoin purchase - 10,000 BTC for pizza', description: 'Laszlo Hanyecz pays 10,000 BTC for two pizzas (~$41).', category: 'crypto', impact: 'neutral' as const },
      '2010-7': { headline: 'Bitcoin reaches $0.08', description: 'Early adopters begin trading on Mt. Gox exchange.', category: 'crypto', impact: 'positive' as const, marketImpact: 0.15 },
      '2011-6': { headline: '⚠️ MT. GOX HACKED - BTC CRASHES 99%', description: 'Exchange compromised, price falls from $17 to $0.01 briefly.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.50 },
      '2013-3': { headline: 'Cyprus crisis - Bitcoin surges', description: 'Bank deposit seizures drive interest in Bitcoin as safe haven.', category: 'economy', impact: 'positive' as const, marketImpact: 0.20 },
      '2013-11': { headline: '⚠️ BITCOIN HITS $1,000', description: 'Unprecedented rally as mainstream media coverage increases.', category: 'market', impact: 'positive' as const, isCritical: true, marketImpact: 0.30 },
      '2014-2': { headline: '⚠️ MT. GOX COLLAPSES - 850K BTC LOST', description: 'Largest Bitcoin exchange files bankruptcy after massive hack.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.40 },
      '2015-8': { headline: 'Ethereum launches', description: 'Smart contract platform goes live with Vitalik Buterin vision.', category: 'crypto', impact: 'positive' as const },
      '2016-7': { headline: '⚠️ THE DAO HACK - $50M STOLEN', description: 'Ethereum hard forks to recover funds, creating Ethereum Classic.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.20 },
      '2017-1': { headline: 'Bitcoin breaks $1,000 again', description: 'Crypto winter ends. New bull market begins.', category: 'market', impact: 'positive' as const, marketImpact: 0.15 },
      '2017-6': { headline: 'ICO mania peaks - billions raised', description: 'Token sales raise $5.6 billion in H1 2017.', category: 'market', impact: 'positive' as const, marketImpact: 0.25 },
      '2017-12': { headline: '⚠️ BITCOIN HITS $20,000', description: 'Historic all-time high amid retail FOMO. Coinbase app #1 in App Store.', category: 'market', impact: 'positive' as const, isCritical: true, marketImpact: 0.40 },
      '2018-1': { headline: '⚠️ CRYPTO CRASH BEGINS', description: 'Bitcoin drops 65% from peak. Altcoins crash 80-90%.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.50 },
      '2018-11': { headline: 'Crypto winter deepens', description: 'Bitcoin falls below $4,000. Total market cap down 85% from peak.', category: 'market', impact: 'negative' as const, marketImpact: -0.30 },
      '2020-3': { headline: '⚠️ COVID CRASH - BTC DROPS 50%', description: 'Black Thursday - crypto crashes with traditional markets.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.40 },
      '2020-5': { headline: 'Bitcoin halving completes', description: 'Block reward drops to 6.25 BTC. Supply shock begins.', category: 'crypto', impact: 'positive' as const, marketImpact: 0.10 },
      '2020-8': { headline: 'DeFi Summer - yields explode', description: 'Liquidity mining launches DeFi into mainstream.', category: 'crypto', impact: 'positive' as const, marketImpact: 0.25 },
      '2020-12': { headline: 'Bitcoin breaks 2017 all-time high', description: 'Institutional buying from MicroStrategy, Square drives rally.', category: 'market', impact: 'positive' as const, marketImpact: 0.20 },
      '2021-2': { headline: 'Tesla buys $1.5 billion in Bitcoin', description: 'Elon Musk drives Bitcoin to $58,000.', category: 'company', impact: 'positive' as const, marketImpact: 0.30 },
      '2021-4': { headline: 'Coinbase IPO at $328 - $86B valuation', description: 'Crypto exchange goes public on NASDAQ.', category: 'company', impact: 'positive' as const },
      '2021-5': { headline: '⚠️ CHINA BANS CRYPTO MINING', description: 'Bitcoin crashes 50% as miners flee China.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.35 },
      '2021-11': { headline: '⚠️ BITCOIN HITS $69,000 ATH', description: 'All-time high before market reversal.', category: 'market', impact: 'positive' as const, isCritical: true, marketImpact: 0.25 },
      '2022-5': { headline: '⚠️ LUNA/TERRA DEATH SPIRAL', description: '$60B algorithmic stablecoin collapses to zero in days. Contagion spreads.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.40 },
      '2022-6': { headline: 'Celsius, 3AC, Voyager collapse', description: 'Crypto lenders fail as contagion spreads.', category: 'crash', impact: 'negative' as const, marketImpact: -0.25 },
      '2022-11': { headline: '⚠️ FTX EMPIRE COLLAPSES', description: 'Sam Bankman-Fried\'s $32B exchange implodes. Billions in customer funds missing.', category: 'crash', impact: 'negative' as const, isCritical: true, marketImpact: -0.30 },
      '2023-1': { headline: 'Bitcoin bottoms at $16,000', description: 'Crypto winter appears to end as sellers exhausted.', category: 'market', impact: 'neutral' as const },
      '2023-6': { headline: 'BlackRock files for Bitcoin ETF', description: 'Largest asset manager enters crypto. Markets surge.', category: 'company', impact: 'positive' as const, marketImpact: 0.20 },
      '2024-1': { headline: '⚠️ BITCOIN ETF APPROVED', description: 'SEC approves 11 spot Bitcoin ETFs. Historic moment for crypto.', category: 'economy', impact: 'positive' as const, isCritical: true, marketImpact: 0.25 },
      '2024-3': { headline: 'Bitcoin hits new ATH above $70,000', description: 'ETF inflows drive price past 2021 highs.', category: 'market', impact: 'positive' as const, marketImpact: 0.15 },
      '2024-4': { headline: 'Bitcoin halving - supply drops again', description: 'Block reward falls to 3.125 BTC.', category: 'crypto', impact: 'positive' as const, marketImpact: 0.10 },
      '2025-1': { headline: 'Ethereum ETF sees record inflows', description: 'Institutional adoption of crypto accelerates.', category: 'market', impact: 'positive' as const, marketImpact: 0.15 },
    }
    
    const key = `${year}-${month}`
    
    if (mode === 'classic') return classicEvents[key]
    if (mode === 'modern') return modernEvents[key]
    if (mode === 'crypto') return cryptoEvents[key]
    
    return null
  }
  
  private applyMarketImpact(impact: number, sectors?: string[]) {
    if (sectors?.includes('all') || !sectors) {
      // Apply to all companies
      for (const company of this.state.companies) {
        const volatilityFactor = 1 + (Math.random() - 0.5) * 0.3
        const change = impact * volatilityFactor
        company.previousPrice = company.stockPrice
        company.stockPrice = Math.max(0.01, company.stockPrice * (1 + change))
        company.marketCap = company.stockPrice * 1_000_000_000
      }
    } else {
      // Apply stronger to specific sectors
      for (const company of this.state.companies) {
        const inSector = sectors.includes(company.sector)
        const sectorMultiplier = inSector ? 1.5 : 0.5
        const volatilityFactor = 1 + (Math.random() - 0.5) * 0.3
        const change = impact * sectorMultiplier * volatilityFactor
        company.previousPrice = company.stockPrice
        company.stockPrice = Math.max(0.01, company.stockPrice * (1 + change))
        company.marketCap = company.stockPrice * 1_000_000_000
      }
    }
    
    // Update market index
    this.state.marketIndex *= (1 + impact)
  }
  
  private getRandomBackgroundNews() {
    const templates = [
      { headline: 'Markets trade sideways amid mixed signals', description: 'Investors await key economic data.', category: 'market', impact: 'neutral' as const },
      { headline: 'Analysts debate market outlook', description: 'Wall Street divided on near-term direction.', category: 'market', impact: 'neutral' as const },
      { headline: 'Corporate earnings beat expectations', description: 'Strong quarter for major companies.', category: 'company', impact: 'positive' as const },
      { headline: 'Consumer spending shows resilience', description: 'Retail sales data exceeds forecasts.', category: 'economy', impact: 'positive' as const },
      { headline: 'Manufacturing data disappoints', description: 'PMI falls below expectations.', category: 'economy', impact: 'negative' as const },
      { headline: 'Housing market shows signs of cooling', description: 'Home sales decline for third month.', category: 'economy', impact: 'negative' as const },
      { headline: 'Oil prices stabilize after volatile week', description: 'Energy markets find equilibrium.', category: 'economy', impact: 'neutral' as const },
      { headline: 'Tech sector outperforms broader market', description: 'Growth stocks lead gains.', category: 'market', impact: 'positive' as const },
      { headline: 'Bond yields rise on inflation concerns', description: 'Treasury market under pressure.', category: 'economy', impact: 'negative' as const },
      { headline: 'Central bank maintains steady policy', description: 'No changes to interest rates expected.', category: 'economy', impact: 'neutral' as const },
    ]
    return templates[Math.floor(Math.random() * templates.length)]
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

