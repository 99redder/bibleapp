import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { fetchDayPassages, isAPIConfigured } from '../../services/bibleAPI'
import { formatPassageDescription } from '../../services/readingPlanGenerator'
import { formatDate, timestampToDate } from '../../utils/dateHelpers'

export function ReadingCard({ dayData, bibleVersion, onMarkComplete, loading: markingComplete }) {
  const [passages, setPassages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    if (dayData?.passages && isAPIConfigured()) {
      loadPassages()
    } else if (!isAPIConfigured()) {
      setError('Bible API not configured. Add VITE_BIBLE_API_KEY to your .env file.')
      setLoading(false)
    }
  }, [dayData, bibleVersion])

  const loadPassages = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchDayPassages(bibleVersion, dayData.passages)
      setPassages(data)
    } catch (err) {
      setError('Failed to load passage. Please check your internet connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!dayData) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center py-8">
          No reading assignment for today.
        </p>
      </div>
    )
  }

  const scheduledDate = timestampToDate(dayData.scheduledDate)
  const passageTitle = formatPassageDescription(dayData.passages)

  return (
    <div className="card">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">Day {dayData.dayNumber}</p>
          <h2 className="text-xl font-semibold text-gray-900">{passageTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {scheduledDate && formatDate(scheduledDate)}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="mb-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={loadPassages}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {passages.map((passage, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h3 className="font-medium text-gray-900 mb-2">{passage.reference}</h3>
                  <div className="scripture-text whitespace-pre-wrap">
                    {passage.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mark complete button */}
      {!dayData.completed && (
        <Button
          onClick={onMarkComplete}
          loading={markingComplete}
          fullWidth
        >
          Mark as Read
        </Button>
      )}

      {dayData.completed && (
        <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700 font-medium">Completed</span>
        </div>
      )}
    </div>
  )
}
