import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { RadioGroup } from '../components/ui/RadioGroup'
import { Select } from '../components/ui/Select'
import { Toggle } from '../components/ui/Toggle'
import { generateReadingPlan } from '../services/readingPlanGenerator'
import { updateUserSettings, saveReadingPlan, Timestamp } from '../services/firebase'
import { BIBLE_VERSIONS, DEFAULT_VERSION_BY_LANGUAGE, getTestamentChapterCount, getVersionsForLanguage } from '../utils/bibleStructure'
import { getTomorrow, formatDate, toCivilDateKey } from '../utils/dateHelpers'
import { countVerses } from '../services/planReschedule'
import { createT } from '../i18n'

// Fun facts are English-only, so Spanish readers skip that step.
const STEPS = ['language', 'start-date', 'duration', 'testament', 'version', 'weekends', 'trivia', 'confirm']
const STEP_TITLES = {
  language: 'onboarding.language.title',
  'start-date': 'onboarding.startDate.title',
  duration: 'onboarding.duration.title',
  testament: 'onboarding.testament.title',
  version: 'onboarding.version.title',
  weekends: 'onboarding.weekends.title',
  confirm: 'onboarding.confirm.title'
}

// Each language is offered in its own words.
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', description: 'Read the app and the Bible in English' },
  { value: 'es', label: 'Español', description: 'Lea la aplicación y la Biblia en español' }
]
const LANGUAGE_NAMES = { en: 'English', es: 'Español' }

