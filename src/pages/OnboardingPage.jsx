import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { RadioGroup } from '../components/ui/RadioGroup'
import { Select } from '../components/ui/Select'
import { Toggle } from '../components/ui/Toggle'
import { generateReadingPlan } from '../services/readingPlanGenerator'
import { updateUserSettings, saveReadingPlan, Timestamp } from '../services/firebase'
import { BIBLE_VERSIONS } from '../utils/bibleStructure'
import { getTomorrow, formatDate } from '../utils/dateHelpers'

const STEPS = [
  { id: 'start-date', title: 'When do you want to start?' },
  { id: 'duration', title: 'Reading timeline' },
  { id: 'version', title: 'Bible version' },
  { id: 'weekends', title: 'Include weekends?' },
  { id: 'confirm', title: 'Review your plan' }
]

export function OnboardingPage() {
  const { user, refreshUserDoc } = useAuth()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [startDate, setStartDate] = useState(
    getTomorrow().toISOString().split('T')[0]
  )
  const [durationMonths, setDurationMonths] = useState('12')
  const [customMonths, setCustomMonths] = useState('')
  const [bibleVersion, setBibleVersion] = useState('KJV')
  const [includeWeekends, setIncludeWeekends] = useState(true)

  // Calculate months until end of year from start date
  const getMonthsUntilEndOfYear = () => {
    const start = new Date(startDate)
    const endOfYear = new Date(start.getFullYear(), 11, 31)
    const diffMonths = (endOfYear.getFullYear() - start.getFullYear()) * 12 +
                       (endOfYear.getMonth() - start.getMonth())
    return Math.max(1, diffMonths)
  }

  // Get the actual duration value to use
  const getActualDuration = () => {
    if (durationMonths === 'end-of-year') {
      return getMonthsUntilEndOfYear()
    }
    if (durationMonths === 'custom') {
      return parseInt(customMonths) || 12
    }
    return parseInt(durationMonths)
  }

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Parse as local time by appending T00:00:00 (without 'Z')
    const selected = new Date(selectedDate + 'T00:00:00')

    if (selected < today) {
      setError('Please select today or a future date')
      return
    }
    setError(null)
    setStartDate(selectedDate)
  }

  const handleNext = () => {
    // Validate start date on step 0
    if (currentStep === 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // Parse as local time by appending T00:00:00 (without 'Z')
      const selected = new Date(startDate + 'T00:00:00')
      if (selected < today) {
        setError('Please select today or a future date')
        return
      }
    }
    // Validate custom duration if selected
    if (currentStep === 1 && durationMonths === 'custom') {
      const months = parseInt(customMonths)
      if (!months || months < 1 || months > 120) {
        setError('Please enter a valid number of months (1-120)')
        return
      }
    }
    setError(null)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const actualDuration = getActualDuration()
      const settings = {
        startDate: Timestamp.fromDate(new Date(startDate)),
        durationMonths: actualDuration,
        bibleVersion,
        includeWeekends,
        emailDailyPortion: false
      }

      // Generate the reading plan
      const plan = generateReadingPlan({
        startDate: new Date(startDate),
        durationMonths: actualDuration,
        includeWeekends
      })

      // Save settings and plan to Firestore
      await updateUserSettings(user.uid, settings)
      await saveReadingPlan(user.uid, plan)

      // Refresh user doc to get updated onboardingComplete status
      await refreshUserDoc()

      navigate('/dashboard')
    } catch (err) {
      console.error('Error saving plan:', err)
      setError('Failed to create your reading plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const monthsUntilEndOfYear = getMonthsUntilEndOfYear()
  const chaptersPerDayEndOfYear = Math.ceil(1189 / (monthsUntilEndOfYear * 30))

  const durationOptions = [
    { value: '6', label: '6 months', description: 'About 6-7 chapters per day' },
    { value: '12', label: '12 months', description: 'About 3-4 chapters per day' },
    { value: '18', label: '18 months', description: 'About 2-3 chapters per day' },
    { value: '24', label: '24 months', description: 'About 1-2 chapters per day' },
    { value: 'end-of-year', label: `Finish by end of year`, description: `${monthsUntilEndOfYear} months - about ${chaptersPerDayEndOfYear} chapters per day` },
    { value: 'custom', label: 'Custom duration', description: 'Choose your own timeline' }
  ]

  const versionOptions = Object.entries(BIBLE_VERSIONS).map(([key, v]) => ({
    value: key,
    label: `${v.name} (${v.abbreviation})`
  }))

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 min-h-[300px]">
            <p className="text-gray-600 dark:text-gray-400">
              Choose when you'd like to begin your reading journey.
            </p>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={new Date().toISOString().split('T')[0]}
              required
              error={currentStep === 0 && error ? error : undefined}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              How long would you like to take to read through the Bible?
            </p>
            <RadioGroup
              name="duration"
              value={durationMonths}
              onChange={setDurationMonths}
              options={durationOptions}
            />
            {durationMonths === 'custom' && (
              <div className="mt-4 pl-4 border-l-2 border-primary-500">
                <Input
                  label="Number of months"
                  type="number"
                  value={customMonths}
                  onChange={(e) => setCustomMonths(e.target.value)}
                  placeholder="Enter number of months"
                  min="1"
                  max="120"
                  required
                />
                {customMonths && parseInt(customMonths) > 0 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    About {Math.ceil(1189 / (parseInt(customMonths) * 30))} chapters per day
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Which Bible translation would you prefer?
            </p>
            <Select
              label="Bible Version"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              options={versionOptions}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All versions shown are freely available through API.Bible.
            </p>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Would you like reading assignments on Saturdays and Sundays?
            </p>
            <Toggle
              label="Include weekends"
              description={
                includeWeekends
                  ? "You'll have readings 7 days a week"
                  : "You'll only have readings Monday through Friday"
              }
              checked={includeWeekends}
              onChange={setIncludeWeekends}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Here's a summary of your reading plan:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(new Date(startDate))}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <span className="font-medium text-gray-900 dark:text-white">{getActualDuration()} months</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Bible Version</span>
                <span className="font-medium text-gray-900 dark:text-white">{BIBLE_VERSIONS[bibleVersion].name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Reading Days</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {includeWeekends ? 'Every day' : 'Weekdays only'}
                </span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 overflow-visible">
      <div className="max-w-md mx-auto overflow-visible">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 flex-1 mx-0.5 rounded-full ${
                  index <= currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Step {currentStep + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step content */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{STEPS[currentStep].title}</h2>
          {renderStep()}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} className="flex-1">
              Start My Plan
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
