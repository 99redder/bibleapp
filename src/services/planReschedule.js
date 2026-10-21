import { getAllChapters } from '../utils/bibleStructure'
import { addReadingDays, calculateReadingDays, getTotalReadingDays, toCivilDateKey } from '../utils/dateHelpers'
import VERSE_COUNTS from '../data/verseCounts.json'

// Pure scheduling logic shared by new plans (onboarding) and plan changes
// ("live switch"). Kept free of Firebase so it can be tested on its own.
//
// A passage is a whole chapter ({ book, abbrev, chapter }) or part of one,
// with `partStart`/`partEnd` as fractions of the chapter's verses. Fractions
// (rather than verse numbers) keep parts correct in every translation, since
// some number their verses slightly differently.

const chapterKey = (passage) => `${passage.abbrev}:${passage.chapter}`

// When a cut lands this close (as a share of a day's reading) to a chapter
// break, end the day at the chapter break instead of mid-chapter.
const SNAP_TO_CHAPTER = 0.3

export function verseCount(abbrev, chapter) {
  return VERSE_COUNTS[abbrev]?.[chapter - 1] || 1
}

/** Verse-index range [from, to) a passage covers within its chapter of `n` verses. */
export function passageVerseRange(passage) {
  const n = verseCount(passage.abbrev, passage.chapter)
  const from = passage.partStart != null ? Math.round(passage.partStart * n) : 0
  const to = passage.partEnd != null ? Math.round(passage.partEnd * n) : n
  return { n, from, to }
}

export function countVerses(testament = 'BOTH') {
  return getAllChapters(testament).reduce((sum, chapter) => sum + verseCount(chapter.abbrev, chapter.chapter), 0)
}

function makePassage(chapter, from, to, n) {
  const passage = { book: chapter.book, abbrev: chapter.abbrev, chapter: chapter.chapter }
  if (from > 0 || to < n) {
    passage.partStart = from / n
    passage.partEnd = to / n
  }
  return passage
}

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
 * What's left to read: every chapter of `testament`, minus the verses already
 * covered by completed days. A partly read chapter leaves a partial segment.
 */
function getUnreadSegments(completedDays, testament) {
  const readRanges = new Map()
  completedDays.forEach(day => day.passages.forEach(passage => {
    const key = chapterKey(passage)
    if (!readRanges.has(key)) readRanges.set(key, [])
    const { from, to } = passageVerseRange(passage)
    readRanges.get(key).push([from, to])
  }))

  const unreadIn = (chapter) => {
    const n = verseCount(chapter.abbrev, chapter.chapter)
    const ranges = (readRanges.get(chapterKey(chapter)) || []).slice().sort((a, b) => a[0] - b[0])
    const gaps = []
    let position = 0
    for (const [from, to] of ranges) {
      if (from > position) gaps.push([position, from])
      position = Math.max(position, to)
    }
    if (position < n) gaps.push([position, n])
    return { n, gaps }
  }

  const segments = []
  getAllChapters(testament || 'BOTH').forEach(chapter => {
    const { n, gaps } = unreadIn(chapter)
    gaps.forEach(([from, to]) => segments.push({ chapter, n, from, to }))
  })

  const fullyReadCount = getAllChapters('BOTH').filter(chapter => unreadIn(chapter).gaps.length === 0).length
  return { segments, fullyReadCount }
}

// Whole-or-partial segments shared out a few per day (normal pace).
function distributeSegments(segments, dayCount) {
  const base = Math.floor(segments.length / dayCount)
  const extra = segments.length - base * dayCount
  const readings = []
  let index = 0
  for (let day = 0; day < dayCount; day++) {
    const count = base + (day < extra ? 1 : 0)
    readings.push(segments.slice(index, index + count).map(s => makePassage(s.chapter, s.from, s.to, s.n)))
    index += count
  }
  return readings
}

