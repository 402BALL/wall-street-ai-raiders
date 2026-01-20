import { useState, useRef, useEffect, ReactNode } from 'react'

interface Window95Props {
  title: string
  children: ReactNode
  onClose?: () => void
  width?: number
  height?: number
  x?: number
  y?: number
}

export default function Window95({ title, children, onClose, width = 400, height = 300, x = 100, y = 50 }: Window95Props) {
  const [position, setPosition] = useState({ x, y })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      setPosition({ x: e.clientX - dragOffset.current.x, y: Math.max(0, e.clientY - dragOffset.current.y) })
    }
    
    const handleMouseUp = () => setIsDragging(false)
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])
  
  return (
    <div className="absolute win95-window flex flex-col" style={{ left: position.x, top: position.y, width, height, zIndex: 100 }}>
      <div className="win95-titlebar cursor-move select-none" onMouseDown={handleMouseDown}>
        <span className="truncate">{title}</span>
        <div className="flex gap-px">
          <button className="win95-titlebar-btn">_</button>
          <button className="win95-titlebar-btn">□</button>
          {onClose && <button className="win95-titlebar-btn" onClick={onClose}>×</button>}
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-[#c0c0c0]">{children}</div>
    </div>
  )
}

