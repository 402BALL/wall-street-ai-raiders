import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useGameStore } from '../../store/gameStore'
import { AIPlayer } from '../../types'
import AIDetailWindow from './AIDetailWindow'

export default function PlayersPanel() {
  const { players, selectPlayer, selectedPlayer, formatMoney } = useGameStore()
  const [detailPlayer, setDetailPlayer] = useState<AIPlayer | null>(null)
  
  const sortedPlayers = [...players].sort((a, b) => b.netWorth - a.netWorth)
  
  const getRankSymbol = (index: number) => {
    if (index === 0) return '[1st]'
    if (index === 1) return '[2nd]'
    if (index === 2) return '[3rd]'
    return `[${index + 1}th]`
  }
  
  const getProviderSymbol = (provider: string) => {
    switch(provider) {
      case 'claude': return '[CLO]'
      case 'gpt': return '[GPT]'
      case 'grok': return '[GRK]'
      case 'deepseek': return '[DSK]'
      default: return '[AI]'
    }
  }
  
  const handlePlayerClick = (player: AIPlayer) => {
    setDetailPlayer(player)
  }
  
  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="px-2 py-1 bg-[#000080] text-white font-bold text-xs border-b-2 border-[#808080]">
        <span className="tracking-wider">══════ COMPETITORS ══════</span>
      </div>
      
      {/* Players List */}
      <div className="flex-1 overflow-auto p-1 space-y-1 font-mono text-xs">
        {sortedPlayers.map((player, index) => {
          const startValue = 1_000_000_000
          const change = ((player.netWorth - startValue) / startValue * 100)
          const isSelected = selectedPlayer?.id === player.id
          
          return (
            <div 
              key={player.id} 
              className={`p-2 border cursor-pointer ${
                isSelected 
                  ? 'border-yellow-500 bg-[#000044]' 
                  : 'border-[#404040] hover:border-[#606060] hover:bg-[#101010]'
              }`}
              onClick={() => handlePlayerClick(player)}
              title="Click to view portfolio details"
            >
              {/* Rank and Name */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`${index === 0 ? 'text-yellow-400' : 'text-[#808080]'}`}>
                  {getRankSymbol(index)}
                </span>
                <span className="text-[#00ffff]">{getProviderSymbol(player.provider)}</span>
                <span style={{ color: player.color }} className="font-bold">
                  {player.name}
                </span>
              </div>
              
              {/* Stats */}
              <div className="space-y-0.5 pl-2 border-l border-[#404040]">
                <div className="flex justify-between">
                  <span className="text-[#808080]">Net Worth:</span>
                  <span className="text-yellow-400">{formatMoney(player.netWorth)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#808080]">P/L:</span>
                  <span className={change >= 0 ? 'text-[#00ff00]' : 'text-[#ff0000]'}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#808080]">Cash:</span>
                  <span className="text-[#00ffff]">{formatMoney(player.cash)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#808080]">Holdings:</span>
                  <span className="text-white">{player.portfolio.stocks.length} pos</span>
                </div>
              </div>
              
              {/* Activity */}
              {player.isActive && (
                <div className="mt-1 text-yellow-400 text-[10px] border-t border-[#404040] pt-1">
                  &gt;&gt; PROCESSING...
                </div>
              )}
              
              {player.lastAction && (
                <div className="mt-1 text-[#606060] text-[10px] truncate">
                  &gt; {player.lastAction}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Footer */}
      <div className="px-2 py-1 bg-[#000080] border-t-2 border-[#808080] text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-[#808080]">TOTAL:</span>
          <span className="text-yellow-400">{formatMoney(players.reduce((sum, p) => sum + p.netWorth, 0))}</span>
        </div>
      </div>
      
      {/* AI Detail Window Portal */}
      {detailPlayer && createPortal(
        <AIDetailWindow 
          player={detailPlayer} 
          onClose={() => setDetailPlayer(null)} 
        />,
        document.body
      )}
    </div>
  )
}
