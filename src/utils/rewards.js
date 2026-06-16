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

const PERCENT_MESSAGES = {
  10: 'You’re off to a strong start. Keep the momentum going!',
  20: 'One-fifth of the way through. Steady and faithful.',
  30: 'Almost a third done — you’re building a real habit.',
  40: 'Closing in on the halfway mark. Well done!',
  50: 'Halfway there! You’ve come so far — finish strong.',
  60: 'Past the midpoint and climbing. Keep it up!',
  70: 'Seventy percent complete. The finish line is in sight.',
  80: 'Eighty percent! Only a little further to go.',
  90: 'Ninety percent — the home stretch. You’ve got this!',
  100: 'You did it! You’ve read all the way through. Congratulations!'
}

const STREAK_MESSAGES = {
  3: 'Three days in a row — a habit is forming!',
  7: 'A full week of reading! Your dedication is paying off.',
  14: 'Two weeks straight. That’s real consistency.',
  30: 'Thirty days in a row — an incredible month of faithfulness!',
  50: 'Fifty days straight. You’re unstoppable!',
  100: 'One hundred days in a row. What an amazing commitment!'
}

const DAYS_AHEAD_MESSAGES = {
  3: 'You’re three days ahead of schedule — nicely done!',
  7: 'A whole week ahead of schedule. Look at you go!',
  14: 'Two weeks ahead — you’re flying through it!',
  30: 'A month ahead of schedule. Truly remarkable pace!'
}

export function buildReward(type, value) {
  const tier = tierFor(type, value)
  if (type === 'percent') {
    return {
      id: `percent-${value}`,
      type,
      value,
      tier,
      icon: value === 100 ? 'trophy' : 'medal',
      title: value === 100 ? 'Plan Complete!' : `${value}% Complete`,
      message: PERCENT_MESSAGES[value] || `You’ve completed ${value}% of your plan!`
    }
  }
  if (type === 'streak') {
    return {
      id: `streak-${value}`,
      type,
      value,
      tier,
      icon: 'flame',
      title: `${value}-Day Streak!`,
      message: STREAK_MESSAGES[value] || `${value} days in a row!`
    }
  }
  // daysAhead
  return {
    id: `daysAhead-${value}`,
    type,
    value,
    tier,
    icon: 'rocket',
    title: `${value} Days Ahead`,
    message: DAYS_AHEAD_MESSAGES[value] || `You’re ${value} days ahead of schedule!`
  }
}

/**
 * Detect newly-earned rewards by diffing the metrics' achieved milestones
 * against what's already been shown.
 *
 * @returns {{ rewards: Array, shownMilestones: Object }}
 */
export function detectRewards(metrics, shown) {
  const achieved = achievedMilestones(metrics)
  const prior = { ...emptyShownMilestones(), ...(shown || {}) }

  const rewards = []
  for (const value of achieved.percent) {
    if (!prior.percent.includes(value)) rewards.push(buildReward('percent', value))
  }
  for (const value of achieved.streak) {
    if (!prior.streak.includes(value)) rewards.push(buildReward('streak', value))
  }
  for (const value of achieved.daysAhead) {
    if (!prior.daysAhead.includes(value)) rewards.push(buildReward('daysAhead', value))
  }

  return {
    rewards,
    shownMilestones: mergeShown(prior, achieved)
  }
}
