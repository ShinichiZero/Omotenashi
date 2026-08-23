import { useMemo } from 'react'
import { Award } from 'lucide-react'
import confetti from 'canvas-confetti'

export function StampBook({
  prefectures = [],
  stampedIds = [],
  onToggleStamp,
  onSelectPrefecture,
}) {
  const count = stampedIds.length
  const total = prefectures.length || 47
  const percentage = Math.round((count / total) * 100)

  // Determine Explorer Title
  const titleInfo = useMemo(() => {
    if (count === 47) {
      return { title: 'Imperial Legend (天下統一)', desc: 'You have collected all 47 prefectures! Complete Japan master.', color: 'text-amber-300' }
    }
    if (count >= 30) {
      return { title: 'Grand Master Explorer (大師)', desc: 'Outstanding knowledge of Japan’s regional treasures.', color: 'text-rose-400' }
    }
    if (count >= 15) {
      return { title: 'Regional Connoisseur (達人)', desc: 'Venturing deep beyond the golden route into local wonders.', color: 'text-sky-400' }
    }
    if (count >= 5) {
      return { title: 'Curious Wanderer (探索者)', desc: 'A great start on your Japan discovery journey.', color: 'text-emerald-400' }
    }
    return { title: 'Travel Initiate (旅人)', desc: 'Click any prefecture below or on the map to collect traditional red seal stamps.', color: 'text-slate-300' }
  }, [count])

  const handleStamp = (id) => {
    const isNowStamped = !stampedIds.includes(id)
    onToggleStamp(id)

    if (isNowStamped) {
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.4 },
        colors: ['#ef4444', '#dc2626', '#b91c1c'],
      })
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header & Progress Card */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Award className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Goshuincho · Japan Stamp Rally</span>
                  <span className="font-serif-jp text-rose-400 font-bold text-sm">
                    御朱印帳
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Collect authentic Japanese red seal (Hanko) stamps for all 47 prefectures
                </p>
              </div>
            </div>
          </div>

          {/* Title Badge */}
          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Explorer Rank
            </span>
            <span className={`text-base font-extrabold ${titleInfo.color}`}>
              {titleInfo.title}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">
              Prefectures Collected: <strong className="text-white">{count}</strong> / {total}
            </span>
            <span className="text-rose-400 font-mono">{percentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stamp Rally Grid (All 47 Prefectures) */}
      <div className="rounded-2xl glass-panel p-5 sm:p-7 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white">
            All 47 Prefecture Seals (Tap to Stamp / Tap text to View)
          </h3>
          <span className="text-xs text-slate-400">
            {count} claimed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {prefectures.map((pref) => {
            const isStamped = stampedIds.includes(pref.id)

            return (
              <div
                key={pref.id}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-between gap-2 transition-all text-center group ${
                  isStamped
                    ? 'bg-rose-500/10 border-rose-500/40 shadow-md shadow-rose-500/5'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Hanko Stamp */}
                <button
                  type="button"
                  onClick={() => handleStamp(pref.id)}
                  className="focus:outline-none"
                  title={isStamped ? `Unstamp ${pref.name}` : `Stamp ${pref.name}`}
                >
                  <div
                    className={`hanko-stamp size-14 text-sm font-bold transition-all group-hover:scale-105 cursor-pointer ${
                      isStamped ? 'animate-stamp' : 'unclaimed'
                    }`}
                  >
                    <span>{pref.japaneseName?.slice(0, 2)}</span>
                    <span className="text-[8px] tracking-tighter">
                      {isStamped ? '御朱印' : '未訪'}
                    </span>
                  </div>
                </button>

                {/* Name & Quick jump button */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => onSelectPrefecture(pref.id)}
                    className="text-xs font-bold text-slate-200 hover:text-emerald-300 block truncate max-w-[120px]"
                    title={`View ${pref.name} itinerary`}
                  >
                    {pref.name}
                  </button>
                  <span className="text-[10px] text-slate-400 block font-serif-jp">
                    {pref.japaneseName}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
