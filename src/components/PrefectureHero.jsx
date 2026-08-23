import { useState } from 'react'
import {
  Volume2,
  MapPin,
  Gift,
  Lightbulb,
  Bookmark,
  Calendar,
  Share2,
  Check,
} from 'lucide-react'
import { speakJapanese } from '../utils/speech.js'
import confetti from 'canvas-confetti'

export function PrefectureHero({
  prefecture,
  activeSeason,
  isBookmarked,
  onToggleBookmark,
  onOpenExport,
  isStamped,
  onToggleStamp,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  if (!prefecture) return null

  const seasonData = prefecture.seasonal?.[activeSeason] || {}
  const temp = seasonData.temp || 'Comfortable'

  const handleSpeak = () => {
    if (isSpeaking) return
    setIsSpeaking(true)
    const textToSpeak = `${prefecture.name}。${prefecture.japaneseName}。県庁所在地は${prefecture.capital}です。`
    speakJapanese(textToSpeak, () => setIsSpeaking(false))
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleStampClick = () => {
    onToggleStamp(prefecture.id)
    if (!isStamped) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.3 },
        colors: ['#ef4444', '#dc2626', '#b91c1c'],
      })
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-7 border border-white/12 shadow-2xl animate-slide-up">
      {/* Subtle decorative background watermarks */}
      <div
        className="absolute -right-6 -bottom-10 font-serif-jp text-8xl sm:text-9xl font-black text-white/[0.03] select-none pointer-events-none"
        aria-hidden="true"
      >
        {prefecture.japaneseName}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
        {/* Left main info */}
        <div className="space-y-3 flex-1 min-w-0">
          {/* Region & Capital pill badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {prefecture.region} Region
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs text-slate-300 bg-white/5 border border-white/10 flex items-center gap-1">
              <MapPin className="size-3 text-rose-400" />
              Capital: <strong className="text-white">{prefecture.capital}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs text-slate-300 bg-white/5 border border-white/10 flex items-center gap-1">
              🌡️ {temp}
            </span>
          </div>

          {/* Titles: English, Kanji, Audio */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {prefecture.name}
            </h1>
            <span className="font-serif-jp text-2xl sm:text-3xl font-bold text-rose-400/90 tracking-wide px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              {prefecture.japaneseName}
            </span>

            {/* Listen Audio Button */}
            <button
              type="button"
              onClick={handleSpeak}
              disabled={isSpeaking}
              title="Listen to authentic Japanese pronunciation"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15 transition-all hover:scale-105 active:scale-95"
            >
              {isSpeaking ? (
                <>
                  <Volume2 className="size-3.5 text-rose-400 animate-ping" />
                  <span className="text-rose-300">Speaking…</span>
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5 text-emerald-400" />
                  <span>Pronounce 🔊</span>
                </>
              )}
            </button>
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl">
            {prefecture.tagline}
          </p>

          {/* Highlights tag pills */}
          {prefecture.highlights && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {prefecture.highlights.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-300 border border-white/10"
                >
                  ✨ {h}
                </span>
              ))}
            </div>
          )}

          {/* Omiyage & Insider tip callouts */}
          <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
            {prefecture.omiyage && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-white/8 text-xs">
                <Gift className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Signature Omiyage (Souvenir):</span>
                  <p className="text-slate-300 mt-0.5">{prefecture.omiyage}</p>
                </div>
              </div>
            )}

            {prefecture.insiderTip && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-white/8 text-xs">
                <Lightbulb className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-300">Omotenashi Insider Secret:</span>
                  <p className="text-slate-300 mt-0.5">{prefecture.insiderTip}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Stamp & Action buttons */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          {/* Hanko Stamp interactive button */}
          <button
            type="button"
            onClick={handleStampClick}
            className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
              isStamped
                ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-500/10 scale-105'
                : 'bg-slate-900/60 border-white/10 hover:border-rose-400/40 hover:bg-slate-800'
            }`}
            title={isStamped ? 'Click to remove Goshuin stamp' : 'Click to collect Goshuin stamp'}
          >
            <div
              className={`hanko-stamp size-14 text-sm font-bold transition-transform group-hover:scale-105 ${
                isStamped ? 'animate-stamp' : 'unclaimed'
              }`}
            >
              <span>{prefecture.japaneseName?.slice(0, 2)}</span>
              <span className="text-[9px] tracking-tight">{isStamped ? '御朱印' : '未訪'}</span>
            </div>
            <span className="text-[11px] font-medium mt-1.5 text-slate-300 group-hover:text-white">
              {isStamped ? '✓ Stamped in Book' : '+ Collect Stamp'}
            </span>
          </button>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`btn-zen-secondary text-xs py-1.5 px-3 ${
                isBookmarked ? 'bg-sky-500/20 text-sky-200 border-sky-500/40' : ''
              }`}
            >
              <Bookmark
                className={`size-3.5 ${isBookmarked ? 'fill-sky-400 text-sky-400' : 'text-slate-400'}`}
              />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="btn-zen-secondary text-xs py-1.5 px-3 text-emerald-300 border-emerald-500/30 hover:border-emerald-400"
              title="Export Itinerary (Calendar, PDF, Markdown)"
            >
              <Calendar className="size-3.5 text-emerald-400" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-zen-secondary text-xs py-1.5 px-2.5"
              title="Share prefecture link"
            >
              {copiedLink ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
