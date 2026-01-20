import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useGameStore } from '../store/gameStore'

const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3001'

export type GameMode = 'classic' | 'modern' | 'crypto'

// Singleton socket instance
let globalSocket: Socket | null = null

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Use singleton to prevent multiple connections
    if (globalSocket && globalSocket.connected) {
      socketRef.current = globalSocket
      return
    }

    console.log('[Socket] Connecting to:', SOCKET_URL)
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    })
    
    globalSocket = socket
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      useGameStore.getState().setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      useGameStore.getState().setConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error)
      useGameStore.getState().setConnected(false)
    })

    // Games overview (all 3 games status)
    socket.on('gamesOverview', (overview) => {
      console.log('[Socket] Games overview received')
      useGameStore.getState().setGamesOverview(overview)
    })

    // Game state updates
    socket.on('gameState', ({ mode, state }) => {
      console.log('[Socket] Game state update:', mode, 'Turn:', state?.turnNumber)
      useGameStore.getState().setServerState(state)
    })

    // News updates
    socket.on('news', ({ mode, news }) => {
      useGameStore.getState().addNews(news)
    })

    // Breaking news
    socket.on('breakingNews', ({ mode, news }) => {
      useGameStore.getState().setBreakingNews(news)
    })

    // Don't cleanup socket on unmount - keep it alive
    return () => {
      // Don't disconnect - we want to keep connection alive
    }
  }, []) // Empty deps - only run once

  // Join a specific game to watch
  const joinGame = useCallback((mode: GameMode) => {
    const socket = globalSocket || socketRef.current
    if (socket) {
      console.log('[Socket] Joining game:', mode)
      socket.emit('joinGame', mode)
    }
  }, [])

  // Leave current game (back to desktop)
  const leaveGame = useCallback(() => {
    const socket = globalSocket || socketRef.current
    if (socket) {
      console.log('[Socket] Leaving game')
      socket.emit('leaveGame')
    }
  }, [])

  // Request state of specific game
  const requestState = useCallback((mode: GameMode) => {
    const socket = globalSocket || socketRef.current
    if (socket) {
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