export function OnboardingPage() {
  const { user, refreshUserDoc } = useAuth()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [language, setLanguage] = useState('en')
  // YYYY-MM-DD in the reader's own time zone (toISOString would give the UTC
  // date, a day off in the evening or east of UTC)
  const [startDate, setStartDate] = useState(() => toCivilDateKey(getTomorrow()))
  const [durationMonths, setDurationMonths] = useState('12')
  const [customMonths, setCustomMonths] = useState('')
  const [testament, setTestament] = useState('BOTH')
  const [bibleVersion, setBibleVersion] = useState(DEFAULT_VERSION_BY_LANGUAGE.en)
  const [includeWeekends, setIncludeWeekends] = useState(true)
  const [showTrivia, setShowTrivia] = useState(true)

  const t = useMemo(() => createT(language), [language])
  const steps = language === 'es' ? STEPS.filter(step => step !== 'trivia') : STEPS
  const stepId = steps[currentStep]

  // The chosen day at local midnight. new Date('YYYY-MM-DD') would be UTC
  // midnight, the evening before in the US, starting the plan a day early.
  const startDay = new Date(startDate + 'T00:00:00')

  const handleLanguageChange = (value) => {
    setLanguage(value)
    setBibleVersion(DEFAULT_VERSION_BY_LANGUAGE[value])
  }

  // Calculate months until end of year from start date
  const getMonthsUntilEndOfYear = () => {
    const endOfYear = new Date(startDay.getFullYear(), 11, 31)
    const diffMonths = (endOfYear.getFullYear() - startDay.getFullYear()) * 12 +
                       (endOfYear.getMonth() - startDay.getMonth())
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
      setError(t('onboarding.error.pastDate'))
      return
    }
    setError(null)
    setStartDate(selectedDate)
  }

  const handleNext = () => {
    // Validate start date
    if (stepId === 'start-date') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // Also catches a cleared date field (Invalid Date)
      if (!(startDay >= today)) {
        setError(t('onboarding.error.pastDate'))
        return
      }
    }
    // Validate custom duration if selected
    if (stepId === 'duration' && durationMonths === 'custom') {
      const months = parseInt(customMonths)
      if (!months || months < 1 || months > 120) {
        setError(t('onboarding.error.months'))
        return
      }
    }
    setError(null)
    if (currentStep < steps.length - 1) {
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
        startDate: Timestamp.fromDate(startDay),
        durationMonths: actualDuration,
        testament: testament,
        language,
        bibleVersion,
        includeWeekends,
        showTrivia: language === 'es' ? false : showTrivia,
        emailDailyPortion: false
      }

      // Generate the reading plan
      const plan = generateReadingPlan({
        startDate: startDay,
        durationMonths: actualDuration,
        testament: testament,
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
      setError(t('onboarding.error.save'))
    } finally {
      setLoading(false)
    }
  }

  const totalChapters = getTestamentChapterCount(testament)
  const monthsUntilEndOfYear = getMonthsUntilEndOfYear()
  const chaptersPerDayEndOfYear = Math.ceil(totalChapters / (monthsUntilEndOfYear * 30))

  // Readable pace for a timeframe; slower than a chapter a day, chapters are
  // split, so describe it in verses.
  const describePace = (months) => {
    const perDay = totalChapters / (months * 30)
    if (perDay >= 1) return t('onboarding.pace.chapters', { n: Math.ceil(perDay) })
    return t('onboarding.pace.verses', { n: Math.max(1, Math.round(countVerses(testament) / (months * 30))) })
  }

  const testamentOptions = [
    { value: 'BOTH', label: t('onboarding.testament.both'), description: t('onboarding.testament.bothDescription') },
    { value: 'OT', label: t('onboarding.testament.ot'), description: t('onboarding.testament.otDescription') },
    { value: 'NT', label: t('onboarding.testament.nt'), description: t('onboarding.testament.ntDescription') }
  ]

  const durationOptions = [
    ...[6, 12, 18, 24].map(months => ({
      value: String(months),
      label: t('onboarding.duration.months', { n: months }),
      description: describePace(months)
    })),
    { value: 'end-of-year', label: t('onboarding.duration.endOfYear'), description: t('onboarding.duration.endOfYearPace', { months: monthsUntilEndOfYear, perDay: chaptersPerDayEndOfYear }) },
    { value: 'custom', label: t('onboarding.duration.custom'), description: t('onboarding.duration.customDescription') }
  ]

  const versionOptions = getVersionsForLanguage(language).map(v => ({
    value: v.key,
    label: `${v.name} (${v.abbreviation})`,
    source: v.source || 'local',
    name: v.name,
    abbreviation: v.abbreviation
  }))

  const selectedBibleVersion = BIBLE_VERSIONS[bibleVersion] || BIBLE_VERSIONS.WEB

  const renderStep = () => {
    switch (stepId) {
      case 'language':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.language.intro')}
            </p>
            <RadioGroup
              name="language"
              value={language}
              onChange={handleLanguageChange}
              options={LANGUAGE_OPTIONS}
            />
          </div>
        )

      case 'start-date':
        return (
          <div className="space-y-4 min-h-[300px]">
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.startDate.intro')}
            </p>
            <Input
              label={t('onboarding.startDate.label')}
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={toCivilDateKey(new Date())}
              required
              error={error || undefined}
            />
          </div>
        )

      case 'duration':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.duration.intro')}
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
                  label={t('onboarding.duration.customLabel')}
                  type="number"
                  value={customMonths}
                  onChange={(e) => setCustomMonths(e.target.value)}
                  placeholder={t('onboarding.duration.customPlaceholder')}
                  min="1"
                  max="120"
                  required
                />
                {customMonths && parseInt(customMonths) > 0 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {describePace(parseInt(customMonths))}
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case 'testament':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.testament.intro')}
            </p>
            <RadioGroup
              name="testament"
              value={testament}
              onChange={setTestament}
              options={testamentOptions}
            />
          </div>
        )

      case 'version':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.version.intro')}
            </p>

            <Select
              label={t('onboarding.version.label')}
              name="bible-version"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              options={versionOptions}
              required
            />

            <div className="rounded-lg border border-gray-200 bg-blue-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-blue-900/20 dark:text-gray-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  {t('onboarding.version.bundled')}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedBibleVersion.name}
                </span>
              </div>
              <p className="mt-2">
                {t('onboarding.version.bundledNote')}
              </p>
            </div>
          </div>
        )

      case 'weekends':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.weekends.intro')}
            </p>
            <Toggle
              label={t('onboarding.weekends.label')}
              description={
                includeWeekends
                  ? t('onboarding.weekends.on')
                  : t('onboarding.weekends.off')
              }
              checked={includeWeekends}
              onChange={setIncludeWeekends}
            />
          </div>
        )

      // English only (Spanish readers skip this step)
      case 'trivia':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              As you read, we can point out short, optional fun facts about certain verses — songs,
              films, art, and history they've inspired. They never interrupt your reading; just tap
              the ✨ when you're curious.
            </p>
            <Toggle
              label="Show fun facts"
              description={
                showTrivia
                  ? "You'll see a ✨ next to verses that have a fun fact"
                  : 'Fun facts stay hidden — you can turn them on later in settings'
              }
              checked={showTrivia}
              onChange={setShowTrivia}
            />
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-500/20 dark:bg-amber-500/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                For example
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                Ecclesiastes 3:1–8 became the lyrics of “Turn! Turn! Turn!” — a No. 1 hit for The Byrds in 1965.
              </p>
            </div>
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('onboarding.confirm.intro')}
            </p>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.language')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{LANGUAGE_NAMES[language]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.startDate')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(startDay, language)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.duration')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{t('onboarding.confirm.months', { n: getActualDuration() })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.plan')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {testament === 'BOTH' ? t('onboarding.confirm.both') : testament === 'OT' ? t('onboarding.confirm.ot') : t('onboarding.confirm.nt')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.version')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedBibleVersion.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.days')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {includeWeekends ? t('onboarding.confirm.everyDay') : t('onboarding.confirm.weekdays')}
                </span>
              </div>
              {language !== 'es' && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">{t('onboarding.confirm.funFacts')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {showTrivia ? t('common.on') : t('common.off')}
                  </span>
                </div>
              )}
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
            {steps.map((step, index) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-0.5 rounded-full ${
                  index <= currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {t('onboarding.step', { n: currentStep + 1, total: steps.length })}
          </p>
        </div>

        {/* Step content */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {stepId === 'trivia' ? 'Fun facts along the way?' : t(STEP_TITLES[stepId])}
          </h2>
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
              {t('common.back')}
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="flex-1">
              {t('common.next')}
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} className="flex-1">
              {t('onboarding.startPlan')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
