import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: 'WhatsForLunch',
  server: {
    proxy: {
      '/api/foursquare': {
        target: 'https://places-api.foursquare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/foursquare/, ''),
      },
    },
  },
})
