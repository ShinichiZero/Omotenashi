import { useState, useMemo } from 'react'
import {
  Calendar,
  ExternalLink,
  Volume2,
  CheckCircle2,
  Circle,
  Plus,
  Bookmark,
  FileDown,
} from 'lucide-react'
import { speakJapanese } from '../utils/speech.js'
import confetti from 'canvas-confetti'

const dayMetaTemplates = [
  { key: 'foods', theme: 'Taste Local Flavors & Culinary Secrets', icon: '🍜', label: 'Gourmet', color: 'from-amber-400 to-orange-500' },
  { key: 'historicalSites', theme: 'Discover Sacred Shrines & Ancient Heritage', icon: '⛩️', label: 'Heritage', color: 'from-sky-400 to-indigo-500' },
  { key: 'festivals', theme: 'Celebrate Vibrant Matsuri Culture & Viewpoints', icon: '🎭', label: 'Festivals & Culture', color: 'from-rose-400 to-pink-500' },
  { key: 'scenic', theme: 'Explore Hidden Nature Trails & Panoramas', icon: '🌸', label: 'Nature & Views', color: 'from-emerald-400 to-teal-500' },
  { key: 'crafts', theme: 'Artisan Workshops, Onsen & Evening Stroll', icon: '♨️', label: 'Onsen & Crafts', color: 'from-violet-400 to-purple-500' },
]

