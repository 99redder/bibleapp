import { calculateReadingDays, getTotalReadingDays, timestampToDate } from './dateHelpers'

// Plans normally have one reading per reading day. When a plan is stretched
// past one chapter a day, it has fewer readings (`dayCount`) than reading days
// (`spanDays`), so readings are spaced evenly with rest days in between.

/**
 * Reading-day offset (0-based) of reading `index` within a span. The first
 * reading falls on the first day and the last on the final day of the span.
 */
export function spacedOffset(index, dayCount, spanDays) {
  if (!(spanDays > dayCount) || dayCount <= 1) return index
  return Math.floor((index * (spanDays - 1)) / (dayCount - 1))
}

/** How many readings are due after `elapsed` reading days of the span. */
export function countScheduledReadings(elapsed, dayCount, spanDays) {
  if (elapsed <= 0) return 0
  if (!(spanDays > dayCount)) return elapsed
  if (dayCount <= 1) return dayCount
  // Reading i is due once its offset is reached: offset(i) <= elapsed - 1.
  return Math.min(dayCount, Math.ceil((elapsed * (dayCount - 1)) / (spanDays - 1)))
}

const isSpaced = (anchor) => Number.isFinite(anchor?.dayCount) && anchor.spanDays > anchor.dayCount

/**
 * Total number of days in the user's plan. Plans changed mid-way store this
 * explicitly; original plans derive it from the duration they were built with.
 */
export function getPlanTotalDays(settings) {
  if (!settings) return 0
  if (Number.isFinite(settings.totalDays)) return settings.totalDays
  return getTotalReadingDays(settings.durationMonths, settings.includeWeekends)
}

/**
 * The day number the user should be on today.
 *
 * When a plan is changed mid-way, `settings.paceAnchor` records which day the
 * new schedule starts on and when, so pace is measured from that point and the
 * reader starts the new schedule on track.
 */
export function getExpectedDay(settings, today) {
  if (!settings) return 0
  const anchor = settings.paceAnchor
  const anchorDate = timestampToDate(anchor?.date)

  if (anchorDate && Number.isFinite(anchor?.dayNumber)) {
    const elapsed = calculateReadingDays(anchorDate, today, settings.includeWeekends)
    return anchor.dayNumber - 1 + countScheduledReadings(elapsed, anchor.dayCount, anchor.spanDays)
  }

  const startDate = timestampToDate(settings.startDate)
  return startDate ? calculateReadingDays(startDate, today, settings.includeWeekends) : 0
}

/**
 * Whether a reading is scheduled on `date` — false on excluded weekends and on
 * the rest days of a spaced-out plan. Streaks and the calendar's "missed"
 * marks only count these days.
 */
export function isScheduledReadingDay(settings, date) {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  const dayOfWeek = day.getDay()
  if (!settings?.includeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) return false

  const anchor = settings?.paceAnchor
  const anchorDate = timestampToDate(anchor?.date)
  if (!anchorDate || !isSpaced(anchor)) return true

  const elapsed = calculateReadingDays(anchorDate, day, settings.includeWeekends)
  if (elapsed <= 0 || elapsed > anchor.spanDays) return true
  return countScheduledReadings(elapsed, anchor.dayCount, anchor.spanDays) >
    countScheduledReadings(elapsed - 1, anchor.dayCount, anchor.spanDays)
}
