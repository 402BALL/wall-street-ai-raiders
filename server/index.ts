import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import { GameEngine } from './gameEngine'

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 3001

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')))

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API endpoint to get current game state
app.get('/api/state', (req, res) => {
  res.json(gameEngine.getState())
})

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Game Engine instance
const gameEngine = new GameEngine()

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`)
  
  // Send current game state to newly connected client
  socket.emit('gameState', gameEngine.getState())
  
  // Handle client requesting full state
  socket.on('requestState', () => {
    socket.emit('gameState', gameEngine.getState())
  })
  
  // Handle game mode selection (admin only in future)
  socket.on('selectGameMode', (mode: string) => {
    if (!gameEngine.isRunning()) {
      gameEngine.startGame(mode as 'classic' | 'modern' | 'crypto')
      io.emit('gameStarted', { mode })
    }
  })
  
  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`)
  })
})

// Broadcast game updates to all clients
gameEngine.on('stateUpdate', (state) => {
  io.emit('gameState', state)
})

gameEngine.on('newsUpdate', (news) => {
  io.emit('news', news)
})

gameEngine.on('breakingNews', (news) => {
  io.emit('breakingNews', news)
})

gameEngine.on('tradeExecuted', (trade) => {
  io.emit('trade', trade)
})

gameEngine.on('gameEnded', (result) => {
  io.emit('gameEnded', result)
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
║  Endpoints:                                               ║
║  - http://localhost:${PORT}        (Web UI)                  ║
║  - http://localhost:${PORT}/api/health  (Health Check)       ║
║  - ws://localhost:${PORT}          (WebSocket)               ║
╚════════════════════════════════════════════════════════════╝
  `)
  
  // Don't auto-start - wait for user to select mode
  console.log('[Server] Waiting for game mode selection...')
})

export { io, gameEngine }

