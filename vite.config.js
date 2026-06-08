import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  optimizeDeps: {
    exclude: ['@loradb/lora-wasm'],
  },
  worker: {
    format: 'es',
  },
})
