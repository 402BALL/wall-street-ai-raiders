import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { AIPlayer } from '../../types'
import Window95 from '../ui/Window95'

interface AIDetailWindowProps {
  player: AIPlayer
  onClose: () => void
}

export default function AIDetailWindow({ player, onClose }: AIDetailWindowProps) {
  const { companies, aiThoughts, formatMoney } = useGameStore()
  const [activeTab, setActiveTab] = useState<'portfolio' | 'trades' | 'thinking'>('portfolio')
  
  // Get player's holdings with current values
  const holdings = player.portfolio.stocks.map(holding => {
    const company = companies.find(c => c.id === holding.companyId)
    const currentValue = company ? holding.shares * company.stockPrice : 0
    const costBasis = holding.shares * holding.avgPurchasePrice
    const profit = currentValue - costBasis
    const profitPct = costBasis > 0 ? (profit / costBasis) * 100 : 0
    
    return {
      ...holding,
      ticker: company?.ticker || 'UNK',
      name: company?.name || 'Unknown',
      currentPrice: company?.stockPrice || 0,
      currentValue,
      costBasis,
      profit,
      profitPct
    }
  }).sort((a, b) => b.currentValue - a.currentValue)
  
  // Get player's thoughts
  const playerThoughts = aiThoughts
    .filter(t => t.playerId === player.id || t.playerId === player.provider)
    .slice(-20)
    .reverse()
  
  // Calculate totals
  const totalStockValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0)
  const totalProfit = totalStockValue - totalCostBasis
  const totalProfitPct = totalCostBasis > 0 ? (totalProfit / totalCostBasis) * 100 : 0
  
  const getProviderLabel = (provider: string) => {
    switch(provider) {
      case 'claude': return 'CLO'
      case 'gpt': return 'GPT'
      case 'grok': return 'GRK'
      case 'deepseek': return 'DSK'
      default: return 'AI'
    }
  }
  
  return (
    <Window95
      title={`[${getProviderLabel(player.provider)}] ${player.name} - Portfolio`}
      onClose={onClose}
      width={550}
      height={450}
      x={Math.floor(window.innerWidth / 2 - 275)}
      y={Math.floor(window.innerHeight / 2 - 225)}
    >
      <div className="flex-1 bg-[#c0c0c0] flex flex-col text-black font-mono text-xs">
        {/* Player Header */}
        <div className="bg-black p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: player.color + '30', border: `2px solid ${player.color}` }}
            >
              {player.avatar}
            </div>
            <div>
              <div className="text-white font-bold">{player.name}</div>
              <div className="text-[#808080] text-[10px]">[{getProviderLabel(player.provider)}] AI Trader</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#00ff00] font-bold text-sm">{formatMoney(player.netWorth)}</div>
            <div className={`text-[10px] ${totalProfit >= 0 ? 'text-[#00ff00]' : 'text-[#ff0000]'}`}>
              P/L: {totalProfit >= 0 ? '+' : ''}{formatMoney(totalProfit)} ({totalProfitPct.toFixed(2)}%)
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-[#000080] text-white px-2 py-1 flex justify-between text-[10px]">
          <span>Cash: <span className="text-[#ffff00]">{formatMoney(player.cash)}</span></span>
          <span>Stocks: <span className="text-[#00ffff]">{formatMoney(totalStockValue)}</span></span>
          <span>Holdings: <span className="text-white">{holdings.length} positions</span></span>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b-2 border-[#808080]">
          {(['portfolio', 'trades', 'thinking'] as const).map(tab => (
            <button
              key={tab}
              className={`px-3 py-1 text-xs ${activeTab === tab ? 'bg-white border-t-2 border-l-2 border-r-2 border-[#808080] -mb-px' : 'bg-[#c0c0c0]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-2 bg-white border-2 border-[#808080]" style={{ borderStyle: 'inset' }}>
          {activeTab === 'portfolio' && (
            <div>
              {holdings.length === 0 ? (
                <div className="text-[#808080] text-center py-4">No holdings yet</div>
              ) : (
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-[#808080] text-left">
                      <th className="py-1">Ticker</th>
                      <th className="text-right">Shares</th>
                      <th className="text-right">Avg Cost</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Value</th>
                      <th className="text-right">P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => (
                      <tr key={i} className="border-b border-[#e0e0e0] hover:bg-[#e0e0e0]">
                        <td className="py-1 font-bold text-[#000080]">{h.ticker}</td>
                        <td className="text-right">{h.shares.toLocaleString()}</td>
                        <td className="text-right">${h.avgPurchasePrice.toFixed(2)}</td>
                        <td className="text-right">${h.currentPrice.toFixed(2)}</td>
                        <td className="text-right">{formatMoney(h.currentValue)}</td>
                        <td className={`text-right font-bold ${h.profit >= 0 ? 'text-[#008000]' : 'text-[#cc0000]'}`}>
                          {h.profit >= 0 ? '+' : ''}{h.profitPct.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#808080] font-bold">
                      <td colSpan={4} className="py-1">TOTAL</td>
                      <td className="text-right">{formatMoney(totalStockValue)}</td>
                      <td className={`text-right ${totalProfit >= 0 ? 'text-[#008000]' : 'text-[#cc0000]'}`}>
                        {totalProfit >= 0 ? '+' : ''}{totalProfitPct.toFixed(1)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          )}
          
          {activeTab === 'trades' && (
            <div className="space-y-1">
              <div className="text-[#808080] border-b border-[#808080] pb-1 mb-2">Recent Actions</div>
              {player.lastAction ? (
                <div className="p-2 bg-[#f0f0f0] border border-[#808080]">
                  <span className="text-[#000080] font-bold">Latest: </span>
                  <span>{player.lastAction}</span>
                </div>
              ) : (
                <div className="text-[#808080]">No trades yet</div>
              )}
              
              {/* Trade markers from companies */}
              <div className="mt-3 text-[#808080] border-b border-[#808080] pb-1 mb-2">Trade History</div>
              {companies
                .flatMap(c => c.tradeMarkers
                  .filter(m => m.playerId === player.id)
                  .map(m => ({ ...m, ticker: c.ticker }))
                )
                .sort((a, b) => (b.date.year * 12 + b.date.month) - (a.date.year * 12 + a.date.month))
                .slice(0, 15)
                .map((trade, i) => (
                  <div key={i} className={`py-1 border-b border-[#e0e0e0] flex justify-between ${trade.type === 'buy' ? 'text-[#008000]' : 'text-[#cc0000]'}`}>
                    <span>{trade.type.toUpperCase()} {trade.shares.toLocaleString()} {trade.ticker}</span>
                    <span>@ ${trade.price.toFixed(2)}</span>
                  </div>
                ))
              }
            </div>
          )}
          
          {activeTab === 'thinking' && (
            <div className="space-y-2">
              {player.thinking && (
                <div className="p-2 bg-black text-white border border-[#808080]">
                  <div className="text-[#00ffff] text-[10px] mb-1">Current Thought:</div>
                  <div style={{ color: player.color }}>{player.thinking}<span className="animate-pulse">_</span></div>
                </div>
              )}
              
              <div className="text-[#808080] border-b border-[#808080] pb-1">Thought History</div>
              {playerThoughts.length === 0 ? (
                <div className="text-[#808080]">No thoughts recorded yet</div>
              ) : (
                playerThoughts.map((thought, i) => (
                  <div key={i} className="p-1 border-b border-[#e0e0e0] text-[10px]">
                    <span className="text-[#808080]">[{thought.phase}] </span>
                    <span>{thought.content}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-2 p-2 border-t border-[#808080]">
          <button className="win95-btn px-4 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </Window95>
  )
}

