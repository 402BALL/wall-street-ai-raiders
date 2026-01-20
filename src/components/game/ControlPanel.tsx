import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

// Fixed real-time interval: 1 month = 5 seconds (for testing, change to 30000 for production)
const MONTH_INTERVAL_MS = 5000

export default function ControlPanel() {
  const currentDate = useGameStore(state => state.currentDate)
  const interestRate = useGameStore(state => state.interestRate)
  const inflation = useGameStore(state => state.inflation)
  const gdpGrowth = useGameStore(state => state.gdpGrowth)
  const unemployment = useGameStore(state => state.unemployment)
  const formatDate = useGameStore(state => state.formatDate)
  const turnNumber = useGameStore(state => state.turnNumber)
  const totalTurns = useGameStore(state => state.totalTurns)
  const gameStarted = useGameStore(state => state.gameStarted)
  
  const intervalRef = useRef<number | null>(null)
  
  // Auto-advance turns in real-time - always running when game started
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    if (gameStarted) {
      // Get advanceTurn from store inside interval to avoid stale closure
      intervalRef.current = window.setInterval(() => {
        useGameStore.getState().advanceTurn()
      }, MONTH_INTERVAL_MS)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [gameStarted])
  
  return (
    <div className="h-full bg-[#c0c0c0] flex items-center justify-between px-2 border-b-2 border-[#808080] text-black">
      {/* Left - Date and Economic Indicators */}
      <div className="flex items-center gap-3">
        {/* Date Display - DOS style */}
        <div className="bg-black px-3 py-1 border-2 border-[#808080]" style={{ borderStyle: 'inset' }}>
          <span className="font-mono text-[#00ff00] text-sm font-bold">
            {formatDate(currentDate)}
          </span>
        </div>
        
        {/* Market Status */}
        <div className="px-2 py-1 text-xs font-bold bg-[#008000] text-white">
          MARKET OPEN
        </div>
        
        {/* Turn Counter */}
        <div className="bg-black px-2 py-1 border-2 border-[#808080]" style={{ borderStyle: 'inset' }}>
          <span className="font-mono text-[#ffff00] text-[10px]">
            Month {turnNumber}/{totalTurns}
          </span>
        </div>
        
        {/* Economic Indicators */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-[#000080] font-bold">FED:</span>
            <span className="bg-white px-1 border border-[#808080] text-black" style={{ borderStyle: 'inset' }}>
              {interestRate.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#000080] font-bold">CPI:</span>
            <span className="bg-white px-1 border border-[#808080] text-black" style={{ borderStyle: 'inset' }}>
              {inflation.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#000080] font-bold">GDP:</span>
            <span className={`bg-white px-1 border border-[#808080] ${gdpGrowth >= 0 ? 'text-[#006600]' : 'text-[#cc0000]'}`} style={{ borderStyle: 'inset' }}>
              {gdpGrowth >= 0 ? '+' : ''}{gdpGrowth.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#000080] font-bold">UNEMP:</span>
            <span className="bg-white px-1 border border-[#808080] text-black" style={{ borderStyle: 'inset' }}>
              {unemployment.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Center - Real-Time Info */}
      <div className="flex items-center gap-3">
        <div className="bg-[#000080] text-white px-2 py-1 text-[10px] font-mono">
          REAL-TIME SIMULATION
        </div>
        <div className="text-[10px] font-mono text-[#606060]">
          1 month = 30 sec | ~2.5h game
        </div>
      </div>
      
      {/* Right - Live Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-[#cc0000] text-white text-xs font-bold">
          <span className="animate-pulse">●</span>
          LIVE
        </div>
      </div>
    </div>
  )
}
