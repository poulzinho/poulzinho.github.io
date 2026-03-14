/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './config/vitest/setup.ts',
    exclude: [...configDefaults.exclude, 'dist'],
  },
})
