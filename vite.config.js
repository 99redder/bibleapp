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
            // API calls - network first, fall back to cache
            urlPattern: /^https:\/\/rest\.api\.bible\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bible-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
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
        start_url: '/BibleApp/',
        scope: '/BibleApp/',
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
  base: '/BibleApp/',
  server: {
    port: 3000,
    open: true
  }
})
