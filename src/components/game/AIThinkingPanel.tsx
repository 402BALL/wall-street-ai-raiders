import { useGameStore } from '../../store/gameStore'

export default function AIThinkingPanel() {
  const { players, aiThoughts, selectedPlayer } = useGameStore()
  
  const displayedThoughts = selectedPlayer 
    ? aiThoughts.filter(t => t.playerId === selectedPlayer.id) 
    : aiThoughts
  
  const activePlayer = players.find(p => p.isActive)
  
  const getProviderLabel = (provider: string) => {
    switch(provider) {
      case 'claude': return 'CLO'
      case 'gpt': return 'GPT'
      case 'grok': return 'GRK'
      case 'deepseek': return 'DSK'
      default: return 'AI'
    }
  }
  
  return (
    <div className="h-full flex flex-col bg-black font-mono text-xs">
      {/* Header */}
      <div className="bg-[#008000] text-white px-2 py-1 border-b border-[#808080] flex items-center justify-between">
        <span className="font-bold tracking-wider">══ AI THINKING ══</span>
        {activePlayer && (
          <span className="animate-pulse" style={{ color: activePlayer.color }}>
            [{getProviderLabel(activePlayer.provider)}] ACTIVE
          </span>
        )}
      </div>
      
      {/* Player Tabs */}
      <div className="bg-[#c0c0c0] flex border-b border-[#808080]">
        <button
          className={`px-2 py-0.5 text-[10px] border-r border-[#808080] ${
            !selectedPlayer ? 'bg-white' : 'hover:bg-[#d4d4d4]'
          }`}
          onClick={() => useGameStore.getState().selectPlayer(null)}
        >
          ALL
        </button>
        {players.map(player => (
          <button
            key={player.id}
            className={`px-2 py-0.5 text-[10px] border-r border-[#808080] ${
              selectedPlayer?.id === player.id ? 'bg-white' : 'hover:bg-[#d4d4d4]'
            }`}
            style={{ color: selectedPlayer?.id === player.id ? player.color : undefined }}
            onClick={() => useGameStore.getState().selectPlayer(
              selectedPlayer?.id === player.id ? null : player
            )}
          >
            {getProviderLabel(player.provider)}
          </button>
        ))}
      </div>
      
      {/* Thinking Content */}
      <div className="flex-1 overflow-auto p-2 space-y-3">
        {players.map(player => {
          if (selectedPlayer && selectedPlayer.id !== player.id) return null
          
          return (
            <div key={player.id} className="border border-[#404040] p-2">
              {/* Player Header */}
              <div 
                className="flex items-center gap-2 mb-2 pb-1 border-b"
                style={{ borderColor: player.color + '60' }}
              >
                <span className="text-[#00ffff]">[{getProviderLabel(player.provider)}]</span>
                <span className="font-bold" style={{ color: player.color }}>{player.name}</span>
                {player.isActive && (
                  <span className="text-[#ffff00] ml-auto animate-pulse">{'>> PROCESSING'}</span>
                )}
              </div>
              
              {/* Thinking Text */}
              <div className="space-y-1 pl-2 border-l border-[#404040]">
                {player.thinking ? (
                  <div style={{ color: player.color }}>
                    {player.thinking}
                    <span className="cursor-blink">_</span>
                  </div>
                ) : (
                  <span className="text-[#606060]">Awaiting turn...</span>
                )}
              </div>
              
              {/* Strategy Info */}
              <div className="mt-2 pt-1 border-t border-[#404040] text-[10px]">
                <div className="text-[#808080]">Strategy: {getStrategyLabel(player.provider)}</div>
              </div>
              
              {/* Last Action */}
              {player.lastAction && (
                <div className="mt-1 text-[10px] text-[#606060]">
                  {'>'} Last: {player.lastAction}
                </div>
              )}
            </div>
          )
        })}
        
        {/* Thought History */}
        {displayedThoughts.length > 0 && (
          <div className="border-t border-[#404040] pt-2">
            <div className="text-[#808080] mb-1">─── THOUGHT LOG ───</div>
            {displayedThoughts.slice(-10).reverse().map((thought, index) => {
              const player = players.find(p => p.id === thought.playerId)
              if (!player) return null
              
              return (
                <div key={index} className="text-[10px] py-0.5 border-l border-[#404040] pl-2 mb-1">
                  <span className="text-[#00ffff]">[{getProviderLabel(player.provider)}]</span>
                  <span className="text-[#606060]"> {thought.phase}: </span>
                  <span className="text-[#808080]">{thought.content}</span>
                </div>
              )
            })}
          </div>
        )}
        
        {displayedThoughts.length === 0 && !players.some(p => p.thinking) && (
          <div className="text-[#606060] text-center py-4">
            <div className="mb-1">[AI]</div>
            <div>AI agents will share their</div>
            <div>reasoning here during gameplay</div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-[#c0c0c0] border-t border-[#808080] px-2 py-0.5 text-[10px] flex justify-between">
        <span>Thoughts: {aiThoughts.length}</span>
        <span className={players.filter(p => p.isActive).length > 0 ? 'text-[#008000]' : 'text-[#808080]'}>
          {players.filter(p => p.isActive).length > 0 ? '[LIVE]' : '[IDLE]'}
        </span>
      </div>
    </div>
  )
}

function getStrategyLabel(provider: string): string {
  switch(provider) {
    case 'claude': return 'Conservative Value'
    case 'gpt': return 'Balanced Growth'
    case 'grok': return 'Aggressive Risk'
    case 'deepseek': return 'Momentum Trading'
    default: return 'Unknown'
  }
}
