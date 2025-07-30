import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  // Configure Vitest (https://vitest.dev/config/)
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});
