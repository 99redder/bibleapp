import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Toggle } from '../ui/Toggle'
import { useDialogBehavior } from '../../hooks/useDialogBehavior'
import { applyPlanChanges, getAllPlanDays, updateBibleVersion, Timestamp } from '../../services/firebase'
import { getPendingCompletions } from '../../services/completionQueue'
import { formatPassageDescription } from '../../services/readingPlanGenerator'
import { buildReschedule, getScheduleStartDate, hasReadToday, readingDaysForTimeframe } from '../../services/planReschedule'
import { BIBLE_VERSIONS } from '../../utils/bibleStructure'
import { formatDate, getToday, isToday, timestampToDate } from '../../utils/dateHelpers'
import { computeMetrics } from '../../utils/progressMetrics'
import { achievedMilestones, mergeShown } from '../../utils/rewards'

const TESTAMENT_OPTIONS = [
  { value: 'BOTH', label: 'Full Bible (Old and New Testament)' },
  { value: 'OT', label: 'Old Testament only' },
  { value: 'NT', label: 'New Testament only' }
]

const MONTH_CHOICES = [3, 6, 9, 12, 18, 24]
const EXTEND_CHOICES = [
  { months: 3, label: '3 months' },
  { months: 6, label: '6 months' },
  { months: 12, label: '1 year' },
  { months: 24, label: '2 years' },
  { months: 36, label: '3 years' }
]
const HEAVY_PACE_CHAPTERS = 10

const plural = (count, word) => `${count.toLocaleString()} ${word}${count === 1 ? '' : 's'}`
const compactDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function addMonths(date, months) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

