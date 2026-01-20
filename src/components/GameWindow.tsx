import { useState, useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import StockTicker from './game/StockTicker'
import MarketPanel from './game/MarketPanel'
import NewsPanel from './game/NewsPanel'
import PlayersPanel from './game/PlayersPanel'
import AIThinkingPanel from './game/AIThinkingPanel'
import ControlPanel from './game/ControlPanel'
import BreakingNewsPopup from './game/BreakingNewsPopup'

interface GameWindowProps {
  onClose?: () => void
}

export default function GameWindow({ onClose }: GameWindowProps) {
  const { currentEvent, pauseGame, restartGame, winner, companies, players, isConnected } = useGameStore()
  const [isMinimized, setIsMinimized] = useState(false)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [hasError, setHasError] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Connection check - show reconnecting overlay if not connected (but don't hide the game)
  const reconnectingOverlay = !isConnected ? (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="win95-window p-0" style={{ width: 280 }}>
        <div className="win95-titlebar">
          <span className="text-xs font-bold">Connection Lost</span>
        </div>
        <div className="bg-[#c0c0c0] p-4 text-center text-black">
          <div className="text-sm mb-2">Reconnecting to server...</div>
          <div className="animate-pulse text-xs">Please wait</div>
        </div>
      </div>
    </div>
  ) : null
  
  // Loading check - show loading if no data yet
  if (!companies || companies.length === 0 || !players || players.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#008080' }}>
        <div className="win95-window p-0" style={{ width: 300 }}>
          <div className="win95-titlebar">
            <span className="text-xs font-bold">Loading Game...</span>
          </div>
          <div className="bg-[#c0c0c0] p-4 text-center text-black">
            <div className="text-sm mb-2">Loading game data...</div>
            <div className="animate-pulse">Please wait</div>
            <button className="win95-btn mt-4 px-4 py-1 text-xs" onClick={onClose}>
              Back to Desktop
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowGameMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      pauseGame()
      useGameStore.setState({ gameStarted: false })
    }
  }
  
  const handleMinimize = () => setIsMinimized(true)
  const handleRestore = () => setIsMinimized(false)
  
  // Winner screen - only show if winner has valid data
  if (winner && winner.name && winner.netWorth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#008080' }}>
        <div className="win95-window p-0" style={{ width: 500 }}>
          <div className="win95-titlebar">
            <span className="text-xs font-bold">Game Over - Wall Street AI Raiders</span>
            <button className="win95-titlebar-btn close" onClick={handleClose}>×</button>
          </div>
          <div className="bg-[#c0c0c0] p-6 text-center text-black">
            <div className="text-2xl font-bold mb-4">GAME OVER</div>
            <div className="bg-black text-[#00ff00] font-mono p-4 mb-4 border-2 border-[#808080]" style={{ borderStyle: 'inset' }}>
              <div className="text-xl mb-2">WINNER:</div>
              <div className="text-3xl font-bold" style={{ color: winner.color }}>{winner.name}</div>
              <div className="text-2xl text-[#ffff00] mt-2">
                ${(winner.netWorth / 1e9).toFixed(2)} BILLION
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button className="win95-btn px-8 py-2 font-bold text-black" onClick={restartGame}>
                Play Again
              </button>
              <button className="win95-btn px-8 py-2 font-bold text-black" onClick={handleClose}>
                Exit to Desktop
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Minimized state
  if (isMinimized) {
    return (
      <div className="h-screen w-screen" style={{ background: '#008080' }}>
        <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center px-1 text-black" style={{ background: '#c0c0c0', borderTop: '2px solid #ffffff' }}>
          <button className="win95-btn h-8 px-2 flex items-center gap-1 font-bold text-xs text-black">
            <span>Start</span>
          </button>
          <div className="w-px h-6 bg-[#808080] mx-2" />
          <button 
            className="h-8 px-3 flex items-center gap-2 text-xs text-black"
            style={{ background: '#c0c0c0', boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a' }}
            onClick={handleRestore}
          >
            Wall Street AI Raiders
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden win95-window">
      {/* Windows 95 Title Bar */}
      <div className="win95-titlebar h-6 flex items-center justify-between px-1 select-none">
        <span className="text-xs font-bold">Wall Street AI Raiders - Stock Market Simulation</span>
        <div className="flex gap-px">
          <button className="win95-titlebar-btn" onClick={handleMinimize} title="Minimize">_</button>
          <button className="win95-titlebar-btn" title="Maximize">□</button>
          <button className="win95-titlebar-btn close" onClick={handleClose} title="Close">×</button>
        </div>
      </div>
      
      {/* Menu Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 flex items-center text-xs relative text-black">
        <div className="relative" ref={menuRef}>
          <button 
            className={`px-2 py-0.5 ${showGameMenu ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'}`}
            onClick={() => setShowGameMenu(!showGameMenu)}
          >
            Game
          </button>
          {showGameMenu && (
            <div className="absolute top-full left-0 bg-[#c0c0c0] border-2 border-[#ffffff] border-r-[#808080] border-b-[#808080] shadow-md z-50 min-w-40 text-black">
              <button 
                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => { restartGame(); setShowGameMenu(false); }}
              >
                <span className="w-4">↻</span> New Game
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button 
                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => { handleClose(); setShowGameMenu(false); }}
              >
                <span className="w-4">✕</span> Exit
              </button>
            </div>
          )}
        </div>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">Trade</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">Research</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">Options</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">Help</button>
      </div>
      
      {/* Stock Ticker */}
      <div className="h-6 bg-[#000080] border-b border-[#404040] overflow-hidden">
        <StockTicker />
      </div>
      
      {/* Event Banner */}
      {currentEvent && (
        <div className="h-6 bg-[#800000] border-b border-[#ff0000] flex items-center justify-center">
          <span className="text-[#ffff00] font-bold text-xs font-mono animate-pulse">
            !!! {currentEvent.name.toUpperCase()} - {currentEvent.description} !!!
          </span>
        </div>
      )}
      
      {/* Control Panel */}
      <div className="h-10">
        <ControlPanel />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-[#c0c0c0]">
        {/* Left Panel - Players */}
        <div className="w-56 border-r-2 border-[#808080]">
          <PlayersPanel />
        </div>
        
        {/* Center Panel - Market Data */}
        <div className="flex-1 flex flex-col overflow-hidden border-r-2 border-[#808080]">
          <MarketPanel />
        </div>
        
        {/* Right Panel - News & AI Thinking */}
        <div className="w-72 flex flex-col">
          <div className="h-2/5 border-b-2 border-[#808080]">
            <NewsPanel />
          </div>
          <div className="flex-1">
            <AIThinkingPanel />
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-5 bg-[#c0c0c0] border-t-2 border-[#808080] flex items-center px-1 text-[10px] font-mono text-black">
        <StatusBar />
      </div>
      
      {/* Breaking News Popup */}
      <BreakingNewsPopup />
      
      {/* Reconnecting Overlay */}
      {reconnectingOverlay}
    </div>
  )
}

function StatusBar() {
  const { currentDate, turnNumber, totalTurns, players, formatDate, formatMoney, marketIndex, previousMarketIndex } = useGameStore()
  
  const marketChange = ((marketIndex - previousMarketIndex) / previousMarketIndex * 100).toFixed(2)
  const isUp = Number(marketChange) >= 0
  const leader = [...players].sort((a, b) => b.netWorth - a.netWorth)[0]
  
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="border-r border-[#808080] pr-2">
        <span className="font-bold">{formatDate(currentDate)}</span>
      </div>
      <div className="border-r border-[#808080] pr-2">
        Turn: {turnNumber}/{totalTurns}
      </div>
      <div className={`border-r border-[#808080] pr-2 ${isUp ? 'text-[#008000]' : 'text-[#ff0000]'}`}>
        DOW: {marketIndex.toFixed(0)} ({isUp ? '+' : ''}{marketChange}%)
      </div>
      <div className="flex-1" />
      {leader && (
        <div>
          Leader: <span style={{ color: leader.color }} className="font-bold">{leader.name}</span> ({formatMoney(leader.netWorth)})
        </div>
      )}
      <div className="border-l border-[#808080] pl-2">
        Press F1 for Help
      </div>
    </div>
  )
}
