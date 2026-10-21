import { getAllChapters } from '../utils/bibleStructure'
import { addReadingDays, calculateReadingDays, getTotalReadingDays, toCivilDateKey } from '../utils/dateHelpers'

// Pure scheduling logic for changing a plan mid-way ("live switch"). Kept free
// of Firebase so it can be reasoned about and tested on its own.

const chapterKey = (passage) => `${passage.abbrev}:${passage.chapter}`

function isReadingDay(date, includeWeekends) {
  const dayOfWeek = date.getDay()
  return includeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)
}

/**
 * First day of the new schedule: today, or tomorrow if today's reading is
 * already done, moved forward past weekends for weekday-only plans.
 */
export function getScheduleStartDate(today, includeWeekends, alreadyReadToday) {
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  if (alreadyReadToday) start.setDate(start.getDate() + 1)
  while (!isReadingDay(start, includeWeekends)) start.setDate(start.getDate() + 1)
  return start
}

export function hasReadToday(planDays, today) {
  const todayKey = toCivilDateKey(today)
  return planDays.some(day => {
    if (!day.completed || !day.completedAt) return false
    const completedAt = typeof day.completedAt.toDate === 'function'
      ? day.completedAt.toDate()
      : new Date(day.completedAt.seconds ? day.completedAt.seconds * 1000 : day.completedAt)
    return toCivilDateKey(completedAt) === todayKey
  })
}

/**
 * Number of reading days for a timeframe choice, counted from `startDate`.
 * @param {Object} timeframe - { type: 'keep', finishDate } | { type: 'months', months } | { type: 'until', date }
 */
export function readingDaysForTimeframe(timeframe, startDate, includeWeekends) {
  if (timeframe.type === 'months') {
    return getTotalReadingDays(timeframe.months, includeWeekends)
  }
  const endDate = timeframe.type === 'keep' ? timeframe.finishDate : timeframe.date
  return endDate ? calculateReadingDays(startDate, endDate, includeWeekends) : 0
}

/**
 * Rebuild a plan: completed days are kept as history (renumbered 1..k in their
 * original order), and every chapter of `testament` not yet read is spread over
 * `readingDays` new days starting on `startDate`.
 *
 * @returns {{ days: Array, history: Array, newDays: Array, totalDays: number,
 *   readChapterCount: number, remainingChapterCount: number, readingDays: number,
 *   chaptersPerDay: { min: number, max: number }, finishDate: Date|null }}
 */
export function buildReschedule({ planDays, testament, includeWeekends, readingDays, startDate }) {
  const completed = planDays
    .filter(day => day.completed)
    .sort((a, b) => a.dayNumber - b.dayNumber)

  const readKeys = new Set()
  const history = completed.map((day, index) => {
    day.passages.forEach(passage => readKeys.add(chapterKey(passage)))
    return { ...day, dayNumber: index + 1 }
  })

  const remaining = getAllChapters(testament || 'BOTH').filter(passage => !readKeys.has(chapterKey(passage)))
  // Never schedule empty days: with fewer chapters than days, read one a day and finish early.
  const dayCount = remaining.length === 0
    ? 0
    : Math.min(remaining.length, Math.max(1, Math.round(readingDays) || 1))

  const baseChapters = dayCount ? Math.floor(remaining.length / dayCount) : 0
  const extraChapters = remaining.length - baseChapters * dayCount

  const newDays = []
  let chapterIndex = 0
  for (let i = 0; i < dayCount; i++) {
    const count = baseChapters + (i < extraChapters ? 1 : 0)
    const scheduledDate = i === 0 ? new Date(startDate) : addReadingDays(startDate, i, includeWeekends)
    newDays.push({
      dayNumber: history.length + i + 1,
      scheduledDate,
      passages: remaining.slice(chapterIndex, chapterIndex + count),
      completed: false,
      completedAt: null
    })
    chapterIndex += count
  }

  return {
    days: [...history, ...newDays],
    history,
    newDays,
    totalDays: history.length + newDays.length,
    readChapterCount: readKeys.size,
    remainingChapterCount: remaining.length,
    readingDays: dayCount,
    chaptersPerDay: {
      min: baseChapters,
      max: baseChapters + (extraChapters > 0 ? 1 : 0)
    },
    finishDate: newDays.length ? newDays[newDays.length - 1].scheduledDate : null
  }
}
