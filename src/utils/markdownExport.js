/**
 * Exports itinerary into Markdown / Notion / Apple Notes compatible format
 */

export function generateMarkdownItinerary(prefecture, season, itineraryDays) {
  const seasonEmoji = {
    spring: '🌸 Spring',
    summer: '☀️ Summer',
    autumn: '🍁 Autumn',
    winter: '❄️ Winter',
  }[season] || season

  let md = `# 🗾 ${prefecture.name} (${prefecture.japaneseName || ''} / ${prefecture.romaji || ''}) — ${seasonEmoji} Travel Itinerary\n\n`
  md += `> **Region**: ${prefecture.region} | **Capital**: ${prefecture.capital} | **Best Season**: ${prefecture.bestSeason || 'Year-round'}\n\n`
  md += `**Tagline**: *${prefecture.tagline || ''}*\n\n`
  md += `💡 **Omotenashi Insider Tip**: ${prefecture.insiderTip || 'Ask locals for neighborhood izakaya recommendations.'}\n\n`
  md += `🎁 **Signature Omiyage (Souvenir)**: ${prefecture.omiyage || 'Local traditional crafts & sweets'}\n\n`
  md += `---\n\n`

  itineraryDays.forEach((day) => {
    md += `## 📅 ${day.day}: ${day.theme} (${day.label})\n\n`
    day.items.forEach((item, index) => {
      const timeSlots = ['🌅 Morning', '☀️ Afternoon', '🌙 Evening']
      const slot = timeSlots[index % timeSlots.length]
      md += `- [ ] **${slot}**: ${item}\n`
    })
    md += `\n`
  })

  md += `---\n`
  md += `*Crafted with Omotenashi Concierge — Authentic 47-Prefecture Japan Travel Guide*\n`

  return md
}

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve()
      } else {
        reject(new Error('Copy failed'))
      }
      textArea.remove()
    })
  }
}
