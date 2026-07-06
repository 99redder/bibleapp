import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      workbox: {
        // Clean up old caches on activate
        cleanupOutdatedCaches: true,
        // Let the browser preload navigation requests while the service worker starts.
        navigationPreload: true,
        // Cache strategies
        runtimeCaching: [
          {
            // Local Bible chapter data - cache first for offline-friendly reading
            urlPattern: /\/bibles\/[^/]+\/.+\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-data-cache',
              expiration: {
                maxEntries: 12000,
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
