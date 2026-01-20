import { useState, useEffect } from 'react'
import Desktop from './components/Desktop'
import GameWindow from './components/GameWindow'
import GameModeMenu, { GameMode } from './components/game/GameModeMenu'
import { useGameStore } from './store/gameStore'
import { useSocket } from './hooks/useSocket'

function App() {
  const { joinGame, leaveGame } = useSocket()
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [watchingGame, setWatchingGame] = useState<GameMode | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[App] Global error:', event.error)
      setError(event.message)
    }
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  const handleLaunchGame = () => {
    setShowModeMenu(true)
  }

  const handleSelectMode = (mode: GameMode) => {
    console.log('[App] Selecting mode:', mode)
    joinGame(mode)
    setWatchingGame(mode)
    setShowModeMenu(false)
  }

  const handleCloseMenu = () => {
    setShowModeMenu(false)
  }

  const handleCloseGame = () => {
    console.log('[App] Closing game')
    leaveGame()
    setWatchingGame(null)
  }

  // Show error if any
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#008080' }}>
        <div className="win95-window p-0" style={{ width: 400 }}>
          <div className="win95-titlebar">
            <span className="text-xs font-bold">Error</span>
          </div>
          <div className="bg-[#c0c0c0] p-4 text-black">
            <p className="text-sm mb-4">{error}</p>
            <button 
              className="win95-btn px-4 py-1 text-xs"
              onClick={() => { setError(null); setWatchingGame(null); setShowModeMenu(false); }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {watchingGame ? (
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
