import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:"/UpTask_MERN_frontend/",
  plugins: [react()]
})
