import { Bookmark, Trash2, ExternalLink } from 'lucide-react'

const seasonMeta = {
  spring: { label: 'Spring', emoji: '🌸', color: 'text-rose-400' },
  summer: { label: 'Summer', emoji: '☀️', color: 'text-amber-400' },
  autumn: { label: 'Autumn', emoji: '🍁', color: 'text-orange-400' },
  winter: { label: 'Winter', emoji: '❄️', color: 'text-sky-400' },
}

export function BookmarksPanel({
  bookmarks = [],
  onRemoveBookmark,
  onClearAll,
  onSelectPrefecture,
  onSeasonChange,
}) {
  const handleLoadBookmark = (item) => {
    if (item.prefectureId) {
      onSelectPrefecture(item.prefectureId)
    }
    if (item.season) {
      onSeasonChange(item.season)
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="rounded-2xl glass-panel p-5 sm:p-7 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Bookmark className="size-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Saved Itineraries ({bookmarks.length})
            </h2>
          </div>

          {bookmarks.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="size-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="text-5xl opacity-40 animate-float">🔖</div>
            <h3 className="mt-4 text-base font-semibold text-white">
              No saved itineraries yet
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              Explore Japan’s 47 prefectures and tap "Save / Bookmark" on any prefecture to collect your personal travel collection.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {bookmarks.map((b) => {
              const meta = seasonMeta[b.season] || { label: b.season, emoji: '🌸', color: 'text-rose-400' }

              return (
                <div
                  key={`${b.prefectureId}-${b.season}`}
                  className="p-4 rounded-xl glass-card border border-white/10 flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-emerald-300 tracking-wider">
                        {b.region} Region
                      </span>
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {b.prefectureName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      3-Day Curated Seasonal Plan
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleLoadBookmark(b)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                    >
                      <span>Open Plan</span>
                      <ExternalLink className="size-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(b.prefectureId, b.season)}
                      className="text-xs text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
