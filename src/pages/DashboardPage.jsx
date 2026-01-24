import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReadingCard } from '../components/dashboard/ReadingCard'
import { ProgressTracker } from '../components/dashboard/ProgressTracker'
import { Calendar } from '../components/dashboard/Calendar'
import { getReadingPlanDay, markDayComplete, getCompletedDays } from '../services/firebase'

export function DashboardPage() {
  const { user, userDoc, logout, refreshUserDoc } = useAuth()
  const navigate = useNavigate()

  const [currentDayData, setCurrentDayData] = useState(null)
  const [completedDays, setCompletedDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

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
      // Load current day's reading
      const dayData = await getReadingPlanDay(user.uid, userDoc.progress.currentDay)
      setCurrentDayData(dayData)

      // Load completed days for calendar
      const completed = await getCompletedDays(user.uid)
      setCompletedDays(completed)
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!currentDayData) return

    setMarkingComplete(true)
    try {
      await markDayComplete(user.uid, currentDayData.dayNumber, userDoc.progress)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Bible Reading</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`p-2 rounded-lg ${showCalendar ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              aria-label="Toggle calendar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Logout"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Calendar (toggleable) */}
        {showCalendar && (
          <Calendar userDoc={userDoc} completedDaysData={completedDays} />
        )}

        {/* Progress tracker */}
        <ProgressTracker userDoc={userDoc} />

        {/* Today's reading */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Today's Reading</h2>
          <ReadingCard
            dayData={currentDayData}
            bibleVersion={userDoc?.settings?.bibleVersion || 'KJV'}
            onMarkComplete={handleMarkComplete}
            loading={markingComplete}
          />
        </div>
      </main>
    </div>
  )
}
