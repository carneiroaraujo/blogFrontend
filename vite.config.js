import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// console.log(process.env.API_URL)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },

})