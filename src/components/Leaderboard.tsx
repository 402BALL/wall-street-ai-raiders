import { useGameStore } from '../store/gameStore'

interface PlayerData {
  name: string
  color: string
  avatar: string
  netWorth: number
  wins?: number
}

interface GameOverviewData {
  isRunning: boolean
  turnNumber: number
  currentDate: { year: number; month: number }
  players: PlayerData[]
}

// AI info with display names
const AI_INFO: Record<string, { name: string; color: string; avatar: string }> = {
  'CLAUDE 4 OPUS': { name: 'CLAUDE 4 OPUS', color: '#ff6b35', avatar: '🟠' },
  'GPT-5 TURBO': { name: 'GPT-5 TURBO', color: '#10a37f', avatar: '🟢' },
  'GROK 4': { name: 'GROK 4', color: '#1da1f2', avatar: '⚪' },
  'DEEPSEEK V3': { name: 'DEEPSEEK V3', color: '#800080', avatar: '🟣' }
}

export default function Leaderboard() {
  const { gamesOverview } = useGameStore()

  // Calculate total wins for each AI across all games
  const calculateTotalWins = () => {
    const wins: Record<string, number> = {
      'CLAUDE 4 OPUS': 0,
      'GPT-5 TURBO': 0,
      'GROK 4': 0,
      'DEEPSEEK V3': 0
    }
    
    if (!gamesOverview) return wins
    
    // Get wins from each game mode
    const modes = ['classic', 'modern', 'crypto'] as const
    for (const mode of modes) {
      const game = gamesOverview[mode] as GameOverviewData | undefined
      if (game?.players) {
        for (const player of game.players) {
          if (player.wins && wins[player.name] !== undefined) {
            // Take the max wins count (they should be the same across games)
            wins[player.name] = Math.max(wins[player.name], player.wins)
          }
        }
      }
    }
    
    return wins
  }

  const totalWins = calculateTotalWins()
  
  // Sort AIs by wins
  const sortedAIs = Object.entries(AI_INFO)
    .map(([key, info]) => ({
      ...info,
      key,
      wins: totalWins[key] || 0
    }))
    .sort((a, b) => b.wins - a.wins)

  // Get total games played (approximate based on any completed games)
  const totalGames = Object.values(totalWins).reduce((a, b) => a + b, 0)

  return (
    <div 
      className="win95-window"
      style={{ width: 280, position: 'absolute', right: 20, top: 20 }}
    >
      <div className="bg-[#000080] px-2 py-1 flex items-center justify-between">
        <span className="text-white text-xs font-bold flex items-center gap-2">
          <span>🏆</span>
          AI LEADERBOARD
        </span>
        <span className="text-[#ffff00] text-[10px]">
          {totalGames} games
        </span>
      </div>
      
      <div className="bg-[#c0c0c0] p-2">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1 bg-[#000080] text-white text-[10px] font-bold mb-1">
          <span>RANK</span>
          <span>AI PLAYER</span>
          <span>WINS</span>
        </div>
        
        {/* Rankings */}
        <div 
          className="bg-black border border-[#404040]"
          style={{ borderStyle: 'inset' }}
        >
          {sortedAIs.map((ai, idx) => (
            <div 
              key={ai.key}
              className="flex items-center justify-between px-3 py-2 border-b border-[#333] last:border-0"
              style={{ 
                background: idx === 0 && ai.wins > 0 ? 'rgba(255,215,0,0.15)' : 'transparent'
              }}
            >
              {/* Rank */}
              <div className="flex items-center gap-2 w-12">
                <span 
                  className="text-lg font-bold"
                  style={{ 
                    color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#808080'
                  }}
                >
                  {idx === 0 && ai.wins > 0 ? '👑' : `#${idx + 1}`}
                </span>
              </div>
              
              {/* AI Info */}
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xl">{ai.avatar}</span>
                <span 
                  className="text-sm font-bold font-mono"
                  style={{ color: ai.color }}
                >
                  {ai.name.split(' ')[0]}
                </span>
              </div>
              
              {/* Wins */}
              <div className="flex items-center gap-1">
                <span 
                  className="text-xl font-bold font-mono"
                  style={{ color: ai.wins > 0 ? '#ffd700' : '#808080' }}
                >
                  {ai.wins}
                </span>
                <span className="text-[#808080] text-sm">🏆</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Games Status */}
        <div className="mt-2 pt-2 border-t border-[#808080]">
          <div className="text-[10px] text-[#404040] flex justify-between">
            <span>Live Games:</span>
            <div className="flex gap-2">
              {['classic', 'modern', 'crypto'].map(mode => {
                const game = gamesOverview?.[mode as keyof typeof gamesOverview] as GameOverviewData | undefined
                const isLive = game?.isRunning
                return (
                  <span 
                    key={mode}
                    className="px-1"
                    style={{ 
                      background: isLive ? '#00ff00' : '#808080',
                      color: isLive ? '#000' : '#fff',
                      fontSize: '9px'
                    }}
                  >
                    {mode === 'classic' ? '[$]' : mode === 'modern' ? '[M]' : '[₿]'}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-[9px] text-[#606060] mt-2">
          Double-click "Wall Street AI Raiders" to watch
        </div>
      </div>
    </div>
  )
}
