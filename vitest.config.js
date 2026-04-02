import { defineConfig } from 'vitest/config';

export default defineConfig({
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./tests/setup.mjs'],
  include: ['tests/**/*.test.js'],
  reporters: ['default']
});
