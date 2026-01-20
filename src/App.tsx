import { useState, useEffect } from 'react'
import Desktop from './components/Desktop'
import GameWindow from './components/GameWindow'
import GameModeMenu, { GameMode } from './components/game/GameModeMenu'
import { useGameStore } from './store/gameStore'
import { useSocket } from './hooks/useSocket'

function App() {
  const { gameStarted, isConnected } = useGameStore()
  const { selectGameMode } = useSocket()
  const [showModeMenu, setShowModeMenu] = useState(false)

  const handleLaunchGame = () => {
    // If already connected and game is running, just show the game
    if (isConnected && gameStarted) {
      return
    }
    setShowModeMenu(true)
  }

  const handleSelectMode = (mode: GameMode) => {
    // Tell server to start game with selected mode
    selectGameMode(mode)
    setShowModeMenu(false)
  }

  const handleCloseMenu = () => {
    setShowModeMenu(false)
  }

  // Auto-show game window when connected and game is running
  useEffect(() => {
    if (isConnected && gameStarted) {
      setShowModeMenu(false)
    }
  }, [isConnected, gameStarted])

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Connection Status Indicator */}
      <div 
        className="fixed top-2 right-2 z-50 px-2 py-1 text-[10px] font-mono"
        style={{ 
          background: isConnected ? '#008000' : '#800000',
          color: 'white',
          border: '1px solid #000'
        }}
      >
        {isConnected ? '● LIVE' : '○ OFFLINE'}
      </div>

      {gameStarted ? (
        <GameWindow />
      ) : showModeMenu ? (
        <GameModeMenu onSelectMode={handleSelectMode} onClose={handleCloseMenu} />
      ) : (
        <Desktop onLaunchGame={handleLaunchGame} />
      )}
    </div>
  )
}

export default App
