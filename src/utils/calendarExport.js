/**
 * Exports itinerary to iCalendar (.ics) format compatible with Apple Calendar, Google Calendar, and Outlook.
 */

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function generateICS(prefecture, season, itineraryDays, startDate = new Date()) {
  const events = []
  const baseDate = new Date(startDate)
  // Default to 9:00 AM next day
  baseDate.setDate(baseDate.getDate() + 1)
  baseDate.setHours(9, 0, 0, 0)

  const timeSlots = [
    { startHour: 9, startMin: 0, endHour: 12, endMin: 0, slotLabel: 'Morning' },
    { startHour: 13, startMin: 0, endHour: 17, endMin: 0, slotLabel: 'Afternoon' },
    { startHour: 18, startMin: 0, endHour: 21, endMin: 0, slotLabel: 'Evening' },
  ]

  itineraryDays.forEach((day, dayIndex) => {
    const currentDayDate = new Date(baseDate)
    currentDayDate.setDate(baseDate.getDate() + dayIndex)

    day.items.forEach((item, itemIndex) => {
      const slot = timeSlots[itemIndex % timeSlots.length]

      const start = new Date(currentDayDate)
      start.setHours(slot.startHour, slot.startMin, 0, 0)

      const end = new Date(currentDayDate)
      end.setHours(slot.endHour, slot.endMin, 0, 0)

      const uid = `omotenashi-${prefecture.id}-${dayIndex}-${itemIndex}-${Date.now()}@omotenashi.japan`

      events.push([
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:[${prefecture.name}] ${day.day}: ${item}`,
        `DESCRIPTION:Omotenashi Concierge Japan Journey\\nPrefecture: ${prefecture.name} (${prefecture.japaneseName})\\nSeason: ${season.toUpperCase()}\\nTheme: ${day.theme}\\nActivity: ${item}\\nCapital: ${prefecture.capital}\\nInsider Tip: ${prefecture.insiderTip || 'Enjoy local hospitality!'}`,
        `LOCATION:${prefecture.name}, Japan`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n'))
    })
  })

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Omotenashi Concierge//Japan Travel Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${prefecture.name} ${season.toUpperCase()} Journey — Omotenashi`,
    'X-WR-TIMEZONE:Asia/Tokyo',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}

export function downloadICS(filename, icsContent) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
