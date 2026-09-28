import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/api'),
      '@tech-inject/types': path.resolve(__dirname, './packages/types/src'),
      '@tech-inject/validation': path.resolve(__dirname, './packages/validation/src'),
      '@tech-inject/ui': path.resolve(__dirname, './packages/ui/src'),
    },
  },
});
