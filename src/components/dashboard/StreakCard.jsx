// Always-visible streak indicator (flame + day count), modeled on the familiar
// streak chips in habit apps. Shows the current live streak prominently and the
// all-time best underneath for extra motivation.
export function StreakCard({ currentStreak = 0, longestStreak = 0 }) {
  const active = currentStreak > 0

  return (
    <div className="card flex items-center gap-4">
      <div
        className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${
          active
            ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
        }`}
      >
        <svg
          className={`w-7 h-7 ${active ? 'animate-[flameFlicker_2.4s_ease-in-out_infinite]' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2c1 3-2 4-2 7a3 3 0 006 0c0-1-.5-2-1-2.5C16 9 17 11 17 14a5 5 0 11-10 0c0-4 3-6 5-12z" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStreak}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            day{currentStreak === 1 ? '' : 's'} in a row
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {active
            ? `Read today to keep it going!${longestStreak > currentStreak ? ` · Best: ${longestStreak}` : ''}`
            : 'Read today to start a new streak'}
        </p>
      </div>
    </div>
  )
}
