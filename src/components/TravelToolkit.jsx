import { useState } from 'react'
import {
  Volume2,
  BookOpen,
  Calculator,
  CheckSquare,
  Square,
  ShieldCheck,
  Luggage,
} from 'lucide-react'
import { speakJapanese } from '../utils/speech.js'

const phrasesData = {
  greetings: [
    { kanji: 'こんにちは', romaji: 'Konnichiwa', english: 'Hello / Good afternoon', tip: 'Universal polite greeting during daylight' },
    { kanji: 'ありがとうございます', romaji: 'Arigatō gozaimasu', english: 'Thank you very much', tip: 'Essential polite appreciation' },
    { kanji: 'すみません', romaji: 'Sumimasen', english: 'Excuse me / Sorry', tip: 'Call a waiter, apologize, or ask for help' },
    { kanji: 'ごちそうさまでした', romaji: 'Gochisōsama deshita', english: 'Thank you for the delicious meal', tip: 'Say when leaving a restaurant' },
    { kanji: 'いただきます', romaji: 'Itadakimasu', english: 'I humbly receive this food', tip: 'Say before eating with hands together' },
  ],
  dining: [
    { kanji: 'お会計をお願いします', romaji: 'O-kaikei o onegai shimasu', english: 'Check / Bill, please', tip: 'Or make an "X" with your index fingers' },
    { kanji: 'おすすめは何ですか？', romaji: 'Osusume wa nan desu ka?', english: 'What do you recommend?', tip: 'Great for uncovering local specialties' },
    { kanji: 'これをお願いします', romaji: 'Kore o onegai shimasu', english: 'This one, please', tip: 'Point at any menu photo or item' },
    { kanji: 'お水をお願いします', romaji: 'O-mizu o onegai shimasu', english: 'Water, please', tip: 'Water & tea are almost always free in Japan' },
    { kanji: '英語のメニューはありますか？', romaji: 'Eigo no menyū wa arimasu ka?', english: 'Do you have an English menu?', tip: 'Polite inquiry for international menus' },
  ],
  transit: [
    { kanji: '〜はどこですか？', romaji: '... wa doko desu ka?', english: 'Where is [place]?', tip: 'e.g. Eki wa doko desu ka? (Where is the station?)' },
    { kanji: 'この電車は〜に行きますか？', romaji: 'Kono densha wa ... ni ikimasu ka?', english: 'Does this train go to [place]?', tip: 'Confirm before boarding express trains' },
    { kanji: '切符売り場はどこですか？', romaji: 'Kippu uriba wa doko desu ka?', english: 'Where is the ticket machine / office?', tip: 'For IC cards and bullet train tickets' },
  ],
  emergency: [
    { kanji: '助けてください', romaji: 'Tasukete kudasai', english: 'Please help me', tip: 'For urgent emergencies' },
    { kanji: '英語が話せますか？', romaji: 'Eigo ga hanasemasu ka?', english: 'Can you speak English?', tip: 'Polite inquiry for assistance' },
    { kanji: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', english: 'Where is the restroom?', tip: 'Most train stations & convenience stores have free clean restrooms' },
  ],
}

const etiquetteGuides = [
  {
    title: '♨️ Onsen (Hot Spring) Etiquette',
    badge: 'Relaxation & Respect',
    rules: [
      '1. Wash & rinse thoroughly at the sit-down washing stations BEFORE entering the communal bath.',
      '2. No swimwear allowed in traditional onsens (keep hair tied up; no hair in water).',
      '3. Small modesty towels should rest on your head or beside the bath — do not soak them in the thermal water.',
      '4. Tattoos: Many ryokans now welcome tattoos, or offer private family baths (Kashikiri-buro).',
      '5. Dry off with your small towel before re-entering the changing room.',
    ],
  },
  {
    title: '⛩️ Shinto Shrine vs 🛕 Buddhist Temple Protocol',
    badge: 'Spiritual Wisdom',
    rules: [
      '⛩️ Shinto Shrines (Torii Gate): Bow once at the gate. At the altar: Toss 5-yen coin → Bow twice (deep) → Clap twice firmly → Make your prayer with hands together → Bow once deeply (2 Bows, 2 Claps, 1 Bow).',
      '🛕 Buddhist Temples (Sanmon Gate): Bow gently at the gate. At the altar: Toss coin → Bow head silently with palms pressed together (NO clapping).',
      'Purification Water (Temizuya): Wash left hand, wash right hand, rinse mouth with left hand (do not drink from ladle), tilt ladle upright to clean handle.',
    ],
  },
  {
    title: '🚅 Shinkansen & Transit Manners',
    badge: 'Smooth Travel',
    rules: [
      '1. Keep phones on silent mode (Manner Mode) and avoid talking on phone calls inside trains.',
      '2. Queue up in orderly lines behind the floor markings before trains arrive.',
      '3. Eating on local commuter trains is frowned upon; eating bento (Ekiben) on bullet trains is encouraged!',
      '4. Oversized baggage (>160cm total dimensions) on the Tokaido Shinkansen requires reserved baggage seats.',
    ],
  },
  {
    title: '💴 Tipping & Cash Manners',
    badge: 'Daily Etiquette',
    rules: [
      '1. No tipping in Japan! Exceptional hospitality (Omotenashi) is included; leaving extra cash can cause confusion.',
      '2. When paying with cash or credit card, place payment into the small plastic tray (tsuri-sen tray) provided at the register.',
      '3. Carry some cash: while IC cards and credit cards are widely accepted, small local ramen shops, shrines, and coin lockers still require JPY coins and 1,000-yen notes.',
    ],
  },
]

export function TravelToolkit() {
  const [activePhraseTab, setActivePhraseTab] = useState('greetings')
  const [speakingPhrase, setSpeakingPhrase] = useState(null)
  const [budgetCurrency, setBudgetCurrency] = useState('USD')
  const [dailyBudgetStyle, setDailyBudgetStyle] = useState('explorer')
  const [checkedPacks, setCheckedPacks] = useState({})

  const rates = {
    USD: 0.0067, // 1 JPY = ~0.0067 USD (1 USD = 150 JPY)
    EUR: 0.0062,
    GBP: 0.0053,
    AUD: 0.0102,
    CAD: 0.0091,
  }

  const budgetTiers = {
    backpacker: { label: 'Backpacker / Hostel', jpy: 8500, desc: 'Capsule hotel/hostel, street food & ramen, day transit passes' },
    explorer: { label: 'Comfort Explorer', jpy: 22000, desc: '3-star modern hotel, authentic izakaya, attractions, Shinkansen' },
    luxury: { label: 'Luxury Ryokan & Kaiseki', jpy: 55000, desc: 'Traditional onsen ryokan with private bath, multi-course Kaiseki dining' },
  }

  const selectedTier = budgetTiers[dailyBudgetStyle]
  const convertedDaily = Math.round(selectedTier.jpy * (rates[budgetCurrency] || 0.0067))

  const handleSpeakPhrase = (kanji) => {
    if (speakingPhrase) return
    setSpeakingPhrase(kanji)
    speakJapanese(kanji, () => setSpeakingPhrase(null))
  }

  const packingItems = [
    'Passport with at least 6 months validity',
    'Pocket Wi-Fi or Japan e-SIM installed on smartphone',
    'Suica or Pasmo digital transit IC card added to Apple Wallet / Google Wallet',
    'Comfortable slip-on walking shoes (for frequently taking shoes off at temples & ryokans)',
    'Universal power adapter (Japan uses Type A two-prong flat plugs, 100V)',
    'Small coin pouch / coin purse for 100 & 500 yen coins (vending machines & lockers)',
    'Small hand towel / handkerchief (many public restrooms do not provide paper towels)',
    'Coin battery power bank (20,000 mAh) for all-day navigation',
  ]

  const togglePacking = (item) => {
    setCheckedPacks((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Section 1: Audio Phrasebook */}
      <div className="rounded-2xl glass-panel p-5 sm:p-7 border border-white/10 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-400" />
              <span>Pocket Japanese Phrasebook with Audio</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click the audio button to hear native Japanese pronunciation
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5 text-xs font-medium">
            {Object.keys(phrasesData).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActivePhraseTab(cat)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  activePhraseTab === cat
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases Grid */}
        <div className="grid sm:grid-cols-2 gap-3 pt-4">
          {phrasesData[activePhraseTab].map((p) => {
            const isSpeaking = speakingPhrase === p.kanji

            return (
              <div
                key={p.kanji}
                className="p-3.5 rounded-xl glass-card border border-white/10 flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-jp text-lg font-bold text-rose-300">
                      {p.kanji}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {p.romaji}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {p.english}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    💡 {p.tip}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakPhrase(p.kanji)}
                  disabled={isSpeaking}
                  title="Listen to pronunciation"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-white/10 shrink-0 transition-transform active:scale-95"
                >
                  <Volume2 className={`size-4 ${isSpeaking ? 'text-rose-400 animate-ping' : ''}`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 2: Onsen & Etiquette Guides */}
      <div className="rounded-2xl glass-panel p-5 sm:p-7 border border-white/10 shadow-2xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-white/10">
          <ShieldCheck className="size-5 text-amber-400" />
          <span>Japan Culture, Onsen & Etiquette Essentials</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-4 pt-4">
          {etiquetteGuides.map((guide) => (
            <div
              key={guide.title}
              className="p-4 rounded-xl glass-card border border-white/10 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  {guide.title}
                </h3>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {guide.badge}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {guide.rules.map((r) => (
                  <li key={r} className="leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Budget Calculator & Packing List */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Budget Calculator */}
        <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="size-4 text-sky-400" />
              <span>Japan Trip Budget Estimator</span>
            </h2>
            <select
              value={budgetCurrency}
              onChange={(e) => setBudgetCurrency(e.target.value)}
              className="bg-slate-900 border border-white/15 rounded-lg text-xs px-2 py-1 text-white focus:outline-none focus:border-sky-400"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(budgetTiers).map(([key, tier]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDailyBudgetStyle(key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  dailyBudgetStyle === key
                    ? 'bg-sky-500/15 border-sky-400 text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold block">{tier.label.split('/')[0]}</span>
                <span className="text-[11px] text-sky-300 font-mono mt-1 block">
                  ¥{tier.jpy.toLocaleString()}/day
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Estimated Daily Cost:</span>
              <div className="text-right">
                <span className="text-xl font-extrabold text-white">
                  ~{budgetCurrency} {convertedDaily}
                </span>
                <span className="text-xs text-slate-400 ml-1.5 font-mono">
                  (¥{selectedTier.jpy.toLocaleString()} JPY)
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 pt-1 border-t border-white/5 mt-2">
              💡 {selectedTier.desc}
            </p>
          </div>
        </div>

        {/* Packing Checklist */}
        <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Luggage className="size-4 text-emerald-400" />
              <span>Japan Travel Essentials Checklist</span>
            </h2>
            <span className="text-xs text-slate-400">
              {Object.values(checkedPacks).filter(Boolean).length} / {packingItems.length}
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {packingItems.map((item) => {
              const isChecked = !!checkedPacks[item]

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => togglePacking(item)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300 line-through'
                      : 'bg-slate-900/60 border-white/5 text-slate-200 hover:border-white/20'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="size-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs">{item}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
