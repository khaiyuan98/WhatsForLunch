import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
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
