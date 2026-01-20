import { useState } from 'react'
import Desktop from './components/Desktop'
import GameWindow from './components/GameWindow'
import GameModeMenu, { GameMode } from './components/game/GameModeMenu'
import { useGameStore } from './store/gameStore'
import { useSocket } from './hooks/useSocket'

function App() {
  const { gameStarted } = useGameStore()
  const { joinGame, leaveGame } = useSocket()
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [watchingGame, setWatchingGame] = useState<GameMode | null>(null)

  const handleLaunchGame = () => {
    // Show mode selection to pick which game to watch
    setShowModeMenu(true)
  }

  const handleSelectMode = (mode: GameMode) => {
    // Join the selected game room
    joinGame(mode)
    setWatchingGame(mode)
    setShowModeMenu(false)
  }

  const handleCloseMenu = () => {
    setShowModeMenu(false)
  }

  const handleCloseGame = () => {
    leaveGame()
    setWatchingGame(null)
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
