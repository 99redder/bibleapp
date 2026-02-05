import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import * as admin from 'firebase-admin'

const API_BASE = 'https://rest.api.bible/v1'
const BIBLE_API_KEY = defineSecret('BIBLE_API_KEY')

if (!admin.apps.length) {
  admin.initializeApp()
}

export const bibleApi = onRequest(
  {
    region: 'us-central1',
    cors: true,
    secrets: [BIBLE_API_KEY]
  },
  async (req, res) => {
    try {
      // Require Firebase Auth
      const authHeader = req.get('authorization') || ''
      const match = authHeader.match(/^Bearer\s+(.+)$/i)
      const idToken = match?.[1]
      if (!idToken) {
        res.status(401).json({ error: 'Missing Authorization bearer token' })
        return
      }

      try {
        await admin.auth().verifyIdToken(idToken)
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
      const rawPath = (req.path || '').replace(/^\/+/, '')
      const path = rawPath.replace(/^api\/bible\/?/, '')

      if (!path) {
        res.status(400).json({ error: 'Missing API path' })
        return
      }

      // Forward querystring as-is
      const url = new URL(`${API_BASE}/${path}`)
      for (const [k, v] of Object.entries(req.query || {})) {
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
