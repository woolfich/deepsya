import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), preact()],
  base: '/deepsya/',
  build: { outDir: 'dist' }
})