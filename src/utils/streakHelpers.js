// Streak tracking helpers.
//
// A streak counts consecutive real-world days on which the user logged at least
// one reading. Weekends are "rest days" only when the user excluded weekends
// from their plan (settings.includeWeekends === false) — in that case missing a
// Saturday/Sunday does NOT break the streak. When weekends are included, every
// calendar day is an active day and must be read to keep the streak alive.

// Convert a Date to a local YYYY-MM-DD key (timezone-safe; avoids the UTC
// off-by-one issue documented in CLAUDE.md).
export function toDateKey(date) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Parse a YYYY-MM-DD key back into a local Date at midnight.
export function dateKeyToDate(key) {
  return new Date(key + 'T00:00:00')
}

function isActiveDay(date, includeWeekends) {
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  return includeWeekends || !isWeekend
}

// Count the number of "active" reading days strictly between two date keys
// (exclusive of both endpoints). Used to decide whether the streak continues
// (0 missed active days) or breaks (>= 1 missed active day).
export function countMissedActiveDays(fromKey, toKey, includeWeekends) {
  const start = dateKeyToDate(fromKey)
  const end = dateKeyToDate(toKey)

  let missed = 0
  const d = new Date(start)
  d.setDate(d.getDate() + 1) // start the day after the last credited day

  while (d < end) {
    if (isActiveDay(d, includeWeekends)) {
      missed++
    }
    d.setDate(d.getDate() + 1)
  }

  return missed
}

/**
 * Compute the updated streak after the user logs a reading "today".
 *
 * @param {Object} params
 * @param {string|null} params.lastStreakDate - YYYY-MM-DD key the streak was last credited
 * @param {number} params.currentStreak - existing current streak
 * @param {number} params.longestStreak - existing longest streak
 * @param {Date} params.today - the real-world day the reading was logged
 * @param {boolean} params.includeWeekends - whether the plan includes weekends
 * @returns {{ currentStreak: number, longestStreak: number, lastStreakDate: string, alreadyCounted: boolean }}
 */
export function computeStreakUpdate({
  lastStreakDate,
  currentStreak = 0,
  longestStreak = 0,
  today,
  includeWeekends
}) {
  const todayKey = toDateKey(today)

  // Already logged a reading today — streak unchanged.
  if (lastStreakDate === todayKey) {
    return {
      currentStreak: currentStreak || 1,
      longestStreak: Math.max(longestStreak, currentStreak || 1),
      lastStreakDate: todayKey,
      alreadyCounted: true
    }
  }

  let newStreak
  if (!lastStreakDate) {
    newStreak = 1
  } else {
    const missed = countMissedActiveDays(lastStreakDate, todayKey, includeWeekends)
    newStreak = missed === 0 ? currentStreak + 1 : 1
  }

  return {
    currentStreak: newStreak,
    longestStreak: Math.max(longestStreak, newStreak),
    lastStreakDate: todayKey,
    alreadyCounted: false
  }
}

/**
 * Determine whether an existing streak is still "alive" as of today, for display
 * purposes. A stored streak should show as broken if the user has already missed
 * an active day since they last read. This does not mutate stored data — it only
 * affects what number we display before the next reading is logged.
 *
 * @returns {number} the streak value to display
 */
export function displayStreak({ lastStreakDate, currentStreak = 0, today, includeWeekends }) {
  if (!lastStreakDate || !currentStreak) return 0

  const todayKey = toDateKey(today)
  if (lastStreakDate === todayKey) return currentStreak

  // Missed active days between the last credited day and today (exclusive of
  // today, since today is still "in progress" and can be completed).
  const missed = countMissedActiveDays(lastStreakDate, todayKey, includeWeekends)
  return missed === 0 ? currentStreak : 0
}
