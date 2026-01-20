import { useState } from 'react'

export type GameMode = 'classic' | 'modern' | 'crypto'

interface GameModeConfig {
  id: GameMode
  name: string
  period: string
  description: string
  icon: string
  assets: string
}

const gameModes: GameModeConfig[] = [
  {
    id: 'classic',
    name: 'Classic Wall Street',
    period: '1985 - 2010',
    description: 'Experience the golden era of Wall Street. Trade through Black Monday, the Dot-com bubble, and the 2008 Financial Crisis.',
    icon: '[$]',
    assets: '30 Classic Stocks (IBM, GE, Coca-Cola...)'
  },
  {
    id: 'modern',
    name: 'Modern Markets',
    period: '2010 - 2026',
    description: 'Navigate the age of tech giants, meme stocks, and AI revolution. From recovery to new highs.',
    icon: '[M]',
    assets: '30 Modern Stocks (AAPL, TSLA, NVDA...)'
  },
  {
    id: 'crypto',
    name: 'Crypto Wars',
    period: '2009 - 2026',
    description: 'Enter the wild west of digital assets. From Bitcoin genesis to the DeFi revolution. Extreme volatility.',
    icon: '[₿]',
    assets: '25 Cryptocurrencies (BTC, ETH, SOL...)'
  }
]

interface Props {
  onSelectMode: (mode: GameMode) => void
  onClose: () => void
}

export default function GameModeMenu({ onSelectMode, onClose }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic')
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <div 
        className="fixed inset-0 flex items-end justify-start p-1"
        style={{ background: '#008080' }}
      >
        <button 
          className="win95-btn px-3 py-1 text-xs flex items-center gap-1"
          onClick={() => setIsMinimized(false)}
        >
          <span className="font-bold">[$]</span>
          <span>Wall Street AI Raiders</span>
        </button>
      </div>
    )
  }

  const selectedModeConfig = gameModes.find(m => m.id === selectedMode)!

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#008080' }}
    >
      {/* Main Window */}
      <div 
        className="win95-window"
        style={{ width: 580, maxWidth: '95vw' }}
      >
        {/* Title Bar */}
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-bold">[$]</span>
            <span className="text-white text-xs font-bold">Wall Street AI Raiders - Select Game Mode</span>
          </div>
          <div className="flex gap-0.5">
            <button 
              className="w-4 h-4 bg-[#c0c0c0] border border-[#ffffff] border-r-[#808080] border-b-[#808080] text-[10px] flex items-center justify-center font-bold active:border-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              onClick={() => setIsMinimized(true)}
              title="Minimize"
            >
              _
            </button>
            <button 
              className="w-4 h-4 bg-[#c0c0c0] border border-[#ffffff] border-r-[#808080] border-b-[#808080] text-[10px] flex items-center justify-center font-bold active:border-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              title="Maximize"
            >
              □
            </button>
            <button 
              className="w-4 h-4 bg-[#c0c0c0] border border-[#ffffff] border-r-[#808080] border-b-[#808080] text-[10px] flex items-center justify-center font-bold active:border-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              onClick={onClose}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#c0c0c0] p-4">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-12 h-12 flex items-center justify-center text-2xl font-bold bg-[#000080] text-[#00ff00]"
              style={{ 
                border: '2px solid',
                borderColor: '#808080 #ffffff #ffffff #808080'
              }}
            >
              W$
            </div>
            <div>
              <div className="text-sm font-bold text-black mb-1">Select a game mode to begin the simulation:</div>
              <div className="text-xs text-[#404040]">4 AI competitors will trade for 25+ years. Highest net worth wins!</div>
            </div>
          </div>

          {/* Mode Selection Group Box */}
          <fieldset 
            className="border-2 p-3 mb-4"
            style={{ borderColor: '#808080 #ffffff #ffffff #808080' }}
          >
            <legend className="text-xs font-bold text-black px-1">Game Modes</legend>
            
            <div className="space-y-2">
              {gameModes.map((mode) => (
                <label
                  key={mode.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#000080] hover:text-white p-1 text-black"
                  onClick={() => setSelectedMode(mode.id)}
                >
                  {/* Radio Button */}
                  <div 
                    className="w-4 h-4 rounded-full bg-white flex items-center justify-center"
                    style={{ 
                      border: '2px solid',
                      borderColor: '#808080 #ffffff #ffffff #808080'
                    }}
                  >
                    {selectedMode === mode.id && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>
                  
                  {/* Icon */}
                  <span className="font-mono text-xs w-6">{mode.icon}</span>
                  
                  {/* Name and Period */}
                  <span className="text-xs font-bold">{mode.name}</span>
                  <span className="text-xs text-[#808080]">({mode.period})</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Details Group Box */}
          <fieldset 
            className="border-2 p-3 mb-4"
            style={{ borderColor: '#808080 #ffffff #ffffff #808080' }}
          >
            <legend className="text-xs font-bold text-black px-1">Mode Details</legend>
            
            <div className="space-y-2 text-xs text-black">
              <div className="flex">
                <span className="w-20 font-bold">Name:</span>
                <span>{selectedModeConfig.name}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-bold">Period:</span>
                <span>{selectedModeConfig.period}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-bold">Assets:</span>
                <span>{selectedModeConfig.assets}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-bold shrink-0">Description:</span>
                <span>{selectedModeConfig.description}</span>
              </div>
            </div>
          </fieldset>

          {/* Game Info Group Box */}
          <fieldset 
            className="border-2 p-3 mb-4"
            style={{ borderColor: '#808080 #ffffff #ffffff #808080' }}
          >
            <legend className="text-xs font-bold text-black px-1">Game Information</legend>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-black">
              <div><span className="font-bold">Players:</span> 4 AI Competitors</div>
              <div><span className="font-bold">Speed:</span> 1 month = 30 sec</div>
              <div><span className="font-bold">Capital:</span> $1,000,000,000 each</div>
              <div><span className="font-bold">Duration:</span> ~2.5 hours</div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-[#808080] text-xs text-black">
              <span className="font-bold">AI Competitors: </span>
              <span className="text-[#ff6b35]">[CLO] Claude 4 Opus</span>
              <span className="mx-1">|</span>
              <span className="text-[#10a37f]">[GPT] GPT-5 Turbo</span>
              <span className="mx-1">|</span>
              <span className="text-[#1da1f2]">[GRK] Grok 4</span>
              <span className="mx-1">|</span>
              <span className="text-[#800080]">[DSK] DeepSeek V3</span>
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              className="win95-btn px-6 py-1 text-xs font-bold"
              onClick={() => onSelectMode(selectedMode)}
            >
              OK
            </button>
            <button
              className="win95-btn px-4 py-1 text-xs"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="win95-btn px-4 py-1 text-xs">
              Help
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div 
          className="bg-[#c0c0c0] px-2 py-1 text-[10px] text-black border-t border-[#808080] flex justify-between"
        >
          <span>Select a game mode and click OK to start</span>
          <span>Press F1 for Help</span>
        </div>
      </div>
    </div>
  )
}
