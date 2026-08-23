import { useState, useEffect, useMemo, useCallback } from 'react'
import { flattenedPrefectures } from './data/prefectureData.js'
import { Header } from './components/Header.jsx'
import { PrefectureHero } from './components/PrefectureHero.jsx'
import { JapanMap } from './components/JapanMap.jsx'
import { ItineraryPanel } from './components/ItineraryPanel.jsx'
import { TravelToolkit } from './components/TravelToolkit.jsx'
import { StampBook } from './components/StampBook.jsx'
import { BookmarksPanel } from './components/BookmarksPanel.jsx'
import { ExportModal } from './components/ExportModal.jsx'
import { ParticleCanvas } from './components/ParticleCanvas.jsx'

const bookmarkKey = 'omotenashi.concierge.bookmarks.v2'
const stampsKey = 'omotenashi.concierge.stamps.v2'

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export default function App() {
  const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason)
  const [selectedPrefectureId, setSelectedPrefectureId] = useState(() => {
    // Check URL hash for direct prefecture links (e.g. #kyoto)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase()
      if (hash && flattenedPrefectures.some((p) => p.id === hash)) {
        return hash
      }
    }
    return 'tokyo' // default to Tokyo
  })

  const [activeTab, setActiveTab] = useState('map') // 'map' | 'toolkit' | 'stamps' | 'bookmarks'
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [particlesEnabled] = useState(true)

  // LocalStorage Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(bookmarkKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // LocalStorage Goshuin Stamps
  const [stampedIds, setStampedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(stampsKey)
      return saved ? JSON.parse(saved) : ['tokyo', 'kyoto'] // starter stamps
    } catch {
      return ['tokyo', 'kyoto']
    }
  })

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks))
    } catch (e) {
      console.warn('LocalStorage error for bookmarks:', e)
    }
  }, [bookmarks])

  useEffect(() => {
    try {
      localStorage.setItem(stampsKey, JSON.stringify(stampedIds))
    } catch (e) {
      console.warn('LocalStorage error for stamps:', e)
    }
  }, [stampedIds])

  // Sync URL hash when prefecture changes
  useEffect(() => {
    if (selectedPrefectureId) {
      window.history.replaceState(null, '', `#${selectedPrefectureId}`)
    }
  }, [selectedPrefectureId])

  // Current selected prefecture object
  const selectedPrefecture = useMemo(() => {
    return (
      flattenedPrefectures.find((p) => p.id === selectedPrefectureId) ||
      flattenedPrefectures[0]
    )
  }, [selectedPrefectureId])

  // Check if current view is bookmarked
  const isCurrentBookmarked = useMemo(() => {
    return bookmarks.some(
      (b) => b.prefectureId === selectedPrefecture.id && b.season === selectedSeason,
    )
  }, [bookmarks, selectedPrefecture.id, selectedSeason])

  const isCurrentStamped = useMemo(() => {
    return stampedIds.includes(selectedPrefecture.id)
  }, [stampedIds, selectedPrefecture.id])

  // Handlers
  const handleToggleBookmark = useCallback(() => {
    if (isCurrentBookmarked) {
      setBookmarks((prev) =>
        prev.filter(
          (b) => !(b.prefectureId === selectedPrefecture.id && b.season === selectedSeason),
        ),
      )
    } else {
      const newBookmark = {
        prefectureId: selectedPrefecture.id,
        prefectureName: selectedPrefecture.name,
        region: selectedPrefecture.region,
        season: selectedSeason,
        savedAt: new Date().toISOString(),
      }
      setBookmarks((prev) => [newBookmark, ...prev])
    }
  }, [isCurrentBookmarked, selectedPrefecture, selectedSeason])

  const handleRemoveBookmark = useCallback((prefId, season) => {
    setBookmarks((prev) =>
      prev.filter((b) => !(b.prefectureId === prefId && b.season === season)),
    )
  }, [])

  const handleClearAllBookmarks = useCallback(() => {
    setBookmarks([])
  }, [])

  const handleToggleStamp = useCallback((prefId) => {
    setStampedIds((prev) => {
      if (prev.includes(prefId)) {
        return prev.filter((id) => id !== prefId)
      } else {
        return [...prev, prefId]
      }
    })
  }, [])

  const handleSelectPrefecture = useCallback((prefId) => {
    setSelectedPrefectureId(prefId)
    setActiveTab('map') // Automatically switch to map/guide view
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const seasonClass = `season-${selectedSeason}`

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 relative selection:bg-rose-500/30 selection:text-rose-100 ${seasonClass}`}>
      {/* Background seasonal particles */}
      <ParticleCanvas season={selectedSeason} enabled={particlesEnabled} />

      {/* Main Sticky Header */}
      <Header
        activeSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        prefectures={flattenedPrefectures}
        onSelectPrefecture={handleSelectPrefecture}
        bookmarksCount={bookmarks.length}
        stampsCount={stampedIds.length}
      />

      {/* Page Content Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'map' && (
          <>
            {/* Prefecture Hero Spotlight */}
            <PrefectureHero
              prefecture={selectedPrefecture}
              activeSeason={selectedSeason}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={handleToggleBookmark}
              onOpenExport={() => setIsExportOpen(true)}
              isStamped={isCurrentStamped}
              onToggleStamp={handleToggleStamp}
            />

            {/* 2-Column Layout: Interactive Map on Left, Itinerary Timeline on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Map */}
              <div className="lg:col-span-6 space-y-4">
                <JapanMap
                  prefectures={flattenedPrefectures}
                  selectedPrefectureId={selectedPrefectureId}
                  onSelectPrefecture={handleSelectPrefecture}
                  stampedIds={stampedIds}
                />
              </div>

              {/* Right Column: Detailed Itinerary Panel */}
              <div className="lg:col-span-6 space-y-4">
                <ItineraryPanel
                  prefecture={selectedPrefecture}
                  activeSeason={selectedSeason}
                  isBookmarked={isCurrentBookmarked}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenExport={() => setIsExportOpen(true)}
                />
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Travel Toolkit */}
        {activeTab === 'toolkit' && <TravelToolkit />}

        {/* Tab 3: Goshuincho Stamp Rally */}
        {activeTab === 'stamps' && (
          <StampBook
            prefectures={flattenedPrefectures}
            stampedIds={stampedIds}
            onToggleStamp={handleToggleStamp}
            onSelectPrefecture={handleSelectPrefecture}
          />
        )}

        {/* Tab 4: Bookmarks & Saved Itineraries */}
        {activeTab === 'bookmarks' && (
          <BookmarksPanel
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onClearAll={handleClearAllBookmarks}
            onSelectPrefecture={handleSelectPrefecture}
            onSeasonChange={setSelectedSeason}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Export & Sharing Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        prefecture={selectedPrefecture}
        activeSeason={selectedSeason}
        itineraryDays={[]}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 glass-panel py-8 px-4 text-center text-xs text-slate-400 space-y-2 relative z-10 no-print">
        <div className="flex items-center justify-center gap-2">
          <span className="font-serif-jp text-rose-400 font-bold text-sm">一期一会</span>
          <span className="text-slate-500">·</span>
          <span>Ichigo Ichie — Treasure Every Unrepeatable Encounter</span>
        </div>
        <p className="max-w-md mx-auto text-slate-400">
          Crafted with genuine Omotenashi (Japanese hospitality) spirit. Comprehensive authentic data for all 47 prefectures of Japan.
        </p>
        <p className="text-slate-400 pt-2 text-[11px]">
          © {new Date().getFullYear()} Omotenashi Concierge · Japan Tourism & Cultural Travel Companion
        </p>
      </footer>
    </div>
  )
}