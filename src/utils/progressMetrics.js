import { calculateExpectedDay } from '../services/readingPlanGenerator'
import { getTotalReadingDays, timestampToDate, getToday } from './dateHelpers'
import { displayStreak } from './streakHelpers'

/**
 * Derive the reward-relevant metrics (completion %, days ahead of schedule, and
 * the currently-alive streak) from a user document's settings + progress.
 *
 * @param {Object} userDoc - the Firestore user document ({ settings, progress })
 * @param {Date} [today] - override for "today" (defaults to the start of the user's local day)
 * @returns {{ percent: number, daysAhead: number, streak: number, totalDays: number, completedCount: number }}
 */
export function computeMetrics(userDoc, today = getToday()) {
  const settings = userDoc?.settings
  const progress = userDoc?.progress

  if (!settings || !progress) {
    return { percent: 0, daysAhead: 0, streak: 0, totalDays: 0, completedCount: 0 }
  }

  const includeWeekends = settings.includeWeekends
  const totalDays = getTotalReadingDays(settings.durationMonths, includeWeekends)

  const completedCount = (progress.completedDays || []).length
  const percent = totalDays > 0
    ? Math.min(100, Math.round((completedCount / totalDays) * 100))
    : 0

  const startDate = timestampToDate(settings.startDate)
  const expectedDay = startDate ? calculateExpectedDay(startDate, today, includeWeekends) : 0
  const currentDay = progress.currentDay || 1
  const daysAhead = Math.max(0, currentDay - expectedDay)

  const streak = displayStreak({
    lastStreakDate: progress.lastStreakDate || null,
    currentStreak: progress.currentStreak || 0,
    today,
    includeWeekends
  })

  return { percent, daysAhead, streak, totalDays, completedCount }
}
