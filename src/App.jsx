import { useEffect, useMemo, useState } from 'react'
import { flattenedPrefectures, regionalPrefectureData } from './data/prefectureData'

const seasons = ['spring', 'summer', 'autumn', 'winter']
const seasonLabel = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
}

const currentSeason = () => {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

const buildTimeline = (prefecture, season) => {
  const data = prefecture.seasonal[season]
  return [
    {
      day: 'Day 1',
      theme: 'Taste Local Flavors',
      items: data.foods,
      color: 'from-rose-400 to-orange-300',
    },
    {
      day: 'Day 2',
      theme: 'Discover Heritage',
      items: data.historicalSites,
      color: 'from-sky-400 to-cyan-300',
    },
    {
      day: 'Day 3',
      theme: 'Celebrate Culture',
      items: data.festivals,
      color: 'from-violet-500 to-fuchsia-400',
    },
  ]
}

const bookmarkKey = 'omotenashi.concierge.bookmarks.v1'

function App() {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason())
  const [selectedPrefectureId, setSelectedPrefectureId] = useState(flattenedPrefectures[0].id)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(bookmarkKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks))
  }, [bookmarks])

  const selectedPrefecture = useMemo(
    () => flattenedPrefectures.find((prefecture) => prefecture.id === selectedPrefectureId),
    [selectedPrefectureId],
  )

  const timeline = selectedPrefecture
    ? buildTimeline(selectedPrefecture, selectedSeason)
    : []

  const itinerary = {
    prefectureId: selectedPrefecture.id,
    prefectureName: selectedPrefecture.name,
    region: selectedPrefecture.region,
    season: selectedSeason,
    timeline,
  }

  const isBookmarked = bookmarks.some(
    (item) => item.prefectureId === itinerary.prefectureId && item.season === itinerary.season,
  )

  const saveBookmark = () => {
    if (isBookmarked) return
    setBookmarks((prev) => [itinerary, ...prev])
  }

  const removeBookmark = (prefectureId, season) => {
    setBookmarks((prev) =>
      prev.filter((item) => !(item.prefectureId === prefectureId && item.season === season)),
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-900/70 via-slate-900 to-emerald-900/60 p-5 shadow-2xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">Omotenashi Concierge</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Plan authentic 3-day journeys across all 47 prefectures</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">Tap any prefecture on the interactive Japan map to instantly generate a seasonal timeline of foods, heritage sites, and festivals.</p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Interactive prefecture map</h2>
              <div className="flex gap-2">
                {seasons.map((season) => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => setSelectedSeason(season)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selectedSeason === season
                        ? 'bg-emerald-400 text-slate-900'
                        : 'bg-slate-700/70 text-slate-200 hover:bg-slate-600'
                    }`}
                  >
                    {seasonLabel[season]}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-2 sm:p-4">
              <svg viewBox="0 0 820 560" className="h-auto w-full" role="img" aria-label="Japan prefecture map">
                {Object.entries(regionalPrefectureData).map(([region, prefectures]) => (
                  <g key={region}>
                    {prefectures.map((prefecture) => {
                      const active = selectedPrefectureId === prefecture.id
                      return (
                        <g key={prefecture.id}>
                          <rect
                            x={prefecture.map.x}
                            y={prefecture.map.y}
                            width={prefecture.map.w}
                            height={prefecture.map.h}
                            rx="10"
                            onClick={() => setSelectedPrefectureId(prefecture.id)}
                            className={`cursor-pointer transition ${
                              active ? 'fill-emerald-400 stroke-emerald-200' : 'fill-slate-700 stroke-slate-400 hover:fill-slate-600'
                            }`}
                            strokeWidth="1.2"
                          />
                          <text
                            x={prefecture.map.x + prefecture.map.w / 2}
                            y={prefecture.map.y + prefecture.map.h / 2 + 4}
                            textAnchor="middle"
                            className={`pointer-events-none text-[10px] sm:text-xs ${active ? 'fill-slate-900' : 'fill-slate-100'}`}
                          >
                            {prefecture.name}
                          </text>
                        </g>
                      )
                    })}
                    <text
                      x={prefectures[0].map.x}
                      y={prefectures[0].map.y - 8}
                      className="fill-slate-400 text-[10px] uppercase tracking-wider"
                    >
                      {region}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{selectedPrefecture.region}</p>
                <h2 className="mt-1 text-2xl font-bold">{selectedPrefecture.name}</h2>
                <p className="text-sm text-slate-300">{seasonLabel[selectedSeason]} itinerary</p>
              </div>
              <button
                type="button"
                onClick={saveBookmark}
                disabled={isBookmarked}
                className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200"
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>

            <ol className="mt-5 space-y-4">
              {timeline.map((dayPlan) => (
                <li key={dayPlan.day} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-slate-900 ${dayPlan.color}`}>
                    {dayPlan.day}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{dayPlan.theme}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {dayPlan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-emerald-300"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Saved itineraries ({bookmarks.length})</h2>
          {bookmarks.length === 0 ? (
            <p className="mt-2 text-sm text-slate-300">No bookmarks yet. Save your favorite prefecture plans to keep them in this browser.</p>
          ) : (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {bookmarks.map((bookmark) => (
                <li key={`${bookmark.prefectureId}-${bookmark.season}`} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-emerald-300">{bookmark.region}</p>
                      <p className="font-semibold">{bookmark.prefectureName}</p>
                      <p className="text-xs text-slate-300">{seasonLabel[bookmark.season]} · 3 days</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBookmark(bookmark.prefectureId, bookmark.season)}
                      className="text-xs text-rose-300 hover:text-rose-200"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
