import { useRef, useEffect, useState, useCallback } from 'react'

interface OHLC {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Props {
  data: OHLC[]
  ticker: string
  currentPrice: number
}

export default function RetroCandlestickChart({ data, ticker, currentPrice }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 })
  const [viewRange, setViewRange] = useState({ start: 0, end: 60 })
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [crosshairData, setCrosshairData] = useState<OHLC | null>(null)

  // Color scheme - retro terminal style
  const colors = {
    bg: '#0a0a0a',
    grid: '#1a3a1a',
    gridMajor: '#2a5a2a',
    up: '#00ff00',
    down: '#ff3333',
    wick: '#00aa00',
    wickDown: '#aa3333',
    text: '#00ff00',
    textDim: '#008800',
    crosshair: '#ffff00',
    volume: '#004400',
    volumeUp: '#005500',
    volumeDown: '#550000',
    border: '#00aa00'
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width - 4, height: rect.height - 4 })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const end = data.length
      const start = Math.max(0, end - 60)
      setViewRange({ start, end })
    }
  }, [data])

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensions
    const padding = { top: 20, right: 70, bottom: 60, left: 10 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom - 40 // Reserve space for volume

    // Get visible data
    const visibleData = data.slice(viewRange.start, viewRange.end)
    if (visibleData.length === 0) return

    // Clear canvas
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, width, height)

    // Calculate price range
    const prices = visibleData.flatMap(d => [d.high, d.low])
    const minPrice = Math.min(...prices) * 0.995
    const maxPrice = Math.max(...prices) * 1.005
    const priceRange = maxPrice - minPrice

    // Calculate volume range
    const volumes = visibleData.map(d => d.volume)
    const maxVolume = Math.max(...volumes)

    // Helper functions
    const xToCanvas = (i: number) => padding.left + (i / visibleData.length) * chartWidth
    const priceToY = (price: number) => padding.top + (1 - (price - minPrice) / priceRange) * chartHeight
    const volumeToY = (vol: number) => height - padding.bottom + 5 + (1 - vol / maxVolume) * 35

    // Draw grid
    ctx.strokeStyle = colors.grid
    ctx.lineWidth = 1

    // Horizontal grid lines
    const priceStep = priceRange / 8
    for (let i = 0; i <= 8; i++) {
      const price = minPrice + priceStep * i
      const y = priceToY(price)
      
      ctx.beginPath()
      ctx.strokeStyle = i % 2 === 0 ? colors.gridMajor : colors.grid
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Price labels
      ctx.fillStyle = i % 2 === 0 ? colors.text : colors.textDim
      ctx.font = '10px "Courier New", monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`$${price.toFixed(2)}`, width - padding.right + 5, y + 3)
    }

    // Vertical grid lines (every 10 candles)
    for (let i = 0; i <= visibleData.length; i += 10) {
      const x = xToCanvas(i)
      ctx.beginPath()
      ctx.strokeStyle = colors.grid
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, height - padding.bottom + 40)
      ctx.stroke()
    }

    // Draw volume bars
    const candleWidth = Math.max(3, (chartWidth / visibleData.length) * 0.7)
    visibleData.forEach((candle, i) => {
      const x = xToCanvas(i + 0.5)
      const y = volumeToY(candle.volume)
      const barHeight = height - padding.bottom + 40 - y

      ctx.fillStyle = candle.close >= candle.open ? colors.volumeUp : colors.volumeDown
      ctx.fillRect(x - candleWidth / 2, y, candleWidth, barHeight)
    })

    // Draw candlesticks
    visibleData.forEach((candle, i) => {
      const x = xToCanvas(i + 0.5)
      const isUp = candle.close >= candle.open

      // Draw wick (high-low line)
      ctx.strokeStyle = isUp ? colors.wick : colors.wickDown
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, priceToY(candle.high))
      ctx.lineTo(x, priceToY(candle.low))
      ctx.stroke()

      // Draw body
      const bodyTop = priceToY(Math.max(candle.open, candle.close))
      const bodyBottom = priceToY(Math.min(candle.open, candle.close))
      const bodyHeight = Math.max(1, bodyBottom - bodyTop)

      if (isUp) {
        // Hollow candle for up
        ctx.strokeStyle = colors.up
        ctx.lineWidth = 1
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
      } else {
        // Filled candle for down
        ctx.fillStyle = colors.down
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
      }
    })

    // Draw border
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 2
    ctx.strokeRect(padding.left - 1, padding.top - 1, chartWidth + 2, chartHeight + 2)

    // Draw crosshair and data if mouse is over chart
    if (mousePos && crosshairData) {
      // Vertical line
      ctx.strokeStyle = colors.crosshair
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(mousePos.x, padding.top)
      ctx.lineTo(mousePos.x, height - padding.bottom)
      ctx.stroke()

      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(padding.left, mousePos.y)
      ctx.lineTo(width - padding.right, mousePos.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Data box
      const boxX = mousePos.x < width / 2 ? mousePos.x + 10 : mousePos.x - 120
      const boxY = Math.max(padding.top, Math.min(mousePos.y - 50, height - 120))
      
      ctx.fillStyle = 'rgba(0, 20, 0, 0.9)'
      ctx.strokeStyle = colors.border
      ctx.lineWidth = 1
      ctx.fillRect(boxX, boxY, 110, 90)
      ctx.strokeRect(boxX, boxY, 110, 90)

      ctx.fillStyle = colors.text
      ctx.font = '9px "Courier New", monospace'
      ctx.textAlign = 'left'
      
      const lines = [
        `Date: ${crosshairData.date}`,
        `O: $${crosshairData.open.toFixed(2)}`,
        `H: $${crosshairData.high.toFixed(2)}`,
        `L: $${crosshairData.low.toFixed(2)}`,
        `C: $${crosshairData.close.toFixed(2)}`,
        `Vol: ${formatVolume(crosshairData.volume)}`
      ]
      
      lines.forEach((line, i) => {
        ctx.fillText(line, boxX + 5, boxY + 12 + i * 13)
      })
    }

    // Draw current price line
    const currentY = priceToY(currentPrice)
    ctx.strokeStyle = colors.crosshair
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(padding.left, currentY)
    ctx.lineTo(width - padding.right, currentY)
    ctx.stroke()
    ctx.setLineDash([])

    // Current price label
    ctx.fillStyle = colors.crosshair
    ctx.fillRect(width - padding.right, currentY - 8, 65, 16)
    ctx.fillStyle = colors.bg
    ctx.font = 'bold 10px "Courier New", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`$${currentPrice.toFixed(2)}`, width - padding.right + 3, currentY + 4)

    // Draw header info
    ctx.fillStyle = colors.text
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`${ticker} - CANDLESTICK`, 10, 14)

    // Draw OHLC summary
    if (visibleData.length > 0) {
      const lastCandle = visibleData[visibleData.length - 1]
      const change = lastCandle.close - lastCandle.open
      const changePercent = (change / lastCandle.open * 100)
      
      ctx.font = '10px "Courier New", monospace'
      ctx.fillStyle = change >= 0 ? colors.up : colors.down
      const summary = `O:${lastCandle.open.toFixed(2)} H:${lastCandle.high.toFixed(2)} L:${lastCandle.low.toFixed(2)} C:${lastCandle.close.toFixed(2)} ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`
      ctx.fillText(summary, 150, 14)
    }

    // Draw date labels
    ctx.fillStyle = colors.textDim
    ctx.font = '9px "Courier New", monospace'
    ctx.textAlign = 'center'
    for (let i = 0; i < visibleData.length; i += 15) {
      const x = xToCanvas(i + 0.5)
      ctx.fillText(visibleData[i].date, x, height - 8)
    }
    
  }, [data, dimensions, viewRange, colors, mousePos, crosshairData, currentPrice, ticker])

  useEffect(() => {
    drawChart()
  }, [drawChart])

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const { width } = dimensions
    const padding = { left: 10, right: 70 }
    const chartWidth = width - padding.left - padding.right

    const visibleData = data.slice(viewRange.start, viewRange.end)
    const candleIndex = Math.floor((x - padding.left) / chartWidth * visibleData.length)

    if (candleIndex >= 0 && candleIndex < visibleData.length) {
      setMousePos({ x, y })
      setCrosshairData(visibleData[candleIndex])
    } else {
      setMousePos(null)
      setCrosshairData(null)
    }
  }

  const handleMouseLeave = () => {
    setMousePos(null)
    setCrosshairData(null)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 5 : -5
    
    setViewRange(prev => {
      const newStart = Math.max(0, prev.start + delta)
      const newEnd = Math.min(data.length, prev.end + delta)
      
      if (newEnd - newStart >= 20) {
        return { start: newStart, end: newEnd }
      }
      return prev
    })
  }

  const zoomIn = () => {
    setViewRange(prev => {
      const center = (prev.start + prev.end) / 2
      const newRange = Math.max(20, (prev.end - prev.start) * 0.8)
      return {
        start: Math.max(0, Math.floor(center - newRange / 2)),
        end: Math.min(data.length, Math.ceil(center + newRange / 2))
      }
    })
  }

  const zoomOut = () => {
    setViewRange(prev => {
      const center = (prev.start + prev.end) / 2
      const newRange = Math.min(data.length, (prev.end - prev.start) * 1.25)
      return {
        start: Math.max(0, Math.floor(center - newRange / 2)),
        end: Math.min(data.length, Math.ceil(center + newRange / 2))
      }
    })
  }

  const scrollLeft = () => {
    setViewRange(prev => ({
      start: Math.max(0, prev.start - 10),
      end: Math.max(prev.end - prev.start, prev.end - 10)
    }))
  }

  const scrollRight = () => {
    setViewRange(prev => ({
      start: Math.min(data.length - (prev.end - prev.start), prev.start + 10),
      end: Math.min(data.length, prev.end + 10)
    }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex gap-1 mb-1">
        <button onClick={scrollLeft} className="retro-chart-btn">&lt;&lt;</button>
        <button onClick={zoomIn} className="retro-chart-btn">+</button>
        <button onClick={zoomOut} className="retro-chart-btn">-</button>
        <button onClick={scrollRight} className="retro-chart-btn">&gt;&gt;</button>
        <span className="text-[#00ff00] text-[10px] font-mono ml-2">
          [{viewRange.start + 1}-{viewRange.end} of {data.length}]
        </span>
      </div>
      
      {/* Chart container */}
      <div 
        ref={containerRef} 
        className="flex-1 border-2 border-[#00aa00] bg-black"
        style={{ minHeight: 250 }}
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{ cursor: 'crosshair' }}
        />
      </div>
      
      {/* Info bar */}
      <div className="bg-black border-t border-[#00aa00] px-2 py-1 flex justify-between text-[9px] font-mono text-[#00ff00]">
        <span>SCROLL: Mouse wheel | ZOOM: +/- buttons</span>
        <span>PERIOD: {data.length} days</span>
      </div>
    </div>
  )
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`
  return vol.toString()
}

