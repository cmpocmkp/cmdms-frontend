import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ✅ Required for Railway Vite Preview
  preview: {
    host: true,              // allow external access
    port: 8080,              // must match Railway port
    allowedHosts: [
      ".railway.app",        // allow all Railway generated domains
      ".up.railway.app"      // allow subdomains like xxx.up.railway.app
    ]
  }
})
