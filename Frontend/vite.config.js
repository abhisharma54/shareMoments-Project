import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config('/.env')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `${process.env.VITE_BE_API_URL}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})
