import { useGameStore } from '../../store/gameStore'
import { NewsHeadline, Company } from '../../types'

interface Props {
  news: NewsHeadline
  onClose: () => void
}

export default function NewsDetailWindow({ news, onClose }: Props) {
  const { formatDate, companies } = useGameStore()
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return { bg: 'bg-[#006600]', text: 'text-[#00ff00]' }
      case 'company': return { bg: 'bg-[#006666]', text: 'text-[#00ffff]' }
      case 'economy': return { bg: 'bg-[#666600]', text: 'text-[#ffff00]' }
      case 'politics': return { bg: 'bg-[#660066]', text: 'text-[#ff00ff]' }
      case 'event': return { bg: 'bg-[#800000]', text: 'text-[#ff0000]' }
      default: return { bg: 'bg-[#000080]', text: 'text-white' }
    }
  }
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'market': return 'MARKET NEWS'
      case 'company': return 'COMPANY NEWS'
      case 'economy': return 'ECONOMIC NEWS'
      case 'politics': return 'POLITICAL NEWS'
      case 'event': return 'BREAKING NEWS'
      default: return 'NEWS'
    }
  }
  
  const colors = getCategoryColor(news.category)
  const relatedCompany = news.relatedCompany 
    ? companies.find(c => c.ticker === news.relatedCompany)
    : null
    
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[900]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Window */}
      <div 
        className="relative win95-window"
        style={{ width: 500, maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className={`${colors.bg} px-2 py-1 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs">📰</span>
            <span className="text-white font-bold text-sm">{getCategoryLabel(news.category)}</span>
          </div>
          <button 
            className="win95-titlebar-btn close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        {/* Menu Bar */}
        <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-0.5 flex gap-4 text-xs text-black">
          <span className="cursor-pointer hover:underline">File</span>
          <span className="cursor-pointer hover:underline">Edit</span>
          <span className="cursor-pointer hover:underline">View</span>
          <span className="cursor-pointer hover:underline">Help</span>
        </div>
        
        {/* Content */}
        <div className="bg-[#c0c0c0] p-3">
          {/* Headline Box */}
          <div className="bg-white border-2 border-[#808080] p-3 mb-3" style={{ borderStyle: 'inset' }}>
            {/* Category Badge */}
            <div className={`inline-block ${colors.bg} text-white px-2 py-0.5 text-[10px] font-bold mb-2`}>
              {news.category.toUpperCase()}
            </div>
            
            {/* Headline */}
            <h2 className="text-lg font-bold text-black leading-tight mb-2">
              {news.headline}
            </h2>
            
            {/* Meta */}
            <div className="text-xs text-[#606060] flex items-center gap-3">
              <span className="font-mono">{formatDate(news.date)}</span>
              {news.relatedCompany && (
                <>
                  <span>|</span>
                  <span className="text-[#000080] font-bold">{news.relatedCompany}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Article Body */}
          <div className="bg-white border-2 border-[#808080] p-3 mb-3" style={{ borderStyle: 'inset' }}>
            <p className="text-sm text-black leading-relaxed">
              {generateNewsBody(news, companies)}
            </p>
            
            {news.category === 'event' && (
              <div className="mt-3 p-2 bg-[#fff0f0] border border-[#ff0000] text-xs text-black">
                <span className="text-[#ff0000] font-bold">⚠ MARKET IMPACT:</span> This event may significantly affect stock prices and trading conditions.
              </div>
            )}
          </div>
          
          {/* Related Company Info */}
          {relatedCompany && (
            <div className="bg-white border-2 border-[#808080] p-3" style={{ borderStyle: 'inset' }}>
              <div className="font-bold text-[#000080] text-xs mb-2 border-b border-[#e0e0e0] pb-1">
                Related Company
              </div>
              <div className="flex items-center gap-4 text-xs text-black">
                <div>
                  <div className="font-bold">{relatedCompany.ticker}</div>
                  <div className="text-[#606060]">{relatedCompany.name}</div>
                </div>
                <div className="border-l border-[#c0c0c0] pl-4">
                  <div className="text-[#606060]">Price</div>
                  <div className={`font-bold font-mono ${
                    relatedCompany.previousPrice 
                      ? relatedCompany.stockPrice > relatedCompany.previousPrice 
                        ? 'text-[#008000]' 
                        : relatedCompany.stockPrice < relatedCompany.previousPrice 
                          ? 'text-[#ff0000]' 
                          : 'text-black'
                      : 'text-black'
                  }`}>
                    ${relatedCompany.stockPrice.toFixed(2)}
                  </div>
                </div>
                <div className="border-l border-[#c0c0c0] pl-4">
                  <div className="text-[#606060]">Sector</div>
                  <div>{relatedCompany.sector}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Status Bar */}
        <div className="bg-[#c0c0c0] border-t-2 border-[#808080] px-2 py-1 flex items-center justify-between text-[10px] font-mono text-black">
          <span>Press ESC or click outside to close</span>
          <span>{formatDate(news.date)}</span>
        </div>
      </div>
    </div>
  )
}

function generateNewsBody(news: NewsHeadline, companies: Company[]): string {
  // Find related company if any
  const relatedCompany = news.relatedCompany 
    ? companies.find(c => c.ticker === news.relatedCompany)
    : null
    
  const templates: Record<string, string[]> = {
    market: [
      'Market analysts are closely watching developments as trading volumes remain elevated. Institutional investors have been actively repositioning their portfolios in response to changing economic conditions. Technical indicators suggest further volatility may be ahead.',
      'Trading activity has picked up significantly as investors react to the latest market data. Volume across major exchanges has exceeded average levels by a considerable margin. Market makers report increased order flow from both retail and institutional accounts.',
      'Wall Street strategists are revising their forecasts in light of recent market action. The shift in investor sentiment has been notable, with many fund managers adjusting their risk exposure accordingly.'
    ],
    economy: [
      'Federal Reserve officials continue to monitor economic indicators closely. The latest data suggests the economy is performing in line with expectations, though uncertainty remains. Market participants are closely watching for signals of future policy direction.',
      'Economic data released today shows mixed signals for the broader economy. Analysts are divided on the implications for monetary policy going forward. The bond market has reacted with increased volatility.',
      'Treasury yields moved sharply as investors digested the latest economic figures. The data has implications for both equity and fixed income markets as participants reassess growth expectations.'
    ],
    company: [
      relatedCompany 
        ? `${relatedCompany.name} (${relatedCompany.ticker}) continues to navigate a dynamic business environment. Management has outlined strategic priorities focused on sustainable growth and shareholder value creation. Analysts are monitoring key performance metrics closely.`
        : 'Company executives expressed optimism about future growth prospects during recent investor meetings. The firm continues to execute on its strategic initiatives while managing costs effectively.',
      relatedCompany
        ? `Industry observers note significant developments at ${relatedCompany.name} that could have broader implications for the ${relatedCompany.sector} sector. Competitive dynamics remain fluid as market participants assess the company's positioning.`
        : 'Industry observers note significant developments at the company level that could have broader implications for the sector. Competition remains intense across multiple product lines.',
    ],
    politics: [
      'Policy makers in Washington are considering new measures that could impact financial markets. Lobbyists from various industries are actively engaged in the legislative process. Market participants are monitoring developments closely for investment implications.',
      'Regulatory changes under consideration could reshape the competitive landscape for affected industries. Legal experts are analyzing potential impacts while companies prepare contingency plans.',
      'The political landscape continues to evolve with potential implications for corporate America. Investors are weighing the probability and timing of various policy scenarios.'
    ],
    event: [
      'This developing situation has captured the attention of market participants worldwide. Analysts are scrambling to assess the potential impact on asset prices and economic activity. Trading desks report heightened client activity as positions are adjusted.',
      'The unfolding events represent a significant development that could have lasting implications for financial markets and the broader economy. Risk management teams across Wall Street are running scenario analyses.',
      'Markets are responding to the breaking news with increased volatility across asset classes. Liquidity conditions have tightened as market makers widen spreads to manage risk. Investors are seeking safe haven assets amid the uncertainty.'
    ],
  }
  
  const category = news.category || 'market'
  const options = templates[category] || templates.market
  return options[Math.floor(Math.random() * options.length)]
}

