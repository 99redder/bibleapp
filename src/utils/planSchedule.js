import { calculateReadingDays, getTotalReadingDays, timestampToDate } from './dateHelpers'

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
  const anchorDate = timestampToDate(settings.paceAnchor?.date)

  if (anchorDate && Number.isFinite(settings.paceAnchor?.dayNumber)) {
    const daysBeforeAnchor = settings.paceAnchor.dayNumber - 1
    return daysBeforeAnchor + calculateReadingDays(anchorDate, today, settings.includeWeekends)
  }

  const startDate = timestampToDate(settings.startDate)
  return startDate ? calculateReadingDays(startDate, today, settings.includeWeekends) : 0
}
