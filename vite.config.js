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
        name: 'foursquare-proxy',
        configureServer(server) {
          server.middlewares.use('/api/foursquare', async (req, res) => {
            const query = req.url.startsWith('?') ? req.url.slice(1) : req.url.replace(/^[^?]*\?/, '');
            const fsqUrl = `https://places-api.foursquare.com/places/search?${query}`;

            const response = await fetch(fsqUrl, {
              headers: {
                Authorization: `Bearer ${env.VITE_FOURSQUARE_API_KEY}`,
                Accept: 'application/json',
                'X-Places-Api-Version': '2025-06-17',
              },
            });

            const data = await response.json();
            res.writeHead(response.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          });
        },
      },
    ],
  }
})
