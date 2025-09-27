// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: '/deepsya/', // Важно: название твоего репозитория
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});