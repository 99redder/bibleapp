import { useState, useMemo } from 'react'
import { formatMonthYear, timestampToDate, toCivilDateKey, getToday } from '../../utils/dateHelpers'
import { isScheduledReadingDay } from '../../utils/planSchedule'
import { useLanguage, useT } from '../../i18n'

export function Calendar({ userDoc, completedDaysData }) {
  const t = useT()
  const language = useLanguage()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const startDate = userDoc?.settings?.startDate
    ? timestampToDate(userDoc.settings.startDate)
    : null

  // Build a set of completed dates (keyed by the user's local calendar day) for lookup
  const completedDates = useMemo(() => {
    const dates = new Set()
    completedDaysData?.forEach(day => {
      if (day.completedAt) {
        dates.add(toCivilDateKey(timestampToDate(day.completedAt)))
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
    const today = getToday()
    const todayKey = toCivilDateKey(today)

    while (current <= endCalendar) {
      const isCurrentMonth = current.getMonth() === month
      const currentKey = toCivilDateKey(current)
      const isToday = currentKey === todayKey
      const isCompleted = completedDates.has(currentKey)
      const isPast = current < today && !isToday
      const isBeforeStart = startDate && current < startDate
      // Excluded weekends and a spaced plan's rest days are never "missed".
      const isReadingDay = isScheduledReadingDay(userDoc?.settings, current)

      days.push({
        date: new Date(current),
        day: current.getDate(),
        isCurrentMonth,
        isToday,
        isCompleted,
        isPast,
        isBeforeStart,
        isReadingDay
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentMonth, completedDates, startDate, userDoc?.settings])

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const monthName = formatMonthYear(currentMonth, language)

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('calendar.title')}</h3>
        <button
          onClick={goToToday}
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {t('common.today')}
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          aria-label={t('calendar.previousMonth')}
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-900 dark:text-white">{monthName}</span>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          aria-label={t('calendar.nextMonth')}
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {t('calendar.weekdayInitials').split('').map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
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
              ${!day.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}
              ${day.isToday ? 'ring-2 ring-primary-500' : ''}
              ${day.isCompleted ? 'bg-green-500 text-white' : ''}
              ${day.isPast && !day.isCompleted && !day.isBeforeStart && day.isReadingDay && day.isCurrentMonth
                ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : ''}
              ${day.isBeforeStart ? 'text-gray-300 dark:text-gray-600' : ''}
            `}
          >
            {day.day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>{t('calendar.completed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/50" />
          <span>{t('calendar.missed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full ring-2 ring-primary-500" />
          <span>{t('common.today')}</span>
        </div>
      </div>
    </div>
  )
}
