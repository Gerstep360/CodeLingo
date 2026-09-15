import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  plugins: [react()],
  server: { proxy: { '/api': { target: process.env.CODELINGO_API_PROXY || 'http://127.0.0.1:8000', changeOrigin: true, cookieDomainRewrite: '', cookiePathRewrite: '/' } } },
})
