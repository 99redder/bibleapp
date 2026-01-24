import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ReadingCard } from '../components/dashboard/ReadingCard'
import { ProgressTracker } from '../components/dashboard/ProgressTracker'
import { Calendar } from '../components/dashboard/Calendar'
import { getReadingPlanDay, markDayComplete, getCompletedDays, resetReadingPlan } from '../services/firebase'

export function DashboardPage() {
  const { user, userDoc, logout, refreshUserDoc } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const [currentDayData, setCurrentDayData] = useState(null)
  const [viewingDayNumber, setViewingDayNumber] = useState(null)
  const [completedDays, setCompletedDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    if (userDoc && !userDoc.onboardingComplete) {
      navigate('/onboarding')
      return
    }

    if (user && userDoc?.onboardingComplete) {
      loadDashboardData()
    }
  }, [user, userDoc])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const currentDay = userDoc?.progress?.currentDay || 1
      // Load current day's reading
      const dayData = await getReadingPlanDay(user.uid, currentDay)
      setCurrentDayData(dayData)
      setViewingDayNumber(currentDay)

      // Load completed days for calendar
      const completed = await getCompletedDays(user.uid)
      setCompletedDays(completed)
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadDay = async (dayNumber) => {
    setLoading(true)
    try {
      const dayData = await getReadingPlanDay(user.uid, dayNumber)
      setCurrentDayData(dayData)
      setViewingDayNumber(dayNumber)
    } catch (err) {
      console.error('Error loading day:', err)
    } finally {
      setLoading(false)
    }
  }

  const goToNextDay = () => {
    if (viewingDayNumber) {
      loadDay(viewingDayNumber + 1)
    }
  }

  const goToPreviousDay = () => {
    if (viewingDayNumber && viewingDayNumber > 1) {
      loadDay(viewingDayNumber - 1)
    }
  }

  const goToCurrentDay = () => {
    if (userDoc?.progress?.currentDay) {
      loadDay(userDoc.progress.currentDay)
    }
  }

  const handleMarkComplete = async () => {
    if (!currentDayData) return

    setMarkingComplete(true)
    try {
      const progress = userDoc?.progress || { currentDay: 1, completedDays: [], lastReadDate: null }
      await markDayComplete(user.uid, currentDayData.dayNumber, progress)
      await refreshUserDoc()

      // Load next day's reading
      const nextDayData = await getReadingPlanDay(user.uid, currentDayData.dayNumber + 1)
      setCurrentDayData(nextDayData)

      // Refresh completed days
      const completed = await getCompletedDays(user.uid)
      setCompletedDays(completed)
    } catch (err) {
      console.error('Error marking complete:', err)
    } finally {
      setMarkingComplete(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleStartFresh = async () => {
    setResetting(true)
    try {
      await resetReadingPlan(user.uid)
      await refreshUserDoc()
      navigate('/onboarding')
    } catch (err) {
      console.error('Error resetting plan:', err)
    } finally {
      setResetting(false)
      setShowResetConfirm(false)
    }
  }

  if (loading && !currentDayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const isViewingCurrentDay = viewingDayNumber === userDoc?.progress?.currentDay
  const isViewingCompletedDay = completedDays.some(d => d.dayNumber === viewingDayNumber)
  const canMarkComplete = isViewingCurrentDay || (!isViewingCompletedDay && viewingDayNumber <= (userDoc?.progress?.currentDay || 1))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bible Reading</h1>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            {/* Calendar toggle */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`p-2 rounded-lg ${showCalendar ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              aria-label="Toggle calendar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            {/* Settings menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${showSettings ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                aria-label="Settings"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {/* Settings dropdown */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                  <button
                    onClick={() => {
                      setShowResetConfirm(true)
                      setShowSettings(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Start Fresh
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowSettings(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Fresh?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will delete your current reading plan and all progress. You'll go through setup again to create a new plan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStartFresh}
                disabled={resetting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Start Fresh'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close settings - z-index below header (z-10) so dropdown remains clickable */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Calendar (toggleable) */}
        {showCalendar && (
          <Calendar userDoc={userDoc} completedDaysData={completedDays} />
        )}

        {/* Progress tracker */}
        <ProgressTracker userDoc={userDoc} />

        {/* Day navigation */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isViewingCurrentDay ? "Today's Reading" : `Day ${viewingDayNumber}`}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousDay}
              disabled={viewingDayNumber <= 1}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous day"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {!isViewingCurrentDay && (
              <button
                onClick={goToCurrentDay}
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800"
              >
                Today
              </button>
            )}
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Next day"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Completed badge */}
        {isViewingCompletedDay && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-700 dark:text-green-300">This reading is complete</span>
          </div>
        )}

        {/* Reading card */}
        <ReadingCard
          dayData={currentDayData}
          bibleVersion={userDoc?.settings?.bibleVersion || 'KJV'}
          onMarkComplete={canMarkComplete ? handleMarkComplete : null}
          loading={markingComplete}
        />

        {/* Read ahead prompt */}
        {isViewingCurrentDay && !markingComplete && currentDayData && (
          <button
            onClick={goToNextDay}
            className="w-full py-3 text-center text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
          >
            Preview tomorrow's reading
          </button>
        )}

        {/* Invite others */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={async () => {
              const shareData = {
                title: 'Bible Reading Plan',
                text: 'Join me in reading through the Bible! This app helps you create a personalized reading plan.',
                url: window.location.origin + window.location.pathname
              }

              if (navigator.share && navigator.canShare?.(shareData)) {
                try {
                  await navigator.share(shareData)
                } catch (err) {
                  // User cancelled or share failed - ignore
                  if (err.name !== 'AbortError') {
                    console.error('Share failed:', err)
                  }
                }
              } else {
                // Fallback: copy link to clipboard
                try {
                  await navigator.clipboard.writeText(shareData.url)
                  alert('Link copied to clipboard!')
                } catch (err) {
                  console.error('Copy failed:', err)
                }
              }
            }}
            className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Invite Others
          </button>
        </div>
      </main>
    </div>
  )
}
