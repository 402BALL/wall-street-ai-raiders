import { create } from 'zustand'
import { GameState, AIPlayer, Company, GameDate, HistoricalEvent, NewsHeadline, GameAction, AIThought, GameSpeed, PriceCandle, TradeMarker } from '../types'
import { generateInitialCompanies, generateModernCompanies, generateCryptoAssets } from '../data/companies'
import { createAIPlayers } from '../data/players'
import { historicalEvents, modernEvents, cryptoEvents } from '../data/events'
import { getAIDecision, AI_PERSONALITIES, MarketContext } from '../services/aiProviders'

export type GameMode = 'classic' | 'modern' | 'crypto'

interface GameModeConfig {
  startDate: GameDate
  endDate: GameDate
  marketIndex: number
  interestRate: number
  inflation: number
  gdpGrowth: number
  unemployment: number
  marketName: string
}

const gameModeConfigs: Record<GameMode, GameModeConfig> = {
  classic: {
    startDate: { year: 1985, month: 1 },
    endDate: { year: 2010, month: 12 },
    marketIndex: 1000,
    interestRate: 8.5,
    inflation: 3.5,
    gdpGrowth: 3.2,
    unemployment: 7.2,
    marketName: 'DOW JONES'
  },
  modern: {
    startDate: { year: 2010, month: 1 },
    endDate: { year: 2026, month: 12 },
    marketIndex: 10500,
    interestRate: 0.25,
    inflation: 1.5,
    gdpGrowth: 2.5,
    unemployment: 9.8,
    marketName: 'S&P 500'
  },
  crypto: {
    startDate: { year: 2009, month: 1 },
    endDate: { year: 2026, month: 12 },
    marketIndex: 1,
    interestRate: 0,
    inflation: 0,
    gdpGrowth: 0,
    unemployment: 0,
    marketName: 'CRYPTO INDEX'
  }
}

interface GameStore extends GameState {
  gameStarted: boolean
  gameMode: GameMode
  selectedCompany: Company | null
  selectedPlayer: AIPlayer | null
  activeTab: 'market' | 'portfolio' | 'news' | 'actions' | 'thinking'
  showSettings: boolean
  actionHistory: GameAction[]
  aiThoughts: AIThought[]
  marketHistory: PriceCandle[]
  marketName: string
  isConnected: boolean
  breakingNews: NewsHeadline | null
  gamesOverview: {
    classic: { isRunning: boolean; turnNumber: number; currentDate: GameDate }
    modern: { isRunning: boolean; turnNumber: number; currentDate: GameDate }
    crypto: { isRunning: boolean; turnNumber: number; currentDate: GameDate }
  } | null
  
  // Server-related actions
  setServerState: (state: any) => void
  setConnected: (connected: boolean) => void
  addNews: (news: NewsHeadline) => void
  setBreakingNews: (news: NewsHeadline | null) => void
  setGamesOverview: (overview: any) => void
  
  // Local actions
  startGame: (mode?: GameMode) => void
  restartGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  setGameSpeed: (speed: GameSpeed) => void
  advanceTurn: () => void
  selectCompany: (company: Company | null) => void
  selectPlayer: (player: AIPlayer | null) => void
  setActiveTab: (tab: 'market' | 'portfolio' | 'news' | 'actions' | 'thinking') => void
  toggleSettings: () => void
  executeAction: (action: GameAction) => void
  addTradeMarker: (companyId: string, marker: TradeMarker) => void
  updateMarket: () => void
  checkForNewListings: () => void
  checkForEvents: () => void
  simulateAITrades: () => Promise<void>
  generateRandomNews: () => void
  addNewsHeadline: (headline: NewsHeadline) => void
  addAIThought: (thought: AIThought) => void
  updatePlayerNetWorth: (playerId: string) => void
  formatMoney: (amount: number) => string
  formatDate: (date: GameDate) => string
}

// Helper to advance date by one month
const advanceMonth = (date: GameDate): GameDate => {
  let year = date.year
  let month = date.month + 1
  
  if (month > 12) {
    month = 1
    year++
  }
  
  return { year, month }
}

