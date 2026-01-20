import { useState, useEffect } from 'react'
import { Company } from '../../types'
import { useGameStore } from '../../store/gameStore'
import LiveCandlestickChart from './LiveCandlestickChart'

interface Props {
  company: Company
  onClose: () => void
}

type Tab = 'overview' | 'chart' | 'financials' | 'news' | 'trade' | 'research'

export default function CompanyDetailWindow({ company, onClose }: Props) {
  const { formatMoney, players, currentDate, formatDate, companies } = useGameStore()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [position, setPosition] = useState({ x: Math.max(50, (window.innerWidth - 750) / 2), y: Math.max(30, (window.innerHeight - 550) / 2) })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Get live company data from store (updates in real-time)
  // Try to find by ID first, then by ticker as fallback
  const liveCompany = companies.find(c => c.id === company.id) 
    || companies.find(c => c.ticker === company.ticker) 
    || company
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
  }
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragOffset.x, y: Math.max(0, e.clientY - dragOffset.y) })
      }
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
  }, [isDragging, dragOffset])
  
  const change = liveCompany.stockPrice - liveCompany.previousPrice
  const changePercent = liveCompany.previousPrice > 0 ? (change / liveCompany.previousPrice * 100) : 0
  const isUp = change >= 0
  
  // Find if any AI owns this company
  const owner = players.find(p => p.portfolio.stocks.some(s => s.companyId === liveCompany.id))
  
  // Calculate 52-week high/low from price history
  const priceHigh = liveCompany.priceHistory.length > 0 
    ? Math.max(...liveCompany.priceHistory.slice(-12).map(p => p.high)) 
    : liveCompany.stockPrice * 1.2
  const priceLow = liveCompany.priceHistory.length > 0 
    ? Math.min(...liveCompany.priceHistory.slice(-12).map(p => p.low)) 
    : liveCompany.stockPrice * 0.7
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30"
        style={{ zIndex: 199 }}
        onClick={onClose}
      />
      <div 
        className="fixed win95-window flex flex-col"
        style={{ left: position.x, top: position.y, width: 750, height: 550, zIndex: 200 }}
      >
      {/* Title Bar */}
      <div 
        className="win95-titlebar cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-bold">{liveCompany.ticker} - {liveCompany.name}</span>
        <div className="flex gap-px">
          <button className="win95-titlebar-btn">_</button>
          <button className="win95-titlebar-btn">□</button>
          <button className="win95-titlebar-btn close" onClick={onClose}>×</button>
        </div>
      </div>
      
      {/* Menu Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 flex items-center text-xs text-black">
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white">Trade</button>
      </div>
      
      {/* Tabs */}
      <div className="bg-[#c0c0c0] flex border-b-2 border-[#808080]">
        {(['overview', 'chart', 'financials', 'news', 'trade', 'research'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`px-3 py-1 text-xs border-r border-[#808080] text-black font-semibold ${
              activeTab === tab 
                ? 'bg-white border-t-2 border-t-[#c0c0c0] -mb-px' 
                : 'bg-[#c0c0c0] hover:bg-[#d4d4d4]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-[#c0c0c0] p-2 overflow-auto">
        {activeTab === 'overview' && (
          <div className="flex gap-2 h-full">
            {/* Left - Quote Box */}
            <div className="w-52 space-y-2">
              <div className="bg-black p-2 border-2 border-[#808080]" style={{ borderStyle: 'inset' }}>
                <div className="text-[#00ffff] font-mono text-lg font-bold">{liveCompany.ticker}</div>
                <div className="text-[#ffff00] font-mono text-2xl font-bold">${liveCompany.stockPrice.toFixed(2)}</div>
                <div className={`font-mono text-sm ${isUp ? 'text-[#00ff00]' : 'text-[#ff0000]'}`}>
                  {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
                </div>
                <div className="text-[#808080] font-mono text-xs mt-2">
                  {formatDate(currentDate)}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
                <div className="font-bold border-b border-[#808080] pb-1 mb-1 text-black">Quick Stats</div>
                <StatRow label="Market Cap" value={formatMoney(liveCompany.marketCap || 0)} />
                <StatRow label="P/E Ratio" value={(liveCompany.peRatio || 0).toFixed(2)} />
                <StatRow label="Div Yield" value={`${(liveCompany.dividendYield || 0).toFixed(2)}%`} />
                <StatRow label="Shares Out" value={`${((liveCompany.sharesOutstanding || 0) / 1e6).toFixed(1)}M`} />
                <StatRow label="52W High" value={`$${priceHigh.toFixed(2)}`} />
                <StatRow label="52W Low" value={`$${priceLow.toFixed(2)}`} />
              </div>
            </div>
            
            {/* Right - Company Info */}
            <div className="flex-1 space-y-2">
              {/* Company Profile */}
              <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
                <div className="font-bold border-b border-[#808080] pb-1 mb-1 text-black">Company Profile</div>
                <div className="grid grid-cols-2 gap-x-4">
                  <StatRow label="Sector" value={liveCompany.sector || 'N/A'} />
                  <StatRow label="Headquarters" value={liveCompany.headquarters || 'N/A'} />
                  <StatRow label="Employees" value={(liveCompany.employees || 0).toLocaleString()} />
                  <StatRow label="Founded" value={(liveCompany.founded || 0).toString()} />
                  <StatRow label="CEO" value={liveCompany.ceo || 'N/A'} />
                </div>
                {liveCompany.description ? (
                  <div className="mt-2 pt-2 border-t border-[#e0e0e0] text-[10px] text-[#404040] leading-relaxed">
                    {liveCompany.description}
                  </div>
                ) : null}
              </div>
              
              {/* Financials Summary */}
              <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
                <div className="font-bold border-b border-[#808080] pb-1 mb-1 text-black">Financial Summary</div>
                <div className="grid grid-cols-2 gap-x-4">
                  <StatRow label="Revenue" value={formatMoney(liveCompany.revenue || 0)} />
                  <StatRow label="Net Income" value={formatMoney(liveCompany.profit || 0)} />
                  <StatRow label="Cash" value={formatMoney(liveCompany.cash || 0)} />
                  <StatRow label="Long-term Debt" value={formatMoney(liveCompany.debt || 0)} />
                  <StatRow label="Debt/Equity" value={`${(((liveCompany.debt || 0) / ((liveCompany.marketCap || 1) * 0.5)) * 100).toFixed(1)}%`} />
                  <StatRow label="Profit Margin" value={`${(((liveCompany.profit || 0) / (liveCompany.revenue || 1)) * 100).toFixed(1)}%`} />
                </div>
              </div>
              
              {/* Ownership */}
              <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
                <div className="font-bold border-b border-[#808080] pb-1 mb-1 text-black">Ownership</div>
                {owner ? (
                  <div className="flex items-center gap-2">
                    <span style={{ color: owner.color }} className="font-bold">{owner.name}</span>
                    <span className="text-black">owns {(liveCompany.ownershipPercentage ?? 0).toFixed(1)}%</span>
                  </div>
                ) : (
                  <span className="text-[#606060]">No controlling shareholder</span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'chart' && (
          <div className="h-full flex flex-col">
            {/* Live Candlestick Chart - updates in real-time */}
            <div className="flex-1 bg-black border-2 border-[#004400]">
              <LiveCandlestickChart 
                priceHistory={liveCompany.priceHistory}
                tradeMarkers={liveCompany.tradeMarkers}
                ticker={liveCompany.ticker}
                currentPrice={liveCompany.stockPrice}
                currentDate={currentDate}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'financials' && (
          <div className="space-y-2">
            {/* Income Statement */}
            <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
              <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Income Statement (Annual, $MM)</div>
              <table className="w-full text-black">
                <thead>
                  <tr className="border-b border-[#808080]">
                    <th className="text-left py-1 text-black">Item</th>
                    <th className="text-right text-black">{currentDate.year}</th>
                    <th className="text-right text-black">{currentDate.year - 1}</th>
                    <th className="text-right text-black">{currentDate.year - 2}</th>
                  </tr>
                </thead>
                <tbody>
                  <FinancialRow label="Revenue" values={[liveCompany.revenue, liveCompany.revenue * 0.92, liveCompany.revenue * 0.85]} format={formatMillions} />
                  <FinancialRow label="Cost of Revenue" values={[liveCompany.revenue * 0.65, liveCompany.revenue * 0.63, liveCompany.revenue * 0.61]} format={formatMillions} />
                  <FinancialRow label="Gross Profit" values={[liveCompany.revenue * 0.35, liveCompany.revenue * 0.29, liveCompany.revenue * 0.24]} format={formatMillions} />
                  <FinancialRow label="Operating Expenses" values={[liveCompany.revenue * 0.18, liveCompany.revenue * 0.17, liveCompany.revenue * 0.16]} format={formatMillions} />
                  <FinancialRow label="Operating Income" values={[liveCompany.profit * 1.2, liveCompany.profit * 1.05, liveCompany.profit * 0.9]} format={formatMillions} />
                  <FinancialRow label="Interest Expense" values={[liveCompany.debt * 0.08, liveCompany.debt * 0.085, liveCompany.debt * 0.09]} format={formatMillions} />
                  <FinancialRow label="Net Income" values={[liveCompany.profit, liveCompany.profit * 0.88, liveCompany.profit * 0.75]} format={formatMillions} bold />
                  <FinancialRow label="EPS" values={[
                    liveCompany.profit / (liveCompany.sharesOutstanding / 1e6),
                    liveCompany.profit * 0.88 / (liveCompany.sharesOutstanding / 1e6),
                    liveCompany.profit * 0.75 / (liveCompany.sharesOutstanding / 1e6)
                  ]} format={(n) => `$${(n / 1e6).toFixed(2)}`} />
                </tbody>
              </table>
            </div>
            
            {/* Balance Sheet */}
            <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
              <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Balance Sheet ($MM)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-[#000080] mb-1">Assets</div>
                  <StatRow label="Cash & Equivalents" value={formatMillions(liveCompany.cash)} />
                  <StatRow label="Short-term Investments" value={formatMillions(liveCompany.cash * 0.3)} />
                  <StatRow label="Accounts Receivable" value={formatMillions(liveCompany.revenue * 0.12)} />
                  <StatRow label="Inventory" value={formatMillions(liveCompany.revenue * 0.08)} />
                  <StatRow label="Property & Equipment" value={formatMillions(liveCompany.marketCap * 0.35)} />
                  <div className="border-t border-[#808080] mt-1 pt-1">
                    <StatRow label="Total Assets" value={formatMillions(liveCompany.marketCap * 0.8)} />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#000080] mb-1">Liabilities & Equity</div>
                  <StatRow label="Accounts Payable" value={formatMillions(liveCompany.revenue * 0.05)} />
                  <StatRow label="Short-term Debt" value={formatMillions(liveCompany.debt * 0.15)} />
                  <StatRow label="Long-term Debt" value={formatMillions(liveCompany.debt)} />
                  <StatRow label="Other Liabilities" value={formatMillions(liveCompany.debt * 0.2)} />
                  <div className="border-t border-[#808080] mt-1 pt-1">
                    <StatRow label="Total Liabilities" value={formatMillions(liveCompany.debt * 1.35)} />
                    <StatRow label="Shareholders Equity" value={formatMillions(liveCompany.marketCap * 0.45)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Ratios */}
            <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
              <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Key Financial Ratios</div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-[#606060]">P/E Ratio</div>
                  <div className="font-mono font-bold text-black">{liveCompany.peRatio.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[#606060]">Price/Book</div>
                  <div className="font-mono font-bold text-black">{(liveCompany.marketCap / (liveCompany.marketCap * 0.45)).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[#606060]">ROE</div>
                  <div className="font-mono font-bold text-black">{((liveCompany.profit / (liveCompany.marketCap * 0.45)) * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[#606060]">Debt/Equity</div>
                  <div className="font-mono font-bold text-black">{((liveCompany.debt / (liveCompany.marketCap * 0.45)) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'news' && (
          <div className="bg-white border-2 border-[#808080] p-2 text-xs h-full overflow-auto text-black" style={{ borderStyle: 'inset' }}>
            <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Recent News - {liveCompany.ticker}</div>
            {generateCompanyNews(liveCompany, currentDate).map((news, i) => (
              <div key={i} className="py-1 border-b border-[#e0e0e0] cursor-pointer hover:bg-[#e0e0e0]">
                <span className="text-[#606060]">[{news.date}]</span>
                <span className={`ml-2 ${news.impact === 'positive' ? 'text-[#006600]' : news.impact === 'negative' ? 'text-[#cc0000]' : 'text-black'}`}>
                  {news.headline}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'trade' && (
          <div className="flex gap-4">
            {/* Order Form */}
            <div className="w-64 bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
              <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Place Order</div>
              
              <div className="space-y-2">
                <div>
                  <label className="block mb-1 text-black">Action:</label>
                  <select className="w-full border border-[#808080] p-1 bg-white text-black">
                    <option>Buy</option>
                    <option>Sell</option>
                    <option>Short</option>
                    <option>Cover</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 text-black">Order Type:</label>
                  <select className="w-full border border-[#808080] p-1 bg-white text-black">
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop</option>
                    <option>Stop Limit</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 text-black">Quantity:</label>
                  <input type="number" className="w-full border border-[#808080] p-1 bg-white text-black" defaultValue={100} />
                </div>
                
                <div>
                  <label className="block mb-1 text-black">Limit Price:</label>
                  <input type="number" className="w-full border border-[#808080] p-1 bg-white text-black" defaultValue={liveCompany.stockPrice.toFixed(2)} step="0.125" />
                </div>
                
                <div className="border-t border-[#808080] pt-2 mt-2">
                  <div className="flex justify-between mb-1 text-black">
                    <span>Est. Total:</span>
                    <span className="font-bold">${(liveCompany.stockPrice * 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1 text-[#606060]">
                    <span>Commission:</span>
                    <span>$29.95</span>
                  </div>
                </div>
                
                <button className="win95-btn w-full py-1 font-bold bg-[#008000] text-white">
                  Submit Order
                </button>
              </div>
            </div>
            
            {/* Order Book / Level 2 */}
            <div className="flex-1 space-y-2">
              <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
                <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Level II Quotes</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-center text-[#008000] font-bold mb-1">BID</div>
                    {[0, 0.125, 0.25, 0.375, 0.5].map((offset, i) => (
                      <div key={i} className="flex justify-between text-[#008000]">
                        <span>${(liveCompany.stockPrice - offset).toFixed(3)}</span>
                        <span>{Math.round(Math.random() * 5000 + 1000)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-center text-[#ff0000] font-bold mb-1">ASK</div>
                    {[0.125, 0.25, 0.375, 0.5, 0.625].map((offset, i) => (
                      <div key={i} className="flex justify-between text-[#ff0000]">
                        <span>${(liveCompany.stockPrice + offset).toFixed(3)}</span>
                        <span>{Math.round(Math.random() * 5000 + 1000)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white border-2 border-[#808080] p-2 text-xs text-black" style={{ borderStyle: 'inset' }}>
                <div className="font-bold border-b border-[#808080] pb-1 mb-2 text-black">Open Orders</div>
                <div className="text-[#606060] text-center py-4">
                  No open orders for this security
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'research' && (
          <div className="bg-white border-2 border-[#808080] p-2 text-xs h-full overflow-auto text-black" style={{ borderStyle: 'inset' }}>
            <div className="font-bold text-lg border-b-2 border-[#000080] pb-1 mb-2 text-black">
              Research Report: {liveCompany.name} ({liveCompany.ticker})
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="bg-[#008000] text-white px-4 py-2 text-center">
                <div className="text-lg font-bold">BUY</div>
                <div className="text-[10px]">Recommendation</div>
              </div>
              <div className="bg-[#e0e0e0] px-4 py-2 text-center text-black">
                <div className="text-lg font-bold">${(liveCompany.stockPrice * 1.15).toFixed(2)}</div>
                <div className="text-[10px]">Price Target</div>
              </div>
              <div className="bg-[#e0e0e0] px-4 py-2 text-center text-black">
                <div className="text-lg font-bold">{((liveCompany.stockPrice * 1.15 / liveCompany.stockPrice - 1) * 100).toFixed(1)}%</div>
                <div className="text-[10px]">Upside</div>
              </div>
              <div className="bg-[#e0e0e0] px-4 py-2 text-center text-black">
                <div className="text-lg font-bold">Medium</div>
                <div className="text-[10px]">Risk Level</div>
              </div>
            </div>
            
            <div className="space-y-3 text-black">
              <div>
                <div className="font-bold text-[#000080]">Company Overview</div>
                <p className="mt-1 text-black">
                  {liveCompany.description || `${liveCompany.name} is a ${liveCompany.sector.toLowerCase()} company headquartered in ${liveCompany.headquarters || 'the United States'}. Founded in ${liveCompany.founded}, the company has grown to employ approximately ${liveCompany.employees.toLocaleString()} people worldwide.`}
                </p>
              </div>
              
              <div>
                <div className="font-bold text-[#000080]">Investment Thesis</div>
                <p className="mt-1 text-black">
                  Under the leadership of CEO {liveCompany.ceo}, {liveCompany.name} has demonstrated 
                  {liveCompany.profit > liveCompany.revenue * 0.1 ? ' strong profitability' : ' improving operational efficiency'} 
                  with a profit margin of {((liveCompany.profit / liveCompany.revenue) * 100).toFixed(1)}%. 
                  The company maintains a {liveCompany.dividendYield > 3 ? 'generous' : 'modest'} dividend yield of {liveCompany.dividendYield.toFixed(2)}%, 
                  making it {liveCompany.dividendYield > 3 ? 'attractive for income investors' : 'suitable for growth-oriented portfolios'}.
                </p>
              </div>
              
              <div>
                <div className="font-bold text-[#000080]">Key Strengths</div>
                <ul className="list-disc list-inside mt-1 text-black">
                  <li>Strong market position in the {liveCompany.sector} sector</li>
                  <li>Experienced leadership under {liveCompany.ceo}</li>
                  <li>Solid balance sheet with {formatMillions(liveCompany.cash)} in cash reserves</li>
                  {liveCompany.dividendYield > 2 && <li>Attractive dividend yield of {liveCompany.dividendYield.toFixed(2)}%</li>}
                  <li>P/E ratio of {liveCompany.peRatio.toFixed(1)}x {liveCompany.peRatio < 15 ? 'suggests undervaluation' : 'reflects growth expectations'}</li>
                </ul>
              </div>
              
              <div>
                <div className="font-bold text-[#000080]">Risk Factors</div>
                <ul className="list-disc list-inside mt-1 text-black">
                  <li>Market volatility and macroeconomic uncertainty</li>
                  <li>Competitive pressure in the {liveCompany.sector.toLowerCase()} industry</li>
                  {liveCompany.debt > liveCompany.cash * 2 && <li>Elevated debt levels ({formatMillions(liveCompany.debt)} in long-term debt)</li>}
                  <li>Regulatory and political risks</li>
                  <li>Potential for sector-wide downturns</li>
                </ul>
              </div>
              
              <div>
                <div className="font-bold text-[#000080]">Analyst Consensus</div>
                <div className="mt-1 flex items-center gap-4 text-black">
                  <div className="flex-1 bg-[#e0e0e0] h-4 rounded">
                    <div className="bg-[#008000] h-4 rounded" style={{ width: '65%' }} />
                  </div>
                  <span>65% Buy, 25% Hold, 10% Sell</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="bg-[#c0c0c0] border-t-2 border-[#808080] px-2 py-0.5 text-[10px] flex justify-between text-black">
        <span>Last Updated: {formatDate(currentDate)}</span>
        <span>{liveCompany.headquarters}</span>
        <span>Press F1 for Help</span>
      </div>
    </div>
    </>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-[#606060]">{label}:</span>
      <span className="font-mono text-black font-semibold">{value}</span>
    </div>
  )
}

function FinancialRow({ label, values, format, bold = false }: { label: string; values: number[]; format: (n: number) => string; bold?: boolean }) {
  return (
    <tr className={`text-black ${bold ? 'font-bold bg-[#e0e0e0]' : ''}`}>
      <td className="py-0.5 text-black">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="text-right font-mono text-black">{format(v)}</td>
      ))}
    </tr>
  )
}

function formatMillions(value: number): string {
  const millions = value / 1_000_000
  if (millions >= 1000) {
    return `$${(millions / 1000).toFixed(1)}B`
  }
  return `$${millions.toFixed(0)}M`
}

function generateCompanyNews(company: Company, currentDate: { year: number; month: number }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = months[currentDate.month - 1]
  const prevMonth = months[(currentDate.month + 10) % 12]
  
  type NewsImpact = 'positive' | 'negative' | 'neutral'
  
  const newsTemplates: { date: string; headline: string; impact: NewsImpact }[] = [
    { date: `${currentMonth} 15`, headline: `${company.name} reports quarterly earnings above expectations`, impact: 'positive' },
    { date: `${currentMonth} 12`, headline: `Analyst downgrades ${company.ticker} on valuation concerns`, impact: 'negative' },
    { date: `${currentMonth} 10`, headline: `Analyst upgrades ${company.ticker} rating`, impact: 'positive' },
    { date: `${currentMonth} 05`, headline: `${company.ceo || 'CEO'} discusses growth strategy at industry conference`, impact: 'neutral' },
    { date: `${prevMonth} 28`, headline: `${company.name} announces expansion plans`, impact: 'positive' },
    { date: `${prevMonth} 22`, headline: `${company.ticker} faces regulatory scrutiny`, impact: 'negative' },
    { date: `${prevMonth} 20`, headline: `${company.ticker} included in index rebalancing`, impact: 'positive' },
    { date: `${prevMonth} 15`, headline: `${company.sector} sector outlook revised by major bank`, impact: 'neutral' },
    { date: `${prevMonth} 08`, headline: `${company.name} secures new contract worth $${Math.round((company.revenue || 0) * 0.05 / 1e6)}M`, impact: 'positive' },
    { date: `${prevMonth} 01`, headline: `Institutional investors increase holdings in ${company.ticker}`, impact: 'positive' },
  ]
  
  return newsTemplates
}
