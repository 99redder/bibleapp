import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Clean up old caches on activate
        cleanupOutdatedCaches: true,
        // Skip waiting - activate new service worker immediately
        skipWaiting: true,
        // Claim clients immediately
        clientsClaim: true,
        // Cache strategies
        runtimeCaching: [
          {
            // Local Bible chapter data - cache first for offline-friendly reading
            urlPattern: /\/bibles\/WEB\/.+\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-data-cache',
              expiration: {
                maxEntries: 1300,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            // Firebase - network only (auth, firestore)
            urlPattern: /^https:\/\/.*\.firebase.*\.com\//,
            handler: 'NetworkOnly'
          }
        ]
      },
      manifest: {
        name: 'Bible Reading Plan',
        short_name: 'Bible Plan',
        description: 'A personalized Bible reading plan app',
        theme_color: '#4f46e5',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: '/',
  server: {
    port: 3000,
    open: true
  }
})
