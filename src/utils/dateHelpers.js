// Calculate number of reading days between two dates
export function calculateReadingDays(startDate, endDate, includeWeekends) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  let days = 0
  const current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (includeWeekends || !isWeekend) {
      days++
    }
    current.setDate(current.getDate() + 1)
  }

  return days
}

// Get total reading days for a duration
export function getTotalReadingDays(durationMonths, includeWeekends) {
  if (includeWeekends) {
    // Approximate days per month
    return Math.round(durationMonths * 30.44)
  } else {
    // Weekdays only (approximately 22 per month)
    return Math.round(durationMonths * 22)
  }
}

// Add reading days to a date (skipping weekends if needed)
export function addReadingDays(startDate, daysToAdd, includeWeekends) {
  const result = new Date(startDate)
  let daysAdded = 0

  while (daysAdded < daysToAdd) {
    result.setDate(result.getDate() + 1)
    const dayOfWeek = result.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (includeWeekends || !isWeekend) {
      daysAdded++
    }
  }

  return result
}

// Format date for display
export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format short date
export function formatShortDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Check if a date is today
export function isToday(date) {
  const d = date instanceof Date ? date : new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

// Check if a date is in the past
export function isPast(date) {
  const d = date instanceof Date ? date : new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return d < today
}

// Get the start of today
export function getToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

// Get tomorrow's date
export function getTomorrow() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

// Convert Firestore Timestamp to Date
export function timestampToDate(timestamp) {
  if (!timestamp) return null
  if (timestamp.toDate) return timestamp.toDate()
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000)
  return new Date(timestamp)
}

// Calculate days difference
export function daysDifference(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  const diffTime = d2 - d1
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}
