import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { NewsHeadline } from '../../types'

export default function BreakingNewsPopup() {
  const newsHeadlines = useGameStore(state => state.newsHeadlines)
  const formatDate = useGameStore(state => state.formatDate)
  const [visibleNews, setVisibleNews] = useState<NewsHeadline | null>(null)
  const [newsQueue, setNewsQueue] = useState<NewsHeadline[]>([])
  const [lastShownId, setLastShownId] = useState<string>('')
  
  // Check for new important news
  useEffect(() => {
    if (newsHeadlines.length === 0) return
    
    // Get the latest news
    const latestNews = newsHeadlines[0]
    
    // Only show if it's new and important
    if (latestNews && latestNews.id !== lastShownId) {
      const headline = latestNews.headline.toUpperCase()
      const isImportant = latestNews.category === 'event' || 
                          headline.includes('!!!') ||
                          headline.includes('BREAKING') ||
                          headline.includes('CRASH') ||
                          headline.includes('SURGES') ||
                          headline.includes('PLUNGES') ||
                          headline.includes('COLLAPSE') ||
                          headline.includes('CRISIS') ||
                          headline.includes('FED RAISES') ||
                          headline.includes('FED CUTS') ||
                          headline.includes('GDP REPORT') ||
                          headline.includes('JOBS REPORT') ||
                          headline.includes('BULLS CHARGE') ||
                          headline.includes('BEARS ATTACK') ||
                          headline.includes('PANIC') ||
                          headline.includes('FREEFALL') ||
                          headline.includes('SOAR') ||
                          headline.includes('EXPLODE') ||
                          headline.includes('BEATS') ||
                          headline.includes('MISSES') ||
                          headline.includes('RAISES FULL-YEAR') ||
                          headline.includes('LOWERS FULL-YEAR')
      
      if (isImportant) {
        setNewsQueue(prev => [...prev, latestNews])
        setLastShownId(latestNews.id)
      }
    }
  }, [newsHeadlines, lastShownId])
  
  // Process queue - show one news at a time
  useEffect(() => {
    if (!visibleNews && newsQueue.length > 0) {
      const [next, ...rest] = newsQueue
      setVisibleNews(next)
      setNewsQueue(rest)
    }
  }, [newsQueue, visibleNews])
  
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (visibleNews) {
      const timer = setTimeout(() => {
        setVisibleNews(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [visibleNews])
  
  if (!visibleNews) return null
  
  const headline = visibleNews.headline.toUpperCase()
  const isNegative = headline.includes('CRASH') || 
                     headline.includes('PLUNGE') || 
                     headline.includes('COLLAPSE') ||
                     headline.includes('CRISIS') ||
                     headline.includes('MISSES') ||
                     headline.includes('LOWERS') ||
                     headline.includes('FREEFALL') ||
                     headline.includes('PANIC') ||
                     headline.includes('BEARS ATTACK') ||
                     headline.includes('BRUTAL') ||
                     headline.includes('TURMOIL')
  
  const isPositive = headline.includes('SURGE') || 
                     headline.includes('RALLY') || 
                     headline.includes('SOAR') ||
                     headline.includes('BEATS') ||
                     headline.includes('RAISES') ||
                     headline.includes('BULLS CHARGE') ||
                     headline.includes('EXPLODE') ||
                     headline.includes('EUPHORIA') ||
                     headline.includes('FRENZY')
  
  const bgColor = isNegative ? 'bg-[#800000]' : isPositive ? 'bg-[#006600]' : 'bg-[#000080]'
  const borderColor = isNegative ? 'border-[#ff0000]' : isPositive ? 'border-[#00ff00]' : 'border-[#0080ff]'
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] pointer-events-none">
      {/* Backdrop with slight dim */}
      <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto" onClick={() => setVisibleNews(null)} />
      
      {/* News Popup */}
      <div 
        className={`relative win95-window pointer-events-auto animate-bounce-in`}
        style={{ 
          width: 500, 
          maxWidth: '90vw',
          animation: 'popIn 0.3s ease-out'
        }}
      >
        {/* Title Bar */}
        <div className={`${bgColor} px-2 py-1 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-white animate-pulse text-lg">⚡</span>
            <span className="text-white font-bold text-sm tracking-wider">
              {visibleNews.category === 'event' ? 'BREAKING NEWS' : 
               visibleNews.category === 'economy' ? 'ECONOMIC ALERT' : 
               'MARKET ALERT'}
            </span>
          </div>
          <button 
            className="win95-titlebar-btn close"
            onClick={() => setVisibleNews(null)}
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className={`bg-black p-4 border-4 ${borderColor}`}>
          {/* Headline */}
          <div className={`text-xl font-bold font-mono mb-3 leading-tight ${
            isNegative ? 'text-[#ff4444]' : isPositive ? 'text-[#44ff44]' : 'text-[#ffff00]'
          }`}>
            {visibleNews.headline}
          </div>
          
          {/* Date */}
          <div className="text-[#808080] font-mono text-sm mb-3">
            {formatDate(visibleNews.date)} | {visibleNews.category.toUpperCase()}
          </div>
          
          {/* Ticker tape effect */}
          <div className="h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" 
               style={{ color: isNegative ? '#ff0000' : isPositive ? '#00ff00' : '#ffff00' }} />
          
          {/* Impact indicator */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isNegative && (
                <span className="text-[#ff0000] font-mono text-sm animate-pulse">
                  ▼▼▼ MARKET IMPACT ▼▼▼
                </span>
              )}
              {isPositive && (
                <span className="text-[#00ff00] font-mono text-sm animate-pulse">
                  ▲▲▲ MARKET IMPACT ▲▲▲
                </span>
              )}
              {!isNegative && !isPositive && (
                <span className="text-[#ffff00] font-mono text-sm">
                  ◆ MARKET UPDATE ◆
                </span>
              )}
            </div>
            
            <div className="text-[#606060] text-xs font-mono">
              Click to dismiss | Auto-close in 5s
            </div>
          </div>
        </div>
        
        {/* Flashing border effect */}
        <div 
          className={`absolute inset-0 pointer-events-none border-2 ${borderColor} animate-pulse`}
          style={{ opacity: 0.5 }}
        />
      </div>
      
      {/* Queue indicator */}
      {newsQueue.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-[#800000] text-white px-3 py-1 text-xs font-mono rounded pointer-events-auto">
          +{newsQueue.length} more alerts
        </div>
      )}
      
      <style>{`
        @keyframes popIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