// "Live switch": change translation, timeframe, weekends, or testament mid-plan.
// Completed readings, streaks, and calendar history are kept; only unread
// chapters are re-spread over the new schedule, starting on track.
export function ChangePlanDialog({ uid, userDoc, onClose, onSaved, loadPlanDays = getAllPlanDays }) {
  const settings = userDoc.settings
  const today = useMemo(() => getToday(), [])
  const closeButtonRef = useRef(null)
  useDialogBehavior(onClose, closeButtonRef)

  const [planDays, setPlanDays] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const currentTestament = settings.testament || 'BOTH'
  const currentWeekends = Boolean(settings.includeWeekends)
  const currentVersion = BIBLE_VERSIONS[settings.bibleVersion] ? settings.bibleVersion : 'WEB'

  const [bibleVersion, setBibleVersion] = useState(currentVersion)
  const [testament, setTestament] = useState(currentTestament)
  const [includeWeekends, setIncludeWeekends] = useState(currentWeekends)
  const [timeframe, setTimeframe] = useState('keep')
  const [customMonths, setCustomMonths] = useState('')

  const isOnline = navigator.onLine
  const hasPendingCompletions = getPendingCompletions(uid).length > 0

  useEffect(() => {
    let cancelled = false
    loadPlanDays(uid)
      .then(days => { if (!cancelled) setPlanDays(days) })
      .catch((err) => {
        console.error('Error loading plan:', err)
        if (!cancelled) setLoadError('Could not load your plan. Check your connection and try again.')
      })
    return () => { cancelled = true }
  }, [uid])

  const currentFinishDate = useMemo(() => {
    if (!planDays?.length) return null
    return planDays
      .map(day => timestampToDate(day.scheduledDate))
      .reduce((latest, date) => (date > latest ? date : latest))
  }, [planDays])

  const startDate = useMemo(
    () => getScheduleStartDate(today, includeWeekends, planDays ? hasReadToday(planDays, today) : false),
    [today, includeWeekends, planDays]
  )

  const customMonthsValue = parseInt(customMonths, 10)
  const customInvalid = timeframe === 'custom' && !(customMonthsValue >= 1 && customMonthsValue <= 120)

  // "Add N months" extends the current finish date (or today, if that's already passed).
  const extendFrom = currentFinishDate && currentFinishDate > today ? currentFinishDate : today

  const timeframeSpec = useMemo(() => {
    if (timeframe === 'keep') return { type: 'keep', finishDate: currentFinishDate }
    if (timeframe.startsWith('extend-')) {
      return { type: 'until', date: addMonths(extendFrom, Number(timeframe.slice('extend-'.length))) }
    }
    if (timeframe === 'end-of-year') return { type: 'until', date: new Date(today.getFullYear(), 11, 31) }
    if (timeframe === 'custom') return { type: 'months', months: customMonthsValue || 0 }
    return { type: 'months', months: Number(timeframe) }
  }, [timeframe, currentFinishDate, extendFrom, today, customMonthsValue])

  const versionChanged = bibleVersion !== currentVersion
  const scheduleChanged = timeframe !== 'keep' || testament !== currentTestament || includeWeekends !== currentWeekends

  const preview = useMemo(() => {
    if (!planDays || !scheduleChanged || customInvalid) return null
    return buildReschedule({
      planDays,
      testament,
      includeWeekends,
      readingDays: readingDaysForTimeframe(timeframeSpec, startDate, includeWeekends),
      startDate
    })
  }, [planDays, scheduleChanged, customInvalid, testament, includeWeekends, timeframeSpec, startDate])

  const nothingLeft = preview && preview.remainingChapterCount === 0
  const blockedReason = !isOnline
    ? "You're offline. Connect to the internet to change your plan."
    : scheduleChanged && hasPendingCompletions
      ? 'Some recent readings are still syncing. Try again in a moment so none of your progress is missed.'
      : null

  const canSave = !saving && !blockedReason && !customInvalid && !nothingLeft &&
    (scheduleChanged ? !!preview : versionChanged)

  const timeframeGroups = [
    {
      label: 'Keep or add time',
      options: [
        {
          value: 'keep',
          label: currentFinishDate ? `Keep my finish date (${compactDate(currentFinishDate)})` : 'Keep my current finish date'
        },
        ...EXTEND_CHOICES.map(({ months, label }) => ({
          value: `extend-${months}`,
          label: `Add ${label} (finish ${compactDate(addMonths(extendFrom, months))})`
        }))
      ]
    },
    {
      label: 'Set a new timeframe from today',
      options: [
        ...MONTH_CHOICES.map(months => ({ value: String(months), label: `Finish in ${months} months from today` })),
        { value: 'end-of-year', label: `Finish by the end of ${today.getFullYear()}` },
        { value: 'custom', label: 'Custom number of months' }
      ]
    }
  ]

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)

    try {
      if (preview) {
        const historyCount = preview.history.length
        const completedDays = preview.history.map(day => day.dayNumber)
        const newSettings = {
          bibleVersion,
          testament,
          includeWeekends,
          totalDays: preview.totalDays,
          paceAnchor: {
            date: Timestamp.fromDate(startDate),
            dayNumber: historyCount + 1,
            dayCount: preview.newDays.length,
            spanDays: preview.spanDays
          }
        }
        const progress = userDoc.progress || {}

        // A shorter plan can jump the completion % past a milestone; mark those
        // as already shown so a plan change doesn't fire a surprise celebration.
        const nextMetrics = computeMetrics({
          settings: { ...settings, ...newSettings },
          progress: { ...progress, currentDay: historyCount + 1, completedDays }
        }, today)
        const shownMilestones = mergeShown(progress.shownMilestones, achievedMilestones(nextMetrics))

        await applyPlanChanges(uid, {
          days: preview.days,
          staleDayNumbers: planDays.map(day => day.dayNumber).filter(dayNumber => dayNumber > preview.totalDays),
          settings: newSettings,
          progress: { currentDay: historyCount + 1, completedDays, shownMilestones }
        })
      } else if (versionChanged) {
        await updateBibleVersion(uid, bibleVersion)
      }

      await onSaved()
    } catch (err) {
      console.error('Error changing plan:', err)
      setSaveError('Could not update your plan. Nothing was changed — please try again.')
      setSaving(false)
    }
  }

  const isSpaced = preview && preview.spanDays > preview.readingDays
  const chaptersPerWeek = isSpaced
    ? Math.max(1, Math.round((preview.readingDays / preview.spanDays) * (includeWeekends ? 7 : 5)))
    : 0
  const paceLabel = preview && (
    isSpaced
      ? `About ${plural(chaptersPerWeek, 'chapter')} a week`
      : preview.chaptersPerDay.min === preview.chaptersPerDay.max
        ? `${plural(preview.chaptersPerDay.max, 'chapter')} a day`
        : `${preview.chaptersPerDay.min}–${preview.chaptersPerDay.max} chapters a day`
  )
  const firstNewDay = preview?.newDays[0]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-plan-title"
        className="relative max-h-[92vh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-white px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl animate-[sheetUp_0.25s_ease-out] dark:bg-gray-800 sm:max-w-lg sm:rounded-2xl sm:pb-5"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="change-plan-title" className="text-lg font-semibold text-gray-900 dark:text-white">Change your plan</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your completed readings, streak, and calendar stay just as they are.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loadError ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{loadError}</p>
        ) : !planDays ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-5">
            <Select
              label="Bible translation"
              name="change-bible-version"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              options={Object.entries(BIBLE_VERSIONS).map(([key, version]) => ({
                value: key,
                label: `${version.name} (${version.abbreviation})`
              }))}
            />

            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="change-timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timeframe
                </label>
                <select
                  id="change-timeframe"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="input bg-white dark:bg-gray-800"
                >
                  {timeframeGroups.map(group => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {timeframe === 'custom' && (
                <Input
                  label="Months from today"
                  type="number"
                  value={customMonths}
                  onChange={(e) => setCustomMonths(e.target.value)}
                  placeholder="e.g. 15"
                  min="1"
                  max="120"
                  error={customMonths && customInvalid ? 'Enter a number from 1 to 120' : undefined}
                />
              )}
            </div>

            <Select
              label="What to read"
              name="change-testament"
              value={testament}
              onChange={(e) => setTestament(e.target.value)}
              options={TESTAMENT_OPTIONS}
            />

            <Toggle
              label="Include weekends"
              description={includeWeekends ? 'Readings 7 days a week' : 'Readings Monday through Friday'}
              checked={includeWeekends}
              onChange={setIncludeWeekends}
            />

            {/* Live preview of the result */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/40">
              {!scheduleChanged && !versionChanged && (
                <p className="text-gray-600 dark:text-gray-400">Choose what you'd like to change above.</p>
              )}

              {!scheduleChanged && versionChanged && (
                <div className="flex gap-2 text-gray-700 dark:text-gray-300">
                  <CheckIcon />
                  <p>Only your translation changes. You'll keep reading right where you left off, in the {BIBLE_VERSIONS[bibleVersion].name}.</p>
                </div>
              )}

              {scheduleChanged && customInvalid && (
                <p className="text-gray-600 dark:text-gray-400">Enter how many months you'd like to take.</p>
              )}

              {nothingLeft && (
                <p className="text-gray-700 dark:text-gray-300">
                  You've already read every chapter in this selection — there's nothing left to schedule.
                </p>
              )}

              {preview && !nothingLeft && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Your new schedule</p>
                  <dl className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Chapters left</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{preview.remainingChapterCount.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Daily reading</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{paceLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Reading days</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{preview.readingDays.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Finish by</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{formatDate(preview.finishDate)}</dd>
                    </div>
                  </dl>
                  {firstNewDay && (
                    <p className="text-gray-700 dark:text-gray-300">
                      Next reading ({isToday(firstNewDay.scheduledDate) ? 'today' : formatDate(firstNewDay.scheduledDate)}):{' '}
                      <span className="font-medium">{formatPassageDescription(firstNewDay.passages)}</span>
                    </p>
                  )}
                  {preview.chaptersPerDay.max > HEAVY_PACE_CHAPTERS && (
                    <p className="rounded-lg bg-amber-50 p-2 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      That's a heavy daily pace. A longer timeframe would make each day lighter.
                    </p>
                  )}
                  <ul className="space-y-1.5 border-t border-gray-200 pt-3 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                    <li className="flex gap-2"><CheckIcon />Your {plural(preview.history.length, 'completed reading')}, streak, and calendar are kept</li>
                    <li className="flex gap-2"><CheckIcon />Your pace resets, so you start the new schedule on track</li>
                  </ul>
                </div>
              )}
            </div>

            {blockedReason && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">{blockedReason}</p>
            )}
            {saveError && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{saveError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <div className="flex-1">
                <Button onClick={handleSave} loading={saving} disabled={!canSave} fullWidth>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