// Calculate total months for a mode
const calculateTotalTurns = (startDate: GameDate, endDate: GameDate) => {
  return (endDate.year - startDate.year) * 12 + (endDate.month - startDate.month) + 1
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentDate: { year: 1985, month: 1 },
  endDate: { year: 2010, month: 12 },
  turnNumber: 0,
  totalTurns: 300,
  players: [],
  companies: [],
  marketIndex: 1000,
  previousMarketIndex: 1000,
  interestRate: 8.5,
  inflation: 3.5,
  gdpGrowth: 3.2,
  unemployment: 7.2,
  currentEvent: null,
  newsHeadlines: [],
  isPaused: true,
  gameSpeed: 'normal',
  winner: null,
  gameStarted: false,
  gameMode: 'classic',
  selectedCompany: null,
  selectedPlayer: null,
  activeTab: 'market',
  showSettings: false,
  actionHistory: [],
  aiThoughts: [],
  marketHistory: [],
  marketName: 'DOW JONES',
  isConnected: false,
  breakingNews: null,
  gamesOverview: null,
  
  // Games overview update
  setGamesOverview: (overview) => set({ gamesOverview: overview }),
  
  // Server state update - receives full state from WebSocket
  setServerState: (serverState) => set((state) => {
    if (!serverState) return state
    
    return {
      ...state,
      gameStarted: serverState.isRunning || serverState.turnNumber > 0,
      gameMode: serverState.gameMode || state.gameMode,
      currentDate: serverState.currentDate || state.currentDate,
      turnNumber: serverState.turnNumber ?? state.turnNumber,
      totalTurns: serverState.totalTurns ?? state.totalTurns,
      marketIndex: serverState.marketIndex ?? state.marketIndex,
      previousMarketIndex: state.marketIndex,
      players: serverState.players || state.players,
      companies: serverState.companies || state.companies,
      newsHeadlines: serverState.news || state.newsHeadlines,
      currentEvent: serverState.currentEvent,
      winner: serverState.winner || null,
      marketName: serverState.marketName || state.marketName,
      breakingNews: serverState.breakingNews,
      isPaused: !serverState.isRunning
    }
  }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  addNews: (news) => set((state) => ({
    newsHeadlines: [news, ...state.newsHeadlines.slice(0, 49)]
  })),
  
  setBreakingNews: (news) => set({ breakingNews: news }),
  
  startGame: (mode: GameMode = 'classic') => {
    const config = gameModeConfigs[mode]
    const events = mode === 'classic' ? historicalEvents : mode === 'modern' ? modernEvents : cryptoEvents
    
    // Generate companies/assets based on mode with correct start year
    let companies: Company[]
    if (mode === 'classic') {
      companies = generateInitialCompanies()
    } else if (mode === 'modern') {
      companies = generateModernCompanies(config.startDate.year)
    } else {
      companies = generateCryptoAssets(config.startDate.year)
    }
    
    const players = createAIPlayers()
    
    // Generate initial price history (12 months of pre-game data) for LISTED companies only
    const startDate = config.startDate
    const companiesWithHistory = companies.map(company => {
      // Skip history for companies not yet listed
      if (!company.isListed) {
        return { ...company, priceHistory: [] }
      }
      
      const history: PriceCandle[] = []
      let price = company.stockPrice * 0.85
      
      for (let i = 12; i >= 1; i--) {
        let d = { year: startDate.year, month: startDate.month - i }
        if (d.month < 1) {
          d.month += 12
          d.year--
        }
        
        // Monthly volatility - higher for crypto
        const volMultiplier = mode === 'crypto' ? 3 : 1.5
        const change = (Math.random() - 0.48) * company.volatility * volMultiplier
        const open = price
        const close = price * (1 + change / 100)
        const high = Math.max(open, close) * (1 + Math.random() * (mode === 'crypto' ? 0.15 : 0.05))
        const low = Math.min(open, close) * (1 - Math.random() * (mode === 'crypto' ? 0.15 : 0.05))
        
        history.push({
          date: d,
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          volume: Math.round(company.sharesOutstanding * 0.1 * (0.5 + Math.random()))
        })
        
        price = close
      }
      
      return { ...company, priceHistory: history }
    })
    
    // Generate initial market history (12 months)
    const marketHistory: PriceCandle[] = []
    let marketPrice = config.marketIndex * 0.9
    for (let i = 12; i >= 0; i--) {
      let d = { year: startDate.year, month: startDate.month - i }
      if (d.month < 1) {
        d.month += 12
        d.year--
      }
      
      const change = (Math.random() - 0.48) * (mode === 'crypto' ? 10 : 3)
      const open = marketPrice
      const close = marketPrice * (1 + change / 100)
      
      marketHistory.push({
        date: d,
        open,
        high: Math.max(open, close) * (mode === 'crypto' ? 1.05 : 1.02),
        low: Math.min(open, close) * (mode === 'crypto' ? 0.95 : 0.98),
        close,
        volume: Math.round(500_000_000 + Math.random() * 500_000_000)
      })
      
      marketPrice = close
    }
    
    // Generate mode-specific initial news
    const modeNames = { classic: 'CLASSIC WALL STREET', modern: 'MODERN MARKETS', crypto: 'CRYPTO WARS' }
    const periodLabels = { 
      classic: '1985-2010', 
      modern: '2010-2026', 
      crypto: '2009-2026' 
    }
    
    const initialNews: NewsHeadline[] = [
      { id: '1', date: startDate, headline: `*** ${modeNames[mode]}: THE COMPETITION BEGINS ***`, category: 'event' },
      { id: '2', date: startDate, headline: 'Four AI titans enter the arena with $1 BILLION each', category: 'market' },
      { id: '3', date: startDate, headline: `Markets open for simulation spanning ${periodLabels[mode]}`, category: 'market' },
    ]
    
    if (mode === 'classic') {
      initialNews.push(
        { id: '4', date: startDate, headline: 'Reagan administration continues deregulation push', category: 'politics' },
        { id: '5', date: startDate, headline: `Federal Reserve holds rates at ${config.interestRate}%`, category: 'economy' },
        { id: '6', date: startDate, headline: `${config.marketName} trading near ${config.marketIndex.toLocaleString()}`, category: 'market' }
      )
    } else if (mode === 'modern') {
      initialNews.push(
        { id: '4', date: startDate, headline: 'Obama administration launches post-crisis recovery', category: 'politics' },
        { id: '5', date: startDate, headline: 'Fed holds rates near zero after 2008 crisis', category: 'economy' },
        { id: '6', date: startDate, headline: 'Tech giants begin decade of dominance: AAPL, GOOGL, AMZN', category: 'market' }
      )
    } else {
      initialNews.push(
        { id: '4', date: startDate, headline: '!!! GENESIS BLOCK: Bitcoin network launches !!!', category: 'event' },
        { id: '5', date: startDate, headline: 'Satoshi Nakamoto mines first BTC - A new era begins', category: 'market' },
        { id: '6', date: startDate, headline: 'Cryptocurrency: Digital gold or speculative mania?', category: 'market' }
      )
    }
    
    const totalTurns = calculateTotalTurns(config.startDate, config.endDate)
    
    console.log('[GAME] Starting game with mode:', mode)
    console.log('[GAME] Initial news count:', initialNews.length)
    console.log('[GAME] Companies count:', companiesWithHistory.length)
    console.log('[GAME] Listed companies:', companiesWithHistory.filter(c => c.isListed).length)
    
    set({ 
      gameStarted: true, 
      gameMode: mode,
      companies: companiesWithHistory, 
      players, 
      newsHeadlines: initialNews, 
      isPaused: false,
      marketHistory,
      marketIndex: config.marketIndex,
      previousMarketIndex: config.marketIndex,
      currentDate: startDate,
      endDate: config.endDate,
      totalTurns,
      turnNumber: 0,
      winner: null,
      currentEvent: null,
      selectedCompany: null,
      selectedPlayer: null,
      actionHistory: [],
      aiThoughts: [
        { playerId: 'claude', timestamp: new Date(), phase: 'analyzing', content: 'Claude is ready to compete! Conservative value approach.' },
        { playerId: 'gpt', timestamp: new Date(), phase: 'analyzing', content: 'GPT-4o analyzing market opportunities...' },
        { playerId: 'grok', timestamp: new Date(), phase: 'analyzing', content: 'Grok-2 looking for aggressive plays!' },
        { playerId: 'deepseek', timestamp: new Date(), phase: 'analyzing', content: 'DeepSeek scanning for momentum signals...' }
      ],
      interestRate: config.interestRate,
      inflation: config.inflation,
      gdpGrowth: config.gdpGrowth,
      unemployment: config.unemployment,
      marketName: config.marketName
    })
    
    // Trigger first AI trades immediately after 2 seconds
    setTimeout(() => {
      console.log('[GAME] Triggering initial AI trading...')
      get().simulateAITrades()
    }, 2000)
  },
  
  restartGame: () => {
    const mode = get().gameMode
    get().startGame(mode)
  },
  
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  setGameSpeed: (speed) => set({ gameSpeed: speed }),
  
  advanceTurn: () => {
    const state = get()
    if (!state.gameStarted) return
    
    const newDate = advanceMonth(state.currentDate)
    
    // Check for game end
    if (newDate.year > state.endDate.year || 
        (newDate.year === state.endDate.year && newDate.month > state.endDate.month)) {
      const sortedPlayers = [...state.players].sort((a, b) => b.netWorth - a.netWorth)
      set({ winner: sortedPlayers[0], isPaused: true })
      return
    }
    
    set({ 
      currentDate: newDate, 
      turnNumber: state.turnNumber + 1, 
      previousMarketIndex: state.marketIndex 
    })
    
    // Check for new IPOs/listings this month
    get().checkForNewListings()
    
    // Update market every month
    get().updateMarket()
    get().checkForEvents()
    get().generateRandomNews()
  },
  
  // Check for new IPOs/crypto listings this month
  checkForNewListings: () => {
    const state = get()
    const { currentDate, companies, gameMode } = state
    const newListings: Company[] = []
    
    const updatedCompanies = companies.map(company => {
      // Skip already listed companies
      if (company.isListed) return company
      
      // Check if this is the listing date
      if (company.listingDate && 
          company.listingDate.year === currentDate.year && 
          company.listingDate.month === currentDate.month) {
        
        // Use the stored IPO price (was set during company generation)
        const ipoPrice = company.ipoPrice || (gameMode === 'crypto' ? 0.01 : 25)
        // IPO first day/month variation: typically +10-50% pop, sometimes down
        const firstMonthMultiplier = gameMode === 'crypto' 
          ? (0.8 + Math.random() * 1.4) // Crypto: -20% to +120%
          : (0.95 + Math.random() * 0.55) // Stocks: -5% to +50%
        const closePrice = ipoPrice * firstMonthMultiplier
        
        newListings.push(company)
        
        return {
          ...company,
          isListed: true,
          stockPrice: closePrice,
          previousPrice: ipoPrice,
          marketCap: closePrice * company.sharesOutstanding,
          priceHistory: [{
            date: { ...currentDate },
            open: ipoPrice,
            high: Math.max(ipoPrice, closePrice) * (1 + Math.random() * 0.15),
            low: Math.min(ipoPrice, closePrice) * (1 - Math.random() * 0.1),
            close: closePrice,
            volume: Math.round(company.sharesOutstanding * (gameMode === 'crypto' ? 0.05 : 0.15)) // Trading volume
          }]
        }
      }
      
      return company
    })
    
    // Generate news for each new listing
    newListings.forEach(company => {
      const isIPO = gameMode !== 'crypto'
      const headline = isIPO 
        ? `!!! IPO ALERT: ${company.name} (${company.ticker}) begins trading !!!`
        : `!!! NEW LISTING: ${company.name} (${company.ticker}) launches !!!`
      
      const category = 'event'
      
      get().addNewsHeadline({
        id: `listing-${company.ticker}-${Date.now()}`,
        date: { ...currentDate },
        headline,
        category,
        relatedCompany: company.ticker
      })
      
      // Add to breaking news for significant listings
      const significantListings = ['META', 'TSLA', 'COIN', 'ETH', 'BNB', 'SOL', 'DOGE', 'SHIB', 'UBER', 'ABNB', 'RIVN', 'ARM']
      if (significantListings.includes(company.ticker)) {
        set(state => ({
          newsHeadlines: [{
            id: `breaking-listing-${company.ticker}`,
            date: { ...currentDate },
            headline: `*** MAJOR ${isIPO ? 'IPO' : 'LISTING'}: ${company.name} enters the market! ***`,
            category: 'event',
            relatedCompany: company.ticker
          }, ...state.newsHeadlines]
        }))
      }
    })
    
    if (newListings.length > 0) {
      set({ companies: updatedCompanies })
    }
  },
  
  selectCompany: (company) => set({ selectedCompany: company }),
  selectPlayer: (player) => set({ selectedPlayer: player }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSettings: () => set(state => ({ showSettings: !state.showSettings })),
  executeAction: (action) => set(state => ({ actionHistory: [...state.actionHistory, action] })),
  
  updateMarket: () => {
    const state = get()
    
    // Base monthly market movement (slightly bullish bias historically, ~1% avg monthly)
    let marketChange = (Math.random() - 0.45) * 8 // Monthly volatility: -4% to +4.4%
    
    // Apply event effects (full monthly impact)
    if (state.currentEvent) {
      const marketEffect = state.currentEvent.effects.find(e => e.type === 'market')
      if (marketEffect) {
        const monthlyEffect = marketEffect.magnitude / state.currentEvent.duration
        marketChange += monthlyEffect
      }
    }
    
    const newMarketIndex = state.marketIndex * (1 + marketChange / 100)
    
    // Create market index candle (monthly)
    const marketCandle: PriceCandle = {
      date: { ...state.currentDate },
      open: state.marketIndex,
      high: Math.max(state.marketIndex, newMarketIndex) * (1 + Math.random() * 0.02),
      low: Math.min(state.marketIndex, newMarketIndex) * (1 - Math.random() * 0.02),
      close: newMarketIndex,
      volume: Math.round(500_000_000 + Math.random() * 1_000_000_000)
    }
    
    const updatedCompanies = state.companies.map(company => {
      // Skip companies that are not yet listed - they don't trade
      if (!company.isListed) {
        return company
      }
      
      // Base price change follows market (monthly)
      let priceChange = marketChange * 0.7 + (Math.random() - 0.5) * company.volatility * 2
      
      // Apply sector-specific event effects (monthly)
      if (state.currentEvent) {
        const sectorEffect = state.currentEvent.effects.find(e => e.type === 'sector' && e.target === company.sector)
        if (sectorEffect) {
          const monthlyEffect = sectorEffect.magnitude / state.currentEvent.duration
          priceChange += monthlyEffect
        }
      }
      
      const openPrice = company.stockPrice
      const closePrice = Math.max(0.0000001, company.stockPrice * (1 + priceChange / 100)) // Lower floor for crypto
      
      // Monthly range
      const monthVol = company.volatility * 0.8
      const highPrice = Math.max(openPrice, closePrice) * (1 + Math.random() * monthVol / 100)
      const lowPrice = Math.min(openPrice, closePrice) * (1 - Math.random() * monthVol / 100)
      
      const volumeMultiplier = state.currentEvent ? 1.5 + Math.random() * 0.5 : 0.8 + Math.random() * 0.4
      
      const newCandle: PriceCandle = {
        date: { ...state.currentDate },
        open: Number(openPrice.toPrecision(6)),
        high: Number(highPrice.toPrecision(6)),
        low: Number(lowPrice.toPrecision(6)),
        close: Number(closePrice.toPrecision(6)),
        volume: Math.round(company.sharesOutstanding * 0.1 * volumeMultiplier) // Monthly volume
      }
      
      return {
        ...company,
        previousPrice: company.stockPrice,
        stockPrice: Number(closePrice.toPrecision(6)),
        marketCap: closePrice * company.sharesOutstanding,
        priceHistory: [...company.priceHistory.slice(-300), newCandle] // Keep 300 months (25 years)
      }
    })
    
    const updatedPlayers = state.players.map(player => {
      let stockValue = 0
      player.portfolio.stocks.forEach(holding => {
        const company = updatedCompanies.find(c => c.id === holding.companyId)
        if (company) stockValue += company.stockPrice * holding.shares
      })
      return { ...player, netWorth: player.cash + stockValue }
    })
    
    set({ 
      marketIndex: Number(newMarketIndex.toFixed(2)), 
      companies: updatedCompanies, 
      players: updatedPlayers,
      marketHistory: [...state.marketHistory.slice(-500), marketCandle]
    })
    
    // Simulate AI trades - call real AI APIs
    // Run async but don't block the game loop
    get().simulateAITrades()
  },
  
  addTradeMarker: (companyId, marker) => {
    set(state => ({
      companies: state.companies.map(c => 
        c.id === companyId 
          ? { ...c, tradeMarkers: [...c.tradeMarkers.slice(-100), marker] }
          : c
      )
    }))
  },
  
  simulateAITrades: async () => {
    const state = get()
    const listedCompanies = state.companies.filter(c => c.isListed)
    if (listedCompanies.length === 0) return
    
    // Map player providers to API providers
    const providerMap: Record<string, 'claude' | 'gpt' | 'grok' | 'deepseek'> = {
      'claude': 'claude',
      'gpt': 'gpt', 
      'grok': 'grok',
      'deepseek': 'deepseek'
    }
    
    // Process each AI player
    for (const player of state.players) {
      try {
        // Build market context for AI
        const sortedByChange = [...listedCompanies].sort((a, b) => {
          const aChange = a.previousPrice ? (a.stockPrice - a.previousPrice) / a.previousPrice : 0
          const bChange = b.previousPrice ? (b.stockPrice - b.previousPrice) / b.previousPrice : 0
          return bChange - aChange
        })
        
        const context: MarketContext = {
          currentDate: state.currentDate,
          marketIndex: state.marketIndex,
          marketChange: state.previousMarketIndex ? ((state.marketIndex - state.previousMarketIndex) / state.previousMarketIndex * 100) : 0,
          cash: player.cash,
          netWorth: player.netWorth,
          portfolio: player.portfolio.stocks.map(s => {
            const company = listedCompanies.find(c => c.id === s.companyId)
            return {
              ticker: company?.ticker || 'UNK',
              shares: s.shares,
              avgPrice: s.avgPurchasePrice,
              currentPrice: company?.stockPrice || 0
            }
          }),
          topGainers: sortedByChange.slice(0, 5).map(c => ({
            ticker: c.ticker,
            price: c.stockPrice,
            change: c.previousPrice ? ((c.stockPrice - c.previousPrice) / c.previousPrice * 100) : 0
          })),
          topLosers: sortedByChange.slice(-5).reverse().map(c => ({
            ticker: c.ticker,
            price: c.stockPrice,
            change: c.previousPrice ? ((c.stockPrice - c.previousPrice) / c.previousPrice * 100) : 0
          })),
          recentNews: state.newsHeadlines.slice(0, 5).map(n => n.headline),
          currentEvent: state.currentEvent?.name || null
        }
        
        // Get AI provider based on player
        const provider = providerMap[player.provider] || 'deepseek'
        const personality = AI_PERSONALITIES[provider]
        
        // Show thinking state
        set(state => ({
          players: state.players.map(p => 
            p.id === player.id ? { ...p, thinking: 'Analyzing market conditions...' } : p
          )
        }))
        
        get().addAIThought({
          playerId: player.id,
          timestamp: new Date(),
          phase: 'analyzing',
          content: `${player.name} is analyzing the market...`
        })
        
        // Call real AI API
        const decision = await getAIDecision(provider, player.name, personality, context)
        
        // Update thinking display
        set(state => ({
          players: state.players.map(p => 
            p.id === player.id ? { ...p, thinking: decision.thinking } : p
          )
        }))
        
        get().addAIThought({
          playerId: player.id,
          timestamp: new Date(),
          phase: 'deciding',
          content: decision.thinking
        })
        
        // Parse and execute action
        const actionParts = decision.action.toUpperCase().split(' ')
        const actionType = actionParts[0]
        
        if (actionType === 'BUY' && actionParts.length >= 3) {
          const ticker = actionParts[1]
          const amount = parseInt(actionParts[2]) || 100
          const company = listedCompanies.find(c => c.ticker === ticker)
          
          if (company && player.cash >= company.stockPrice * amount) {
            const cost = amount * company.stockPrice
            const marker: TradeMarker = {
              date: { ...state.currentDate },
              price: company.stockPrice,
              type: 'buy',
              playerId: player.id,
              playerColor: player.color,
              shares: amount
            }
            
            set(state => {
              const currentPlayer = state.players.find(p => p.id === player.id)!
              const existingHolding = currentPlayer.portfolio.stocks.find(s => s.companyId === company.id)
              const newStocks = existingHolding
                ? currentPlayer.portfolio.stocks.map(s =>
                    s.companyId === company.id
                      ? { ...s, shares: s.shares + amount, avgPurchasePrice: (s.avgPurchasePrice * s.shares + cost) / (s.shares + amount) }
                      : s
                  )
                : [...currentPlayer.portfolio.stocks, { companyId: company.id, shares: amount, avgPurchasePrice: company.stockPrice }]
              
              return {
                players: state.players.map(p =>
                  p.id === player.id
                    ? { ...p, cash: p.cash - cost, portfolio: { ...p.portfolio, stocks: newStocks }, lastAction: `BUY ${amount} ${ticker} @ $${company.stockPrice.toFixed(2)}` }
                    : p
                ),
                companies: state.companies.map(c =>
                  c.id === company.id ? { ...c, tradeMarkers: [...c.tradeMarkers.slice(-100), marker] } : c
                )
              }
            })
            
            get().addAIThought({
              playerId: player.id,
              timestamp: new Date(),
              phase: 'executing',
              content: `Executed: BUY ${amount} ${ticker}. ${decision.reasoning}`
            })
          }
        } else if (actionType === 'SELL' && actionParts.length >= 3) {
          const ticker = actionParts[1]
          const amount = parseInt(actionParts[2]) || 100
          const company = listedCompanies.find(c => c.ticker === ticker)
          const holding = player.portfolio.stocks.find(s => {
            const c = listedCompanies.find(co => co.id === s.companyId)
            return c?.ticker === ticker
          })
          
          if (company && holding && holding.shares >= amount) {
            const proceeds = amount * company.stockPrice
            const marker: TradeMarker = {
              date: { ...state.currentDate },
              price: company.stockPrice,
              type: 'sell',
              playerId: player.id,
              playerColor: player.color,
              shares: amount
            }
            
            set(state => ({
              players: state.players.map(p =>
                p.id === player.id
                  ? {
                      ...p,
                      cash: p.cash + proceeds,
                      portfolio: {
                        ...p.portfolio,
                        stocks: p.portfolio.stocks
                          .map(s => s.companyId === company.id ? { ...s, shares: s.shares - amount } : s)
                          .filter(s => s.shares > 0)
                      },
                      lastAction: `SELL ${amount} ${ticker} @ $${company.stockPrice.toFixed(2)}`
                    }
                  : p
              ),
              companies: state.companies.map(c =>
                c.id === company.id ? { ...c, tradeMarkers: [...c.tradeMarkers.slice(-100), marker] } : c
              )
            }))
            
            get().addAIThought({
              playerId: player.id,
              timestamp: new Date(),
              phase: 'executing',
              content: `Executed: SELL ${amount} ${ticker}. ${decision.reasoning}`
            })
          }
        } else {
          // HOLD action
          set(state => ({
            players: state.players.map(p =>
              p.id === player.id ? { ...p, lastAction: `HOLD - ${decision.reasoning}` } : p
            )
          }))
          
          get().addAIThought({
            playerId: player.id,
            timestamp: new Date(),
            phase: 'executing',
            content: `Decided to HOLD. ${decision.reasoning}`
          })
        }
        
        // Small delay between AI calls to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`Error processing AI trade for ${player.name}:`, error)
        get().addAIThought({
          playerId: player.id,
          timestamp: new Date(),
          phase: 'executing',
          content: `Error: Could not process trade decision`
        })
      }
    }
  },
  
  checkForEvents: () => {
    const state = get()
    const { year, month } = state.currentDate
    
    // Check for new events starting this month
    const event = historicalEvents.find(e => e.date.year === year && e.date.month === month)
    
    if (event && (!state.currentEvent || state.currentEvent.id !== event.id)) {
        const activatedEvent = { ...event, isActive: true }
        
        const newsHeadlines: NewsHeadline[] = [
          {
            id: `event-${event.id}`,
            date: { ...state.currentDate },
            headline: `!!! BREAKING: ${event.name.toUpperCase()} !!!`,
            category: 'event',
            relatedEvent: event.id
          },
          {
            id: `event-${event.id}-desc`,
            date: { ...state.currentDate },
            headline: event.description,
            category: 'event',
            relatedEvent: event.id
          }
        ]
        
        event.effects.forEach((effect, idx) => {
          if (effect.type === 'sector' && effect.target) {
            const impact = effect.magnitude > 0 ? 'SURGE' : 'PLUNGE'
            newsHeadlines.push({
              id: `event-${event.id}-sector-${idx}`,
              date: { ...state.currentDate },
              headline: `${effect.target} sector stocks ${impact} on ${event.name}`,
              category: 'market'
            })
          }
        })
        
        set({ 
          currentEvent: activatedEvent, 
          newsHeadlines: [...newsHeadlines, ...state.newsHeadlines].slice(0, 200)
        })
    }
    
    // Check if current event should end
    if (state.currentEvent) {
      const eventStartMonth = state.currentEvent.date.year * 12 + state.currentEvent.date.month
      const currentMonth = year * 12 + month
      
      if (currentMonth >= eventStartMonth + state.currentEvent.duration) {
        const endNews: NewsHeadline = {
          id: `event-${state.currentEvent.id}-end`,
          date: { ...state.currentDate },
          headline: `${state.currentEvent.name} - Market impact subsiding`,
          category: 'market'
        }
        set({ 
          currentEvent: null,
          newsHeadlines: [endNews, ...state.newsHeadlines].slice(0, 200)
        })
      }
    }
  },
  
  generateRandomNews: () => {
    const state = get()
    const { currentDate, companies, players, marketIndex, previousMarketIndex, interestRate, inflation, gdpGrowth, unemployment } = state
    const { year, month } = currentDate
    
    const newHeadlines: NewsHeadline[] = []
    const marketChange = ((marketIndex - previousMarketIndex) / previousMarketIndex * 100)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December']
    const monthName = monthNames[month - 1]
    
    // === MONTHLY MARKET SUMMARY ===
    const direction = marketChange >= 0
    const intensity = Math.abs(marketChange)
    
    let marketNews: string[]
    if (intensity > 5) {
      marketNews = direction ? [
        `${monthName} RALLY: Dow SURGES ${intensity.toFixed(1)}% for the month!`,
        `BULLS DOMINATE: Best month in quarters as Dow gains ${intensity.toFixed(1)}%`,
        `Wall Street celebrates stellar ${monthName}: +${intensity.toFixed(1)}%`,
        `Stocks SOAR in ${monthName}, Dow up ${intensity.toFixed(1)}%`
      ] : [
        `${monthName} SELLOFF: Dow PLUNGES ${intensity.toFixed(1)}%!`,
        `BEARS RAVAGE: Worst month in quarters, Dow drops ${intensity.toFixed(1)}%`,
        `Brutal ${monthName}: Markets crash ${intensity.toFixed(1)}%`,
        `Stocks COLLAPSE in ${monthName}, massive losses recorded`
      ]
    } else if (intensity > 2) {
      marketNews = direction ? [
        `Solid ${monthName}: Markets gain ${intensity.toFixed(1)}%`,
        `Dow advances ${intensity.toFixed(1)}% for the month`,
        `Positive ${monthName} for investors: +${intensity.toFixed(1)}%`,
        `Markets close ${monthName} higher by ${intensity.toFixed(1)}%`
      ] : [
        `Weak ${monthName}: Markets slip ${intensity.toFixed(1)}%`,
        `Dow retreats ${intensity.toFixed(1)}% for the month`,
        `Choppy ${monthName} ends with ${intensity.toFixed(1)}% loss`,
        `Markets close ${monthName} lower by ${intensity.toFixed(1)}%`
      ]
    } else {
      marketNews = [
        `Mixed ${monthName}: Markets essentially flat`,
        `Dow little changed in ${monthName}`,
        `Range-bound trading dominates ${monthName}`,
        `${monthName} ends with minimal change`
      ]
    }
    
    newHeadlines.push({
      id: `market-monthly-${Date.now()}`,
      date: { ...currentDate },
      headline: marketNews[Math.floor(Math.random() * marketNews.length)],
      category: 'market'
    })
    
    // === MONTHLY ECONOMIC DATA ===
    // Jobs Report
    const jobs = -50 + Math.floor(Math.random() * 350)
    const unemploymentRate = unemployment + (Math.random() - 0.5) * 0.4
    newHeadlines.push({
      id: `econ-jobs-${Date.now()}`,
      date: { ...currentDate },
      headline: `JOBS REPORT: ${jobs > 0 ? '+' : ''}${jobs}K jobs added in ${monthName}, Unemployment ${unemploymentRate.toFixed(1)}%`,
      category: 'economy'
    })
    set({ unemployment: Number(unemploymentRate.toFixed(1)) })
    
    // CPI/Inflation
    const cpiChange = (Math.random() - 0.3) * 0.6
    const newInflation = Math.max(0.5, inflation + cpiChange)
    newHeadlines.push({
      id: `econ-cpi-${Date.now()}`,
      date: { ...currentDate },
      headline: `CPI: ${newInflation.toFixed(1)}% YoY - ${newInflation > 4 ? 'Inflation worries mount' : newInflation > 2 ? 'Prices stable' : 'Low inflation environment'}`,
      category: 'economy'
    })
    set({ inflation: Number(newInflation.toFixed(1)) })
    
    // GDP (Quarterly)
    if ([1, 4, 7, 10].includes(month)) {
      const quarterlyGdp = gdpGrowth + (Math.random() - 0.5) * 2
      newHeadlines.push({
        id: `econ-gdp-${Date.now()}`,
        date: { ...currentDate },
        headline: `GDP REPORT: Economy ${quarterlyGdp > 0 ? 'grows' : 'contracts'} ${Math.abs(quarterlyGdp).toFixed(1)}% - ${quarterlyGdp > 3 ? 'BOOM' : quarterlyGdp > 0 ? 'Expansion' : 'RECESSION warning'}`,
        category: 'economy'
      })
      set({ gdpGrowth: Number(quarterlyGdp.toFixed(1)) })
    }
    
    // Fed News
    if (Math.random() < 0.4) {
      const rateAction = Math.random()
      let fedNews: string
      if (rateAction < 0.25 && inflation > 3) {
        const hike = 0.25 + (Math.random() > 0.5 ? 0.25 : 0)
        fedNews = `FED RAISES RATES ${(hike * 100).toFixed(0)} bps to ${(interestRate + hike).toFixed(2)}% to combat inflation`
        set({ interestRate: Number((interestRate + hike).toFixed(2)) })
      } else if (rateAction < 0.4 && (gdpGrowth < 2 || unemployment > 7)) {
        const cut = 0.25 + (Math.random() > 0.5 ? 0.25 : 0)
        fedNews = `FED CUTS RATES ${(cut * 100).toFixed(0)} bps to ${Math.max(0.25, interestRate - cut).toFixed(2)}% to stimulate growth`
        set({ interestRate: Math.max(0.25, Number((interestRate - cut).toFixed(2))) })
      } else {
        fedNews = `Fed holds rates steady at ${interestRate.toFixed(2)}%`
      }
      newHeadlines.push({
        id: `fed-${Date.now()}`,
        date: { ...currentDate },
        headline: fedNews,
        category: 'economy'
      })
    }
    
    // === COMPANY EARNINGS (Earnings season months) ===
    if ([1, 2, 4, 5, 7, 8, 10, 11].includes(month)) {
      // 3-5 companies report each month
      const numReports = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < numReports; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)]
        const epsBeat = Math.random() > 0.45
        const revenueBeat = Math.random() > 0.5
        const eps = (company.profit / company.sharesOutstanding).toFixed(2)
        
        let earningsNews: string
        if (epsBeat && revenueBeat) {
          earningsNews = `${company.ticker} BEATS: EPS $${eps} crushes estimates, revenue soars!`
        } else if (epsBeat) {
          earningsNews = `${company.ticker}: EPS $${eps} beats, revenue in-line`
        } else if (revenueBeat) {
          earningsNews = `${company.ticker}: EPS $${eps} misses, but revenue beats`
        } else {
          earningsNews = `${company.ticker} MISSES: EPS $${eps} disappoints, guidance cut`
        }
        
        newHeadlines.push({
          id: `earnings-${company.ticker}-${Date.now()}-${i}`,
          date: { ...currentDate },
          headline: earningsNews,
          category: 'company',
          relatedCompany: company.ticker
        })
      }
    }
    
    // === ANALYST RATINGS ===
    if (Math.random() < 0.5) {
      const company = companies[Math.floor(Math.random() * companies.length)]
      const actions = ['UPGRADES', 'DOWNGRADES', 'initiates coverage on', 'reiterates BUY on', 'cuts target on']
      const firms = ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Merrill Lynch', 'Salomon Brothers', 'Bear Stearns', 'Lehman Brothers', 'Credit Suisse', 'Deutsche Bank', 'UBS']
      const action = actions[Math.floor(Math.random() * actions.length)]
      const firm = firms[Math.floor(Math.random() * firms.length)]
      const targetPrice = company.stockPrice * (0.8 + Math.random() * 0.5)
      
      newHeadlines.push({
        id: `analyst-${company.ticker}-${Date.now()}`,
        date: { ...currentDate },
        headline: `${firm} ${action} ${company.ticker}, PT $${targetPrice.toFixed(0)}`,
        category: 'company',
        relatedCompany: company.ticker
      })
    }
    
    // === SECTOR NEWS ===
    if (Math.random() < 0.4) {
      const sectors = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Utilities', 'Real Estate', 'Telecom', 'Defense', 'Retail', 'Transportation']
      const sector = sectors[Math.floor(Math.random() * sectors.length)]
      
      const sectorNews = [
        `${sector} sector ${Math.random() > 0.5 ? 'outperforms' : 'lags'} in ${monthName}`,
        `Rotation into ${sector} accelerates`,
        `${sector} fundamentals ${Math.random() > 0.5 ? 'strengthening' : 'weakening'}`,
        `Institutional flows ${Math.random() > 0.5 ? 'favor' : 'exit'} ${sector}`,
        `${sector} valuations ${Math.random() > 0.5 ? 'attractive' : 'stretched'}`
      ]
      
      newHeadlines.push({
        id: `sector-${sector}-${Date.now()}`,
        date: { ...currentDate },
        headline: sectorNews[Math.floor(Math.random() * sectorNews.length)],
        category: 'market'
      })
    }
    
    // === POLITICAL NEWS ===
    if (Math.random() < 0.3) {
      const politicalNews = [
        `Congress debates ${['tax reform', 'deregulation', 'trade policy', 'healthcare'][Math.floor(Math.random() * 4)]}`,
        `White House signals support for business policies`,
        `Trade tensions with ${['Japan', 'China', 'Europe', 'Mexico'][Math.floor(Math.random() * 4)]} ${Math.random() > 0.5 ? 'ease' : 'escalate'}`,
        `Antitrust scrutiny of major corporations`,
        `Budget negotiations in Washington`,
        `Defense spending bill advances`
      ]
      
      newHeadlines.push({
        id: `politics-${Date.now()}`,
        date: { ...currentDate },
        headline: politicalNews[Math.floor(Math.random() * politicalNews.length)],
        category: 'politics'
      })
    }
    
    // === AI COMPETITION NEWS ===
    if (Math.random() < 0.5) {
      const sortedPlayers = [...players].sort((a, b) => b.netWorth - a.netWorth)
      const leader = sortedPlayers[0]
      const trailer = sortedPlayers[sortedPlayers.length - 1]
      const randomPlayer = players[Math.floor(Math.random() * players.length)]
      
      const aiNews = [
        `${monthName} Leader: ${leader.name} with ${state.formatMoney(leader.netWorth)}`,
        `${randomPlayer.name} ${Math.random() > 0.5 ? 'bullish' : 'bearish'} on ${companies[Math.floor(Math.random() * companies.length)].sector}`,
        `AI Competition: ${leader.name} leads ${trailer.name} by ${state.formatMoney(leader.netWorth - trailer.netWorth)}`,
        `${randomPlayer.name} strategy: ${Math.random() > 0.5 ? 'aggressive growth' : 'defensive'}`,
        `AI traders hold ${state.formatMoney(players.reduce((sum, p) => sum + (p.netWorth - p.cash), 0))} in stocks`
      ]
      
      newHeadlines.push({
        id: `ai-${Date.now()}`,
        date: { ...currentDate },
        headline: aiNews[Math.floor(Math.random() * aiNews.length)],
        category: 'market'
      })
    }
    
    // === COMPANY-SPECIFIC NEWS ===
    if (Math.random() < 0.6) {
      const company = companies[Math.floor(Math.random() * companies.length)]
      
      const companyNews = [
        `${company.name} announces ${Math.random() > 0.5 ? 'expansion' : 'restructuring'} plans`,
        `${company.ticker} CEO ${company.ceo} addresses investor concerns`,
        `${company.name} wins major contract worth $${(Math.random() * 500 + 50).toFixed(0)}M`,
        `${company.ticker} launches new product line`,
        `${company.name} considers strategic alternatives`,
        `Institutional buying increases in ${company.ticker}`,
        `${company.ticker} added to S&P 500 index consideration`,
        `${company.name} announces dividend ${Math.random() > 0.5 ? 'increase' : 'unchanged'}`,
        `${company.ticker} buyback program expanded`,
        `${company.name} faces ${['regulatory', 'competitive', 'legal'][Math.floor(Math.random() * 3)]} challenges`
      ]
      
      newHeadlines.push({
        id: `company-${company.ticker}-${Date.now()}`,
        date: { ...currentDate },
        headline: companyNews[Math.floor(Math.random() * companyNews.length)],
        category: 'company',
        relatedCompany: company.ticker
      })
    }
    
    // === MARKET COMMENTARY ===
    if (Math.random() < 0.4) {
      const commentary = [
        `"${monthName} shows ${marketIndex > previousMarketIndex ? 'strength' : 'weakness'} in key levels" - Strategist`,
        `Volume ${Math.random() > 0.5 ? 'above' : 'below'} average for ${monthName}`,
        `Options activity signals ${Math.random() > 0.5 ? 'bullish' : 'cautious'} outlook`,
        `Market breadth ${Math.random() > 0.5 ? 'healthy' : 'narrow'} this month`,
        `VIX ${Math.random() > 0.5 ? 'elevated' : 'subdued'} in ${monthName}`
      ]
      
      newHeadlines.push({
        id: `commentary-${Date.now()}`,
        date: { ...currentDate },
        headline: commentary[Math.floor(Math.random() * commentary.length)],
        category: 'market'
      })
    }
    
    // === BREAKING / CRITICAL NEWS (random dramatic events) ===
    if (Math.random() < 0.15) {
      const company = companies[Math.floor(Math.random() * companies.length)]
      const breakingNews = [
        // Company crises
        `!!! ${company.ticker} CEO RESIGNS amid scandal !!!`,
        `!!! ${company.name} LAYOFFS: ${Math.floor(Math.random() * 10000 + 5000)} jobs cut !!!`,
        `!!! SEC investigates ${company.ticker} !!!`,
        `!!! ${company.name} faces HOSTILE TAKEOVER !!!`,
        // Company wins
        `!!! ${company.ticker} wins $${(Math.random() * 5 + 1).toFixed(1)}B contract !!!`,
        `!!! ${company.name}: Revolutionary product launch !!!`,
        `!!! ${company.ticker} SURGES on FDA approval !!!`,
        // Market events
        `!!! MARKET VOLATILITY: Circuit breakers triggered !!!`,
        // Global events
        `!!! Major bank failure rocks markets !!!`,
        `!!! Oil SURGES: Middle East tensions !!!`,
        `!!! Currency CRISIS hits markets !!!`
      ]
      
      newHeadlines.push({
        id: `breaking-${Date.now()}`,
        date: { ...currentDate },
        headline: breakingNews[Math.floor(Math.random() * breakingNews.length)],
        category: 'event',
        relatedCompany: company.ticker
      })
    }
    
    // === MAJOR M&A NEWS ===
    if (Math.random() < 0.1) {
      const company1 = companies[Math.floor(Math.random() * companies.length)]
      let company2 = companies[Math.floor(Math.random() * companies.length)]
      while (company2.id === company1.id) {
        company2 = companies[Math.floor(Math.random() * companies.length)]
      }
      
      const maNews = [
        `!!! ${company1.ticker} to ACQUIRE ${company2.ticker} for $${((company2.marketCap * (1 + Math.random() * 0.3)) / 1e9).toFixed(1)}B !!!`,
        `!!! MERGER: ${company1.ticker} + ${company2.ticker} = $${((company1.marketCap + company2.marketCap) / 1e9).toFixed(1)}B !!!`,
        `!!! ${company1.ticker} HOSTILE BID for ${company2.ticker} !!!`,
        `!!! ${company2.ticker} REJECTS ${company1.ticker} offer !!!`
      ]
      
      newHeadlines.push({
        id: `ma-${Date.now()}`,
        date: { ...currentDate },
        headline: maNews[Math.floor(Math.random() * maNews.length)],
        category: 'event',
        relatedCompany: company1.ticker
      })
    }
    
    // === BANKRUPTCY / DEFAULT NEWS ===
    if (Math.random() < 0.05) {
      const company = companies[Math.floor(Math.random() * companies.length)]
      
      const bankruptcyNews = [
        `!!! ${company.name} FILES BANKRUPTCY !!!`,
        `!!! ${company.ticker} DEFAULTS on debt !!!`,
        `!!! ${company.ticker} bonds crash to JUNK !!!`,
        `!!! ${company.name} INSOLVENCY warning !!!`
      ]
      
      newHeadlines.push({
        id: `bankruptcy-${Date.now()}`,
        date: { ...currentDate },
        headline: bankruptcyNews[Math.floor(Math.random() * bankruptcyNews.length)],
        category: 'event',
        relatedCompany: company.ticker
      })
    }
    
    if (newHeadlines.length > 0) {
      set({ newsHeadlines: [...newHeadlines, ...state.newsHeadlines].slice(0, 300) })
    }
  },
  
  addNewsHeadline: (headline) => set(state => ({ newsHeadlines: [headline, ...state.newsHeadlines].slice(0, 300) })),
  addAIThought: (thought) => set(state => ({ aiThoughts: [...state.aiThoughts, thought].slice(-500) })),
  
  updatePlayerNetWorth: (playerId) => {
    const state = get()
    const player = state.players.find(p => p.id === playerId)
    if (!player) return
    
    let stockValue = 0
    player.portfolio.stocks.forEach(holding => {
      const company = state.companies.find(c => c.id === holding.companyId)
      if (company) stockValue += company.stockPrice * holding.shares
    })
    
    set(state => ({
      players: state.players.map(p => p.id === playerId ? { ...p, netWorth: p.cash + stockValue } : p)
    }))
  },
  
  formatMoney: (amount) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`
    return `$${amount.toFixed(2)}`
  },
  
  formatDate: (date) => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    if (date.day) {
      return `${months[date.month - 1]} ${date.day}, ${date.year}`
    }
    return `${months[date.month - 1]} ${date.year}`
  }
}))
