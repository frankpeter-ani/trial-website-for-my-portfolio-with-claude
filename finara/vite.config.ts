import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from /<repo>/, so the base is injected
  // at build time. Defaults to '/' for local dev and root-hosted deploys.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})
