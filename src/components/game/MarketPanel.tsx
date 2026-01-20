import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Sector, Company, GameDate } from '../../types'
import CompanyDetailWindow from './CompanyDetailWindow'

type SortField = 'ticker' | 'price' | 'change' | 'marketCap' | 'pe' | 'div' | 'status'
type ViewMode = 'list' | 'heatmap' | 'sectors'
type ListingFilter = 'all' | 'listed' | 'upcoming'

const SECTORS: Sector[] = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Utilities', 'Real Estate', 'Materials', 'Telecom', 'Transportation', 'Media', 'Retail', 'Defense', 'Agriculture']

const formatListingDate = (date: GameDate): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.month - 1]} ${date.year}`
}

export default function MarketPanel() {
  const { companies, formatMoney, currentDate, gameMode } = useGameStore()
  const [sortField, setSortField] = useState<SortField>('marketCap')
  const [sortDesc, setSortDesc] = useState(true)
  const [filterSector, setFilterSector] = useState<Sector | 'all'>('all')
  const [filterListing, setFilterListing] = useState<ListingFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDesc(!sortDesc)
    else { setSortField(field); setSortDesc(true) }
  }
  
  const filteredCompanies = companies
    .filter(c => filterSector === 'all' || c.sector === filterSector)
    .filter(c => {
      if (filterListing === 'listed') return c.isListed
      if (filterListing === 'upcoming') return !c.isListed
      return true
    })
    .filter(c => searchTerm === '' || c.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Sort unlisted companies to the end when in "all" view
      if (filterListing === 'all') {
        if (a.isListed && !b.isListed) return -1
        if (!a.isListed && b.isListed) return 1
      }
      
      let cmp = 0
      if (sortField === 'ticker') cmp = a.ticker.localeCompare(b.ticker)
      else if (sortField === 'price') cmp = (a.stockPrice || 0) - (b.stockPrice || 0)
      else if (sortField === 'change') {
        const aChange = a.previousPrice ? (a.stockPrice - a.previousPrice) / a.previousPrice : 0
        const bChange = b.previousPrice ? (b.stockPrice - b.previousPrice) / b.previousPrice : 0
        cmp = aChange - bChange
      }
      else if (sortField === 'pe') cmp = a.peRatio - b.peRatio
      else if (sortField === 'div') cmp = a.dividendYield - b.dividendYield
      else if (sortField === 'status') {
        // Sort by listing date for upcoming
        if (!a.isListed && !b.isListed && a.listingDate && b.listingDate) {
          cmp = (a.listingDate.year * 12 + a.listingDate.month) - (b.listingDate.year * 12 + b.listingDate.month)
        } else {
          cmp = (a.isListed ? 1 : 0) - (b.isListed ? 1 : 0)
        }
      }
      else cmp = (a.marketCap || 0) - (b.marketCap || 0)
      return sortDesc ? -cmp : cmp
    })
  
  // Calculate market stats (only for listed companies)
  const listedCompanies = companies.filter(c => c.isListed)
  const upCount = listedCompanies.filter(c => c.stockPrice > c.previousPrice).length
  const downCount = listedCompanies.filter(c => c.stockPrice < c.previousPrice).length
  const unchangedCount = listedCompanies.filter(c => c.stockPrice === c.previousPrice).length
  const upcomingCount = companies.filter(c => !c.isListed).length
  
  return (
    <>
      <div className="h-full flex flex-col bg-black font-mono text-xs">
        {/* Menu Bar - Win95 style */}
        <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 py-0.5 flex items-center gap-1 text-black">
          <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white text-xs">File</button>
          <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white text-xs">View</button>
          <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white text-xs">Trade</button>
          <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white text-xs">Research</button>
          <button className="px-2 py-0.5 hover:bg-[#000080] hover:text-white text-xs">Help</button>
        </div>
        
        {/* Toolbar */}
        <div className="bg-[#c0c0c0] border-b-2 border-[#808080] px-2 py-1 flex items-center gap-2 text-black">
          {/* Search */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-black">Search:</span>
            <input
              type="text"
              className="bg-white border-2 border-[#808080] px-1 py-0.5 w-20 font-mono text-xs text-black"
              style={{ borderStyle: 'inset' }}
              placeholder="Ticker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            />
          </div>
          
          {/* Sector Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-black">Sector:</span>
            <select
              className="bg-white border-2 border-[#808080] px-1 py-0.5 font-mono text-xs text-black"
              style={{ borderStyle: 'inset' }}
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value as Sector | 'all')}
            >
              <option value="all">All Sectors</option>
              {SECTORS.map(sector => <option key={sector} value={sector}>{sector}</option>)}
            </select>
          </div>
          
          {/* Listing Filter */}
          <div className="flex items-center gap-1 ml-2 border-l border-[#808080] pl-2">
            <button 
              className={`win95-btn px-2 py-0.5 text-[10px] ${filterListing === 'all' ? 'bg-[#000080] text-white' : 'text-black'}`}
              onClick={() => setFilterListing('all')}
            >
              All
            </button>
            <button 
              className={`win95-btn px-2 py-0.5 text-[10px] ${filterListing === 'listed' ? 'bg-[#000080] text-white' : 'text-black'}`}
              onClick={() => setFilterListing('listed')}
            >
              Trading
            </button>
            <button 
              className={`win95-btn px-2 py-0.5 text-[10px] ${filterListing === 'upcoming' ? 'bg-[#000080] text-white' : 'text-black'}`}
              onClick={() => setFilterListing('upcoming')}
            >
              {gameMode === 'crypto' ? 'Upcoming' : 'Pre-IPO'}
            </button>
          </div>
          
          {/* Stats */}
          <div className="ml-auto flex items-center gap-2 text-[10px]">
            <span className="text-[#006600]">▲{upCount}</span>
            <span className="text-[#cc0000]">▼{downCount}</span>
            <span className="text-[#606060]">═{unchangedCount}</span>
            {upcomingCount > 0 && <span className="text-[#ff9900]">⏳{upcomingCount}</span>}
            <span className="border-l border-[#808080] pl-2 text-black">
              {filteredCompanies.length}/{companies.length}
            </span>
          </div>
        </div>
        
        {/* Header */}
        <div className="bg-[#000080] text-white px-1 py-0.5 flex items-center border-b border-[#404040]">
          <SortHeader label="TICKER" field="ticker" width="w-14" current={sortField} desc={sortDesc} onClick={handleSort} />
          <span className="flex-1 px-1">COMPANY NAME</span>
          <SortHeader label="SECTOR" field="ticker" width="w-20" current={sortField} desc={sortDesc} onClick={handleSort} />
          <SortHeader label="PRICE" field="price" width="w-16" current={sortField} desc={sortDesc} onClick={handleSort} align="right" />
          <SortHeader label="CHG%" field="change" width="w-14" current={sortField} desc={sortDesc} onClick={handleSort} align="right" />
          <SortHeader label="MKT CAP" field="marketCap" width="w-18" current={sortField} desc={sortDesc} onClick={handleSort} align="right" />
          <SortHeader label="P/E" field="pe" width="w-12" current={sortField} desc={sortDesc} onClick={handleSort} align="right" />
          <SortHeader label="DIV%" field="div" width="w-12" current={sortField} desc={sortDesc} onClick={handleSort} align="right" />
          <span className="w-16 text-right px-1">VOL</span>
        </div>
        
        {/* Table Body */}
        <div className="flex-1 overflow-auto">
          {filteredCompanies.map((company, index) => {
            const change = company.previousPrice ? company.stockPrice - company.previousPrice : 0
            const changePercent = company.previousPrice ? (change / company.previousPrice * 100) : 0
            const isUp = change > 0
            const isDown = change < 0
            const volume = company.isListed ? Math.round(Math.random() * 10000000) : 0
            
            // For unlisted companies
            if (!company.isListed) {
              return (
                <div
                  key={company.id}
                  className={`px-1 py-0.5 flex items-center ${
                    index % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#151515]'
                  } opacity-70`}
                >
                  <div className="w-14 text-[#808080] font-bold">{company.ticker}</div>
                  <div className="flex-1 text-[#808080] truncate pr-1">{company.name}</div>
                  <div className="w-20 text-[#606060]">{company.sector.slice(0, 8)}</div>
                  <div className="w-16 text-right text-[#ff9900] font-bold text-[10px]">
                    {gameMode === 'crypto' ? 'PENDING' : 'PRE-IPO'}
                  </div>
                  <div className="w-14 text-right text-[#ff9900] text-[10px]">
                    {company.listingDate ? formatListingDate(company.listingDate) : '--'}
                  </div>
                  <div className="w-18 text-right text-[#606060]">--</div>
                  <div className="w-12 text-right text-[#606060]">--</div>
                  <div className="w-12 text-right text-[#606060]">--</div>
                  <div className="w-16 text-right text-[#606060]">--</div>
                </div>
              )
            }
            
            return (
              <div
                key={company.id}
                className={`px-1 py-0.5 flex items-center cursor-pointer hover:bg-[#000080] hover:text-white ${
                  index % 2 === 0 ? 'bg-black' : 'bg-[#0a0a0a]'
                } ${selectedCompany?.id === company.id ? 'bg-[#000080] text-white' : ''}`}
                onClick={() => setSelectedCompany(selectedCompany?.id === company.id ? null : company)}
                title="Click to view details"
              >
                <div className="w-14 text-[#00ffff] font-bold">{company.ticker}</div>
                <div className="flex-1 text-white truncate pr-1">{company.name}</div>
                <div className="w-20 text-[#808080]">{company.sector.slice(0, 8)}</div>
                <div className="w-16 text-right text-[#ffff00]">
                  {company.stockPrice < 0.01 
                    ? `$${company.stockPrice.toPrecision(4)}` 
                    : `$${company.stockPrice.toFixed(2)}`}
                </div>
                <div className={`w-14 text-right font-bold ${isUp ? 'text-[#00ff00]' : isDown ? 'text-[#ff0000]' : 'text-[#808080]'}`}>
                  {isUp ? '+' : ''}{changePercent.toFixed(2)}%
                </div>
                <div className="w-18 text-right text-white">{formatMoney(company.marketCap)}</div>
                <div className="w-12 text-right text-[#808080]">{company.peRatio.toFixed(1)}</div>
                <div className="w-12 text-right text-[#808080]">{company.dividendYield.toFixed(1)}%</div>
                <div className="w-16 text-right text-[#606060]">{(volume / 1000000).toFixed(1)}M</div>
              </div>
            )
          })}
        </div>
        
        {/* Status Bar */}
        <div className="bg-[#c0c0c0] border-t-2 border-[#808080] px-2 py-0.5 flex justify-between text-[10px] text-black">
          <div className="flex gap-4">
            <span>Total Market Cap: <b>{formatMoney(listedCompanies.reduce((sum, c) => sum + c.marketCap, 0))}</b></span>
            <span>Listed: <b>{listedCompanies.length}</b></span>
            {upcomingCount > 0 && <span className="text-[#996600]">Upcoming: <b>{upcomingCount}</b></span>}
          </div>
          <div>
            <span className="text-[#606060]">Click company for details</span>
          </div>
        </div>
      </div>
      
      {/* Company Detail Window */}
      {selectedCompany && (
        <CompanyDetailWindow 
          company={selectedCompany} 
          onClose={() => setSelectedCompany(null)} 
        />
      )}
    </>
  )
}

interface SortHeaderProps {
  label: string
  field: SortField
  width: string
  current: SortField
  desc: boolean
  onClick: (field: SortField) => void
  align?: 'left' | 'right'
}

function SortHeader({ label, field, width, current, desc, onClick, align = 'left' }: SortHeaderProps) {
  const isActive = current === field
  return (
    <button 
      className={`${width} text-${align} px-1 hover:bg-[#0000aa] ${isActive ? 'text-yellow-300' : ''}`}
      onClick={() => onClick(field)}
    >
      {label}{isActive && (desc ? '▼' : '▲')}
    </button>
  )
}
