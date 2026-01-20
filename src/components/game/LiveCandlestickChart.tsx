import { useRef, useEffect, useState, useCallback } from 'react'
import { PriceCandle, TradeMarker, GameDate } from '../../types'

interface Props {
  priceHistory: PriceCandle[]
  tradeMarkers: TradeMarker[]
  ticker: string
  currentPrice: number
  currentDate: GameDate
}

type PriceScaleMode = 'auto' | 'manual'

export default function LiveCandlestickChart({ priceHistory, tradeMarkers, ticker, currentPrice, currentDate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 })
  
  // Layout constants
  const PRICE_SCALE_WIDTH = 70
  const TIME_SCALE_HEIGHT = 25
  const HEADER_HEIGHT = 20
  const PADDING = { top: HEADER_HEIGHT, right: PRICE_SCALE_WIDTH, bottom: TIME_SCALE_HEIGHT, left: 5 }
  
  // Time axis state (index-based)
  const [timeRange, setTimeRange] = useState({ start: 0, end: 60 })
  
  // Price axis state
  const [priceScaleMode, setPriceScaleMode] = useState<PriceScaleMode>('auto')
  const [manualPriceRange, setManualPriceRange] = useState({ min: 0, max: 100 })
  
  // Interaction state
  const [isDraggingChart, setIsDraggingChart] = useState(false)
  const [isDraggingPriceScale, setIsDraggingPriceScale] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, timeStart: 0, priceMin: 0, priceMax: 0 })
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [crosshairData, setCrosshairData] = useState<PriceCandle | null>(null)
  const [isOverPriceScale, setIsOverPriceScale] = useState(false)

  // Colors - retro terminal
  const colors = {
    bg: '#0a0a0a',
    grid: '#1a2a1a',
    gridMajor: '#2a4a2a',
    up: '#00ff00',
    down: '#ff4444',
    wick: '#00cc00',
    wickDown: '#cc3333',
    text: '#00ff00',
    textDim: '#007700',
    crosshair: '#ffff00',
    priceScale: '#0a1a0a',
    priceScaleHover: '#0a2a0a',
    currentPrice: '#ffff00',
    volume: '#003300',
    volumeUp: '#004400',
    volumeDown: '#440000'
  }

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Auto-scroll to latest data when new candles arrive
  useEffect(() => {
    if (priceHistory.length > 0 && !isDraggingChart) {
      const visibleCount = timeRange.end - timeRange.start
      // Only auto-scroll if we're at the end
      if (timeRange.end >= priceHistory.length - 2 || timeRange.end === 0) {
        setTimeRange({
          start: Math.max(0, priceHistory.length - visibleCount),
          end: priceHistory.length
        })
      }
    }
  }, [priceHistory.length])

  // Calculate auto price range
  const getAutoPriceRange = useCallback(() => {
    const visibleData = priceHistory.slice(timeRange.start, timeRange.end)
    if (visibleData.length === 0) return { min: 0, max: 100 }
    
    const prices = visibleData.flatMap(d => [d.high, d.low])
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const padding = (max - min) * 0.1 || 1
    
    return { min: min - padding, max: max + padding }
  }, [priceHistory, timeRange])

  // Get current price range (auto or manual)
  const getPriceRange = useCallback(() => {
    if (priceScaleMode === 'auto') {
      return getAutoPriceRange()
    }
    return manualPriceRange
  }, [priceScaleMode, manualPriceRange, getAutoPriceRange])

  const formatDate = (date: GameDate): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (date.day) {
      return `${months[date.month - 1]} ${date.day}, ${date.year}`
    }
    return `${months[date.month - 1]} ${date.year}`
  }

  // Main draw function
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensions
    const chartWidth = width - PADDING.left - PADDING.right
    const chartHeight = height - PADDING.top - PADDING.bottom - 35 // Volume space

    // Clear
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, width, height)

    // Draw price scale background
    ctx.fillStyle = isOverPriceScale ? colors.priceScaleHover : colors.priceScale
    ctx.fillRect(width - PRICE_SCALE_WIDTH, 0, PRICE_SCALE_WIDTH, height - TIME_SCALE_HEIGHT)

    if (priceHistory.length === 0) {
      ctx.fillStyle = colors.text
      ctx.font = '14px "Courier New", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('WAITING FOR DATA...', width / 2, height / 2)
      ctx.fillText('Press PLAY to start', width / 2, height / 2 + 20)
      return
    }

    const visibleData = priceHistory.slice(timeRange.start, timeRange.end)
    if (visibleData.length === 0) return

    const priceRange = getPriceRange()
    const priceSpan = priceRange.max - priceRange.min || 1

    // Helper functions
    const xToCanvas = (i: number) => PADDING.left + ((i + 0.5) / visibleData.length) * chartWidth
    const priceToY = (price: number) => PADDING.top + (1 - (price - priceRange.min) / priceSpan) * chartHeight
    const yToPrice = (y: number) => priceRange.max - ((y - PADDING.top) / chartHeight) * priceSpan

    // Draw grid
    ctx.strokeStyle = colors.grid
    ctx.lineWidth = 1

    // Horizontal grid lines
    const priceStep = priceSpan / 8
    for (let i = 0; i <= 8; i++) {
      const price = priceRange.min + priceStep * i
      const y = priceToY(price)
      
      ctx.beginPath()
      ctx.strokeStyle = i % 2 === 0 ? colors.gridMajor : colors.grid
      ctx.moveTo(PADDING.left, y)
      ctx.lineTo(width - PADDING.right, y)
      ctx.stroke()

      // Price labels on right scale
      ctx.fillStyle = i % 2 === 0 ? colors.text : colors.textDim
      ctx.font = '10px "Courier New", monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`$${price.toFixed(2)}`, width - PRICE_SCALE_WIDTH + 5, y + 3)
    }

    // Vertical grid lines
    const timeStep = Math.max(1, Math.floor(visibleData.length / 8))
    for (let i = 0; i <= visibleData.length; i += timeStep) {
      const x = xToCanvas(i - 0.5)
      ctx.beginPath()
      ctx.strokeStyle = colors.grid
      ctx.moveTo(x, PADDING.top)
      ctx.lineTo(x, height - TIME_SCALE_HEIGHT)
      ctx.stroke()
    }

    // Calculate candle width
    const candleWidth = Math.max(3, Math.min(20, (chartWidth / visibleData.length) * 0.75))

    // Draw volume bars
    const volumes = visibleData.map(d => d.volume)
    const maxVolume = Math.max(...volumes) || 1
    const volumeHeight = 30
    const volumeY = height - TIME_SCALE_HEIGHT - volumeHeight

    visibleData.forEach((candle, i) => {
      const x = xToCanvas(i)
      const volHeight = (candle.volume / maxVolume) * volumeHeight
      ctx.fillStyle = candle.close >= candle.open ? colors.volumeUp : colors.volumeDown
      ctx.fillRect(x - candleWidth / 2, volumeY + volumeHeight - volHeight, candleWidth, volHeight)
    })

    // Draw candlesticks
    visibleData.forEach((candle, i) => {
      const x = xToCanvas(i)
      const isUp = candle.close >= candle.open

      // Wick
      ctx.strokeStyle = isUp ? colors.wick : colors.wickDown
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, priceToY(candle.high))
      ctx.lineTo(x, priceToY(candle.low))
      ctx.stroke()

      // Body
      const bodyTop = priceToY(Math.max(candle.open, candle.close))
      const bodyBottom = priceToY(Math.min(candle.open, candle.close))
      const bodyHeight = Math.max(1, bodyBottom - bodyTop)

      if (isUp) {
        ctx.strokeStyle = colors.up
        ctx.lineWidth = 1
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
      } else {
        ctx.fillStyle = colors.down
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
      }
    })

    // Draw trade markers
    const visibleMarkers = tradeMarkers.filter(m => {
      const idx = priceHistory.findIndex(p => p.date.year === m.date.year && p.date.month === m.date.month)
      return idx >= timeRange.start && idx < timeRange.end
    })

    visibleMarkers.forEach(marker => {
      const idx = priceHistory.findIndex(p => p.date.year === marker.date.year && p.date.month === marker.date.month)
      const localIdx = idx - timeRange.start
      if (localIdx < 0 || localIdx >= visibleData.length) return
      
      const x = xToCanvas(localIdx)
      const y = priceToY(marker.price)

      ctx.beginPath()
      ctx.fillStyle = marker.playerColor
      if (marker.type === 'buy') {
        ctx.moveTo(x, y + 8)
        ctx.lineTo(x - 5, y + 15)
        ctx.lineTo(x + 5, y + 15)
      } else {
        ctx.moveTo(x, y - 8)
        ctx.lineTo(x - 5, y - 15)
        ctx.lineTo(x + 5, y - 15)
      }
      ctx.closePath()
      ctx.fill()
    })

    // Draw current price line
    if (currentPrice >= priceRange.min && currentPrice <= priceRange.max) {
      const currentY = priceToY(currentPrice)
      ctx.strokeStyle = colors.currentPrice
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(PADDING.left, currentY)
      ctx.lineTo(width - PADDING.right, currentY)
      ctx.stroke()
      ctx.setLineDash([])

      // Current price label
      ctx.fillStyle = colors.currentPrice
      ctx.fillRect(width - PRICE_SCALE_WIDTH, currentY - 8, PRICE_SCALE_WIDTH, 16)
      ctx.fillStyle = '#000'
      ctx.font = 'bold 10px "Courier New", monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`$${currentPrice.toFixed(2)}`, width - PRICE_SCALE_WIDTH + 5, currentY + 4)
    }

    // Draw crosshair
    if (mousePos && crosshairData && !isDraggingChart && !isDraggingPriceScale) {
      ctx.strokeStyle = colors.crosshair
      ctx.setLineDash([2, 2])
      
      // Vertical line
      if (mousePos.x < width - PRICE_SCALE_WIDTH) {
        ctx.beginPath()
        ctx.moveTo(mousePos.x, PADDING.top)
        ctx.lineTo(mousePos.x, height - TIME_SCALE_HEIGHT)
        ctx.stroke()
      }
      
      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(PADDING.left, mousePos.y)
      ctx.lineTo(width - PADDING.right, mousePos.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Price at cursor
      const cursorPrice = yToPrice(mousePos.y)
      if (mousePos.y >= PADDING.top && mousePos.y <= height - TIME_SCALE_HEIGHT - volumeHeight) {
        ctx.fillStyle = 'rgba(255,255,0,0.8)'
        ctx.fillRect(width - PRICE_SCALE_WIDTH, mousePos.y - 8, PRICE_SCALE_WIDTH, 16)
        ctx.fillStyle = '#000'
        ctx.font = '10px "Courier New", monospace'
        ctx.textAlign = 'left'
        ctx.fillText(`$${cursorPrice.toFixed(2)}`, width - PRICE_SCALE_WIDTH + 5, mousePos.y + 4)
      }

      // OHLC tooltip
      if (mousePos.x < width - PRICE_SCALE_WIDTH) {
        const boxX = mousePos.x < width / 2 ? mousePos.x + 15 : mousePos.x - 130
        const boxY = Math.max(PADDING.top + 5, Math.min(mousePos.y - 50, height - 130))
        
        ctx.fillStyle = 'rgba(0, 30, 0, 0.95)'
        ctx.strokeStyle = colors.text
        ctx.lineWidth = 1
        ctx.fillRect(boxX, boxY, 115, 95)
        ctx.strokeRect(boxX, boxY, 115, 95)

        const chg = crosshairData.close - crosshairData.open
        const chgPct = ((chg / crosshairData.open) * 100).toFixed(2)

        ctx.font = '9px "Courier New", monospace'
        ctx.textAlign = 'left'
        const lines = [
          { text: formatDate(crosshairData.date), color: colors.text },
          { text: `O: $${crosshairData.open.toFixed(2)}`, color: colors.text },
          { text: `H: $${crosshairData.high.toFixed(2)}`, color: colors.text },
          { text: `L: $${crosshairData.low.toFixed(2)}`, color: colors.text },
          { text: `C: $${crosshairData.close.toFixed(2)}`, color: colors.text },
          { text: `${chg >= 0 ? '+' : ''}${chgPct}%`, color: chg >= 0 ? colors.up : colors.down },
          { text: `Vol: ${formatVolume(crosshairData.volume)}`, color: colors.textDim }
        ]
        lines.forEach((line, i) => {
          ctx.fillStyle = line.color
          ctx.fillText(line.text, boxX + 8, boxY + 12 + i * 12)
        })
      }
    }

    // Draw chart border
    ctx.strokeStyle = colors.text
    ctx.lineWidth = 1
    ctx.strokeRect(PADDING.left, PADDING.top, chartWidth, chartHeight + volumeHeight)

    // Draw header
    ctx.fillStyle = colors.text
    ctx.font = 'bold 11px "Courier New", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`${ticker} - LIVE CHART`, 8, 14)

    if (visibleData.length > 0) {
      const last = visibleData[visibleData.length - 1]
      const chg = last.close - last.open
      const chgPct = ((chg / last.open) * 100).toFixed(2)
      ctx.font = '10px "Courier New", monospace'
      ctx.fillStyle = colors.textDim
      ctx.fillText(`O:${last.open.toFixed(2)} H:${last.high.toFixed(2)} L:${last.low.toFixed(2)} C:${last.close.toFixed(2)}`, 150, 14)
      ctx.fillStyle = chg >= 0 ? colors.up : colors.down
      ctx.fillText(`${chg >= 0 ? '+' : ''}${chgPct}%`, 420, 14)
    }

    // Date labels
    ctx.fillStyle = colors.textDim
    ctx.font = '9px "Courier New", monospace'
    ctx.textAlign = 'center'
    const dateStep = Math.max(1, Math.floor(visibleData.length / 6))
    for (let i = 0; i < visibleData.length; i += dateStep) {
      ctx.fillText(formatDate(visibleData[i].date), xToCanvas(i), height - 5)
    }

    // Scale mode indicator
    ctx.fillStyle = colors.textDim
    ctx.font = '8px "Courier New", monospace'
    ctx.textAlign = 'right'
    ctx.fillText(priceScaleMode === 'auto' ? 'AUTO' : 'MANUAL', width - 5, height - TIME_SCALE_HEIGHT - 5)

  }, [priceHistory, dimensions, timeRange, priceScaleMode, manualPriceRange, colors, mousePos, crosshairData, isDraggingChart, isDraggingPriceScale, isOverPriceScale, currentPrice, ticker, tradeMarkers, getPriceRange])

  useEffect(() => {
    drawChart()
  }, [drawChart])

  // Check if mouse is over price scale
  const isOnPriceScale = (x: number) => x >= dimensions.width - PRICE_SCALE_WIDTH

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsOverPriceScale(isOnPriceScale(x))

    if (isDraggingChart) {
      // Pan time axis
      const dx = x - dragStart.x
      const chartWidth = dimensions.width - PADDING.left - PADDING.right
      const candlesPerPixel = (timeRange.end - timeRange.start) / chartWidth
      const candleShift = Math.round(dx * candlesPerPixel)
      
      const newStart = Math.max(0, Math.min(priceHistory.length - 5, dragStart.timeStart - candleShift))
      const range = timeRange.end - timeRange.start
      const newEnd = Math.min(priceHistory.length, newStart + range)
      
      setTimeRange({ start: newStart, end: newEnd })
      return
    }

    if (isDraggingPriceScale) {
      // Pan/scale price axis
      const dy = y - dragStart.y
      const chartHeight = dimensions.height - PADDING.top - PADDING.bottom - 35
      const pricePerPixel = (dragStart.priceMax - dragStart.priceMin) / chartHeight
      const priceShift = dy * pricePerPixel
      
      setManualPriceRange({
        min: dragStart.priceMin + priceShift,
        max: dragStart.priceMax + priceShift
      })
      setPriceScaleMode('manual')
      return
    }

    // Update crosshair
    setMousePos({ x, y })
    
    if (x < dimensions.width - PRICE_SCALE_WIDTH && priceHistory.length > 0) {
      const chartWidth = dimensions.width - PADDING.left - PADDING.right
      const visibleData = priceHistory.slice(timeRange.start, timeRange.end)
      const idx = Math.floor((x - PADDING.left) / chartWidth * visibleData.length)
      if (idx >= 0 && idx < visibleData.length) {
        setCrosshairData(visibleData[idx])
      }
    } else {
      setCrosshairData(null)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const priceRange = getPriceRange()

    if (isOnPriceScale(x)) {
      // Start dragging price scale
      setIsDraggingPriceScale(true)
      setDragStart({ 
        x, y, 
        timeStart: timeRange.start,
        priceMin: priceRange.min,
        priceMax: priceRange.max
      })
    } else {
      // Start dragging chart (time pan)
      setIsDraggingChart(true)
      setDragStart({ 
        x, y, 
        timeStart: timeRange.start,
        priceMin: priceRange.min,
        priceMax: priceRange.max
      })
    }
  }

  const handleMouseUp = () => {
    setIsDraggingChart(false)
    setIsDraggingPriceScale(false)
  }

  const handleMouseLeave = () => {
    setMousePos(null)
    setCrosshairData(null)
    setIsDraggingChart(false)
    setIsDraggingPriceScale(false)
    setIsOverPriceScale(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const zoomIn = e.deltaY < 0

    if (isOnPriceScale(x)) {
      // Zoom price axis
      const priceRange = getPriceRange()
      const priceSpan = priceRange.max - priceRange.min
      const zoomFactor = zoomIn ? 0.85 : 1.18
      
      // Zoom centered on mouse Y position
      const chartHeight = dimensions.height - PADDING.top - PADDING.bottom - 35
      const mouseRatio = (y - PADDING.top) / chartHeight
      const mousePrice = priceRange.max - mouseRatio * priceSpan
      
      const newSpan = priceSpan * zoomFactor
      const newMin = mousePrice - (1 - mouseRatio) * newSpan
      const newMax = mousePrice + mouseRatio * newSpan
      
      setManualPriceRange({ min: newMin, max: newMax })
      setPriceScaleMode('manual')
    } else {
      // Zoom time axis
      const currentRange = timeRange.end - timeRange.start
      const zoomAmount = zoomIn ? -Math.max(2, Math.floor(currentRange * 0.15)) : Math.max(2, Math.floor(currentRange * 0.15))
      const newRange = Math.max(5, Math.min(priceHistory.length, currentRange + zoomAmount))
      
      // Zoom centered on mouse X position
      const chartWidth = dimensions.width - PADDING.left - PADDING.right
      const mouseRatio = (x - PADDING.left) / chartWidth
      const mouseIndex = timeRange.start + mouseRatio * currentRange
      
      const newStart = Math.max(0, Math.round(mouseIndex - mouseRatio * newRange))
      const newEnd = Math.min(priceHistory.length, newStart + newRange)
      
      setTimeRange({ start: newStart, end: newEnd })
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left

    if (isOnPriceScale(x)) {
      // Reset to auto price scale
      setPriceScaleMode('auto')
    } else {
      // Reset time to show all
      setTimeRange({ start: 0, end: priceHistory.length })
      setPriceScaleMode('auto')
    }
  }

  // Button handlers
  const resetView = () => {
    setTimeRange({ start: Math.max(0, priceHistory.length - 60), end: priceHistory.length })
    setPriceScaleMode('auto')
  }

  const goToStart = () => {
    const range = timeRange.end - timeRange.start
    setTimeRange({ start: 0, end: Math.min(range, priceHistory.length) })
  }

  const goToEnd = () => {
    const range = timeRange.end - timeRange.start
    setTimeRange({ start: Math.max(0, priceHistory.length - range), end: priceHistory.length })
  }

  const zoomInTime = () => {
    const range = timeRange.end - timeRange.start
    const newRange = Math.max(5, Math.round(range * 0.7))
    const center = (timeRange.start + timeRange.end) / 2
    setTimeRange({
      start: Math.max(0, Math.round(center - newRange / 2)),
      end: Math.min(priceHistory.length, Math.round(center + newRange / 2))
    })
  }

  const zoomOutTime = () => {
    const range = timeRange.end - timeRange.start
    const newRange = Math.min(priceHistory.length, Math.round(range * 1.4))
    const center = (timeRange.start + timeRange.end) / 2
    setTimeRange({
      start: Math.max(0, Math.round(center - newRange / 2)),
      end: Math.min(priceHistory.length, Math.round(center + newRange / 2))
    })
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Controls */}
      <div className="flex gap-1 px-2 py-1 items-center border-b border-[#003300] bg-[#0a0a0a]">
        <button onClick={goToStart} className="retro-chart-btn" title="Go to start">⏮</button>
        <button onClick={zoomOutTime} className="retro-chart-btn" title="Zoom out time">−</button>
        <button onClick={zoomInTime} className="retro-chart-btn" title="Zoom in time">+</button>
        <button onClick={goToEnd} className="retro-chart-btn" title="Go to end">⏭</button>
        <div className="w-px h-4 bg-[#003300] mx-1" />
        <button onClick={resetView} className="retro-chart-btn" title="Reset view">⟲ Reset</button>
        <button 
          onClick={() => setPriceScaleMode('auto')} 
          className={`retro-chart-btn ${priceScaleMode === 'auto' ? 'bg-[#003300]' : ''}`}
          title="Auto-fit price"
        >
          Auto
        </button>
        <div className="flex-1" />
        <span className="text-[#007700] text-[9px] font-mono">
          {formatDate(currentDate)} | {priceHistory.length} periods | {timeRange.end - timeRange.start} visible
        </span>
      </div>
      
      {/* Chart */}
      <div ref={containerRef} className="flex-1 relative" style={{ minHeight: 280 }}>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          style={{ 
            cursor: isDraggingChart || isDraggingPriceScale 
              ? 'grabbing' 
              : isOverPriceScale 
                ? 'ns-resize' 
                : 'crosshair' 
          }}
        />
      </div>
      
      {/* Footer */}
      <div className="flex gap-4 px-2 py-1 border-t border-[#003300] text-[8px] font-mono text-[#007700] bg-[#0a0a0a]">
        <span>▲ BUY</span>
        <span>▼ SELL</span>
        <span className="text-[#005500]">|</span>
        <span>Scroll on chart = zoom time</span>
        <span>Scroll on price scale = zoom price</span>
        <span>Drag = pan</span>
        <span>Double-click = reset</span>
      </div>
    </div>
  )
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(0)}K`
  return vol.toString()
}
