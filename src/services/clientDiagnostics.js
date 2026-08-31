import { saveClientDiagnostic } from './firebase'

const DIAGNOSTIC_VERSION = 1
const KEY_PREFIX = 'biblePlanner'
const MAX_PENDING_DIAGNOSTICS = 20

function diagnosticKey(uid) {
  return `${KEY_PREFIX}:${uid}:clientDiagnostics`
}

function readDiagnostics(uid) {
  if (!uid) return []
  try {
    const raw = localStorage.getItem(diagnosticKey(uid))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed?.version === DIAGNOSTIC_VERSION && Array.isArray(parsed.entries)
      ? parsed.entries
      : []
  } catch {
    return []
  }
}

function writeDiagnostics(uid, entries) {
  try {
    localStorage.setItem(diagnosticKey(uid), JSON.stringify({
      version: DIAGNOSTIC_VERSION,
      entries: entries.slice(-MAX_PENDING_DIAGNOSTICS)
    }))
  } catch {
    // Diagnostics must never interfere with the reading experience.
  }
}

export function recordClientDiagnostic(uid, error, { operation, dayNumber } = {}) {
  if (!uid) return
  const entries = readDiagnostics(uid)
  entries.push({
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    operation: String(operation || 'unknown').slice(0, 80),
    dayNumber: Number.isInteger(dayNumber) ? dayNumber : null,
    code: String(error?.code || 'unknown').slice(0, 100),
    message: String(error?.message || error || 'Unknown client error').slice(0, 500),
    online: navigator.onLine,
    occurredAt: new Date().toISOString(),
    userAgent: navigator.userAgent.slice(0, 300)
  })
  writeDiagnostics(uid, entries)
}

export async function flushClientDiagnostics(uid) {
  if (!uid || !navigator.onLine) return
  const entries = readDiagnostics(uid)
  if (!entries.length) return

  const remaining = [...entries]
  for (const entry of entries) {
    try {
      await saveClientDiagnostic(uid, entry)
      remaining.shift()
      writeDiagnostics(uid, remaining)
    } catch {
      break
    }
  }
}

