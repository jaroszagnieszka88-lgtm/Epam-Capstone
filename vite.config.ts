import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'

const htmlRoutes = ['about', 'catalog', 'cart', 'contact']

export default defineConfig({
  root: 'src',
  plugins: [
    ViteEjsPlugin(),
    {
      name: 'html-route-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const request = req as { url?: string }
          const url = request.url ?? ''
          const pathname = url.split('?')[0]
          if (!pathname || pathname === '/' || pathname.includes('.') || pathname === '/index.html') {
            return next()
          }

          const routeName = pathname.slice(1)
          if (htmlRoutes.includes(routeName)) {
            request.url = `/html/${routeName}.html${url.slice(pathname.length)}`
          }
          next()
        })
      }
    }
  ],
  server: {
    port: 3000
  },
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'html/about.html',
        catalog: 'html/catalog.html',
        cart: 'html/cart.html',
        contact: 'html/contact.html'
      }
    }
  }
})