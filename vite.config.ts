import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for docker
    port: 4000,
    watch: {
      usePolling: true // Needed for docker on Windows/macOS
    }
  }
})