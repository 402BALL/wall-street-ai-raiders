import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useGameStore } from '../store/gameStore'

const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3001'

export type GameMode = 'classic' | 'modern' | 'crypto'

// Singleton socket instance
let globalSocket: Socket | null = null
let currentGameMode: GameMode | null = null

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Use singleton to prevent multiple connections
    if (globalSocket && globalSocket.connected) {
      socketRef.current = globalSocket
      useGameStore.getState().setConnected(true)
      return
    }

    console.log('[Socket] Connecting to:', SOCKET_URL)
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep trying forever
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      pingInterval: 25000,
      pingTimeout: 60000
    })
    
    globalSocket = socket
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      useGameStore.getState().setConnected(true)
      
      // Auto-rejoin game if we were watching one
      if (currentGameMode) {
        console.log('[Socket] Auto-rejoining game:', currentGameMode)
        socket.emit('joinGame', currentGameMode)
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
      useGameStore.getState().setConnected(false)
      
      // If server disconnected us, try to reconnect
      if (reason === 'io server disconnect') {
        socket.connect()
      }
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message)
      useGameStore.getState().setConnected(false)
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts')
      useGameStore.getState().setConnected(true)
      
      // Rejoin game on reconnect
      if (currentGameMode) {
        console.log('[Socket] Rejoining game after reconnect:', currentGameMode)
        socket.emit('joinGame', currentGameMode)
      }
    })

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[Socket] Reconnection attempt:', attemptNumber)
    })

    socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnection error:', error.message)
    })

    // Games overview (all 3 games status)
    socket.on('gamesOverview', (overview) => {
      console.log('[Socket] Games overview received')
      useGameStore.getState().setGamesOverview(overview)
    })

    // Game state updates
    socket.on('gameState', ({ mode, state }) => {
      console.log('[Socket] Game state update:', mode, 'Turn:', state?.turnNumber)
      if (state) {
        useGameStore.getState().setServerState(state)
      }
    })

    // News updates
    socket.on('news', ({ mode, news }) => {
      if (news) {
        useGameStore.getState().addNews(news)
      }
    })

    // Breaking news
    socket.on('breakingNews', ({ mode, news }) => {
      if (news) {
        useGameStore.getState().setBreakingNews(news)
      }
    })

    // Ping to keep connection alive
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping')
      }
    }, 30000)

    return () => {
      clearInterval(pingInterval)
      // Don't disconnect - keep socket alive
    }
  }, [])

  // Join a specific game to watch
  const joinGame = useCallback((mode: GameMode) => {
    currentGameMode = mode // Remember which game we're watching
    const socket = globalSocket || socketRef.current
    if (socket && socket.connected) {
      console.log('[Socket] Joining game:', mode)
      socket.emit('joinGame', mode)
    } else {
      console.log('[Socket] Not connected, will join on reconnect:', mode)
    }
  }, [])

  // Leave current game (back to desktop)
  const leaveGame = useCallback(() => {
    currentGameMode = null // Clear remembered game
    const socket = globalSocket || socketRef.current
    if (socket && socket.connected) {
      console.log('[Socket] Leaving game')
      socket.emit('leaveGame')
    }
  }, [])

  // Request state of specific game
  const requestState = useCallback((mode: GameMode) => {
    const socket = globalSocket || socketRef.current
    if (socket && socket.connected) {
      socket.emit('requestState', mode)
    }
  }, [])

  return {
    socket: globalSocket || socketRef.current,
    joinGame,
    leaveGame,
    requestState
  }
}
