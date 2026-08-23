import { useState, useRef, useMemo } from 'react'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Info,
} from 'lucide-react'

// Accurate SVG map coordinate positioning for all 47 prefectures
const prefectureMapLayout = {
  // Hokkaido
  hokkaido: { x: 620, y: 40, w: 90, h: 70, region: 'Hokkaido', label: 'Hokkaido' },

  // Tohoku
  aomori: { x: 575, y: 130, w: 60, h: 36, region: 'Tohoku', label: 'Aomori' },
  akita: { x: 545, y: 175, w: 50, h: 36, region: 'Tohoku', label: 'Akita' },
  iwate: { x: 605, y: 175, w: 55, h: 36, region: 'Tohoku', label: 'Iwate' },
  yamagata: { x: 540, y: 220, w: 55, h: 36, region: 'Tohoku', label: 'Yamagata' },
  miyagi: { x: 605, y: 220, w: 55, h: 36, region: 'Tohoku', label: 'Miyagi' },
  fukushima: { x: 575, y: 265, w: 65, h: 36, region: 'Tohoku', label: 'Fukushima' },

  // Kanto
  gunma: { x: 505, y: 310, w: 50, h: 34, region: 'Kanto', label: 'Gunma' },
  tochigi: { x: 560, y: 310, w: 50, h: 34, region: 'Kanto', label: 'Tochigi' },
  ibaraki: { x: 615, y: 310, w: 50, h: 34, region: 'Kanto', label: 'Ibaraki' },
  saitama: { x: 535, y: 350, w: 50, h: 34, region: 'Kanto', label: 'Saitama' },
  tokyo: { x: 535, y: 390, w: 55, h: 34, region: 'Kanto', label: 'Tokyo' },
  chiba: { x: 600, y: 375, w: 50, h: 45, region: 'Kanto', label: 'Chiba' },
  kanagawa: { x: 535, y: 430, w: 55, h: 34, region: 'Kanto', label: 'Kanagawa' },

  // Chubu
  niigata: { x: 495, y: 240, w: 55, h: 45, region: 'Chubu', label: 'Niigata' },
  toyama: { x: 440, y: 260, w: 50, h: 34, region: 'Chubu', label: 'Toyama' },
  ishikawa: { x: 390, y: 235, w: 50, h: 45, region: 'Chubu', label: 'Ishikawa' },
  fukui: { x: 385, y: 290, w: 50, h: 34, region: 'Chubu', label: 'Fukui' },
  nagano: { x: 470, y: 310, w: 55, h: 50, region: 'Chubu', label: 'Nagano' },
  yamanashi: { x: 475, y: 380, w: 55, h: 34, region: 'Chubu', label: 'Yamanashi' },
  gifu: { x: 415, y: 335, w: 50, h: 45, region: 'Chubu', label: 'Gifu' },
  shizuoka: { x: 475, y: 425, w: 55, h: 35, region: 'Chubu', label: 'Shizuoka' },
  aichi: { x: 415, y: 390, w: 50, h: 35, region: 'Chubu', label: 'Aichi' },

  // Kansai
  shiga: { x: 360, y: 345, w: 45, h: 34, region: 'Kansai', label: 'Shiga' },
  mie: { x: 390, y: 430, w: 45, h: 45, region: 'Kansai', label: 'Mie' },
  kyoto: { x: 325, y: 315, w: 45, h: 45, region: 'Kansai', label: 'Kyoto' },
  osaka: { x: 310, y: 370, w: 45, h: 34, region: 'Kansai', label: 'Osaka' },
  nara: { x: 355, y: 390, w: 40, h: 40, region: 'Kansai', label: 'Nara' },
  hyogo: { x: 265, y: 330, w: 50, h: 45, region: 'Kansai', label: 'Hyogo' },
  wakayama: { x: 320, y: 435, w: 55, h: 45, region: 'Kansai', label: 'Wakayama' },

  // Chugoku
  tottori: { x: 235, y: 290, w: 50, h: 34, region: 'Chugoku', label: 'Tottori' },
  okayama: { x: 215, y: 335, w: 45, h: 34, region: 'Chugoku', label: 'Okayama' },
  shimane: { x: 165, y: 295, w: 60, h: 34, region: 'Chugoku', label: 'Shimane' },
  hiroshima: { x: 165, y: 340, w: 50, h: 35, region: 'Chugoku', label: 'Hiroshima' },
  yamaguchi: { x: 110, y: 345, w: 50, h: 40, region: 'Chugoku', label: 'Yamaguchi' },

  // Shikoku
  kagawa: { x: 215, y: 385, w: 45, h: 30, region: 'Shikoku', label: 'Kagawa' },
  tokushima: { x: 245, y: 420, w: 45, h: 34, region: 'Shikoku', label: 'Tokushima' },
  ehime: { x: 160, y: 395, w: 50, h: 35, region: 'Shikoku', label: 'Ehime' },
  kochi: { x: 185, y: 440, w: 55, h: 35, region: 'Shikoku', label: 'Kochi' },

  // Kyushu & Okinawa
  fukuoka: { x: 80, y: 410, w: 45, h: 34, region: 'Kyushu', label: 'Fukuoka' },
  saga: { x: 45, y: 430, w: 40, h: 30, region: 'Kyushu', label: 'Saga' },
  nagasaki: { x: 15, y: 455, w: 40, h: 35, region: 'Kyushu', label: 'Nagasaki' },
  oita: { x: 125, y: 435, w: 45, h: 35, region: 'Kyushu', label: 'Oita' },
  kumamoto: { x: 75, y: 470, w: 45, h: 40, region: 'Kyushu', label: 'Kumamoto' },
  miyazaki: { x: 115, y: 500, w: 45, h: 45, region: 'Kyushu', label: 'Miyazaki' },
  kagoshima: { x: 60, y: 535, w: 50, h: 45, region: 'Kyushu', label: 'Kagoshima' },
  okinawa: { x: 80, y: 615, w: 55, h: 35, region: 'Okinawa', label: 'Okinawa' },
}

