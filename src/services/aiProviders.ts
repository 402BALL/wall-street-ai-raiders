// AI Provider API Integration
// Supports: Claude, GPT, Grok, DeepSeek

// ⚠️ SET TO FALSE TO USE REAL API (costs money!)
// SET TO TRUE TO USE FREE SIMULATION
const USE_SIMULATION_ONLY = true

export interface AIResponse {
  thinking: string
  action: string
  reasoning: string
}

export interface MarketContext {
  currentDate: { year: number; month: number }
  marketIndex: number
  marketChange: number
  cash: number
  netWorth: number
  portfolio: { ticker: string; shares: number; avgPrice: number; currentPrice: number }[]
  topGainers: { ticker: string; price: number; change: number }[]
  topLosers: { ticker: string; price: number; change: number }[]
  recentNews: string[]
  currentEvent: string | null
}

// API Keys - loaded from environment or set here for production
// For simulation mode, these are not used
const API_KEYS = {
  grok: import.meta.env.VITE_GROK_API_KEY || '',
  claude: import.meta.env.VITE_CLAUDE_API_KEY || '',
  deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  openai: import.meta.env.VITE_OPENAI_API_KEY || ''
}

function buildPrompt(playerName: string, personality: string, context: MarketContext): string {
  const portfolioStr = context.portfolio.length > 0 
    ? context.portfolio.map(p => `${p.ticker}: ${p.shares} shares @ $${p.avgPrice.toFixed(2)} (now $${p.currentPrice.toFixed(2)})`).join('\n')
    : 'Empty portfolio'
  
  return `You are ${playerName}, an AI trader in a stock market simulation game.

PERSONALITY: ${personality}

CURRENT DATE: ${context.currentDate.month}/${context.currentDate.year}
MARKET INDEX: ${context.marketIndex.toFixed(2)} (${context.marketChange >= 0 ? '+' : ''}${context.marketChange.toFixed(2)}%)

YOUR STATUS:
- Cash: $${context.cash.toLocaleString()}
- Net Worth: $${context.netWorth.toLocaleString()}
- Portfolio:
${portfolioStr}

TOP GAINERS TODAY:
${context.topGainers.map(s => `${s.ticker}: $${s.price.toFixed(2)} (+${s.change.toFixed(1)}%)`).join('\n')}

TOP LOSERS TODAY:
${context.topLosers.map(s => `${s.ticker}: $${s.price.toFixed(2)} (${s.change.toFixed(1)}%)`).join('\n')}

RECENT NEWS:
${context.recentNews.join('\n')}

${context.currentEvent ? `MAJOR EVENT: ${context.currentEvent}` : ''}

Based on your personality and the market conditions, decide your next move.
Respond in this EXACT JSON format:
{
  "thinking": "Your internal analysis (2-3 sentences)",
  "action": "BUY [TICKER] [AMOUNT]" or "SELL [TICKER] [AMOUNT]" or "HOLD",
  "reasoning": "Brief public explanation (1 sentence)"
}

Only respond with valid JSON, nothing else.`
}

// Simulated AI response when API is unavailable (CORS issues in browser)
function simulateAIResponse(playerName: string, personality: string, context: MarketContext): AIResponse {
  const { topGainers, topLosers, cash, portfolio } = context
  
  // Different strategies based on personality
  const isConservative = personality.includes('Conservative') || personality.includes('value')
  const isAggressive = personality.includes('Aggressive') || personality.includes('risk')
  const isTechnical = personality.includes('Technical') || personality.includes('momentum')
  
  let action = 'HOLD'
  let thinking = ''
  let reasoning = ''
  
  const buyChance = isAggressive ? 0.5 : isConservative ? 0.25 : 0.35
  const sellChance = isAggressive ? 0.3 : isConservative ? 0.15 : 0.2
  
  const rand = Math.random()
  
  if (rand < buyChance && topGainers.length > 0 && cash > 10000) {
    // Pick a stock to buy
    const target = isTechnical 
      ? topGainers[0] // Momentum: buy winners
      : isConservative 
        ? topLosers[Math.floor(Math.random() * topLosers.length)] // Value: buy dips
        : topGainers[Math.floor(Math.random() * topGainers.length)]
    
    const maxShares = Math.floor(cash * 0.1 / target.price)
    const shares = Math.max(100, Math.floor(maxShares * (0.3 + Math.random() * 0.5)))
    
    action = `BUY ${target.ticker} ${shares}`
    thinking = `Analyzing ${target.ticker} at $${target.price.toFixed(2)}. ${target.change > 0 ? 'Strong momentum' : 'Potential value play'} detected.`
    reasoning = `${target.change > 0 ? 'Following uptrend' : 'Buying the dip'} on ${target.ticker}`
  } else if (rand < buyChance + sellChance && portfolio.length > 0) {
    // Pick a stock to sell
    const holding = portfolio[Math.floor(Math.random() * portfolio.length)]
    const profitPct = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
    
    if (profitPct > 10 || (isAggressive && Math.random() > 0.5)) {
      const sharesToSell = Math.floor(holding.shares * (0.3 + Math.random() * 0.4))
      action = `SELL ${holding.ticker} ${sharesToSell}`
      thinking = `${holding.ticker} position review: ${profitPct > 0 ? 'profits of' : 'loss of'} ${profitPct.toFixed(1)}%. Time to ${profitPct > 0 ? 'take profits' : 'cut losses'}.`
      reasoning = profitPct > 0 ? 'Taking profits' : 'Rebalancing portfolio'
    }
  }
  
  if (action === 'HOLD') {
    thinking = `Market conditions ${context.marketChange > 0 ? 'positive' : 'uncertain'}. Waiting for better entry points.`
    reasoning = 'No compelling opportunities at current prices'
  }
  
  return { thinking, action, reasoning }
}

