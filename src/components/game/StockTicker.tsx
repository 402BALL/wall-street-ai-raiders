import { useGameStore } from '../../store/gameStore'

export default function StockTicker() {
  const { companies } = useGameStore()
  
  const tickerCompanies = [...companies].sort((a, b) => b.marketCap - a.marketCap).slice(0, 30)
  
  return (
    <div className="h-full flex items-center overflow-hidden font-mono text-xs">
      <div className="stock-ticker whitespace-nowrap flex items-center gap-4 px-2">
        {[...tickerCompanies, ...tickerCompanies].map((company, index) => {
          const change = company.stockPrice - company.previousPrice
          const changePercent = (change / company.previousPrice * 100).toFixed(2)
          const isUp = change > 0
          const isDown = change < 0
          
          return (
            <span key={`${company.id}-${index}`} className="flex items-center gap-1">
              <span className="text-[#00ffff] font-bold">{company.ticker}</span>
              <span className="text-[#ffff00]">${company.stockPrice.toFixed(2)}</span>
              <span className={isUp ? 'text-[#00ff00]' : isDown ? 'text-[#ff0000]' : 'text-[#808080]'}>
                {isUp ? '+' : ''}{changePercent}%{isUp ? '^' : isDown ? 'v' : '='}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
