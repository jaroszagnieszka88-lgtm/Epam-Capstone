import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'

export default defineConfig({
  root: 'src',
  server: {
    port: 3000
  },
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [
    ViteEjsPlugin({
      title: 'Best Shop'
    })
  ]
})