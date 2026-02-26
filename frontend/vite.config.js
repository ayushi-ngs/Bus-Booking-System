import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * IMPORTANT:
 * Your Spring Boot backend runs on http://localhost:8080
 * We proxy /api -> backend so there is NO CORS issue and cookies/sessions work.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
