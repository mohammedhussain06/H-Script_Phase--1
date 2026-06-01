import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    fs: { allow: ['..'] },   // Allow imports from parent (H-Script src/)
    proxy: {
      '/api':  'http://localhost:5000',
      '/auth': 'http://localhost:5000',
    }
  },
  resolve: {
    alias: {
      // Mock Node built-ins that H-Script's interpreter uses
      'fs':   fileURLToPath(new URL('./src/runtime/fs-mock.js',   import.meta.url)),
      'path': fileURLToPath(new URL('./src/runtime/path-mock.js', import.meta.url)),
    }
  },
  optimizeDeps: {
    // Let Vite pre-bundle the CommonJS H-Script source files
    include: [],
  }
})
