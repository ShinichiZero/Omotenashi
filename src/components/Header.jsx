import { useState, useRef, useEffect } from 'react'
import {
  Compass,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Bookmark,
  Award,
  BookOpen,
  MapPin,
  X,
} from 'lucide-react'
import { startSoundscape, stopSoundscape } from '../utils/ambientSound.js'
import confetti from 'canvas-confetti'

const seasons = [
  { id: 'spring', label: 'Spring', kanji: '春', emoji: '🌸', color: 'text-rose-400' },
  { id: 'summer', label: 'Summer', kanji: '夏', emoji: '☀️', color: 'text-amber-400' },
  { id: 'autumn', label: 'Autumn', kanji: '秋', emoji: '🍁', color: 'text-orange-400' },
  { id: 'winter', label: 'Winter', kanji: '冬', emoji: '❄️', color: 'text-sky-400' },
]

const soundscapes = [
  { id: 'zen-temple', name: 'Temple Bell', icon: '🔔' },
  { id: 'bamboo-water', name: 'Bamboo Shishi-odoshi', icon: '🎋' },
  { id: 'kyoto-rain', name: 'Kyoto Rain', icon: '🌧️' },
  { id: 'summer-furin', name: 'Wind Chime (Furin)', icon: '🎐' },
]

export function Header({
  activeSeason,
  onSeasonChange,
  activeTab,
  onTabChange,
  prefectures = [],
  onSelectPrefecture,
  bookmarksCount = 0,
  stampsCount = 0,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeSound, setActiveSound] = useState(null)
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false)
  const searchRef = useRef(null)

  // Filter prefectures for search
  const filteredPrefectures = searchQuery.trim()
    ? prefectures.filter((p) => {
        const query = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(query) ||
          p.japaneseName?.includes(query) ||
          p.romaji?.toLowerCase().includes(query) ||
          p.capital.toLowerCase().includes(query) ||
          p.region.toLowerCase().includes(query) ||
          p.highlights?.some((h) => h.toLowerCase().includes(query)) ||
          p.tagline?.toLowerCase().includes(query)
        )
      })
    : []

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Omikuji / Random Prefecture Fortune
  const handleOmikuji = () => {
    if (!prefectures.length) return
    const randomPref = prefectures[Math.floor(Math.random() * prefectures.length)]
    onSelectPrefecture(randomPref.id)
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#e11d48'],
    })
  }

  const toggleSound = (soundId) => {
    if (activeSound === soundId) {
      stopSoundscape()
      setActiveSound(null)
    } else {
      const started = startSoundscape(soundId, 0.45)
      if (started) {
        setActiveSound(soundId)
      }
    }
    setIsSoundMenuOpen(false)
  }

  return (
    <header className="relative z-40 border-b border-white/10 glass-panel backdrop-blur-xl sticky top-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top brand & controls bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Kanji title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hanko-seal-outer bg-rose-500/10 border-rose-500/40 p-1.5 rounded-full shadow-inner">
              <span className="font-serif-jp text-rose-400 font-bold text-base sm:text-lg tracking-tighter px-1">
                奉
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-2xl tracking-wide text-white">
                  OMOTENASHI
                </span>
                <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.25em] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Concierge
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-jp tracking-wider">
                日本47都道府県 旅の案内所 · 47 Prefectures Guide
              </p>
            </div>
          </div>

          {/* Center search bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search prefecture, Tokyo, Kyoto, ramen, onsen, castle..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-full py-2 pl-9 pr-9 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/40 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Search Autocomplete dropdown */}
            {isSearchOpen && filteredPrefectures.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto z-50 animate-scale-in">
                <div className="p-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  Matching Prefectures ({filteredPrefectures.length})
                </div>
                {filteredPrefectures.map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => {
                      onSelectPrefecture(pref.id)
                      setIsSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="w-full text-left p-3 hover:bg-slate-800/80 flex items-center justify-between border-b border-white/5 last:border-0 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="hanko-stamp unclaimed size-8 text-xs font-bold shrink-0">
                        {pref.japaneseName?.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white text-sm">{pref.name}</span>
                          <span className="text-xs text-slate-400 font-jp">{pref.japaneseName}</span>
                          <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {pref.region}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{pref.tagline}</p>
                      </div>
                    </div>
                    <MapPin className="size-4 text-slate-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action buttons: Omikuji & Zen Soundscape */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Omikuji Randomizer */}
            <button
              type="button"
              onClick={handleOmikuji}
              title="Omikuji — Surprise me with a random prefecture"
              className="btn-zen-secondary text-xs py-1.5 px-2.5 sm:px-3 text-amber-300 border-amber-500/30 hover:border-amber-400/50 hover:bg-amber-500/10"
            >
              <Sparkles className="size-3.5 sm:size-4 text-amber-400 animate-spin-slow" />
              <span className="hidden sm:inline font-medium">Omikuji</span>
              <span className="sm:hidden text-[10px]">🎲</span>
            </button>

            {/* Zen Soundscape Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
                className={`btn-zen-secondary text-xs py-1.5 px-2.5 sm:px-3 ${
                  activeSound
                    ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15'
                    : 'text-slate-300'
                }`}
                title="Zen Ambient Soundscapes"
              >
                {activeSound ? (
                  <Volume2 className="size-3.5 sm:size-4 text-emerald-400 animate-pulse" />
                ) : (
                  <VolumeX className="size-3.5 sm:size-4 text-slate-400" />
                )}
                <span className="hidden sm:inline font-medium">
                  {activeSound ? 'Zen Audio' : 'Soundscape'}
                </span>
              </button>

              {/* Soundscape selector popup */}
              {isSoundMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-scale-in">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-xs font-semibold text-slate-300">
                    <span>Zen Japanese Soundscapes</span>
                    {activeSound && (
                      <button
                        type="button"
                        onClick={() => toggleSound(activeSound)}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Mute
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {soundscapes.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSound(s.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          activeSound === s.id
                            ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{s.icon}</span>
                          <span>{s.name}</span>
                        </span>
                        {activeSound === s.id && (
                          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Season Selector & Tab bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-2.5 border-t border-white/5">
          {/* 4 Seasons bar */}
          <div className="flex items-center gap-1 sm:gap-1.5" role="radiogroup" aria-label="Select Season">
            {seasons.map((s) => {
              const active = activeSeason === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSeasonChange(s.id)}
                  className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-slate-800 text-white shadow-lg border border-white/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-sm sm:text-base">{s.emoji}</span>
                  <span className="hidden xs:inline font-semibold">{s.label}</span>
                  <span className="font-jp text-[11px] opacity-75 font-serif-jp">{s.kanji}</span>
                  {active && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--season-primary, #10b981)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => onTabChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-white/10 text-white shadow-sm border border-white/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="size-3.5 text-emerald-400" />
              <span>Map & Guide</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('toolkit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'toolkit'
                  ? 'bg-white/10 text-white shadow-sm border border-white/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="size-3.5 text-amber-400" />
              <span>Pocket Toolkit</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('stamps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                activeTab === 'stamps'
                  ? 'bg-white/10 text-white shadow-sm border border-white/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="size-3.5 text-rose-400" />
              <span>Goshuin Stamps</span>
              {stampsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                  {stampsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                activeTab === 'bookmarks'
                  ? 'bg-white/10 text-white shadow-sm border border-white/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Bookmark className="size-3.5 text-sky-400" />
              <span>Saved</span>
              {bookmarksCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-sky-500 text-white">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
