import { useGameStore } from '../store/gameStore'

interface PlayerData {
  name: string
  color: string
  avatar: string
  netWorth: number
}

interface GameOverviewData {
  isRunning: boolean
  turnNumber: number
  currentDate: { year: number; month: number }
  players: PlayerData[]
}

const GAME_INFO = {
  classic: { name: 'Classic Wall Street', period: '1985-2010', icon: '[$]' },
  modern: { name: 'Modern Markets', period: '2010-2026', icon: '[M]' },
  crypto: { name: 'Crypto Wars', period: '2009-2026', icon: '[₿]' }
}

export default function Leaderboard() {
  const { gamesOverview } = useGameStore()

  const formatMoney = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
    return `$${amount.toLocaleString()}`
  }

  const formatDate = (date: { year: number; month: number } | undefined) => {
    if (!date) return '...'
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[(date.month || 1) - 1]} ${date.year || '...'}`
  }

  const games = ['classic', 'modern', 'crypto'] as const

  return (
    <div 
      className="win95-window"
      style={{ width: 320, position: 'absolute', right: 20, top: 20 }}
    >
      <div className="bg-[#000080] px-2 py-1 flex items-center justify-between">
        <span className="text-white text-xs font-bold flex items-center gap-2">
          <span>🏆</span>
          AI LEADERBOARD
        </span>
      </div>
      
      <div className="bg-[#c0c0c0] p-2 max-h-[70vh] overflow-y-auto">
        {games.map((gameId) => {
          const info = GAME_INFO[gameId]
          const gameData = gamesOverview?.[gameId] as GameOverviewData | undefined
          const isLive = gameData?.isRunning ?? false
          const players = gameData?.players ?? []
          
          return (
            <div key={gameId} className="mb-3 last:mb-0">
              {/* Game Header */}
              <div 
                className="flex items-center justify-between px-2 py-1 text-white text-[10px] font-bold"
                style={{ background: '#000080' }}
              >
                <div className="flex items-center gap-1">
                  <span className="font-mono">{info.icon}</span>
                  <span>{info.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="px-1"
                    style={{ 
                      background: isLive ? '#00ff00' : '#808080',
                      color: isLive ? '#000' : '#fff'
                    }}
                  >
                    {isLive ? 'LIVE' : 'OFF'}
                  </span>
                  <span className="text-[#ffff00]">{formatDate(gameData?.currentDate)}</span>
                </div>
              </div>
              
              {/* Leaderboard Table */}
              <div 
                className="bg-black border border-[#404040]"
                style={{ borderStyle: 'inset' }}
              >
                {players.length > 0 ? (
                  players.map((player, idx) => (
                    <div 
                      key={player.name}
                      className="flex items-center justify-between px-2 py-1 border-b border-[#333] last:border-0"
                      style={{ 
                        background: idx === 0 ? 'rgba(255,215,0,0.1)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 text-center font-mono text-xs font-bold"
                          style={{ 
                            color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#808080'
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm">{player.avatar}</span>
                        <span 
                          className="text-[10px] font-bold font-mono"
                          style={{ color: player.color }}
                        >
                          {player.name.split(' ')[0]}
                        </span>
                      </div>
                      <span 
                        className="text-[10px] font-mono font-bold"
                        style={{ color: '#00ff00' }}
                      >
                        {formatMoney(player.netWorth)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-2 text-[#808080] text-[10px] text-center">
                    Loading...
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {/* Footer */}
        <div className="text-center text-[9px] text-[#606060] mt-2 pt-2 border-t border-[#808080]">
          Double-click "Wall Street AI Raiders" to watch live
        </div>
      </div>
    </div>
  )
}
