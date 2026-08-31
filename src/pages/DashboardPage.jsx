import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ReadingCard } from '../components/dashboard/ReadingCard'
import { ProgressTracker } from '../components/dashboard/ProgressTracker'
import { StreakCard } from '../components/dashboard/StreakCard'
import { RewardToastStack } from '../components/dashboard/RewardToast'
import { getReadingPlanDay, markDayComplete, getCompletedDays, resetReadingPlan, updateBibleVersion, updateShownMilestones } from '../services/firebase'
import { getCachedDashboard, setCachedDashboard } from '../services/localCache'
import { clearPendingCompletions, enqueueCompletion, getPendingCompletions, removePendingCompletion } from '../services/completionQueue'
import { flushClientDiagnostics, recordClientDiagnostic } from '../services/clientDiagnostics'
import { prefetchDayPassages } from '../services/bibleAPI'
import { BIBLE_VERSIONS } from '../utils/bibleStructure'
import { computeMetrics } from '../utils/progressMetrics'
import { detectRewards, achievedMilestones } from '../utils/rewards'

const Calendar = lazy(() => import('../components/dashboard/Calendar').then(module => ({ default: module.Calendar })))
const CelebrationOverlay = lazy(() => import('../components/dashboard/CelebrationOverlay').then(module => ({ default: module.CelebrationOverlay })))

