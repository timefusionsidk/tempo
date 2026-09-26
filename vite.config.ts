import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Tempo — Timer & Stopwatch',
        short_name: 'Tempo',
        description: 'A fast, focused timer and stopwatch. Free, private, and works offline.',
        theme_color: '#F7F5F0',
        background_color: '#F7F5F0',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache the app shell only. No personal data ever passes through the
        // service worker — timers, settings, and lap history stay in localStorage
        // on the user's device.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: []
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  server: {
    port: 5173
  }
})