// Slower than a chapter a day: cut the remaining verses into `dayCount`
// readings of about equal length, preferring chapter breaks and never leaving
// a sliver of a chapter (so very short chapters stay whole).
function splitByVerses(segments, dayCount) {
  const starts = []
  let total = 0
  segments.forEach(segment => {
    starts.push(total)
    total += segment.to - segment.from
  })
  const days = Math.min(dayCount, total)
  const perDay = total / days
  const minPart = Math.max(1, Math.min(4, Math.floor(perDay / 2)))

  const segmentAt = (position) => {
    let low = 0
    let high = segments.length - 1
    while (low < high) {
      const mid = (low + high + 1) >> 1
      if (starts[mid] <= position) low = mid
      else high = mid - 1
    }
    return low
  }

  const cuts = [0]
  for (let i = 1; i < days; i++) {
    const target = i * perDay
    const index = segmentAt(Math.min(Math.floor(target), total - 1))
    const segmentStart = starts[index]
    const segmentEnd = segmentStart + (segments[index].to - segments[index].from)
    const nearestBreak = target - segmentStart <= segmentEnd - target ? segmentStart : segmentEnd

    let cut = Math.round(target)
    if (Math.abs(nearestBreak - target) <= perDay * SNAP_TO_CHAPTER) {
      cut = nearestBreak
    } else if (cut - segmentStart < minPart) {
      cut = segmentStart
    } else if (segmentEnd - cut < minPart) {
      cut = segmentEnd
    }

    // Every day gets at least one verse, with room left for the days after it.
    cut = Math.min(Math.max(cut, cuts[cuts.length - 1] + 1), total - (days - i))
    cuts.push(cut)
  }
  cuts.push(total)

  const readings = []
  for (let day = 0; day < days; day++) {
    const [dayStart, dayEnd] = [cuts[day], cuts[day + 1]]
    const passages = []
    for (let index = segmentAt(dayStart); index < segments.length && starts[index] < dayEnd; index++) {
      const segment = segments[index]
      const from = Math.max(dayStart, starts[index]) - starts[index] + segment.from
      const to = Math.min(dayEnd, starts[index] + segment.to - segment.from) - starts[index] + segment.from
      if (to > from) passages.push(makePassage(segment.chapter, from, to, segment.n))
    }
    readings.push(passages)
  }
  return { readings, versesPerDay: Math.round(perDay) }
}

/**
 * Build a plan: completed days are kept as history (renumbered 1..k in their
 * original order), and everything of `testament` not yet read is scheduled
 * over `readingDays` days starting on `startDate`. With fewer days than
 * chapters, each day gets a few whole chapters; with more days than chapters,
 * chapters are split by verse count so there's a reading every day.
 *
 * @returns {{ days: Array, history: Array, newDays: Array, totalDays: number,
 *   readChapterCount: number, remainingChapterCount: number, readingDays: number,
 *   spanDays: number, isSplit: boolean, versesPerDay: number|null,
 *   chaptersPerDay: { min: number, max: number }, finishDate: Date|null }}
 */
export function buildReschedule({ planDays, testament, includeWeekends, readingDays, startDate }) {
  const completed = planDays
    .filter(day => day.completed)
    .sort((a, b) => a.dayNumber - b.dayNumber)
  const history = completed.map((day, index) => ({ ...day, dayNumber: index + 1 }))

  const { segments, fullyReadCount } = getUnreadSegments(completed, testament)
  const requestedDays = Math.max(1, Math.round(readingDays) || 1)
  const isSplit = segments.length > 0 && requestedDays > segments.length

  let readings = []
  let versesPerDay = null
  if (isSplit) {
    ({ readings, versesPerDay } = splitByVerses(segments, requestedDays))
  } else if (segments.length > 0) {
    readings = distributeSegments(segments, requestedDays)
  }

  const newDays = readings.map((passages, i) => ({
    dayNumber: history.length + i + 1,
    scheduledDate: i === 0 ? new Date(startDate) : addReadingDays(startDate, i, includeWeekends),
    passages,
    completed: false,
    completedAt: null
  }))

  const chapterCounts = readings.map(passages => passages.length)
  return {
    days: [...history, ...newDays],
    history,
    newDays,
    totalDays: history.length + newDays.length,
    readChapterCount: fullyReadCount,
    remainingChapterCount: new Set(segments.map(segment => chapterKey(segment.chapter))).size,
    readingDays: newDays.length,
    spanDays: newDays.length,
    isSplit,
    versesPerDay,
    chaptersPerDay: {
      min: chapterCounts.length ? Math.min(...chapterCounts) : 0,
      max: chapterCounts.length ? Math.max(...chapterCounts) : 0
    },
    finishDate: newDays.length ? newDays[newDays.length - 1].scheduledDate : null
  }
}
