import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useGameStore } from '../../store/gameStore'
import { NewsHeadline } from '../../types'
import NewsDetailWindow from './NewsDetailWindow'

export default function NewsPanel() {
  const { newsHeadlines, formatDate } = useGameStore()
  const [selectedNews, setSelectedNews] = useState<NewsHeadline | null>(null)
  const [filter, setFilter] = useState<string>('all')
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'market': return '[MKT]'
      case 'company': return '[CO.]'
      case 'economy': return '[ECO]'
      case 'politics': return '[POL]'
      case 'event': return '[!!!]'
      default: return '[---]'
    }
  }
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return 'text-[#00ff00]'
      case 'company': return 'text-[#00ffff]'
      case 'economy': return 'text-[#ffff00]'
      case 'politics': return 'text-[#ff00ff]'
      case 'event': return 'text-[#ff0000]'
      default: return 'text-white'
    }
  }
  
  const filteredNews = filter === 'all' 
    ? newsHeadlines 
    : newsHeadlines.filter(n => n.category === filter)
  
  return (
    <div className="h-full flex flex-col bg-black font-mono text-xs">
      {/* Header */}
      <div className="bg-[#800000] text-white px-2 py-1 border-b border-[#808080] flex items-center justify-between">
        <span className="font-bold tracking-wider">══ FINANCIAL NEWS ══</span>
        <span className="text-[#ffff00] animate-pulse">LIVE</span>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-[#c0c0c0] px-1 py-0.5 flex gap-1 border-b border-[#808080]">
        {['all', 'market', 'economy', 'company', 'politics', 'event'].map(cat => (
          <button
            key={cat}
            className={`px-1 py-0.5 text-[10px] ${filter === cat ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#d4d4d4]'}`}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
      
      {/* News List */}
      <div className="flex-1 overflow-auto p-1 space-y-0.5">
        {filteredNews.slice(0, 50).map((news) => (
          <div
            key={news.id}
            className={`px-1 py-0.5 cursor-pointer hover:bg-[#000080] hover:text-white border-l-2 ${
              news.category === 'event' ? 'border-[#ff0000] bg-[#200000]' : 'border-[#404040]'
            } ${selectedNews?.id === news.id ? 'bg-[#000080] text-white' : ''}`}
            onClick={() => setSelectedNews(selectedNews?.id === news.id ? null : news)}
          >
            <div className="flex items-start gap-1">
              <span className={`${getCategoryColor(news.category)} shrink-0`}>
                {getCategoryLabel(news.category)}
              </span>
              <span className="text-white leading-tight">{news.headline}</span>
            </div>
            <div className="text-[#606060] text-[10px] pl-6">
              {formatDate(news.date)}
            </div>
          </div>
        ))}
        
        {filteredNews.length === 0 && (
          <div className="text-[#606060] text-center py-4">
            No news matching filter...
          </div>
        )}
      </div>
      
      {/* News Detail Window (Portal) */}
      {selectedNews && createPortal(
        <NewsDetailWindow 
          news={selectedNews} 
          onClose={() => setSelectedNews(null)} 
        />,
        document.body
      )}
      
      {/* Ticker Tape */}
      <div className="h-5 bg-[#000080] border-t border-[#808080] overflow-hidden flex items-center">
        <div className="stock-ticker whitespace-nowrap text-[10px]">
          <span className="text-[#ffff00] mx-4">*** WALL STREET AI RAIDERS ***</span>
          <span className="text-white mx-4">4 AI TITANS COMPETE FOR SUPREMACY</span>
          <span className="text-[#00ff00] mx-4">$4 BILLION IN PLAY</span>
          <span className="text-[#00ffff] mx-4">WHO WILL DOMINATE?</span>
        </div>
      </div>
    </div>
  )
}