const regions = [
  { id: 'all', label: 'All Japan' },
  { id: 'Hokkaido', label: 'Hokkaido' },
  { id: 'Tohoku', label: 'Tohoku' },
  { id: 'Kanto', label: 'Kanto' },
  { id: 'Chubu', label: 'Chubu' },
  { id: 'Kansai', label: 'Kansai' },
  { id: 'Chugoku', label: 'Chugoku' },
  { id: 'Shikoku', label: 'Shikoku' },
  { id: 'Kyushu', label: 'Kyushu' },
  { id: 'Okinawa', label: 'Okinawa' },
]

export function JapanMap({
  prefectures = [],
  selectedPrefectureId,
  onSelectPrefecture,
  stampedIds = [],
}) {
  const [viewMode, setViewMode] = useState('geo') // 'geo' or 'grid'
  const [activeRegion, setActiveRegion] = useState('all')
  const [hoveredPref, setHoveredPref] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Map lookup map
  const prefLookup = useMemo(() => {
    const map = {}
    prefectures.forEach((p) => {
      map[p.id] = p
    })
    return map
  }, [prefectures])

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.2))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))
  const handleResetZoom = () => {
    setZoomLevel(1)
    setPan({ x: 0, y: 0 })
    setActiveRegion('all')
  }

  const handleMouseDown = (e) => {
    isDragging.current = true
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  return (
    <div className="rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 relative overflow-hidden shadow-2xl animate-slide-up">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="size-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Japan Map</span>
              <span className="text-xs text-slate-400 font-normal">
                (47 Prefectures)
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Click any prefecture to explore its seasonal delicacies & itineraries
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Zoom controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('geo')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'geo'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗾 Map View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ▦ Grid Matrix
            </button>
          </div>

          {viewMode === 'geo' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-white/10 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom in"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5"
              >
                <ZoomIn className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom out"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5"
              >
                <ZoomOut className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset map view"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Region quick filter bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none no-scrollbar">
        {regions.map((reg) => {
          const active = activeRegion === reg.id
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => setActiveRegion(reg.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                active
                  ? 'bg-white/15 text-white border border-white/30 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {reg.label}
            </button>
          )
        })}
      </div>

      {/* MAP VIEW CONTAINER */}
      {viewMode === 'geo' ? (
        <div
          className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] bg-slate-950/80 rounded-xl border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle Japanese traditional Seigaiha wave pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, #ffffff 1px, transparent 0)`,
              backgroundSize: '30px 30px',
            }}
          />

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 740 680"
            className="w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Sea of Japan & Pacific Ocean Label */}
            <text
              x="260"
              y="160"
              className="fill-slate-600/40 text-[16px] font-display uppercase tracking-[0.4em] pointer-events-none select-none font-bold"
            >
              Sea of Japan (日本海)
            </text>
            <text
              x="520"
              y="580"
              className="fill-slate-600/40 text-[16px] font-display uppercase tracking-[0.4em] pointer-events-none select-none font-bold"
            >
              Pacific Ocean (太平洋)
            </text>

            {/* Render each prefecture rectangle/node */}
            {Object.entries(prefectureMapLayout).map(([id, pos]) => {
              const pref = prefLookup[id]
              if (!pref) return null

              const isSelected = selectedPrefectureId === id
              const isHovered = hoveredPref?.id === id
              const isStamped = stampedIds.includes(id)
              const matchesRegion = activeRegion === 'all' || pref.region === activeRegion

              const opacity = matchesRegion ? 1 : 0.25

              return (
                <g
                  key={id}
                  className="map-node group"
                  opacity={opacity}
                  onClick={() => onSelectPrefecture(id)}
                  onMouseEnter={() => setHoveredPref(pref)}
                  onMouseLeave={() => setHoveredPref(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${pref.name} prefecture`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectPrefecture(id)
                    }
                  }}
                >
                  {/* Node Background */}
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={pos.w}
                    height={pos.h}
                    rx="8"
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'stroke-white stroke-2'
                        : isHovered
                          ? 'stroke-emerald-400/80 stroke-1.5'
                          : 'stroke-white/15 stroke-1'
                    }`}
                    style={{
                      fill: isSelected
                        ? 'var(--season-primary, #10b981)'
                        : isHovered
                          ? '#1e293b'
                          : isStamped
                            ? '#1e1b4b'
                            : '#0f172a',
                      filter: isSelected
                        ? 'drop-shadow(0 0 12px var(--season-glow, rgba(16, 185, 129, 0.6)))'
                        : isHovered
                          ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                          : 'none',
                    }}
                  />

                  {/* Prefecture English Name */}
                  <text
                    x={pos.x + pos.w / 2}
                    y={pos.y + pos.h / 2 - 2}
                    textAnchor="middle"
                    className={`text-[10.5px] font-semibold pointer-events-none select-none transition-colors ${
                      isSelected
                        ? 'fill-slate-950 font-bold'
                        : isHovered
                          ? 'fill-white'
                          : 'fill-slate-200'
                    }`}
                  >
                    {pos.label}
                  </text>

                  {/* Prefecture Kanji Name */}
                  <text
                    x={pos.x + pos.w / 2}
                    y={pos.y + pos.h / 2 + 10}
                    textAnchor="middle"
                    className={`font-serif-jp text-[9px] pointer-events-none select-none ${
                      isSelected ? 'fill-slate-900/80 font-bold' : 'fill-slate-400'
                    }`}
                  >
                    {pref.japaneseName}
                  </text>

                  {/* Stamp indicator badge */}
                  {isStamped && !isSelected && (
                    <circle
                      cx={pos.x + pos.w - 6}
                      cy={pos.y + 6}
                      r="3.5"
                      className="fill-rose-500 stroke-slate-950 stroke-1"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPref && (
            <div
              className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-3.5 rounded-xl glass-card border border-white/20 shadow-2xl animate-fade-in pointer-events-none z-30"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {hoveredPref.name}
                    </span>
                    <span className="font-serif-jp text-xs text-rose-400 font-bold">
                      {hoveredPref.japaneseName}
                    </span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      {hoveredPref.region}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    {hoveredPref.tagline}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span>🏛️ {hoveredPref.capital}</span>
                    <span>🎁 {hoveredPref.omiyage?.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Controls Hint */}
          <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded-md border border-white/5 pointer-events-none">
            <Info className="size-3 text-emerald-400" />
            <span>Drag to pan · Scroll to zoom · Click to select</span>
          </div>
        </div>
      ) : (
        /* GRID MATRIX VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[540px] overflow-y-auto pr-1">
          {prefectures
            .filter((p) => activeRegion === 'all' || p.region === activeRegion)
            .map((pref) => {
              const isSelected = selectedPrefectureId === pref.id
              const isStamped = stampedIds.includes(pref.id)

              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => onSelectPrefecture(pref.id)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 scale-102'
                      : 'bg-slate-900/70 border-white/10 hover:border-white/20 hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                        {pref.region}
                      </span>
                      {isStamped && (
                        <span className="text-[10px] text-rose-400 font-bold">✓ 印</span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1 truncate">
                      {pref.name}
                    </h3>
                    <p className="font-serif-jp text-xs text-rose-300 font-semibold">
                      {pref.japaneseName}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">
                    🏛️ {pref.capital}
                  </p>
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