export function ItineraryPanel({
  prefecture,
  activeSeason,
  isBookmarked,
  onToggleBookmark,
  onOpenExport,
}) {
  const [tripDuration, setTripDuration] = useState(3) // 3 or 5 days
  const [completedItems, setCompletedItems] = useState({})
  const [customActivities, setCustomActivities] = useState({})
  const [newActivityText, setNewActivityText] = useState('')
  const [activeDayForCustom, setActiveDayForCustom] = useState(null)
  const [speakingItem, setSpeakingItem] = useState(null)

  // Generate day-by-day timeline
  const timeline = useMemo(() => {
    if (!prefecture) return []
    const seasonData = prefecture.seasonal?.[activeSeason] || {}

    const days = []
    const limit = tripDuration === 5 ? 5 : 3

    for (let i = 0; i < limit; i++) {
      const template = dayMetaTemplates[i]
      let items = []

      if (template.key === 'foods') {
        items = seasonData.foods || []
      } else if (template.key === 'historicalSites') {
        items = seasonData.historicalSites || []
      } else if (template.key === 'festivals') {
        items = seasonData.festivals || []
      } else if (template.key === 'scenic') {
        // Fallback rich recommendations
        items = [
          `${prefecture.name} Panoramic Mountain & Coastal Lookout Point`,
          `Traditional Tea House Matcha & Seasonal Wagashi Tasting`,
          `Sunset walk along ${prefecture.name} Historic Riverfront`,
        ]
      } else {
        items = [
          `Local Artisan Craft Workshop & Souvenir Shopping (${prefecture.omiyage?.split(',')[0] || 'Traditional Crafts'})`,
          `Relaxing Open-Air Onsen Hot Spring Soak`,
          `Izakaya Evening with Local Sake & Signature Small Plates`,
        ]
      }

      // Add user custom activities
      const customForThisDay = customActivities[i + 1] || []

      days.push({
        dayNumber: i + 1,
        dayLabel: `Day ${i + 1}`,
        theme: template.theme,
        icon: template.icon,
        label: template.label,
        color: template.color,
        items: [...items, ...customForThisDay],
      })
    }

    return days
  }, [prefecture, activeSeason, tripDuration, customActivities])

  // Total items and completed progress
  const totalItemsCount = useMemo(() => {
    return timeline.reduce((acc, d) => acc + d.items.length, 0)
  }, [timeline])

  const completedCount = useMemo(() => {
    return Object.values(completedItems).filter(Boolean).length
  }, [completedItems])

  const progressPercent = totalItemsCount ? Math.round((completedCount / totalItemsCount) * 100) : 0

  const toggleComplete = (itemKey) => {
    const nextState = !completedItems[itemKey]
    setCompletedItems((prev) => ({
      ...prev,
      [itemKey]: nextState,
    }))

    // If 100% completed, trigger confetti!
    if (nextState && completedCount + 1 === totalItemsCount) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#f43f5e'],
      })
    }
  }

  const handleSpeakItem = (itemText) => {
    if (speakingItem) return
    setSpeakingItem(itemText)
    // Extract place or food name
    const cleanText = itemText.split('(')[0].trim()
    speakJapanese(cleanText, () => setSpeakingItem(null))
  }

  const handleAddCustomActivity = (dayNum) => {
    if (!newActivityText.trim()) return
    setCustomActivities((prev) => ({
      ...prev,
      [dayNum]: [...(prev[dayNum] || []), newActivityText.trim()],
    }))
    setNewActivityText('')
    setActiveDayForCustom(null)
  }

  if (!prefecture) return null

  return (
    <div className="rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 shadow-2xl space-y-6 animate-slide-up">
      {/* Top Header & Duration selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Calendar className="size-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{prefecture.name} Seasonal Journey</span>
              <span className="text-xs text-slate-400 font-normal">
                ({activeSeason.toUpperCase()})
              </span>
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Morning, afternoon & evening curated itinerary with audio pronunciation
          </p>
        </div>

        {/* 3-Day / 5-Day duration toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTripDuration(3)}
              className={`px-3 py-1 rounded-md transition-all ${
                tripDuration === 3
                  ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3-Day Classic
            </button>
            <button
              type="button"
              onClick={() => setTripDuration(5)}
              className={`px-3 py-1 rounded-md transition-all ${
                tripDuration === 5
                  ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5-Day In-Depth
            </button>
          </div>
        </div>
      </div>

      {/* Progress Checklist Bar */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/8">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            <span>Itinerary Completion Progress</span>
          </span>
          <span className="font-bold text-white">
            {completedCount} / {totalItemsCount} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline Days */}
      <div className="space-y-6 relative">
        {/* Continuous connector line */}
        <div className="absolute left-4 sm:left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-500/40 via-emerald-500/40 to-sky-500/40" />

        {timeline.map((dayPlan) => {
          const timeSlotLabels = ['🌅 Morning (朝)', '☀️ Afternoon (昼)', '🌙 Evening (夜)', '✨ Night (宵)']

          return (
            <div key={dayPlan.dayNumber} className="relative pl-10 sm:pl-12 space-y-3">
              {/* Day Badge & Theme Marker */}
              <div className="flex items-center gap-3">
                {/* Round icon node */}
                <div
                  className="absolute left-1.5 sm:left-2.5 top-0 size-7 sm:size-8 rounded-full flex items-center justify-center text-sm sm:text-base border-2 border-slate-950 shadow-md bg-slate-800"
                  style={{ borderColor: 'var(--season-primary, #10b981)' }}
                >
                  {dayPlan.icon}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold text-slate-950 bg-gradient-to-r ${dayPlan.color}`}>
                    {dayPlan.dayLabel}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {dayPlan.theme}
                  </h3>
                </div>
              </div>

              {/* Day Activities List */}
              <div className="space-y-2.5">
                {dayPlan.items.map((item, idx) => {
                  const itemKey = `${prefecture.id}-${activeSeason}-d${dayPlan.dayNumber}-i${idx}`
                  const isDone = !!completedItems[itemKey]
                  const isSpeaking = speakingItem === item
                  const slotLabel = timeSlotLabels[idx % timeSlotLabels.length]

                  const mapsQuery = encodeURIComponent(`${item} ${prefecture.name} Japan`)
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

                  return (
                    <div
                      key={itemKey}
                      className={`group p-3 sm:p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-900/40 border-white/5 opacity-70'
                          : 'glass-card border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox and Activity Content */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleComplete(itemKey)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                            title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="size-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="size-5 text-slate-500 group-hover:text-slate-300" />
                            )}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <span className="text-[10px] font-semibold text-emerald-400/90 uppercase tracking-wider block">
                              {slotLabel}
                            </span>
                            <p
                              className={`text-xs sm:text-sm leading-snug font-medium transition-all ${
                                isDone
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-100'
                              }`}
                            >
                              {item}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons (Audio & Maps) */}
                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          {/* Audio pronunciation button */}
                          <button
                            type="button"
                            onClick={() => handleSpeakItem(item)}
                            disabled={isSpeaking}
                            title="Listen to Japanese pronunciation"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Volume2
                              className={`size-3.5 ${isSpeaking ? 'text-rose-400 animate-ping' : ''}`}
                            />
                          </button>

                          {/* Google Maps link */}
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open location in Google Maps"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Add Custom Activity form */}
                {activeDayForCustom === dayPlan.dayNumber ? (
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2 animate-scale-in">
                    <input
                      type="text"
                      placeholder="e.g. Visit local ceramics studio or ramen spot..."
                      value={newActivityText}
                      onChange={(e) => setNewActivityText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCustomActivity(dayPlan.dayNumber)
                      }}
                      className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveDayForCustom(null)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddCustomActivity(dayPlan.dayNumber)}
                        className="btn-zen-primary text-xs py-1 px-3"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDayForCustom(dayPlan.dayNumber)
                      setNewActivityText('')
                    }}
                    className="w-full py-2 border border-dashed border-white/15 hover:border-emerald-400/50 rounded-xl text-xs text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-1.5 transition-colors bg-slate-900/30"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Custom Note or Activity to {dayPlan.dayLabel}</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Export & Sharing Toolbar */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`btn-zen-secondary text-xs ${
              isBookmarked ? 'bg-sky-500/20 text-sky-200 border-sky-500/40' : ''
            }`}
          >
            <Bookmark className={`size-3.5 ${isBookmarked ? 'fill-sky-400' : ''}`} />
            <span>{isBookmarked ? 'Saved in Bookmarks' : 'Bookmark Itinerary'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenExport}
            className="btn-zen-primary text-xs"
          >
            <FileDown className="size-3.5" />
            <span>Download & Export Suite</span>
          </button>
        </div>
      </div>
    </div>
  )
}
