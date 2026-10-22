// Reward / milestone detection.
//
// We celebrate three kinds of milestones:
//   - completion percentage:  every 10% of the plan finished
//   - streak:                 reaching 3, 7, 14, 30, 50, 100 days in a row
//   - days ahead of schedule: getting 3, 7, 14, 30 scheduled days ahead
//
// Following the pattern popular habit apps use (e.g. Duolingo only fires its
// big animation at landmark streaks), the rarer/bigger milestones get a
// full-screen confetti celebration ("major") while the smaller, more frequent
// ones get a lightweight toast ("minor"). This keeps the big moments special.

import { createT } from '../i18n/translate'

export const PERCENT_MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100]
export const DAYS_AHEAD_MILESTONES = [3, 7, 14, 30]

const MAJOR_PERCENT = new Set([50, 100])
const MAJOR_STREAK = new Set([7, 30, 100])
const MAJOR_DAYS_AHEAD = new Set([7, 30])

// Empty "nothing shown yet" record.
export function emptyShownMilestones() {
  return { percent: [], streak: [], daysAhead: [] }
}

// All milestones that the given metrics currently satisfy.
export function achievedMilestones({ percent = 0, streak = 0, daysAhead = 0 }) {
  return {
    percent: PERCENT_MILESTONES.filter(m => percent >= m),
    streak: STREAK_MILESTONES.filter(m => streak >= m),
    daysAhead: DAYS_AHEAD_MILESTONES.filter(m => daysAhead >= m)
  }
}

// Union of an existing shown record with a freshly achieved record.
export function mergeShown(shown, achieved) {
  const base = { ...emptyShownMilestones(), ...(shown || {}) }
  const uniq = (a = [], b = []) => Array.from(new Set([...a, ...b])).sort((x, y) => x - y)
  return {
    percent: uniq(base.percent, achieved.percent),
    streak: uniq(base.streak, achieved.streak),
    daysAhead: uniq(base.daysAhead, achieved.daysAhead)
  }
}

function tierFor(type, value) {
  if (type === 'percent') return MAJOR_PERCENT.has(value) ? 'major' : 'minor'
  if (type === 'streak') return MAJOR_STREAK.has(value) ? 'major' : 'minor'
  if (type === 'daysAhead') return MAJOR_DAYS_AHEAD.has(value) ? 'major' : 'minor'
  return 'minor'
}

// Title and message in the reader's language; milestones without their own
// message get a generic one.
function rewardText(type, value, language) {
  const t = createT(language)
  const milestones = { percent: PERCENT_MILESTONES, streak: STREAK_MILESTONES, daysAhead: DAYS_AHEAD_MILESTONES }[type]
  const title = type === 'percent' && value === 100
    ? t('reward.percent.done')
    : t(`reward.${type}.title`, { n: value })
  const message = milestones.includes(value)
    ? t(`reward.${type}.${value}`)
    : t(`reward.${type}.other`, { n: value })
  return { title, message }
}

export function buildReward(type, value, language = 'en') {
  const tier = tierFor(type, value)
  const { title, message } = rewardText(type, value, language)
  if (type === 'percent') {
    return {
      id: `percent-${value}`,
      type,
      value,
      tier,
      icon: value === 100 ? 'trophy' : 'medal',
      title,
      message
    }
  }
  if (type === 'streak') {
    return {
      id: `streak-${value}`,
      type,
      value,
      tier,
      icon: 'flame',
      title,
      message
    }
  }
  // daysAhead
  return {
    id: `daysAhead-${value}`,
    type,
    value,
    tier,
    icon: 'rocket',
    title,
    message
  }
}

/**
 * Detect newly-earned rewards by diffing the metrics' achieved milestones
 * against what's already been shown.
 *
 * @param {string} language - Reader's language for the reward text
 * @returns {{ rewards: Array, shownMilestones: Object }}
 */
export function detectRewards(metrics, shown, language = 'en') {
  const achieved = achievedMilestones(metrics)
  const prior = { ...emptyShownMilestones(), ...(shown || {}) }

  const rewards = []
  for (const value of achieved.percent) {
    if (!prior.percent.includes(value)) rewards.push(buildReward('percent', value, language))
  }
  for (const value of achieved.streak) {
    if (!prior.streak.includes(value)) rewards.push(buildReward('streak', value, language))
  }
  for (const value of achieved.daysAhead) {
    if (!prior.daysAhead.includes(value)) rewards.push(buildReward('daysAhead', value, language))
  }

  return {
    rewards,
    shownMilestones: mergeShown(prior, achieved)
  }
}
