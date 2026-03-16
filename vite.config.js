import { defineConfig } from 'vite'
import react from '@vitejs/react-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // <--- AGREGA ESTA LÍNEA EXACTAMENTE ASÍ
})