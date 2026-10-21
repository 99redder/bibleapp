import { getTotalReadingDays } from '../utils/dateHelpers'
import { buildReschedule, passageVerseRange } from './planReschedule'
import { Timestamp } from './firebase'

/**
 * Generate a complete reading plan based on user settings. Plans faster than a
 * chapter a day get a few whole chapters per day; slower plans split chapters
 * by verse count so there's a reading every day.
 * @param {Object} settings - User's reading plan settings
 * @param {Date} settings.startDate - When to start reading
 * @param {number} settings.durationMonths - How many months to complete (6, 12, 18, 24)
 * @param {string} settings.testament - Which testament(s) to read: 'OT', 'NT', or 'BOTH'
 * @param {boolean} settings.includeWeekends - Whether to include Saturday/Sunday
 * @returns {Array} Array of reading day objects
 */
export function generateReadingPlan(settings) {
  const { startDate, durationMonths, testament, includeWeekends } = settings

  const { days } = buildReschedule({
    planDays: [],
    testament: testament || 'BOTH',
    includeWeekends,
    readingDays: getTotalReadingDays(durationMonths, includeWeekends),
    startDate: new Date(startDate)
  })

  return days.map(day => ({ ...day, scheduledDate: Timestamp.fromDate(day.scheduledDate) }))
}

/**
 * Get a formatted description of the passages for a day
 * @param {Array} passages - Array of passage objects
 * @returns {string} Formatted description like "Genesis 1-3" or "Genesis 50, Exodus 1"
 */
export function formatPassageDescription(passages) {
  if (!passages || passages.length === 0) return ''

  // Group consecutive whole chapters from the same book; part of a chapter is
  // shown with its verse range (e.g. "Genesis 1:17–31")
  const groups = []
  let currentGroup = null

  passages.forEach(passage => {
    const { n, from, to } = passageVerseRange(passage)
    const part = from > 0 || to < n ? { firstVerse: from + 1, lastVerse: to } : null

    if (!part && currentGroup && !currentGroup.part && currentGroup.book === passage.book &&
        passage.chapter === currentGroup.endChapter + 1) {
      // Extend current group
      currentGroup.endChapter = passage.chapter
    } else {
      // Start new group
      if (currentGroup) groups.push(currentGroup)
      currentGroup = {
        book: passage.book,
        startChapter: passage.chapter,
        endChapter: passage.chapter,
        part
      }
    }
  })
  if (currentGroup) groups.push(currentGroup)

  // Format each group
  return groups.map(group => {
    if (group.part) {
      const { firstVerse, lastVerse } = group.part
      return `${group.book} ${group.startChapter}:${firstVerse}${lastVerse > firstVerse ? `–${lastVerse}` : ''}`
    }
    if (group.startChapter === group.endChapter) {
      return `${group.book} ${group.startChapter}`
    }
    return `${group.book} ${group.startChapter}-${group.endChapter}`
  }).join(', ')
}

/**
 * Calculate expected day number based on start date and current date
 * @param {Date} startDate - When the plan started
 * @param {Date} currentDate - Current date
 * @param {boolean} includeWeekends - Whether weekends are included
 * @returns {number} Expected day number (1-indexed)
 */
export function calculateExpectedDay(startDate, currentDate, includeWeekends) {
  const start = new Date(startDate)
  const current = new Date(currentDate)
  start.setHours(0, 0, 0, 0)
  current.setHours(0, 0, 0, 0)

  if (current < start) return 0 // Haven't started yet

  let dayCount = 0
  const d = new Date(start)

  while (d <= current) {
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (includeWeekends || !isWeekend) {
      dayCount++
    }
    d.setDate(d.getDate() + 1)
  }

  return dayCount
}

/**
 * Calculate progress status
 * @param {number} currentDay - User's actual current day
 * @param {number} expectedDay - Expected day based on schedule
 * @returns {Object} Status object with type and difference
 */
export function calculateProgressStatus(currentDay, expectedDay) {
  const difference = currentDay - expectedDay

  if (difference > 0) {
    return {
      type: 'ahead',
      difference,
      message: `${difference} day${difference > 1 ? 's' : ''} ahead`
    }
  } else if (difference < 0) {
    return {
      type: 'behind',
      difference: Math.abs(difference),
      message: `${Math.abs(difference)} day${Math.abs(difference) > 1 ? 's' : ''} behind`
    }
  }
  return {
    type: 'ontrack',
    difference: 0,
    message: 'On track'
  }
}
