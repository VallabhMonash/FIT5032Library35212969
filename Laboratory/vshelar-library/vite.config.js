import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Cloudflare Pages sets CF_PAGES=1 during build.
// If CF_PAGES is not set, we assume GitHub Pages and use the repo subpath.
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  base: process.env.CF_PAGES === '1' ? '/' : '/FIT5032Library35212969/',
})
