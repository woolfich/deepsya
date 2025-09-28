// vite.config.js
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Для разработки используем корень, для продакшена - /deepsya/
  const base = mode === 'development' ? '/' : '/deepsya/';

  return {
    plugins: [tailwindcss(), preact()],
    base,
    build: { 
      outDir: 'dist',
      // Добавляем для корректной работы PWA
      assetsInlineLimit: 4096,
    }
  }
})