import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAppCheck } from 'firebase-admin/app-check'
import { getAuth } from 'firebase-admin/auth'

const API_BASE = 'https://rest.api.bible/v1'
const BIBLE_API_KEY = defineSecret('BIBLE_API_KEY')
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 60
const rateLimits = new Map()
const allowedQueryParams = new Set([
  'content-type',
  'include-notes',
  'include-titles',
  'include-chapter-numbers',
  'include-verse-numbers',
  'include-verse-spans',
  'parallels',
  'fums-id'
])
const apiPathPatterns = [
  /^bibles\/[A-Za-z0-9.-]+\/books$/,
  /^bibles\/[A-Za-z0-9.-]+\/chapters\/[A-Za-z0-9.-]+$/,
  /^bibles\/[A-Za-z0-9.-]+\/passages\/[A-Za-z0-9.-]+$/,
  /^bibles\/[A-Za-z0-9.-]+\/verses\/[A-Za-z0-9.-]+$/
]

if (!getApps().length) {
  initializeApp()
}

function getClientIp(req) {
  const forwardedFor = req.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return req.ip || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const current = rateLimits.get(ip)

  if (!current || current.resetTime <= now) {
    rateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  current.count += 1
  return false
}

function normalizeApiPath(path) {
  return String(path || '')
    .replace(/^\/+/, '')
    .replace(/^api\/bible\/?/, '')
    .replace(/^v1\//, '')
}

function isAllowedApiPath(path) {
  return apiPathPatterns.some(pattern => pattern.test(path))
}

export const bibleApi = onRequest(
  {
    region: 'us-central1',
    cors: ['https://www.bibleplannerapp.com', 'http://localhost:3000'],
    secrets: [BIBLE_API_KEY]
  },
  async (req, res) => {
    try {
      const clientIp = getClientIp(req)
      if (isRateLimited(clientIp)) {
        res.status(429).send('Too many requests')
        return
      }

      // Require Firebase App Check. App Check enforcement must also be enabled in the Firebase Console.
      const appCheckToken = req.headers['x-firebase-appcheck']
      if (!appCheckToken) {
        res.status(401).json({ error: 'Missing App Check token' })
        return
      }

      try {
        await getAppCheck().verifyToken(appCheckToken)
      } catch {
        res.status(401).json({ error: 'Invalid App Check token' })
        return
      }

      // Require Firebase Auth
      const authHeader = req.get('authorization') || ''
      const match = authHeader.match(/^Bearer\s+(.+)$/i)
      const idToken = match?.[1]
      if (!idToken) {
        res.status(401).json({ error: 'Missing Authorization bearer token' })
        return
      }

      try {
        await getAuth().verifyIdToken(idToken)
      } catch {
        res.status(401).json({ error: 'Invalid auth token' })
        return
      }

      const apiKey = BIBLE_API_KEY.value()
      if (!apiKey) {
        res.status(500).json({ error: 'Server not configured: missing BIBLE_API_KEY' })
        return
      }

      // Expected path: /api/bible/<...>
      // Example: /api/bible/bibles/{id}/chapters/{passageId}
      // Equivalent upstream whitelist: /v1/bibles/{bibleId}/books,
      // /v1/bibles/{bibleId}/chapters/{chapterId},
      // /v1/bibles/{bibleId}/passages/{passageId},
      // /v1/bibles/{bibleId}/verses/{verseId}
      const rawPath = req.query?.path || req.path || ''
      const path = normalizeApiPath(rawPath)

      if (!path) {
        res.status(400).json({ error: 'Missing API path' })
        return
      }

      if (!isAllowedApiPath(path)) {
        res.status(400).send('Invalid API path')
        return
      }

      // Forward only API.Bible query params that this proxy explicitly supports.
      const url = new URL(`${API_BASE}/${path}`)
      for (const [k, v] of Object.entries(req.query || {})) {
        if (!allowedQueryParams.has(k)) {
          continue
        }

        if (Array.isArray(v)) {
          v.forEach(val => url.searchParams.append(k, String(val)))
        } else if (v !== undefined) {
          url.searchParams.set(k, String(v))
        }
      }

      const upstream = await fetch(url.toString(), {
        headers: {
          'api-key': apiKey
        }
      })

      const text = await upstream.text()
      res.status(upstream.status)
      // Keep JSON when possible
      const contentType = upstream.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        res.set('content-type', contentType)
        res.send(text)
      } else {
        res.set('content-type', 'text/plain')
        res.send(text)
      }
    } catch (err) {
      console.error('bibleApi error', err)
      res.status(500).json({ error: 'Internal error' })
    }
  }
)
