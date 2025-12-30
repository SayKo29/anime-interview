import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'tests/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/types/**'
      ]
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname),
      '@': resolve(__dirname)
    }
  }
});
