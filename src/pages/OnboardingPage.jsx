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
  const [bibleVersion, setBibleVersion] = useState('KJV')
  const [includeWeekends, setIncludeWeekends] = useState(true)

  const handleNext = () => {
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
      const settings = {
        startDate: Timestamp.fromDate(new Date(startDate)),
        durationMonths: parseInt(durationMonths),
        bibleVersion,
        includeWeekends,
        emailDailyPortion: false
      }

      // Generate the reading plan
      const plan = generateReadingPlan({
        startDate: new Date(startDate),
        durationMonths: parseInt(durationMonths),
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

  const durationOptions = [
    { value: '6', label: '6 months', description: 'About 6-7 chapters per day' },
    { value: '12', label: '12 months', description: 'About 3-4 chapters per day' },
    { value: '18', label: '18 months', description: 'About 2-3 chapters per day' },
    { value: '24', label: '24 months', description: 'About 1-2 chapters per day' }
  ]

  const versionOptions = Object.entries(BIBLE_VERSIONS).map(([key, v]) => ({
    value: key,
    label: `${v.name} (${v.abbreviation})`
  }))

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Choose when you'd like to begin your reading journey.
            </p>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              How long would you like to take to read through the Bible?
            </p>
            <RadioGroup
              name="duration"
              value={durationMonths}
              onChange={setDurationMonths}
              options={durationOptions}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Which Bible translation would you prefer?
            </p>
            <Select
              label="Bible Version"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              options={versionOptions}
            />
            <p className="text-sm text-gray-500">
              All versions shown are freely available through API.Bible.
            </p>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
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
            <p className="text-gray-600 mb-6">
              Here's a summary of your reading plan:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">{formatDate(new Date(startDate))}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{durationMonths} months</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Bible Version</span>
                <span className="font-medium">{BIBLE_VERSIONS[bibleVersion].name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Reading Days</span>
                <span className="font-medium">
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 flex-1 mx-0.5 rounded-full ${
                  index <= currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Step {currentStep + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step content */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">{STEPS[currentStep].title}</h2>
          {renderStep()}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
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
