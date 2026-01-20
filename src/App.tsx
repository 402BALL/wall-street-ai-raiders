import { useState } from 'react'
import Desktop from './components/Desktop'
import GameWindow from './components/GameWindow'
import GameModeMenu, { GameMode } from './components/game/GameModeMenu'
import { useGameStore } from './store/gameStore'
import { useSocket } from './hooks/useSocket'

function App() {
  const { gameStarted, isConnected } = useGameStore()
  const { selectGameMode } = useSocket()
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [userWantsToWatch, setUserWantsToWatch] = useState(false)

  const handleLaunchGame = () => {
    // If game is already running on server, user wants to watch
    if (isConnected && gameStarted) {
      setUserWantsToWatch(true)
      return
    }
    // Otherwise show mode selection
    setShowModeMenu(true)
  }

  const handleSelectMode = (mode: GameMode) => {
    // Tell server to start game with selected mode
    selectGameMode(mode)
    setShowModeMenu(false)
    setUserWantsToWatch(true)
  }

  const handleCloseMenu = () => {
    setShowModeMenu(false)
  }

  const handleCloseGame = () => {
    setUserWantsToWatch(false)
  }

  // Determine what to show
  const showGame = userWantsToWatch && gameStarted

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

      {showGame ? (
        <GameWindow onClose={handleCloseGame} />
      ) : showModeMenu ? (
        <GameModeMenu onSelectMode={handleSelectMode} onClose={handleCloseMenu} />
      ) : (
        <Desktop onLaunchGame={handleLaunchGame} />
      )}
    </div>
  )
}

export default App
