import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// O base é injetado pelo workflow de deploy (VITE_BASE=/<repo>/) para o
// GitHub Pages funcionar em subpasta. Localmente (npm run dev) usa '/'.
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE || '/'
})
