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
import { BIBLE_VERSIONS, DEFAULT_VERSION_BY_LANGUAGE, getVersionsForLanguage } from '../../utils/bibleStructure'
import { dateLocale, formatDate, getToday, isToday, timestampToDate } from '../../utils/dateHelpers'
import { computeMetrics } from '../../utils/progressMetrics'
import { achievedMilestones, mergeShown } from '../../utils/rewards'
import { createT, getLanguage } from '../../i18n/translate'

const TESTAMENTS = [
  { value: 'BOTH', key: 'changePlan.testament.both' },
  { value: 'OT', key: 'changePlan.testament.ot' },
  { value: 'NT', key: 'changePlan.testament.nt' }
]

const MONTH_CHOICES = [3, 6, 9, 12, 18, 24]
const EXTEND_MONTHS = [3, 6, 12, 24, 36]
const HEAVY_PACE_CHAPTERS = 10

const compactDate = (date, language) => date.toLocaleDateString(dateLocale(language), { month: 'short', day: 'numeric', year: 'numeric' })

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
  // Readers only ever see translations in the language they chose.
  const language = getLanguage(settings)
  const t = useMemo(() => createT(language), [language])
  const today = useMemo(() => getToday(), [])
  const closeButtonRef = useRef(null)
  useDialogBehavior(onClose, closeButtonRef)

  const [planDays, setPlanDays] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const currentTestament = settings.testament || 'BOTH'
  const currentWeekends = Boolean(settings.includeWeekends)
  const currentVersion = BIBLE_VERSIONS[settings.bibleVersion] ? settings.bibleVersion : DEFAULT_VERSION_BY_LANGUAGE[language]

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
        if (!cancelled) setLoadError(t('changePlan.loadFailed'))
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
    ? t('changePlan.offline')
    : scheduleChanged && hasPendingCompletions
      ? t('changePlan.syncing')
      : null

  const canSave = !saving && !blockedReason && !customInvalid && !nothingLeft &&
    (scheduleChanged ? !!preview : versionChanged)

  const timeframeGroups = [
    {
      label: t('changePlan.group.keep'),
      options: [
        {
          value: 'keep',
          label: currentFinishDate
            ? t('changePlan.keepDate', { date: compactDate(currentFinishDate, language) })
            : t('changePlan.keepCurrent')
        },
        ...EXTEND_MONTHS.map(months => ({
          value: `extend-${months}`,
          label: t('changePlan.add', { months, date: compactDate(addMonths(extendFrom, months), language) })
        }))
      ]
    },
    {
      label: t('changePlan.group.new'),
      options: [
        ...MONTH_CHOICES.map(months => ({ value: String(months), label: t('changePlan.finishIn', { n: months }) })),
        { value: 'end-of-year', label: t('changePlan.endOfYear', { year: today.getFullYear() }) },
        { value: 'custom', label: t('changePlan.custom') }
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
          paceAnchor: { date: Timestamp.fromDate(startDate), dayNumber: historyCount + 1 }
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
      setSaveError(t('changePlan.saveFailed'))
      setSaving(false)
    }
  }

  const paceLabel = preview && (
    preview.isSplit
      ? t('changePlan.pace.verses', { n: preview.versesPerDay })
      : preview.chaptersPerDay.min === preview.chaptersPerDay.max
        ? t('changePlan.pace.chapters', { n: preview.chaptersPerDay.max })
        : t('changePlan.pace.chapterRange', preview.chaptersPerDay)
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
            <h2 id="change-plan-title" className="text-lg font-semibold text-gray-900 dark:text-white">{t('changePlan.title')}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('changePlan.subtitle')}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
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
              label={t('changePlan.translation')}
              name="change-bible-version"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              options={getVersionsForLanguage(language).map(version => ({
                value: version.key,
                label: `${version.name} (${version.abbreviation})`
              }))}
            />

            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="change-timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('changePlan.timeframe')}
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
                  label={t('changePlan.monthsFromToday')}
                  type="number"
                  value={customMonths}
                  onChange={(e) => setCustomMonths(e.target.value)}
                  placeholder={t('changePlan.monthsPlaceholder')}
                  min="1"
                  max="120"
                  error={customMonths && customInvalid ? t('changePlan.monthsError') : undefined}
                />
              )}
            </div>

            <Select
              label={t('changePlan.whatToRead')}
              name="change-testament"
              value={testament}
              onChange={(e) => setTestament(e.target.value)}
              options={TESTAMENTS.map(({ value, key }) => ({ value, label: t(key) }))}
            />

            <Toggle
              label={t('changePlan.weekends')}
              description={includeWeekends ? t('changePlan.weekendsOn') : t('changePlan.weekendsOff')}
              checked={includeWeekends}
              onChange={setIncludeWeekends}
            />

            {/* Live preview of the result */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/40">
              {!scheduleChanged && !versionChanged && (
                <p className="text-gray-600 dark:text-gray-400">{t('changePlan.chooseAbove')}</p>
              )}

              {!scheduleChanged && versionChanged && (
                <div className="flex gap-2 text-gray-700 dark:text-gray-300">
                  <CheckIcon />
                  <p>{t('changePlan.onlyTranslation', { name: BIBLE_VERSIONS[bibleVersion].name })}</p>
                </div>
              )}

              {scheduleChanged && customInvalid && (
                <p className="text-gray-600 dark:text-gray-400">{t('changePlan.enterMonths')}</p>
              )}

              {nothingLeft && (
                <p className="text-gray-700 dark:text-gray-300">
                  {t('changePlan.nothingLeft')}
                </p>
              )}

              {preview && !nothingLeft && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('changePlan.newSchedule')}</p>
                  <dl className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">{t('changePlan.chaptersLeft')}</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{preview.remainingChapterCount.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">{t('changePlan.dailyReading')}</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{paceLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">{t('changePlan.readingDays')}</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{preview.readingDays.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">{t('changePlan.finishBy')}</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{formatDate(preview.finishDate, language)}</dd>
                    </div>
                  </dl>
                  {firstNewDay && (
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('changePlan.nextReading', {
                        when: isToday(firstNewDay.scheduledDate) ? t('changePlan.today') : formatDate(firstNewDay.scheduledDate, language)
                      })}{' '}
                      <span className="font-medium">{formatPassageDescription(firstNewDay.passages, language)}</span>
                    </p>
                  )}
                  {preview.chaptersPerDay.max > HEAVY_PACE_CHAPTERS && (
                    <p className="rounded-lg bg-amber-50 p-2 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      {t('changePlan.heavy')}
                    </p>
                  )}
                  <ul className="space-y-1.5 border-t border-gray-200 pt-3 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                    <li className="flex gap-2"><CheckIcon />{t('changePlan.kept', { n: preview.history.length })}</li>
                    <li className="flex gap-2"><CheckIcon />{t('changePlan.paceReset')}</li>
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
                {t('common.cancel')}
              </button>
              <div className="flex-1">
                <Button onClick={handleSave} loading={saving} disabled={!canSave} fullWidth>
                  {t('changePlan.save')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
