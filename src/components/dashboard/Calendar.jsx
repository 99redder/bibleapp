import { useState, useMemo } from 'react'
import { timestampToDate } from '../../utils/dateHelpers'

export function Calendar({ userDoc, completedDaysData }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const startDate = userDoc?.settings?.startDate
    ? timestampToDate(userDoc.settings.startDate)
    : null

  // Build a set of completed dates for quick lookup
  const completedDates = useMemo(() => {
    const dates = new Set()
    completedDaysData?.forEach(day => {
      if (day.completedAt) {
        const date = timestampToDate(day.completedAt)
        dates.add(date.toDateString())
      }
    })
    return dates
  }, [completedDaysData])

  // Get calendar data for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of month
    const firstDay = new Date(year, month, 1)
    // Last day of month
    const lastDay = new Date(year, month + 1, 0)

    // Start from Sunday of the week containing the first day
    const startCalendar = new Date(firstDay)
    startCalendar.setDate(startCalendar.getDate() - startCalendar.getDay())

    // End on Saturday of the week containing the last day
    const endCalendar = new Date(lastDay)
    endCalendar.setDate(endCalendar.getDate() + (6 - endCalendar.getDay()))

    const days = []
    const current = new Date(startCalendar)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    while (current <= endCalendar) {
      const isCurrentMonth = current.getMonth() === month
      const isToday = current.toDateString() === today.toDateString()
      const isCompleted = completedDates.has(current.toDateString())
      const isPast = current < today && !isToday
      const isBeforeStart = startDate && current < startDate

      days.push({
        date: new Date(current),
        day: current.getDate(),
        isCurrentMonth,
        isToday,
        isCompleted,
        isPast,
        isBeforeStart
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentMonth, completedDates, startDate])

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <button
          onClick={goToToday}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Today
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium">{monthName}</span>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center text-sm rounded-full
              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
              ${day.isToday ? 'ring-2 ring-primary-500' : ''}
              ${day.isCompleted ? 'bg-green-500 text-white' : ''}
              ${day.isPast && !day.isCompleted && !day.isBeforeStart && day.isCurrentMonth
                ? 'bg-red-100 text-red-600' : ''}
              ${day.isBeforeStart ? 'text-gray-300' : ''}
            `}
          >
            {day.day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-100" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full ring-2 ring-primary-500" />
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}
