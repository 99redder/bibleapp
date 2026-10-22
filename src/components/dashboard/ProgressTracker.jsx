import { calculateProgressStatus } from '../../services/readingPlanGenerator'
import { getToday } from '../../utils/dateHelpers'
import { getExpectedDay, getPlanTotalDays } from '../../utils/planSchedule'
import { useT } from '../../i18n'

const STATUS_TEXT = { ahead: 'progress.ahead', behind: 'progress.behind', ontrack: 'progress.onTrack' }

export function ProgressTracker({ userDoc }) {
  const t = useT()

  if (!userDoc?.settings || !userDoc?.progress) {
    return null
  }

  const { settings, progress } = userDoc
  const today = getToday()

  // Calculate expected day based on schedule
  const expectedDay = getExpectedDay(settings, today)
  const currentDay = progress?.currentDay || 1
  const completedDays = progress?.completedDays || []

  // Get status (ahead, behind, or on track)
  const status = calculateProgressStatus(currentDay, expectedDay)

  // Calculate completion percentage
  const totalDays = getPlanTotalDays(settings)
  const completionPercent = Math.min(100, Math.round((completedDays.length / totalDays) * 100))

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('progress.title')}</h3>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">{t('progress.overall')}</span>
          <span className="font-medium text-gray-900 dark:text-white">{completionPercent}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Status indicator */}
      <div className={`flex items-center gap-3 p-3 rounded-lg ${
        status.type === 'ahead' ? 'bg-green-50 dark:bg-green-900/30' :
        status.type === 'behind' ? 'bg-amber-50 dark:bg-amber-900/30' :
        'bg-blue-50 dark:bg-blue-900/30'
      }`}>
        <div className={`p-2 rounded-full ${
          status.type === 'ahead' ? 'bg-green-100 dark:bg-green-900' :
          status.type === 'behind' ? 'bg-amber-100 dark:bg-amber-900' :
          'bg-blue-100 dark:bg-blue-900'
        }`}>
          {status.type === 'ahead' ? (
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : status.type === 'behind' ? (
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <p className={`font-medium ${
            status.type === 'ahead' ? 'text-green-700 dark:text-green-300' :
            status.type === 'behind' ? 'text-amber-700 dark:text-amber-300' :
            'text-blue-700 dark:text-blue-300'
          }`}>
            {t(STATUS_TEXT[status.type], { n: status.difference })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('progress.dayOf', { n: currentDay, total: totalDays })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {completedDays.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('progress.completed')}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalDays - completedDays.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('progress.remaining')}</p>
        </div>
      </div>
    </div>
  )
}
