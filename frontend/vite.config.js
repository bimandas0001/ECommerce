import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Set relative paths for assets (added by me).
  plugins: [react()],
})
