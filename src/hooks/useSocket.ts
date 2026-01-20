import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useGameStore } from '../store/gameStore'

const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3001'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { setServerState, addNews, setBreakingNews, setConnected } = useGameStore()

  useEffect(() => {
    // Connect to server
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
      // Request current state
      socket.emit('requestState')
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error)
      setConnected(false)
    })

    // Game state updates
    socket.on('gameState', (state) => {
      console.log('[Socket] Received game state:', state.turnNumber)
      setServerState(state)
    })

    // News updates
    socket.on('news', (news) => {
      console.log('[Socket] Received news:', news.headline)
      addNews(news)
    })

    // Breaking news
    socket.on('breakingNews', (news) => {
      console.log('[Socket] Breaking news:', news.headline)
      setBreakingNews(news)
    })

    // Trade notifications
    socket.on('trade', (trade) => {
      console.log('[Socket] Trade executed:', trade)
    })

    // Game ended
    socket.on('gameEnded', (result) => {
      console.log('[Socket] Game ended, winner:', result.winner.name)
    })

    // Game started
    socket.on('gameStarted', ({ mode }) => {
      console.log('[Socket] Game started in mode:', mode)
    })

    // Cleanup
    return () => {
      console.log('[Socket] Cleaning up connection')
      socket.disconnect()
    }
  }, [setServerState, addNews, setBreakingNews, setConnected])

  // Method to select game mode
  const selectGameMode = useCallback((mode: 'classic' | 'modern' | 'crypto') => {
    if (socketRef.current) {
      socketRef.current.emit('selectGameMode', mode)
    }
  }, [])

  // Method to request state refresh
  const requestState = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('requestState')
    }
  }, [])

  return {
    socket: socketRef.current,
    selectGameMode,
    requestState,
    isConnected: socketRef.current?.connected || false
  }
}

