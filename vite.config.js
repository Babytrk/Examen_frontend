import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <--- DEBE SER ASÍ

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Mantén esto para solucionar lo de la pantalla blanca
})