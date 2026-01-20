import { HistoricalEvent } from '../types'

export const historicalEvents: HistoricalEvent[] = [
  // ============= 1985 =============
  {
    id: 'plaza-accord-1985',
    name: 'Plaza Accord - Dollar Devaluation',
    date: { year: 1985, month: 9, day: 1 },
    description: 'G5 nations agree to devalue the US dollar against Yen and Deutsche Mark.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 5 },
      { type: 'sector', target: 'Industrial', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'reagan-tax-reform-1985',
    name: 'Reagan Tax Reform Proposal',
    date: { year: 1985, month: 5, day: 1 },
    description: 'President Reagan proposes major tax reform legislation.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: 8 },
      { type: 'sector', target: 'Consumer', magnitude: 6 }
    ],
    isActive: false
  },
  {
    id: 'coca-cola-new-1985',
    name: 'New Coke Disaster',
    date: { year: 1985, month: 4, day: 1 },
    description: 'Coca-Cola changes formula - massive consumer backlash!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Consumer', magnitude: -5 }
    ],
    isActive: false
  },
  
  // ============= 1986 =============
  {
    id: 'oil-crash-1986',
    name: 'Oil Price Collapse',
    date: { year: 1986, month: 4 },
    description: 'Oil crashes to $10/barrel as OPEC loses control. Energy stocks plunge!',
    duration: 8,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: -35 },
      { type: 'sector', target: 'Transportation', magnitude: 15 },
      { type: 'sector', target: 'Consumer', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'chernobyl-1986',
    name: 'Chernobyl Nuclear Disaster',
    date: { year: 1986, month: 4 },
    description: 'Catastrophic nuclear meltdown in Soviet Union shocks the world.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Utilities', magnitude: -15 },
      { type: 'sector', target: 'Energy', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'big-bang-1986',
    name: 'London Big Bang',
    date: { year: 1986, month: 10 },
    description: 'UK deregulates financial markets. Electronic trading begins.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: 15 },
      { type: 'sector', target: 'Technology', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'insider-trading-1986',
    name: 'Ivan Boesky Insider Trading Scandal',
    date: { year: 1986, month: 11 },
    description: 'Wall Street rocked by insider trading scandal! Boesky pays $100M fine.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -12 },
      { type: 'market', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'space-shuttle-1986',
    name: 'Challenger Space Shuttle Disaster',
    date: { year: 1986, month: 1 },
    description: 'Space shuttle Challenger explodes after launch. NASA program halted.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Defense', magnitude: -8 },
      { type: 'sector', target: 'Technology', magnitude: -5 }
    ],
    isActive: false
  },

  // ============= 1987 =============
  {
    id: 'milken-indictment-1987',
    name: 'Michael Milken Under Investigation',
    date: { year: 1987, month: 3 },
    description: 'SEC investigates junk bond king. LBO deals questioned.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'dow-2000-1987',
    name: 'Dow Hits 2000!',
    date: { year: 1987, month: 1 },
    description: 'Dow Jones Industrial Average crosses 2000 for first time!',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'louvre-accord-1987',
    name: 'Louvre Accord',
    date: { year: 1987, month: 2 },
    description: 'G7 agrees to stabilize dollar. Currency markets calm.',
    duration: 3,
    effects: [
      { type: 'market', magnitude: 3 },
      { type: 'sector', target: 'Finance', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'black-monday-1987',
    name: 'BLACK MONDAY - Market Crash',
    date: { year: 1987, month: 10 },
    description: 'DOW JONES FALLS 22.6% IN SINGLE DAY! WORST CRASH IN HISTORY!',
    duration: 3,
    effects: [
      { type: 'market', magnitude: -25 },
      { type: 'sector', target: 'Finance', magnitude: -35 },
      { type: 'sector', target: 'Technology', magnitude: -30 }
    ],
    isActive: false
  },
  {
    id: 'fed-response-1987',
    name: 'Fed Provides Liquidity',
    date: { year: 1987, month: 10 },
    description: 'Greenspan pumps liquidity into system. Banks stabilize.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 8 },
      { type: 'sector', target: 'Finance', magnitude: 10 }
    ],
    isActive: false
  },

  // ============= 1988 =============
  {
    id: 'sl-crisis-begins-1988',
    name: 'Savings & Loan Crisis Begins',
    date: { year: 1988, month: 3 },
    description: 'S&L institutions failing across America. Bailout looms.',
    duration: 24,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -15 },
      { type: 'sector', target: 'Real Estate', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'bull-market-1988',
    name: 'Post-Crash Recovery Rally',
    date: { year: 1988, month: 6 },
    description: 'Markets recover from Black Monday. Bull run resumes.',
    duration: 12,
    effects: [
      { type: 'market', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'rjr-nabisco-1988',
    name: 'RJR Nabisco LBO - Barbarians at the Gate',
    date: { year: 1988, month: 10 },
    description: 'Largest leveraged buyout in history at $25 billion!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Consumer', magnitude: 10 },
      { type: 'sector', target: 'Finance', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'bush-elected-1988',
    name: 'George H.W. Bush Elected',
    date: { year: 1988, month: 11 },
    description: 'Bush wins presidency. "Read my lips: no new taxes."',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1989 =============
  {
    id: 'exxon-valdez-1989',
    name: 'Exxon Valdez Oil Spill',
    date: { year: 1989, month: 3 },
    description: 'Massive oil spill in Alaska. Environmental disaster!',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: -12 }
    ],
    isActive: false
  },
  {
    id: 'tiananmen-1989',
    name: 'Tiananmen Square Protests',
    date: { year: 1989, month: 6 },
    description: 'Chinese government crackdown on democracy protesters.',
    duration: 3,
    effects: [
      { type: 'market', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'junk-bond-crisis-1989',
    name: 'Junk Bond Market Collapses',
    date: { year: 1989, month: 9 },
    description: 'High-yield bond market implodes. LBOs freeze.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -20 },
      { type: 'market', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'berlin-wall-1989',
    name: 'BERLIN WALL FALLS',
    date: { year: 1989, month: 11 },
    description: 'Cold War ends! New markets open in Eastern Europe.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 10 },
      { type: 'sector', target: 'Defense', magnitude: -15 },
      { type: 'sector', target: 'Industrial', magnitude: 12 }
    ],
    isActive: false
  },
  {
    id: 'japan-bubble-peak-1989',
    name: 'Japan Bubble Peaks',
    date: { year: 1989, month: 12 },
    description: 'Nikkei hits 38,915. Japanese assets at insane valuations.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Real Estate', magnitude: 8 },
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1990 =============
  {
    id: 'japan-crash-1990',
    name: 'Japan Bubble Bursts',
    date: { year: 1990, month: 1 },
    description: 'Nikkei begins long decline. Japanese asset bubble deflates.',
    duration: 12,
    effects: [
      { type: 'market', magnitude: -8 },
      { type: 'sector', target: 'Finance', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'drexel-bankruptcy-1990',
    name: 'Drexel Burnham Lambert Bankrupt',
    date: { year: 1990, month: 2 },
    description: 'Junk bond king files for bankruptcy! End of an era.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -18 }
    ],
    isActive: false
  },
  {
    id: 'milken-sentenced-1990',
    name: 'Michael Milken Sentenced',
    date: { year: 1990, month: 4 },
    description: 'Milken gets 10 years for securities fraud.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'germany-reunification-1990',
    name: 'German Reunification',
    date: { year: 1990, month: 10 },
    description: 'East and West Germany unite. European markets rally.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: 5 },
      { type: 'sector', target: 'Industrial', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'gulf-war-1990',
    name: 'Gulf War - Iraq Invades Kuwait',
    date: { year: 1990, month: 8 },
    description: 'Oil prices spike as Iraq invades Kuwait! War fears grip markets.',
    duration: 8,
    effects: [
      { type: 'market', magnitude: -12 },
      { type: 'sector', target: 'Energy', magnitude: 25 },
      { type: 'sector', target: 'Defense', magnitude: 20 },
      { type: 'sector', target: 'Transportation', magnitude: -15 }
    ],
    isActive: false
  },

  // ============= 1991 =============
  {
    id: 'desert-storm-1991',
    name: 'Desert Storm Victory',
    date: { year: 1991, month: 2 },
    description: 'Quick US victory in Gulf War. Oil prices normalize.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: 12 },
      { type: 'sector', target: 'Energy', magnitude: -15 },
      { type: 'sector', target: 'Transportation', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'recession-1991',
    name: 'US Recession',
    date: { year: 1991, month: 3 },
    description: 'Economy officially in recession. Unemployment rises.',
    duration: 8,
    effects: [
      { type: 'market', magnitude: -8 },
      { type: 'sector', target: 'Consumer', magnitude: -10 },
      { type: 'sector', target: 'Real Estate', magnitude: -12 }
    ],
    isActive: false
  },
  {
    id: 'soviet-collapse-1991',
    name: 'SOVIET UNION COLLAPSES',
    date: { year: 1991, month: 12 },
    description: 'USSR dissolves. Cold War officially over. Peace dividend expected.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 8 },
      { type: 'sector', target: 'Defense', magnitude: -20 },
      { type: 'sector', target: 'Technology', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'salomon-scandal-1991',
    name: 'Salomon Brothers Scandal',
    date: { year: 1991, month: 8 },
    description: 'Treasury bond bidding scandal rocks Wall Street.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -12 }
    ],
    isActive: false
  },

  // ============= 1992 =============
  {
    id: 'black-wednesday-1992',
    name: 'Black Wednesday - Pound Crashes',
    date: { year: 1992, month: 9 },
    description: 'UK forced out of ERM. George Soros makes $1 billion!',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'clinton-elected-1992',
    name: 'Bill Clinton Elected',
    date: { year: 1992, month: 11 },
    description: 'Clinton wins presidency. "It\'s the economy, stupid."',
    duration: 3,
    effects: [
      { type: 'market', magnitude: 5 },
      { type: 'sector', target: 'Healthcare', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'euro-disney-1992',
    name: 'Euro Disney Opens',
    date: { year: 1992, month: 4 },
    description: 'Disney opens theme park in Paris. Mixed reception.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Media', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1993 =============
  {
    id: 'waco-siege-1993',
    name: 'Waco Siege',
    date: { year: 1993, month: 4 },
    description: 'FBI siege ends in tragedy. Political tensions rise.',
    duration: 1,
    effects: [
      { type: 'market', magnitude: -2 }
    ],
    isActive: false
  },
  {
    id: 'nafta-1993',
    name: 'NAFTA Signed',
    date: { year: 1993, month: 11 },
    description: 'Free trade agreement with Canada and Mexico passed.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Industrial', magnitude: 8 },
      { type: 'sector', target: 'Retail', magnitude: 6 },
      { type: 'sector', target: 'Transportation', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'internet-emerges-1993',
    name: 'World Wide Web Goes Mainstream',
    date: { year: 1993, month: 6 },
    description: 'Mosaic browser launches. Internet era begins!',
    duration: 12,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 15 },
      { type: 'sector', target: 'Telecom', magnitude: 10 }
    ],
    isActive: false
  },

  // ============= 1994 =============
  {
    id: 'bond-massacre-1994',
    name: 'Bond Market Massacre',
    date: { year: 1994, month: 2 },
    description: 'Fed raises rates unexpectedly. Bond market crashes.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: -8 },
      { type: 'sector', target: 'Real Estate', magnitude: -12 },
      { type: 'sector', target: 'Utilities', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'orange-county-1994',
    name: 'Orange County Bankruptcy',
    date: { year: 1994, month: 12 },
    description: 'California county goes bankrupt from derivatives losses!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'mexico-crisis-1994',
    name: 'Mexican Peso Crisis',
    date: { year: 1994, month: 12 },
    description: 'Tequila Crisis! Peso devaluation spreads through Latin America.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: -6 },
      { type: 'sector', target: 'Finance', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'intel-pentium-1994',
    name: 'Intel Pentium Bug',
    date: { year: 1994, month: 11 },
    description: 'Pentium chip flaw discovered. Intel stock drops.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: -8 }
    ],
    isActive: false
  },

  // ============= 1995 =============
  {
    id: 'barings-collapse-1995',
    name: 'Barings Bank Collapses',
    date: { year: 1995, month: 2 },
    description: 'Nick Leeson destroys 233-year-old bank with rogue trades!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -15 }
    ],
    isActive: false
  },
  {
    id: 'oklahoma-bombing-1995',
    name: 'Oklahoma City Bombing',
    date: { year: 1995, month: 4 },
    description: 'Domestic terrorism strikes heartland. Markets react.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: -3 },
      { type: 'sector', target: 'Defense', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'windows95-1995',
    name: 'Windows 95 Launch',
    date: { year: 1995, month: 8 },
    description: 'Microsoft releases Windows 95. PC revolution accelerates!',
    duration: 12,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 25 }
    ],
    isActive: false
  },
  {
    id: 'netscape-ipo-1995',
    name: 'Netscape IPO - Internet Mania Begins',
    date: { year: 1995, month: 8 },
    description: 'Netscape soars 108% on first day! Internet gold rush begins.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 20 },
      { type: 'sector', target: 'Telecom', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'mexico-bailout-1995',
    name: 'US Bails Out Mexico',
    date: { year: 1995, month: 1 },
    description: 'Clinton arranges $50B rescue package for Mexico.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1996 =============
  {
    id: 'telecom-act-1996',
    name: 'Telecommunications Act',
    date: { year: 1996, month: 2 },
    description: 'Major deregulation of telecom industry.',
    duration: 12,
    effects: [
      { type: 'sector', target: 'Telecom', magnitude: 20 },
      { type: 'sector', target: 'Media', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'greenspan-irrational-1996',
    name: 'Irrational Exuberance Warning',
    date: { year: 1996, month: 12 },
    description: 'Greenspan warns of overvalued stocks. Markets ignore.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'yahoo-ipo-1996',
    name: 'Yahoo! IPO',
    date: { year: 1996, month: 4 },
    description: 'Yahoo goes public. Internet portals are hot!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'clinton-reelected-1996',
    name: 'Clinton Re-elected',
    date: { year: 1996, month: 11 },
    description: 'Clinton wins second term. Economic boom continues.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1997 =============
  {
    id: 'hong-kong-handover-1997',
    name: 'Hong Kong Handover',
    date: { year: 1997, month: 7 },
    description: 'UK returns Hong Kong to China. Markets watch closely.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: -3 }
    ],
    isActive: false
  },
  {
    id: 'asian-crisis-1997',
    name: 'ASIAN FINANCIAL CRISIS',
    date: { year: 1997, month: 7 },
    description: 'Thai baht collapses. Crisis spreads across Asia!',
    duration: 8,
    effects: [
      { type: 'market', magnitude: -10 },
      { type: 'sector', target: 'Finance', magnitude: -15 },
      { type: 'sector', target: 'Technology', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'amazon-ipo-1997',
    name: 'Amazon IPO',
    date: { year: 1997, month: 5 },
    description: 'Online bookstore goes public at $18/share.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 8 },
      { type: 'sector', target: 'Retail', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'dow-8000-1997',
    name: 'Dow Crosses 8000',
    date: { year: 1997, month: 7 },
    description: 'Dow Jones hits 8000 for first time!',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1998 =============
  {
    id: 'lewinsky-scandal-1998',
    name: 'Clinton-Lewinsky Scandal',
    date: { year: 1998, month: 1 },
    description: 'Presidential scandal grips Washington. Markets volatile.',
    duration: 12,
    effects: [
      { type: 'market', magnitude: -3 }
    ],
    isActive: false
  },
  {
    id: 'russia-default-1998',
    name: 'Russian Default',
    date: { year: 1998, month: 8 },
    description: 'Russia defaults on debt. Global contagion fears.',
    duration: 3,
    effects: [
      { type: 'market', magnitude: -12 },
      { type: 'sector', target: 'Finance', magnitude: -18 },
      { type: 'sector', target: 'Energy', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'ltcm-1998',
    name: 'LTCM COLLAPSE',
    date: { year: 1998, month: 9 },
    description: 'Long-Term Capital Management nearly crashes global finance!',
    duration: 3,
    effects: [
      { type: 'market', magnitude: -15 },
      { type: 'sector', target: 'Finance', magnitude: -25 }
    ],
    isActive: false
  },
  {
    id: 'fed-rescue-1998',
    name: 'Fed Orchestrates LTCM Bailout',
    date: { year: 1998, month: 10 },
    description: 'Fed cuts rates three times. Markets stabilize.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: 12 },
      { type: 'sector', target: 'Finance', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'google-founded-1998',
    name: 'Google Founded',
    date: { year: 1998, month: 9 },
    description: 'Stanford students launch new search engine.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 1999 =============
  {
    id: 'euro-launch-1999',
    name: 'Euro Currency Launched',
    date: { year: 1999, month: 1 },
    description: 'European monetary union begins. New currency era.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'y2k-fears-1999',
    name: 'Y2K Fears Boost Tech',
    date: { year: 1999, month: 1 },
    description: 'Companies rush to upgrade computer systems before 2000.',
    duration: 12,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 30 }
    ],
    isActive: false
  },
  {
    id: 'dow-10000-1999',
    name: 'DOW HITS 10,000!',
    date: { year: 1999, month: 3 },
    description: 'Historic milestone! Dow crosses 10,000 for first time!',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'glass-steagall-1999',
    name: 'Glass-Steagall Repealed',
    date: { year: 1999, month: 11 },
    description: 'Banks can now combine commercial and investment banking.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'dotcom-mania-1999',
    name: 'DOT-COM MANIA PEAK',
    date: { year: 1999, month: 12 },
    description: 'Internet stocks reach insane valuations! Everyone wants IPOs!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 40 },
      { type: 'sector', target: 'Telecom', magnitude: 25 }
    ],
    isActive: false
  },
  {
    id: 'y2k-nonevent-1999',
    name: 'Y2K: Nothing Happens',
    date: { year: 1999, month: 12 },
    description: 'Millennium bug fizzles. Tech spending to slow.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: -10 }
    ],
    isActive: false
  },

  // ============= 2000 =============
  {
    id: 'aol-time-warner-2000',
    name: 'AOL-Time Warner Merger',
    date: { year: 2000, month: 1 },
    description: 'Largest merger in history! $165 billion deal.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 10 },
      { type: 'sector', target: 'Media', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'nasdaq-5000-2000',
    name: 'NASDAQ Hits 5000!',
    date: { year: 2000, month: 3 },
    description: 'Tech index reaches all-time high of 5048!',
    duration: 1,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'dotcom-crash-2000',
    name: 'DOT-COM BUBBLE BURSTS',
    date: { year: 2000, month: 3 },
    description: 'NASDAQ CRASHES FROM 5000! TRILLIONS EVAPORATE!',
    duration: 24,
    effects: [
      { type: 'market', magnitude: -20 },
      { type: 'sector', target: 'Technology', magnitude: -60 },
      { type: 'sector', target: 'Telecom', magnitude: -50 }
    ],
    isActive: false
  },
  {
    id: 'microsoft-antitrust-2000',
    name: 'Microsoft Antitrust Ruling',
    date: { year: 2000, month: 4 },
    description: 'Judge rules Microsoft is a monopoly. Breakup ordered.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: -15 }
    ],
    isActive: false
  },
  {
    id: 'election-2000',
    name: 'Bush v. Gore Election Crisis',
    date: { year: 2000, month: 11 },
    description: 'Presidential election goes to Supreme Court. Uncertainty grips markets.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: -8 }
    ],
    isActive: false
  },

  // ============= 2001 =============
  {
    id: 'fed-cuts-2001',
    name: 'Fed Slashes Rates',
    date: { year: 2001, month: 1 },
    description: 'Greenspan cuts rates to fight recession.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 5 },
      { type: 'sector', target: 'Real Estate', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'california-energy-2001',
    name: 'California Energy Crisis',
    date: { year: 2001, month: 1 },
    description: 'Rolling blackouts hit California. Enron manipulates prices.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: 15 },
      { type: 'sector', target: 'Utilities', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'sept-11-2001',
    name: 'SEPTEMBER 11 TERRORIST ATTACKS',
    date: { year: 2001, month: 9 },
    description: 'ATTACKS ON WORLD TRADE CENTER AND PENTAGON. MARKETS CLOSED.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: -15 },
      { type: 'sector', target: 'Transportation', magnitude: -35 },
      { type: 'sector', target: 'Defense', magnitude: 25 },
      { type: 'sector', target: 'Finance', magnitude: -20 }
    ],
    isActive: false
  },
  {
    id: 'afghanistan-war-2001',
    name: 'War in Afghanistan Begins',
    date: { year: 2001, month: 10 },
    description: 'US invades Afghanistan. War on Terror launched.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Defense', magnitude: 20 },
      { type: 'sector', target: 'Energy', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'enron-2001',
    name: 'ENRON SCANDAL',
    date: { year: 2001, month: 12 },
    description: 'Enron files for bankruptcy. Massive accounting fraud exposed!',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: -20 },
      { type: 'sector', target: 'Finance', magnitude: -10 }
    ],
    isActive: false
  },

  // ============= 2002 =============
  {
    id: 'argentina-default-2002',
    name: 'Argentina Defaults',
    date: { year: 2002, month: 1 },
    description: 'Argentina defaults on $155 billion. Largest sovereign default.',
    duration: 4,
    effects: [
      { type: 'market', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'arthur-andersen-2002',
    name: 'Arthur Andersen Convicted',
    date: { year: 2002, month: 6 },
    description: 'Big Five accounting firm destroyed by Enron scandal.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'worldcom-2002',
    name: 'WORLDCOM FRAUD',
    date: { year: 2002, month: 7 },
    description: 'Largest bankruptcy in history! $11 billion accounting fraud!',
    duration: 4,
    effects: [
      { type: 'market', magnitude: -10 },
      { type: 'sector', target: 'Telecom', magnitude: -30 }
    ],
    isActive: false
  },
  {
    id: 'sarbanes-oxley-2002',
    name: 'Sarbanes-Oxley Act',
    date: { year: 2002, month: 7 },
    description: 'Major corporate governance reform passed.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'market-bottom-2002',
    name: 'Bear Market Bottom',
    date: { year: 2002, month: 10 },
    description: 'S&P 500 hits multi-year low. Capitulation complete.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 15 }
    ],
    isActive: false
  },

  // ============= 2003 =============
  {
    id: 'columbia-disaster-2003',
    name: 'Columbia Space Shuttle Disaster',
    date: { year: 2003, month: 2 },
    description: 'Space shuttle breaks apart on re-entry.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Defense', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'iraq-war-2003',
    name: 'Iraq War Begins',
    date: { year: 2003, month: 3 },
    description: 'US invades Iraq. "Shock and Awe" campaign.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: 15 },
      { type: 'sector', target: 'Defense', magnitude: 20 }
    ],
    isActive: false
  },
  {
    id: 'sars-outbreak-2003',
    name: 'SARS Outbreak',
    date: { year: 2003, month: 3 },
    description: 'SARS spreads from Asia. Travel industry hit.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Transportation', magnitude: -10 },
      { type: 'sector', target: 'Healthcare', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'bush-tax-cuts-2003',
    name: 'Bush Tax Cuts',
    date: { year: 2003, month: 5 },
    description: 'Major tax cuts on dividends and capital gains.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 10 },
      { type: 'sector', target: 'Consumer', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'blackout-2003',
    name: 'Northeast Blackout',
    date: { year: 2003, month: 8 },
    description: 'Massive power failure affects 55 million people.',
    duration: 1,
    effects: [
      { type: 'sector', target: 'Utilities', magnitude: -8 }
    ],
    isActive: false
  },

  // ============= 2004 =============
  {
    id: 'facebook-founded-2004',
    name: 'Facebook Founded',
    date: { year: 2004, month: 2 },
    description: 'Harvard student launches social network.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'google-ipo-2004',
    name: 'Google IPO',
    date: { year: 2004, month: 8 },
    description: 'Google goes public at $85. Tech rally resumes!',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'oil-surge-2004',
    name: 'Oil Prices Surge',
    date: { year: 2004, month: 10 },
    description: 'Oil hits $50/barrel. Highest since 1991.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: 20 },
      { type: 'sector', target: 'Transportation', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'bush-reelected-2004',
    name: 'Bush Re-elected',
    date: { year: 2004, month: 11 },
    description: 'Bush wins second term. Markets rally.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 2005 =============
  {
    id: 'housing-boom-2005',
    name: 'Housing Bubble Peak',
    date: { year: 2005, month: 6 },
    description: 'Real estate prices at all-time highs! Everyone flipping houses!',
    duration: 12,
    effects: [
      { type: 'sector', target: 'Real Estate', magnitude: 20 },
      { type: 'sector', target: 'Finance', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'greenspan-retires-2005',
    name: 'Greenspan to Retire',
    date: { year: 2005, month: 10 },
    description: 'Bernanke nominated to replace Greenspan as Fed Chair.',
    duration: 3,
    effects: [
      { type: 'market', magnitude: 3 }
    ],
    isActive: false
  },
  {
    id: 'katrina-2005',
    name: 'Hurricane Katrina',
    date: { year: 2005, month: 8 },
    description: 'Devastating hurricane hits Gulf Coast. Oil platforms damaged.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: 15 },
      { type: 'sector', target: 'Real Estate', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'gm-downgrade-2005',
    name: 'GM & Ford Downgraded to Junk',
    date: { year: 2005, month: 5 },
    description: 'Auto giants lose investment grade ratings.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Industrial', magnitude: -12 }
    ],
    isActive: false
  },

  // ============= 2006 =============
  {
    id: 'bernanke-starts-2006',
    name: 'Bernanke Becomes Fed Chair',
    date: { year: 2006, month: 2 },
    description: 'Ben Bernanke takes over Federal Reserve.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 2 }
    ],
    isActive: false
  },
  {
    id: 'housing-slowdown-2006',
    name: 'Housing Market Slows',
    date: { year: 2006, month: 8 },
    description: 'Home sales falling rapidly. Subprime concerns emerge.',
    duration: 8,
    effects: [
      { type: 'sector', target: 'Real Estate', magnitude: -15 }
    ],
    isActive: false
  },
  {
    id: 'youtube-google-2006',
    name: 'Google Buys YouTube',
    date: { year: 2006, month: 10 },
    description: 'Google acquires YouTube for $1.65 billion.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 8 },
      { type: 'sector', target: 'Media', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'dow-12000-2006',
    name: 'Dow Hits 12,000',
    date: { year: 2006, month: 10 },
    description: 'Dow reaches new all-time high of 12,000!',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 2007 =============
  {
    id: 'iphone-launch-2007',
    name: 'iPhone Launched',
    date: { year: 2007, month: 6 },
    description: 'Apple revolutionizes mobile phones. Smartphone era begins!',
    duration: 12,
    effects: [
      { type: 'sector', target: 'Technology', magnitude: 15 },
      { type: 'sector', target: 'Telecom', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'new-century-2007',
    name: 'New Century Financial Bankrupt',
    date: { year: 2007, month: 4 },
    description: 'Second largest subprime lender files bankruptcy.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -10 },
      { type: 'sector', target: 'Real Estate', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'dow-14000-2007',
    name: 'Dow Hits 14,000!',
    date: { year: 2007, month: 7 },
    description: 'Dow Jones reaches all-time high of 14,000!',
    duration: 1,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'subprime-crisis-2007',
    name: 'SUBPRIME MORTGAGE CRISIS',
    date: { year: 2007, month: 8 },
    description: 'Banks face massive losses on mortgage securities! Credit freezes!',
    duration: 12,
    effects: [
      { type: 'market', magnitude: -12 },
      { type: 'sector', target: 'Finance', magnitude: -30 },
      { type: 'sector', target: 'Real Estate', magnitude: -25 }
    ],
    isActive: false
  },
  {
    id: 'northern-rock-2007',
    name: 'Northern Rock Bank Run',
    date: { year: 2007, month: 9 },
    description: 'First UK bank run in 150 years! Lines outside branches.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -12 }
    ],
    isActive: false
  },
  {
    id: 'oil-100-2007',
    name: 'Oil Hits $100',
    date: { year: 2007, month: 12 },
    description: 'Crude oil reaches $100/barrel for first time.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: 15 },
      { type: 'sector', target: 'Transportation', magnitude: -15 }
    ],
    isActive: false
  },

  // ============= 2008 =============
  {
    id: 'recession-begins-2008',
    name: 'Recession Officially Begins',
    date: { year: 2008, month: 1 },
    description: 'NBER declares recession started December 2007.',
    duration: 18,
    effects: [
      { type: 'market', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'bear-stearns-2008',
    name: 'BEAR STEARNS COLLAPSES',
    date: { year: 2008, month: 3 },
    description: 'Fed engineers emergency sale to JPMorgan for $2/share!',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -25 },
      { type: 'market', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'oil-147-2008',
    name: 'Oil Hits $147!',
    date: { year: 2008, month: 7 },
    description: 'Crude oil reaches all-time high of $147/barrel!',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: 20 },
      { type: 'sector', target: 'Transportation', magnitude: -20 },
      { type: 'sector', target: 'Consumer', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'fannie-freddie-2008',
    name: 'Fannie Mae & Freddie Mac Seized',
    date: { year: 2008, month: 9 },
    description: 'Government takes over mortgage giants. $200B bailout.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -15 },
      { type: 'sector', target: 'Real Estate', magnitude: -15 }
    ],
    isActive: false
  },
  {
    id: 'lehman-2008',
    name: 'LEHMAN BROTHERS COLLAPSE',
    date: { year: 2008, month: 9 },
    description: 'LEHMAN FILES BANKRUPTCY! GLOBAL FINANCIAL SYSTEM ON THE BRINK!',
    duration: 4,
    effects: [
      { type: 'market', magnitude: -35 },
      { type: 'sector', target: 'Finance', magnitude: -55 },
      { type: 'sector', target: 'Real Estate', magnitude: -40 }
    ],
    isActive: false
  },
  {
    id: 'aig-bailout-2008',
    name: 'AIG Bailout',
    date: { year: 2008, month: 9 },
    description: 'Fed rescues AIG with $85 billion. Too big to fail.',
    duration: 2,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: 5 }
    ],
    isActive: false
  },
  {
    id: 'tarp-2008',
    name: 'TARP Bailout Passed',
    date: { year: 2008, month: 10 },
    description: '$700 billion bank rescue package approved.',
    duration: 3,
    effects: [
      { type: 'market', magnitude: 10 },
      { type: 'sector', target: 'Finance', magnitude: 15 }
    ],
    isActive: false
  },
  {
    id: 'auto-bailout-2008',
    name: 'Auto Industry Bailout',
    date: { year: 2008, month: 12 },
    description: 'GM and Chrysler receive $17.4B in emergency loans.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Industrial', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'madoff-2008',
    name: 'Madoff Ponzi Scheme Exposed',
    date: { year: 2008, month: 12 },
    description: '$65 billion fraud! Largest Ponzi scheme in history!',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -10 }
    ],
    isActive: false
  },

  // ============= 2009 =============
  {
    id: 'obama-inauguration-2009',
    name: 'Obama Inaugurated',
    date: { year: 2009, month: 1 },
    description: 'Barack Obama becomes 44th President amid crisis.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 3 }
    ],
    isActive: false
  },
  {
    id: 'stimulus-2009',
    name: 'Obama Stimulus Package',
    date: { year: 2009, month: 2 },
    description: '$787 billion American Recovery and Reinvestment Act.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 8 },
      { type: 'sector', target: 'Industrial', magnitude: 10 }
    ],
    isActive: false
  },
  {
    id: 'market-bottom-2009',
    name: 'MARKET BOTTOM - RECOVERY BEGINS',
    date: { year: 2009, month: 3 },
    description: 'S&P 500 hits 666. The only way is up. Bull market begins!',
    duration: 12,
    effects: [
      { type: 'market', magnitude: 30 },
      { type: 'sector', target: 'Finance', magnitude: 40 }
    ],
    isActive: false
  },
  {
    id: 'gm-bankruptcy-2009',
    name: 'GM Files Bankruptcy',
    date: { year: 2009, month: 6 },
    description: 'General Motors files Chapter 11. Largest industrial bankruptcy.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Industrial', magnitude: -10 }
    ],
    isActive: false
  },
  {
    id: 'chrysler-bankruptcy-2009',
    name: 'Chrysler Bankruptcy',
    date: { year: 2009, month: 4 },
    description: 'Chrysler files for bankruptcy protection.',
    duration: 3,
    effects: [
      { type: 'sector', target: 'Industrial', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'h1n1-2009',
    name: 'H1N1 Swine Flu Pandemic',
    date: { year: 2009, month: 4 },
    description: 'WHO declares swine flu pandemic. Healthcare stocks surge.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Healthcare', magnitude: 12 },
      { type: 'sector', target: 'Transportation', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'dow-10000-again-2009',
    name: 'Dow Reclaims 10,000',
    date: { year: 2009, month: 10 },
    description: 'Dow crosses 10,000 again. Recovery confirmed.',
    duration: 2,
    effects: [
      { type: 'market', magnitude: 5 }
    ],
    isActive: false
  },

  // ============= 2010 =============
  {
    id: 'greece-crisis-2010',
    name: 'Greek Debt Crisis',
    date: { year: 2010, month: 2 },
    description: 'Greece near default. Eurozone crisis begins.',
    duration: 8,
    effects: [
      { type: 'market', magnitude: -8 },
      { type: 'sector', target: 'Finance', magnitude: -12 }
    ],
    isActive: false
  },
  {
    id: 'deepwater-horizon-2010',
    name: 'Deepwater Horizon Oil Spill',
    date: { year: 2010, month: 4 },
    description: 'Massive oil spill in Gulf of Mexico. BP crisis.',
    duration: 6,
    effects: [
      { type: 'sector', target: 'Energy', magnitude: -15 }
    ],
    isActive: false
  },
  {
    id: 'flash-crash-2010',
    name: 'FLASH CRASH',
    date: { year: 2010, month: 5 },
    description: 'Dow drops 1000 points in minutes! Algorithmic trading blamed!',
    duration: 1,
    effects: [
      { type: 'market', magnitude: -8 }
    ],
    isActive: false
  },
  {
    id: 'dodd-frank-2010',
    name: 'Dodd-Frank Act Passed',
    date: { year: 2010, month: 7 },
    description: 'Major financial reform legislation enacted.',
    duration: 4,
    effects: [
      { type: 'sector', target: 'Finance', magnitude: -5 }
    ],
    isActive: false
  },
  {
    id: 'qe2-2010',
    name: 'Fed Announces QE2',
    date: { year: 2010, month: 11 },
    description: 'Fed to buy $600 billion in Treasuries. More stimulus!',
    duration: 8,
    effects: [
      { type: 'market', magnitude: 10 },
      { type: 'sector', target: 'Finance', magnitude: 8 }
    ],
    isActive: false
  },
  {
    id: 'recovery-2010',
    name: 'Economic Recovery Confirmed',
    date: { year: 2010, month: 9 },
    description: 'Recession officially ended June 2009. Bull market continues.',
    duration: 6,
    effects: [
      { type: 'market', magnitude: 12 }
    ],
    isActive: false
  }
]

// ============ MODERN ERA EVENTS (2010-2026) ============
export const modernEvents: HistoricalEvent[] = [
  // 2010
  { id: 'flash-crash-2010', name: 'Flash Crash', date: { year: 2010, month: 5 }, description: 'Dow plunges 1000 points in minutes! HFT blamed.', duration: 1, effects: [{ type: 'market', magnitude: -15 }], isActive: false },
  { id: 'deepwater-2010', name: 'Deepwater Horizon Disaster', date: { year: 2010, month: 4 }, description: 'BP oil spill devastates Gulf of Mexico.', duration: 6, effects: [{ type: 'sector', target: 'Energy', magnitude: -20 }], isActive: false },
  
  // 2011
  { id: 'debt-ceiling-2011', name: 'US Debt Ceiling Crisis', date: { year: 2011, month: 8 }, description: 'S&P downgrades US credit rating!', duration: 3, effects: [{ type: 'market', magnitude: -18 }], isActive: false },
  { id: 'occupy-2011', name: 'Occupy Wall Street', date: { year: 2011, month: 9 }, description: 'Protesters target financial inequality.', duration: 4, effects: [{ type: 'sector', target: 'Finance', magnitude: -8 }], isActive: false },
  
  // 2012
  { id: 'facebook-ipo-2012', name: 'Facebook IPO', date: { year: 2012, month: 5 }, description: 'FB goes public at $38. Tech mania!', duration: 2, effects: [{ type: 'sector', target: 'Technology', magnitude: 12 }], isActive: false },
  { id: 'qe3-2012', name: 'Fed Launches QE3', date: { year: 2012, month: 9 }, description: 'Unlimited QE! $40B/month MBS purchases.', duration: 12, effects: [{ type: 'market', magnitude: 15 }], isActive: false },
  
  // 2013
  { id: 'taper-tantrum-2013', name: 'Taper Tantrum', date: { year: 2013, month: 5 }, description: 'Bernanke hints at QE tapering. Bonds crash!', duration: 3, effects: [{ type: 'market', magnitude: -8 }], isActive: false },
  { id: 'twitter-ipo-2013', name: 'Twitter IPO', date: { year: 2013, month: 11 }, description: 'Twitter debuts at $26, soars to $45!', duration: 2, effects: [{ type: 'sector', target: 'Technology', magnitude: 8 }], isActive: false },
  
  // 2014
  { id: 'alibaba-ipo-2014', name: 'Alibaba IPO - Largest Ever', date: { year: 2014, month: 9 }, description: 'BABA raises $25B! China tech dominance.', duration: 3, effects: [{ type: 'sector', target: 'Technology', magnitude: 10 }], isActive: false },
  { id: 'oil-crash-2014', name: 'Oil Price Collapse', date: { year: 2014, month: 11 }, description: 'Oil crashes from $100 to $50! Shale glut.', duration: 8, effects: [{ type: 'sector', target: 'Energy', magnitude: -35 }], isActive: false },
  
  // 2015
  { id: 'china-crash-2015', name: 'China Stock Market Crash', date: { year: 2015, month: 8 }, description: 'Shanghai plunges 40%. Global contagion!', duration: 3, effects: [{ type: 'market', magnitude: -12 }], isActive: false },
  { id: 'rate-hike-2015', name: 'Fed First Rate Hike Since 2006', date: { year: 2015, month: 12 }, description: 'Fed raises rates from zero. Era ends.', duration: 2, effects: [{ type: 'market', magnitude: 5 }], isActive: false },
  
  // 2016
  { id: 'brexit-2016', name: 'Brexit Vote Shocks World', date: { year: 2016, month: 6 }, description: 'UK votes to leave EU! Markets in turmoil.', duration: 2, effects: [{ type: 'market', magnitude: -10 }], isActive: false },
  { id: 'trump-2016', name: 'Trump Election Victory', date: { year: 2016, month: 11 }, description: 'Markets surge on tax cut hopes!', duration: 6, effects: [{ type: 'market', magnitude: 15 }], isActive: false },
  
  // 2017
  { id: 'tax-cuts-2017', name: 'Trump Tax Cuts Passed', date: { year: 2017, month: 12 }, description: 'Corporate tax slashed to 21%!', duration: 6, effects: [{ type: 'market', magnitude: 18 }], isActive: false },
  
  // 2018
  { id: 'volatility-2018', name: 'Volatility Returns', date: { year: 2018, month: 2 }, description: 'VIX spikes! XIV ETF blown up.', duration: 2, effects: [{ type: 'market', magnitude: -12 }], isActive: false },
  { id: 'trade-war-2018', name: 'US-China Trade War Begins', date: { year: 2018, month: 7 }, description: 'Tariffs escalate! Tech supply chains hit.', duration: 12, effects: [{ type: 'market', magnitude: -8 }, { type: 'sector', target: 'Technology', magnitude: -15 }], isActive: false },
  { id: 'fed-hikes-2018', name: 'Fed Hiking Cycle', date: { year: 2018, month: 12 }, description: 'Fourth rate hike triggers selloff!', duration: 2, effects: [{ type: 'market', magnitude: -15 }], isActive: false },
  
  // 2019
  { id: 'fed-pivot-2019', name: 'Fed Powell Pivot', date: { year: 2019, month: 1 }, description: 'Fed signals pause! Markets explode higher.', duration: 6, effects: [{ type: 'market', magnitude: 18 }], isActive: false },
  { id: 'repo-crisis-2019', name: 'Repo Market Crisis', date: { year: 2019, month: 9 }, description: 'Overnight rates spike to 10%! Fed intervenes.', duration: 3, effects: [{ type: 'sector', target: 'Finance', magnitude: -8 }], isActive: false },
  
  // 2020
  { id: 'covid-crash-2020', name: 'COVID-19 CRASH', date: { year: 2020, month: 3 }, description: '!!! PANDEMIC PANIC! Fastest bear market ever! 35% crash in weeks!', duration: 2, effects: [{ type: 'market', magnitude: -40 }], isActive: false },
  { id: 'fed-unlimited-2020', name: 'Fed Goes UNLIMITED', date: { year: 2020, month: 3 }, description: '!!! Unlimited QE! Fed buying everything! BRRR!', duration: 12, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  { id: 'stimulus-2020', name: 'CARES Act $2.2 Trillion', date: { year: 2020, month: 3 }, description: 'Largest stimulus in history! Helicopter money!', duration: 6, effects: [{ type: 'market', magnitude: 25 }], isActive: false },
  
  // 2021
  { id: 'gamestop-2021', name: '!!! GAMESTOP SQUEEZE !!!', date: { year: 2021, month: 1 }, description: 'WSB vs Wall Street! GME from $20 to $480! Meme stocks!', duration: 2, effects: [{ type: 'market', magnitude: 10 }], isActive: false },
  { id: 'spac-mania-2021', name: 'SPAC Bubble Peaks', date: { year: 2021, month: 2 }, description: 'SPAC frenzy hits all-time highs!', duration: 4, effects: [{ type: 'market', magnitude: 12 }], isActive: false },
  { id: 'inflation-2021', name: 'Inflation Surge Begins', date: { year: 2021, month: 10 }, description: 'CPI hits 6%+! "Transitory" narrative questioned.', duration: 6, effects: [{ type: 'market', magnitude: -8 }], isActive: false },
  
  // 2022
  { id: 'rate-hikes-2022', name: 'Fed AGGRESSIVE Hiking Cycle', date: { year: 2022, month: 3 }, description: 'Fed raises rates fastest in history! 75bp hikes!', duration: 12, effects: [{ type: 'market', magnitude: -25 }, { type: 'sector', target: 'Technology', magnitude: -35 }], isActive: false },
  { id: 'ukraine-2022', name: 'Russia Invades Ukraine', date: { year: 2022, month: 2 }, description: 'War in Europe! Energy crisis! Sanctions!', duration: 6, effects: [{ type: 'market', magnitude: -10 }, { type: 'sector', target: 'Energy', magnitude: 40 }], isActive: false },
  { id: 'meta-crash-2022', name: 'Meta Metaverse Meltdown', date: { year: 2022, month: 10 }, description: 'META crashes 70%! Metaverse spending questioned.', duration: 2, effects: [{ type: 'sector', target: 'Technology', magnitude: -15 }], isActive: false },
  
  // 2023
  { id: 'svb-2023', name: '!!! SVB COLLAPSE !!!', date: { year: 2023, month: 3 }, description: 'Silicon Valley Bank fails! Bank runs! Regional bank crisis!', duration: 2, effects: [{ type: 'sector', target: 'Finance', magnitude: -25 }], isActive: false },
  { id: 'ai-boom-2023', name: 'AI REVOLUTION - ChatGPT Mania', date: { year: 2023, month: 1 }, description: 'ChatGPT launches AI arms race! NVIDIA soars!', duration: 12, effects: [{ type: 'sector', target: 'Technology', magnitude: 50 }], isActive: false },
  { id: 'magnificent-7-2023', name: 'Magnificent 7 Dominate', date: { year: 2023, month: 6 }, description: 'AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA carry entire market!', duration: 6, effects: [{ type: 'sector', target: 'Technology', magnitude: 35 }], isActive: false },
  
  // 2024
  { id: 'rate-cuts-2024', name: 'Fed Begins Cutting Rates', date: { year: 2024, month: 9 }, description: 'First rate cut in 4 years! Soft landing achieved?', duration: 6, effects: [{ type: 'market', magnitude: 12 }], isActive: false },
  { id: 'nvidia-trillion-2024', name: 'NVIDIA Hits $2 Trillion', date: { year: 2024, month: 2 }, description: 'NVDA becomes 3rd most valuable company! AI chip king!', duration: 4, effects: [{ type: 'sector', target: 'Technology', magnitude: 20 }], isActive: false },
  
  // 2025
  { id: 'ai-agents-2025', name: 'AI Agents Transform Work', date: { year: 2025, month: 3 }, description: 'AI agents automate knowledge work. Productivity surge!', duration: 6, effects: [{ type: 'sector', target: 'Technology', magnitude: 25 }], isActive: false },
  { id: 'ev-adoption-2025', name: 'EV Adoption Accelerates', date: { year: 2025, month: 6 }, description: 'EVs hit 50% of new car sales in major markets!', duration: 6, effects: [{ type: 'sector', target: 'Technology', magnitude: 15 }], isActive: false },
  
  // 2026
  { id: 'agi-concerns-2026', name: 'AGI Safety Debate', date: { year: 2026, month: 1 }, description: 'Major AI labs pause development over safety concerns.', duration: 4, effects: [{ type: 'sector', target: 'Technology', magnitude: -10 }], isActive: false },
]

// ============ CRYPTO ERA EVENTS (2009-2026) ============
export const cryptoEvents: HistoricalEvent[] = [
  // 2009-2012
  { id: 'genesis-2009', name: '!!! BITCOIN GENESIS BLOCK !!!', date: { year: 2009, month: 1 }, description: 'Satoshi Nakamoto mines first Bitcoin! A new era begins.', duration: 1, effects: [{ type: 'market', magnitude: 100 }], isActive: false },
  { id: 'pizza-2010', name: 'First Bitcoin Transaction', date: { year: 2010, month: 5 }, description: '10,000 BTC for 2 pizzas! ($40M in 2024)', duration: 1, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  { id: 'silk-road-2011', name: 'Silk Road Launches', date: { year: 2011, month: 2 }, description: 'Dark web marketplace accepts Bitcoin. Usage surges!', duration: 6, effects: [{ type: 'market', magnitude: 200 }], isActive: false },
  { id: 'btc-parity-2011', name: 'Bitcoin Reaches $1', date: { year: 2011, month: 2 }, description: 'BTC hits parity with US dollar!', duration: 2, effects: [{ type: 'market', magnitude: 100 }], isActive: false },
  { id: 'btc-crash-2011', name: 'First Major BTC Crash', date: { year: 2011, month: 6 }, description: 'BTC crashes from $32 to $2! 94% drawdown!', duration: 6, effects: [{ type: 'market', magnitude: -90 }], isActive: false },
  
  // 2013-2014
  { id: 'cyprus-2013', name: 'Cyprus Banking Crisis', date: { year: 2013, month: 3 }, description: 'Bank bail-ins drive Bitcoin adoption! BTC to $266!', duration: 3, effects: [{ type: 'market', magnitude: 300 }], isActive: false },
  { id: 'china-ban-2013', name: 'China Bans Bitcoin', date: { year: 2013, month: 12 }, description: 'PBOC prohibits Bitcoin! Crash from $1100 to $400!', duration: 4, effects: [{ type: 'market', magnitude: -60 }], isActive: false },
  { id: 'mtgox-2014', name: '!!! MT. GOX COLLAPSE !!!', date: { year: 2014, month: 2 }, description: 'Largest exchange hacked! 850,000 BTC stolen! Industry crisis!', duration: 12, effects: [{ type: 'market', magnitude: -70 }], isActive: false },
  
  // 2015-2016
  { id: 'ethereum-2015', name: 'ETHEREUM LAUNCHES', date: { year: 2015, month: 7 }, description: 'Smart contracts are born! Vitalik\'s vision realized!', duration: 6, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  { id: 'dao-hack-2016', name: 'THE DAO HACK', date: { year: 2016, month: 6 }, description: '$60M stolen! Ethereum forks! ETH vs ETC!', duration: 3, effects: [{ type: 'market', magnitude: -40 }], isActive: false },
  { id: 'halving-2016', name: 'Second Bitcoin Halving', date: { year: 2016, month: 7 }, description: 'Block reward cuts to 12.5 BTC! Supply shock!', duration: 12, effects: [{ type: 'market', magnitude: 100 }], isActive: false },
  
  // 2017
  { id: 'ico-mania-2017', name: 'ICO MANIA BEGINS', date: { year: 2017, month: 6 }, description: 'Initial Coin Offerings explode! Billions raised!', duration: 6, effects: [{ type: 'market', magnitude: 200 }], isActive: false },
  { id: 'btc-fork-2017', name: 'Bitcoin Cash Fork', date: { year: 2017, month: 8 }, description: 'BTC splits! Block size wars! BCH is born!', duration: 2, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  { id: 'btc-20k-2017', name: '!!! BTC HITS $20,000 !!!', date: { year: 2017, month: 12 }, description: 'Crypto mania peaks! FOMO everywhere! 20x in one year!', duration: 1, effects: [{ type: 'market', magnitude: 300 }], isActive: false },
  
  // 2018
  { id: 'crypto-winter-2018', name: 'CRYPTO WINTER BEGINS', date: { year: 2018, month: 1 }, description: 'Bubble bursts! BTC crashes 80%! Altcoins -95%!', duration: 12, effects: [{ type: 'market', magnitude: -85 }], isActive: false },
  { id: 'sec-crackdown-2018', name: 'SEC ICO Crackdown', date: { year: 2018, month: 11 }, description: 'SEC charges ICO issuers! Regulatory clarity demanded!', duration: 6, effects: [{ type: 'market', magnitude: -30 }], isActive: false },
  
  // 2019-2020
  { id: 'defi-summer-2020', name: 'DeFi SUMMER!', date: { year: 2020, month: 6 }, description: 'Yield farming explodes! COMP, YFI, UNI! TVL skyrockets!', duration: 6, effects: [{ type: 'market', magnitude: 150 }], isActive: false },
  { id: 'btc-halving-2020', name: 'Third Bitcoin Halving', date: { year: 2020, month: 5 }, description: 'Block reward to 6.25 BTC! Bull run catalyst!', duration: 12, effects: [{ type: 'market', magnitude: 200 }], isActive: false },
  { id: 'microstrategy-2020', name: 'MicroStrategy Buys BTC', date: { year: 2020, month: 8 }, description: 'First public company treasury allocation! Saylor!', duration: 4, effects: [{ type: 'market', magnitude: 80 }], isActive: false },
  
  // 2021
  { id: 'tesla-btc-2021', name: 'Tesla Buys $1.5B Bitcoin', date: { year: 2021, month: 2 }, description: 'Elon buys Bitcoin! Price to $58K! Mainstream adoption!', duration: 3, effects: [{ type: 'market', magnitude: 100 }], isActive: false },
  { id: 'coinbase-ipo-2021', name: 'Coinbase IPO', date: { year: 2021, month: 4 }, description: 'COIN goes public at $328! Crypto goes mainstream!', duration: 2, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  { id: 'china-mining-ban-2021', name: 'China Bans Crypto Mining', date: { year: 2021, month: 5 }, description: 'Hash rate crashes 50%! Miners exodus!', duration: 3, effects: [{ type: 'market', magnitude: -45 }], isActive: false },
  { id: 'el-salvador-2021', name: 'El Salvador Legal Tender', date: { year: 2021, month: 9 }, description: 'First country makes BTC legal tender! Nayib Bukele!', duration: 2, effects: [{ type: 'market', magnitude: 30 }], isActive: false },
  { id: 'btc-69k-2021', name: '!!! BTC ATH $69,000 !!!', date: { year: 2021, month: 11 }, description: 'Bitcoin peaks! Crypto market cap $3 trillion!', duration: 1, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  
  // 2022
  { id: 'luna-crash-2022', name: '!!! TERRA LUNA COLLAPSE !!!', date: { year: 2022, month: 5 }, description: 'UST depeg! LUNA to zero! $60B wiped out! Contagion!', duration: 3, effects: [{ type: 'market', magnitude: -60 }], isActive: false },
  { id: 'celsius-2022', name: 'Celsius Freezes Withdrawals', date: { year: 2022, month: 6 }, description: 'Crypto lender halts redemptions! Dominos falling!', duration: 2, effects: [{ type: 'market', magnitude: -30 }], isActive: false },
  { id: '3ac-2022', name: 'Three Arrows Capital Blows Up', date: { year: 2022, month: 6 }, description: '$10B hedge fund liquidated! Su Zhu disappears!', duration: 2, effects: [{ type: 'market', magnitude: -35 }], isActive: false },
  { id: 'merge-2022', name: 'Ethereum Merge - Proof of Stake', date: { year: 2022, month: 9 }, description: 'ETH moves to PoS! 99.9% less energy! Historic!', duration: 4, effects: [{ type: 'market', magnitude: 20 }], isActive: false },
  { id: 'ftx-collapse-2022', name: '!!! FTX COLLAPSE !!!', date: { year: 2022, month: 11 }, description: 'SBF arrested! $32B exchange implodes! Industry crisis!', duration: 4, effects: [{ type: 'market', magnitude: -50 }], isActive: false },
  
  // 2023
  { id: 'ordinals-2023', name: 'Bitcoin Ordinals & BRC-20', date: { year: 2023, month: 2 }, description: 'NFTs on Bitcoin! Meme coins on BTC! Network congestion!', duration: 4, effects: [{ type: 'market', magnitude: 30 }], isActive: false },
  { id: 'btc-etf-filing-2023', name: 'BlackRock Files Bitcoin ETF', date: { year: 2023, month: 6 }, description: 'Largest asset manager wants spot BTC ETF! Game changer!', duration: 6, effects: [{ type: 'market', magnitude: 50 }], isActive: false },
  
  // 2024
  { id: 'btc-etf-2024', name: '!!! SPOT BTC ETF APPROVED !!!', date: { year: 2024, month: 1 }, description: 'SEC approves 11 Bitcoin ETFs! Wall Street money flows in!', duration: 6, effects: [{ type: 'market', magnitude: 100 }], isActive: false },
  { id: 'halving-2024', name: 'Fourth Bitcoin Halving', date: { year: 2024, month: 4 }, description: 'Block reward to 3.125 BTC! Supply crunch!', duration: 12, effects: [{ type: 'market', magnitude: 150 }], isActive: false },
  { id: 'eth-etf-2024', name: 'Spot Ethereum ETF Approved', date: { year: 2024, month: 5 }, description: 'ETH joins the party! Institutional adoption expands!', duration: 4, effects: [{ type: 'market', magnitude: 60 }], isActive: false },
  { id: 'btc-100k-2024', name: '!!! BITCOIN $100,000 !!!', date: { year: 2024, month: 12 }, description: 'Six figures! Dreams realized! Hodlers vindicated!', duration: 2, effects: [{ type: 'market', magnitude: 80 }], isActive: false },
  
  // 2025
  { id: 'defi-2-2025', name: 'DeFi 2.0 Revolution', date: { year: 2025, month: 3 }, description: 'Real yield protocols dominate! $500B TVL!', duration: 6, effects: [{ type: 'market', magnitude: 100 }], isActive: false },
  { id: 'cbdc-adoption-2025', name: 'Global CBDC Rollouts', date: { year: 2025, month: 6 }, description: 'Digital yuan, digital euro launch. Crypto competition!', duration: 4, effects: [{ type: 'market', magnitude: -20 }], isActive: false },
  
  // 2026
  { id: 'hyperbitcoinization-2026', name: 'Nation-State Adoption Wave', date: { year: 2026, month: 1 }, description: 'Multiple countries add BTC to reserves! Hyperbitcoinization begins!', duration: 6, effects: [{ type: 'market', magnitude: 200 }], isActive: false },
  { id: 'eth-scaling-2026', name: 'Ethereum Full Danksharding', date: { year: 2026, month: 6 }, description: 'ETH scales to 100K TPS! Gas fees near zero!', duration: 6, effects: [{ type: 'market', magnitude: 80 }], isActive: false },
]
