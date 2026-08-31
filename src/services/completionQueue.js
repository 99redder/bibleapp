const QUEUE_VERSION = 1
const KEY_PREFIX = 'biblePlanner'

function queueKey(uid) {
  return `${KEY_PREFIX}:${uid}:pendingCompletions`
}

export function getPendingCompletions(uid) {
  if (!uid) return []
  try {
    const raw = localStorage.getItem(queueKey(uid))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (parsed?.version !== QUEUE_VERSION || !Array.isArray(parsed.entries)) return []
    return parsed.entries
      .filter(entry => Number.isInteger(entry?.dayNumber) && typeof entry?.completedAt === 'string')
      .sort((a, b) => a.completedAt.localeCompare(b.completedAt))
  } catch {
    return []
  }
}

function savePendingCompletions(uid, entries) {
  try {
    localStorage.setItem(queueKey(uid), JSON.stringify({
      version: QUEUE_VERSION,
      entries
    }))
    return true
  } catch {
    return false
  }
}

export function enqueueCompletion(uid, dayNumber, completedAt = new Date()) {
  const entries = getPendingCompletions(uid)
  const existing = entries.find(entry => entry.dayNumber === dayNumber)
  if (existing) return entries

  const entry = {
    dayNumber,
    completedAt: completedAt.toISOString(),
    queuedAt: new Date().toISOString()
  }
  const updated = [...entries, entry].sort((a, b) => a.completedAt.localeCompare(b.completedAt))
  if (!savePendingCompletions(uid, updated)) {
    throw new Error('Unable to save the pending completion on this device')
  }
  return updated
}

export function removePendingCompletion(uid, dayNumber) {
  const updated = getPendingCompletions(uid).filter(entry => entry.dayNumber !== dayNumber)
  savePendingCompletions(uid, updated)
  return updated
}

export function clearPendingCompletions(uid) {
  if (!uid) return
  try {
    localStorage.removeItem(queueKey(uid))
  } catch {
    // Ignore storage failures; the reset itself is still authoritative.
  }
}