// Claude API (Anthropic)
async function callClaude(prompt: string, context: MarketContext): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEYS.claude,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }
    
    const data = await response.json()
    const text = data.content[0].text
    return JSON.parse(text)
  } catch (error) {
    console.error('Claude API error (using simulation):', error)
    return simulateAIResponse('Claude', AI_PERSONALITIES.claude, context)
  }
}

// GPT API (OpenAI)
async function callGPT(prompt: string, context: MarketContext): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.openai}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    const text = data.choices[0].message.content
    return JSON.parse(text)
  } catch (error) {
    console.error('GPT API error (using simulation):', error)
    return simulateAIResponse('GPT', AI_PERSONALITIES.gpt, context)
  }
}

// Grok API (xAI)
async function callGrok(prompt: string, context: MarketContext): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.grok}`
      },
      body: JSON.stringify({
        model: 'grok-2-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.8
      })
    })
    
    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`)
    }
    
    const data = await response.json()
    const text = data.choices[0].message.content
    return JSON.parse(text)
  } catch (error) {
    console.error('Grok API error (using simulation):', error)
    return simulateAIResponse('Grok', AI_PERSONALITIES.grok, context)
  }
}

// DeepSeek API
async function callDeepSeek(prompt: string, context: MarketContext): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.deepseek}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }
    
    const data = await response.json()
    const text = data.choices[0].message.content
    return JSON.parse(text)
  } catch (error) {
    console.error('DeepSeek API error (using simulation):', error)
    return simulateAIResponse('DeepSeek', AI_PERSONALITIES.deepseek, context)
  }
}

// Main function to call the appropriate AI
export async function getAIDecision(
  provider: 'claude' | 'gpt' | 'grok' | 'deepseek',
  playerName: string,
  personality: string,
  context: MarketContext
): Promise<AIResponse> {
  // Log for debugging
  console.log(`[AI] ${playerName} (${provider}) making decision...`)
  
  // Use simulation only mode (free, no API costs)
  if (USE_SIMULATION_ONLY) {
    console.log(`[AI] 🎮 SIMULATION MODE - no API costs`)
    return simulateAIResponse(playerName, personality, context)
  }
  
  const prompt = buildPrompt(playerName, personality, context)
  
  switch (provider) {
    case 'claude':
      return callClaude(prompt, context)
    case 'gpt':
      return callGPT(prompt, context)
    case 'grok':
      return callGrok(prompt, context)
    case 'deepseek':
      return callDeepSeek(prompt, context)
    default:
      console.log(`[AI] Using simulation for ${playerName}`)
      return simulateAIResponse(playerName, personality, context)
  }
}

// Player personality descriptions
export const AI_PERSONALITIES: Record<string, string> = {
  claude: 'Conservative value investor. Focus on fundamentals, P/E ratios, and long-term growth. Avoid speculation. Prefer dividend stocks and stable companies. Risk-averse approach.',
  gpt: 'Balanced growth strategist. Mix of value and growth stocks. Diversify across sectors. Follow market trends but avoid extremes. Medium risk tolerance.',
  grok: 'Aggressive risk-taker. Love volatile stocks and momentum plays. Not afraid to make big bets. Contrarian at times. High risk, high reward mentality. Sometimes make bold, unconventional moves.',
  deepseek: 'Technical momentum trader. Focus on price patterns and market sentiment. Quick to enter and exit positions. Data-driven decisions. Follow the trend until it breaks.'
}

