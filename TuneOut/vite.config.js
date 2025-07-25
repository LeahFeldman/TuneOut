import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // ✅ This enables global functions like `expect`
    setupFiles: './src/setupTest.js',
  },
});
