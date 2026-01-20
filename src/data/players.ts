import { AIPlayer, AIProvider } from '../types'

// Display names (fancy marketing names for UI)
// Actual API models used: claude-3.5-sonnet, gpt-4o, grok-2, deepseek-chat
export const AI_CONFIGS: Record<AIProvider, { name: string; avatar: string; color: string; model: string }> = {
  claude: { name: 'CLAUDE 4 OPUS', avatar: '🟠', color: '#ff6b35', model: 'claude-3.5-sonnet' },
  gpt: { name: 'GPT-5 TURBO', avatar: '🟢', color: '#10a37f', model: 'gpt-4o' },
  grok: { name: 'GROK 4', avatar: '⚫', color: '#1da1f2', model: 'grok-2' },
  deepseek: { name: 'DEEPSEEK V3', avatar: '🔵', color: '#0066ff', model: 'deepseek-chat' }
}

let playerId = 0

export function createAIPlayers(): AIPlayer[] {
  const providers: AIProvider[] = ['claude', 'gpt', 'grok', 'deepseek']
  
  return providers.map(provider => {
    const config = AI_CONFIGS[provider]
    playerId++
    
    return {
      id: `player-${playerId}`,
      name: config.name,
      provider,
      avatar: config.avatar,
      color: config.color,
      cash: 1_000_000_000,
      portfolio: { stocks: [], bonds: [], options: [] },
      netWorth: 1_000_000_000,
      thinking: '',
      lastAction: 'Game started - Analyzing market...',
      isActive: false
    }
  })
}

