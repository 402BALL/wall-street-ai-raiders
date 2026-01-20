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
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 30000
    })
    
    globalSocket = socket
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      useGameStore.getState().setConnected(true)
      
      // Rejoin game if we were watching one
      if (currentGameMode) {
        socket.emit('joinGame', currentGameMode)
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
      useGameStore.getState().setConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message)
    })

    // Games overview
    socket.on('gamesOverview', (overview) => {
      useGameStore.getState().setGamesOverview(overview)
    })

    // Game state updates
    socket.on('gameState', ({ mode, state }) => {
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

    // Pong response
    socket.on('pong', () => {
      // Connection is alive
    })

    return () => {
      // Don't disconnect on unmount
    }
  }, [])

  // Join a specific game to watch
  const joinGame = useCallback((mode: GameMode) => {
    currentGameMode = mode
    const socket = globalSocket || socketRef.current
    if (socket?.connected) {
      socket.emit('joinGame', mode)
    }
  }, [])

  // Leave current game
  const leaveGame = useCallback(() => {
    currentGameMode = null
    const socket = globalSocket || socketRef.current
    if (socket?.connected) {
      socket.emit('leaveGame')
    }
  }, [])

  // Request state
  const requestState = useCallback((mode: GameMode) => {
    const socket = globalSocket || socketRef.current
    if (socket?.connected) {
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
