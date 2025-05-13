import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: '/tests/setup.ts',
    coverage: {
      all: true, // include all files, not just those imported in tests
      reporter: ['text', 'json', 'html'], // terminal + HTML report
      reportsDirectory: './coverage', // where to save reports
      include: ['src/**/*.{ts,tsx}'], // include these files
      exclude: ['**/tests/**', '**/*.d.ts'], // optional: skip test files and types
    },
  },
})
