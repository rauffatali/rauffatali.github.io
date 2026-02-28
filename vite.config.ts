import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1000, // Three.js is a large library (unavoidable)
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-drei': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom', 'react-scroll'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  publicDir: 'public',
})
