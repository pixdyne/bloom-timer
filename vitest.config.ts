import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Plan 1 scope: pure logic + utilities only.
      // UI components (BrewTimer, FullscreenTimer) and browser-API wrappers
      // (useWakeLock, audio) are exercised by E2E tests in Plan 4.
      include: ['src/lib/**/*.ts', 'src/hooks/**/*.ts'],
      exclude: [
        '**/*.d.ts',
        '**/types.ts',
        'src/data/**',
        'src/hooks/useWakeLock.ts',
        'src/lib/audio.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
