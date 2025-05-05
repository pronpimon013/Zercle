import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  // ตรวจสอบว่า CSS ถูกประมวลผลอย่างถูกต้อง
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true
  }
})