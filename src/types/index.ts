// AI Player Types
export type AIProvider = 'claude' | 'gpt' | 'grok' | 'deepseek'

export interface AIPlayer {
  id: string
  name: string
  provider: AIProvider
  avatar: string
  color: string
  cash: number
  portfolio: Portfolio
  netWorth: number
  thinking: string
  lastAction: string
  isActive: boolean
}

export interface Portfolio {
  stocks: StockHolding[]
  bonds: BondHolding[]
  options: OptionHolding[]
}

export interface StockHolding {
  companyId: string
  shares: number
  avgPurchasePrice: number
}

export interface BondHolding {
  companyId: string
  amount: number
  interestRate: number
  maturityDate: GameDate
}

export interface OptionHolding {
  companyId: string
  type: 'call' | 'put'
  strikePrice: number
  expirationDate: GameDate
  quantity: number
}

// Price History OHLC Candle
export interface PriceCandle {
  date: GameDate
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Trade marker for chart
export interface TradeMarker {
  date: GameDate
  price: number
  type: 'buy' | 'sell'
  playerId: string
  playerColor: string
  shares: number
}

// Company Types
export interface Company {
  id: string
  name: string
  ticker: string
  sector: Sector
  stockPrice: number
  previousPrice: number
  sharesOutstanding: number
  marketCap: number
  peRatio: number
  dividendYield: number
  debt: number
  cash: number
  revenue: number
  profit: number
  employees: number
  founded: number
  ceo: string
  isPublic: boolean
  isListed: boolean  // Whether asset is currently tradeable
  listingDate?: GameDate  // When asset becomes tradeable (IPO/launch date)
  ipoPrice?: number  // The initial listing/IPO price
  isPennytStock: boolean
  volatility: number
  news: CompanyNews[]
  ownedBy: string | null
  ownershipPercentage: number
  description?: string
  headquarters?: string
  priceHistory: PriceCandle[]
  tradeMarkers: TradeMarker[]
}

export interface CompanyNews {
  id: string
  date: GameDate
  headline: string
  impact: 'positive' | 'negative' | 'neutral'
  priceEffect: number
}

export type Sector = 
  | 'Technology' | 'Finance' | 'Healthcare' | 'Energy' | 'Consumer'
  | 'Industrial' | 'Utilities' | 'Real Estate' | 'Materials' | 'Telecom'
  | 'Transportation' | 'Media' | 'Retail' | 'Defense' | 'Agriculture'

// Game State Types
export interface GameDate {
  year: number
  month: number
  day?: number
}

export interface GameState {
  currentDate: GameDate
  endDate: GameDate
  turnNumber: number
  totalTurns: number
  players: AIPlayer[]
  companies: Company[]
  marketIndex: number
  previousMarketIndex: number
  interestRate: number
  inflation: number
  gdpGrowth: number
  unemployment: number
  currentEvent: HistoricalEvent | null
  newsHeadlines: NewsHeadline[]
  isPaused: boolean
  gameSpeed: GameSpeed
  winner: AIPlayer | null
}

export type GameSpeed = 'slow' | 'normal' | 'fast' | 'turbo'

// Historical Events
export interface HistoricalEvent {
  id: string
  name: string
  date: GameDate
  description: string
  duration: number
  effects: EventEffect[]
  isActive: boolean
}

export interface EventEffect {
  type: 'market' | 'sector' | 'interest' | 'inflation' | 'unemployment'
  target?: Sector
  magnitude: number
}

// News
export interface NewsHeadline {
  id: string
  date: GameDate
  headline: string
  category: 'market' | 'company' | 'economy' | 'politics' | 'event'
  relatedCompany?: string
  relatedEvent?: string
}

// Actions
export type ActionType = 
  | 'buy_stock' | 'sell_stock' | 'buy_bonds' | 'sell_bonds'
  | 'buy_options' | 'sell_options' | 'hostile_takeover' | 'merge_companies'
  | 'issue_dividend' | 'buyback_shares' | 'take_loan' | 'repay_loan'
  | 'insider_trade' | 'spread_rumor' | 'lobby_government' | 'spinoff'
  | 'liquidate' | 'ipo' | 'greenmail' | 'lbo' | 'skip'

export interface GameAction {
  id: string
  playerId: string
  type: ActionType
  targetCompanyId?: string
  amount?: number
  price?: number
  reasoning: string
  timestamp: GameDate
  success: boolean
  result: string
}

export interface AIThought {
  playerId: string
  timestamp: Date
  phase: 'analyzing' | 'planning' | 'deciding' | 'executing'
  content: string
}

