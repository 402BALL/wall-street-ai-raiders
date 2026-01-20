import { useState, useEffect } from 'react'
import Window95 from './ui/Window95'
import Leaderboard from './Leaderboard'

interface Props {
  onLaunchGame: () => void
}

export default function Desktop({ onLaunchGame }: Props) {
  const [time, setTime] = useState(new Date())
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showResearch, setShowResearch] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Win95 style icon component
  const DesktopIcon = ({ icon, label, onClick, bgColor = '#c0c0c0', textColor = '#000' }: {
    icon: React.ReactNode
    label: string
    onClick: () => void
    bgColor?: string
    textColor?: string
  }) => (
    <button 
      className="flex flex-col items-center gap-1 w-[70px] group text-white focus:outline-none"
      onDoubleClick={onClick}
    >
      <div 
        className="w-[32px] h-[32px] flex items-center justify-center border border-[#808080] group-focus:border-dotted group-focus:border-white"
        style={{ 
          background: bgColor,
          boxShadow: '1px 1px 0 #fff inset, -1px -1px 0 #404040 inset'
        }}
      >
        <span style={{ color: textColor, fontSize: '10px', fontFamily: 'MS Sans Serif, Arial, sans-serif', fontWeight: 'bold' }}>
          {icon}
        </span>
      </div>
      <span 
        className="text-[11px] text-center px-[2px] leading-tight group-focus:bg-[#000080]"
        style={{ fontFamily: 'MS Sans Serif, Arial, sans-serif', textShadow: '1px 1px 0 #000' }}
      >
        {label}
      </span>
    </button>
  )
  
  return (
    <div className="h-screen w-screen relative overflow-hidden select-none" style={{ background: '#008080' }}>
      {/* Leaderboard */}
      <Leaderboard />
      
      {/* Desktop Icons Grid */}
      <div className="p-2 flex flex-col gap-1">
        {/* Row 1 */}
        <div className="flex gap-1">
          <DesktopIcon 
            icon={<span className="text-[14px] text-[#00ff00]">W$</span>}
            label="Wall Street AI Raiders"
            onClick={onLaunchGame}
            bgColor="#000080"
          />
        </div>

        {/* Row 2 */}
        <div className="flex gap-1">
          <DesktopIcon 
            icon={<span className="text-[16px]">?</span>}
            label="How It Works"
            onClick={() => setShowHowItWorks(true)}
            bgColor="#ffff00"
            textColor="#000080"
          />
        </div>

        {/* Row 3 */}
        <div className="flex gap-1">
          <DesktopIcon 
            icon={<span className="text-[10px]">DOC</span>}
            label="Research"
            onClick={() => setShowResearch(true)}
            bgColor="#ffffff"
            textColor="#000080"
          />
        </div>

        {/* Row 4 */}
        <div className="flex gap-1">
          <DesktopIcon 
            icon={<span className="text-[12px]">*.★</span>}
            label="Features"
            onClick={() => setShowFeatures(true)}
            bgColor="#00ff00"
            textColor="#000"
          />
        </div>

        {/* Row 5 */}
        <div className="flex gap-1">
          <DesktopIcon 
            icon={<span className="text-[10px]">INFO</span>}
            label="About"
            onClick={() => setShowAbout(true)}
            bgColor="#c0c0c0"
            textColor="#000080"
          />
        </div>

        {/* Row 6 - Social */}
        <div className="flex gap-1 mt-2">
          <DesktopIcon 
            icon={<span className="text-[14px] font-bold">X</span>}
            label="X / Twitter"
            onClick={() => window.open('https://x.com', '_blank')}
            bgColor="#000000"
            textColor="#ffffff"
          />
        </div>

        {/* Row 7 */}
        <div className="flex gap-1">
          <DesktopIcon 
            icon={<span className="text-[8px]">PUMP</span>}
            label="PumpFun"
            onClick={() => window.open('https://pump.fun', '_blank')}
            bgColor="#00d4aa"
            textColor="#000"
          />
        </div>
      </div>

      {/* About Window */}
      {showAbout && (
        <Window95 title="About Wall Street AI Raiders" onClose={() => setShowAbout(false)} width={500} height={400} x={200} y={80}>
          <div className="bg-[#c0c0c0] h-full p-3 text-xs overflow-auto text-black" style={{ fontFamily: 'MS Sans Serif, Arial, sans-serif' }}>
            <div className="text-center mb-4">
              <div className="inline-block bg-[#000080] text-[#00ff00] font-mono text-2xl px-4 py-2 border-2" style={{ borderStyle: 'outset', borderColor: '#fff #808080 #808080 #fff' }}>
                WALL STREET AI RAIDERS
              </div>
              <div className="text-[10px] mt-1 text-[#808080]">Version 1.0 | AI vs AI Stock Market Simulation</div>
            </div>

            <div className="bg-white border-2 p-3 mb-3" style={{ borderStyle: 'inset', borderColor: '#808080 #fff #fff #808080' }}>
              <p className="mb-2 leading-relaxed">
                <b>Wall Street AI Raiders</b> is a real-time stock market simulation where 4 artificial intelligence 
                agents compete against each other using real historical market data and events.
              </p>
              <p className="mb-2 leading-relaxed">
                Each AI has a unique trading personality and strategy. Watch as they analyze market conditions, 
                react to breaking news, and make split-second decisions that could make or break their portfolios.
              </p>
              <p className="leading-relaxed">
                Inspired by the classic <b>Wall Street Raider</b> game (1985), this project explores how modern 
                Large Language Models behave in competitive financial environments.
              </p>
            </div>

            <div className="text-center text-[10px] text-[#808080]">
              Powered by Claude | GPT | Grok | DeepSeek<br/>
              (c) 2025 - For Research & Entertainment
            </div>
          </div>
        </Window95>
      )}
      
      {/* How It Works Window */}
      {showHowItWorks && (
        <Window95 title="How It Works" onClose={() => setShowHowItWorks(false)} width={620} height={520} x={150} y={50}>
          <div className="bg-[#c0c0c0] h-full p-3 text-xs overflow-auto text-black" style={{ fontFamily: 'MS Sans Serif, Arial, sans-serif' }}>
            <div className="bg-[#000080] text-white font-bold p-2 mb-3">
              GAME MECHANISM & SIMULATION FLOW
            </div>
            
            <fieldset className="border-2 p-2 mb-3" style={{ borderStyle: 'groove' }}>
              <legend className="font-bold px-1">Overview</legend>
              <p className="leading-relaxed">
                Each game simulates a <b>closed stock market economy</b> with four autonomous AI agents, 
                each powered by a different Large Language Model. Agents start with <b>identical conditions</b> 
                ($1,000,000,000 cash) and compete to maximize net worth over 25 simulated years.
              </p>
            </fieldset>

            <fieldset className="border-2 p-2 mb-3" style={{ borderStyle: 'groove' }}>
              <legend className="font-bold px-1">Game Parameters</legend>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr><td className="pr-4">Timeline:</td><td className="font-bold">25 years (300 months)</td></tr>
                  <tr><td className="pr-4">Game Speed:</td><td className="font-bold">1 month = 30 seconds real-time</td></tr>
                  <tr><td className="pr-4">Starting Capital:</td><td className="font-bold">$1,000,000,000 per AI</td></tr>
                  <tr><td className="pr-4">Companies:</td><td className="font-bold">50+ across 15 sectors</td></tr>
                  <tr><td className="pr-4">Historical Events:</td><td className="font-bold">80+ real market events</td></tr>
                </tbody>
              </table>
            </fieldset>

            <fieldset className="border-2 p-2 mb-3" style={{ borderStyle: 'groove' }}>
              <legend className="font-bold px-1">AI Decision Cycle (Each Turn)</legend>
              <div className="flex justify-between text-center text-[10px] mt-1">
                <div className="bg-white border p-1 flex-1 mx-[2px]">
                  <div className="font-bold text-[#000080]">1. PERCEIVE</div>
                  <div className="text-[9px]">Market data<br/>News feed</div>
                </div>
                <div className="bg-white border p-1 flex-1 mx-[2px]">
                  <div className="font-bold text-[#000080]">2. ANALYZE</div>
                  <div className="text-[9px]">LLM reasoning<br/>Risk assessment</div>
                </div>
                <div className="bg-white border p-1 flex-1 mx-[2px]">
                  <div className="font-bold text-[#000080]">3. DECIDE</div>
                  <div className="text-[9px]">Buy/Sell/Hold<br/>Position size</div>
                </div>
                <div className="bg-white border p-1 flex-1 mx-[2px]">
                  <div className="font-bold text-[#000080]">4. EXECUTE</div>
                  <div className="text-[9px]">Trade settled<br/>Portfolio updated</div>
                </div>
              </div>
            </fieldset>

            <fieldset className="border-2 p-2 mb-3" style={{ borderStyle: 'groove' }}>
              <legend className="font-bold px-1">AI Trading Personalities</legend>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 inline-block" style={{ background: '#ff6b35' }}></span>
                  <b>CLAUDE 4 OPUS:</b> Conservative value investor - focuses on fundamentals, P/E ratios, dividends
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 inline-block" style={{ background: '#10a37f' }}></span>
                  <b>GPT-5 TURBO:</b> Balanced growth strategist - diversified portfolio, follows trends moderately
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 inline-block" style={{ background: '#1da1f2' }}></span>
                  <b>GROK 4:</b> Aggressive risk-taker - volatile plays, contrarian bets, high risk/reward
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 inline-block" style={{ background: '#800080' }}></span>
                  <b>DEEPSEEK V3:</b> Technical momentum trader - trend following, quick entries/exits
                </div>
              </div>
            </fieldset>

            <fieldset className="border-2 p-2" style={{ borderStyle: 'groove' }}>
              <legend className="font-bold px-1">Market Operations</legend>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-[#808080] text-white">
                    <th className="p-1 text-left">Category</th>
                    <th className="p-1 text-left">Available Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white"><td className="p-1 font-bold">Trading</td><td className="p-1">Buy stocks, Sell positions, Hold cash</td></tr>
                  <tr><td className="p-1 font-bold">Analysis</td><td className="p-1">Sector analysis, Company fundamentals, News impact</td></tr>
                  <tr className="bg-white"><td className="p-1 font-bold">Risk Mgmt</td><td className="p-1">Position sizing, Portfolio rebalancing, Cash reserves</td></tr>
                  <tr><td className="p-1 font-bold">Events</td><td className="p-1">React to crashes, Exploit rallies, Handle crises</td></tr>
                </tbody>
              </table>
            </fieldset>
          </div>
        </Window95>
      )}

      {/* Research Window */}
      {showResearch && (
        <Window95 title="Research.doc - WordPad" onClose={() => setShowResearch(false)} width={680} height={560} x={120} y={30}>
          <div className="bg-white h-full p-4 text-xs overflow-auto text-black" style={{ fontFamily: 'MS Sans Serif, Arial, sans-serif' }}>
            <h1 className="text-lg font-bold text-center mb-1 border-b-2 border-black pb-1">
              AUTONOMOUS AGENT ECONOMY
            </h1>
            <p className="text-center text-[10px] text-[#808080] mb-4">
              A High-Fidelity Testbed for AI Financial Decision-Making
            </p>
            
            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">1. INTRODUCTION</h2>
            <p className="mb-3 leading-relaxed text-[11px] indent-4">
              As AI agents increasingly participate in real financial workflows, it becomes crucial to understand 
              how they negotiate, allocate capital, and respond to market shocks—not just in toy payoff matrices, 
              but in rich, multi-step environments. The <b>Wall Street AI Raiders</b> project creates a controlled 
              yet realistic "mini-economy" where agents, powered by different Large Language Models (LLMs), buy 
              and sell stocks, react to news events, and experience random market fluctuations.
            </p>
            <p className="mb-3 leading-relaxed text-[11px] indent-4">
              Our focus is on mimicking messy, real-world market behavior: agents must handle portfolio management, 
              liquidity constraints, sector rotations, and multi-factor analysis over time. This makes the platform 
              suitable for studying both <b>economic outcomes</b> (wealth concentration, market power, strategy effectiveness) 
              and <b>robustness questions</b> (manipulative strategies, irrational behavior, "hallucinated" valuations).
            </p>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">2. RESEARCH AREAS</h2>
            
            <h3 className="font-bold text-[#000080] mt-3 mb-1">2.1 Crowd Synchronization & Phase Transitions</h3>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              We investigate how agent populations shift from a "rational normal state" to a "highly responsive 
              reactive state," often triggered by loss-avoiding motivations during market crashes. This transition 
              dramatically increases system coupling, potentially pushing agents past a critical tipping point. 
              Our data allows researchers to quantify this self-amplifying instability using order parameters 
              and observe emergent synchronization in real-time.
            </p>

            <h3 className="font-bold text-[#000080] mt-3 mb-1">2.2 Emergence of Concentrated Power Distributions</h3>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              By incorporating agents' heterogeneous wealth into the feedback structure, we model how concentrated 
              distributions (such as power-law) emerge over time. The simulation tracks how an agent's wealth 
              dynamically adjusts based on the alignment between their individual actions and resulting market 
              outcomes (reward function), providing empirical data on wealth concentration dynamics.
            </p>

            <h3 className="font-bold text-[#000080] mt-3 mb-1">2.3 Response Functions & Agent Dominance</h3>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              Research suggests that an agent's unique response function to market observations is the key 
              differentiator determining who becomes a dominant player. We provide the granularity needed to 
              isolate these response functions, allowing researchers to analyze why specific reasoning patterns 
              (conservative vs aggressive, fundamental vs technical) lead to dominant positions.
            </p>

            <h3 className="font-bold text-[#000080] mt-3 mb-1">2.4 Vulnerability & Hallucinations in Finance</h3>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              Beyond structural dynamics, we analyze the fragility of specific agent decisions. LLM agents may be 
              prone to "hallucinated" value assessments or logical fallacies in high-pressure market contexts. 
              Our platform stress-tests agent reliability against adversarial market conditions and sudden shocks.
            </p>

            <h3 className="font-bold text-[#000080] mt-3 mb-1">2.5 Strategy Evolution & Adaptation</h3>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              How do AI strategies evolve when facing prolonged bull markets vs bear markets? We track strategy 
              shifts, risk tolerance changes, and portfolio composition over the 25-year simulation period, 
              providing insights into adaptive behavior and strategy robustness.
            </p>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">3. DATA COLLECTION</h2>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              Our dataset goes beyond simple transaction logs. We capture the <b>cognitive pulse</b> of the 
              market—recording not just what happened, but why:
            </p>
            <table className="w-full text-[10px] border-collapse mb-3">
              <thead>
                <tr className="bg-[#c0c0c0]">
                  <th className="border border-black p-1 text-left">Dataset</th>
                  <th className="border border-black p-1 text-left">Description</th>
                  <th className="border border-black p-1 text-left">Granularity</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1 font-bold">Game States</td><td className="border border-black p-1">Complete market snapshots</td><td className="border border-black p-1">Every turn (t)</td></tr>
                <tr className="bg-[#f0f0f0]"><td className="border border-black p-1 font-bold">Cognitive Traces</td><td className="border border-black p-1">Raw Chain-of-Thought from each AI</td><td className="border border-black p-1">Every decision</td></tr>
                <tr><td className="border border-black p-1 font-bold">Trade History</td><td className="border border-black p-1">Buy/sell with full context</td><td className="border border-black p-1">Every trade</td></tr>
                <tr className="bg-[#f0f0f0]"><td className="border border-black p-1 font-bold">Event Impacts</td><td className="border border-black p-1">Market reactions to historical crises</td><td className="border border-black p-1">Per event</td></tr>
                <tr><td className="border border-black p-1 font-bold">Portfolio Evolution</td><td className="border border-black p-1">Holdings, cash, net worth over time</td><td className="border border-black p-1">Every turn</td></tr>
                <tr className="bg-[#f0f0f0]"><td className="border border-black p-1 font-bold">News & Sentiment</td><td className="border border-black p-1">Generated news and AI reactions</td><td className="border border-black p-1">Every turn</td></tr>
              </tbody>
            </table>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">4. METHODOLOGY</h2>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              Each game instance runs for up to 300 turns (months) or until specific stopping conditions are met. 
              While the primary objective is maximizing final net worth, the system supports alternative research 
              goals such as minimizing drawdown, optimizing Sharpe ratio, or testing specific hypotheses about 
              AI behavior under stress.
            </p>
            <p className="mb-3 leading-relaxed text-[11px] indent-4">
              All model configurations—including family, version, and hyperparameters—are rigorously logged as 
              experiment metadata, ensuring reproducibility and enabling cross-model comparisons.
            </p>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">5. SIMULATION SCENARIOS</h2>
            
            <h3 className="font-bold text-[#000080] mt-2 mb-1">5.1 Classic Wall Street (1985-2010)</h3>
            <p className="mb-1 text-[10px] text-[#606060] italic">Traditional stock market with blue-chip companies</p>
            <div className="grid grid-cols-3 gap-1 text-[9px] mb-3">
              <div className="border p-1 bg-[#ffe6e6]"><b>1987:</b> Black Monday (-22%)</div>
              <div className="border p-1"><b>1990:</b> Gulf War Crisis</div>
              <div className="border p-1"><b>1994:</b> Bond Massacre</div>
              <div className="border p-1"><b>1997:</b> Asian Crisis</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>1998:</b> LTCM Collapse</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>1999:</b> Dot-com Peak</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2000:</b> Tech Crash</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2001:</b> 9/11 Attacks</div>
              <div className="border p-1"><b>2002:</b> Enron Scandal</div>
              <div className="border p-1"><b>2007:</b> Subprime Start</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2008:</b> Lehman Collapse</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2009:</b> Recovery</div>
            </div>

            <h3 className="font-bold text-[#008000] mt-2 mb-1">5.2 Modern Markets (2010-2026)</h3>
            <p className="mb-1 text-[10px] text-[#606060] italic">Tech giants, social media, AI revolution</p>
            <div className="grid grid-cols-3 gap-1 text-[9px] mb-3">
              <div className="border p-1 bg-[#e6ffe6]"><b>2010:</b> Flash Crash Recovery</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2012:</b> Facebook IPO</div>
              <div className="border p-1"><b>2013:</b> Taper Tantrum</div>
              <div className="border p-1"><b>2015:</b> China Devaluation</div>
              <div className="border p-1"><b>2016:</b> Brexit Vote</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2017:</b> Trump Rally</div>
              <div className="border p-1"><b>2018:</b> Trade War</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2019:</b> Fed Pivot</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2020:</b> COVID Crash (-34%)</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2021:</b> Meme Stocks (GME)</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2022:</b> Rate Hikes</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2023:</b> AI Boom (NVDA)</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2024:</b> Mag 7 Rally</div>
              <div className="border p-1"><b>2025:</b> Fed Easing</div>
              <div className="border p-1"><b>2026:</b> AGI Hype</div>
            </div>

            <h3 className="font-bold text-[#ff6600] mt-2 mb-1">5.3 Crypto Wars (2009-2026)</h3>
            <p className="mb-1 text-[10px] text-[#606060] italic">Digital assets from genesis to mainstream adoption</p>
            <div className="grid grid-cols-3 gap-1 text-[9px] mb-3">
              <div className="border p-1 bg-[#fff0e6]"><b>2009:</b> Bitcoin Genesis</div>
              <div className="border p-1"><b>2010:</b> Pizza Day (10K BTC)</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2011:</b> First $1 BTC</div>
              <div className="border p-1"><b>2013:</b> Silk Road Shutdown</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2014:</b> Mt.Gox Hack</div>
              <div className="border p-1 bg-[#fff0e6]"><b>2015:</b> Ethereum Launch</div>
              <div className="border p-1"><b>2016:</b> DAO Hack / ETH Fork</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2017:</b> ICO Mania ($20K BTC)</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2018:</b> Crypto Winter</div>
              <div className="border p-1"><b>2019:</b> DeFi Summer Preview</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2020:</b> DeFi Explosion</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2021:</b> NFT Mania / $69K BTC</div>
              <div className="border p-1 bg-[#ffe6e6]"><b>2022:</b> LUNA/FTX Collapse</div>
              <div className="border p-1"><b>2023:</b> SEC Lawsuits</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2024:</b> BTC ETF Approved</div>
              <div className="border p-1 bg-[#e6ffe6]"><b>2025:</b> $100K Bitcoin</div>
              <div className="border p-1"><b>2026:</b> CBDC Wars</div>
            </div>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">6. ASSETS BY SCENARIO</h2>
            <table className="w-full text-[9px] border-collapse mb-3">
              <thead>
                <tr className="bg-[#c0c0c0]">
                  <th className="border border-black p-1">Scenario</th>
                  <th className="border border-black p-1">Asset Types</th>
                  <th className="border border-black p-1">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 font-bold">Classic</td>
                  <td className="border border-black p-1">Blue-chips, Industrials</td>
                  <td className="border border-black p-1">IBM, GE, KO, XOM, JPM, WMT</td>
                </tr>
                <tr className="bg-[#f0f0f0]">
                  <td className="border border-black p-1 font-bold">Modern</td>
                  <td className="border border-black p-1">Tech Giants, Growth</td>
                  <td className="border border-black p-1">AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA</td>
                </tr>
                <tr>
                  <td className="border border-black p-1 font-bold">Crypto</td>
                  <td className="border border-black p-1">Digital Assets</td>
                  <td className="border border-black p-1">BTC, ETH, SOL, XRP, DOGE, ADA</td>
                </tr>
              </tbody>
            </table>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">7. CROSS-SCENARIO ANALYSIS</h2>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              A unique feature of our platform is the ability to compare AI behavior across radically different 
              market environments. How does a conservative strategy that excels in traditional markets perform 
              in the extreme volatility of crypto? Do aggressive strategies outperform during rapid innovation 
              cycles (dot-com, AI boom) but fail during black swan events?
            </p>
            <p className="mb-3 leading-relaxed text-[11px] indent-4">
              We track <b>strategy transfer</b>: testing whether insights from one market regime generalize 
              to others, and identifying <b>universal trading principles</b> vs <b>regime-specific tactics</b>.
            </p>

            <h2 className="font-bold bg-[#000080] text-white px-2 py-1 mb-2">8. FUTURE WORK</h2>
            <p className="mb-2 leading-relaxed text-[11px] indent-4">
              We envision expanding this system to include: multi-agent negotiations and hostile takeovers, 
              options/derivatives trading, leverage and margin calls, macroeconomic policy simulations, 
              heterogeneous agent populations, and real-time API integration for live market comparison.
            </p>
          </div>
        </Window95>
      )}

      {/* Features Window */}
      {showFeatures && (
        <Window95 title="Features.txt - Notepad" onClose={() => setShowFeatures(false)} width={600} height={550} x={180} y={40}>
          <div className="bg-white h-full p-2 font-mono text-xs overflow-auto text-black">
            <pre className="whitespace-pre-wrap">{`
================================================================
            WALL STREET AI RAIDERS - FEATURES
================================================================

[AI COMPETITORS]
----------------
* CLAUDE 4 OPUS    - Conservative value investor
* GPT-5 TURBO      - Balanced growth strategist
* GROK 4           - Aggressive risk-taker
* DEEPSEEK V3      - Technical momentum trader

Each AI has unique personality and strategy.
Watch them adapt to different market conditions!


[GAME MODES - 3 UNIQUE SCENARIOS]
=================================

>> MODE 1: CLASSIC WALL STREET (1985-2010)
   Timeline: 25 years of traditional markets
   Assets: Blue-chip stocks (IBM, GE, KO, JPM, XOM)
   
   KEY EVENTS:
   * 1987 - Black Monday Crash (-22% in one day)
   * 1990 - Gulf War / Oil Crisis
   * 1997 - Asian Financial Crisis
   * 1998 - LTCM Collapse / Russian Default
   * 1999 - Dot-com Bubble Peak
   * 2000 - Tech Crash Begins
   * 2001 - 9/11 Terror Attacks
   * 2002 - Enron/WorldCom Scandals
   * 2008 - Lehman Brothers / Financial Crisis
   * 2009 - Market Bottom & Recovery

>> MODE 2: MODERN MARKETS (2010-2026)
   Timeline: 16 years of tech revolution
   Assets: Tech giants (AAPL, MSFT, GOOGL, TSLA, NVDA)
   
   KEY EVENTS:
   * 2010 - Flash Crash
   * 2012 - Facebook IPO
   * 2015 - China Devaluation
   * 2016 - Brexit Shock
   * 2018 - US-China Trade War
   * 2020 - COVID Crash (-34%) & Recovery
   * 2021 - Meme Stocks (GME, AMC)
   * 2022 - Fed Rate Hikes / Tech Selloff
   * 2023 - ChatGPT / AI Boom (NVDA +200%)
   * 2024 - Magnificent 7 Rally
   * 2025 - Fed Easing Cycle
   * 2026 - AGI Anticipation

>> MODE 3: CRYPTO WARS (2009-2026)
   Timeline: 17 years from genesis to mainstream
   Assets: Crypto (BTC, ETH, SOL, XRP, DOGE, ADA)
   
   KEY EVENTS:
   * 2009 - Bitcoin Genesis Block
   * 2010 - First BTC Transaction (10K for pizza)
   * 2011 - BTC hits $1
   * 2013 - Silk Road Shutdown
   * 2014 - Mt.Gox Hack (850K BTC lost)
   * 2015 - Ethereum Launch
   * 2016 - DAO Hack / ETH Hard Fork
   * 2017 - ICO Mania / BTC $20K
   * 2018 - Crypto Winter (-85%)
   * 2020 - DeFi Summer
   * 2021 - NFT Mania / BTC $69K
   * 2022 - LUNA Crash / FTX Collapse
   * 2024 - Bitcoin ETF Approved
   * 2025 - BTC $100K
   * 2026 - CBDC Competition


[MARKET SIMULATION]
-------------------
* 50+ assets per mode
* Real historical price patterns
* 80+ events affecting prices
* Dynamic sector rotation
* Breaking news generation
* Earnings reports & economic data
* IPO/Listing mechanism for new assets


[AI FEATURES]
-------------
* Real-time thinking display
* Full Chain-of-Thought reasoning
* Portfolio analysis
* Trade history logging
* Performance tracking


[CHARTS & ANALYSIS]
-------------------
* TradingView-style candlestick charts
* Zoom and pan functionality
* AI trade markers on charts
* Company fundamentals display
* Sector breakdown


[RETRO AESTHETIC]
-----------------
* Authentic Windows 95/98 interface
* Classic game styling
* DOS-era terminal look
* Inspired by Wall Street Raider (1985)


[TECHNICAL]
-----------
* Real-time simulation
* 1 month = 30 seconds
* 300 turns total (25 years)
* Autonomous AI operation
* No player intervention needed


===============================================
         (c) 2025 - Research Project
===============================================
`}</pre>
          </div>
        </Window95>
      )}
      
      {/* Taskbar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[26px] flex items-center px-[2px]"
        style={{ 
          background: '#c0c0c0',
          borderTop: '2px solid #ffffff',
          boxShadow: 'inset 0 1px 0 #dfdfdf'
        }}
      >
        {/* Start Button */}
        <button 
          className="h-[22px] px-[6px] flex items-center gap-[4px] font-bold text-[11px] border-2"
          style={{ 
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            borderStyle: 'outset',
            borderColor: '#fff #808080 #808080 #fff',
            background: '#c0c0c0'
          }}
          onClick={() => onLaunchGame()}
        >
          <div className="w-[16px] h-[16px] bg-[#000080] flex items-center justify-center text-[8px] text-[#00ff00] font-mono border border-[#808080]">
            W
          </div>
          <span>Start</span>
        </button>
        
        <div className="w-[2px] h-[18px] mx-[4px]" style={{ borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />
        
        {/* Quick Launch */}
        <button 
          className="h-[20px] px-[4px] flex items-center justify-center text-[10px] font-mono border"
          style={{ 
            borderStyle: 'outset',
            borderColor: '#fff #808080 #808080 #fff',
            background: '#c0c0c0'
          }}
          onClick={() => onLaunchGame()}
          title="Launch Wall Street AI Raiders"
        >
          W$R
        </button>
        
        <div className="flex-1" />
        
        {/* System Tray */}
        <div 
          className="h-[20px] px-[8px] flex items-center gap-[8px] text-[11px]"
          style={{
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            background: '#c0c0c0',
            borderStyle: 'inset',
            borderWidth: '1px',
            borderColor: '#808080 #fff #fff #808080'
          }}
        >
          <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>
    </div>
  )
}
