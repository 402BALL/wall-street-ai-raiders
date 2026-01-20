import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import { GameEngine, GameMode } from './gameEngine'

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST']
  },
  // Increase timeouts to prevent disconnects
  pingTimeout: 60000,      // 60 seconds before considering connection dead
  pingInterval: 25000,     // Ping every 25 seconds
  connectTimeout: 45000,   // Connection timeout
  transports: ['websocket', 'polling'],
  allowUpgrades: true
})

const PORT = process.env.PORT || 3001

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')))

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API endpoint to get all games state
app.get('/api/games', (req, res) => {
  res.json({
    classic: gameEngines.classic.getState(),
    modern: gameEngines.modern.getState(),
    crypto: gameEngines.crypto.getState()
  })
})

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Create 3 Game Engines - one for each mode
const gameEngines: Record<GameMode, GameEngine> = {
  classic: new GameEngine(),
  modern: new GameEngine(),
  crypto: new GameEngine()
}

// Track which game each socket is watching
const socketGameMap = new Map<string, GameMode>()

// Track AI wins across all games
const aiWins: Record<string, number> = {
  'CLAUDE 4 OPUS': 0,
  'GPT-5 TURBO': 0,
  'GROK 4': 0,
  'DEEPSEEK V3': 0
}

// Setup event listeners for each game engine
const setupGameEvents = (mode: GameMode, engine: GameEngine) => {
  engine.on('stateUpdate', (state) => {
    // Send to all sockets watching this game
    io.to(`game-${mode}`).emit('gameState', { mode, state })
  })

  engine.on('newsUpdate', (news) => {
    io.to(`game-${mode}`).emit('news', { mode, news })
  })

  engine.on('breakingNews', (news) => {
    io.to(`game-${mode}`).emit('breakingNews', { mode, news })
  })

  engine.on('tradeExecuted', (trade) => {
    io.to(`game-${mode}`).emit('trade', { mode, trade })
  })

  engine.on('gameEnded', (result) => {
    // Track the win
    if (result && result.winner && result.winner.name) {
      const winnerName = result.winner.name
      if (aiWins[winnerName] !== undefined) {
        aiWins[winnerName]++
        console.log(`[Server] ${winnerName} wins ${mode}! Total wins: ${aiWins[winnerName]}`)
      }
    }
    io.to(`game-${mode}`).emit('gameEnded', { mode, result })
  })
}

// Setup events for all games
setupGameEvents('classic', gameEngines.classic)
setupGameEvents('modern', gameEngines.modern)
setupGameEvents('crypto', gameEngines.crypto)

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`)
  
  // Send overview of all games with leaderboard data
  const getGameOverview = (engine: GameEngine) => {
    const state = engine.getState()
    const sortedPlayers = [...state.players].sort((a, b) => b.netWorth - a.netWorth)
    return {
      isRunning: engine.isRunning(),
      turnNumber: state.turnNumber,
      currentDate: state.currentDate,
      players: sortedPlayers.map(p => ({
        name: p.name,
        color: p.color,
        avatar: p.avatar,
        netWorth: p.netWorth,
        wins: aiWins[p.name] || 0
      }))
    }
  }
  
  socket.emit('gamesOverview', {
    classic: getGameOverview(gameEngines.classic),
    modern: getGameOverview(gameEngines.modern),
    crypto: getGameOverview(gameEngines.crypto)
  })
  
  // Handle joining a specific game room
  socket.on('joinGame', (mode: GameMode) => {
    // Leave previous game room if any
    const previousGame = socketGameMap.get(socket.id)
    if (previousGame) {
      socket.leave(`game-${previousGame}`)
    }
    
    // Join new game room
    socket.join(`game-${mode}`)
    socketGameMap.set(socket.id, mode)
    
    console.log(`[Socket] ${socket.id} joined game: ${mode}`)
    
    // Send current state of that game
    socket.emit('gameState', { mode, state: gameEngines[mode].getState() })
  })
  
  // Handle leaving game (back to desktop)
  socket.on('leaveGame', () => {
    const currentGame = socketGameMap.get(socket.id)
    if (currentGame) {
      socket.leave(`game-${currentGame}`)
      socketGameMap.delete(socket.id)
      console.log(`[Socket] ${socket.id} left game: ${currentGame}`)
    }
  })
  
  // Request state of specific game
  socket.on('requestState', (mode: GameMode) => {
    socket.emit('gameState', { mode, state: gameEngines[mode].getState() })
  })
  
  // Ping handler to keep connection alive
  socket.on('ping', () => {
    socket.emit('pong')
  })

  socket.on('disconnect', (reason) => {
    socketGameMap.delete(socket.id)
    console.log(`[Socket] Client disconnected: ${socket.id}, reason: ${reason}`)
  })
})

// Start the server
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         WALL STREET AI RAIDERS - SERVER                   ║
╠════════════════════════════════════════════════════════════╣
║  Status: RUNNING                                          ║
║  Port: ${PORT}                                               ║
║  Mode: ${process.env.NODE_ENV || 'development'}                                    ║
╠════════════════════════════════════════════════════════════╣
║  Games:                                                   ║
║  - Classic (1985-2010): STARTING...                       ║
║  - Modern (2010-2026):  STARTING...                       ║
║  - Crypto (2009-2026):  STARTING...                       ║
╚════════════════════════════════════════════════════════════╝
  `)
  
  // Start all 3 games automatically
  console.log('[Server] Starting all games...')
  gameEngines.classic.startGame('classic')
  gameEngines.modern.startGame('modern')
  gameEngines.crypto.startGame('crypto')
  
  // Broadcast leaderboard updates every 10 seconds
  setInterval(() => {
    const getOverview = (engine: GameEngine) => {
      const state = engine.getState()
      const sortedPlayers = [...state.players].sort((a, b) => b.netWorth - a.netWorth)
      return {
        isRunning: engine.isRunning(),
        turnNumber: state.turnNumber,
        currentDate: state.currentDate,
        players: sortedPlayers.map(p => ({
          name: p.name,
          color: p.color,
          avatar: p.avatar,
          netWorth: p.netWorth,
          wins: aiWins[p.name] || 0
        }))
      }
    }
    
    io.emit('gamesOverview', {
      classic: getOverview(gameEngines.classic),
      modern: getOverview(gameEngines.modern),
      crypto: getOverview(gameEngines.crypto)
    })
  }, 10000)
  console.log('[Server] All 3 games running!')
})

export { io, gameEngines }
