import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  server: {
    port: 3000
  },
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})