export function DashboardPage() {
  const { user, userDoc, logout, refreshUserDoc } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const readingSectionRef = useRef(null)
  const syncingCompletionsRef = useRef(false)

  const [currentDayData, setCurrentDayData] = useState(null)
  const [viewingDayNumber, setViewingDayNumber] = useState(null)
  const [completedDays, setCompletedDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [markCompleteError, setMarkCompleteError] = useState(null)
  const [pendingCompletions, setPendingCompletions] = useState([])
  const [completionSyncState, setCompletionSyncState] = useState('idle')
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [migrationBibleVersion, setMigrationBibleVersion] = useState('WEB')
  const [savingMigration, setSavingMigration] = useState(false)
  const [migrationError, setMigrationError] = useState(null)
  const [celebrationQueue, setCelebrationQueue] = useState([])
  const [toasts, setToasts] = useState([])
  const seededRef = useRef(false)

  useEffect(() => {
    if (userDoc && !userDoc.onboardingComplete) {
      navigate('/onboarding')
      return
    }

    if (user && userDoc?.onboardingComplete) {
      loadDashboardData()
    }
  }, [user, userDoc])

  useEffect(() => {
    if (!user || !currentDayData) return
    setCachedDashboard(user.uid, {
      currentDayData,
      viewingDayNumber,
      completedDays
    })
  }, [user, currentDayData, viewingDayNumber, completedDays])

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted && user && userDoc?.onboardingComplete) {
        loadDashboardData()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && userDoc?.onboardingComplete && currentDayData) {
        syncPendingCompletions()
        loadDashboardData()
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user, userDoc, currentDayData])

  useEffect(() => {
    if (!user) return
    setPendingCompletions(getPendingCompletions(user.uid))

    const handleOnline = () => {
      setIsOnline(true)
      syncPendingCompletions()
    }
    const handleOffline = () => {
      setIsOnline(false)
      setCompletionSyncState('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    if (navigator.onLine) syncPendingCompletions()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user?.uid, userDoc?.settings])

  const loadDashboardData = async () => {
    const currentDay = userDoc?.progress?.currentDay || 1
    const cachedDashboard = getCachedDashboard(user.uid)

    if (cachedDashboard?.currentDayData && cachedDashboard.viewingDayNumber === currentDay) {
      setCurrentDayData(cachedDashboard.currentDayData)
      setViewingDayNumber(cachedDashboard.viewingDayNumber)
      setCompletedDays(cachedDashboard.completedDays || [])
      setLoading(false)
    } else {
      setLoading(true)
    }

    try {
      // Load current day's reading
      const dayData = await getReadingPlanDay(user.uid, currentDay)
      setCurrentDayData(dayData)
      setViewingDayNumber(currentDay)
      setLoading(false)
      setCachedDashboard(user.uid, {
        currentDayData: dayData,
        viewingDayNumber: currentDay,
        completedDays: cachedDashboard?.completedDays || []
      })
      warmUpcomingReadings(currentDay)

      // Load completed days separately so the reading card can render first.
      getCompletedDays(user.uid)
        .then((completed) => {
          setCompletedDays(completed)
          setCachedDashboard(user.uid, {
            currentDayData: dayData,
            viewingDayNumber: currentDay,
            completedDays: completed
          })
        })
        .catch((completedErr) => {
          console.error('Error loading completed days:', completedErr)
        })

      // First time we see this user with the rewards feature, silently mark any
      // milestones they've already passed as "shown" so we don't fire a backlog
      // of celebrations on their next reading.
      if (!seededRef.current && userDoc?.progress && !userDoc.progress.shownMilestones) {
        seededRef.current = true
        const metrics = computeMetrics(userDoc)
        try {
          await updateShownMilestones(user.uid, achievedMilestones(metrics))
          await refreshUserDoc()
        } catch (seedErr) {
          console.error('Error seeding milestones:', seedErr)
        }
      }
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const warmUpcomingReadings = (startDay) => {
    const run = async () => {
      try {
        const bibleVersion = userDoc?.settings?.bibleVersion || 'WEB'
        const upcoming = await Promise.all(
          [0, 1, 2, 3].map(offset => getReadingPlanDay(user.uid, startDay + offset))
        )
        upcoming
          .filter(Boolean)
          .forEach(day => prefetchDayPassages(bibleVersion, day.passages))
      } catch (err) {
        console.warn('Unable to warm upcoming Bible passages:', err)
      }
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 3000 })
    } else {
      window.setTimeout(run, 1000)
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

  const scrollToReadingSection = () => {
    requestAnimationFrame(() => {
      readingSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  const saveCompletionForLater = (dayNumber, completedAt, error = null) => {
    try {
      const queued = enqueueCompletion(user.uid, dayNumber, completedAt)
      setPendingCompletions(queued)
      setCurrentDayData(previous => previous?.dayNumber === dayNumber
        ? { ...previous, pendingCompletion: true }
        : previous)
      setCompletionSyncState(navigator.onLine ? 'error' : 'offline')
      setMarkCompleteError(null)
      if (error) {
        recordClientDiagnostic(user.uid, error, { operation: 'queue_mark_complete', dayNumber })
      }
      return true
    } catch (queueError) {
      console.error('Error saving completion for later:', queueError)
      recordClientDiagnostic(user.uid, queueError, { operation: 'save_completion_queue', dayNumber })
      setMarkCompleteError('We could not save this reading on this device. Keep the app open, reconnect, and try again.')
      return false
    }
  }

  const syncPendingCompletions = async () => {
    if (!user || !navigator.onLine || syncingCompletionsRef.current) return

    const queued = getPendingCompletions(user.uid)
    setPendingCompletions(queued)
    if (!queued.length) {
      setCompletionSyncState('idle')
      await flushClientDiagnostics(user.uid)
      return
    }

    syncingCompletionsRef.current = true
    setCompletionSyncState('syncing')
    let latestProgress = userDoc?.progress || { currentDay: 1, completedDays: [] }
    let syncError = null

    try {
      for (const entry of queued) {
        try {
          latestProgress = await markDayComplete(
            user.uid,
            entry.dayNumber,
            latestProgress,
            userDoc?.settings,
            entry.completedAt
          )
          const remaining = removePendingCompletion(user.uid, entry.dayNumber)
          setPendingCompletions(remaining)
        } catch (err) {
          syncError = err
          recordClientDiagnostic(user.uid, err, {
            operation: 'sync_pending_completion',
            dayNumber: entry.dayNumber
          })
          break
        }
      }

      if (!syncError) {
        const [dayData, completed] = await Promise.all([
          getReadingPlanDay(user.uid, latestProgress.currentDay || 1),
          getCompletedDays(user.uid)
        ])
        setCurrentDayData(dayData)
        setViewingDayNumber(latestProgress.currentDay || 1)
        setCompletedDays(completed)
        setCachedDashboard(user.uid, {
          currentDayData: dayData,
          viewingDayNumber: latestProgress.currentDay || 1,
          completedDays: completed
        })
        await refreshUserDoc()
        setCompletionSyncState('synced')
      } else {
        setCompletionSyncState(navigator.onLine ? 'error' : 'offline')
      }
    } catch (err) {
      console.error('Error refreshing synced completions:', err)
      recordClientDiagnostic(user.uid, err, { operation: 'refresh_synced_completions' })
      setCompletionSyncState('error')
    } finally {
      syncingCompletionsRef.current = false
      await flushClientDiagnostics(user.uid)
    }
  }

  const handleMarkComplete = async () => {
    if (!currentDayData) return

    let completionCommitted = false
    const completedAt = new Date()
    setMarkingComplete(true)
    setMarkCompleteError(null)

    if (!navigator.onLine) {
      saveCompletionForLater(currentDayData.dayNumber, completedAt)
      setMarkingComplete(false)
      return
    }

    try {
      const completedDayNumber = currentDayData.dayNumber
      const wasViewingCurrentDay = completedDayNumber === userDoc?.progress?.currentDay
      const progress = userDoc?.progress || { currentDay: 1, completedDays: [], lastReadDate: null }
      const priorShown = progress.shownMilestones
      const newProgress = await markDayComplete(user.uid, completedDayNumber, progress, userDoc?.settings, completedAt)
      completionCommitted = true
      setPendingCompletions(removePendingCompletion(user.uid, completedDayNumber))

      // Reflect the committed write immediately. Any later refresh failure must
      // not leave a successfully completed reading looking unfinished.
      const completedDayData = { ...currentDayData, completed: true, pendingCompletion: false }
      setCurrentDayData(completedDayData)
      setCompletedDays(previous => previous.some(day => day.dayNumber === completedDayNumber)
        ? previous
        : [...previous, completedDayData])

      // Detect any newly-earned milestones and surface celebrations / toasts.
      const metrics = computeMetrics({ settings: userDoc?.settings, progress: newProgress })
      const { rewards, shownMilestones } = detectRewards(metrics, priorShown)
      if (rewards.length > 0) {
        const major = rewards.filter(r => r.tier === 'major')
        const minor = rewards.filter(r => r.tier === 'minor')
        if (major.length) setCelebrationQueue(prev => [...prev, ...major])
        if (minor.length) setToasts(prev => [...prev, ...minor])
        try {
          await updateShownMilestones(user.uid, shownMilestones)
        } catch (mErr) {
          console.error('Error saving milestones:', mErr)
        }
      }

      await refreshUserDoc()

      let dashboardDayData
      if (wasViewingCurrentDay) {
        // Keep the normal flow moving when today's reading is marked complete.
        const nextDayData = await getReadingPlanDay(user.uid, completedDayNumber + 1)
        dashboardDayData = nextDayData
        setCurrentDayData(nextDayData)
        setViewingDayNumber(completedDayNumber + 1)
        scrollToReadingSection()
      } else {
        // If the user marks a day out of order, stay on that day and show it as complete.
        dashboardDayData = { ...currentDayData, completed: true }
        setCurrentDayData(dashboardDayData)
      }

      // Refresh completed days
      const completed = await getCompletedDays(user.uid)
      setCompletedDays(completed)
      setCachedDashboard(user.uid, {
        currentDayData: dashboardDayData,
        viewingDayNumber: wasViewingCurrentDay ? completedDayNumber + 1 : viewingDayNumber,
        completedDays: completed
      })
    } catch (err) {
      console.error('Error marking complete:', err)
      const errorCode = String(err?.code || '')
      recordClientDiagnostic(user.uid, err, {
        operation: completionCommitted ? 'refresh_after_mark_complete' : 'mark_complete',
        dayNumber: currentDayData.dayNumber
      })
      if (completionCommitted) {
        setMarkCompleteError('Your reading was marked complete, but the dashboard could not fully refresh. Try again to sync it.')
      } else if (!navigator.onLine || [
        'unavailable',
        'deadline-exceeded',
        'aborted',
        'cancelled',
        'internal',
        'resource-exhausted',
        'unknown'
      ].some(code => errorCode.includes(code))) {
        saveCompletionForLater(currentDayData.dayNumber, completedAt, err)
      } else if (errorCode.includes('permission-denied') || errorCode.includes('unauthenticated')) {
        setMarkCompleteError('We could not verify your session. Check your connection, then try again.')
      } else {
        setMarkCompleteError('This reading was not marked complete. Please try again.')
      }
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
      clearPendingCompletions(user.uid)
      setPendingCompletions([])
      await refreshUserDoc()
      navigate('/onboarding')
    } catch (err) {
      console.error('Error resetting plan:', err)
    } finally {
      setResetting(false)
      setShowResetConfirm(false)
    }
  }

  const handleSaveMigrationBibleVersion = async () => {
    setSavingMigration(true)
    setMigrationError(null)
    try {
      await updateBibleVersion(user.uid, migrationBibleVersion)
      await refreshUserDoc()
    } catch (err) {
      console.error('Error updating Bible version:', err)
      setMigrationError('Could not update your Bible version. Please try again.')
    } finally {
      setSavingMigration(false)
    }
  }

  const dismissCelebration = () => setCelebrationQueue(prev => prev.slice(1))
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  if (loading && !currentDayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const displayMetrics = userDoc?.settings ? computeMetrics(userDoc) : null
  const longestStreak = userDoc?.progress?.longestStreak || 0
  const isViewingCurrentDay = viewingDayNumber === userDoc?.progress?.currentDay
  const isViewingCompletedDay = completedDays.some(d => d.dayNumber === viewingDayNumber)
  const isViewingPendingDay = pendingCompletions.some(entry => entry.dayNumber === viewingDayNumber)
  const canMarkComplete = !!currentDayData && !isViewingCompletedDay && !isViewingPendingDay
  const needsBibleVersionMigration = userDoc?.settings?.bibleVersion === 'CPDV'
  const migrationVersionOptions = Object.entries(BIBLE_VERSIONS).map(([key, version]) => ({
    value: key,
    label: `${version.name} (${version.abbreviation})${version.source === 'api' ? ' - API' : ''}`
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Reward toasts (smaller milestones) */}
      <RewardToastStack toasts={toasts} onDone={removeToast} />

      {/* Full-screen celebration (major milestones, shown one at a time) */}
      {celebrationQueue.length > 0 && (
        <Suspense fallback={null}>
          <CelebrationOverlay reward={celebrationQueue[0]} onDismiss={dismissCelebration} />
        </Suspense>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 leading-tight">
            <span className="block text-center">
              <span className="block">Your Bible</span>
              <span className="block">Reading Plan</span>
            </span>

            {/* Logo mark + wordmark */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Bible icon */}
              <svg
                className="w-8 h-8 text-primary-600 dark:text-primary-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Simple book icon */}
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5z" />
              </svg>

              {/* Compact wordmark */}
              <span className="text-[10px] leading-[1.05] font-serif font-semibold text-primary-700 dark:text-primary-300 select-none">
                <span className="block">Bible</span>
                <span className="block">Planner</span>
                <span className="block">App.com</span>
              </span>
            </div>
          </h1>
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
        {(!isOnline || pendingCompletions.length > 0 || completionSyncState === 'syncing' || completionSyncState === 'synced') && (
          <div
            role="status"
            className={`rounded-lg border p-3 text-sm ${completionSyncState === 'synced' && pendingCompletions.length === 0
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200'
              : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p>
                {!isOnline
                  ? pendingCompletions.length > 0
                    ? `${pendingCompletions.length} reading ${pendingCompletions.length === 1 ? 'is' : 'are'} saved on this device and will sync when you reconnect.`
                    : 'You are offline. If you finish a reading, it will be saved on this device and synced later.'
                  : completionSyncState === 'syncing'
                    ? `Syncing ${pendingCompletions.length} saved ${pendingCompletions.length === 1 ? 'reading' : 'readings'}…`
                    : pendingCompletions.length > 0
                      ? `${pendingCompletions.length} saved ${pendingCompletions.length === 1 ? 'reading needs' : 'readings need'} to sync.`
                      : 'All saved readings are synced.'}
              </p>
              {isOnline && pendingCompletions.length > 0 && completionSyncState !== 'syncing' && (
                <button
                  type="button"
                  onClick={syncPendingCompletions}
                  className="shrink-0 font-semibold underline underline-offset-2"
                >
                  Sync now
                </button>
              )}
            </div>
          </div>
        )}

        {/* Calendar (toggleable) */}
        {showCalendar && (
          <Suspense fallback={<div className="card"><div className="animate-spin h-6 w-6 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>}>
            <Calendar userDoc={userDoc} completedDaysData={completedDays} />
          </Suspense>
        )}

        {/* Reading streak */}
        {displayMetrics && (
          <StreakCard currentStreak={displayMetrics.streak} longestStreak={longestStreak} />
        )}

        {/* Progress tracker */}
        <ProgressTracker userDoc={userDoc} />

        {/* Removed Bible version migration */}
        {needsBibleVersionMigration && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
            <div className="font-semibold">Choose a new Bible version</div>
            <p className="mt-1">
              Catholic Public Domain Version is no longer available through the current Bible API key. Your reading plan and progress are safe; only the translation needs to be updated.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <select
                value={migrationBibleVersion}
                onChange={(e) => setMigrationBibleVersion(e.target.value)}
                className="input bg-white dark:bg-gray-800"
                aria-label="Choose replacement Bible version"
              >
                {migrationVersionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSaveMigrationBibleVersion}
                disabled={savingMigration}
                className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {savingMigration ? 'Saving...' : 'Save'}
              </button>
            </div>
            {migrationError && (
              <p className="mt-2 text-red-700 dark:text-red-300">{migrationError}</p>
            )}
          </div>
        )}

        {/* Day navigation */}
        <div ref={readingSectionRef} className="scroll-mt-24 flex items-center justify-between">
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
          bibleVersion={userDoc?.settings?.bibleVersion || 'WEB'}
          onMarkComplete={canMarkComplete ? handleMarkComplete : null}
          loading={markingComplete}
        />

        {markCompleteError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30"
          >
            <p className="text-sm text-red-700 dark:text-red-300">{markCompleteError}</p>
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className="mt-2 text-sm font-semibold text-primary-700 hover:text-primary-800 disabled:opacity-50 dark:text-primary-300 dark:hover:text-primary-200"
            >
              Try again
            </button>
          </div>
        )}

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
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
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

          <div className="flex flex-col items-center justify-center gap-2 text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Website created and maintained by{' '}
              <a
                href="https://www.easternshore.ai"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Eastern Shore AI, LLC
              </a>
            </p>
            <Link
              to="/privacy"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
