import { calculateExpectedDay, calculateProgressStatus } from '../../services/readingPlanGenerator'
import { timestampToDate, getToday } from '../../utils/dateHelpers'

export function ProgressTracker({ userDoc }) {
  if (!userDoc?.settings || !userDoc?.progress) {
    return null
  }

  const { settings, progress } = userDoc
  const startDate = timestampToDate(settings.startDate)
  const today = getToday()

  // Calculate expected day based on schedule
  const expectedDay = calculateExpectedDay(startDate, today, settings.includeWeekends)
  const currentDay = progress.currentDay

  // Get status (ahead, behind, or on track)
  const status = calculateProgressStatus(currentDay, expectedDay)

  // Calculate completion percentage
  const totalDays = settings.includeWeekends
    ? Math.round(settings.durationMonths * 30.44)
    : Math.round(settings.durationMonths * 22)
  const completionPercent = Math.min(100, Math.round((progress.completedDays.length / totalDays) * 100))

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Your Progress</h3>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Overall completion</span>
          <span className="font-medium">{completionPercent}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Status indicator */}
      <div className={`flex items-center gap-3 p-3 rounded-lg ${
        status.type === 'ahead' ? 'bg-green-50' :
        status.type === 'behind' ? 'bg-amber-50' :
        'bg-blue-50'
      }`}>
        <div className={`p-2 rounded-full ${
          status.type === 'ahead' ? 'bg-green-100' :
          status.type === 'behind' ? 'bg-amber-100' :
          'bg-blue-100'
        }`}>
          {status.type === 'ahead' ? (
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : status.type === 'behind' ? (
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <p className={`font-medium ${
            status.type === 'ahead' ? 'text-green-700' :
            status.type === 'behind' ? 'text-amber-700' :
            'text-blue-700'
          }`}>
            {status.message}
          </p>
          <p className="text-sm text-gray-600">
            Day {currentDay} of {totalDays}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-primary-600">
            {progress.completedDays.length}
          </p>
          <p className="text-sm text-gray-600">Days completed</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {totalDays - progress.completedDays.length}
          </p>
          <p className="text-sm text-gray-600">Days remaining</p>
        </div>
      </div>
    </div>
  )
}
