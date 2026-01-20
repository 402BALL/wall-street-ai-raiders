import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useGameStore } from '../store/gameStore'

const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3001'

export type GameMode = 'classic' | 'modern' | 'crypto'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { setServerState, addNews, setBreakingNews, setConnected, setGamesOverview } = useGameStore()

  useEffect(() => {
    console.log('[Socket] Connecting to:', SOCKET_URL)
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    })
    
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error)
      setConnected(false)
    })

    // Games overview (all 3 games status)
    socket.on('gamesOverview', (overview) => {
      console.log('[Socket] Games overview:', overview)
      setGamesOverview(overview)
    })

    // Game state updates
    socket.on('gameState', ({ mode, state }) => {
      console.log('[Socket] Game state update:', mode, state.turnNumber)
      setServerState(state)
    })

    // News updates
    socket.on('news', ({ mode, news }) => {
      addNews(news)
    })

    // Breaking news
    socket.on('breakingNews', ({ mode, news }) => {
      setBreakingNews(news)
    })

    // Trade notifications
    socket.on('trade', ({ mode, trade }) => {
      console.log('[Socket] Trade:', mode, trade)
    })

    // Game ended
    socket.on('gameEnded', ({ mode, result }) => {
      console.log('[Socket] Game ended:', mode, result.winner.name)
    })

    return () => {
      socket.disconnect()
    }
  }, [setServerState, addNews, setBreakingNews, setConnected, setGamesOverview])

  // Join a specific game to watch
  const joinGame = useCallback((mode: GameMode) => {
    if (socketRef.current) {
      socketRef.current.emit('joinGame', mode)
    }
  }, [])

  // Leave current game (back to desktop)
  const leaveGame = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leaveGame')
    }
  }, [])

  // Request state of specific game
  const requestState = useCallback((mode: GameMode) => {
    if (socketRef.current) {
      socketRef.current.emit('requestState', mode)
    }
  }, [])

  return {
    socket: socketRef.current,
    joinGame,
    leaveGame,
    requestState,
    isConnected: socketRef.current?.connected || false
  }
}
