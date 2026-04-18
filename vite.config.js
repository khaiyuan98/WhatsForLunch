import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: "What's for Lunch?",
          short_name: 'Lunch?',
          description: 'Spin the wheel, pick a nearby restaurant.',
          theme_color: '#f59e0b',
          background_color: '#fffbeb',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
      {
        name: 'google-places-proxy',
        configureServer(server) {
          server.middlewares.use('/api/google-places', async (req, res) => {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', async () => {
              const body = Buffer.concat(chunks).toString();
              const fieldMask = req.headers['x-goog-fieldmask'] || '';

              const response = await fetch(
                'https://places.googleapis.com/v1/places:searchNearby',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
                    'X-Goog-FieldMask': fieldMask,
                  },
                  body,
                }
              );

              const data = await response.json();
              res.writeHead(response.status, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            });
          });
        },
      },
    ],
  }
})
