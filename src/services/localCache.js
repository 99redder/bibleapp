const CACHE_PREFIX = 'biblePlanner'
const CACHE_VERSION = 1

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.version === CACHE_VERSION ? parsed.value : null
  } catch {
    return null
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({
      version: CACHE_VERSION,
      savedAt: Date.now(),
      value
    }))
  } catch {
    // Ignore storage quota/private-mode failures. Network data still works.
  }
}

function userKey(uid, name) {
  return `${CACHE_PREFIX}:${uid}:${name}`
}

export function getCachedUserDoc(uid) {
  if (!uid) return null
  return readJson(userKey(uid, 'userDoc'))
}

export function setCachedUserDoc(uid, userDoc) {
  if (!uid || !userDoc) return
  writeJson(userKey(uid, 'userDoc'), userDoc)
}

export function clearCachedUserDoc(uid) {
  if (!uid) return
  try {
    localStorage.removeItem(userKey(uid, 'userDoc'))
  } catch {
    // ignore
  }
}

export function getCachedDashboard(uid) {
  if (!uid) return null
  return readJson(userKey(uid, 'dashboard'))
}

export function setCachedDashboard(uid, dashboardState) {
  if (!uid || !dashboardState) return
  writeJson(userKey(uid, 'dashboard'), dashboardState)
}

export function clearCachedDashboard(uid) {
  if (!uid) return
  try {
    localStorage.removeItem(userKey(uid, 'dashboard'))
  } catch {
    // ignore
  }
}
