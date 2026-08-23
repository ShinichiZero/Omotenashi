import { useState } from 'react'
import {
  X,
  Calendar,
  FileText,
  Printer,
  Share2,
  Check,
  Download,
  Copy,
} from 'lucide-react'
import { generateICS, downloadICS } from '../utils/calendarExport.js'
import { generateMarkdownItinerary, copyToClipboard } from '../utils/markdownExport.js'

export function ExportModal({
  isOpen,
  onClose,
  prefecture,
  activeSeason,
  itineraryDays = [],
}) {
  const [copiedMd, setCopiedMd] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  if (!isOpen || !prefecture) return null

  const handleDownloadCalendar = () => {
    const ics = generateICS(prefecture, activeSeason, itineraryDays)
    downloadICS(`${prefecture.name}_${activeSeason}_Itinerary.ics`, ics)
  }

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownItinerary(prefecture, activeSeason, itineraryDays)
    await copyToClipboard(md)
    setCopiedMd(true)
    setTimeout(() => setCopiedMd(false), 2200)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyShareLink = async () => {
    const url = window.location.href
    await copyToClipboard(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 border border-white/15 shadow-2xl space-y-5 animate-scale-in bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Export & Share {prefecture.name} Journey</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Take your curated seasonal plan anywhere
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="space-y-3">
          {/* Option 1: Calendar Export */}
          <div className="p-3.5 rounded-xl glass-card border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Calendar className="size-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Add to Apple / Google Calendar (.ics)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Adds Day 1-3 scheduled morning, afternoon, and evening events
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="btn-zen-primary text-xs shrink-0 py-1.5 px-3"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </button>
          </div>

          {/* Option 2: Copy Markdown for Notion / Obsidian */}
          <div className="p-3.5 rounded-xl glass-card border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <FileText className="size-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Copy Markdown / Notion Checklist
                </h4>
                <p className="text-[11px] text-slate-400">
                  Formatted checklist for Obsidian, Notion, or Apple Notes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="btn-zen-secondary text-xs shrink-0 py-1.5 px-3"
            >
              {copiedMd ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Option 3: Print / PDF */}
          <div className="p-3.5 rounded-xl glass-card border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Printer className="size-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Print-Friendly Guide / Save PDF
                </h4>
                <p className="text-[11px] text-slate-400">
                  Clean printer formatted travel sheet
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-zen-secondary text-xs shrink-0 py-1.5 px-3"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </button>
          </div>

          {/* Option 4: Shareable Link */}
          <div className="p-3.5 rounded-xl glass-card border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Share2 className="size-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Copy Direct Itinerary Link
                </h4>
                <p className="text-[11px] text-slate-400">
                  Share this exact prefecture & season with friends
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="btn-zen-secondary text-xs shrink-0 py-1.5 px-3"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
